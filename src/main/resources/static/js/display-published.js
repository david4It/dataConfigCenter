layui.use(['element', 'form', 'layedit', 'laydate', 'upload', 'colorpicker','table'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        layedit = layui.layedit,
        laydate = layui.laydate,
		table = layui.table;
	getProjects("prjectId");
});
