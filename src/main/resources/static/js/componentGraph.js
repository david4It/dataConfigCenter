/**
 * generate id
 * @param widget
 * @returns {string}
 */
function generateWidgetHtmlID(widget){
    return 'component_' + widget.id;
}

/**
 * 单独渲染widget图像
 * @param widgetId
 * @param title
 * @param queryVal: widget 查询参数，维度数据，多维参数要注意修改视图表达式。
 * @param htmlTargetId
 * @param param
 */
function generateWidgetGraph(widgetId,title,queryVal,htmlTargetId,param) {
    let widget = getWidgetByWidgetID(widgetId);
    let grahpId = htmlTargetId;
    let config = JSON.parse(widget.config)
    let graphType=parseInt(config.selectedChart);
    //渲染图形
    switch (graphType) {
        case 1:
            //面积图
            renderWidgetGraph(widget,"area",grahpId,title,queryVal,param);
            break;
        case 2:
            //柱状图
            renderWidgetGraph(widget,"bar",grahpId,title,queryVal,param);
            break;
        case 3:
            //折线图
            renderWidgetGraph(widget,"line",grahpId,title,queryVal,param);
            break;
        case 4:
            //饼图
            console.log("original title:" + title);
            renderWidgetGraph(widget,"pie",grahpId,title,queryVal,param);
            break;
        case 5:
            //地图
            renderWidgetGraph(widget,"map",grahpId,title,queryVal,param);
            break;
        case 6:
            break;
        default:
            break;
    }
}

/**
 * render graphics
 * @param widget
 * @param type
 * @param id
 */
function renderDispGraph(widget,type,id){
    if(id == null || id  === "")
        id="graphArea";

    let viewData = getViewDataByViewId(widget);
    let graphData = buildGraphData(viewData,widget);
    let bizData = graphData.showedData;
    let legendData = graphData.legendData;

    switch (type) {
        case "area":
            renderAreaLine(id,"",legendData,bizData);
            break;
        case "pie":
            renderPie(id,"",legendData,bizData);
            break;
        case "line":
            renderLine(id,"",legendData,bizData);
            break;
        case "bar":
            renderBar(id,"",legendData,bizData);
            break;
        case "map":
            renderPie(id,"",legendData,bizData);
            break;
        default:
            break;
    }
}
function renderWidgetGraph(widget,type,id,title,queryVal,param){
    if(id == null || id  === "")
        id="graphArea";
    let config = JSON.parse(widget.config);
    console.log("config:" , config)
    let viewData = getViewDataByViewId(widget,param,queryVal);
    let graphData = buildGraphData(viewData,widget);
    if(graphData == null) return;
    let bizData = graphData.showedData;
    let legendData = graphData.legendData;

    switch (type) {
        case "area":
            renderAreaLine(id,title,legendData,bizData);
            break;
        case "pie":
            renderPie(id,title,legendData,bizData);
            break;
        case "line":
            renderLine(id,title,legendData,bizData);
            break;
        case "bar":
            renderBar(id,title,legendData,bizData);
            break;
        case "map":
            renderPie(id,title,legendData,bizData);
            break;
        default:
            break;
    }
}

/**
 *  * get view data by view id
 * /1/getdata
 * @param widget
 * @param param
 * @param paramVal
 * @returns {*}
 */
function getViewDataByViewId(widget,param,paramVal) {
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
    let ret = null;
    //取category columns
    let catsAndVal = getCategoriesAndValuesFromWidgetData(widget);
    aggregators = catsAndVal.aggregators;
    groups = catsAndVal.groups;
    //build params
    let params =[];
    if(param !== null){
        let paramOne = {};
        paramOne.name= param;
        paramOne.value="'" + paramVal + "'";
        params[0]=paramOne;
    }
    //取 Filters columns //TODO:
    let data = JSON.stringify({aggregators:aggregators,groups:groups,cache: false,expired: 0,filters: [],
        flush: false,nativeQuery: false,orders: [],pageNo: 0,pageSize: 0,params:params});

    $.ajax({
        url: "/api/v3/views/"+ widget.viewId + "/getdata",
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
                $.cookie("token",data.token,{
                    expires: 10
                });
                ret = data;
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
        }
    });
    return ret;
}

