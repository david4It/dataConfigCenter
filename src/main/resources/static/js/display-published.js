layui.use(['element', 'form', 'layedit', 'laydate', 'upload', 'colorpicker','table'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        layedit = layui.layedit,
        laydate = layui.laydate,
		table = layui.table;
	getProjects();
});

/**
 * get projects
 * @returns {boolean}
 */
function getProjects(){
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
				for(let prop in ret){
					htmlContent +='<div class="layui-col-md6"> '
						+ '<div class="layui-card"> '
						+ '<div class="layui-card-header"> <a href="' + ret[0].url +'" target="_blank"> ' + ret[0].title + '</a></div> '
						+ '<div class="layui-card-body image-style"> '
						+ ' <a href="' + ret[0].url +'" target="_blank"> <img src="images/project-default.png"> </a>'
						+ '</div> '
						+ '</div> '
						+ '</div> '
				}
				$("#prjectId").html(htmlContent);
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
