        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-bar
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
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['预览数据A', '预览数据B', '预览数据C', '预览数据D', '预览数据E'],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    series:
                        {
                            name: '访问量',
                            type: 'bar',
                            barWidth: '60%',
                            data: [10, 52, 200, 334, 390]
                        }
                };
                if (res.data.success) {
                    let result = res.data.result;
                    if (result.configJson) {
                        mergeRecursive(option, result.configJson);
                    }
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                    $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
                    myChart.resize();
                    myChart.setOption(option);
                    <#if vo.getAnimationEnabled()>
                    myChart.animationDuration = result.configJson.cusAnimation.duration * 1000;
                    myChart.animationMaxIndex = option.series.data.length - 1;
                    myChart.animationIndex = 0;
                    let animationFun = () => {
                        let nextAnimationIndex = myChart.animationIndex++;
                        setTimeout(() => {
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
                    </#if>
                    <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
                    myChart.on("click", (param) => {
                        console.log(param);
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