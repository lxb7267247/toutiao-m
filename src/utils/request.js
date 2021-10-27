// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// JSONBig.parse() // 把 JSON 格式的字符串转为 Javascript对象
// JSONBig.stringify() // 把 Javascript 对象 转换为 JSON 格式的字符串

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://toutiao.itheima.net',
  // 自定义后端返回的原始数据
  // data：后端返回的原始数据，就是 JSON 格式的字符串

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config ：本次请求的请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意：这里必须要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, function (error) {
  // 如果请求出错了(还没有发出去) 会进入这里
  return Promise.reject(error)
})

// 响应拦截件器

export default request
