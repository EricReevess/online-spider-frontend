import React, { useEffect, useState, useMemo } from 'react'
import cookies from 'react-cookies'
import { Button, Card, Space, Table, message, Modal, Checkbox, Divider } from 'antd'
import { cancel, deleteUserGrabRequest, userRequestList,getExcelTableData } from '../../api'
import {newsSource, newsCategories} from '../../config/news-category-config'
import UserDataDetail from './user-data-detail'
import ExportExcel from './export-excel'

const CheckboxGroup = Checkbox.Group

const tableColumns = [
	{
		title: '标题',
		dataIndex: 'title',
	},
	{
		title: '分类',
		dataIndex: 'category',
	},
	{
		title: '作者',
		dataIndex: 'media',
	},
	{
		title: '关键词',
		dataIndex: 'keywords',
	},
	{
		title: '标签',
		dataIndex: 'tags',
	},
	{
		title: 'URL',
		dataIndex: 'url',
	},
	{
		title: '发布时间',
		dataIndex: 'publish_time',
	},
	{
		title: '新闻内容',
		dataIndex: 'newsContentArray',
	},
]
const options = tableColumns.map((elem) => ({
	label: elem.title,
	value: elem.dataIndex,
}))
const defaultValue = options.map((elem) => elem.value)

const UserDataList = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
	const [requestList, setRequestList] = useState([])
	const [currentGrabDataId, setCurrentGrabDataId] = useState('')
	const [total, setTotal] = useState(0)
	//const [searchType, setSearchType] = useState('productName')
	const [currentPageNum, setCurrentPageNum] = useState(1)
	const [currentRequest, setCurrentRequest] = useState('')
	const [deleteVisible, setDeleteVisible] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [checkedList, setCheckedList] = useState(defaultValue)
	const [indeterminate, setIndeterminate] = React.useState(false)
	const [checkAll, setCheckAll] = React.useState(true)

	const getGrabResultData = (grabbedDataId) => {
		setDetailDrawerVisible(true)
		setCurrentGrabDataId(grabbedDataId)
	}

	const getRequestList = async (pageNum = 1) => {
		setCurrentPageNum((prevState) => (prevState !== pageNum ? pageNum : prevState))
		setIsLoading(true)
		const { data: result } = await userRequestList(pageNum, 8, cookies.load('uid'))
		const { total, list } = result.data
		const filteredList = list.filter((elem) => elem['grabTime'])
		setTotal(total)
		setRequestList(filteredList)
		setIsLoading(false)
	}

	const detailDrawerClose = () => {
		setDetailDrawerVisible(false)
	}

	const deleteRequest = (render) => {
		setDeleteVisible(true)
		setCurrentRequest(render)
	}

	const handleDeleteOk = async () => {
		const { data: result } = await deleteUserGrabRequest(cookies.load('uid'), currentRequest._id)
		if (result.status === 0) {
			message.success(result.msg)
		} else {
			message.error(result.msg)
		}
		setDeleteVisible(false)
		getRequestList(currentPageNum)
	}

	const showModal = (grabbedDataId) => {
    setCurrentGrabDataId(grabbedDataId)
		setIsModalVisible(true)
	}

	const handleTableDownload = async() => {
		if (checkedList.length === 0) {
			message.warn('请至少选择一个字段')
		} else {
			const c = tableColumns.filter((elem) => checkedList.includes(elem.dataIndex))
      let {data:result} = await getExcelTableData(currentGrabDataId, checkedList)
      ExportExcel(c, result.data, 'result')
			setIsModalVisible(false)
		}
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}
	const onChange = (list) => {
		if (list.length < options.length) {
			setIndeterminate(true)
		} else {
			setIndeterminate(false)
		}
		setCheckedList(list)
	}
	const onCheckAllChange = (e) => {
		setCheckedList(e.target.checked ? defaultValue : [])
		setIndeterminate(false)
		setCheckAll(e.target.checked)
	}
	const columns = useMemo(
		() => [
			{
				title: '新闻源',
				dataIndex: 'sourceName',
				key: 'sourceName',
				fixed: 'left',
				width: 90,
				render: (text) => newsSource.find((elem) => elem.value === text).name,
			},
			{
				title: '类别',
				dataIndex: 'category',
				key: 'category',
				fixed: 'left',
				width: 110,
				render: (text, render) => {
					let { sourceName } = render
					let categoryName = newsCategories[sourceName].find((elem) => elem.value === text).name
					return categoryName
				},
			},
			{
				title: '关键词',
				dataIndex: 'keyword',
				key: 'keyword',
				fixed: 'left',
				width: 100,
			},
			{
				title: '数量',
				dataIndex: 'limit',
				key: 'limit',
				width: 80,
				sorter: (a, b) => a.limit - b.limit,
				sortDirections: ['descend', 'ascend'],
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
				sorter: (a, b) => a.create_time - b.create_time,
				sortDirections: ['descend', 'ascend'],
				render: (text) => new Date(text).toLocaleString(),
			},
			{
				title: '完成时间',
				dataIndex: 'grabTime',
				key: 'grabTime',
				render: (text) => new Date(text).toLocaleString(),
			},
			{
				title: '操作',
				key: 'action',
				width: 200,
				render: (text, render) => (
					<Space size='middle'>
						{/*若要传递参数，不能直接在onClick内直接传入回调函数，需要使用另一个函数包裹*/}
						<Button
							onClick={() => {
								getGrabResultData(render.grabbedDataId)
							}}
						>
							查看结果
						</Button>
						<Button onClick={() => {
              showModal(render.grabbedDataId)
            }}>导出结果为Excle表格</Button>
						<Button
							onClick={() => {
								deleteRequest(render)
							}}
						>
							删除
						</Button>
					</Space>
				),
			},
		],
		[]
	)

	useEffect(() => {
		getRequestList()
		return () => {
			if (cancel) {
				cancel()
			}
		}
	}, [])

	return ( 
		<Card >
			<Table
				bordered
				rowKey='_id'
				dataSource={requestList}
				columns={columns}
				loading={isLoading}
				pagination={{
					current: currentPageNum,
					total,
					position: ['bottomCenter'],
					defaultPageSize: 8,
					showQuickJumper: true,
					onChange: getRequestList,
				}}
			/>
			<UserDataDetail
				onClose={detailDrawerClose}
				drawerVisible={detailDrawerVisible}
				grabbedDataId={currentGrabDataId}
			/>
			<Modal
				title='确定删除'
				visible={deleteVisible}
				okText='确定'
				cancelText='取消'
				onOk={handleDeleteOk}
				onCancel={() => {
					setDeleteVisible(false)
				}}
			>
				<p>确定要删除该条目吗？</p>
			</Modal>
			<Modal
				width={680}
				title='导出结果为Excel表格'
				visible={isModalVisible}
				onOk={handleTableDownload}
				onCancel={handleCancel}
				okText='导出'
				cancelText='取消'
			>
				<CheckboxGroup options={options} defaultValue={checkedList} value={checkedList} onChange={onChange} />
				<Divider />
				<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
					全选
				</Checkbox>
			</Modal>
		</Card>
	)
}

export default UserDataList
