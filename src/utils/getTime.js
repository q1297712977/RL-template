const getTime = (number, key = null) => {
    const num = parseInt(number);
    const date = new Date();
    let year = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();
    if (day <= num) {
        if (mon > 1) {
            mon = mon - 1;
        } else {
            year = year - 1;
            mon = 12;
        }
    }
    const arr = new Array()
    if (key == null) {
        for (let i = num - 1; i > 0; i--) {
            date.setDate(date.getDate() - 1);
            year = date.getFullYear();
            mon = date.getMonth() + 1;
            day = date.getDate();
            // const s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
            const s = (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
            let data = {
                date: s,
                duration: Math.floor(Math.random() * 23 + 1),

            }
            arr[i - 1] = data

        }
    } else {
        for (let i = num - 1; i > 0; i--) {
            date.setDate(date.getDate() - 1);
            year = date.getFullYear();
            mon = date.getMonth() + 1;
            day = date.getDate();
            // const s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
            const s = (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
            let data = {
                date: s,
                duration: Math.floor(Math.random() * 23 + 1),
                num: Math.floor(Math.random() * 5 + 1)

            }
            arr[i - 1] = data

        }
    }

    return arr
}
const getToday = () => {
    // 获取当前日期
    var date = new Date();

    // 获取当前月份
    var nowMonth = date.getMonth() + 1;

    // 获取当前是几号
    var strDate = date.getDate();

    // 添加分隔符“-”
    var seperator = "-";

    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }

    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    var nowDate =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
    return nowDate;
}
export default {
    getTime,
    getToday
}