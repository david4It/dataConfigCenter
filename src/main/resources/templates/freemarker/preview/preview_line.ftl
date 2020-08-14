        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-line
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
                xAxis: {
                    type: 'category',
                    data: ['预览数据A', '预览数据B', '预览数据C', '预览数据D'],
                    axisLine: {
                        lineStyle: {
                        color: '#fff'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                        color: '#fff'
                        }
                    }
                },
                series: [{
                    data: [820, 932, 901, 934],
                    type: 'line'
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