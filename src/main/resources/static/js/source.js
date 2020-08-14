layui.use(['element', 'form', 'layedit', 'laydate', 'upload', 'colorpicker','table'], function(){
    var form = layui.form,
        layer = layui.layer,
		element = layui.element,
        layedit = layui.layedit,
        laydate = layui.laydate,
        upload = layui.upload,
		table = layui.table,
		colorpicker = layui.colorpicker;

	/**日期选择**/
		/**开始日期**/
	laydate.render({elem: '#start_time', type: 'datetime'});
		/**结束日期**/
    laydate.render({elem: '#end_time', type: 'datetime'});

	/**颜色选择**/
	colorpicker.render({
		elem: '#font-color',
		color: '#1c97f5',
		done: function(color){
			$('#font-color-input').val(color);
		}
	});
	let token = $.cookie("token");
	//console.log("cookie: " , token);
	///api/v3/sources/test 数据源测试

	/**
	 * 操作管理--数据操作
	 * @param String url 请求路径
	 * @param json data.field 提交的json数据
	 * @return json code 0:操作成功；1:value 返回操作后的状态
	 */
    form.on('submit(execute)', function(data) {
        layer.confirm('确认要保存吗？',function(index) {
			layer.load();
            var url = data.field.request_url;
			console.log(data.field);
			let uid=$.cookie("uid");
			data.field.id=uid;
			data.field.projectId=localStorage.getItem("projectId");
			let config={};
			config.username=data.field.username;
			config.password = data.field.password;
			config.url = data.field.url;
			data.field.config= config;
            $.ajax({
                url:'' + url + '',

                type:'Post',
                data:JSON.stringify(data.field),
                dataType: "json",
				contentType: "application/json;charset=utf-8",
				xhrFields: {
					withCredentials: true //允许跨域带Cookie
				},
				headers: {
					"Authorization":$.cookie("token")//此处放置请求到的用户token
				},
                success: function (data) {
					layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.msg(data.msg, {icon: 1, time: 1000});
                        setTimeout(function () {
                            window.parent.location.reload();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        }, 1000);
                    } else {
                        layer.msg(data.msg, {icon: 2, time: 1000});
                        return false;
                    }
                },
				error : function(e){
					layer.closeAll('loading');
					layer.msg(e.responseText, {icon: 2, time: 1000});
				}
            });
            return false;
        });
        return false;
    });

	/**
	 * 操作管理--数据状态
	 * @param object switch 当前
	 * @param int id 当前操作对象ID
	 * @param int status 当前操作对象状态
	 * @return json code 0:操作成功；1:value 返回操作后的状态
	 */
    form.on('switch', function(switchs) {
		layer.confirm('确认要修改吗？', function(index) {
			layer.load();
			var id = $(switchs.elem).data('id');
			var url = $(this).data('url');
			var status = switchs.value;
			$.ajax({
				url:''+ url +'',
				type:'Post',
				data:{'id':id, 'status':status},
				dataType:'json',
				success:function(data) {
					layer.closeAll('loading');
					if(data.code == 0){
						$(switchs.elem).attr('value', data.data);
						layer.msg(data.msg,{icon:1,time:1000});
						return false;
					}else{
						layer.msg(data.msg,{icon:2,time:1000});
						return false;
					}
				},
				error : function(e){
					layer.closeAll('loading');
					layer.msg(e.responseText, {icon: 2, time: 1000});
				}
			});
			return false;
		});
    });

	/**
	 * 操作管理--文件上传
	 * @param upload_pictures 需要上传事件ID
	 * @param place 文件存放位置
	 * @param layui_progress 进度条事件
	 * @param images_url 返回路径赋值图片ID
	 * @return json code 0:操作成功；1:操作失败；route 返回的图片路径
	 */
    upload.render({
        elem: '#upload_pictures',
		url: '',
		data:{
			file_place: function (){
				return $(this).data('place');
			}
        },
		multiple: true,
		progress: function(n){
            var percent = n + '%';
            element.progress('layui_progress', percent);
        },
		before: function(obj){
            layer.load();
        },
		done: function (data) {
            layer.closeAll('loading');
            if (data.code == 0) {
                layer.msg(data.msg, {icon: 1, time: 1000});
                $('#images_url').attr('src', data.route);
                var id_name = $(this)[0]['elem'][0]['attributes'][2]['value'];
                $('#' + id_name).val(data.route);
				return false;
            } else {
                layer.msg(data.msg, {icon: 2, time: 1000});
                return false;
            }
        },
		error: function(e){
            layer.closeAll('loading');
            layer.msg(e.responseText, {icon: 2, time: 1000});
        }
    });

	table.render({
		elem: '#orgList'  //绑定table id
		,url:'/api/v3/sources?projectId=' + localStorage.getItem("projectId")  //数据请求路径
		,xhrFields: {
			withCredentials: true //允许跨域带Cookie
		},
		headers: {
			"Authorization": token //此处放置请求到的用户token
		}
		,cellMinWidth: 80
		,cols: [[
			{field:'id', width:50, title: 'ID', sort: true}
			,{field:'name', width:280, title: '名称'}
			,{field:'description', width:320, title: '描述', sort: true}
			,{field:'type', width:120, title: '类型', sort: true}
			,{fixed: 'right',title: '操作', width:180, align:'center', toolbar: '#toolBar'}//一个工具栏  具体请查看layui官网
		]]
		,page: true   //开启分页
		,response:{
			statusName:'code', //规定返回的状态码字段为code
			statusCode:0 //规定成功的状态码味200
		}
		, done: function (res, curr, count) {
			console.log(res);
			$.cookie("token",res.token,{
				expires: 10
			});
		}

	});

	//监听工具条
	table.on('tool(demo)', function(obj){
		var data = obj.data;
		if(obj.event === 'detail'){
			layer.msg('ID：'+ data.id + ' 的查看操作');
		} else if(obj.event === 'del'){
			let state = execute_del(obj,obj.id,"/api/v3/organizations/"+ obj.id);
			if(state) obj.del();
		} else if(obj.event === 'edit'){
			layer.alert('编辑行：<br>'+ JSON.stringify(data))
		}
	});

});

