        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-radar
        component_${vo.getLocationIndex()}() {
        setTimeout(() => {
            let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
            let option = {
                title: {
                    text: ''
                },
                tooltip: {},
                legend: {
                    data: ['预览数据A', '预览数据B'],
                    textStyle: { //图例文字的样式
                    color: '#fff'}
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: [
                        { name: '维度A', max: 6500},
                        { name: '维度B', max: 16000},
                        { name: '维度C', max: 30000},
                        { name: '维度D', max: 38000},
                        { name: '维度E', max: 52000},
                        { name: '维度F', max: 25000}
                    ]
                },
                series: [{
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
                }]
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