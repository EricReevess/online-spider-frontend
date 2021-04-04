import React, { useState, useEffect, useMemo } from 'react'
import { Card, Col, Row, Form, Button, InputNumber, Input, message } from 'antd'
import { grabRequest, requestQueueStatus, userRequestList } from '../../api'
import { Select, Table } from 'antd'
import { BugOutlined } from '@ant-design/icons'

import cookies from 'react-cookies'
import './home.less'
const { Option } = Select
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

// 列头信息
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
		},
		{
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render: (text, render) => new Date(text).toLocaleString(),
		},
		{
			title: '完成时间',
			dataIndex: 'grabTime',
			key: 'grabTime',
			render: (text, render) => new Date(text).toLocaleString(),
		},
		{
			title: '当前状态',
			dataIndex: 'state',
			key: 'state',
			width: 100,
			render: (text, render) => {
				switch (render.state) {
					case 0:
						return '处理中'
					case -1:
						return '已完成'
					default:
						return '排队中:' + render.state
				}
			},
			fixed: 'right',
		},
	],
	[newsCategories, newsSource]
)

const Home = () => {
	//source内存放分类数组
	const [source, setSource] = useState(newsCategories[newsSource[0]['value']])
	const [selectedSource, setSelectedSource] = useState('tencentNews')
	const [category, setCategory] = useState(newsCategories[newsSource[0]['value']][0]['value'])
	const [limit, setLimit] = useState(4)
	const [keyword, setKeyword] = useState('')
	const [isRunning, setIsRunning] = useState(false)
	const [remainingRequestCount, setRemainingRequestCount] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [currentPageNum, setCurrentPageNum] = useState(1)
	const [requestList, setRequestList] = useState([])
	const [total, setTotal] = useState(0)
	const [isRequesting, setIsRequesting] = useState(false)

	const handleSourceChange = (value) => {
		setSource(newsCategories[value])
		setCategory(newsCategories[value][0]['value'])
		setSelectedSource(value)
	}

	const handleCategoryChange = (value) => {
		setCategory(value)
	}

	const handleKeywordChange = (e) => {
		setKeyword(e.target.value.trim())
	}

	const handleLimitChange = (limit) => {
		setLimit(parseInt(limit))
	}

	const handleSubmit = async () => {
		console.log(selectedSource, category, keyword, limit)
		if (!keyword) {
			message.warn('关键词不能为空')
		} else {
			message.loading('正在发送请求...')
			setIsRequesting(true)
			const { data: result } = await grabRequest({ selectedSource, category, keyword, limit })
			setIsRequesting(false)
			if (result.status === 0) {
				message.destroy()
				message.success('添加抓取请求成功')
				getRequestList()
			}
		}
	}

	const getServerQueueStatus = async () => {
		let serverQueueStatus = await requestQueueStatus()
		const { isRunning, remainingRequestCount } = serverQueueStatus.data
		setIsRunning(isRunning)
		setRemainingRequestCount(remainingRequestCount)
	}

	const getRequestList = async (pageNum = 1) => {
		setCurrentPageNum((prevState) => (prevState !== pageNum ? pageNum : prevState))
		setIsLoading(true)
		const { data: result } = await userRequestList(pageNum, 8, cookies.load('uid'))
		if (result.status === 0) {
			console.log(result)
			const { total, list } = result.data
			setTotal(total)
			setRequestList(list)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		getRequestList()
		let serverQueueStatusTimer = setInterval(() => {
			getServerQueueStatus()
		}, 1000)
		return () => {
			clearInterval(serverQueueStatusTimer)
			serverQueueStatusTimer = null
		}
	}, [])

	return (
		<Card className='home-card'>
			<Row gutter={16}>
				<Col span={12}>
					<Card className='sub-card input-data-card'>
						<h2>输入数据</h2>
						<Form layout={'inline'} onFinish={handleSubmit}>
							<Row gutter={[16, 24]}>
								<Col className='gutter-row' span={12}>
									<Form.Item label='新闻源'>
										<Select
											defaultValue={newsSource[0]['name']}
											style={{ width: '100%' }}
											onChange={handleSourceChange}
										>
											{newsSource.map((source) => (
												<Option key={source.value}>{source.name}</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col className='gutter-row' span={12}>
									<Form.Item label='新闻类型'>
										<Select
											style={{ width: '100%' }}
											value={category}
											onChange={handleCategoryChange}
										>
											{source.map((city) => (
												<Option key={city.value}>{city.name}</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col className='gutter-row' span={12}>
									<Form.Item label='关键词'>
										<Input
											style={{ width: '100%' }}
											value={keyword}
											onChange={handleKeywordChange}
											placeholder='请输入近期热门关键词'
										/>
									</Form.Item>
								</Col>
								<Col className='gutter-row' span={12}>
									<Form.Item label='抓取数量'>
										<InputNumber
											required
											style={{ width: '100%' }}
											min={1}
											max={20}
											value={limit}
											onChange={handleLimitChange}
											defaultValue={limit}
											placeholder='输入整数，不超过20'
										/>
									</Form.Item>
								</Col>
								<Col className='gutter-row' span={12}>
									<Form.Item>
										<Button
											type='primary'
											htmlType='submit'
											icon={<BugOutlined />}
											loading={isRequesting}
										>
											抓取
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Card>
					<Card className='sub-card user-log'>
						<h2>服务器状态</h2>
						<br />
						<h3>
							抓取请求执行状态：
							{isRunning ? (
								<span style={{ color: '#f00' }}>处理请求中</span>
							) : (
								<span style={{ color: '#0f0' }}>空闲</span>
							)}
						</h3>
						<br />
						<h3>请求队列剩余任务：{remainingRequestCount}</h3>
					</Card>
				</Col>
				<Col span={12}>
					<Table
						style={{ height: '500px' }}
						bordered
						rowKey='_id'
						scroll={{ x: 800 }}
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
				</Col>
			</Row>
		</Card>
	)
}

export default Home
