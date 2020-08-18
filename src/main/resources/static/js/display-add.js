/***
 * invoked by display-setting.html, to draw display page elements
 */

layui.config({
	base: '{/}./js/framework/gridstack.js' //wangEditor.min.js目录，根据自己存放位置修改
});

layui.define(function(exports) {
	exports('ace.min', function(){
		demo:demo//这句没用，只是测试
	});
});

let colsData,dataList,globalTempView;
let chartsMap = {};
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
	//共享displayID
	//console.log("displayId=" + getUrlParam("displayId"));
	if(getUrlParam("displayId") != null ) {
		localStorage.setItem('displayId', getUrlParam("displayId"))
	}
	let token = $.cookie("token");
	let projectId = localStorage.getItem("projectId");
	//console.log("projectId=" + projectId);
	var screenWith = document.body.clientWidth;
	var w0 = (screenWith-44) / 5;
	//console.log(screenWith,w0);
	table.render({
		id: 'idTest',
		elem: '#widgetSelect'  //绑定table id
		,url:'/api/v3/widgets?projectId=' + projectId  //数据请求路径
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
	//draw page
	drawPage();
	//end draw

});

function queryData(){
	//alert("query");
	executeSql();
}

/**
 * get view by view id
 * @param viewId
 * @returns {boolean}
 */
function getViewByViewID(viewId){
	if(viewId === "" || viewId == null) return false;
	$.ajax({
		url: "/api/v3/views/"+ viewId,
		type: "GET",
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true //允许跨域带Cookie
		},
		async: false,
		headers: {
			"Authorization":$.cookie("token")//此处放置请求到的用户token
		},
		success: function (data) {
			if (data.code == 0) {
				//layer.msg("查询成功", {icon: 1, time: 1000});
				globalTempView = data.data;
				$.cookie("token",data.token,{
					expires: 10
				});
				return false;
			} else {
				layer.msg("查询失败", {icon: 2, time: 1000});
				return false;
			}
		},
		fail: function (data) {
			layer.msg("查询失败", {icon: 2, time: 1000});
			return false;
		}
	});
}
function querySlides(){
	// 通过data.elem.dataset可以得到保存的对象id
	// data.elem.value可以得到下拉框选择的文本
	let firstSlideId = 1;
	let displayId = localStorage.getItem("displayId");
	if(displayId === "") return false;
	$.ajax({
		url: "/api/v3/displays/"+ displayId +"/slides",
		type: "GET",
		dataType: "json",
		contentType: "application/json;charset=utf-8",
		xhrFields: {
			withCredentials: true //允许跨域带Cookie
		},
		async: false,
		headers: {
			"Authorization":$.cookie("token")//此处放置请求到的用户token
		},
		success: function (data) {
			if (data.code == 0) {
				//layer.msg("查询成功", {icon: 1, time: 1000});
				let models = data.data.slides;
				let htmlStr = "";
				for(let prop in models) {
					let one = models[prop];
					firstSlideId = one.id;
					htmlStr += '<div style="display:block;border: solid 1px #bfbfbf;width: 8rem;height: 6rem;margin-top: 0.6rem "> '+ one.id +'</div>';

				}
				$('#slideDiv').html(htmlStr);
				$.cookie("token",data.token,{
					expires: 10
				});
			} else {
				layer.msg("查询失败", {icon: 2, time: 1000});
			}
		},
		fail: function (data) {
			layer.msg("查询失败", {icon: 2, time: 1000});
		}
	});
	return firstSlideId;
}

/**
 * preview display
 */
function previewDisplay() {
	saveLayout();
	let displayId = localStorage.getItem("displayId");
	window.location.href="display"+displayId;
}

/**
 * open display and draw page
 */
function drawPage() {

	let displayId = localStorage.getItem("displayId");
	//获取slide
	let firstSlideId = querySlides();
	console.log(displayId,firstSlideId);
	//获取memslidewidgets,views,widgets
	let slidePageData = getWidgets(displayId,firstSlideId);
	//
	console.log("pageData: ", slidePageData);
	drawDispWidget(slidePageData.widgets);
}
