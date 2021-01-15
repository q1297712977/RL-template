import axios from 'axios' //引入axios
import router from "../router";
import qs from 'qs'
import store from '../store/index';
import {
  message
} from 'ant-design-vue'; //引入 Ant for vue 的全局消息提醒
// import router from '../router'  //引入vue 路由

let apiUrl = "/api"
// let apiUrl = "/url"
// let apiUrl = "/zl"
// let apiUrl = "/ljs"
if (process.env.NODE_ENV === "development") { //开发环境
  //  apiUrl = "/virtual"
   apiUrl = "/virtual"
  console.log("当前环境：开发环境");
} else if (process.env.NODE_ENV === "production") {
  console.log("当前环境：生产环境");
  // apiUrl = "http://**.**.**.**:****/api" //接口地址
  // apiUrl = "http://gateway.ftms.com" //接口地址
  apiUrl = "http://103.95.70.158" //接口地址
}
//**其他环境可以自己再根据情况增加ssssssss
// 创建并配置axios实例
const service = axios.create({
  baseURL: apiUrl, //请求的url
  // baseURL: 'http://gateway.ftms.com', //请求的url

  method: 'get', //默认请求方式
  // timeout: 10000, // 请求超时时间
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // }
})

// 配置ant的全局消息提醒
message.config({
  top: `10px`, //距离顶部的距离
  duration: 1,
  maxCount: 1, //最大消息数量
});

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  window.localStorage.clear()
  if (router.currentRoute.fullPath != '/login') {
    // console.log(router.currentRoute.fullPath)

    router.replace({
      path: '/login',
      // query: {
      //   redirect: router.currentRoute.fullPath
      // }

      param: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
}
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 400:用户发出的请求有错误
    case 400:
      message.error(other)
      // toLogin()
      break

    case 422:

      message.error(other.error)

      break
      // 401: 未登录状态，跳转登录页
    case 429:
      message.error('请求太频繁,请稍后再试')
      break
      // case 401:
      //   toLogin()
      //   break
      // 403 token过期
      // 清除token并跳转登录页
    case 403:
      message.error('您没有权限进行此操作哦')
      break
      // 404请求不存在
    case 404:
      message.error('请求的资源不存在')
      break

    case 500:
      // console.log(other)
      message.error(other)
      break

    default:
      message.error(other)
      // console.log(other)
  }
}
service.interceptors.request.use(
  config => {
    // 发送请求之前
    if (localStorage.getItem('Authorization')) {
      // console.log('axios')
      config.headers.Authorization = localStorage.getItem('Authorization');
    }
    // console.log(config)
    // 为头部增加token
    // config.headers['token'] = localStorage.getItem('token') || ""
    // 为头部增加accId
    config.headers['accId'] = localStorage.getItem("accid") || ""
    // config.data = qs.stringify(config.data) // 转为formdata数据格式
    // store.state.loadding = true //全局拦截
    return config
  },
  error => {
    // 请求错误
    message.error("请求错误")
    return error
  }
)
// 默认纸条
let isRefreshing = true;
// 添加响应拦截器
service.interceptors.response.use(
  response => {
    store.state.loadding = false
    // 响应数据
    // console.log('响应');
    // console.log(response)
    if (response.status && response.status === 200) {
      if (typeof (response.data) == 'string') {
        return response.data
      }
      // if(res.code ==-1){
      //   message.error('token过期,请重新登录')
      //   router.push({
      //         path: '/login'
      //       })
      //       return 
      // }
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        return Promise.resolve(response)
      }


      return Promise.reject(message.warning(res.description))

    } else {
      message.warning("接口请求错误：" + response.status)
    }
  },
  error => {
    store.state.loadding = false
    // 响应错误
    // message.error("服务器异常")
    // console.log('err' + error) // for debug
    // return error
    // endLoading()
    const {
      response
    } = error
    // console.log(response.status)
    //  1.判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      message.error('请求超时,请检查网络')
      // return service.request(originalRequest);//重复请求一次
    }
    if (response) {
      if (response.status === 401) {
        if (router.currentRoute.name != 'login') {
          // 刷新token的函数,这需要添加一个开关，防止重复请求
          // if (isRefreshing) {
          return doRequest(response)
          // }
          isRefreshing = false;
          // return doRequest(response)
        } else {
          message.error('登录过期,请重新登录')
          window.localStorage.clear()
          toLogin()
        }
      }
      // 2请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message ?? '网络异常,请稍后重试')
      // console.log(Promise.reject(response))
      return Promise.reject(response)
    } else {
      // 3处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        message.error('断网啦,请检查网络')
      } else {
        return Promise.reject(error)
      }
    }
  }
)
async function doRequest(error) {
  // console.log(store)
  let refresh_token = localStorage.getItem('refresh_token') ? localStorage.getItem('refresh_token') : store.state.Authorization
  // let refresh_token = localStorage.getItem('refresh_token') 
  if (refresh_token == null || refresh_token == undefined) {
    // console.log(refresh_token)
    message.error('登录过期,请重新登录')
    return toLogin()
  }
  // console.log(refresh_token)
  const data = await axios({
    method: 'POST',
    url: `${apiUrl}/auth/oauth/token`,
    data: qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    auth: {
      username: 'web_app',
      password: 'web_app',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  let str = data.data
  if (str.code != 0) {
    message.error('登录过期,请重新登录')
    localStorage.clear()
    isRefreshing = true;
    return toLogin()
  } else {
    // console.log(str)
    let token = 'Bearer ' + str.data.access_token
    localStorage.setItem("Authorization", token);
    localStorage.setItem("refresh_token", str.data.refresh_token);
    let config = error.config
    config.headers.Authorization = token
    const res = await axios.request(config)
    // 纸条撕掉
    isRefreshing = true;
    return res
  }

  // console.log(this.$api.login.getRefresh(data))
}
export default service