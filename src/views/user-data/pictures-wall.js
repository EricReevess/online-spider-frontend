import { Upload, Modal } from 'antd'
import React, {  useState, useImperativeHandle, forwardRef} from 'react'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { deleteImageRequest } from '../../api'
import { BASE_IMG_URL } from '../../config/path-config'

let PicturesWall =  (props) => {
  const { fileRef } = props
  const [previewVisible, setPreviewVisible,] = useState(false)
  const [previewImage, setPreviewImage,] = useState('')
  const [previewTitle, setPreviewTitle,] = useState('')
  const [fileList, setFileList,] = useState(()=> props.imgs.length ?
    props.imgs.map((imgName, index) => ({
      uid: -index ,
      name:imgName,
      url:BASE_IMG_URL + imgName,
      status: 'done'
    })) : []
  )
  const  getBase64 = (file) =>  {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  useImperativeHandle(fileRef, () => ({
    getImagesName:() => fileList.map(file => file.name),
    setFileList,
  }))

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  const handleUploadCancel = () => {
    setPreviewVisible(false)
  }

  const handlePreview = async file => {
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleFileChange = async ({ file, fileList }) => {
    console.log(fileList)
    let result
    if (file.status === 'done'){
      result = file.response
      if (result.status === 0){
        message.success('图片上传成功')
        const {name, url} = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('图片上传失败，请重试')
      }
    } else if (file.status === 'removed'){
      result = await deleteImageRequest(file.name)
      console.log(result)
      if (result.data.status === 0){
        message.success('图片已删除')
      } else {
        message.error('删除图片失败')
      }
    }
    setFileList(fileList)
  }
  return (
    <div>
      <Upload

        action="/manage/img/upload"
        listType="picture-card"
        accept="image/*"
        name="image"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleFileChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        footer={null}
        visible={previewVisible}
        title={previewTitle}
        onCancel={handleUploadCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
  </div>)

}
PicturesWall.defaultProps = {
  imgs:[]
}
PicturesWall.propTypes = {
  imgs:PropTypes.array
}

const PicturesWallRef = forwardRef((props, ref) => (
  <PicturesWall {...props}  fileRef={ref} />
));

export default PicturesWallRef
