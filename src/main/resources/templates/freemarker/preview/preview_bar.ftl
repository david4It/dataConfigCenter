        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-bar
<#--                <script type="text/javascript">-->
        component_${vo.getLocationIndex()}() {
            axios.post("/statistics/preview", {componentId: ${vo.getId()}}).then((res) => {
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
                    legend: {
                        textStyle: { //图例文字的样式
                            color: '#fff' },
                        data: ['访问量']
                    },
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            shadowStyle: {
                                opacity: 1
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
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
                            type: 'value',
                            data: [],
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                    series:
                        {
                            name: '访问量',
                            type: 'bar',
                            barWidth: '60%',
                            data: []
                        }
                };
                if (res.data.success) {
                    let valueArr = [10, 52, 200, 334, 390];
                    let desArr = ['预览数据A', '预览数据B', '预览数据C', '预览数据D', '预览数据E'];
                    let result = res.data.result;
                    if (result.configJson) {
                        mergeRecursive(option, result.configJson);
                    }
                    <#if vo.getIsVertical()>
                    option.xAxis.data = desArr;
                    option.series.data = valueArr;
                    <#else>
                    option.series.data = valueArr;
                    option.yAxis.data = desArr;
                    </#if>
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
                    myChart.resize();
                    myChart.setOption(option);
                    <#if vo.getAnimationEnabled()>
                    myChart.animationDuration = result.configJson.cusAnimation.duration * 1000;
                    myChart.animationMaxIndex = option.series.data.length - 1;
                    myChart.animationIndex = 0;
                    let showShadow = (opacity) => {
                        let option = myChart.getOption();
                        if (option.tooltip[0].axisPointer && option.tooltip[0].axisPointer.shadowStyle) {
                            option.tooltip[0].axisPointer.shadowStyle.opacity = opacity;
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
                        showShadow(0);
                        let nextAnimationIndex = myChart.animationIndex++;
                        myChart.animationTimeout = setTimeout(() => {
                            showShadow(1);
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
                        showShadow(1);
                    });
                    myChart.on("globalout", (params) => {
                        if (!myChart.animationInterval) {
                            myChart.animationInterval = setInterval(animationFun, myChart.animationDuration);
                        }
                    });
                    </#if>
                    <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
                    myChart.on("click", (param) => {
                        forwardUrl({type: 'preview'}, "${vo.getLinkUrl()}")
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