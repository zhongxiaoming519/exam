$(function () {

    if (document.referrer===''){
        document.open();
        location.replace( "login.html");
        document.close();
    }



    //浏览器缩放
    $(window).bind("resize", function () {
        resizeWindow();
    });
    resizeWindow()


    $("#username").keydown(function (e) {
        var curkey = e.which;
        if (curkey == 13) {
            $("#userpassword").focus();
        }
    });

    $('#userpassword').keydown(function (event) {
        if (event.keyCode == 13) {
            if (!G.ui.tips.isShown()) {
                submit();
            }
        }
    });

    $("#login_button").click(function () {
        submit();
    });


    //用户名、密码清空
    $(".hasclear").keyup(function () {
        var t = $(this);
        t.siblings('span').toggle(Boolean(t.val()));
    });

    $(".clearer").hide($(this).siblings('input').val());

    $(".clearer").click(function () {
        $(this).siblings('input').val('').focus();
        $(this).hide();
    });


    $("#login_form").validate({
        rules: {
            username:{
                required: true,
                userName:true
            },
            password: {
                required: true,
                minlength: 6,
                maxlength:16
            }
        },
        messages: {
            username:{
                required: "请输入用户名",
                userName:"用户名只能输入字母、数字、下划线"
            },
            password: {
                required: "请输入登陆密码",
                minlength: $.validator.format("密码不能小于{0}个字符"),
                maxlength: $.validator.format("密码不能超过{0}个字符")
            }
        }
    });
});


function submit() {
    if ($("#login_form").valid()) {
        jQuery.support.cors = true;
        $.ajax({
            url: Application.serverHost + "/authenticate/"+$("#username").val()+"/"+$("#userpassword").val(),

            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.errcode == 0) {

                    var token = data.data.token;
                    //$.cookie("login_username", $("#username").val(), { expires: 1, path: '/' });
                    $.cookie("Token",token,{ expires: 1, path: '/' });
                    $.cookie("password",$("#userpassword").val(),{ expires: 1, path: '/' });
                    Application.Util.ajaxConstruct(Application.serverHost + "/userauthority",'POST', {}, 'json', function(data){


                        if(data.errcode == 0){
                            if(data.data.user.state=='q'){
                                G.ui.tips.info('您已退学，不能登录');
                                return;
                            }
                            //$.cookie("login_role", data.data.roles, { expires: 1, path: '/' });
                            //$.cookie("role_name", data.data.rolesname, { expires: 1, path: '/' });
                            //$.cookie("user", JSON.stringify(data.data.user), { expires: 1, path: '/' });
                            if(data.data.roles.ROLE_ADMIN ==true){
                                location.replace( "adminmain.html?token="+token);
                            }else if(data.data.roles.ROLE_USER ==true){
                                //window.location.href = "usermain.html?token="+token;
                                location.replace('usermain.html?token='+token);
                            }

                        }


                    },function(data){

                    } )

                }
                else {
                    if (!$("#fallr-overlay").is(":visible")) {
                        G.ui.tips.err(data.errmsg);
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.readyState ==0){
                    G.ui.tips.err("连接服务失败，请检查服务配置！");
                }else if(errorThrown=='Unauthorized'&&XMLHttpRequest.readyState ==4){
                    G.ui.tips.err("登录失败： " +'用户名或密码错误');
                }
                else if (XMLHttpRequest.readyState ==1||XMLHttpRequest.status==500) {
                    G.ui.tips.err("登录失败： " +'服务器内容错误，请联系管理员！');
                }else if(XMLHttpRequest.status==404){
                    G.ui.tips.err("连接服务失败，请检查服务配置！");
                }
            }
        });
    }
}

function resizeWindow(){
    var tmpHeight = $(document).height() - $("#body-container").offset().top -70;
    $("#body-container").css("height", tmpHeight);
    var formLeft = $(document.body).width() / 2 - 150;
    var formTop = tmpHeight / 2 - 70;
    $("#login_form").css("left", formLeft).css("top", formTop);
}