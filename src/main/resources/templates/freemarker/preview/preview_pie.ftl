        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-pie
        component_${vo.getLocationIndex()}() {
        setTimeout(() => {
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
                                color: '#fff'},
                                data: ['预览数据A', '预览数据B', '预览数据C', '预览数据D', '预览数据E']
                        },
                        series: [
                                {
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