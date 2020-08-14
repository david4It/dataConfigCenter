layui.use(['element', 'form', 'layedit', 'laydate', 'colorpicker','table'], function(){
	var form = layui.form,
		layer = layui.layer,
		element = layui.element,
		layedit = layui.layedit,
		laydate = layui.laydate,
		table = layui.table,
		colorpicker = layui.colorpicker;
	getProjects("projectId")
	getDisplays("displayId");
	getSampleDisps("sampleId")
});
