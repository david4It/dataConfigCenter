
/**
 * 操作管理--打开界面
 * @param String title 界面标题
 * @param String url 访问路径
 * @param int width 打开宽度
 * @param int height 打开高度
 */
let index;
function execute_open(title, url, width, height) {
   index = layer.open({
        type: 2,
        title: ''+ title +'',
        shadeClose: true,
        shade: 0.8,
        area: [''+ width +'px', ''+ height +'px'],
        content: ''+ url +'',
    });
}
function close() {
    layer.close(index)
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}
/**
 * 取消按钮
 */
function cancelDoNothing(){
   //do nothing.
}
function checkGraphType(graphType){
    let type = "area";
    graphType = parseInt(graphType);
    switch (graphType) {
        case 1:
            //面积图
            type = "area";
            break;
        case 2:
            //柱状图
            type = "bar";
            break;
        case 3:
            //折线图
            type = "line";
            break;
        case 4:
            //饼图
            type = "pie";
            break;
        case 5:
            //地图
            type = "map";
            break;
        case 6:
            type = "area";//TODO: 避免数据库值为空
            break;
        default:
            type = "area";
            break;
    }
    return type;
}
function getGraphName(graphType){
    let type = "饼图";
    graphType = parseInt(graphType);
    switch (graphType) {
        case 1:
            //面积图
            type = "面积图";
            break;
        case 2:
            //柱状图
            type = "柱状图";
            break;
        case 3:
            //折线图
            type = "折线图";
            break;
        case 4:
            //饼图
            type = "饼图";
            break;
        case 5:
            //地图
            type = "地图";
            break;
        case 6:
            type = "面积图";//TODO: 避免数据库值为空
            break;
        default:
            type = "面积图";
            break;
    }
    return type;
}
/**
 * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
 **/

function isNumber(val){

    let regPos = /^\d+(\.\d+)?$/; //非负浮点数
    if(regPos.test(val)){
        return true;
    }else{
        return false;
    }

}

/**
 *
 * @param selectVal
 */
function convertCategory( selectVal) {
    let visualType = "string";
    switch(selectVal) {
        case "数字":
            visualType = "number";
            break;
        case "字符":
            visualType = "string";
            break;
        case "日期":
            visualType = "date";
            break;
        case "地理国家":
           visualType = "geoCountry";
            break;
        case "地理省份":
            visualType = "geoProvince";
            break;
        case "地理城市":
           visualType = "geoCity";
            break;
        case "地理区县":
            visualType = "geoArea";
            break;
        case "经度":
            visualType = "longitude";
            break;
        case "纬度":
           visualType = "dimension";
            break;
        default:
            visualType = "string";
    }
    return visualType;
}

/**
 *
 * @param selectVal
 */
function convertCategory2Hanzi( selectVal) {
    let visualType = "string";
    switch(selectVal) {
        case "number":
            visualType = "数字";
            break;
        case "string":
            visualType = "字符";
            break;
        case "date":
            visualType = "日期";
            break;
        case "geoCountry":
            visualType = "地理国家";
            break;
        case "geoProvince":
            visualType = "地理省份";
            break;
        case "geoCity":
            visualType = "地理城市";
            break;
        case "geoArea":
            visualType = "地理区县";
            break;
        case "longitude":
            visualType = "经度";
            break;
        case "dimension":
            visualType = "纬度";
            break;
        default:
            visualType = "字符";
    }
    return visualType;
}
