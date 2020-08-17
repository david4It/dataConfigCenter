
let colsData;
let model = {};
let editor;
layui.use(['element', 'form', 'layedit', 'laydate', 'colorpicker','table'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        layedit = layui.layedit,
        laydate = layui.laydate,
		table = layui.table,
		colorpicker = layui.colorpicker;

	let token = $.cookie("token");
	//console.log("cookie: " , token);
	window.closeCurrentWindow = function (){
		let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		layer.msg(index);
		parent.layer.close(index); //再执行关闭
	}
	//end close
	/**
	 * 操作管理--数据操作
	 * @param String url 请求路径
	 * @param json data.field 提交的json数据
	 * @return json code 0:操作成功；1:value 返回操作后的状态
	 */
    form.on('submit(execute)', function(data) {
		console.log(data.field);
		let variable = data.field;
		let name = data.field.name;
		window.parent.addMap(data.field);
		console.log(window.parent.variablesMap);
    });

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
	form.render();
});
