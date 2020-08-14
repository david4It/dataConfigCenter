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

let model = {};
let editor,viewId,selectedChartIndex;
let globalWidgetData;
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
			//console.log(data.field);
			let uid=$.cookie("uid");
			data.field.id=uid;
			data.field.projectId=localStorage.getItem("projectId");
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
		//console.log("view data: ",data);
		if(data.value === "") return false;
		viewId = data.value;
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
					model = data.data.model;
					$('#valueType').empty();
					$('#categoryType').empty();
					let jsonModel = JSON.parse(data.data.model);
					for(let prop in jsonModel) {
						let dimensionDetail = jsonModel[prop];
						//console.log(dimensionDetail);
						//console.log(dimensionDetail.modelType);
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
		//console.log("id:",e.target.id);
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
		let item = document.getElementById(data);
		//console.log("item: ", item);
		//console.log("item.lay-filter: ",item.getAttribute("lay-filter"));
		let cat = item.getAttribute("lay-filter");
		let newLi = document.createElement("li");
		newLi.innerText=data;
		newLi.style ='width:100%;margin-top:0.5rem;margin-left: 0rem; float:left;background-color: #009688;color:white';
		newLi.classList.add('layui-btn','layui-btn-primary');
		newLi.setAttribute("data-value",data);
		//监听删除
		newLi.addEventListener("click", function()
		{
			let target = this.parentNode;
			target.removeChild(this);
			//monitor charts change
			moniteChartsChange();
			//end monitor
		});
		//添加提醒
		newLi.addEventListener("mouseover", function()
		{
			layer.tips("点我可以删除",this, {tips : 1})
		});
		let targetItem = ev.target;
		let targetId = targetItem.getAttribute("id");
		if(cat ==="value" && targetId ==="dragedValue"){
			newLi.setAttribute("id","value_"+data);
			let doc = document.getElementById("dragedValue");
			doc.appendChild(newLi);
		}else if(cat ==="category" && targetId ==="dragedDimesion"){
			//category
			newLi.setAttribute("id","dimesion_"+data);
			let doc = document.getElementById("dragedDimesion");
			doc.appendChild(newLi);
		}else if(cat ==="category" && targetId ==="dragedFilter"){
			//fiter
			newLi.setAttribute("id","filter_"+data);
			let doc = document.getElementById("dragedFilter");
			doc.appendChild(newLi);
		}else{
			//do nothing.
		}
		//monitor charts change
		moniteChartsChange();
		//end monitor
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
function saveWidget() {
	let projectId = localStorage.getItem("projectId");
	let name = $("#name").val();
	let description = $("#description").val();
	//取category columns
	let ret = getCategoriesAndValues();
	let aggregators = ret.aggregators;
	let groups = ret.groups;

	let config={};
	config.mode="chart";
	config.model = model;
	config.cache = false;
	config.expired = 300;
	config.autoLoadData = true;
	config.selectedChart = selectedChartIndex;
	config.cols = buildCols(groups);
	config.metrics = buildMetrics(aggregators);
	config.filters = buildFilters();
	config.control = buildControl();
	$.ajax({
		url: "/api/v3/widgets",
		type: "Post",
		data: JSON.stringify({"projectId":projectId,"viewId":viewId,"name":name,"type":1,"uid":$.cookie("uid"),"config":JSON.stringify(config),"description":description,"publish":true}),
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
	let projectId = localStorage.getItem("projectId");
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
				//console.log(data.data);
				$('#viewId').append(new Option("",""));
				$.each(data.data,function(index,item){
					//console.log(item);
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
/**
 * monitor charts change
 */
function moniteChartsChange(){
	//监控可以显示的图表display-icon
	let categroys = document.getElementById("dragedDimesion").childElementCount;
	let values = document.getElementById("dragedValue").childElementCount;
	//清除之前痕迹
	$(".fa-bar-chart").removeClass("display-icon");
	$(".fa-line-chart").removeClass("display-icon");
	$(".fa-pie-chart").removeClass("display-icon");
	$(".fa-globe").removeClass("display-icon");
	switch (categroys) {
		case 0:
			//仪表盘
			switch (values) {
				case 0:
					//
					break;
				case 1:
					//仪表盘
					break;
				case 2:
					break;
				default:
					;
			}
			break;
		case 1:
			//表格，富文本
			switch (values) {
				case 0:
					//饼图, 地图，表格
					break;
				case 1:
					//折线图，柱状图，饼图, 地图，表格
					$(".fa-bar-chart").addClass("display-icon");
					$(".fa-line-chart").addClass("display-icon");
					$(".fa-pie-chart").addClass("display-icon");
					break;
				case 2:
					break;
				default:
					;
			}
			break;
		case 2:
			//表格，富文本
			switch (values) {
				case 0:
					//饼图, 地图，表格
					break;
				case 1:
					//饼图, 地图，表格
					$(".fa-pie-chart").addClass("display-icon");
					break;
				case 2:
					break;
				default:
					;
			}
			break;
		case 3:
			//表格，富文本
			switch (values) {
				case 0:
					//饼图, 地图，表格
					break;
				case 1:
					//饼图, 地图，表格
					$(".fa-pie-chart").addClass("display-icon");
					break;
				case 2:
					break;
				default:
					;
			}
			break;
		default:

			;
	}
}
/**
 * render graphics
 */
function renderGraph(obj,type,id){
	if(id == null || id  === "") id="graphArea";
	console.log("type = "  + type);
	//改变颜色  mouseclick-icon
	getDataByViewId(layer,null);
	let retData = buildPieData(globalWidgetData);
	let bizData = retData.showedData;
	let legendData = retData.legendData;
	switch (type) {
		case "area":
			selectedChartIndex = 1;
			renderAreaLine(id,"",legendData,bizData);
			break;
		case "bar":
			selectedChartIndex = 2;
			renderBar(id,"",legendData,bizData);
			break;
		case "line":
			selectedChartIndex = 3;
			renderLine(id,"",legendData,bizData);
			break;
		case "pie":
			selectedChartIndex = 4;
			renderPie(id,"",legendData,bizData);
			break;
		case "map":
			selectedChartIndex = 5;
			renderPie(id,"",legendData,bizData);
			break;
		default:
			break;
	}
}
/**
 * get view data by view id
 * /1/getdata
 */
function getDataByViewId(layer,form) {
	// 构造request data
	let aggregators = [],
		groups=[],
		cache=false,
		expired=0,
		filters= [],
		flush= false,
		nativeQuery=false,
		orders= [],
		pageNo=0,
		pageSize= 0;

	//取category columns
	let ret = getCategoriesAndValues();
	aggregators = ret.aggregators;
	groups = ret.groups;
	//取 Filters columns //TODO:
	let data = JSON.stringify({aggregators:aggregators,groups:groups,cache: false,expired: 0,filters: [],
		flush: false,nativeQuery: false,orders: [],pageNo: 0,pageSize: 0});
	$.ajax({
		url: "/api/v3/views/"+viewId + "/getdata",
		type: "POST",
		dataType: "json",
		data: data,
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
				console.log(data);

				$.cookie("token",data.token,{
					expires: 10
				});
				globalWidgetData = data;
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

/**
 * 获取要展示的维度和指标
 */
function getCategoriesAndValues(){
	let aggregators = [],
		groups=[];
	let ret={};
	//取category columns
	let cateoryNodes = document.getElementById("dragedDimesion").childNodes;
	let j = 0;
	for(let i=0;i<cateoryNodes.length;i++){
		if(i==0) continue;
		let dataValue = cateoryNodes[i].getAttribute("data-value");
		if(dataValue != null){
			groups[j] = dataValue;
			j++;
		}
	}
	//取 value columns
	let valueNodes = document.getElementById("dragedValue").childNodes;
	let k = 0;
	for(let i=0;i<valueNodes.length;i++){
		if(i==0) continue;
		let dataValue = valueNodes[i].getAttribute("data-value");
		if(dataValue != null){
			let temp = {};
			temp.column = dataValue;
			temp.func = "sum";
			aggregators[k] = temp;
			k++;
		}
	}
	ret.aggregators=aggregators;
	ret.groups = groups;
	return ret;
}

/**
 * build cols to show graph
 * @param groups []
 * @returns {Array}
 */
function buildCols(groups){
	let cols = [];
	let i = 0;
	let jsonModel = JSON.parse(model);
	for( let prop in jsonModel){
		for(let j in groups){
			let group = groups[j];
			if(prop !== group ) continue;
			let oneCol = {};
			oneCol.name = prop;
			let tmp = jsonModel[prop];
			oneCol.visualType = tmp.visualType;
			oneCol.type = tmp.modeType;
			oneCol.config = true;
			oneCol.field={alias: "",desc:"",useExpression:false}
			cols[i] = oneCol;
		}
	}
	return cols;
}
function  buildMetrics(aggregators){
	let cols = [];
	let i = 0;
	let jsonModel = JSON.parse(model);
	for( let prop in jsonModel){
		for(let j in aggregators){
			let aggregator = aggregators[j].column;
			if(prop !== aggregator ) continue;
			let oneCol = {};
			oneCol.name = prop;
			let tmp = jsonModel[prop];
			oneCol.visualType = tmp.visualType;
			oneCol.type = "value";
			oneCol.config = true;
			oneCol.field={alias: "",desc:"",useExpression:false}
			cols[i] = oneCol;
		}
	}
	return cols;
}
function  buildFilters(){
	let filters = [];
	return filters;
}
function  buildControl(){
	let control = [];
	return control;
}
