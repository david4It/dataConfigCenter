    //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-map
    component_${vo.getLocationIndex()}(){
        $.get("${'/json/' + vo.getQuery() + '.json'}", function (chengdu) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
            echarts.registerMap('chengdu',chengdu);
            let option = {
                series: {
                    type: 'map',
                    mapType: 'chengdu',
                    data: chengdu.list,
                    itemStyle: {
                        normal: { //未选中状态
                        borderColor:'#2c2c2c',
                        areaColor: '#fff',//背景颜色
                        label: {
                            show: true,//显示名称
                            textStyle: {
                                color: '#2c2c2c'
                                }
                        }
                    },
                    emphasis: {// 也是选中样式
                        borderColor:'#fff',
                        areaColor: '#FF8C00',
                        label: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                                }
                            }
                        }
                    }
                }
            };
            axios.post("/statistics/common", {componentId: ${vo.getId()}, valueMap: getRequestParams()}).then((res) => {
                if (res.data.success) {
                    let result = res.data.result;
                    if (result.configJson) {
                        mergeRecursive(option, result.configJson);
                    }
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
                    myChart.resize();
                    myChart.setOption(option);
                    <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
                    myChart.on("click", (param) => {
                        console.log(param);
                        forwardUrl(param.data.extData, "${vo.getLinkUrl()}")
                    });
                    </#if>
                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                } else {
                    //获取数据失败
                }
            });
        });
    },