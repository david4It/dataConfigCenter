        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-pie
        component_${vo.getLocationIndex()}() {
                axios.post("/statistics/preview", {componentId: ${vo.getId()}}).then((res) => {
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
                                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                                },
                                legend: {
                                        orient: 'horizontal',
                                        left: 'left',
                                        textStyle: { //图例文字的样式
                                                color: '#fff'
                                        },
                                        data: ['预览数据A', '预览数据B', '预览数据C', '预览数据D', '预览数据E']
                                },
                                series:{
                                                name: '访问来源',
                                                type: 'pie',
                                                radius: '55%',
                                                center: ['50%', '60%'],
                                                data: [
                                                        {value: 335, name: '预览数据A'},
                                                        {value: 310, name: '预览数据B'},
                                                        {value: 234, name: '预览数据C'},
                                                        {value: 135, name: '预览数据D'},
                                                        {value: 1548, name: '预览数据E'}
                                                ],
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
                                if (result.configJson) {
                                        mergeRecursive(option, result.configJson);
                                }
                                $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                                $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
                                myChart.resize();
                                myChart.setOption(option);
                                <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
                                myChart.on("click", (param) => {
                                        forwardUrl({type: 'preview'}, "${vo.getLinkUrl()}")
                                });
                                </#if>
                                <#if vo.getAnimationEnabled()>
                                myChart.animationDuration = result.configJson.cusAnimation.duration * 1000;
                                myChart.animationMaxIndex = option.series.data.length - 1;
                                myChart.animationIndex = 0;
                                let resetFun = () => {
                                        //重置动画效果，仅当第一次执行动画效果之后才清除动画
                                        if (myChart.animationTimeout) {
                                                for (let i = 0; i <= myChart.animationMaxIndex; i++) {
                                                        myChart.dispatchAction({
                                                                type: 'pieUnSelect',
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
                                                        type: 'pieSelect',
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
                                window.addEventListener("resize", function () {
                                        myChart.resize();
                                });
                        } else {
                                //获取数据失败
                        }
                });
        },