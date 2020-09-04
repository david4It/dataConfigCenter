        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-line
<#--        <script type="text/javascript">-->
        component_${vo.getLocationIndex()}() {
            axios.post("/statistics/common", {componentId: ${vo.getId()}, valueMap: getRequestParams()}).then((res) => {
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
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
                            lineStyle: {
                                opacity: 1
                            }
                        }
                    },
                    legend: {
                        textStyle: { //图例文字的样式
                            color: '#fff' },
                        data: []
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
                                alignWithLabel: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                    yAxis:
                        {
                            name: '',
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                    series:[]
                };
                if (res.data.success) {
                    let result = res.data.result;
                    if (result.xAxisData) {
                        option.xAxis.data = result.xAxisData;
                    }
                    if (result.configJson) {
                        mergeRecursive(option, result.configJson);
                    }
                    if (result.seriesData) {
                        for (let key in result.seriesData) {
                            let data = {type: 'line', name: key, data: result.seriesData[key]};
                            if (option.series.smooth) {
                                data.smooth = option.series.smooth;
                            }
                            if (option.series.areaStyle && option.series.areaStyle.color) {
                                data.areaStyle = {color: option.series.areaStyle.color};
                            }
                            option.series.push(data);
                        }
                    }
                    if (result.legendData) {
                        option.legend.data = result.legendData;
                    }
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
                    myChart.resize();
                    myChart.setOption(option);
                    <#if vo.getAnimationEnabled()>
                    myChart.animationDuration = result.configJson.cusAnimation.duration * 1000;
                    myChart.animationMaxIndex = option.series[0].data.length - 1;
                    myChart.animationIndex = 0;
                    let showLine = (opacity) => {
                        let option = myChart.getOption();
                        if (option.tooltip[0].axisPointer && option.tooltip[0].axisPointer.lineStyle) {
                            option.tooltip[0].axisPointer.lineStyle.opacity = opacity;
                            myChart.setOption(option);
                        }
                    };
                    let resetFun = () => {
                        //重置动画效果，仅当第一次执行动画效果之后才清除动画
                        if (myChart.animationTimeout) {
                            for (let i = 0; i <= myChart.animationMaxIndex; i++) {
                                myChart.dispatchAction({
                                    type: 'downplay',
                                    seriesIndex: 0,
                                    dataIndex: i
                                });
                                myChart.dispatchAction({
                                    type: 'hideTip',
                                    seriesIndex: 0,
                                    dataIndex: i
                                });
                            }
                        }
                    };
                    let animationFun = () => {
                        resetFun();
                        showLine(0);
                        let nextAnimationIndex = myChart.animationIndex++;
                        myChart.animationTimeout = setTimeout(() => {
                            showLine(1);
                            myChart.dispatchAction({
                                type: 'highlight',
                                dataIndex: nextAnimationIndex
                            });
                            myChart.dispatchAction({
                                type: 'showTip',
                                seriesIndex: 0,
                                dataIndex: nextAnimationIndex
                            });
                        }, myChart.animationDuration / 2);
                        if (myChart.animationIndex > myChart.animationMaxIndex) {
                            myChart.animationIndex = 0;
                        }
                    };
                    myChart.animationInterval = setInterval(animationFun, myChart.animationDuration);
                    myChart.on("mouseover", (params) => {
                        resetFun();
                        clearTimeout(myChart.animationTimeout);
                        clearInterval(myChart.animationInterval);
                        myChart.animationInterval = null;
                        myChart.animationTimeout = null;
                        showLine(1);
                    });
                    myChart.on("globalout", (params) => {
                        if (!myChart.animationInterval) {
                            myChart.animationInterval = setInterval(animationFun, myChart.animationDuration);
                        }
                    });
                    </#if>
                    <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
                    myChart.on("click", (param) => {
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