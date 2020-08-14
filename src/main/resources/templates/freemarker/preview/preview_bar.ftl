        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-bar
        component_${vo.getLocationIndex()}() {
        setTimeout(() => {
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
                series: [
                    {
                        name: '访问量',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390]
                    }
                ]
            };
            $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
            $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
            myChart.resize();
            myChart.setOption(option);
            <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
            myChart.on("click", (param) => {
                console.log(param);
                forwardUrl({type: 'preview'}, "${vo.getLinkUrl()}")
            });
            </#if>
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        }, 500);
        },