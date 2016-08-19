/**
 * Created by zhongxiaoming on 2015/11/6.
 * Class main.js
 */
$(document).ready(function(){
    if (document.referrer===''){
        document.open();
        location.replace( "login.html");
        document.close();
    }

    $('.datePicker').datepicker({
        startDate: '0d',
        language: 'zh-CN',
        todayHighlight:true,
        toggleActive:true,
        format:'yyyy-mm-dd',
        autoclose:true
    });

    $.cookie("Token",GetQueryString('token'),{ expires: 1, path: '/' });

    Application.Util.ajaxConstruct(Application.serverHost + "/userauthority",'POST', {}, 'json', function(data){


        if(data.errcode == 0){
            $.cookie("login_role", data.data.roles, { expires: 1, path: '/' });
            $.cookie("role_name", data.data.rolesname, { expires: 1, path: '/' });
            $.cookie("user", JSON.stringify(data.data.user), { expires: 1, path: '/' });
            Application.user = data.data.user;
            Application.zdays = data.data.days;
            //$('#forum').attr('href',Application.forum+'/discuz_login_api.php?username='+data.data.user.username+'&password'+data.data.user.password);
            $('#forumlink').attr('href',Application.forum+'/discuz_login_api.php?username='+data.data.user.username+'&password='+$.cookie("password")+"&action=login");
            Application.useroj = inituserinfo(Application.user);
            Application.userstate = {'z':'滞学','y':'在学','j':'结业','x':'休学','q':'退学','t':'临时学员','e':'延学','h':'恢复','c':'超期','w':'未开通'}
            initUserPopoverPanel(Application.useroj);
            //$('#username').text(Application.user.name);
            //$('#userstate').text(Application.user.name)
            //$('#enddata').text(Application.user.name)
            //$('#days').text(Application.user.name)
            //查询课程学习

            //初始化课程表格
            initLessonList();

            //初始化作业与考试列表
            initWorkAndExamTable();
            //初始化章节列表
            initChapterSetList();
            //初始化模拟考试
            initSimulationExamTable();

            //初始化结业考试
            initGraduationExamTable();

            /***
             * 初始化专业选择
             */
            initSpecialSelectTable();

            //查询专业列表
            getSpecialList();
            //查询模块列表


            //初始化章节测试
            initWorkAndChaptertestTable();

            initWorkAndChapterExamTable();
            $(document).find('iframe').height($(document).height());
            //初始化学业申请
            initApply();

        }


    },function(data){
        G.ui.tips.info('查询用户信息出错！');
    } )



    //利用事件冒泡监听点击事件
    $('#main-nav.nav-tabs.nav-stacked').click(function(e){
        var target = null
        var e = e || window.event;
        if (e) {
            target = e.target;
        }
        if (window.event) {
            target = e.srcElement;
        }


        switch (e.target.hash){
            case '#lessonlist':
                assertState('kecheng',getManageCourse);
                break;
            case '#tutorship':
                assertState('jianding',getJianding);
                break;
            case '#workandexam':
                assertState('examandcate',getWorkAndExamTable);
                break;
            case '#simulationexam':
                assert(initMockExamTable,'您还没通过全部的单科考试，无法进行模拟考试')

                break;
            case '#graduationexam':
                assert(initGraduateExamTable,'您还没通过全部的单科考试，无法进行结业考试');
                break;
            case '#applypanel':
                initApplyTable();
                initStateInfoTable();
                break;

        }
    });





    $('#tutorship').css('overflow','auto');
    $('#tutorship').css('height',window.screen.height-250);

    //getManageCourse
    $('#div_baseinfopanel').on('shown.bs.modal', function (e) {
        $("#username").val(Application.user.username);
        $("#realname").val(Application.user.name);

        $("#passwordquestion").val(Application.user.passwordQuestion);
        $("#passwordanswer").val(Application.user.passwordAnswer);

        $('#idnumber').val(Application.user.zjhm);

        $("#gender").select2({
            data:function () {
                return { results: [{id:1,text:'男'},{id:2,text:'女'}]};
            }

        }).select2("val",Application.user.gender);

        $("#email").val(Application.user.email);

        $("#birthday").val(new Date( parseInt(Application.user.birthday.toString().length==10?Application.user.birthday+'000':Application.user.birthday)).Format('yyyy-MM-dd'));
        $("#phone").val(Application.user.phone);

        $("#cellphone").val(Application.user.cellphone);

        $("#pravince").val(Application.user.province);


        $("#unitnum").val(Application.user.unit);

        $("#address").val(Application.user.addr);
        $("#postnum").val(Application.user.postcode);

        $("#remark").val(Application.user.remark);
        $("#addtime").val(Application.user.addDate);
    })

    /*
     *	初始化时间控件
     */
    //$.each($("input.datePicker"), function (index, item) {
    //    $(item).datepicker({
    //        language: 'zh-CN',
    //        format: 'yyyy-mm-dd',
    //        multidate: false,
    //        clearBtn: false,
    //
    //        allBtn: false,
    //        autoclose: true
    //    }).on('changeDate', function (e) {
    //        onDatePickerChange(e, $(item).attr("id"));
    //    });
    //});
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
});

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
/*
 * 时间控件change事件
 *
 */
