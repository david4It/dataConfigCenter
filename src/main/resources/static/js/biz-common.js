
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
