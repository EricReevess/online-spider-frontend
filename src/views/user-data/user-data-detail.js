import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Button, Drawer, Space, Table, Descriptions, Tag } from 'antd'
import './user-data-detail.less'
import PropTypes from 'prop-types'
import { cancel, getGrabbedData } from '../../api'
import ReactEcharts from 'echarts-for-react'
import 'echarts-wordcloud'

const UserDataDetail = ({ grabbedDataId, onClose, drawerVisible, ...restProps }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [total, setTotal] = useState(0)
	const [currentPageNum, setCurrentPageNum] = useState(1)
	const [currentNews, setCurrentNews] = useState(null)
	const [newsList, setNewsList] = useState([])
	const [newsDetailDrawerVisible, setNewsDetailDrawerVisible] = useState(false)
	const [wordCloudDrawerVisible, setWordCloudDrawerVisible] = useState(false)
	const [wordCloudRef, setWordCloudRef] = useState(null)
	const columns = useMemo(
		() => [
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
					<>
						<Space size='middle'>
							<Button
								onClick={() => {
									handleNewsDetail(render)
								}}
							>
								查看详情
							</Button>
						</Space>
						<Space size='middle'>
							<Button
								onClick={() => {
									handleNewsWordCloud(render)
								}}
							>
								生成词云
							</Button>
						</Space>
					</>
				),
			},
		],
		[]
	)

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
		console.log(render)
	}
	const handleNewsWordCloud = (render) => {
		setWordCloudDrawerVisible(true)
		setCurrentNews(render)
	}

	const wordCloudRender = () => {
		const wordData = currentNews.wordCloud.map((elem) => ({
			name: elem.word,
			value: elem.weight * 100,
		}))

		let option = {
			backgroundColor: '#fff',
			tooltip: {
				//pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
			},
			series: [
				{
					type: 'wordCloud',
					shape: 'circle',
					gridSize: 4,
					sizeRange: [12, 60],
					rotationRange: [-45, 0, 45, 90],
					left: 'center',
					top: 'center',
					width: '140%',
					height: '140%',
					right: null,
					bottom: null,
					data: wordData,
					drawOutOfBound: false,
					layoutAnimation: true,
					textStyle: {
						color: () =>
							'rgb(' +
							[
								Math.round(Math.random() * 160),
								Math.round(Math.random() * 160),
								Math.round(Math.random() * 160),
							].join(',') +
							')',
					},
				},
			],
		}
		return option
	}

	const handleWordCloudSave = () => {
		if (wordCloudRef) {
			const wordlCloudInstance = wordCloudRef.getEchartsInstance()
			// then you can use any API of echarts.
			const base64 = wordlCloudInstance.getDataURL({
				// 导出的格式，可选 png, jpeg
				type: 'png',
				// 导出的图片分辨率比例，默认为 1。
				pixelRatio: 1,
				// 导出的图片背景色，默认使用 option 里的 backgroundColor
				// 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox']
				excludeComponents: ['toolbox'],
			})
			const a = document.createElement('a')
			a.textContent = 'downloadImage'
			a.download = 'wordCloudImage.png'
			a.href = base64
			a.click()
		}
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
			width={900}
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
				width={900}
				onClose={() => {
					setNewsDetailDrawerVisible(false)
				}}
				visible={newsDetailDrawerVisible}
			>
				{currentNews && (
					<Descriptions bordered size='small'>
						<Descriptions.Item labelStyle={{ width: 90 }} label='新闻标题' span={3}>
							{currentNews['title']}
						</Descriptions.Item>
						<Descriptions.Item label='作者'>{currentNews['media']}</Descriptions.Item>
						<Descriptions.Item label='类别'>{currentNews['category']}</Descriptions.Item>
						<Descriptions.Item label='发布时间'>{currentNews['publish_time']}</Descriptions.Item>
						<Descriptions.Item label='关键词' span={3}>
							{currentNews['keywords']}
						</Descriptions.Item>
						<Descriptions.Item label='标签' span={3}>
							{currentNews['tags'].map((elem, index) => (
								<Tag key={index}>{elem}</Tag>
							))}
						</Descriptions.Item>
						<Descriptions.Item label='URL' span={3}>
							<a target='_blank' rel='noopener noreferrer' href={currentNews['url']}>
								{currentNews['url']}
							</a>
						</Descriptions.Item>
						<Descriptions.Item label='新闻内容'>
							{currentNews['newsContentArray'].map((elem, index) => (
								<p key={index}>{elem}</p>
							))}
						</Descriptions.Item>
					</Descriptions>
				)}
			</Drawer>
			<Drawer
				title='词云图'
				width={800}
				onClose={() => {
					setWordCloudDrawerVisible(false)
				}}
				visible={wordCloudDrawerVisible}
				footer={
					<Button onClick={handleWordCloudSave} style={{ marginRight: 8 }}>
						下载这张词云图
					</Button>
				}
			>
				{currentNews && (
					<ReactEcharts
						ref={(e) => {
							setWordCloudRef(e)
						}}
						style={{ height: '100%', width: '100%' }}
						option={wordCloudRender()}
						theme='ThemeStyle'
					/>
				)}
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
