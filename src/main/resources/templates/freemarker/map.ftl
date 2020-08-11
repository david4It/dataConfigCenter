    //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-map
    component_${vo.getLocationIndex()}(){
        $.get("${'/json/' + vo.getQuery() + '.json'}", function (chengdu) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
            echarts.registerMap('chengdu',chengdu);
            $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
            $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
            myChart.resize();
            myChart.setOption({
                series: [{
                    type: 'map',
                    mapType: 'chengdu',
                    data: chengdu.list
                }]
            });
            <#if vo.getLinkEnabled() == "Y">
            myChart.on("click", (param) => {
                console.log(param);
                forwardUrl({areaCode: param.data.areaCode}, "${vo.getLinkUrl()}")
            });
            </#if>
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        });
    },