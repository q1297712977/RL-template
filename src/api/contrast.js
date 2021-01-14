import axios from "@/utils/axios"
import qs from 'qs'
//对比

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const userAdd = (params) => {
    return axios.post(`/system/user`, qs.stringify(params)).then(res => {
        return res
    })
}

const addRole = (params) => {
    return axios.post(`/system/role`, qs.stringify(params)).then(res => {
        return res
    })
}
const updateRole = (params) => {
    return axios.put(`/system/role`, qs.stringify(params)).then(res => {
        return res
    })
}
const getRoleMenu = (params) => {
    return axios.get(`/system/role/menu/${params}`).then(res => {
        return res
    })
}
const delRole = (id) => {
    return axios.delete(`/system/role/${id}`)
}
const getRoleInfo = (id) => {
    return axios.get(`/system/role/${id}`)
}
export default {
 
}