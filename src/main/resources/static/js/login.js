function login() {
    var form = document.getElementById("loginForm");
    let username = $("#username").val();
    let password = $("#password").val();
    let verifyKey = $("#verifis").val();
    console.log("username : " + username);
    if (username == "") {
        ShowWarn("请输入登录账号");
        return false;
    }
    if (password.length < 6) {
        ShowWarn("登录密码最少6位数");
        return false;
    }
    if (verifyKey == "") {
        ShowWarn("请输入验证码");
        return false;
    }
    if (verifyKey.length < 4) {
        ShowWarn("验证码最少为4位数");
        return false;
    }
    $.ajax({
        url: "api/v3/login",
        type: "Post",
        data: JSON.stringify({"username":username,"password":password}),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                ShowSuccess(data.msg);

                $.cookie("uid",data.data.id,{
                    expires: 10
                });
                $.cookie("token",data.token,{
                    expires: 10
                });
                setTimeout(function () {
                    window.location.href = "/portal";
                }, 1000);
                return false;
            } else {
                ShowFailure(data.msg);
                return false;
            }
        }
    });
    return false;
}
function register() {
    let username = $("#username").val();
    let password = $("#password").val();
    let email = $("#email").val();
    let verifyKey = $("#verifis").val();
    if (username == "") {
        ShowWarn("请输入登录账号");
        return false;
    }
    if (password.length < 6) {
        ShowWarn("登录密码最少6位数");
        return false;
    }

    if (email.length < 6) {
        ShowWarn("邮箱最少6位数");
        return false;
    }
    if (verifyKey == "") {
        ShowWarn("请输入验证码");
        return false;
    }
    if (verifyKey.length < 4) {
        ShowWarn("验证码最少为4位数");
        return false;
    }
    $.ajax({
        url: "api/v3/users",
        type: "Post",
        data: JSON.stringify({"username":username,"password":password,"email":email}),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.code == 0) {
                ShowSuccess(data.msg);
                //$.cookie('data',data,{ path: "/"});
                setTimeout(function () {
                    window.location.href = "/";
                }, 1000);
                return false;
            } else {
                ShowFailure(data.msg);
                return false;
            }
        }
    });
    return false;
}
