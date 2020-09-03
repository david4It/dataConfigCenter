/**
 * according to DATAV, generate tables of big scream
 * @param id
 * @param title
 * @param bizData
 * @param mapParamJson
 */
function renderRotationTable(id, title, legendData, data) {
    let header = [], tableData = [];
    let bizData = convertTableData(data);
    let newDiv = document.createElement("div");
    newDiv.id="dvTable";
    newDiv.style ='width: 100%;height:100%;float:left;margin-left: 1rem;';
    //清理子元素
    let doc = document.getElementById(id);
    removeGraphElements(id);
    doc.appendChild(newDiv);
    let html = '<dv-scroll-board :config="config" style="width:100%;height:100%" />';
    let res = Vue.compile(html)
    new Vue({
        data() {
            return{
                config: {
                    header: bizData.header,
                    data: bizData.bizData,
                    index: true,
                    columnWidth: [50],
                    align: ['center']
                }
            }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
    }).$mount("#dvTable");

}

/**
 * js 调用vue组件
 * @param component
 * @param parent
 */
/**注册组件 */
function registerComponent(name){
    dm[name] = {};
    Vue.component(name + '-component', function(resolve, reject){
        $.get('./modules/' + name + '.vue').then(function(rv){
            var temp = rv.match(/<template[^>]*>([\s\S]*?)<\/template>/)[1].replace(/(^\s+)|\n/g, ''),
                script = rv.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1].replace(/(^\s+)|\n/g, '');
            script = (new Function('return ' + script))();
            script.template = temp;
            script.props || (script.props=["param"]);
            script.data || (script.data=function(){ return JSON.parse(JSON.stringify(this.param))});

            resolve(script);
        }).catch(function(err){
            console.error(err);
            resolve({
                template: '<div style="text-align:center; line-height:5em;">NOT FOUND</div>'
            });
        });
    });
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
