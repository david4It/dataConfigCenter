        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-radar
        component_${vo.getLocationIndex()}() {
            axios.post("/statistics/common", {componentId: ${vo.getId()}, valueMap: getRequestParams()}).then((res) => {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
                let option = {
                    title: {
                        text: ''
                    },
                    tooltip: {},
                    legend: {
                        textStyle: { //图例文字的样式
                        color: '#fff'},
                        data: []
                    },
                    radar: {
                        // shape: 'circle',
                        center: ['50%', '60%'],
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: []
                    },
                    series: {
                        name: '',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data: []
                    }
                };
                if (res.data.success) {
                    let result = res.data.result;
                    if (result.legendData) {
                        option.legend.data = result.legendData;
                    }
                    if (result.radarIndicator) {
                        option.radar.indicator = result.radarIndicator;
                    }
                    if (result.seriesData) {
                        option.series.data = result.seriesData;
                    }
                    if (result.configJson) {
                        mergeRecursive(option, result.configJson);
                    }
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
                    myChart.resize();
                    myChart.setOption(option);
                    <#if vo.getLinkEnabled()!"N"=="Y">
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
        },