function onDatePickerChange(e, id) {
    //if(e.date == undefined){
    //    return;
    //}
    //var timeStamp = e.date.getTime();
    //switch (id) {
    //
    //    case "birthday":
    //
    //        break;
    //    case "adddate":
    //
    //        $("#adddate").datepicker("setStartDate", e.date);
    //
    //        break;
    //
    //}
}
function inituserinfo(user){

    var userobj ={};
    userobj.$reg_begin = user['regDate'];
        userobj.$reg_end = user['regEnd'];
        userobj.$userid = user['id'];
        userobj.$user_name = user['username'];
        userobj.$name2 = user['name'];
        userobj.$user_state = user['state'];
        userobj.$is_graduated = user['isGraduated'];

    if(userobj.$reg_begin){
        if(userobj.reg_end == 0){
            //$reg_end = $state_manager->update_user_valid_period($userid);
        }

        if(userobj.$reg_end >= new Date().getTime()/1000){
            userobj.$dayleft2 = parseInt((userobj.$reg_end - new Date().getTime()/1000)/86400)+1;
            userobj.$dayleft = $dayleft='有效期至'+ new Date( parseInt(user['regEnd'].toString().length==10?user['regEnd']+'000':user['regEnd'])).Format('yyyy-MM-dd')+', 学期还剩['+userobj.$dayleft2+']天';
        }else{
            userobj.$dayleft='您已超过有效学习时间, 请申请“延期”！';
            Application.user.state ='c';
        }
        if(userobj.$user_state == 'z'){
            userobj.$dayleft='重新激活请在“学籍管理”中申请“恢复”！';
        }

    }else {
        userobj.$dayleft='本学年尚未开始';
    }

    return userobj;
}

function initUserPopoverPanel(userobj){

    var zDayString = '';
    if(Application.zdays !=0){
        zDayString = "您已滞学 "+Application.zdays+"天，请抓紧时间学习！"
    }
    $('#userinfo').html('<div style="word-break:break-all;width:100%;padding: 10px; border:1px solid #D5D5D5;margin-left:1px;font-size:15px" class="row">['+userobj.$name2+']' +
    '学员您好，欢迎进入全军心理咨询师培训平台!您现在处于[<a id="userstate">'+
    Application.userstate[userobj.$user_state]+'</a>]状态, '+zDayString
    +userobj.$dayleft+'</div>');


    $('body').find("[data-toggle='popover']").each(function(){
        $(this).click(function(event){
            window.event?window.event.cancelBubble=true:event.stopPropagation();
            //$('.popover').remove();
            //e.preventDefault();
            //return false;
        });
        $(this).popover({
            trigger : 'click', html: true,
            content:function(){
                return ' <a class="btn btn-primary btn-xs" data-toggle="modal" ' +
                    'data-target="#div_baseinfopanel" style="position: relative;left: 0px">修改资料</a>' +
                    '<a class="btn btn-primary btn-xs" data-toggle="modal" data-target="#passwordmodal"' +
                    ' style="position: relative;left:5px">密码修改</a>'
            }
        });
    });
    $('body').click(function(){
        $('.popover').remove();
    });
}
//关闭修改密码对话框
function closePasswordModal() {
    $('#passwordmodal').modal('toggle');

    $('#updatePwd_form input[type = "password"]').val('');
}

/***
 * 保存用户
 */
