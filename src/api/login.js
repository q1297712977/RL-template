import axios from "@/utils/axios"
import qs from 'qs'


const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
const login = (params) => {
  return axios({
    method: 'POST',
    url: `auth/oauth/token`,
    data: qs.stringify(params),
    auth: {
      username: 'web_app',
      password: 'web_app',
    }, config
  })
    .then(res => res.data);
}
const changePassword = (params) => {
  return axios.post(`/system/user/mobilePassword`, params).then(res => {
    return res
  })
}
const logout = () => {
  return axios.delete(`/auth/user/signout`).then(res => {
    return res
  })
}
/**
 * code
 */
const code = (key) => {
  // return `http://gateway.ftms.com/auth/user/captcha?key=${key}`
  return `http://103.95.70.158/auth/user/captcha?key=${key}`
  // return axios.get(`/auth/user/captcha?key=${key}`)
}
const getRefresh=(params)=>{
  return  axios({
    method: 'POST',
    url: `auth/oauth/token`,
    params: {
        grant_type: "refresh_token",
        refresh_token:params,
    },
    auth: {
        username: 'web_app',
        password: 'web_app',
    }.then((res)=>{
      return res
    })

});
}
export default {
  login,
  logout,
  code,
  changePassword,getRefresh
}