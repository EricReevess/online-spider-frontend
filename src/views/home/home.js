import React from 'react'
import { Card, Col, Row, Skeleton, Statistic, Tabs, Timeline } from 'antd'
import ReactEcharts from 'echarts-for-react'

const { TabPane } = Tabs
const Home = () => {

  const option = {
    title: {
      text: '折线图堆叠'
    }, tooltip: {
      trigger: 'axis'
    }, legend: {
      data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    }, grid: {
      left: '3%', right: '4%', bottom: '3%', containLabel: true
    }, xAxis: {
      type: 'category', boundaryGap: false, data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }, yAxis: {
      type: 'value'
    }, series: [{
      name: '邮件营销', type: 'line', stack: '总量', data: [120, 132, 101, 134, 90, 230, 210]
    }, {
      name: '联盟广告', type: 'line', stack: '总量', data: [220, 182, 191, 234, 290, 330, 310]
    }, {
      name: '视频广告', type: 'line', stack: '总量', data: [150, 232, 201, 154, 190, 330, 410]
    }, {
      name: '直接访问', type: 'line', stack: '总量', data: [320, 332, 301, 334, 390, 330, 320]
    }, {
      name: '搜索引擎', type: 'line', stack: '总量', data: [820, 932, 901, 934, 1290, 1330, 1320]
    }]
  }

  return (<Card style={{ height: '100%' }}>
    <Row gutter={16}>
      <Col span={10}>
        <Card style={{ width: 500 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Active Users" value={112893}/>
            </Col>
            <Col span={12}>
              <Statistic title="Account Balance (CNY)" value={112893} precision={2}/>
            </Col>
          </Row>
          <Row gutter={16}>
            <Skeleton/>
          </Row>
        </Card>
      </Col>
      <Col span={14}>
        <Card bordered={false} style={{ width: '100%' }}>
          <ReactEcharts option={option}/>
        </Card>
      </Col>
    </Row>
    <Tabs defaultActiveKey="1">
      <TabPane tab="访问量" key="1">
        <Row gutter={16}>
          <Col span={16}>
            <Card title="访问趋势">
              <Skeleton/>
              <Skeleton/>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="时间轴">
              <Timeline>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item color="red">
                  <p>Solve initial network problems 1</p>
                  <p>Solve initial network problems 2</p>
                  <p>Solve initial network problems 3 2015-09-01</p>
                </Timeline.Item>
                <Timeline.Item>
                  <p>Technical testing 1</p>
                  <p>Technical testing 2</p>
                  <p>Technical testing 3 2015-09-01</p>
                </Timeline.Item>
              </Timeline>
            </Card>

          </Col>

        </Row>


      </TabPane>
      <TabPane tab="销售量" key="2">
        <Card>
          <Row gutter={16}>
            <Col span={16}>
              <Skeleton/>
            </Col>
            <Col span={8}>
              <Skeleton/>
            </Col>
          </Row>
        </Card>
      </TabPane>
    </Tabs>
  </Card>)

}

export default Home
