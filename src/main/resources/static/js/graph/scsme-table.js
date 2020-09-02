
function renderTable(id, title, bizData, mapParamJson) {
    let mapCharts = echarts.init(document.getElementById(id));
    echartMap[id] = mapCharts;
    if (mapParamJson == null) {
        mapParamJson = {};
        setConfig(mapParamJson['map'].areaName,mapParamJson)
    }

    let data = getMapDataByMapName(mapParamJson['map'].areaName,mapParamJson['map'].level);

    echarts.registerMap(mapParamJson['map'].mapName, data);

    let option = buildMapOption(mapCharts,bizData,mapParamJson,data);
    mapCharts.setOption(option);

    //点击事件
    mapCharts.on('click', function (param) {
        //mapDrill(this.getDom(),param);
        mapDrillAction(this.getDom(),param);
    });
}
