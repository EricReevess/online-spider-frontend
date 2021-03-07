import axios from 'axios'

let cancel

// 请求拦截器
const axiosInstance = axios.create({
  baseURL: '/', headers: { 'Content-Type': 'application/json;charset=utf-8' },
})
axiosInstance.interceptors.request.use(config => {

  config.cancelToken = new axios.CancelToken((c) => {
    cancel = c
  })

  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})


function ajax (method = 'GET', url = '', data = {}) {

  return new Promise((resolve) => {
    let promise
    // get请求
    if (method === 'GET') {
      promise = axiosInstance.get(url, {
        params: data
      })
    }
    // post请求
    if (method === 'POST') {
      promise = axiosInstance.post(url, data)
    }
    // 处理正常的响应
    promise.then(response => {
      resolve(response)
      //处理错误的请求
    }).catch(error => {
      console.log(error)
    })
  })

}

export {
  ajax,
  cancel
}