/**
 * 操作管理--打开界面
 * @param String title 界面标题
 * @param String url 访问路径
 * @param int width 打开宽度
 * @param int height 打开高度
 */
function execute_open(title, url, width, height) {
    layer.open({
        type: 2,
        title: ''+ title +'',
        shadeClose: true,
        shade: 0.8,
        area: [''+ width +'px', ''+ height +'px'],
        content: ''+ url +'',
    });
}

/**
 * 操作管理--数据删除
 * @param object obj 当前操作对象
 * @param int id 操作ID
 * @param String url 访问路径
 * @return json code 0:操作成功；1:操作失败
 */
function execute_del(obj, id, url) {
    layer.confirm('确认要删除吗？', function(index) {
		layer.load();
        $.ajax({
            url:''+ url +'',
            type:'Delete',
            success:function(data) {
				layer.closeAll('loading');
                if (data.code == 0) {
                    $(obj).parents("tr").remove();
                    layer.msg(data.msg,{icon:1,time:1000});return false;
                } else {
                    layer.msg(data.msg,{icon:2,time:1000});return false;
                }
            },
			error : function(e){
				layer.closeAll('loading');
				layer.msg(e.responseText, {icon: 2, time: 1000});
			}
        });
    });
}

/**选项卡切换**/
var nav_id = $('.layui-this').data('nav');
$('#layui_nav_left_' + nav_id).show();

$('.layui-layout-left').find('.layui-nav-item').click(function () {
	var nav_id = $(this).data('nav');
	$('#layui_nav_left_' + nav_id).show().siblings().hide();
});

$('.layui-nav-child').find('dd').find('a').click(function () {
	var url = $(this).data('url');
	$('.layui-iframe').attr('src', url);
});
function testDbConnetion() {
	let username = $("#username").val();
	let password = $("#password").val();
	let projectId = localStorage.getItem("projectId");
	let url = $("#url").val();
	$.ajax({
		url: "/api/v3/sources/test",
		type: "Post",
		data: JSON.stringify({"username":username,"password":password,"uid":$.cookie("uid"),"url":url,"projectId":projectId}),
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
				layer.msg("数据库连接成功", {icon: 1, time: 1000});

				$.cookie("uid",data.data.id,{
					expires: 10
				});
				$.cookie("token",data.token,{
					expires: 10
				});
				return false;
			} else {
				layer.msg("数据库连接失败", {icon: 2, time: 1000});
				return false;
			}
		},
		fail: function (data) {
			layer.msg("数据库连接失败", {icon: 2, time: 1000});
			return false;
		}
	});
}
