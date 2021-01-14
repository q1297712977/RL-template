import axios from "@/utils/axios"
import qs from 'qs'

//配置
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
 * @param {车队管理} params 
 */
const getFleetList = (params) => {
    return axios.post(`/business/fleetManager/list`, params,config).then(res => {
        return res.data
    })
}
const addFleet = (params) => {
    return axios.post(`/business/fleetManager/add`, params,config).then(res => {
        return res.data
    })
}
const getFleetInfo = (params) => {
    return axios.get(`/business/fleetManager/info?id=${params}`).then(res => {
        return res.data
    })
}
const getDicFleet = () => {
    return axios.get(`/business/fleetManager/fleetName/list`).then(res => {
        return res.data
    })
}
const updateFleet = (params) => {
    return axios.post(`/business/fleetManager/edit`, params,config).then(res => {
        return res.data
    })
}
const delFleet = (params) => {
    return axios.delete(`/business/fleetManager/delete?id=${params}`).then(res => {
        return res.data
    })
}
/**
 * 
 * @param {车型管理} params 
 */
const getModelList = (params) => {
    return axios.post(`/business/modelManager/list`, params,config).then(res => {
        return res.data
    })
}
const addModel = (params) => {
    return axios.post(`/business/modelManager/add`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const getModelInfo = (params) => {
    return axios.get(`/business/modelManager/info?id=${params}`).then(res => {
        return res.data
    })
}
const getDicModel = () => {
    return axios.get(`/business/modelManager/modelName/list`).then(res => {
        return res.data
    })
}
const updateModel = (params) => {
    return axios.post(`/business/modelManager/edit`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const delModel = (params) => {
    return axios.delete(`/business/modelManager/delete?id=${params}`, params,config).then(res => {
        return res.data
    })
}

/**
 * 
 * @param {车辆管理} params 
 */
const getVehicleList = (params) => {
    return axios.post(`/business/vehicleManager/list`, params,config).then(res => {
        return res.data
    })
}
const addVehicle = (params) => {
    return axios.post(`/business/vehicleManager/add`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const getVehicleInfo = (params) => {
    return axios.get(`/business/vehicleManager/info?id=${params}`).then(res => {
        return res.data
    })
}
const updateVehicle = (params) => {
    return axios.post(`/business/vehicleManager/edit`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const delVehicle = (params) => {
    return axios.delete(`/business/vehicleManager/delete?id=${params}`, params,config).then(res => {
        return res.data
    })
}

/**
 * 
 * @param {协议管理} params 
 */
const getPactList = (params) => {
    return axios.post(`/business/protocolManager/list`, params,config).then(res => {
        return res.data
    })
}
const addPact = (params) => {
    return axios.post(`/business/protocolManager/add`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const getPactInfo = (params) => {
    return axios.get(`/business/protocolManager/info?id=${params}`).then(res => {
        return res.data
    })
}
const getDicPact = () => {
    return axios.get(`/business/protocolManager/protocolName/list`).then(res => {
        return res.data
    })
}
const updatePact = (params) => {
    return axios.post(`/business/protocolManager/edit`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const allUpdatePact = (params) => {
    return axios.post(`/business/vehicleManager/batchEdit`, params,config).then(res => {
        return res.data
    })
}
const setPactIP = (params) => {
    return axios.post(`/business/vehicleManager/ipAndport/set`, params,config).then(res => {
        return res.data
    })
}
const delPact = (params) => {
    return axios.delete(`/business/protocolManager/delete?id=${params}`,config).then(res => {
        return res.data
    })
}
export default {
    getFleetList,addFleet,updateFleet,getFleetInfo,delFleet,getDicFleet,
    
    getModelList,addModel,updateModel,getModelInfo,delModel,getDicModel,
    
    getPactList,addPact,updatePact,getPactInfo,delPact,getDicPact,allUpdatePact,setPactIP,
    
    getVehicleList,addVehicle,updateVehicle,getVehicleInfo,delVehicle,
}