function submitUserInfo(){
    Application.user.username = $("#username").val();
    Application.user.passwordQuestion = $("#passwordquestion").val();
    Application.user.passwordAnswer = $("#passwordanswer").val();
    Application.user.name = $("#realname").val();
    Application.user.phone = $("#phone").val();
    Application.user.cellphone = $("#cellphone").val();
    Application.user.mail = $("#email").val();
    Application.user.zjhm = $('#idnumber').val();
    Application.user.birthday = $("#birthday").val();
    Application.user.province = $("#pravince").val();
    Application.user.unit =  $("#unitnum").val();
    Application.user.addr = $("#address").val();
    Application.user.postcode = $("#postnum").val();
    Application.user.remark = $("#remark").val();
    Application.user.password = null;
    Application.user.gender = $("#gender").select2("val");

    var para ='parameter='+JSON.stringify(Application.user);
    Application.Util.ajaxConstruct(Application.serverHost + "/authenticate/changepassword",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#div_baseinfopanel').modal('toggle');
            G.ui.tips.suc('修改成功！')
        }else{
            G.ui.tips.err('修改失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

//关闭对话框
function closeModal() {
    $('#div_baseinfopanel').modal('toggle');

    $('#rightgroup').select2('val');
    $("#username").val('');
    $("#passwordquestion").val('');
    $("#passwordquestion").val('');
    $("#passwordanswer").val('');
    $("#realname").val('');
    $("#phone").val('');
    $("#cellphone").val('');
    $("#email").val('');
    $('#idnumber').val('');
    $("#birthday").val('');
    $("#pravince").val('');
    $("#unitnum").val('');
    $("#address").val('');
    $("#postnum").val('');
    $("#remark").val('');

    $("#gender").select2("val")

}
function iFrameHeight() {

    var ifm= document.getElementById("lessonframe");

    var subWeb = document.frames ? document.frames["lessonframe"].document :

        ifm.contentDocument;

    if(ifm != null && subWeb != null) {

        ifm.height = subWeb.body.scrollHeight;

    }

}
function iFrameHeightjianding() {

    var ifm= document.getElementById("lessonframejianding");

    var subWeb = document.frames ? document.frames["lessonframejianding"].document :

        ifm.contentDocument;

    if(ifm != null && subWeb != null) {

        ifm.height = subWeb.body.scrollHeight;

    }

}
/***
 * 初始化课程列表
 */

/***
 * 查询主页列表
 */
function getSpecialList(){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getProfessionalManagementList",'POST',{},'json',function(data){
        if(data.errcode == 0){

            Application.specialList = data.data;
            //初始化下拉列表
            var arr = []

            for(var i in Application.specialList){

                for(var k in Application.user.signSpecial.split(',')){
                    if(Application.user.signSpecial.split(',')[k] == Application.specialList[i].id&&Application.specialList[i].valid!=0){
                        arr.push({id:Application.specialList[i].id, text:Application.specialList[i].title})
                    }

                }

            }
            $.cookie('specialid',Application.user.signSpecial.split(',')[0],{ expires: 1, path: '/' });
            $("#userspecials").select2({
                data: function () {
                    return { results: arr};
                }
            }).select2("val", arr[0].id).on("change", function (e) {
                $.cookie('specialid',e.val,{ expires: 1, path: '/' });
                getModuleList(e.val);
                getNewsList();
                assertState('kecheng',getManageCourse);
                $('#kechengxuexi').tab('show')
            });

            getModuleList(arr[0].id);
            assertState('kecheng',getManageCourse);
            $('#kechengxuexi').tab('show')
            getNewsList()
        }else{
            console.log(data.errmsg);
        }

    },function(data){
        g.ui.tips.err('查询失败！！');
    });
}

/***
 * 查询模块列表
 */
function getModuleList(id){

    Application.Util.ajaxConstruct(Application.serverHost + "/content/getmodulelist",'POST',{},'json',function(data){
        if(data.errcode == 0){
            Application.moduleList = data.data;
            assertState('kecheng',getManageCourse);
            for(var i in Application.moduleList){
                if(Application.moduleList[i].paths.indexOf(id) !=-1){
                    //Application.moduleList[i].status = 1;

                    $('#'+Application.moduleList[i].module).show();
                }else{
                    $('#'+Application.moduleList[i].module).hide();
                }
            }

        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    })
}


/***
 * 课程管理
 */
function getManageCourse(bool){

    Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassManagementList",'POST',{},'json',function(data){
        if(data.errcode == 0){
            Application.lessonData = data.data;
            $('#tdlessonlist').bootstrapTable('load',filterLessons($("#userspecials").select2('val'),bool));
        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    })
}

/***
 * 鉴定辅导
 */
function getJianding(bool){
    var path = $('#userspecials').select2('val');

    var parameter = 'parameter='+JSON.stringify({path:'0-'+path})

    if(bool){
        Application.Util.ajaxConstruct(Application.serverHost + "/content/getAppraisalList",'POST',parameter,'json',function(data){
            if(data.errcode == 0){
                Application.Jianding=data.data;
                $('#tutorship').empty();
                var html=''
                for(var item in data.data){
                    if(data.data[item].state =='n'){
                        html+='<div class="panel panel-default"> <div class="panel-heading"> <a  href="#divtutorshiplist'+item+'"  > <h3 class="panel-title">'+data.data[item].title+'</h3> </a></div> <div id = "divtutorshiplist'+item+'" class="panel-body"> <ul id = "tutorshiplist'+item+'"</ul> </div></div>'

                        getJiandingNode(data.data[item].id,'tutorshiplist'+item);
                    }

                }
                $('#tutorship').append(html);
            }else{
                G.ui.tips.err('查询失败！！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！');
        },'application/x-www-form-urlencoded')
    }else{
        $('#tutorship').empty();
        $('#tutorship').append('当前状态无权限！');
    }




}

/***
 * 生成具体项
 * @param pid
 * @param divid
 */
function getJiandingNode(pid,divid){

    var divid =divid;
    var para = 'parameter='+JSON.stringify({iid:pid})
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getAppraisalNodesList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            Application.Jiandingnodelist=data.data;
            $('#'+divid).empty();

            var htmlStr = '';
            for(var i= 0,len =data.data.length; i<len; i++){

                htmlStr+='<li><a href="#vediopagejianding" onclick="setVedioAndPptjianding(event)" data-value="'+data.data[i].ppt_url+'|'+data.data[i].video_url+'|'+data.data[i].title+'" data-toggle="tab" target="#">'+data.data[i].title+'</a></li>';

            }
            $('#'+divid).append(htmlStr);
        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded')
}

function setVedioAndPpt(e){
    var paths = $(e.currentTarget).attr('data-value');

            $('#lessontitle').text(paths.split('|')[2]);

            $('#lessonframe').attr('src', Application.host+'/lesson/'+paths.split('|')[0]);


            $('#flashcontainer').empty();
            var so = new SWFObject('../js/lib/flvplayer/pl.swf','mpl','300px','240px','9');

            so.addParam('allowfullscreen','true');
            so.addParam('allowscriptaccess','always');
            so.addParam('wmode','opaque');
            so.addVariable('file',Application.host+'/video/'+paths.split('|')[1]);
            so.addVariable('frontcolor','333333');
            so.addVariable('autostart','true');
            so.addVariable('controlbar','over');
            so.addVariable('controlbar.idlehide', 'true');
            so.addVariable('playerready','playerReadyCallback');
            so.write('flashcontainer');




}

function setVedioAndPptjianding(e){
    var paths = $(e.currentTarget).attr('data-value');

    $('#lessontitlejianding').text(paths.split('|')[2]);

    $('#lessonframejianding').attr('src', Application.host+'/lesson/'+paths.split('|')[0]);


    $('#flashcontainerjianding').empty();
    var so = new SWFObject('../js/lib/flvplayer/pl.swf','mpl','300px','240px','9');

    so.addParam('allowfullscreen','true');
    so.addParam('allowscriptaccess','always');
    so.addParam('wmode','opaque');
    so.addVariable('file',Application.host+'/video/'+paths.split('|')[1]);
    so.addVariable('frontcolor','333333');
    so.addVariable('autostart','true');
    so.addVariable('controlbar','over');
    so.addVariable('controlbar.idlehide', 'true');
    so.addVariable('playerready','playerReadyCallback');
    so.write('flashcontainerjianding');




}

function filterLessons(id, hasRight){
    var data = []
    for(var index in Application.lessonData){
        Application.lessonData[index].hasRight = hasRight;
        if(id == Application.lessonData[index].pid){
            data.push(Application.lessonData[index]);
        }
    }
    return data;
}


function initLessonList(){
    $('#tdlessonlist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 210,
        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageSize:20,
        columns: [

            {
                field: 'no',
                align: 'center',
                title: '编号'

            }
            ,

            {
                field: 'title',
                title: '课程标题',
                align: 'center',

                formatter:function(value, row){
                    return '<a href="#managecourseeditor"  data-toggle="tab">'+value+'</a>'
                }

            },

            //{
            //    field: 'progress',
            //    align: 'center',
            //    title: '进度'
            //
            //},
            {
                field: 'operate',
                align: 'center',
                title: '操作',
                formatter:function(value, row){
                    if(row.hasRight){
                        return '<a  class="btn-primary btn-sm" href="#vediopage"  data-toggle="tab" data-value='+row.code+' style="font-size: 12px ;height:28px">开始学习</a>'
                    }else{
                        return '无权限'
                    }

                }
            }

        ]


    }).on('click-row.bs.table', function (e, row, $element) {
        var para = 'parameter='+JSON.stringify({iid:row.id,cate:1});
        getChapterContent(para);
    });
}


function startstudy(e){
    $('#div_lessonpanel').modal();

}

/***
 * 初始化章节列表
 */
function initChapterSetList(){
    $('#coursechapterlist').bootstrapTable({

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        showHeader:false,
        clickToSelect: true,
        singleSelect: true,
        pageSize:100,

        columns: [


            {
                field:'status',
                align:'center',

                checkbox:true

            },
            {
                field: 'title',
                title: '课程标题',
                align: 'left',

                formatter:function(value, row){
                    return '<a href="#coursecontenteditor"  data-toggle="tab">'+value+'</a>'
                }

            }]
    }).on('click-row.bs.table', function (e, row, $element) {
        setLessStudyVedioAndPpt(row.video_url, row.ppt_url,row.title);
    });
}

function setLessStudyVedioAndPpt(vediourl, ppturl,title){

    $('#lessontitle').text(title);

    $('#lessonframe').attr('src', Application.host+'/lesson/'+ppturl);


    $('#flashcontainer').empty();
    var so = new SWFObject('../js/lib/flvplayer/pl.swf','mpl','300px','240px','9');

    so.addParam('allowfullscreen','true');
    so.addParam('allowscriptaccess','always');
    so.addParam('wmode','opaque');
    so.addVariable('file',Application.host+'/video/'+vediourl)//paths.split('|')[1]);
    so.addVariable('frontcolor','333333');
    so.addVariable('autostart','true');
    so.addVariable('controlbar','over');
    so.addVariable('controlbar.idlehide', 'true');
    so.addVariable('playerready','playerReadyCallback');
    so.write('flashcontainer');




}

function getWorkAndExamTable(hasRight){

    var para ='parameter='+ JSON.stringify({userId:Application.user.id,path:'0-'+$('#userspecials').select2("val")});
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getWorkAndExamList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            var arr=[];
            for(var item in data.data){
                if(data.data[item].state !='z'){
                    data.data[item].hasRight = hasRight;
                    arr.push(data.data[item])
                }

            }
            $('#workandexamtable').bootstrapTable('load',arr);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function getChapterContent(para){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassChapterList",'POST',para,'json',function(data){
        if(data.errcode == 0){

            $('#coursechapterlist').bootstrapTable('load', data.data);

            if(data.data.length!=0){
                setLessStudyVedioAndPpt(data.data[0].video_url, data.data[0].ppt_url,data.data[0].title);
            }

        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


/***
 * 初始化作业与考试列表
 */
function initWorkAndExamTable() {
    $('#workandexamtable').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 220,
        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,

        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageSize:15,


        columns: [
            {
                field: 'no',
                align: 'center',
                title: '编号'

            },
            {
                field: 'title',
                title: '课程名称',
                align: 'center'

            },

            {
                field: 'chapterexam',
                align: 'center',
                title: '章节测试',
                formatter:function(value, row){
                    if(row.hasRight){
                        return '<a type="button" href="#workandchaptertest" data-toggle="tab" class="btn btn-primary btn-xs" data-value='+row.cid+' data-tile = '+row.title+' onclick="startChapterTest('+row.id+')"style="font-size: 12px ">开始</a>'
                    }else{
                        return '无权限'
                    }

                }
            },
            {
                field: 'singleexam',
                align: 'center',
                title: '单科考试',
                formatter:function(value, row){
                    if(row.hasRight){
                        return '<a id="singleexambtn" type="button" href="#workandchapterexam" data-toggle="tab" class="btn btn-primary btn-xs" data-value='+row.path+' onclick="startChapterExam('+row.id+')" style="font-size: 12px">开始</a>'
                    }else{
                        return '无权限'
                    }

                }
            }
            ]
    });
}



function startChapterTest(id,fun,type){

    var tableData =  $('#workandexamtable').bootstrapTable('getData');

    for(var item in tableData){
        if(tableData[item].id == id){
            $('#testtile').html(tableData[item].title);
            $('#examtile').html(tableData[item].title);
        }
    }

    Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassChapterList",'POST',"parameter="+JSON.stringify({iid:id,cate:2}),'json',function(data){
        if(data.errcode == 0){
            var para ='parameter='+ JSON.stringify({userId:Application.user.id,cid:id,cate:2});
            Application.Util.ajaxConstruct(Application.serverHost + "/edu/getChapterExamList",'POST',para,'json',function(score){
                if(score.errcode == 0){

                    for(var item in data.data){
                        for(var key in score.data){
                            if(data.data[item].id == score.data[key].chapterId){
                                data.data[item]['maxScore'] = score.data[key].maxScore;
                            }
                        }

                    }
                    if(type=='test'){
                        $('#workandchaptertesttable').bootstrapTable('load',data.data);
                    }

                    else if(type=='exam'){
                        $('#workandchapterexamtable').bootstrapTable('load',data.data);
                    }

                    if(fun){
                        var boolComplete = true;
                        for(var obj in data.data){
                            if(data.data[obj]['maxScore']==null ||data.data[obj]['maxScore']<60){
                                boolComplete = false
                            }
                        }
                        if(boolComplete){
                            fun(id)
                        }else{
                            var arr=[{title:'单科考试',maxScore:'章节测试全部通过才能进行单科考试',value:0}]
                            $('#workandchapterexamtable').bootstrapTable('load',arr);
                        }
                    }
                }else{
                    G.ui.tips.err(data.errmsg);
                }

            },function(data){
                G.ui.tips.err('查询失败！！')
            },'application/x-www-form-urlencoded')

        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded');

}

function startChapterExam(id){
    startChapterTest(id,function(id){
        Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassChapterList",'POST',"parameter="+JSON.stringify({iid:id,cate:4}),'json',function(data){
            if(data.errcode == 0){
                var para ='parameter='+ JSON.stringify({userId:Application.user.id,cid:id,cate:4});
                Application.Util.ajaxConstruct(Application.serverHost + "/edu/getChapterExamList",'POST',para,'json',function(score){
                    if(score.errcode == 0){

                        for(var item in data.data){
                            data.data[item]['maxScore'] = 0;
                            for(var key in score.data){
                                if(data.data[item].id == score.data[key].chapterId){
                                    data.data[item]['maxScore'] = score.data[key].maxScore;
                                }
                            }

                        }


                        $('#workandchapterexamtable').bootstrapTable('load',data.data);
                    }else{
                        G.ui.tips.err(data.errmsg);
                    }

                },function(data){
                    G.ui.tips.err('查询失败！！')
                },'application/x-www-form-urlencoded')
            }
        },function(data){
            G.ui.tips.err('查询失败！！')
        },'application/x-www-form-urlencoded');
    });




}



function initWorkAndChaptertestTable(){
    $('#workandchaptertesttable').bootstrapTable({

        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,

        //showColumns: true,
        //showRefresh:false,
        //showToggle:true,
        pageSize:15,


        columns: [
            {
                field: 'title',
                align: 'center',
                title: '每节作业'

            },
            {
                field: 'maxScore',
                title: '分值记录',
                align: 'center'

            },

            {
                field: '',
                align: 'center',
                title: '分节测试',
                formatter:function(value, row){
                    return '<a type="button" class="btn btn-primary btn-sm" data-value="'+row.iid+'|'+'0-'+row.id+'|'+row.duration+'" onclick="startNewTest(event)" style="font-size: 12px ">开始新的答题</a>'
                }
            }
        ]
    });
}

function initWorkAndChapterExamTable(){
    $('#workandchapterexamtable').bootstrapTable({

        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,

        //showColumns: true,
        //showRefresh:false,
        //showToggle:true,
        pageSize:15,


        columns: [
            {
                field: 'title',
                align: 'center',
                title: '单科考试'

            },
            {
                field: 'maxScore',
                title: '分值记录',
                align: 'center'

            },

            {
                field: '',
                align: 'center',
                title: '开始考试',
                formatter:function(value, row){
                    if( isNaN(row.maxScore)){
                        return '';
                    }
                    return row.maxScore<60?'<a type="button" class="btn btn-primary btn-sm" data-value="'+row.iid+'|'+row.id+'|'+row.duration+'" onclick="startNewExam(event)" style="font-size: 12px ">开始</a>':'<a   style="font-size: 12px ">已通过</a>'
                }
            }
        ]
    });
}

function initApply(){

    $('#studentapply').bootstrapTable({

        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        pageSize:15,


        columns: [
            {
                field: 'applydate',
                align: 'center',
                title: '申请提交时间',
                formatter:function(value,row){
                    return new Date(parseInt(value+'000')).Format('yyyy-MM-dd')
                }

            },
            {
                field: 'applystate',
                title: '申请类型',
                align: 'center',
                formatter:function(value,row){
                    if(value =='x'){
                        return '休学'
                    }else if(value =='y'){
                        return '在学'
                    }else if(value=='h'){
                        return '恢复'
                    }else if(value=='e'){
                        return '延学'
                    }
                }

            },

            {
                field: 'startdate',
                align: 'center',
                title: '起始时间',
                formatter:function(value,row){
                    return new Date(parseInt(value+'000')).Format('yyyy-MM-dd')
                }

            },
            {
                field: 'enddate',
                title: '终止时间',
                align: 'center',
                formatter:function(value,row){
                    return new Date(parseInt(value+'000')).Format('yyyy-MM-dd')
                }

            },  {
                field: 'approve',
                title: '审批结果',
                align: 'center',
                formatter:function(value,row){
                    if(value==0){
                        return '未审核';
                    }else if(value ==1){
                        return '通过';
                    }else{
                        return '反对';
                    }
                }

            },{
                field: 'comment',
                title: '补充信息',
                align: 'center'

            }
        ]
    });



    $('#studentduration').bootstrapTable({

        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        pageSize:15,


        columns: [
            {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value,row){
                    if(value =='x'){
                        return '休学'
                    }else if(value =='y'){
                        return '在学'
                    }else if(value=='h'){
                        return '恢复'
                    }else if(value=='e'){
                        return '延学'
                    }
                }

            },


            {
                field: 'startdate',
                align: 'center',
                title: '起始时间'
                ,
                formatter:function(value,row){
                    return new Date(parseInt(value+'000')).Format('yyyy-MM-dd')
                }
            },
            {
                field: 'enddate',
                title: '终止时间',
                align: 'center'
                ,
                formatter:function(value,row){
                    return new Date(parseInt(value+'000')).Format('yyyy-MM-dd')
                }
            }
        ]
    });



}

