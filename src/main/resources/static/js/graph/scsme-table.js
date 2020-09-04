/**
 * according to DATAV, generate tables of big scream
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderRotationTable(id, title, legendData, data) {
    let bizData = convertTableData(data);
    let newDiv = document.createElement("div");
    newDiv.id="dvTable";
    //newDiv.style ='width: 100%;height:100%;margin-left: 1rem;margin-right: 2px;';
    //清理子元素
    let doc = document.getElementById(id);
    removeGraphElements(id);
    doc.appendChild(newDiv);
    let html = '<dv-scroll-board :config="config" style="font-size:0.8rem;width:90%;height:90%;margin:1rem 1rem 2rem 1rem;" />';
    let res = Vue.compile(html)
    new Vue({
        data() {
            return{
                config: {
                    //header: bizData.header,
                    data: bizData.bizData,
                    index: true,
                    columnWidth: [40],
                    align: ['center'],
                    headerHeight:5
                }
            }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
    }).$mount("#dvTable");


}
/**
 * according to DATAV, generate tables of big scream
 * data format(data: [{name: '周口',value: 55 }]
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderRankTable(id, title, legendData, data) {
    let bizData = convertMapData(data);
    let newDiv = document.createElement("div");
    newDiv.id="dvRankTable";
    newDiv.style ='width: 100%;height:100%;float:left;margin-left: 1rem;';
    //清理子元素
    let doc = document.getElementById(id);
    removeGraphElements(id);
    doc.appendChild(newDiv);
    let html = '<dv-scroll-ranking-board :config="config"  style="font-size:0.8rem;width:90%;height:90%;margin:1rem 0.5rem 1rem 1rem;"  />';
    let res = Vue.compile(html)
    new Vue({
        data() {
            return{
                config: {
                    data: bizData.bizData
                }
            }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
    }).$mount("#dvRankTable");

}
/**
 * according to DATAV, generate tables of big scream
 * data format(data: [{name: '周口',value: 55 }]
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderWaterPond(id, title, legendData, data) {
    let bizData = convertWaterPondData(data);
    let newDiv = document.createElement("div");
    newDiv.id="dvRankTable";
    newDiv.style ='width: 90%;height:90%;float:left;margin-left: 1rem;';
    //清理子元素
    let doc = document.getElementById(id);
    removeGraphElements(id);
    doc.appendChild(newDiv);
    let html = '<dv-water-level-pond :config="config"  style="font-size:0.8rem;width:90%;height:90%;margin:1rem 0.5rem 1rem 1rem;"  />';
    let res = Vue.compile(html)
    new Vue({
        data() {
            return{
                config: {
                    data: bizData.bizData,
                    shape: 'roundRect'
                }
            }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
    }).$mount("#dvRankTable");

}
/**
 * according to DATAV, generate Capsule
 * data format(data: [{name: '周口',value: 55 }]
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderCapsule(id, title, legendData, data) {
    let bizData = convertMapData(data);
    let newDiv = document.createElement("div");
    newDiv.id="dvRankTable";
    newDiv.style ='width: 100%;height:100%;float:left;margin-left: 1rem;';
    //清理子元素
    let doc = document.getElementById(id);
    removeGraphElements(id);
    doc.appendChild(newDiv);
    let html = '<dv-capsule-chart :config="config" style="width:100%;height:100%" />';
    let res = Vue.compile(html)
    new Vue({
        data() {
            return{
                config: {
                    data: bizData.bizData,
                    //colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
                    unit: '单位',
                    showValue: true
                }
            }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
    }).$mount("#dvRankTable");

}
/**
 * according to DATAV, generate ring
 * data format(data: [{name: '周口',value: 55 }]
 * @param id
 * @param title
 * @param legendData
 * @param data
 */
function renderRing(id, title, legendData, data) {
    let bizData = convertMapData(data);
    let newDiv = document.createElement("div");
    newDiv.id="dvRankTable";
    newDiv.style ='width: 100%;height:100%;float:left;margin-left: 1rem;';
    //清理子元素
    let doc = document.getElementById(id);
    removeGraphElements(id);
    doc.appendChild(newDiv);
    let html = '<dv-active-ring-chart :config="config" style="width:100%;height:100%" />';
    let res = Vue.compile(html)
    new Vue({
        data() {
            return{
                config: {
                    radius: '60%',
                    activeRadius: '70%',
                    data: bizData.bizData,
                    digitalFlopStyle: {
                        fontSize: 20
                    },
                    showOriginValue: true
                }
            }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
    }).$mount("#dvRankTable");

}
function removeGraphElements(id) {
    let doc = document.getElementById(id);
    //_echarts_instance_="ec_1599122401576" _echarts_instance_
    if(doc.getAttribute("_echarts_instance_") !=null) {
        doc.removeAttribute("_echarts_instance_");
       // console.log("remove _echarts_instance_ ");
    }
    //清除所有子元素
    let childs = doc.childNodes;
    $.each(childs,function (index,item) {
        //console.log("childs[index]",childs[index]);
        if(childs[index] !== undefined && childs[index] != null)
            doc.removeChild(childs[index])
    })
}

/**
 * 转换表格数据
 * @param data
 */
function convertTableData(data) {
    let header = [], tableData = [],ret={};
    let columns = data.data.columns;
    let bizData = data.data.resultList;
    $.each(columns,function (index,item) {
        console.log(index,item);
        header[index]=item.name;
    })
    console.log("header:",header);
    $.each(bizData,function (index,item) {
        let one = [];
        $.each(header,function (index2,col) {
            one[index2]= item[col];
        })
        tableData[index]=one;
    })
    console.log("tableData",tableData);
    ret["header"] = header;
    ret["bizData"] = tableData;
    return ret;
}
/**
 * 转换表格数据
 * @param data
 */
function convertMapData(data) {
    let header = [], tableData = [],ret={};
    let columns = data.data.columns;
    let bizData = data.data.resultList;
    $.each(columns,function (index,item) {
        console.log(index,item);
        header[index]=item.name;
    })
    console.log("header:",header);
    $.each(bizData,function (index,item) {
        let one = {};
        $.each(header,function (index2,col) {
            if(index2 ===0)
                one["name"]=item[col]
            if(index2 ===1)
                one["value"]=item[col]
        })
        tableData[index]=one;
    })
    console.log("tableData",tableData);
    ret["header"] = header;
    ret["bizData"] = tableData;
    return ret;
}

/**
 * build water level pond data
 * @param data
 */
function convertWaterPondData(data) {
    let header = [], tableData = [],ret={};
    let columns = data.data.columns;
    let bizData = data.data.resultList;
    $.each(columns,function (index,item) {
        console.log(index,item);
        header[index]=item.name;
    })
    console.log("header:",header);
    $.each(bizData,function (index,item) {
        $.each(header,function (index2,col) {
            if(index2 ===1)
                tableData[index]=item[col]
        })
    })
    console.log("tableData",tableData);
    ret["header"] = header;
    ret["bizData"] = tableData;
    return ret;
}
