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
            //console.log("original title:" + title);
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
            let config = widget.config;
            if(config.map == null) {
                let map = {};
                map['mapName']='cdArea';
                map['areaName']='chengdu';
                config.map = map;
            }
            renderMap(id,"",legendData,bizData,config);
            break;
        default:
            break;
    }
}
function renderWidgetGraph(widget,type,id,title,queryVal,param){
    if(id == null || id  === "")
        id="graphArea";
    let config = JSON.parse(widget.config);
    //console.log("config:" , config)
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
            if(config.map == null) {
                let map = {};
                map['mapName']='cdArea';
                map['areaName']='chengdu';
                config.map = map;
            }
            renderMap(id,title,legendData,bizData,config);
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
    if(paramVal != null) {
        let values = paramVal.split("-");
        console.log("values", values);
        let widgetView = getViewByViewID(widget.viewId);
        console.log("view: ", widgetView);
        let variables = widgetView.variables;
        for (let prop in variables) {
            if (values[prop] == null) break;
            let paramOne = {};
            paramOne.name = variables[prop].name;
            paramOne.value = "'" + values[prop] + "'";
            params[prop] = paramOne;
        }
    }
    //取 Filters columns //TODO:
    let data = JSON.stringify({aggregators:aggregators,groups:groups,cache: cache,expired: expired,filters: filters,
        flush: flush,nativeQuery: nativeQuery,orders: orders,pageNo:pageNo,pageSize: pageSize,params:params});

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
    let catLength = categories.length;
    let catI = 0;
    let values = catsAndVals.aggregators;
    for(let i in bizData){
        let mapData = {};
        //get legendData
        let key = "";
        let oneData = bizData[i];
        for(let prop in categories){
            // console.log("categories[prop] --> " ,categories[prop]);
            //console.log("oneData[categories[prop]] --> " ,oneData[categories[prop]]);
            if(catLength === 1){
                key += oneData[categories[prop]]==null?"":oneData[categories[prop]];
                break;
            }
            if(catLength > 1 && catI === 0){
                key = oneData[categories[prop]]==null?"":oneData[categories[prop]];
            }else{
                if(key !== "" && key != null )
                    key += "-";
                key += oneData[categories[prop]]==null?"":oneData[categories[prop]];
            }
            catI++;
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
 * 已知widgets,绘制widget图像 。
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
        setGraphAxisAndWh(graphId,selectedWidgets[prop].id,grid);
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

/**
 *
 * @param displayWidgetId
 */
function addGraphWidget(displayWidgetId,widgetViewId,widgetType,widgetTitle) {
    grid.addWidget(widgetGraphHTML(displayWidgetId,widgetViewId,widgetType,widgetTitle), {minWidth: 5, minHeight: 5});

}

/**
 *
 * @param displayWidgetId
 * @returns {string}
 */
function widgetGraphHTML(displayWidgetId,widgetViewId,widgetType,widgetTitle) {
    return '<div>' +
        '<div class="grid-stack-item-content" widget-id="'+ displayWidgetId  +'"  view-id="'+ widgetViewId +'" widget-type="'+ widgetType +'" onclick="borderDisplay(this)">' +
        '<div id="title" ondblclick="editTitle(this)" style="text-align: center; height: 30px; border-bottom: solid 1px black">'+widgetTitle+'</div>' +
        '<div id="' + displayWidgetId + '" ondblclick="editTitle(this)" style="text-align: center; height: 90%;">内容</div>' +
        '<button style="position: absolute; left: 5px; bottom: 5px;" onclick="remove(this)">删除</button>' +
        '</div>' +
        '</div>';
}
/**
 * 设置图形位置及大小
 * @param graphHtmlId
 * @param widgetId
 */
function setGraphAxisAndWh(dbMemWidgets,graphHtmlId,widgetId,gridStack) {
    let gridDiv = $("#"+graphHtmlId)[0].parentNode.parentNode;
    //console.log(gridDiv,widgetId);
    if(dbMemWidgets == null)
        dbMemWidgets = getMemWidgetsFromDb();
    $.each(dbMemWidgets,function(index,item){
        console.log("$(gridDiv): ",$(gridDiv))
        let params = item.params;
        if(item.widgetId === widgetId){
            gridStack.update($(gridDiv),params.positionX, params.positionY, params.width, params.height);
            gridDiv.setAttribute("data-gs-x",params.positionX);
            gridDiv.setAttribute("data-gs-y",params.positionY);
            gridDiv.setAttribute("data-gs-width",params.width);
            gridDiv.setAttribute("data-gs-height",params.height);
        }
    });
}
