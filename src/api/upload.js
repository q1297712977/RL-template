import axios from "@/utils/axios"
import qs from 'qs'

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}
const formConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}
/**
 * 
 * @param {formData} jar包 
 * @param {params} 数据 
 */
const importJar = (params) => {
    return axios({
            method: 'post',
            url: '/azkaban/file/upload',
            data: params
        })
        .then(res => res.data);
}
const getUserFile = (params) => {
    return axios.get(`/system/user/downTemplate?deptId=${params}`, {
        responseType: 'blob'
    }).then(res => {

        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const getUserErrorFile = (params) => {
    return axios.get(`/system/user/downErrorExcel?key=${params}`, {
        responseType: 'blob'
    }).then(res => {
        console.log(res)
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}

const importUserFile = (params) => {
    return axios({
            method: 'post',
            url: '/system/user/importUser',
            data: params
        })
        .then(res => res.data);
}
const getModelFile = (params) => {
    return axios.get(`/meta/api/model_manager/template/download/`, {
        responseType: 'blob'
    }).then(res => {
        // return res
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const getModelErrorFile = (params) => {
    return axios.get(`/meta/api/model_manager/error/download?fileName=${params}`, {
        responseType: 'blob'
    }).then(res => {

        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const importModelFile = (params) => {
    return axios({
            method: 'post',
            url: '/meta/api/model_manager/upload',
            data: params
        })
        .then(res => res.data);
}
const getCarFile = (params) => {
    return axios.get(`/meta/api/vehicle_manager/template/download`, {
        responseType: 'blob'
    }).then(res => {
        // return res
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const downCarFile = (params) => {
    return axios.get(`/meta/api/vehicle_manager/download`, {
        responseType: 'blob'
    }).then(res => {
        // return res
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const getCarErrorFile = (params) => {
    return axios.get(`/meta/api/vehicle_manager/error/download?fileName=${params}`, {
        responseType: 'blob'
    }).then(res => {

        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const importCarFile = (params) => {
    return axios({
            method: 'post',
            url: '/meta/api/vehicle_manager/upload',
            data: params
        })
        .then(res => res.data);
}
const getDicFile = (params) => {
    return axios.get(`/meta/api/dic_manager/template/download`, {
        responseType: 'blob'
    }).then(res => {
        // return res
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const importDicFile = (params) => {
    return axios({
            method: 'post',
            url: '/meta/api/dic_manager/upload',
            data: params
        })
        .then(res => res.data);
}
const getDicErrorFile = (params) => {
    return axios.get(`/meta/api/dic_manager/error/download?fileName=${params}`, {
        responseType: 'blob'
    }).then(res => {

        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const getTableFile = (params) => {
    return axios.get(`/meta/meta_field/template/download?dbType=${params}`, {
        responseType: 'blob'
    }).then(res => {
        // return res
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const importTableFile = (params) => {
    return axios({
            method: 'post',
            url: '/meta/meta_field/import',
            data: params
        })
        .then(res => res.data);
}
const getTableErrorFile = (params) => {
    return axios.get(`/meta/meta_field/error/download?fileName=${params}`, {
        responseType: 'blob'
    }).then(res => {

        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
/**
 * 
 * @param {质量报告} params 
 */
const downReportFile = (params) => {
    return axios.get(`/azkaban/file/download?projectIds=${params}`, {
        responseType: 'blob'
    }).then(res => {
        // return res
        console.log(res)
        let blob = new Blob([res.data], {
            type: 'application/zip'
        });
        console.log(blob)
        // const downloadElement = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const importRuleFile = (params) => {
    return axios({
            method: 'post',
            url: '/azkaban/file/uploadRuleFile',
            data: params
        })
        .then(res => res.data);
}
/**
 * 
 * @param {数据标准} params 
 */
const getStandardFile = (params) => {

    return axios.get(`/meta/api/standard_column/template/download?standardCode=${params}`, {
        responseType: 'blob'
    }).then(res => {
        if (res.data.type == 'application/json') {
            return {
                code:1,
                message:"参数错误，数据标准编码不存在!"
            }
        } else {
            let blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
            });
            let url = window.URL.createObjectURL(blob);
            window.location.href = url;
        }
    }).catch(error => {
        console.log(error)
    })
}

/**
 * v1配置
 */
const getvehicleFile = (params) => {
    return axios.get(`/business/vehicleManager/template/download`, {
        responseType: 'blob'
    }).then(res => {
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const importVehicleFile = (params) => {
    return axios({
            method: 'post',
            url: '/business/vehicleManager/upload',
            data: params
        })
        .then(res => res.data);
}
const downVehicleFile = (params) => {
    return axios.get(`/business/vehicleManager/error/download?fileName=${params}`, {
        responseType: 'blob'
    }).then(res => {
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}
const downReportExport = (params) => {
    return axios.get(`/monitor/reportManager/export`,params, {
        responseType: 'blob'
    }).then(res => {
        let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
        });
        let url = window.URL.createObjectURL(blob);
        window.location.href = url;
    })
}


export default {
    importJar,
    importUserFile,
    getUserFile,
    getUserErrorFile,
    getModelFile,
    importModelFile,
    getModelErrorFile,
    getCarFile,
    importCarFile,
    downCarFile,
    getCarErrorFile,
    getDicFile,
    importDicFile,
    getDicErrorFile,
    getTableFile,
    getTableErrorFile,
    importTableFile,
    downReportFile,
    getStandardFile,
    importRuleFile,



    //v1
    getvehicleFile,importVehicleFile,downVehicleFile,

    //报表导出
    downReportExport
}