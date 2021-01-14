import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store/index'



Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: Home,
    children: [{
        path: '/',
        name: 'Home',
        component: () => import('@/views/index/Index.vue'),
        meta: {
          title: '总览'
        }
      }, {
        path: '/system',
        component: () => import('@/components/layout/layout-header.vue'),
        children: [{
            path: '/',
            redirect: '/system/person',
          }, {
            path: '/system/person',
            name: 'PersonIndex',
            component: () => import('@/views/system/person/Index.vue'),
            meta: {
              title: '个人中心'
            }
          }, {
            path: '/system/message',
            name: 'MessageIndex',
            component: () => import('@/views/system/message/Index.vue'),
            meta: {
              title: '消息中心'
            }
          },
          {
            path: '/system/journal',
            name: 'JournalIndex',
            component: () => import('@/views/system/journal/Index.vue'),
            meta: {
              title: '日志中心'
            }
          },
          //组织结构
          {
            path: '/system/org',
            name: 'OrgIndex',
            component: () => import('@/views/system/user/org/Index.vue'),
            meta: {
              title: '组织结构'
            }
          },
          //组织结构
          {
            path: '/system/org/add',
            name: 'OrgAdd',
            component: () => import('@/views/system/user/org/Add.vue'),
            meta: {
              title: '新增成员'
            }
          },
          {
            path: '/system/org/edit',
            name: 'OrgEdit',
            component: () => import('@/views/system/user/org/Edit.vue'),
            meta: {
              title: '编辑成员'
            }
          },
          //角色管理
          {
            path: '/system/role',
            name: 'RoleIndex',
            component: () => import('@/views/system/user/role/Index.vue'),
            meta: {
              title: '角色管理'
            }
          },
          {
            path: '/system/role/add',
            name: 'RoleAdd',
            component: () => import('@/views/system/user/role/Add.vue'),
            meta: {
              title: '角色新增'
            }
          },
          {
            path: '/system/role/edit',
            name: 'RoleEdit',
            component: () => import('@/views/system/user/role/Edit.vue'),
            meta: {
              title: '角色编辑'
            }
          },
          {
            path: '/system/menu',
            name: 'MenuIndex',
            component: () => import('@/views/system/menu/Index.vue'),
            meta: {
              title: '菜单中心'
            }
          },
          {
            path: '/system/menu/add',
            name: 'MenuAdd',
            component: () => import('@/views/system/menu/Add.vue'),
            meta: {
              title: '菜单新增'
            }
          },
          {
            path: '/system/menu/edit',
            name: 'MenuEdit',
            component: () => import('@/views/system/menu/Edit.vue'),
            meta: {
              title: '菜单编辑'
            }
          },
        ]
      },
      /**
       * 轨迹回放
       */
      {
        path: '/track',
        name: 'TrackIndex',
        component: () => import('@/components/layout/layout-header.vue'),
        children:[
          {path:'/',
          component: () => import('@views/track/Index.vue'),
        
          meta: {
            title: '轨迹回放'
          }
        }
        ]
      },
      /**
       * 配置 configuration
       */
      {
        path: '/configuration',
        component: () => import('@/components/layout/layout-header.vue'),

        children: [{
            path: '/',
            redirect: '/configuration/index',
          }, {
            path: '/configuration/index',
            name: 'ConfigurationIndex',
            component: () => import('@/views/configuration/fleet/Index.vue'),
            meta: {
              title: '车队管理'
            }
          },
          {
            path: '/configuration/index/add',
            name: 'ConfigurationAdd',
            component: () => import('@/views/configuration/fleet/Add.vue'),
            meta: {
              title: '车队新增'
            }
          },
          {
            path: '/configuration/index/edit',
            name: 'ConfigurationEdit',
            component: () => import('@/views/configuration/fleet/Edit.vue'),
            meta: {
              title: '车队编辑'
            }
          },
          {
            path: '/configuration/model',
            name: 'ConfigurationModel',
            component: () => import('@/views/configuration/model/Index.vue'),
            meta: {
              title: '车型管理'
            }
          },
          {
            path: '/configuration/model/add',
            name: 'ConfigurationModelAdd',
            component: () => import('@/views/configuration/model/Add.vue'),
            meta: {
              title: '添加车型'
            }
          },
          {
            path: '/configuration/model/edit',
            name: 'ConfigurationModelEdit',
            component: () => import('@/views/configuration/model/Edit.vue'),
            meta: {
              title: '编辑车型'
            }
          },
          {
            path: '/configuration/vehicle',
            name: 'ConfigurationVehicle',
            component: () => import('@/views/configuration/vehicle/Index.vue'),
            meta: {
              title: '车辆管理'
            }
          },
          {
            path: '/configuration/vehicle/add',
            name: 'ConfigurationVehicleAdd',
            component: () => import('@/views/configuration/vehicle/Add.vue'),
            meta: {
              title: '添加车辆'
            }
          },
          {
            path: '/configuration/vehicle/edit',
            name: 'ConfigurationVehicleEdit',
            component: () => import('@/views/configuration/vehicle/Edit.vue'),
            meta: {
              title: '编辑车辆'
            }
          },
          {
            path: '/configuration/pact',
            name: 'ConfigurationPact',
            component: () => import('@/views/configuration/pact/Index.vue'),
            meta: {
              title: '协议管理'
            }
          },
          {
            path: '/configuration/pact/add',
            name: 'ConfigurationPactAdd',
            component: () => import('@/views/configuration/pact/Add.vue'),
            meta: {
              title: '添加协议'
            }
          },
          {
            path: '/configuration/pact/edit',
            name: 'ConfigurationPactEdit',
            component: () => import('@/views/configuration/pact/Edit.vue'),
            meta: {
              title: '编辑协议'
            }
          },
        ]
      },
      /**
       * 数据查询querydata
       */
      {
        path: '/querydata',
        component: () => import('@/components/layout/layout-header.vue'),
        children: [{
          path: '/',
          name: 'QuerydataIndex',
          component: () => import('@views/querydata/Index.vue'),
          meta:{
            title:'数据查询'
          }
        }]
      },
      /**
       * 报表report
       */
      {
        path: '/report',
        component: () => import('@/components/layout/layout-header.vue'),

        children: [{
            path: '/',
            redirect: '/report/index',
          },
          {
            path: '/report/index',
            component: () => import('@views/report/all/Index.vue'),
            meta: {
              title: '运行总报表'
            }
          },
          {
            path: '/report/day',
            component: () => import('@views/report/day/Index.vue'),
            meta: {
              title: '运行日报表'
            }
          },
          {
            path: '/report/month',
            component: () => import('@views/report/month/Index.vue'),
            meta: {
              title: '运行月报表'
            }
          },
          {
            path: '/report/alarm',
            component: () => import('@views/report/alarm/Index.vue'),
            meta: {
              title: '车辆报警报表'
            }
          },
          {
            path: '/report/route',
            component: () => import('@views/report/route/Index.vue'),
            meta: {
              title: '车辆行程报表'
            }
          },
        ]
      },
      /**
       * 对比contrast
       */
      {
        path: '/contrast',
        // name: 'ContrastIndex',
        // component: () => import('@views/contrast/Contrast.vue'),
        component: () => import('@/components/layout/layout-header.vue'),

        children: [{
            path: '/',
            redirect: '/contrast/index',
          },
          {
            path: '/contrast/index',
            component: () => import('@views/contrast/realtime/Index.vue'),
            meta: {
              title: '实时数据对比'
            }
          },
          {
            path: '/contrast/history',
            component: () => import('@views/contrast/history/Index.vue'),
            meta: {
              title: '历史数据对比'
            }
          },
        ]
      },
                  /**
       * 参数信息information
       */
      {
        path: '/information',
        // name: 'InformationIndex',
        component: () => import('@/components/layout/layout-header.vue'),
        children:[
          {
            path:'/',
            name:'InformationIndex',
            component: () => import('@views/information/Index.vue'),
            meta:{
              title:'参数信息'
            }
          }
        ]
      },
            /**
       * 报警monitor
       */
      {
        path: '/alarm',
        component: () => import('@/components/layout/layout-header.vue'),

        children: [{
            path: '/',
            redirect: '/alarm/index',
          },
          {
            path: '/alarm/index',
            component: () => import('@views/alarm/area/Index.vue'),
            meta: {
              title: '报警分布'
            }
          },
          {
            path: '/alarm/manager',
            name: 'AlarmManager',

            component: () => import('@views/alarm/manager/Index.vue'),
            meta: {
              title: '报警管理'
            }
          },
        ]

      },
            /**
       * 监控monitor
       */
      {
        path: '/monitor',
        component: () => import('@/components/layout/layout-header.vue'),

        children:[
          {
            path:'/',
            name: 'MonitorIndex',
            component: () => import('@views/monitor/Index.vue'),
            meta:{
              title:'监控'
            }
          }
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test.vue')
  },

]
const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

// 导航守卫
const whiteList = ['/login', '/404', '/', '/test'] // 不重定向白名单

const defaultTitle = '氢晨燃料电池监控系统'
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle
  // console.log(to,from)
  //开发环境一律方向
  next()
  return
  if (whiteList.indexOf(to.path) != -1) {
    next()
    return
  }
  let str = to.path.split('/')
  str.shift()
  let flag = false
  let strPath = ''
  // console.log(str)
  if (str.length == 1) {
    flag = true
    strPath = str + ':index:view'
  } else if (str.length == 2) {
    strPath = str[0] + ':' + str[1] + ':view'
  } else if (str.length == 3) {
    if (str[2] == 'view') {
      strPath = str[0] + ':' + str[1]
    } else {
      strPath = str[0] + ':' + str[1] + ':' + str[2]
    }
  } else {
    flag = false
  }
  let Roles = store.state.Roles ? store.state.Roles : localStorage.getItem('Roles')
  // console.log(Roles,strPath)
  if (Roles == '' || Roles == null || Roles == undefined) {
    if (whiteList.indexOf(to.path) != -1) {
      flag = true
    } else {
      flag = false
    }
  } else {
    if (Roles.indexOf(strPath) != -1) {
      flag = true
    } else {
      flag = false
    }
  }
  if (flag) {
    let token = localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : store.state.Authorization
    if (token == '' || token == null || token == undefined) {
      next('/login')
    } else {
      next()
    }
  } else {
    next('/')
  }
});
export default router
