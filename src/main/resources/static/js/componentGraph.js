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
            //列表
            renderWidgetGraph(widget,"table",grahpId,title,queryVal,param);
            break;
        case 7:
            //排名
            renderRankTable(widget,"rank",grahpId,title,queryVal,param);
            break;
        case 8:
            //胶囊柱图
            renderCapsule(widget,"capsule",grahpId,title,queryVal,param);
            break;
        case 9:
            //排名
            renderRing(id,"ring",legendData,bizData);
            break;
        case 10:
            //排名
            renderWaterPond(id,"water",legendData,bizData);
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
            let config = JSON.parse(widget.config);
            setConfig("四川",config);
            let graphData = buildMapData(viewData);
            renderMap(id,"",graphData,config);
            break;
        case "table":
            //地图
            renderRotationTable(id,"",legendData,viewData);
            break;
        case "rank":
            //
            renderRankTable(id,"",legendData,viewData);
            break;
        case "capsule":
            //排名
            renderCapsule(id,"",legendData,viewData);
            break;
        case "ring":
            //排名
            renderRing(id,"",legendData,viewData);
            break;
        case "water":
            //排名
            renderWaterPond(id,"",legendData,viewData);
            break;
        default:
            break;
    }
}

/**
 * widget 下钻
 * @param widget
 * @param type
 * @param id 绘图所在ID
 * @param title graph title
 * @param queryVal 查询参数值
 * @param param 查询参数, TODO：这个参数暂时没有使用。
 */
