        component_${vo.getLocationIndex()}() {
            axios.get("/statistics/common", {params: {componentId: ${vo.getId()}}}).then((res) => {
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
                    myChart.setOption(option);
                    myChart.on("click", (param) => {
                        console.log(param);
                    });
                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                } else {
                    //获取数据失败
                }
            });
        },