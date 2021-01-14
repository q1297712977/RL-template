const getColumns = (data,status=false) => {
    let arr =[]
    data.forEach((item,i)=>{
        arr.push(  {
            title: item,
            dataIndex: "index"+i,
            key: "index"+i,
            align: "center",
            ellipsis: true
          },)
    })
    if(status){
        arr.push(  {
            title: "操作",
            dataIndex: "operation",
            align: "center",
            key: "operation",
            width:'14%',
            scopedSlots: { customRender: "operation" },
          },)
    }
    return arr
}
const getData = (data) => {
    let arr =[]
    for (let index = 0; index < 30; index++) {
        let obj ={}
        for (let i = 0; i < data.length; i++) {
            obj['index'+i] = '测试'+data[i] +index 
        }  
        arr.push(obj)
    }
    return arr
}

export default {getData,getColumns}