import axios from "@/utils/axios"
import qs from 'qs'

//数据查询
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const getQueryDataList = (params) => {
    return axios.post(`/monitor/searchManager/list`,  params,config).then(res => {
        return res
    })
}


export default {
    getQueryDataList
}