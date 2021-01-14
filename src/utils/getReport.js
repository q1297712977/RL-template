const getReport = (start, end) => {
    let arr = Object
    let inList = new Array()
    let handleList = new Array()
    let quality = new Array()
    let rerun = new Array()
    if (start == end) {
        //12天的数据
        for (let index = 0; index < 24; index++) {
            inList.push(getTest(index, true))
            handleList.push(getTest(index, true))
            quality.push(getTest(index, true))
        }

    } else {
        let days = new Array()
        eachDay(start, end, (day) => {
            let str = (day.getMonth() + 1) + '-' + day.getDate()
            days.push(str)
        })
        for (let index = 0; index < days.length; index++) {
            inList.push(getTest(days[index]))
            handleList.push(getTest(days[index]))
            quality.push(getTest(days[index]))

        }
    }
    rerun.push({
        date: "补发补跑",
        duration: Math.floor(Math.random() * 23 + 1),
        num:Math.floor(Math.random() * 5 + 1)

    })
    rerun.push({
        date: "失败补跑",
        duration: Math.floor(Math.random() * 23 + 1),
        num:Math.floor(Math.random() * 5 + 1)

    })
    rerun.push({
        date: "历史补跑",
        duration: Math.floor(Math.random() * 23 + 1),
        num:Math.floor(Math.random() * 5 + 1)

    })
    arr = {
        inList,
        handleList,
        quality,
        rerun
    }
    return arr
}
const getTest = (index, time = false) => {
    let str = ''
    if (time) {
        str = index.toString() + ':00'
    } else {
        str = index.toString()
    }
    return {
        date: str,
        duration: Math.floor(Math.random() * 23 + 1),
    }
}
const eachDay = (start, end, callback) => {
    let a = new Date(start)
    let b = new Date(end)

    let unixA = a.getTime()
    let unixB = b.getTime()

    let dayStep = 86400000; // 一天
    for (; unixA <= unixB; unixA += dayStep) {
        callback(new Date(unixA))
    }
}
export default getReport