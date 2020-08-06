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
let colsData;
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

	let token = $.cookie("token");
	getViewsByProjectId(layer,form);
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
			data.field.projectId=1;
			/*let config={};
			config.username=data.field.username;
			config.password = data.field.password;
			config.url = data.field.url;
			data.field.config= config;*/
            $.ajax({
                url:'/api/v3/views',

                type:'Post',
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
	/**
	 * 监听view下拉列表
	 */
	form.on('select(viewId)',function(data){
		// 通过data.elem.dataset可以得到保存的对象id
		// data.elem.value可以得到下拉框选择的文本
		console.log("view data: ",data);
		if(data.value === "") return false;
		$.ajax({
			url: "/api/v3/views/"+data.value,
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
					//console.log(data.data.model);
					$('#valueType').empty();
					$('#categoryType').empty();
					var jsonModel = JSON.parse(data.data.model);
					for(var prop in jsonModel) {
						var dimensionDetail = jsonModel[prop];
						console.log(dimensionDetail);
						console.log(dimensionDetail.modelType);
						if (dimensionDetail.modelType === "value") {
							$('#valueType').append('<li  lay-filter="value" id="'+prop +'" draggable="true"><i class="fa fa-sort-numeric-desc pading-right"></i>' + prop + '</li>');
						} else {
							//category : 维度
							$('#categoryType').append('<li lay-filter="category" id="'+prop +'"  draggable="true"><i class="fa fa-leaf pading-right"></i>' + prop + '</li>');
						}
					}

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
	});
	//end form select
	/**
	 * h5 拖拽
	 */
	document.ondragstart=function(e){
		/* 通过事件捕获来获取当前被拖拽的子元素*/
		e.target.style.opacity=0.5; //拖拽时p元素的透明度改变
		e.target.parentNode.style.borderWidth='5px'; //通过parentNpde找到拖拽元素的父元素改变样式
		/*通过dataTransfer来实现数据的存储与获取
             setData(format,data):
             format:数据的类型:text/html  text/uri-lsit
             Data:数据：一般来说是字符串
        */
		e.dataTransfer.setData("text/html",e.target.id)
		console.log("id:",e.target.id);
	}
	document.ondragend=function(e){
		/* 当拖拽元素返回原位时 还是回复原来的样式*/
		e.target.style.opacity=1;
		e.target.parentNode.style.borderWidth='1px';
	}
	/* 应用于目标元素的事件
    ondragenter    当拖拽元素进入时调用
    ondragover     当停留在目标元素上时调用
    ondrop         当在目标元素上松开鼠标时调用
    ondragleave    当鼠标离开目标元素时调用
   */
	document.ondragover=function(e){
		/*如果想触发事件，那么就必须在这个位置阻止浏览器的默认行为*/
		e.preventDefault();
	}
	/* 浏览器会默认阻止ondrop事件：我们必须在ondragover中阻止浏览器的默认行为*/
	document.ondrop=function(ev){
		/*添加元素*/
		/* 通过e.dataTransfer.setData存储的数据，只能在ondrop事件中获取*/
		let data = ev.dataTransfer.getData("text/html");
		let item = document.getElementById(data).cloneNode();
		console.log("item: ", item);
		console.log("item.lay-filter: ",item.getAttribute("lay-filter"));
		let cat = item.getAttribute("lay-filter");
		if(cat ==="value"){

		}else{
			//category
		}
		//console.log(data + "document:",document.getElementById(data));
		//console.log( "ev.target :",ev.target);
		var newLi = document.createElement("li");
		newLi.innerText=data;
		newLi.style ='width:100%;margin-top:0.5rem;float:left;';

		newLi.classList.add('layui-btn','layui-btn-primary');
		ev.target.appendChild(newLi);
	}
	//end h5 拖拽

});

function queryData(){
	//alert("query");
	executeSql();
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

	let projectId = 1;
	let name = $("#name").val();
	let description = $("#description").val();
	let sql = editor.getValue();
	$.ajax({
		url: "/api/v3/views",
		type: "Post",
		data: JSON.stringify({"projectId":projectId,"sourceId":sourceId,"name":name,"uid":$.cookie("uid"),"sql":sql,"model":JSON.stringify(model),"source":JSON.stringify(source),"description":description}),
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

/**
 * get views by project id
 */
function getViewsByProjectId(layer,form) {
	let projectId = 1;
	$.ajax({
		url: "/api/v3/views",
		type: "GET",
		data: {"projectId":projectId},
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
				console.log(data.data);
				$('#viewId').append(new Option("",""));
				$.each(data.data,function(index,item){
					console.log(item);
					//option 第一个参数是页面显示的值，第二个参数是传递到后台的值
					$('#viewId').append(new Option(item.name,item.id));//往下拉菜单里添加元素
					//设置value（这个值就可以是在更新的时候后台传递到前台的值）为2的值为默认选中
					//$('#viewId').val(1);
				})

				//form.render(); //更新全部表单内容
				form.render('select'); //刷新表单select选择框渲染
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
