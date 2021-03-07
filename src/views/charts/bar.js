import React, { useState } from 'react'
import ReactEcharts from 'echarts-for-react';
import { Button, Card } from 'antd'


const Bar = () => {
  const [data1,setData1] = useState([5, 20, 36, 10, 10, 30])
  const [data2,setData2] = useState([53, 2, 12, 73, 35, 85])

  const [option, setOption] = useState({
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    legend: {
      data:['销量','库存']
    },
    xAxis: {
      data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: data1
      },
      {
        name: '库存',
        type: 'bar',
        data: data2
      }]
  })



  const updateData = () => {
    setData1(prevState => prevState.map(() =>  Math.floor(Math.random()*40 + 1 )))
    setData2(prevState => prevState.map(() =>  Math.floor(Math.random()*40 + 1 )))
    setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data:['销量','库存']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: data1
        },
        {
          name: '库存',
          type: 'bar',
          data: data2
        }]
    })
  }

  return (
    <Card
      style={{height:'100%',}}
      title="柱状图示例"
      extra={<Button size="large" type="primary" onClick={updateData}>更新</Button>}>
      <ReactEcharts
        style={{height:'600px'}}
        option={option}/>
    </Card>
  )


}

export default Bar
