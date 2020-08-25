        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-radar
        component_${vo.getLocationIndex()}() {
            axios.post("/statistics/preview", {componentId: ${vo.getId()}}).then((res) => {
                let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
                let option = {
                    title: {
                        text: ''
                    },
                    tooltip: {},
                    legend: {
                        data: ['预览数据A', '预览数据B'],
                        textStyle: { //图例文字的样式
                            color: '#fff'
                        }
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
                        indicator: [
                            {name: '维度A', max: 6500},
                            {name: '维度B', max: 16000},
                            {name: '维度C', max: 30000},
                            {name: '维度D', max: 38000},
                            {name: '维度E', max: 52000},
                            {name: '维度F', max: 25000}
                        ]
                    },
                    series: {
                        name: '预览数据',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data: [
                            {
                                value: [4300, 10000, 28000, 35000, 50000, 19000],
                                name: '预览数据A'
                            },
                            {
                                value: [5000, 14000, 28000, 31000, 42000, 21000],
                                name: '预览数据B'
                            }
                        ]
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
                    let resetFun = () => {
                        //重置动画效果，仅当第一次执行动画效果之后才清除动画
                        if (myChart.animationTimeout) {
                            for (let i = 0; i <= myChart.animationMaxIndex; i++) {
                                myChart.dispatchAction({
                                    type: 'downplay',
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
                        let nextAnimationIndex = myChart.animationIndex++;
                        myChart.animationTimeout = setTimeout(() => {
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