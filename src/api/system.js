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
 * /userinfo  当前用户个人信息
 */
const getUser = () => {
    return axios.get(`/system/user/getUser`).then(res => {
        return res
    })
}
/**
 * /userinfo  验证当前密码
 */
const checkPassword = (value) => {
    return axios.get(`/system/user/password/check?password=${value}`).then(res => {
        return res
    })
}
/**
 * /userinfo  修改用户资料
 */
const changeUser = (params) => {
    return axios.put(`/system/user`,
        qs.stringify(params)
    ).then(res => {
        return res
    })
}

/**
 * /userinfo  修改密码
 */
const changePassword = (value) => {
    return axios.put(`/system/user/password?password=${value}`).then(res => {
        return res.data
    })
}
/**
 * 获取角色信息
 */
const getRoles = (params) => {
    return axios.get(`/system/role`,{params:params}).then(res => {
        return res.data
    })
}

//成员添加
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

/**
 * 获取菜单信息
 */
const getMenuList = (params) => {
    return axios.get(`/system/menu`,{params:params}).then(res => {
        return res
    })
}
const getMenuInfo = (params) => {
    return axios.get(`/system/menu/getId/${params}`).then(res => {
        return res
    })
}

//菜单添加
const menuAdd = (params) => {
    return axios.post(`/system/menu`, qs.stringify(params)).then(res => {
        return res
    })
}
/**
 * 菜单更新
 */
const menuUpdate = (params) => {
    return axios.put(`/system/menu`, qs.stringify(params)).then(res => {
        return res
    })
}
/**
 * 菜单删除
 */
const menuDel= (params) => {
    // console.log(params)
    return axios.delete(`/system/menu`,{data:params}).then(res => {
        return res
    })
}
/**
 * 获取组织树
 */
const getDept = (params) => {
    return axios.get(`/system/dept`,{params:params}).then(res => {
        return res.data
    })
}
/**
 * 获取组织成员
 */
const getUserByDept = (params) => {

    return axios.get(`/system/user`,{params:params},formConfig).then(res => {
        return res.data
    })
}
/**
 * 添加组织
 */
const addDept = (params) => {
    return axios.post(`/system/dept`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const updateDept = (params) => {
    return axios.put(`/system/dept`, qs.stringify(params)).then(res => {
        return res.data
    })
}
const delDept = (params) => {
    return axios.delete(`/system/dept`,{data:params}).then(res=>{
        return res.data
    })
}
const delUser = (id) => {
    return axios.delete(`/system/user/${id}`).then(res=>{
        return res.data
    })
}
const getUserById = (id) => {
    return axios.get(`/system/user/${id}`).then(res=>{
        return res.data
    })
}

/**
 * 消息中心
 */
const getMessageList = (params) => {
    return axios.get(`/system/message`,{params:params}).then(res => {
        return res.data
    })
}
const getMessageCount = (params) => {
    return axios.get(`/system/message/checkMessage`).then(res => {
        return res
    })
}
const delMessage = (params) => {
    return axios.delete(`/system/message`,{data:params})
}
const allDelMessage = (params) => {
    return axios.get(`/system/message/allDelete`)
}
const updateMessage = (params) => {
    return axios.put(`/system/message`,params)
}
const allUpdateMessage = (params) => {
    return axios.get(`/system/message/allFlag`,formConfig)
}
/**
 * 日志中心
 */
const getLogList = (params) => {
    return axios.get(`/system/loginlog`,{params:params}).then(res => {
        return res
    })
}
const addLog = (params) => {
    return axios.get(`/system/loginlog/add`).then(res => {
        return res
    })
}

/***    
 * 获取用户路由
 */
const getUserRouter = (params) => {
    return axios.get(`/system/menu/getUserRouter`).then(res => {
        return res
    })
} 
export default {
    //个人中心
    getUser,
    checkPassword,
    changePassword,
    changeUser,
    userAdd,
    getRoles,
    //角色管理
    addRole,
    delRole,
    getRoleMenu,
    getRoleInfo,
    updateRole,
    //c菜单管理
    getMenuList,
    menuAdd,
    menuUpdate,
    menuDel,
    getMenuInfo,
    getUserRouter,

    //组织结构
    getDept,
    getUserByDept,
    getUserById,
    addDept,
    updateDept,
    delDept,
    delUser,
    //消息中心
    getMessageList,
    delMessage,
    updateMessage,
    allUpdateMessage,
    allDelMessage,
    getMessageCount,
    //日志中心
    getLogList,addLog

}