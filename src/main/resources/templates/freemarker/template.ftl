<#--避免数字出现逗号分隔符，影响程序运行-->
<#setting number_format="0">
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>政府采购大数据平台</title>
    <link rel="shortcut icon" href="img/favicon.ico">
    <link href="css/framework/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="css/pages/base.css">
    <link rel="stylesheet" href="css/pages/index.css">
    <script type="text/javascript" src="js/framework/vue.js"></script>
    <script src="js/framework/datav.min.vue.js"></script>
    <script src="js/framework/jquery-2.2.1.min.js"></script>
    <script src="js/framework/bootstrap.min.js"></script>
    <script src="js/framework/common.js"></script>
    <script src="js/framework/echarts.min.js"></script>
    <script src="js/framework/axios.js"></script>
    <script src="js/pages/global.js"></script>
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
        .dv-scroll-board .header{
            height: auto!important;
            width: auto!important;
            min-width: auto!important;
            padding: 0;
        }
    </style>
</head>
<body>

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
    let app = new Vue({
        el: '#layout',
        data: {
          tableConfig: {},
          tableExtData: [],
          tableKey: ''
        },
        created() {
            //初始化方法
            <#list components as vo>
                ${'this.component_' + vo.getLocationIndex() + '()'};
            </#list>
        },
        methods: {
            <#list components as vo>
                <#switch vo.getType()>
                    <#case "bar"><#include "bar.ftl"><#break>
                    <#case "line"><#include "line.ftl"><#break>
                    <#case "pie"><#include "pie.ftl"><#break>
                    <#case "radar"><#include "radar.ftl"><#break>
                    <#case "table"><#include "table.ftl"><#break>
                    <#case "map"><#include "map.ftl"><#break>
                    <#case "gauge"><#include "gauge.ftl"><#break>
                </#switch>
            </#list>
        }
    })
</script>
</html>