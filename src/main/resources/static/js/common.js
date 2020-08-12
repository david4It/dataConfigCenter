
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

