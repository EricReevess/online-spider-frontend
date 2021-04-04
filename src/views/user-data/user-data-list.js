import React, { useEffect, useRef, useState, useMemo } from 'react'
import cookies from 'react-cookies'
import { Button, Card, Input, Select, Space, Table, message, Modal } from 'antd'
import { cancel, searchProductRequest, deleteUserGrabRequest, userRequestList } from '../../api'
import ProductAddUpdate from './user-data-add-update'
import UserDataDetail from './user-data-detail'

const { Option } = Select
const { Search } = Input

const UserDataList = () => {
	const updateRef = useRef(null)

	// state
	const [isLoading, setIsLoading] = useState(true)
	const [addDrawerVisible, setAddDrawerVisible] = useState(false)
	const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
	const [requestList, setRequestList] = useState([])
	const [currentGrabDataId, setCurrentGrabDataId] = useState('')
	const [total, setTotal] = useState(0)
	const [searchType, setSearchType] = useState('productName')
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [currentPageNum, setCurrentPageNum] = useState(1)
	const [currentRequest, setCurrentRequest] = useState('')
	const [deleteVisible, setDeleteVisible] = useState(false)

	// 查看请求数据回调
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

	// 抽屉关闭回调
	const addDrawerClose = () => {
		setAddDrawerVisible(false)
		setConfirmLoading(false)
	}

	const detailDrawerClose = () => {
		setDetailDrawerVisible(false)
	}

	// 搜索商品
	const handleSearchProduct = async (keyword) => {
		setIsLoading(true)
		const { data: result } = await searchProductRequest(1, 5, keyword.trim(), searchType)
		if (result.status === 0) {
			const { total, list } = result.data
			setTotal(total)
			setRequestList(list)
			setCurrentPageNum(1)
		}
		setIsLoading(false)
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
	const newsSource = useMemo(
		() => [
			{
				name: '腾讯新闻',
				value: 'tencentNews',
			},
		],
		[]
	)
	const newsCategories = useMemo(
		() => ({
			tencentNews: [
				{
					name: '24小时热点',
					value: '24hours',
				},
				{
					name: '科技新闻',
					value: 'tech',
				},
				{
					name: '娱乐新闻',
					value: 'ent',
				},
				{
					name: '游戏新闻',
					value: 'games',
				},
			],
		}),
		[]
	)
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
						<Button onClick={() => {}}>导出结果为Excle表格</Button>
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
		[newsCategories, newsSource]
	)

	const cardTitle = (
		<div>
			<Select
				value={searchType}
				onChange={(value) => {
					setSearchType(value)
				}}
			>
				<Option value='productName'>按名称搜索</Option>
				<Option value='productDesc'>按描述搜索</Option>
			</Select>
			<Search
				placeholder='请输入关键字'
				onSearch={(value) => {
					handleSearchProduct(value)
				}}
				style={{ width: 200 }}
			/>
		</div>
	)
	// 生命周期
	useEffect(() => {
		getRequestList()
		return () => {
			if (cancel) {
				cancel()
			}
		}
	}, [])

	return (
		<Card title={cardTitle}>
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
			<ProductAddUpdate
				ref={updateRef}
				drawerVisible={addDrawerVisible}
				onClose={addDrawerClose}
				confirmLoading={confirmLoading}
				getProductList={getRequestList}
				currentPageNum={currentPageNum}
				setConfirmLoading={(value) => setConfirmLoading(value)}
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
		</Card>
	)
}

export default UserDataList