/**
 * 获取要展示的维度和指标
 */
function getCategoriesAndValuesFromWidgetData(widget){
    let aggregators = [],
        groups=[];
    let ret={};
    //console.log("#### widgetData.config : ",widgetData.config)
    let config = JSON.parse(widget.config)
    //取category columns
    let cateoryNodes = config.cols;
    let j = 0;
    for(let i=0;i<cateoryNodes.length;i++){
        let oneCategory = cateoryNodes[i];
        let dataValue = oneCategory.name;
        if(dataValue != null){
            groups[j] = dataValue;
            j++;
        }
    }
    //取 value columns
    let valueNodes = config.metrics;
    let k = 0;
    for(let i=0;i<valueNodes.length;i++){
        let oneMetrics = valueNodes[i];
        let dataValue = oneMetrics.name;
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
 * build legendData & showed data.
 * @param viewData
 */
function buildGraphData(viewData,widget) {
    if(viewData == null ) return ;
    let legendData=[], showedData=[];
    let bizData = viewData.data.resultList;
    //取category columns
    let catsAndVals = getCategoriesAndValuesFromWidgetData(widget);
    let categories = catsAndVals.groups;
    let values = catsAndVals.aggregators;
    for(let i in bizData){
        let mapData = {};
        //get legendData
        let key = "";
        let oneData = bizData[i];
        for(let prop in categories){
            // console.log("categories[prop] --> " ,categories[prop]);
            //console.log("oneData[categories[prop]] --> " ,oneData[categories[prop]]);
            key += oneData[categories[prop]]==null?"":oneData[categories[prop]];
        }
        legendData[i]= key;
        //build value key
        for(let prop in values){
            let valueKey = "";
            if(values[prop].func != null && values[prop].func.length > 0){
                valueKey = values[prop].func  + "(" + values[prop].column + ")";
            }else{
                valueKey += values[prop].column;
            }
            //get biz data
            mapData.name=key;
            mapData.value=oneData[valueKey]==null?0:oneData[valueKey];
            showedData[i] = mapData;
        }
    }
    let retData ={};
    retData.legendData = legendData;
    retData.showedData = showedData;
    return retData;
}

/**
 * get widget by widget id
 * @param widgetId
 * @returns {boolean}
 */
function getWidgetByWidgetID(widgetId){
    if(widgetId === "" || widgetId == null) return false;
    let ret = null;
    $.ajax({
        url: "/api/v3/widgets/"+ widgetId,
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
                ret = data.data;
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
    return ret;
}
/**
 * 一致widgets,绘制widget图像 。
 * @param obj
 */
function drawDispWidget(selectedWidgets) {
    //console.log("selected widgets",selectedWidgets)
    //保存数据
    // display select widget to canvas
    for(let prop in selectedWidgets){
        //console.log("prop",prop,selectedWidgets[prop]);
        let grahpId = "displayWidget_" + selectedWidgets[prop].id;
        let widgetViewId = selectedWidgets[prop].viewId;
        let config = JSON.parse(selectedWidgets[prop].config)
        let graphType=config.selectedChart;
        let widgetTitle = selectedWidgets[prop].name;
        addGraphWidget(grahpId,widgetViewId,graphType,widgetTitle);
        //渲染图形
        switch (graphType) {
            case 1:
                //面积图
                renderDispGraph(selectedWidgets[prop],"area",grahpId);
                break;
            case 2:
                //柱状图
                renderDispGraph(selectedWidgets[prop],"bar",grahpId);
                break;
            case 3:
                //折线图
                renderDispGraph(selectedWidgets[prop],"line",grahpId);
                break;
            case 4:
                //饼图
                renderDispGraph(selectedWidgets[prop],"pie",grahpId);
                break;
            case 5:
                //地图
                renderDispGraph(selectedWidgets[prop],"map",grahpId);
                break;
            case 6:
                break;
            default:
                break;
        }
    }
}
