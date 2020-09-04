let graphAnimationMap = new Map();
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

function getRequestParams() {
    let str = document.location.search.substr(1);
    if (str === "") {
        return null;
    } else {
        let params = document.location.search.substr(1).split("&");
        let obj = {};
        for (let i = 0; i < params.length; i++) {
            let kv = params[i].split("=");
            obj[kv[0]] = kv[1];
        }
        return obj;
    }
}

//清除值为空的属性
function clearDeep(obj) {
    if (!obj || !typeof obj === 'object') return;

    const keys = Object.keys(obj);
    for (let key of keys) {
        const val = obj[key];
        if (
            typeof val === 'undefined' ||
            ((typeof val === 'object' || typeof val === 'string') && !val)
        ) {
            // 如属性值为null或undefined或''，则将该属性删除
            delete obj[key]
        } else if (typeof val === 'object') {
            // 属性值为对象，递归调用
            clearDeep(obj[key]);

            if (Object.keys(obj[key]).length === 0) {
                // 如某属性的值为不包含任何属性的独享，则将该属性删除
                delete obj[key]
            }
        }
    }
}

function deepCopy(obj) {
    if (obj === null) return null;
    if (typeof obj !== 'object') return obj;
    if (obj.constructor === Date) return new Date(obj);
    if (obj.constructor === RegExp) return new RegExp(obj);
    let newObj = new obj.constructor();  //保持继承链
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {   //不遍历其原型链上的属性
            let val = obj[key];
            newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; // 使用arguments.callee解除与函数名的耦合
        }
    }
    return newObj;
}


function forwardUrl(data, url) {
    let params = "";
    for (let key in data) {
        if (data[key]) {
            params += '&' + key + '=' + data[key];
        }
    }
    url = url + '?' + params.substr(1, params.length);
    window.location.href = encodeURI(url);
}