function startNewTest(e){
    $('#testtile').html()
    var target = null
    var e = e || window.event;
    if (e) {
        target = e.target;
    }
    if (window.event) {
        target = e.srcElement;
    }
    var cate= 2,cid = $(target).attr('data-value').split('|')[0],userId=Application.user.id,cpath= $(target).attr('data-value').split('|')[1];
    //var  para =JSON.stringify({userId:12627,cate:cate,cid:17,cpath:cpath});
    //var  para =JSON.stringify({userId:userId,cate:cate,cid:cid,cpath:'0-167'});
    var  para =JSON.stringify({userId:userId,cate:cate,cid:cid,cpath:cpath,isdk:false});
    $.cookie('duration',$(target).attr('data-value').split('|')[2]*60);
    $.cookie('querypara',para,{ expires: 1, path: '/' });
    $.cookie('queryurl','/edu/getDiffChapterTestList',{ expires: 1, path: '/' });
    $.cookie('examtype','分节测试',{ expires: 1, path: '/' })
    window.open('examing.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');

}


function startNewExam(e){
    var target = null
    var e = e || window.event;
    if (e) {
        target = e.target;
    }
    if (window.event) {
        target = e.srcElement;
    }

    var cate= 4,cid = $(target).attr('data-value').split('|')[0],userId=Application.user.id,cpath= '0-'+$(target).attr('data-value').split('|')[1];
    var  para =JSON.stringify({userId:userId,cate:cate,cid:cid,cpath:cpath,isdk:true});
    $.cookie('duration',$(target).attr('data-value').split('|')[2]*60);
    $.cookie('querypara',para,{ expires: 1, path: '/' });
    $.cookie('queryurl','/edu/getDiffChapterTestList',{ expires: 1, path: '/' });
    $.cookie('examtype','单科考试',{ expires: 1, path: '/' })

    window.open('examing.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
}


function assert(fun,text){
    var para ='parameter='+ JSON.stringify({userId:Application.user.id,path:'0-'+$('#userspecials').select2("val")});
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getWorkAndExamList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            var arr = []
            for(var item in data.data){
                arr.push(data.data[item].id)
            }


            var para ='parameter='+ JSON.stringify({userId:Application.user.id,cate:4,cids:arr.join(',')});
            Application.Util.ajaxConstruct(Application.serverHost + "/edu/getChapterExamResult",'POST',para,'json',function(data){
                if(data.errcode == 0){
                    if(arr.length == data.data.length){
                       fun();
                    }else{
                        var resultarr = [{id:'',name:text}]
                        $('#simulationexamtable').bootstrapTable('load',resultarr);
                        $('#graduationexamtable').bootstrapTable('load',resultarr);
                        if(Application.user.state =='j'){
                            var resultarr = [{id:'',name:'您已结业！'}]
                            $('#graduationexamtable').bootstrapTable('load',resultarr);
                        }
                    }
                }else{
                    G.ui.tips.err(data.errmsg);
                }

            },function(data){
                G.ui.tips.err('查询失败！！')
            },'application/x-www-form-urlencoded')



        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}
/***
 * 查询模拟考试列表
 */
function initMockExamTable(){
    var para ='parameter='+ JSON.stringify({userId:$('#userspecials').select2("val")})
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getMockExamTypeList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#simulationexamtable').bootstrapTable('load',data.data);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function assertComplete(){
    var para ='parameter='+ JSON.stringify({userId:Application.user.id,path:'0-'+$('#userspecials').select2("val")});
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getWorkAndExamList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            for(var i in data.data){
                getImg(data.data.id,data.data.length);
            }
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


/***
 * 初始化模拟考试列表
 */
function initSimulationExamTable(){
    $('#simulationexamtable').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,

        showColumns: true,
        showRefresh:false,
        showToggle:true,

        columns: [
            {
                field: 'id',
                align: 'center',
                title: '编号'

            },
            {
                field: 'name',
                title: '考试类型',
                align: 'center'

            },

            {
                field: 'operate',
                align: 'center',
                title: '操作',
                formatter:function(value, row){
                    if(row.id==''){
                        return '';
                    }
                    return '<a type="button" class="btn btn-primary" data-value="'+row.id+'|'+row.duration+'|'+row.name+'" onclick="getMockExamTypeList1(event)" style="font-size: 12px ;height:28px">开始模拟考试</a>'
                }
            }
        ]
    });
}

