layui.config({
	base: '{/}./js/code/' //wangEditor.min.js目录，根据自己存放位置修改
});

layui.define(function(exports) {
	exports('ace.min', function(){
		demo:demo//这句没用，只是测试
	});
	exports('cb-complete-list', function(){
		demo:demo//这句没用，只是测试
	});
	exports('ext-beautify', function(){
		demo:demo//这句没用，只是测试
	});
	exports('ext-language_tools', function(){
		demo:demo//这句没用，只是测试
	});
	exports('mode-drools', function(){
		demo:demo//这句没用，只是测试
	});
	exports('theme-sqlserver', function(){
		demo:demo//这句没用，只是测试
	});
});

let myData=new Array();
let colsData,originalModel;
let model = {};
let editor;
layui.use(['element', 'form', 'layedit', 'laydate', 'colorpicker','table','ace.min'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        layedit = layui.layedit,
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
	let token = $.cookie("token");
	//console.log("cookie: " , token);
	let viewId = getUrlParam("viewId")
	localStorage.setItem("viewId",viewId);
	console.log("viewid = " + viewId)
	///api/v3/sources/test 数据源测试
	//steps
	steps({
		el: "#steps1",
		data: [
			{ title: "编写SQL", description: "" },
			{ title: "编辑数据模型与权限", description: "" }
		],
		active: 0,
		dataOrder: ["title", "line", "description"]
	});
	//ace code editor
	ace.config.set("basePath", "js/code/");
	editor = ace.edit("sqlArea");
	editor.setTheme("ace/theme/sqlserver");
	editor.getSession().setMode("ace/mode/sql");
	document.getElementById('sqlArea').style.fontSize='16px';//设置字体
	editor.resize();//编辑器自适应
	editor.setShowPrintMargin(false);//显示打印边线
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true//启用自动补全
	});

	/**
	 * 操作管理--数据操作
	 * @param String url 请求路径
	 * @param json data.field 提交的json数据
	 * @return json code 0:操作成功；1:value 返回操作后的状态
	 */
    form.on('submit(execute)', function(data) {
        layer.confirm('确认要保存吗？',function(index) {
			layer.load();
			console.log(data.field);
			let uid=$.cookie("uid");
			data.field.id=uid;
			data.field.projectId=localStorage.getItem("projectId");
            $.ajax({
                url:'/api/v3/views',
                type:'POST',
                data:JSON.stringify(data.field),
                dataType: "json",
				contentType: "application/json;charset=utf-8",
				xhrFields: {
					withCredentials: true //允许跨域带Cookie
				},
				headers: {
					"Authorization":$.cookie("token")//此处放置请求到的用户token
				},
                success: function (data) {
					layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.msg(data.msg, {icon: 1, time: 1000});
                        setTimeout(function () {
                            window.parent.location.reload();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        }, 1000);
                    } else {
                        layer.msg(data.msg, {icon: 2, time: 1000});
                        return false;
                    }
                },
				error : function(e){
					layer.closeAll('loading');
					layer.msg(e.responseText, {icon: 2, time: 1000});
				}
            });
            return false;
        });
        return false;
    });

	table.render({
		elem: '#orgList'  //绑定table id
		,url:'/api/v3/views?projectId=' + localStorage.getItem("projectId")  //数据请求路径
		,xhrFields: {
			withCredentials: true //允许跨域带Cookie
		},
		headers: {
			"Authorization": token //此处放置请求到的用户token
		}
		,cellMinWidth: 80
		,cols: [[
			{field:'id', width:50, title: 'ID', sort: true}
			,{field:'name', width:280, title: '名称'}
			,{field:'description', width:320, title: '描述', sort: true}
			,{field:'sourceName', width:120, title: '数据源', sort: true}
			,{fixed: 'right',title: '操作', width:180, align:'center', toolbar: '#toolBar'}//一个工具栏  具体请查看layui官网
		]]
		,page: true   //开启分页
		,response:{
			statusName:'code', //规定返回的状态码字段为code
			statusCode:0 //规定成功的状态码味200
		}
		, done: function (res, curr, count) {
			console.log(res);
			$.cookie("token",res.token,{
				expires: 10
			});
		}

	});

	//execute sql
	window.executeSql = function (){
		let limit = 500;
		let sourceId = 1;
		let sql = editor.getValue();
		//console.log(sql);
		//add variables
		let variables = [];
		let k = 0;
		for(let prop in variablesMap){
			variables[k] = variablesMap[prop];
			k++;
		}
		console.log(variables);
		//end
		table.render({
			elem: '#sqlResult'  //绑定table id
			,url:'/api/v3/views/executesql'  //数据请求路径
			,method:"POST"
			,dataType: "json"
			,contentType: "application/json;charset=utf-8"
			,where: {"limit":limit,"sourceId":sourceId,"uid":$.cookie("uid"),"sql":sql,"variables":variables}
			,xhrFields: {
				withCredentials: true //允许跨域带Cookie
			},
			headers: {
				"Authorization": token //此处放置请求到的用户token
			}
			,cellMinWidth: 80
			,cols: []
			,page: true   //开启分页
			,height: 'full-200'
			,response:{
				statusName:'code', //规定返回的状态码字段为code
				statusCode:0 //规定成功的状态码味200
			}
			,parseData: function(res) {  //res 即为原始返回的数据
				let packJson=res.data.columns;
				colsData = packJson;
				for(let i in packJson){
					//遍历packJson 数组时，i为索引
					myData[i]={field:packJson[i].name, width:150,title:packJson[i].name,sort: true}
				}

				$.cookie("token",res.token,{
					expires: 10
				});
				return {
					code: res.code,
					msg: res.msg,
					count: res.data.totalCount,
					data: res.data.resultList
				}
			}
			, done: function (res, curr, count) {
				//刷新表
				table.init('sqlResult',{//转换成静态表格
					cols:[myData]
					,data:res.data
					,limit:10
					,page: true   //开启分页
				});
			}

		});
	}
	// generate columns table
	window.generateModel = function (){
		let limit = 50;
		let sourceId = 1;
		let sql = editor.getValue();
		console.log(sql);
		//add variables
		let variables = [];
		let k = 0;
		for(let prop in variablesMap){
			variables[k] = variablesMap[prop];
			k++;
		}

		table.render({
			elem: '#dataModel'  //绑定table id
			,url:'/api/v3/views/executesql'  //数据请求路径
			,method:"POST"
			,dataType: "json"
			,contentType: "application/json;charset=utf-8"
			,where: {"limit":limit,"sourceId":sourceId,"uid":$.cookie("uid"),"sql":sql,"variables":variables}
			,xhrFields: {
				withCredentials: true //允许跨域带Cookie
			},
			headers: {
				"Authorization": token //此处放置请求到的用户token
			}
			,cols: [[
				{field:'name',  title: '字段名称', sort: true}
				,{field:'type',title: '字段类型', sort: true}
				,{field:'',  title: '模型数据类型', templet: '#selectModel' }
				,{ field: '', title: '可视化类型', templet: '#selectVisual'}
			]]
			,limit:50
			//,page: true   //开启分页
			,height: 'full-200'
			,response:{
				statusName:'code', //规定返回的状态码字段为code
				statusCode:0 //规定成功的状态码味200
			}
			,parseData: function(res) {  //res 即为原始返回的数据
				$.cookie("token",res.token,{
					expires: 10
				});
				return {
					code: res.code,
					msg: res.msg,
					count: res.data.columns.length,
					data: res.data.columns
				}
			}

		});

	}
	//end generate columns table
	form.on('select(visualType)',function(data){
		// 通过data.elem.dataset可以得到保存的对象id
		// data.elem.value可以得到下拉框选择的文本
		let id = data.elem.dataset.value; //当前数据的id
		let selectVal = data.elem.value; //当前字段变化的值

		for(let i in colsData){
			if(colsData[i].name === id){
				switch(selectVal) {
					case "数字":
						colsData[i].visualType = "number";
						break;
					case "字符":
						colsData[i].visualType = "string";
						break;
					case "日期":
						colsData[i].visualType = "date";
						break;
					case "地理国家":
						colsData[i].visualType = "geoCountry";
						break;
					case "地理省份":
						colsData[i].visualType = "geoProvince";
						break;
					case "地理城市":
						colsData[i].visualType = "geoCity";
						break;
					case "地理区县":
						colsData[i].visualType = "geoArea";
						break;
					case "经度":
						colsData[i].visualType = "longitude";
						break;
					case "纬度":
						colsData[i].visualType = "dimension";
						break;
					default:
						colsData[i].visualType = "string";
				}
			}
		}

	});
	form.on('select(modeType)',function(data){
		// 通过data.elem.dataset可以得到保存的对象id
		// data.elem.value可以得到下拉框选择的文本
		let id = data.elem.dataset.value; //当前数据的id
		let selectVal = data.elem.value; //当前字段变化的值
		for(let i in colsData){
			if(colsData[i].name === id){
				switch(selectVal) {
					case "维度":
						colsData[i].modelType = "category";
						break;
					case "指标":
						colsData[i].modelType = "value";
						break;
					default:
						colsData[i].modelType = "category";
				}
			}
		}

	});
	//end
	//initial view by id
	let viewModel = getViewByViewID(viewId);
	console.log(viewModel)
	editor.setValue(viewModel.sql,1);
	originalModel=JSON.parse(viewModel.model);

	//end
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
        shadeClose: false,
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

