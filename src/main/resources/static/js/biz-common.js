
/**
 * get projects
 * @returns {boolean}
 */
function getSampleDisps(projectId){
    let ret = null;
    $.ajax({
        url: "/layout/list",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 200) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.result;
                //insert data to page;
                let htmlContent = "";
                for(let i in ret){
                    htmlContent +='<div class="item" style="background-image:images/project-default.png " data-w="150" data-h="150"> '
                        + '<a href="' + ret[i].url +'" target="_blank"><img style="width:17rem;height: 10rem" src="images/project-default.png"></a> '
                        + '<div class="over picover"><a href="' + ret[i].url +'" target="_blank">' + ret[i].title +'</a></div> '
                        + '</div> '
                }


                $("#" + projectId).html(htmlContent);
                //end
                $.cookie("token",data.token,{
                    expires: 10
                });
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
 * get displays
 * @param htmlElementId
 * @returns {*}
 */
function getDisplays(htmlElementId){
    let ret = null;
    $.ajax({
        url: "api/v3/displays?projectId="+	localStorage.getItem("projectId"),
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.data;
                //insert data to page;
                let htmlContent = "";
                for(let i in ret){
                    htmlContent +='<div class="item" style="background-image:images/project-default.png " data-w="150" data-h="150"> '
                        + '<a href="/display-setting?displayId=' + ret[i].id +'" target="_blank"><img style="width:17rem;height: 10rem" src="images/project-default.png"></a> '
                        + '<div class="over picover"><a href="/display-setting?displayId=' + ret[i].id +'" target="_blank">' + ret[i].name +'</a></div> '
                        + '</div> '
                }


                $("#" + htmlElementId).html(htmlContent);
                //end
                $.cookie("token",data.token,{
                    expires: 10
                });
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
 * get projects
 * @param htmlElementId
 * @returns {*}
 */
function getProjects(htmlElementId){
    let ret = null;
    $.ajax({
        url: "api/v3/projects",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.data;
                //insert data to page;
                let htmlContent = "";
                for(let i in ret){
                    htmlContent +='<div class="item" style="background-image:images/project-default.png " data-w="150" data-h="150"> '
                        + '<a href="/manager?projectId=' + ret[i].id +'" target="_blank"><img style="width:17rem;height: 10rem" src="images/project-default.png"></a> '
                        + '<div class="over picover"><a href="/manager?projectId=' + ret[i].id +'" target="_blank">' + ret[i].name +'</a></div> '
                        + '</div> '
                }


                $("#" + htmlElementId).html(htmlContent);
                //end
                $.cookie("token",data.token,{
                    expires: 10
                });
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
 * get display datas include slideMemWidget,view,widgets
 * @param htmlElementId
 * @returns {*}
 */
function getWidgets(displayId, displaySlideId){
    let ret = null;
    $.ajax({
        url: "/api/v3/displays/" + displayId + "/slides/" + displaySlideId,
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.data;
                //console.log("#### ret = : ",ret)
                //end
                $.cookie("token",data.token,{
                    expires: 10
                });
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
 * save display slide
 * [{config: "{"slideParams":{"transitionSpeed":"default","backgroundColor":[255,255,255,50],"scaleMode":"scaleWidth","backgroundImage":"/image/display/1592470964516_89c1bcf9-147b-461d-a4bf-322e23f8608b.jpg","transitionGlobal":true,"transitionStyleOut":"none","autoSlideGlobal":true,"transitionStyleIn":"none","width":1920,"autoSlide":"10","autoPlay":true,"borderStyle":"dashed","height":1440}}"
         displayId: 1
         id: 8
         index: 1}]
 */
function createSlideByDisplayId( displayId ) {
    if(displayId == null || displayId === "") return;
    let slide = null;
    let obj = {};
    obj.index = 1;
    obj.displayId = displayId;
    obj.config='"slideParams":{"transitionSpeed":"default","backgroundColor":[255,255,255,50],"scaleMode":"scaleWidth","backgroundImage":"/image/display/1592470964516_89c1bcf9-147b-461d-a4bf-322e23f8608b.jpg","transitionGlobal":true,"transitionStyleOut":"none","autoSlideGlobal":true,"transitionStyleIn":"none","width":1920,"autoSlide":"10","autoPlay":true,"borderStyle":"dashed","height":1440}}';
    $.ajax({
        url: "/api/v3/displays/"+ displayId +"/slides",
        type: "Post",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                layer.msg("数据保存成功", {icon: 1, time: 1000});
                slide = data.data;
                //console.log(slide);
                $.cookie("token",data.token,{
                    expires: 10
                });
            } else {
                layer.msg("保存失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("保存失败", {icon: 2, time: 1000});
        }
    });
    return slide;
}

/**
 * get slides by display id
 * @param displayId
 * @returns {boolean|number}
 */
function querySlidesByDisplayId(displayId){
    // 通过data.elem.dataset可以得到保存的对象id
    // data.elem.value可以得到下拉框选择的文本
    let slides = null;
    if(displayId === "") return false;
    $.ajax({
        url: "/api/v3/displays/"+ displayId +"/slides",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                slides = data.data.slides;
                $.cookie("token",data.token,{
                    expires: 10
                });
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
        }
    });
    return slides;
}

/**
 * get view by view id
 * @param viewId
 * @returns {boolean}
 */
function getViewByViewID(viewId){
    let ret = null;
    if(viewId === "" || viewId == null) return false;
    $.ajax({
        url: "/api/v3/views/"+ viewId,
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.data;
                $.cookie("token",data.token,{
                    expires: 10
                });
                return false;
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
                return false;
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
            return false;
        }
    });
    return ret;
}

/**
 * get source by source id
 * @param projectId
 * @returns {boolean|*}
 */
function getSourceByProjectID(projectId){
    let ret = null;
    if(projectId === "" || projectId == null) return false;
    $.ajax({
        url: "/api/v3/sources?projectId="+ projectId,
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.data;
                $.cookie("token",data.token,{
                    expires: 10
                });
                return false;
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
                return false;
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
            return false;
        }
    });
    return ret;
}
/**
 * get view data by view id
 * /1/getdata
 */
function getViewResultByViewId() {
    let globalWidgetData = null;
    // 构造request data
    let aggregators = [],
        groups=[],
        cache=false,
        expired=0,
        filters= [],
        flush= false,
        nativeQuery=false,
        orders= [],
        pageNo=0,
        pageSize= 0;

    //取category columns
    let ret = getCategoriesAndValues();
    aggregators = ret.aggregators;
    groups = ret.groups;
    //取 Filters columns //TODO:
    let data = JSON.stringify({aggregators:aggregators,groups:groups,cache: false,expired: 0,filters: [],
        flush: false,nativeQuery: false,orders: [],pageNo: 0,pageSize: 0});
    $.ajax({
        url: "/api/v3/views/"+viewId + "/getdata",
        type: "POST",
        dataType: "json",
        data: data,
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                //console.log(data);
                $.cookie("token",data.token,{
                    expires: 10
                });
                globalWidgetData = data;
            } else {
                //layer.msg("查询失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            //layer.msg("查询失败", {icon: 2, time: 1000});

        }
    });
    return globalWidgetData;
}

/**
 * get widget by widget id
 * @param widgetId
 * @returns {boolean}
 */
function getWidgetByWidgetID(widgetId){
    if(widgetId === "" || widgetId == null) return false;
    let ret = null;
    $.ajax({
        url: "/api/v3/widgets/"+ widgetId,
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                ret = data.data;
                $.cookie("token",data.token,{
                    expires: 10
                });
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
 * delete slide mem widgets
 * @param displayId
 * @param slideId
 * @param memWidgetId
 * @returns {boolean}
 */
function deleteSlideMemWidgit(displayId,slideId,memWidgetId){
    if(memWidgetId === "" || memWidgetId == null) return false;
    let ids=[];
    ids[0]=memWidgetId;
    //console.log("ids:", ids)
    $.ajax({
        url: "/api/v3/displays/"+displayId+"/slides/"+slideId+"/widgets",
        type: "DELETE",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        data:JSON.stringify(ids),
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                //ret = data.data;
                $.cookie("token",data.token,{
                    expires: 10
                });
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
        }
    });
   // return ret;
}

/**
 * get view data by view id
 * /1/getdata
 */
function getDataByViewId(viewId) {
    let retData = null ;
    // 构造request data
    let aggregators = [],
        groups=[],
        cache=false,
        expired=0,
        filters= [],
        flush= false,
        nativeQuery=false,
        orders= [],
        pageNo=0,
        pageSize= 0;

    //取category columns
    let ret = getCategoriesAndValues();
    aggregators = ret.aggregators;
    groups = ret.groups;
    //取 Filters columns //TODO:
    let data = JSON.stringify({aggregators:aggregators,groups:groups,cache: false,expired: 0,filters: [],
        flush: false,nativeQuery: false,orders: [],pageNo: 0,pageSize: 0});
    $.ajax({
        url: "/api/v3/views/"+viewId + "/getdata",
        type: "POST",
        dataType: "json",
        data: data,
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                //layer.msg("查询成功", {icon: 1, time: 1000});
                console.log(data);
                $.cookie("token",data.token,{
                    expires: 10
                });
                retData = data;
            } else {
                layer.msg("查询失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("查询失败", {icon: 2, time: 1000});
        }
    });
    return retData;
}

/**
 * 获取要展示的维度和指标
 */
function getCategoriesAndValues(){
    let aggregators = [],
        groups=[];
    let ret={};
    //取category columns
    let cateoryNodes = document.getElementById("dragedDimesion").childNodes;
    let j = 0;
    for(let i=0;i<cateoryNodes.length;i++){
        if(i==0) continue;
        let dataValue = cateoryNodes[i].getAttribute("data-value");
        if(dataValue != null){
            groups[j] = dataValue;
            j++;
        }
    }
    //取 value columns
    let valueNodes = document.getElementById("dragedValue").childNodes;
    let k = 0;
    for(let i=0;i<valueNodes.length;i++){
        if(i==0) continue;
        let dataValue = valueNodes[i].getAttribute("data-value");
        if(dataValue != null){
            let temp = {};
            temp.column = dataValue;
            temp.func = "sum";
            aggregators[k] = temp;
            k++;
        }
    }
    ret.aggregators=aggregators;
    ret.groups = groups;
    return ret;
}

/**
 * 保存memWidgets data.
 * @param data[]
 * @returns {*}
 */
function updateMemDispSlideWidget(data) {
    let retdata = null;
    let displayId = localStorage.getItem("displayId");
    let displaySlideId = localStorage.getItem("slideId");
    $.ajax({
        url: "/api/v3/displays/"+ displayId +"/slides/"+ displaySlideId + "/widgets",
        type: "PUT",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        async: false,
        headers: {
            "Authorization":$.cookie("token")//此处放置请求到的用户token
        },
        success: function (data) {
            if (data.code == 0) {
                layer.msg("数据保存成功", {icon: 1, time: 1000});
                retdata = data.data;
                $.cookie("token",data.token,{
                    expires: 10
                });
            } else {
                layer.msg("数据保存失败", {icon: 2, time: 1000});
            }
        },
        fail: function (data) {
            layer.msg("保存失败", {icon: 2, time: 1000});
        }
    });
    return retdata;
}
