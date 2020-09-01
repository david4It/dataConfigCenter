layui.use(['element', 'form', 'layedit', 'laydate', 'upload', 'colorpicker','table'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        layedit = layui.layedit,
        laydate = layui.laydate,
        upload = layui.upload,
		table = layui.table,
		colorpicker = layui.colorpicker;

	/**日期选择**/
		/**开始日期**/
	laydate.render({elem: '#start_time', type: 'datetime'});
		/**结束日期**/
    laydate.render({elem: '#end_time', type: 'datetime'});

	/**颜色选择**/
	colorpicker.render({
		elem: '#font-color',
		color: '#1c97f5',
		done: function(color){
			$('#font-color-input').val(color);
		}
	});
	//let token = $.cookie("token");
	//console.log("cookie: " , token);
	let title = getUrlParam("title");
	let queryName = getUrlParam("queryName");
	let widgetId = getUrlParam("widgetId");
	if(widgetId != null && widgetId !== "") {
		let widget = getWidgetByWidgetID(widgetId);
		let viewObj = getViewByViewID(widget.viewId);
		let variableAry = JSON.parse(viewObj.variable);
		console.log("view", variableAry)
		let firstParam = null;
		console.log("title", title)
		if (variableAry.length > 0) {
			$.each(variableAry, function (index, item) {
				//$('#varDiv').append('<label><select id="sel_'+item.name+'" name="paramId"  lay-filter="paramId"></select>');
				//if(firstParam == null) firstParam = item.name;
			})
			/*if(variableAry.length > 1)
                $("#varDiv").show();*/
		}
		//console
		generateWidgetGraph(widgetId, title, queryName, "graphId", firstParam);

		//trigger select
		/*	$('#selectVariable').change(() => {
                generateWidgetGraph(widgetId,title,queryName,"graphId",$("#selectVariable").val());
            });*/
	}


});

/**
 * 操作管理--打开界面
 * @param String title 界面标题
 * @param String url 访问路径
 * @param int width 打开宽度
 * @param int height 打开高度
 */
function execute_open(title, url, width, height) {
    layer.open({
        type: 2,
        title: ''+ title +'',
        shadeClose: true,
        shade: 0.8,
        area: [''+ width +'px', ''+ height +'px'],
        content: ''+ url +'',
    });
}

/**
 * 操作管理--数据删除
 * @param object obj 当前操作对象
 * @param int id 操作ID
 * @param String url 访问路径
 * @return json code 0:操作成功；1:操作失败
 */
function execute_del(obj, id, url) {
    layer.confirm('确认要删除吗？', function(index) {
		layer.load();
        $.ajax({
            url:''+ url +'',
            type:'Delete',
            success:function(data) {
				layer.closeAll('loading');
                if (data.code == 0) {
                    $(obj).parents("tr").remove();
                    layer.msg(data.msg,{icon:1,time:1000});return false;
                } else {
                    layer.msg(data.msg,{icon:2,time:1000});return false;
                }
            },
			error : function(e){
				layer.closeAll('loading');
				layer.msg(e.responseText, {icon: 2, time: 1000});
			}
        });
    });
}

