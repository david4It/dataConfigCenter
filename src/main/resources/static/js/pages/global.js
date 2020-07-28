function dateFormat(fmt, date) {
    let o = {
        "M+" : date.getMonth()+1,     //月份
        "d+" : date.getDate(),     //日
        "h+" : date.getHours(),     //小时
        "m+" : date.getMinutes(),     //分
        "s+" : date.getSeconds(),     //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S" : date.getMilliseconds()    //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

function getCookies(key) {
    let str = document.cookie;
    if (str.length === 0) {
        return null;
    }

    let map = new Map();
    let cookieArr = str.split(";");
    cookieArr.forEach((val) => {
        map.set(val.split("=")[0], val.split("=")[1]);
    });
    return map.get(key);
}

function mergeRecursive(obj1, obj2) {
    for (let p in obj2) {
        try {
            if ( obj2[p].constructor===Object ) {
                //递归调用
                obj1[p] = mergeRecursive(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch(e) {
            obj1[p] = obj2[p];

        }
    }

    return obj1;
}