//模拟考试
function getMockExamTypeList1(e){
    var target = null
    var e = e || window.event;
    if (e) {
        target = e.target;
    }
    if (window.event) {
        target = e.srcElement;
    }
    var id = $(target).attr('data-value').split('|')[0];
    var duration = $(target).attr('data-value').split('|')[1];
    $.cookie('queryurl','/edu/getMockOrRealExamList',{ expires: 1, path: '/' });
    var  para =JSON.stringify({testTypeId:id,enabled:1,is_mock:1,is_real:0});
    $.cookie('querypara',para,{ expires: 1, path: '/' });
    $.cookie('duration',duration*60,{ expires: 1, path: '/' });
    $.cookie('examtype',$(target).attr('data-value').split('|')[2]+'模拟考试',{ expires: 1, path: '/' });
    $.cookie('examtid',id,{ expires: 1, path: '/' })
    window.open('examing.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');

}


function initGraduateExamTable(){

    var para ='parameter='+ JSON.stringify({userId:$('#userspecials').select2("val")})
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getMockExamTypeList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#graduationexamtable').bootstrapTable('load',data.data);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}
function initApplyTable (){

    var stateArr=[];
    var state = Application.user.state;
    switch(state){
        case 'c':
            stateArr =[{id:'e',text:'延学'}];
            break;
        case 'y':
            stateArr =[{id:'x',text:'休学'}];
            break;
        case 'x':
        case 'z':
            stateArr =[{id:'h',text:'恢复'}];
            break;

    }
    $('#applyoption').select2({
        data:function () {
            return { results: stateArr};
        },
        placeholder:'-选择状态-'

    }).on('change',function(e){
        if(e.val == 'h'){
            $('#enddate').hide();
            $('#endtimetd').hide();
        }else{
            $('#enddate').show();
            $('#endtimetd').show();
        }
    })


    $('#applyoption').prop('disabled','');
    $('#submitapply').prop('disabled','');
    var para ='parameter='+ JSON.stringify({userId:Application.user.id})
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getMyApplyList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#studentapply').bootstrapTable('load',data.data);
            for(var item in data.data){
                if(data.data[item].approve == 0){
                    $('#operateinfo').html('只有申请被审批之后才能继续申请！');
                    $('#applyoption').prop('disabled','disabled');
                    $('#submitapply').attr('disabled',true);
                    break;
                }
            }
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function initStateInfoTable(){
    var para ='parameter='+ JSON.stringify({userid:Application.user.id})
    Application.Util.ajaxConstruct(Application.serverHost + "/student/getStateInfo",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#studentduration').bootstrapTable('load',data.data);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function submitapply(){
    var state =  $('#applyoption').select2('val');
    if($('#startdate').val()=='' || state == ""){
        G.ui.tips.info('请将申请条件填写完整！');
        return;
    }

    var stime = $('#startdate').val();
    var etime = $('#enddate').val();


    var sDate = NewDate(stime);

    switch ($('#applyoption').select2('val')){
        case 'x':
            if(sDate.getTime()/1000 < Application.user.regDate){
                G.ui.tips.info('休学开始时间必须在学期范围内');
                return;
            }

            var eDate = NewDate(etime);
            if(eDate.getTime()/1000>Application.user.regEnd){
                G.ui.tips.info('休学开始时间必须在学期范围内');
                return;
            }
            if((eDate-sDate)/(60*60*24*1000)<30 ||(eDate-sDate)/(60*60*24*1000)>180){
                G.ui.tips.info('休学时间必须大于30天小于180天');
                return;
            }
            break;
        case 'e':
            if((eDate-sDate)/(60*60*24*1000)<30){
                G.ui.tips.info('延学时间必须不能小于30天');
                return;
            }

            if(Application.user.regEnd>sDate){
                G.ui.tips.info('延学时间不能处于学期内');
                return;
            }
    }

    var applydata = $('#studentapply').bootstrapTable('getData');
    if(applydata.length > 0 && state == applydata[applydata.length-1].applystate){
        G.ui.tips.info('您已经提交了同样的申请，不能重复提交');
        return;
    }

    stime = stime+' 00:00:00';
    etime = etime+' 00:00:00';
    var para ='parameter='+ JSON.stringify({userId:Application.user.id,applystate:state,startdate:stime,enddate:etime});
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/submitApply",'POST',para,'json',function(data){
        if(data.errcode == 0){
            initApplyTable ();
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function NewDate(str) {
    str = str.split('-');
    var date = new Date();
    date.setUTCFullYear(str[0], str[1] - 1, str[2]);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

/***
 * 结业考试
 */
function initGraduationExamTable(){
    $('#graduationexamtable').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        columns: [
            {
                field: 'id',
                align: 'center',
                title: '编号'

            },
            {
                field: 'name',
                title: '考试类型',
                align: 'center'

            },

            {
                field: 'operate',
                align: 'center',
                title: '操作',
                formatter:function(value, row){
                    if(row.id==''){
                        return '';
                    }
                    return '<a type="button" class="btn btn-primary" data-value="'+row.id+'|'+row.duration+'|'+row.name+'" onclick="getGraduateExamTypeList(event)" style="font-size: 12px ;height:28px">开始结业考试</a>'
                }
            }
        ]
    });
}

function getGraduateExamTypeList(e){
    var target = null
    var e = e || window.event;
    if (e) {
        target = e.target;
    }
    if (window.event) {
        target = e.srcElement;
    }
    var id = $(target).attr('data-value').split('|')[0];
    var duration = $(target).attr('data-value').split('|')[1];
    $.cookie('queryurl','/edu/getMockOrRealExamList',{ expires: 1, path: '/' });
    var  para =JSON.stringify({testTypeId:id,enabled:1,is_mock:0,is_real:1});
    $.cookie('querypara',para,{ expires: 1, path: '/' });
    $.cookie('duration',duration*60,{ expires: 1, path: '/' });
    $.cookie('examtype',$(target).attr('data-value').split('|')[2]+'结业考试',{ expires: 1, path: '/' });
    $.cookie('testtypeid',$(target).attr('data-value').split('|')[0],{ expires: 1, path: '/' });
    $.cookie('examtid',id,{ expires: 1, path: '/' })
    window.open('examing.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');

}
/***
 * 初始化专业选择
 */
function initSpecialSelectTable(){
    $('#specialselecttable').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,

        columns: [
            {
                field: 'num',
                align: 'center',
                title: '编号'

            },
            {
                field: 'specialname',
                title: '专业名称',
                align: 'center'

            },

            {
                field: 'operate',
                align: 'center',
                title: '操作',
                formatter:function(value, row){
                    return '<a type="button" class="btn btn-primary" data-value='+row.code+' onclick="deleteCurrentBlock(event)" style="font-size: 12px ;height:28px">进入</a>'
                }
            }
        ]
    });
}

function submitPassword(){
    var pw1 = document.getElementById("newPassword").value;
    var pw2 = document.getElementById("passwordAgain").value;
    if(pw1.length<6||pw2.length<6){
        G.ui.tips.err('密码长度必须大于6位！')
        return;
    }
    if(pw1 != pw2){
        G.ui.tips.err('两次输入密码不一致！')
        return;
    }
    Application.user.password =document.getElementById("newPassword").value;
    Application.user.birthday = new Date( parseInt(Application.user.birthday.toString().length==10?Application.user.birthday+'000':Application.user.birthday)).Format('yyyy-MM-dd')
    var para ='parameter='+JSON.stringify(Application.user);
    Application.Util.ajaxConstruct(Application.serverHost + "/authenticate/changepassword",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#passwordmodal').modal('toggle');
            G.ui.tips.suc('修改成功！')
        }else{
            G.ui.tips.err('修改失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')

}

function getNewsList(){
    $('#newscontainer').html('')
    data = 'parameter=' + JSON.stringify({
        'pageno': 1,
        'pageSize': 50,
        'path':0+'-'+$('#userspecials').select2("val")
    })
    Application.Util.ajaxConstruct(Application.serverHost + "/news/getNewsList",'POST',data,'json',function(data){
        if(data.errcode == 0){
            var html = '';
            html+='<ul>'
            for(var i in data.data){
                if(data.data[i].state =='n'){
                    html+='<li><a target="_blank" style="color: #000000" href="news.html?id='+data.data[i].id+'">'+data.data[i].title+'</a></li>'
                }
            }
            html+='</ul>'
            $('#newscontainer').append(html);
        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded');
}


function assertState(module,fun){
    var state = Application.user.state;
    var arr = Application.rights[state];
    if($.inArray(module,arr)==-1){
        fun(false);
    }else{
        fun(true);
    }
}