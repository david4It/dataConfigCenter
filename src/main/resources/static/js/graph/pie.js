let echartMap={}

/**
 * 渲染图片
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderPie(id, title, legendData, data) {
    let myCharts1 = echarts.init(document.getElementById(id));
    echartMap[id]=myCharts1;
    let option1 = {

        title: {
            text: title,
            left: 'center',
            top: 20,
            textStyle: {
                color: '#f2f2f2',
            },
        },
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {d}%"
        },
        legend: {
            //orient: 'vertical',
            //left: 'right',
            data: legendData,
            top: "10%",
            right: "2%",
            width: "20%",
            textStyle: {
                color: '#f2f2f2',
                fontSize: 12,
            },
        },
        series: [{
            data: data,
            type: 'pie',
            radius: '55%',
            center: ['40%', '60%'],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(255,255,255,0.55)'
                }
            },
            textStyle: {
                fontSize: 12,
                fontWeight: 'bolder',
                color: '#cccccc'
            },
        }]
    };
    myCharts1.setOption(option1);
    //点击事件
    myCharts1.on('click', function (param) {
        dataDrill(this.getDom(),param);
    });
}

/**
 * 渲染图片
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderBar(id, title, legendData, data) {
    let myCharts2 = echarts.init(document.getElementById(id));
    echartMap[id]=myCharts2;
    let option1 = {
        title: {
            text: title,
            left: 'center',
            top: 20,
        },
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {d}%"
        },

        xAxis: {
            type: 'category',
            data: legendData,
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#ffffff'
                }
            },
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#ffffff'
                }
            },
        },
        series: [{
            data: data,
            type: 'bar',
            radius: '55%',
            center: ['50%', '40%'],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myCharts2.setOption(option1);

    //点击事件
    myCharts2.on('click', function (param) {
        dataDrill(this.getDom(),param);
    });
}

/**
 * 渲染图片
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderLine(id, title, legendData, data) {
    let myCharts3 = echarts.init(document.getElementById(id));
    echartMap[id]=myCharts3;
    let option1 = {
        title: {
            text: title,
            left: 'center',
            top: 20,
        },

        xAxis: {
            type: 'category',
            data: legendData,
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#ffffff'
                }
            },
            // 设置X轴数据旋转倾斜
            axisLabel: {
                rotate: 30, // 旋转角度
                interval: 3  //设置X轴数据间隔几个显示一个，为0表示都显示
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#ffffff'
                }
            },
        },
        series: [{
            data: data,
            type: 'line',
            radius: '55%',
            center: ['50%', '40%'],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgb(52,55,216)'
                }
            },
            textStyle: {
                fontSize: 12,
                fontWeight: 'bolder',
                color: '#cccccc'
            },
        }]
    };
    myCharts3.setOption(option1);

    //点击事件
    myCharts3.on('click', function (param) {
        dataDrill(this.getDom(),param);
    });
}

/**
 * build legendData & showed data.
 * @param data
 */
function buildPieData(data) {
    let legendData = [], showedData = [];
    let bizData = data.data.resultList;
    //取category columns
    let ret = getCategoriesAndValues();
    let categories = ret.groups;
    let values = ret.aggregators;
    let catI = 0;
    for (let i in bizData) {
        let mapData = {};
        //get legendData
        let key = "";
        let oneData = bizData[i];
        for (let prop in categories) {
            if(prop === "0"){
                key = oneData[categories[prop]]==null?"":oneData[categories[prop]];
            }else{
                if(oneData[categories[prop]]==null || oneData[categories[prop]]==="") continue;
                key += "-";
                key += oneData[categories[prop]]==null?"":oneData[categories[prop]];
            }
            catI++;
        }
        //  console.log("key = " + key);
        legendData[i] = key;

        //build value key
        for (let prop in values) {
            let valueKey = "";
            if (values[prop].func != null && values[prop].func.length > 0) {
                valueKey = values[prop].func + "(" + values[prop].column + ")";
            } else {
                valueKey += values[prop].column;
            }
            //get biz data
            mapData.name = key;
            mapData.value = oneData[valueKey] == null ? 0 : oneData[valueKey];
            showedData[i] = mapData;
        }
    }
    let retData = {};
    retData.legendData = legendData;
    retData.showedData = showedData;
    console.log("retData",retData);
    return retData;
}

/**
 * 渲染面积图
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderAreaLine(id, title, legendData, data) {
    let myCharts4 = echarts.init(document.getElementById(id));
    echartMap[id]=myCharts4;
    let option1 = {
        title: {
            text: title,
            left: 'center',
            top: 20,
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: legendData,
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#ffffff'
                }
            },
            // 设置X轴数据旋转倾斜
            axisLabel: {
                rotate: 30, // 旋转角度
                interval: 3  //设置X轴数据间隔几个显示一个，为0表示都显示
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    // 设置x轴颜色
                    color: '#ffffff'
                }
            },
        },
        series: [{
            data: data,
            type: 'line',
            radius: '55%',
            center: ['50%', '40%'],
            areaStyle: {},
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myCharts4.setOption(option1);

    //点击事件
    myCharts4.on('click', function (param) {
        dataDrill(this.getDom(),param);
    });
}
window.addEventListener("resize", () => {
    $.each(echartMap,function (index,item) {
       // console.log(item)
        item.resize();
    })

});
function renderMap() {

}
/**
 * data drill to open window
 * @param param
 */
function dataDrill(dom,param) {
    console.log(param);
    let queryName = param.name;
    let titleDom = dom.previousElementSibling;
    console.log("this dom: " ,dom);
    console.log("title" ,titleDom);
    let title = titleDom.innerText;
    //displayWidget_9
    let domId = dom.id;
    console.log("##domId = ",domId);
    let secondWidgetId = null;
    if(domId.indexOf("_")>0) {//模板大屏
        let widgetId = domId.substring(domId.indexOf("_") + 1);
        let widget = getWidgetByWidgetID(widgetId);
        let config = JSON.parse(widget.config);
        let secondWidgetAry = config.dataDrill;
        $.each(secondWidgetAry,function(index,item){
            if(item.level === "2") {
                secondWidgetId = item.widgetId;
                return false;
            }
        });
        console.log("##"+secondWidgetId);

    }else{//widget
        secondWidgetId = dom.parentElement.getAttribute("second-widget-id");
        console.log("secondWidgetId="+ secondWidgetId);
    }
    if (secondWidgetId !== null && secondWidgetId !== "") {
        execute_open(name + "" + title, "display-popout.html?queryName=" + encodeURI(queryName) + "&title=" + encodeURI(title) + "&widgetId=" + secondWidgetId, '1000', '750');
    }
}