function renderWidgetGraph(widget,type,id,title,queryVal,param){
    if(id == null || id  === "")
        id="graphArea";
    let config = JSON.parse(widget.config);
    //console.log("config:" , config)
    let viewData = getViewDataByViewId(widget,param,queryVal);
    let graphData,bizData,legendData;
    if(type !== "map") {
        graphData = buildGraphData(viewData, widget);
        if (graphData == null) return;
        bizData = graphData.showedData;
        legendData = graphData.legendData;
    }
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
            setConfig("四川",config);
            let graphData = buildMapData(viewData);
            renderMap(id,title,graphData,config);
            break;
        case "table":
            //地图
            renderRotationTable(id,title,legendData,bizData);
            break;
        case "rank":
            //地图
            renderRankTable(id,title,legendData,viewData);
            break;
        case "capsule":
            //排名
            renderCapsule(id,title,legendData,viewData);
            break;
        case "ring":
            //排名
            renderRing(id,title,legendData,viewData);
            break;
        case "water":
            //排名
            renderWaterPond(id,title,legendData,bizData);
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
    //构建查询参数，因为查询参数可能有多个，这里可能会出现查询参数赋值错误的问题，因为这里是根据view的参数来批量进行的
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
function drawDispWidget(selectedWidgets,memSlideWidgets) {
    //console.log("selected widgets",selectedWidgets)
    // display select widget to canvas
    if(memSlideWidgets != null){
        // 编辑大屏，从数据库读取的widgets
        $.each(memSlideWidgets,function (index,item) {
            let widgetId = item.widgetId;
            let grahpId = "displayWidget_" + widgetId;
            //getViewId
            let widget = null;
            $.each(selectedWidgets,function (index,item) {
                if(item.id === widgetId) {
                    widget = item;
                    return false;//退出循环
                }
            });

            let widgetViewId = widget.viewId;
            let config = JSON.parse(widget.config);
            let graphType=config.selectedChart;
            let widgetTitle = widget.name;
            let secondWidgetId = "";
            let secondWidgetAry = config.dataDrill;
            $.each(secondWidgetAry,function(index,item){
                if(item.level === "2") {
                    secondWidgetId = item.widgetId;
                    return false;
                }
            });
            addGraphWidget(grahpId,widgetViewId,graphType,widgetTitle,secondWidgetId,JSON.parse(item.params));
            commonRenderGraph(graphType,item,grahpId);
        });

        return false;
    }
    //新增
    for(let prop in selectedWidgets){
        //console.log("prop",prop,selectedWidgets[prop]);
        let grahpId = "displayWidget_" + selectedWidgets[prop].id;
        let widgetViewId = selectedWidgets[prop].viewId;
        let config = JSON.parse(selectedWidgets[prop].config)
        let graphType=config.selectedChart;
        let widgetTitle = selectedWidgets[prop].name;
        let secondWidgetId = "";
        let secondWidgetAry = config.dataDrill;
        $.each(secondWidgetAry,function(index,item){
            if(item.level === "2") {
                secondWidgetId = item.widgetId;
                return false;
            }
        });
        addGraphWidget(grahpId,widgetViewId,graphType,widgetTitle,secondWidgetId,null);
        commonRenderGraph(graphType,selectedWidgets[prop],grahpId);
    }
}
function commonRenderGraph(graphType,widget,graphId){
    //渲染图形
    switch (graphType) {
        case 1:
            //面积图
            renderDispGraph(widget,"area",graphId);
            break;
        case 2:
            //柱状图
            renderDispGraph(widget,"bar",graphId);
            break;
        case 3:
            //折线图
            renderDispGraph(widget,"line",graphId);
            break;
        case 4:
            //饼图
            renderDispGraph(widget,"pie",graphId);
            break;
        case 5:
            //地图
            renderDispGraph(widget,"map",graphId);
            break;
        case 6:
            //地图
            renderDispGraph(widget,"table",graphId);
            break;
        case 7:
            //排名
            renderDispGraph(widget,"rank",graphId);
            break;
        case 8:
            //排名
            renderDispGraph(widget,"capsule",graphId);
            break;
        case 9:
            //排名
            renderDispGraph(widget,"ring",graphId);
            break;
        case 10:
            //排名
            renderDispGraph(widget,"water",graphId);
            break;
        default:
            break;
    }
}
/**
 *
 * @param displayWidgetId
 */
function addGraphWidget(displayWidgetId,widgetViewId,widgetType,widgetTitle,secondWidgetId,config) {
    if(config == null){
        grid.addWidget(widgetGraphHTML(displayWidgetId,widgetViewId,widgetType,widgetTitle,secondWidgetId), {minWidth: 5, minHeight: 5});
    }else{
        let x = config.positionX;
        let y = config.positionY;
        let width = config.width;
        let height = config.height;
        grid.addWidget(widgetGraphHTML(displayWidgetId,widgetViewId,widgetType,widgetTitle,secondWidgetId), x,y,width,height,false);
    }

}

/**
 *
 * @param displayWidgetId
 * @returns {string}
 */
function widgetGraphHTML(displayWidgetId,widgetViewId,widgetType,widgetTitle,secondWidgetId) {
    return '<div>' +
        '<div class="grid-stack-item-content" second-widget-id="'+secondWidgetId +'" widget-id="'+ displayWidgetId  +'"  view-id="'+ widgetViewId +'" widget-type="'+ widgetType +'" onclick="borderDisplay(this)">' +
        '<div id="title" ondblclick="editTitle(this)" style="text-align: center;color: #fff; height: 30px; border-bottom: solid 0px #ccc">'+widgetTitle+'</div>' +
        '<div id="' + displayWidgetId + '" ondblclick="editTitle(this)" style=" height: 85%;">内容</div>' +
        '<button style="position: absolute; left: 5px; bottom: 5px;" onclick="remove(this)">删除</button>' +
        '</div>' +
        '</div>';
}
/**
 * build map legendData & showed data.
 * @param viewData
 */
function buildMapData(viewData) {
    let mapData = {};
    let retData =[];
    let nameMap = {};
    if(viewData == null ) return ;
    let bizData = viewData.data.resultList;
    for(let i in bizData){
        let showedData={};
        //console.log(i+ "|bizData" , bizData[i]);
        $.each(bizData[i],function (index,item) {
            if(index === 'sum(cnt)'){
                showedData.value=item;
            }else{
                showedData.name=item;
                nameMap[item]=item;
            }
        })
        retData[i]=showedData;
    }
    //console.log("retData:",retData)
    mapData["bizData"]=retData;
    mapData["nameMap"]=nameMap;
    return mapData;
}
