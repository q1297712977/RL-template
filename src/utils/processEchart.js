const processEchart = (data) => {
    // console.log(data)
    let [max, min] = getMaxMin(data)
    let type =changeHour(max)
    let text =''
    if(type=='minute'){
        text='(分钟)'
    }else{
        text='(小时)'
    }
    let newArr = changeData(data,type)
    return [newArr,text]
}
const getMaxMin = (data) => {
    let arr = new Array
    data.forEach((item) => {
        arr.push(item.duration)
    })
    var max = Math.max(...arr);
    var min = Math.min(...arr);
    return [max, min]
}
const changeHour=(max)=>{
    let sixHour=6*60*60*1000
    if(max>sixHour){
        return 'hour'
    }else{
        return 'minute'
    }
}
const changeData=(data,type='hour')=>{
    let arr = []
    let str=Number
    if(type=='hour'){
         str = 60*60*1000
    }else{
        str =60*1000
    }

    data.forEach((item)=>{
        let dur =0
        if(item.duration/str!=0){
           dur= parseInt((item.duration/str).toFixed(2))
        }
    
        arr.push({date:item.date,duration: dur})
    })
    return arr
}
export default processEchart