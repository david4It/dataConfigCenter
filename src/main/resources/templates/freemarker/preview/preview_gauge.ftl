        //此组件自定义配置，请参照https://echarts.apache.org/examples/en/index.html#chart-type-gauge
        component_${vo.getLocationIndex()}() {
            axios.post("/statistics/preview", {componentId: ${vo.getId()}}).then((res) => {
                let myChart = echarts.init(document.getElementById("${'component_' + vo.getLocationIndex()}"));
                let option = {
                    tooltip: {
                        formatter: '{b} : {c}%'
                    },
                    series: {
                        type: 'gauge',
                        detail: {formatter: '{value}%'},
                        title : {               //设置仪表盘中间显示文字样式
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: "white"
                            }
                        },
                        data: [{value: 65, name: '预览数据'}]
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
                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                } else {
                    //获取数据失败
                }
            });
        },