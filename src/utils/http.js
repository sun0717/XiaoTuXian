// axios基础的封装
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
const httpInstance = axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 5000
})

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    // 1.从pinia获取token数据
    const userStore = useUserStore()
    // 2.按照后端的要求拼接token数据
    const token = userStore.userInfo.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, e => Promise.reject(e))
  
// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    // 统一错误提示
    ElMessage({
        type: 'warn',
        message: e.response.data.message
    })
    return Promise.reject(e)
})

// 拦截器
export default httpInstance