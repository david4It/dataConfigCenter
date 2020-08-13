
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
