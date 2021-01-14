import axios from "@/utils/axios"
import qs from 'qs'


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
 * @param {总览} params 
 */

const getAllInfo = (params) => {
    return axios.get(`/monitor/bigScreen/allInfo`).then(res => {
        return res.data
    })
}
const getAllVehicleInfo = () => {
    return axios.get(`/monitor/bigScreen/vehicleInfo`).then(res => {
        return res.data
    })
}


export default {
    getAllInfo,getAllVehicleInfo
}