import axios from "@/utils/axios"
import qs from 'qs'

//报表

const formConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  
/**
 * 
 * @param {报表管理} params 
 */
const getReportAll = (params) => {
    return axios.post(`/monitor/reportManager/list`, params, config).then(res => {
        return res.data
    })
}
const getReportMonth = (params) => {
    return axios.post(`/monitor/reportManager/monthList`, params, config).then(res => {
        return res.data
    })
}

const getReportDay = (params) => {
    return axios.post(`/monitor/reportManager/dayList`, params, config).then(res => {
        return res.data
    })
}
const getReportAlarm = (params) => {
    return axios.post(`/monitor/reportManager/alarmList`, params, config).then(res => {
        return res.data
    })
}
const getReportTrip = (params) => {
    return axios.post(`/monitor/reportManager/tripList`, params, config).then(res => {
        return res.data
    })
}


export default {
    getReportAll,getReportMonth,getReportDay,getReportAlarm,getReportTrip
}