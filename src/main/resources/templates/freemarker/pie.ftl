        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-pie
        component_${vo.getLocationIndex()}() {
            axios.get("/statistics/common", {params: {componentId: ${vo.getId()}}}).then((res) => {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
                let option = {
                    title: {
                        text: '',
                        subtext: '',
                        x: 'center',
                        y: '10%',
                        textAlign: 'left',
                        textStyle: {
                            color: '#fff',
                            fontWeight: 'border'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        position: 'right',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        textStyle: { //图例文字的样式
                        color: '#fff'},
                        left: 'left',
                        data: []
                    },
                    series: {
                        type: 'pie',
                        radius: '55%',
                        center: ['55%', '65%'],
                        data: [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                };
                if (res.data.success) {
                    let result = res.data.result;
                    if (result.legendData) {
                        option.legend.data = result.legendData;
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