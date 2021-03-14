import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Drawer, Form, Button, Col, Row, Input, message } from 'antd'
import PropTypes from 'prop-types'
import { addProductRequest, updateProductRequest } from '../../api/'
import PicturesWall from './pictures-wall'
const { TextArea } = Input

let UserDataAddUpdate = ({ onClose,
                          drawerVisible,
                          confirmLoading,
                          setConfirmLoading,
                          getProductList,
                          currentPageNum,
                          updateRef }) => {
  const fileRef = useRef(null)
  const [productId, setProductId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState([])
  const [price, setPrice] = useState(0)
  const [detail, setDetail] = useState('')
  const [imgs, setImgs] = useState([])
  const [submitType, setSubmitType] = useState('add')

  useImperativeHandle(updateRef, () => ({
    setProductInfo,
    setSubmitType
  }))

  const getFileName = () => fileRef.current.getImagesName()

  // 更新Product
  const setProductInfo = (render) => {
    let category
    const {_id,name, desc,pCategoryId, categoryId,price, detail, imgs } = render
    if (pCategoryId === '0'){
      category = [categoryId]
    }else if (categoryId) {
      category = [pCategoryId, categoryId]
    } else {
      category = undefined
    }
    setProductId(_id)
    setName(name)
    setDescription(desc)
    setPrice(price)
    setDetail(detail)
    setImgs(imgs)
    setCategory(category)
  }

  // 提交信息
  const handleSubmit = async values => {
    setConfirmLoading(true)
    const imgs = getFileName()
    const categoryId = values.category[values.category.length -1]
    const pCategoryId = values.category[values.category.length -2] || 0
    const {name,price,desc,detail} = values

    if (submitType === 'add'){
      const newProductInfo = {
        categoryId,
        pCategoryId,
        name,
        price,
        desc,
        detail,
        imgs
      }
      const {data:result} = await addProductRequest(newProductInfo)
      if (result.status === 0){
        message.success('添加成功')
        onClose()
        getProductList(currentPageNum)
      } else {
        message.error('添加失败，请重试')
        setConfirmLoading(false)
      }
    } else {
      const editedProductInfo = {
        productId,
        categoryId,
        pCategoryId,
        name,
        price,
        desc,
        detail,
        imgs
      }
      const { data:result } = await updateProductRequest(editedProductInfo)
      if (result.status === 0){
        message.success('商品信息修改成功')
        onClose()
        getProductList(currentPageNum)
      } else {
        message.error('商品信息修改失败，请重试')
        setConfirmLoading(false)
      }
    }
  }



  return (<Drawer
    title={submitType === 'add' ? '新增商品' : '修改商品'}
    width={720}
    destroyOnClose
    maskClosable={false}
    onClose={onClose}
    visible={drawerVisible}
    bodyStyle={{ paddingBottom: 80 }}
  >
    <Form layout="vertical"
          name="add-update-product"

          onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="商品名称"
            initialValue={name}
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input
              value={name}
              onChange={(event => {setName(event.target.value)})}
              placeholder="请输入商品名称"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="desc"
            label="商品描述"
            initialValue={description}
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <TextArea
              value={description}
              onChange={(event => {setDescription(event.target.value)})}
              autoSize={{ minRows: 1, maxRows: 6 }}
              placeholder="请输入商品描述"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="price"
            label="商品价格"
            initialValue={price}
            rules={[{
              required: true, message: '请输入价格'
            }, {
              pattern: /^\d+$/, message: '请输入正确的价格'
            }]}
          >
            <Input
              placeholder="请输入价格"
              value={price}
              onChange={e => {setPrice(Number(e.target.value))}}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="category"
            label="商品分类"
            initialValue={category}
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="imgs"
            label="商品图片"
          >
            <PicturesWall imgs={imgs} ref={fileRef}  />

          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="detail"
            label="商品详情"
            initialValue={detail}
            rules={[{
              required: true, message: '请输入商品详情',
            },]}
          >
            <TextArea
              value={detail}
              onChange={(event => {setDetail(event.target.value)})}
              rows={4}
              placeholder="请输入商品详情"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item>
            <Button loading={confirmLoading} htmlType="submit" style={{ marginRight: 8 }} type="primary">
              提交
            </Button>

            <Button onClick={onClose} >
              取消
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Drawer>)

}
UserDataAddUpdate.propTypes = {
  onClose: PropTypes.func.isRequired,
  drawerVisible: PropTypes.bool.isRequired,
  confirmLoading: PropTypes.bool.isRequired,
  setConfirmLoading: PropTypes.func.isRequired,
  getProductList: PropTypes.func.isRequired,
  currentPageNum:PropTypes.number.isRequired,
/*
  loadCategoryData:PropTypes.func.isRequired
*/

}


const ProductAddUpdateRef = forwardRef((props, ref) => (
  <UserDataAddUpdate {...props} updateRef={ref} />
));

export default ProductAddUpdateRef
