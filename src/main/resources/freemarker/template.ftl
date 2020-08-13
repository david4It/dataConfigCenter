<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>政府采购大数据平台</title>
    <link href="/css/framework/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/pages/base.css">
    <link rel="stylesheet" href="/css/pages/index.css">
    <script src="js/jquery-3.4.1.min.js"></script>
    <script type="text/javascript" src="/js/framework/vue.js"></script>
    <script src="/js/framework/datav.min.vue.js"></script>
    <script src="/js/framework/bootstrap.min.js"></script>
    <script src="/js/framework/common.js"></script>
    <script src="/js/framework/echarts.min.js"></script>
    <script src="/js/framework/axios.js"></script>
    <script src="/js/pages/china.js"></script>
    <script src="js/jquery.cookie.min.js"></script>
    <script src="js/graph/pie.js"></script>
    <style>
        .t_title{
            width: 100%;
            height: 100%;
            text-align: center;
            font-size: 2.5em;
            line-height: 80px;
            color: #fff;
        }
        #chart_map{
            cursor: pointer;
        }
        .t_show{
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 2px;
            background: #2C58A6;
            padding: 2px 5px;
            color: #fff;
            cursor: pointer;
        }
    </style>
</head>
<body onload="size()">

<!--header-->
<div class="header">
    <div class="bg_header">
        <div class="header_nav fl t_title">
            ${title}
        </div>
    </div>
</div>

<!--main-->
<div class="data_content">
    <div class="data_time">
        温馨提示: 点击模块后跳转至详情页面。
    </div>

    <div class="data_main">
        <div id="layout" style="position: relative">
            <#include "layout.ftl">
        </div>
    </div>
</div>

</body>
<script type="text/javascript">
    function size(){
        let lastDiv = $("#layout").children("div:last-child");
        $(".data_main").height(lastDiv.height() + lastDiv.position().top);
    }
</script>
<script type="text/javascript">
    let app = new Vue({
        el: '#layout',
        mounted: function() {
        //应该注意的是，使用mounted 并不能保证钩子函数中的 this.$el 在 document 中。为此还应该引入       Vue.nextTick/vm.$nextTick
            <#list components as vo>
                <#if vo.getWidgetId()??>
             showGraph(${ vo.getWidgetId()});
                <#else>
            showGraph("1");
                 </#if>
            </#list>
        },
        methods: {

        }
    //end method

    })

    function showGraph(widgetId){
        //渲染图像
        generateWidgetGraph(widgetId);
    }
    /**
     * generate id
     * @param widget
     * @returns {string}
     */
    function generateWidgetHtmlID(widget){
        return 'component_' + widget.id;
    }
    /**
     * 制作大屏页面调用，用户勾选后保存。
     * @param obj
     */
    function generateWidgetGraph(widgetId) {
        let widget = getWidgetByWidgetID(widgetId);
        let grahpId = generateWidgetHtmlID(widget);
        let config = JSON.parse(widget.config)
        let graphType=parseInt(config.selectedChart);
        //渲染图形
        switch (graphType) {
            case 1:
                //面积图
                renderDispGraph(widget,"area",grahpId);
                break;
            case 2:
                //柱状图
                renderDispGraph(widget,"bar",grahpId);
                break;
            case 3:
                //折线图
                renderDispGraph(widget,"line",grahpId);
                break;
            case 4:
                //饼图
                renderDispGraph(widget,"pie",grahpId);
                break;
            case 5:
                //地图
                renderDispGraph(widget,"map",grahpId);
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
    /**
     * get view data by view id
     * /1/getdata
     */
    function getViewDataByViewId(widget) {
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
        let catsAndVals = getCategoriesAndValuesFromWidgetData(widget);
        aggregators = catsAndVals.aggregators;
        groups = catsAndVals.groups;
        //取 Filters columns //TODO:
        let data = JSON.stringify({aggregators:aggregators,groups:groups,cache: false,expired: 0,filters: [],
            flush: false,nativeQuery: false,orders: [],pageNo: 0,pageSize: 0});
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

</script>
</html>
