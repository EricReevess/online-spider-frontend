import React from 'react'
import { Button, Drawer, Image, List } from 'antd'
import './user-data-detail.less'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../config/path-config'

const { Item } = List
const UserDataDetail = (props) => {


  return (<Drawer
    title="商品详情"
    width={720}
    destroyOnClose
    maskClosable={false}
    onClose={props.onClose}
    visible={props.drawerVisible}
    footer={<Button onClick={props.onClose} style={{ marginRight: 8 }}>
      关闭
    </Button>}
  >
    <List className="product-detail">
      <Item className="item">
        <span className="title">商品名称:</span>
        <span>{props.productDetailInfo.name}</span>
      </Item>
      <Item className="item">
        <span className="title">商品描述:</span>
        <span>{props.productDetailInfo.desc}</span>
      </Item>
      <Item className="item">
        <span className="title">商品价格:</span>
        <span>{props.productDetailInfo.price}</span>
      </Item>
      <Item className="item">
        <span className="title">所属分类:</span>
        <span>
          {
            props.productDetailInfo.pCategoryName ?
            props.productDetailInfo.pCategoryName + ' / ' : null
          }
          {props.productDetailInfo.categoryName}
        </span>
      </Item>
      <Item className="item">
        <span className="title">商品图片:</span>
        {
          props.productDetailInfo.imgs ?
          props.productDetailInfo.imgs.map(item => (
            <Image key={item} width={200} src={BASE_IMG_URL + item} />
          )) : null
        }
      </Item>
      <Item className="item">
        <span className="title">商品详情:</span>
        <span>{props.productDetailInfo.detail}</span>
      </Item>
    </List>

  </Drawer>)

}
UserDataDetail.propTypes = {
  productDetailInfo: PropTypes.object.isRequired,
  onClose:PropTypes.func.isRequired,
  drawerVisible:PropTypes.bool.isRequired
}
export default UserDataDetail
