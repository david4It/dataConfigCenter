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
    <script type="text/javascript" src="/js/framework/vue.js"></script>
    <script src="/js/framework/datav.min.vue.js"></script>
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
            ${body}
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
        el: '#layout'
    })
</script>
<script src="/js/framework/jquery-2.2.1.min.js"></script>
<script src="/js/framework/bootstrap.min.js"></script>
<script src="/js/framework/common.js"></script>
<script src="/js/framework/echarts.min.js"></script>
<script src="/js/framework/axios.js"></script>
<script src="/js/pages/china.js"></script>
</html>