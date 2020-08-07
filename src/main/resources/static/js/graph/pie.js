/**
 * 渲染图片
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderPie(id,title,legendData,data) {
    var myCharts1 = echarts.init(document.getElementById(id));
    var option1 = {
        title: {
            text: title,
            left: 'center',
            top: 20,
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {d}%"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: legendData
        },
        series : [{
            data: data,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    myCharts1.setOption(option1);
}

/**
 * build legendData & showed data.
 * @param data
 */
function buildPieData(data) {
    let legendData=[], showedData=[];
    let bizData = data.data.resultList;
    //取category columns
    let ret = getCategoriesAndValues();
    let categories = ret.groups;
    let values = ret.aggregators;
    for(let i in bizData){
        let mapData = {};
        //get legendData
        let key = "";
        let oneData = bizData[i];
        for(let prop in categories){
            console.log("categories[prop] --> " ,categories[prop]);
            console.log("oneData[categories[prop]] --> " ,oneData[categories[prop]]);
            key += oneData[categories[prop]]==null?"":oneData[categories[prop]];
        }
        legendData[i]= key;
        //build value key
        for(let prop in values){
            let valueKey = "";
            if(values[prop].func != null && values[prop].func.length > 0){
                valueKey = values[prop].func  + "(" + values[prop].column + ")";
            }else{
                valueKey += values[prop].column;
            }
            //get biz data
            mapData.name=key;
            mapData.value=oneData[valueKey]==null?0:oneData[valueKey];
            showedData[i] = mapData;
        }
    }
    let retData ={};
    retData.legendData = legendData;
    retData.showedData = showedData;
    return retData;
}
