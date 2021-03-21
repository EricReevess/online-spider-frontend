import React, { useState } from 'react'
import { Card, Col, Row, Form, Button, InputNumber, Input, message } from 'antd'
import { grabRequest } from '../../api'
import ReactEcharts from 'echarts-for-react'
import { Select } from 'antd'
import './home.less'
const { Option } = Select
const newsSource = [{
  name: '腾讯新闻', value: 'tencentNews'
}]
const newsCategories = {
  'tencentNews': [{
    name: '二十四小时热点', value: '24hours'
  }, {
    name: '科技新闻', value: 'tech'
  }, {
    name: '娱乐新闻', value: 'ent'
  }, {
    name: '游戏新闻', value: 'games'
  },]
}

const Home = () => {

  //source内存放分类数组
  const [source, setSource] = useState(newsCategories[newsSource[0]['value']])
  const [selectedSource, setSelectedSource] = useState('tencentNews')
  const [category, setCategory] = useState(newsCategories[newsSource[0]['value']][0]['value'])
  const [limit, setLimit] = useState(1)
  const [keyword, setKeyword] = useState('')

  const handleSourceChange = value => {
    setSource(newsCategories[value])
    setCategory(newsCategories[value][0]['value'])
    setSelectedSource(value)

  }

  const handleCategoryChange = value => {
    setCategory(value)
  }

  const handleKeywordChange = e => {
    setKeyword(e.target.value.trim())
  }

  const handleLimitChange = limit => {
    setLimit(limit)
  }

  const handleSubmit = async () => {
    console.log(selectedSource,category,keyword,limit)
    if (!keyword){
      message.warn('关键词不能为空')
    } else {
      message.loading('发送请求...')
      const result= await grabRequest({selectedSource,category,keyword,limit})
      console.log(result)
      // if (result.status === 0) {
      //   message.success(result.msg || '注册成功')
      // } else {
      //   message.error(result.msg || '注册失败')
      // }

    }

  }


  return (<Card className="home-card" >
    <Row gutter={16}>
      <Col span={12}>
        <Card className="sub-card input-data-card">
          <h2>输入数据</h2>
          <Form
            layout={'inline'}
            onFinish={handleSubmit}
          >
            <Row gutter={[16, 24]}>
              <Col className="gutter-row" span={12}>
                <Form.Item label="新闻源">
                  <Select defaultValue={newsSource[0]['name']} style={{ width: '100%' }} onChange={handleSourceChange}>
                    {newsSource.map(source => (<Option key={source.value}>{source.name}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item label="新闻类型">
                  <Select style={{ width: '100%' }} value={category} onChange={handleCategoryChange}>
                    {source.map(city => (<Option key={city.value}>{city.name}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item label="关键词">
                  <Input style={{ width: '100%' }} value={keyword} onChange={handleKeywordChange} placeholder="输入关键词"/>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>

                <Form.Item label="抓取数量">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    max={20}
                    value={limit}
                    onChange={handleLimitChange}
                    defaultValue={10}
                    placeholder="输入数字"/>
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" >抓取</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card className="sub-card user-log">
          <h2>服务器状态</h2>
        </Card>
      </Col>
      <Col span={12}>

      </Col>
    </Row>
  </Card>)

}

export default Home