/**选项卡切换**/
var nav_id = $('.layui-this').data('nav');
$('#layui_nav_left_' + nav_id).show();

$('.layui-layout-left').find('.layui-nav-item').click(function () {
	var nav_id = $(this).data('nav');
	$('#layui_nav_left_' + nav_id).show().siblings().hide();
});

$('.layui-nav-child').find('dd').find('a').click(function () {
	var url = $(this).data('url');
	$('.layui-iframe').attr('src', url);
});
function queryData(){
	//alert("query");
	executeSql();
}
function goNext() {
	$("#firstStep").hide();
	$("#secondStep").show();
	steps({
		el: "#steps2",
		data: [
			{ title: "编写SQL", description: "" },
			{ title: "编辑数据模型与权限", description: "" }
		],
		active: 1,
		dataOrder: ["title", "line", "description"]
	});
	generateModel();
}
function goPast() {
	$("#firstStep").show();
	$("#secondStep").hide();
	steps({
		el: "#steps1",
		data: [
			{ title: "编写SQL", description: "" },
			{ title: "编辑数据模型与权限", description: "" }
		],
		active: 0,
		dataOrder: ["title", "line", "description"]
	});
}
function cancel(){
	goPast();
}

/**
 * 保存模型数据
 */
function saveModel() {
	//取数据模型
	for(let i in colsData){
		let one = {};
		one.visualType=colsData[i].visualType;
		one.modelType=colsData[i].modelType;
		one.sqlType=colsData[i].type;
		model[colsData[i].name]= one;
	}
	console.log("model json: ", model);

	//取data source
	let sourceId = 1;//$("#source").val();
	let sourceName = "eps";//$("#source").text;
	let source = {};
	source.id = sourceId;
	source.name=sourceName;

	let projectId = localStorage.getItem("projectId");
	let name = $("#name").val();
	let description = $("#description").val();
	let sql = editor.getValue();
	//add variables
	let variables = [];
	let k = 0;
	for(let prop in variablesMap){
		console.log(prop, variablesMap[prop]);
		variables[k] = variablesMap[prop];
		k++;
	}
	//end
	let viewId = localStorage.getItem("viewId");
	$.ajax({
		url: "/api/v3/views/"+ viewId,
		type: "PUT",
		data: JSON.stringify({"id":viewId,"projectId":projectId,"sourceId":sourceId,"name":name,"uid":$.cookie("uid"),"sql":sql,"model":JSON.stringify(model),"source":JSON.stringify(source),"description":description,"variables":variables}),
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
				layer.msg("保存成功", {icon: 1, time: 1000});

				$.cookie("token",data.token,{
					expires: 10
				});
				return false;
			} else {
				layer.msg("保存失败", {icon: 2, time: 1000});
				return false;
			}
		},
		fail: function (data) {
			layer.msg("保存失败", {icon: 2, time: 1000});
			return false;
		}
	});
}
function setDataChecked() {
	//originalModel
}