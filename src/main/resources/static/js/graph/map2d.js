let mapStack = new Array();
let mapdata = [];
let geoCoordMap = {};
let max = 480,
    min = 9;
let maxSize4Pin = 100,
    minSize4Pin = 20;
/**
 * 构建Map option
 * @param mapCharts
 * @param bizData
 * @param jsonMap
 */
function buildOption(mapCharts, bizData, jsonMap) {
    let map = jsonMap['map'].mapName;
   // map = "china";
    let convertedData = convertData(bizData.bizData);
    console.log("convertedData=" + convertedData);
    let option ={
        backgroundColor: 'transparent',
        title : {
            text: '数据分布图',
            subtext: '',
            left: 'center',
            textStyle:{
                color: '#fff',
                fontSize:16,
                fontWeight:'normal',
                fontFamily:"Microsoft YaHei"
            },
            subtextStyle:{
                color: '#ccc',
                fontSize:13,
                fontWeight:'normal',
                fontFamily:"Microsoft YaHei"
            }
        },

        animationDuration:1000,
        animationEasing:'cubicOut',
        animationDurationUpdate:1000

    };
    option.title.subtext = map;
    option.visualMap = {
        type: 'continuous',
        min: 0,
        max: 200,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        seriesIndex: [0],
        inRange: {
            // color: ['#3B5077', '#031525'] // 蓝黑
            // color: ['#ffc0cb', '#800080'] // 红紫
            // color: ['#3C3B3F', '#605C3C'] // 黑绿
            // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
            // color: ['#23074d', '#cc5333'] // 紫红
            color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#1488CC', '#2B32B2'] // 浅蓝
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿

        }
    },
    option.geo = {
        show: true,
        map: map,//必须正确，否则地图不显示
        label: {
            normal: {
                show: true
            },
            emphasis: {
                show: false,
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#ffffff',
                borderColor: '#3B5077',
            },
            emphasis: {
                areaColor: '#2B91B7',
            }
        }
    };
    option.series =[

        {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertedData,
            symbolSize: function(val) {
                return val[2] / 10;
            },
            itemStyle: {
                normal: {
                    color: '#05C3F9'
                }
            }
        },
        {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', //气泡
            symbolSize: function(val) {
                let a = (maxSize4Pin - minSize4Pin) / (max - min);
                let b = minSize4Pin - a * min;
                b = maxSize4Pin - a * max;
                return a * val[2] + b;
            },
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 9,
                    },
                    formatter : function(params){
                        return params.value[2]==undefined?0:params.value[2];
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: '#F62157', //标志颜色
                    show : true
                }
            },
            zlevel: 6,
            data: convertedData,
        },
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(bizData.bizData.sort(function(a, b) {
                return b.value - a.value;
            }).slice(0, 5)),
            symbolSize: function(val) {
                return val[2] / 10;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                formatter : function(params){
                    return params.value[2]==undefined?0:params.value[2];
                },
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: 'yellow',
                    shadowBlur: 10,
                    shadowColor: 'yellow'
                }
            },
            zlevel: 1
        },
    ];
    return option;
}

/**
 * get map data by map name, default is chengdu
 * @param mapName
 * @param level
 * @returns {boolean}
 */
function getMapDataByMapName(mapName,level) {
    if (mapName === "" || mapName == null) mapName = 'cdArea';
    let mapJsonUrl;
    if(level === 0) {//CHINA
        mapJsonUrl = "/json/china.json";
    }
    if(level === 1) {//province
        mapJsonUrl = "/json/province/" + provinces[mapName] + '.json';
    }else if(level === 2){//city
        mapJsonUrl = "/json/city/" + cityMap[mapName]  + '.json';
    }else{

    }
    if(mapJsonUrl === null || mapJsonUrl ==="") return false;
    let ret = null;
    $.ajax({
        url: mapJsonUrl,
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        success: function (data) {
            if (data != null) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                //console.log(data);
                ret = data;
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
        }
    });
    return ret;
}

/**
 * 处理地图下钻功能
 * @param dom
 * @param param get by echarts click action
 */
function mapDrillAction(dom, param) {
    console.log(param);
    let titleDom = dom.previousElementSibling;
    console.log("this dom: ", dom);
    console.log("title", titleDom);
    let title = titleDom.innerText;
    //displayWidget_9
    let domId = dom.id;
    //console.log("##domId = ",domId);
    let widgetId = null;
    if (domId.indexOf("_") > 0) {//模板大屏
        let widgetId = domId.substring(domId.indexOf("_") + 1);
        let widget = getWidgetByWidgetID(widgetId);
        let config = JSON.parse(widget.config);

    } else {//widget
        //首次绘制图表时把widgetId 置入html 元素中
        widgetId = $(dom).attr("widget-id");

    }
    if(widgetId == null )  return false;
    let widget = getWidgetByWidgetID(widgetId);
    let viewData = getViewDataByViewId(widget,null,param.name);
    let graphData = buildMapData(viewData);
    geoCoordMap = {};
    let mapConfig = {};
    if (param.name in provinces) {
        //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
        let map = {};
        map['mapName']=provinces[param.name];
        map['areaName']=param.name;
        map['level']= 1;//省
        mapConfig.map = map;
        renderMap(domId,title,graphData,mapConfig);
    } else if (param.name in cityMap) {
        //如果是【直辖市/特别行政区】只有二级下钻
        if (special.indexOf(param.name) >= 0) {
            let map = {};
            map['mapName']=cityMap[param.name];
            map['areaName']=param.name;
            map['level']= 2;//地市
            mapConfig.map = map;
            renderMap(domId,title,graphData,mapConfig);
        } else {
            //显示县级地图
            let map = {};
            map['mapName']=cityMap[param.name];
            map['areaName']=param.name;
            map['level']= 2;//区县
            mapConfig.map = map;
            renderMap(domId,title,graphData,mapConfig);
        }
        console.log(geoCoordMap)
    } else {
        let map = {};
        map['mapName']="china";
        map['areaName']="中国";
        map['level']= 0;//中国
        mapConfig.map = map;
        renderMap(domId,title,graphData,mapConfig);
    }
}

let convertData = function(data) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
            });
        }
    }
    return res;
};

/**
 * 设置缺省map
 * @param name
 * @param config
 */
function setConfig(name,config) {
    console.log("config.map",config.map);
    if(config.map !== null && config.map !== undefined) return config;
    if(name === "成都市") {
        let map = {};
        map['mapName']='510100';
        map['areaName']='成都市';
        map['level'] = 2;
        config.map = map;
        return config;
    }
    if(name === "四川") {
        let map = {};
        map['mapName']='510000';
        map['areaName']='四川';
        map['level'] = 1;
        config.map = map;
        return config;
    }
    //其他
    let map = {};
    map['mapName']='china';
    map['areaName']='中国';
    map['level'] =0;
    config.map = map;
    return config;
}
