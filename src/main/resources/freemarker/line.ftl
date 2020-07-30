        component_${vo.getLocationIndex()}() {
            axios.get("/statistics/common", {params: {componentId: ${vo.getId()}}}).then((res) => {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
                let option = {
                    title: {
                        text: '',
                        x: 'center',
                        y: '10%',
                        textAlign: 'left',
                        textStyle: {
                            color: '#fff',
                            fontWeight: 'border'
                        }
                    },
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top: '25%',
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis:
                        {
                            type: 'category',
                            data: [],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                    yAxis:
                        {
                            name: '单位（元）',
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                    series:
                        {
                            name: '金额',
                            type: 'line',
                            barWidth: '60%',
                            data: []
                        }
                };
                if (res.data.success) {
                    let result = res.data.result;
                    if (result.xAxisData) {
                        option.xAxis.data = result.xAxisData;
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