layui.config({
	base: '{/}./js/framework/gridstack.js' //wangEditor.min.js目录，根据自己存放位置修改
});

layui.define(function(exports) {
	exports('ace.min', function(){
		demo:demo//这句没用，只是测试
	});
});

let colsData,dataList;
let model = {};
let editor,viewId;
let selectedWidget={};
layui.use(['element', 'form', 'layedit', 'laydate', 'colorpicker','table'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        laydate = layui.laydate,
		table = layui.table,
		colorpicker = layui.colorpicker;
	$('.layui-body').css('left', '1rem');
	$('.layui-body').css('top', '3.5rem');
	//$('.layui-input-inline').css('width', '180px');
	//设置下拉框样式在表格之上 不会遮挡下拉框
	$(".layui-table-body").css('overflow','visible');
	$(".layui-table-box").css('overflow','visible');
	$(".layui-table-view").css('overflow','visible');

	let token = $.cookie("token");

	var screenWith = document.body.clientWidth;
	var w0 = (screenWith-44) / 5;
	//console.log(screenWith,w0);
	table.render({
		id: 'idTest',
		elem: '#widgetSelect'  //绑定table id
		,url:'/api/v3/widgets?projectId=1'  //数据请求路径
		,xhrFields: {
			withCredentials: true //允许跨域带Cookie
		},
		headers: {
			"Authorization": token //此处放置请求到的用户token
		}
		,cellMinWidth: 0.2*w0
		,cols: [[
			{type:'checkbox'}
			,{field:'id',title: '序号'}
			,{field:'name', width:0.5*w0, title: '名称'}
			,{field:'description', width:1*w0, title: '描述', sort: true}
			,{field:'config', width:3*w0, title: '数据描述', sort: true}
			]]
		,page: true   //开启分页
		,response:{
			statusName:'code', //规定返回的状态码字段为code
			statusCode:0 //规定成功的状态码味200
		}
		, done: function (res, curr, count) {
			//console.log(res);
			dataList = res.data;
			$.cookie("token",res.token,{
				expires: 10
			});
		}

	});
	//监听复选框
	table.on('checkbox(demo)', function(obj){

		//console.log("selected data;" , selectedWidget);
	});
	//end 监听复选框
	//关闭弹窗
	//execute sql
	window.closeCurrentWindow = function (){
		let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		layer.msg(index);
		parent.layer.close(index); //再执行关闭
	}
	//end close
	// get 	selected widgets
	window.getSelectedWidget=function(){
		//console.log("Data=",dataList)
		let checkStatus = table.checkStatus('idTest');
		//console.log("checkStatus ： ", checkStatus);
		if(checkStatus.data.length === 0){
			//谷歌58版本下不兼容解决方法
			$(".laytable-cell-checkbox").each(function(i,item)
			{
				if($(item).find(".layui-form-checked").length>0){
					//该行是选中状态，根据索引i到tableData数组中找相应行的数据
					//console.log("line ： ",i,':', dataList[i-1].name);
					selectedWidget[dataList[i-1].id] = dataList[i-1];
				}

			});
		}else{
			//TODO:
			selectedWidget[data.id] = data.name;
		}
		//console.log("selectedWidget ： ", selectedWidget);
		return selectedWidget;
	}
	//end select widgets

});

function queryData(){
	//alert("query");
	executeSql();
}
