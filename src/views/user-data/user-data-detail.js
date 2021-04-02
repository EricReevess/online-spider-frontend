import React, { useState, useEffect, useCallback,useMemo } from 'react'
import { Button, Drawer, Space, Table, Descriptions,Tag } from 'antd'
import './user-data-detail.less'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../config/path-config'
import { cancel, getGrabbedData } from '../../api'

const UserDataDetail = ({ grabbedDataId, onClose, drawerVisible, ...restProps }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [total, setTotal] = useState(0)
	const [currentPageNum, setCurrentPageNum] = useState(1)
	const [currentNews, setCurrentNews] = useState(null)
	const [newsList, setNewsList] = useState([])
	const [newsDetailDrawerVisible, setNewsDetailDrawerVisible] = useState(false)
	const columns = useMemo(() => 
	[
		{
			title: '标题',
			dataIndex: 'title',
			key: 'title',
			fixed: 'left',
		},
		{
			title: '分类',
			dataIndex: 'category',
			key: 'category',
			fixed: 'left',
			width: 80,
		},
		{
			title: '作者',
			dataIndex: 'media',
			key: 'media',
			fixed: 'left',
			width: 100,
		},
		{
			title: '发布时间',
			dataIndex: 'publish_time',
			key: 'publish_time',
			render: (text) => new Date(text).toLocaleString(),
		},
		{
			title: '操作',
			key: 'action',
			width: 100,
			render: (text, render) => (
				<Space size='middle'>
					<Button
						onClick={() => {
							handleNewsDetail(render)
						}}
					>
						查看新闻详情
					</Button>
				</Space>
			),
		},
	],[])

	const getNewsList = useCallback(
		async (pageNum = 1) => {
			setCurrentPageNum((prevState) => (prevState !== pageNum ? pageNum : prevState))
			setIsLoading(true)
			const { data: result } = await getGrabbedData(pageNum, 8, grabbedDataId)
			const { total, list } = result.data
			setTotal(total)
			setNewsList(list)
			setIsLoading(false)
		},
		[grabbedDataId]
	)

	const handleNewsDetail = (render) => {
		setNewsDetailDrawerVisible(true)
		setCurrentNews(render)
		console.log(render);
	}

	useEffect(() => {
		if (grabbedDataId) {
			getNewsList()
		}
		return () => {
			if (cancel) {
				cancel()
			}
		}
	}, [getNewsList, grabbedDataId])

	return (
		<Drawer
			title='抓取详情'
			width={800}
			destroyOnClose
			maskClosable={false}
			onClose={onClose}
			visible={drawerVisible}
			footer={
				<Button onClick={onClose} style={{ marginRight: 8 }}>
					关闭
				</Button>
			}
		>
			<Table
				bordered
				rowKey='_id'
				dataSource={newsList}
				columns={columns}
				loading={isLoading}
				pagination={{
					current: currentPageNum,
					total,
					position: ['bottomCenter'],
					defaultPageSize: 8,
					showQuickJumper: true,
				}}
			/>
			<Drawer
				title='新闻详情'
				width={800}
				onClose={() => {
					setNewsDetailDrawerVisible(false)
				}}
				visible={newsDetailDrawerVisible}
			>
				{
					currentNews && 
					<Descriptions bordered size='small' >
					<Descriptions.Item labelStyle={{width:90}} label='新闻标题' span={3}>{currentNews['title']}</Descriptions.Item>
					<Descriptions.Item label='作者' >{currentNews['media']}</Descriptions.Item>
					<Descriptions.Item label='类别' >{currentNews['category']}</Descriptions.Item>
					<Descriptions.Item label='发布时间' >{currentNews['publish_time']}</Descriptions.Item>
					<Descriptions.Item label='关键词' span={3}>{currentNews['keywords']}</Descriptions.Item>
					<Descriptions.Item label='标签' span={3}>
						{currentNews['tags'].map((elem, index) => (
							<Tag key={index}>{elem}</Tag>
						))}
					</Descriptions.Item>
					<Descriptions.Item label='URL' span={3}>
						<a target="_blank" rel="noopener noreferrer" href={currentNews['url']}>{currentNews['url']}</a>
						</Descriptions.Item>
					<Descriptions.Item label='新闻内容'>
						{currentNews['newsContentArray'].map((elem, index) => (
							<p key={index}>{elem}</p>
						))}
					</Descriptions.Item>
				</Descriptions>
				}
				
			</Drawer>
		</Drawer>
	)
}
UserDataDetail.propTypes = {
	grabbedDataId: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	drawerVisible: PropTypes.bool.isRequired,
}
export default UserDataDetail
