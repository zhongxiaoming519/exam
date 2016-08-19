/**
 * Created by zhongxiaoming on 2015/11/6.
 * Class adminmain
 */
$(document).ready(function(){
    if (document.referrer===''){
        document.open();
        location.replace( "login.html");
        document.close();
    }
    //初始化时间控件
    //$("#addcoursedate").datepicker({
    //    language : "zh-CN",
    //    format : "yyyy-dd-mm",
    //    autoclose : true,
    //    todayHighlight : true
    //});
    //$("#newsadddate").datepicker({
    //    language : "zh-CN",
    //    format : "yyyy-mm-dd",
    //    autoclose : true,
    //    todayHighlight : true
    //});

    $('.datePicker').datepicker({
        //startDate: '0d',
        language: 'zh-CN',
        todayHighlight:true,
        toggleActive:true,
        format:'yyyy-mm-dd',
        autoclose:true
    });

    $('.container-fluid').css('height',document.body.clientHeight - 50);

    $.cookie("Token",GetQueryString('token'),{ expires: 1, path: '/' });

    Application.Util.ajaxConstruct(Application.serverHost + "/userauthority",'POST', {}, 'json', function(data){


        if(data.errcode == 0){
            $.cookie("login_role", data.data.roles, { expires: 1, path: '/' });
            $.cookie("role_name", data.data.rolesname, { expires: 1, path: '/' });
            $.cookie("role_id", data.data.groupid, { expires: 1, path: '/' });
            $.cookie("user", JSON.stringify(data.data.user), { expires: 1, path: '/' });


            Application.user =  data.data.user;
            Application.adminuser =  data.data.user
            getMainMenu();
            //权限列表
            getALlRolesList();
            //初始化管理员用户列表
            getManageuserList();
            initManageRoleList();

            //初始化专业管理
            initManageSpecialList()



            //初始化课程列表
            initCourseList();

            //初始化章节列表
            initChapterSetList();

            //初始化辅导栏目列表
            initManageAuthenticateList();
            //初始化节点列表
            initAuthenticateNodeList();
            //初始化模块列表
            initModuleSelectList();

            //初始化试听课程列表
            //initTryLessonList();
            //初始化结业考试列表
            initExamTypeList();

            initCoursePapersList();
            //技能选择
            initSelectQuestionsList();
            //案例分析
            initCaseQuestionsList();
            initCaseSubQuestionsList();
            initQAlist();
            //章节作业
            initChapterWork();
            initcourseexamlist();
            initfudaoWork();

            $('#name').text(Application.user.name);
            $('#role').text($.cookie("role_name"));
        }else{
            G.ui.tips.info('用户授权失败，请重新登陆！');
        }


    },function(data){
        G.ui.tips.info('查询用户信息出错！');
    } )

    //$('.summernote').htmlarea({})
    $('.summernote').summernote({
        height: 200,
        toolbar: [
            //[groupname, [button list]]

            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['insert', ['picture','link']],
            ['codeview',['codeview']]

        ],
        onImageUpload: function(files, editor, $editable) {
            sendFile(files[0],editor,$editable);
        }
    });

    //$('form').on('submit', function (e) {
    //    e.preventDefault();
    //    alert($('.summernote').summernote('code'));
    //    alert($('.summernote').val());
    //});


    function sendFile(file, editor, $editable){
        $(".note-toolbar.btn-toolbar").append('正在上传图片');
        var filename = false;
        try{
            filename = file['name'];
            alert(filename);
        } catch(e){filename = false;}
        if(!filename){$(".note-alarm").remove();}
//以上防止在图片在编辑器内拖拽引发第二次上传导致的提示错误
        var ext = filename.substr(filename.lastIndexOf("."));
        ext = ext.toUpperCase();
        var timestamp = new Date().getTime();
        var name = timestamp+"_"+$("#summernote").attr('aid')+ext;
//name是文件名，自己随意定义，aid是我自己增加的属性用于区分文件用户
        data = new FormData();
        data.append("file", file);
        data.append("key",name);
        data.append("token",$("#summernote").attr('token'));

        $.ajax({
            data: data,
            type: "POST",
            url: "/summernote/fileupload", //图片上传出来的url，返回的是图片上传后的路径，http格式
            contentType: "json",
            cache: false,
            processData: false,
            success: function(data) {
//data是返回的hash,key之类的值，key是定义的文件名
                alert(data);
//把图片放到编辑框中。editor.insertImage 是参数，写死。后面的http是网上的图片资源路径。
//网上很多就是这一步出错。
                $('#summernote').summernote('editor.insertImage', "http://res.cloudinary.com/demo/image/upload/butterfly.jpg");

                $(".note-alarm").html("上传成功,请等待加载");
                setTimeout(function(){$(".note-alarm").remove();},3000);
            },
            error:function(){
                $(".note-alarm").html("上传失败");
                setTimeout(function(){$(".note-alarm").remove();},3000);
            }
        });
    }


    //getQuestionsList1();
    //初始化导航菜单

    //利用事件冒泡监听点击事件
    $('#main-nav.nav-tabs.nav-stacked').click(function(e){
        switch (e.target.hash){
            case '#manageuser':
                getALlRolesList();
                getAdminRoleList();
                break;
            case '#managegroup':
                getUserGrouplist();
                break;
            case '#managespecial':
                getSpecialList();
                break;
            case '#manageinfo':
                getNewsList();
                break;
            case '#managequestions':
                getQuestionsList();
                break;
            case '#managemodule':
                getModuleList();
                break;
            case '#managecourse':
                getManageCourse();
                break;
            case '#manageauthenticate':
                getManageAuthenticateList();
                break;
            case '#batchregistermodule':
                initBatchRegisterUser()
                break
            case '#studentmanage':
                initStudentMangeList();
                //initStateInfoTable();
                break;
            case '#studentresultmanage':
                initStudentResultsMangeList()
                break;
            case '#processaplication':
                initApplyMangeList({approve:0});
                break;
            case '#graduationquery':
                initGraduationQueryList()
                break;
            case '#managepostponed':
                initManagePostponedList()
                break;
            case '#chapterexam':
                initChapterExamList();
                break;
            case '#graduateexam':
                getExamTypeList();
                break;
        }
    });


    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    //删除角色managemodulelist
    $('#managegroupdeletebutton').click(function(){

        var selectdata = $('#managerolelist').bootstrapTable('getSelections');;

        for(var i in selectdata){

            deleteUserGroup(selectdata[i].id);
        }

    });

    $('#lessondeletebutton').click(function(){
        var sdata = $('#managecourselist').bootstrapTable('getSelections');
        for(var i in sdata){
            var parameter ='parameter='+JSON.stringify({id: sdata[i].id})
            deleteLesson(parameter);
        }
    });
    initTabs('chapterListTab');




    var provinceArr=[{id:'',text:"全部"},{id:'anhui',text:"安徽"},{id:'beijing',text:"北京"},{id:'chongqing',text:"重庆"}
        ,{id:'fujian',text:"福建"},{id:'gansu',text:"甘肃"},{id:'guangdong',text:"广东"}
        ,{id:'guangxi',text:"广西"},{id:'guizhou',text:"贵州"},{id:'hainan',text:"海南"}
        ,{id:'hebei',text:"河北"},{id:'henan',text:"河南"},{id:'heilongjiang',text:"黑龙江"}
        ,{id:'hubei',text:"湖北"},{id:'hunan',text:"湖南"},{id:'jilin',text:"吉林"}
        ,{id:'jiansu',text:"江苏"},{id:'jiangxi',text:"江西"},{id:'liaoning',text:"辽宁"}
        ,{id:'neimenggu',text:"内蒙古"},{id:'ningxia',text:"宁夏"},{id:'qinghai',text:"青海"},
        {id:'shandong',text:"山东"},{id:'shanxi',text:"山西"},{id:'shanxi',text:"陕西"},
        {id:'shanghai',text:"上海市"},{id:'sichuan',text:"四川"},{id:'tianjin',text:"天津市"}
        ,{id:'xizang',text:"西藏"},{id:'xinjiang',text:"新疆"},{id:'yunnan',text:"云南"},{id:'zhejiang',text:"浙江"}]

    $('.allprovince').select2({
        data: function () {
            return { results: provinceArr };
        },
        placeholder:'--省份--'
    })

    var arr_apply_user_state = [{id:'',text:"全部"},{id:'w',text:'未开通'},{id:"y",text:"在学"},{id:"x",text:"休学"},{id:"c",text:"超期"},{id:"z",text:"滞学"},{id:"q",text:"退学"},{id:"j",text:"结业"}, {id:"t",text:"临时学员"},{id:"e",text:"延学"},{id:"h",text:"恢复"},{id:'',text:'无'}];

    $('.studentstate').select2({
        data: function () {
            return { results: arr_apply_user_state };
        },
        placeholder:'--状态--'
    })

    var arr_apply_user_state1 = [{id:'',text:"全部"},{id:'y',text:'开通'},{id:"x",text:"休学"},{id:"q",text:"退学"},{id:"j",text:"结业"}, {id:"t",text:"临时学员"},{id:"e",text:"延学"},{id:"h",text:"恢复"}];

    $('.studentstate1').select2({
        data: function () {
            return { results: arr_apply_user_state1 };
        },
        placeholder:'--状态--'
    }).select2('val',arr_apply_user_state1[0].id).on('change',function(e){
        //<li><a href="#tabpanestate">Profile</a></li>
        //<li><a href="#tabpanexiuxue">Messages</a></li>
        //<li><a href="#tabpanetuixue">Settings</a></li>
        //<li><a href="#tabpanejieye">Profile</a></li>
        //<li><a href="#tabpanelinshi">Messages</a></li>
        //<li><a href="#tabpaneyanxue">Settings</a></li>
        //<li><a href="#tabpaneyanxue">Profile</a></li>
        switch (e.val){
            case 'y':
                $('#myTab a[href="#tabpanestate"]').tab('show');
                break;
            case 'x':
                $('#myTab a[href="#tabpanexiuxue"]').tab('show');
                break;
            case 'q':
                $('#myTab a[href="#tabpanetuixue"]').tab('show');
                break;
            case 'j':
                $('#myTab a[href="#tabpanejieye"]').tab('show');
                break;
            case 't':
                $('#myTab a[href="#tabpanelinshi"]').tab('show');
                break;
            case 'e':
                $('#myTab a[href="#tabpaneyanxue"]').tab('show');
                break;
            case 'h':
                $('#myTab a[href="#tabpanehuifu"]').tab('show');
                break;

        }
    });

    $('#application').select2({
        data: function () {
            return { results: [{id:'x',text:'休学'},{id:'y',text:'延学'},{id:'h',text:'恢复'},{id:'',text:'无'}] };
        },
        placeholder:'--申请--'
    })

    $('#auditopinion').select2({
        data: function(){
            return { results: [{id:0,text:'待审核'},{id:1,text:'通过'},{id:2,text:'反对'},{id:'',text:'无'}] };
        },
        placeholder:'--审核意见--'
    }).select2('val',0);
    $('#graduatestate').select2({
        data:function(){
            return { results: [{id:"",text:'全部'},{id:0,text:'未结业'},{id:1,text:'已结业'}] };
        },
        placeholder:'-类型-'
    });

    $('#postponedstate').select2({
        data:function(){
            return { results: [{id:'e',text:'延期'},{id:'c',text:'超期'}] };
        },
        placeholder:'-类型-'
    }).select2('val','e');


    $('#examchapter').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'-章节-'
    });
    $('#modifycourse').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'-请选择课程-'
    });

    $('#modifychapter').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'-请选择章节-'
    });
    $('#applyresult').select2({
        data:function(){
            return {results: [{id:1,text:'通过'},{id:2,text:'反对'}]}
        }
    }).select2("val",1);

    $('#choicequestionstype').select2({
        data: function () {
            return { results: [{id:0,text:'单选'},{id:1,text:'多选'}]};
        },
        placeholder:'-类型-'
    }).select2("val",0).on('change',function(e){
        if(e.val ==1){
            $('.radiooptopns').hide();
            $('.checkptopns').show()
        }else{
            $('.checkptopns').hide()
            $('.radiooptopns').show();
        }
    });

    $('#newsstate').select2({
        data:function(){
            return { results: [{id:'n',text:'发布'},{id:'z',text:'不发布'}]};
        },
        placeholder:'-状态-'
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


    $('.checkptopns').each(function(index,item){
        $(this).hide();
    })
})




/***
 * 主菜单
 */
function getMainMenu(){
    Application.Util.ajaxConstruct(Application.serverHost + "/manage/createManageTree",'POST',{},'json',function(data){
        if(data.errcode == 0){
            var menudata = data.data;
            getAuthority($.cookie("role_id"),function(data){
                initMainMenu(parseMenu(menudata),data.data.priv.split(','));
                if(data.errcode == 0){

                    var html = ''
                    for(var i in data.data.priv.split(',')){
                        for(var j in Application.treeData.children){
                            for(var k in  Application.treeData.children[j].children){
                                if(Application.treeData.children[j].children[k].root_id ==data.data.priv.split(',')[i] ){
                                    html+='<li>'+Application.treeData.children[j].title+'->'+Application.treeData.children[j].children[k].title+'</li>'
                                }
                            }
                        }
                    }

                    $('#quanxianliebiao').append(html);
                }else{
                    G.ui.tips.err('查询失败！！');
                }
//初始化工具
                initTabs('dataListTab');
            });



            //初始化权限树
            $('#menutree').bstree({data:parseMenuTree(data.data),showurl:false,checkbox:true,height:'350px'});
            Application.treeData = parseMenuTree(data.data);


        }else{
            console.log('查询失败！！')
        }

    },function(data){
        console.log('查询失败！！')
    })
}


function getAuthority(name, callback){
    Application.Util.ajaxConstruct(Application.serverHost + "/getauthoritylist/"+name,'POST',{},'json',callback,function(data){
        console.log('查询失败！！')
    })
}

/**
 *
 * 目录结构树
 * @param data
 * @returns {{}}
 */
function parseMenuTree(data){
    var result = []
    var root = {};
    root.id = 0;
    root.title = "全选";
    root.children = result;

    for(var i = 0, ilen =data.system.length; i<ilen; i++){
        result.push(data.system[i]);
    }

    for(var j = 0,jlen = result.length; j<jlen; j++){
        switch (result[j].id){
            case 1:
                for(var item in data['user']){

                    data['user'][item]['root_id'] = result[j].id+"-"+data['user'][item].id

                }
                result[j]['children'] =data['user'];

                break;
            case 2:
                for(var item in data['content']){

                    data['content'][item]['root_id'] = result[j].id+"-"+data['content'][item].id

                }
                result[j]['children'] =data['content'];
                break;
            case 3:
                for(var item in data['student']){

                    data['student'][item]['root_id'] = result[j].id+"-"+data['student'][item].id

                }
                result[j]['children'] =data['student'];
                break;
            case 4:

                for(var item in data['exam']){

                    data['exam'][item]['root_id'] = result[j].id+"-"+data['exam'][item].id

                }
                result[j]['children'] =data['exam'];
                break;
            case 10:
                for(var item in data['data']){

                    data['data'][item]['root_id'] = result[j].id+"-"+data['data'][item].id

                }
                result[j]['children'] =data['data'];
                break;
        }

    }

    return root;
}


/***
 * 目录菜单
 * @param data
 * @returns {Array}
 */
function parseMenu(data){
    var result = []
    for(var i = 0, ilen =data.system.length; i<ilen; i++){
        result.push(data.system[i]);
    }

    for(var j = 0,jlen = result.length; j<jlen; j++){
        switch (result[j].id){
            case 1:
                for(var item in data['user']){

                    data['user'][item]['root_id'] = result[j].id+"-"+data['user'][item].id

                }
                result[j]['items'] =data['user'];
                break;
            case 2:
                for(var item in data['content']){

                    data['content'][item]['root_id'] = result[j].id+"-"+data['content'][item].id

                }
                result[j]['items'] =data['content'];
                break;
            case 3:
                for(var item in data['student']){

                    data['student'][item]['root_id'] = result[j].id+"-"+data['student'][item].id

                }
                result[j]['items'] =data['student'];
                break;
            case 4:
                for(var item in data['exam']){

                    data['exam'][item]['root_id'] = result[j].id+"-"+data['exam'][item].id

                }
                result[j]['items'] =data['exam'];
                break;
            case 10:
                for(var item in data['data']){

                    data['data'][item]['root_id'] = result[j].id+"-"+data['data'][item].id

                }
                result[j]['items'] =data['data'];
                break;
        }

    }
    //console.log(JSON.stringify(result));
    return result;
}

//初始化左侧主菜单
function initMainMenu(data, privs){
    var mainNav = $('#main-nav');
    var htmlStr = '';
    var itemArr = [];
    for(var key in privs){
        itemArr.push(privs[key].split('-')[0])
    }
    for(var index in data){

        if($.inArray(data[index].id+'', itemArr)!=-1){
            htmlStr +='<li> ' +
            '<a href="#systemSetting'+index+'"  class="nav-header collapsed" data-toggle="collapse"> ' +
            '<i class="glyphicon glyphicon-cog"></i>' +
            data[index].title +
            '<span class="pull-right glyphicon glyphicon-chevron-down">' +
            '</span> ' +
            '</a> ' +
            '<ul id="systemSetting'+index+'" class="nav nav-list collapse secondmenu" style="height: 0px;">';
        }


        for (var item in data[index].items){

                if($.inArray(data[index].items[item].root_id,privs)!=-1){
                    htmlStr += '<li><a href="#'+data[index].items[item].module+'" class="contentitem"   data-toggle="tab"><i class="glyphicon"></i>'+data[index].items[item].title+'</a></li>'
                }



        }
        htmlStr += '</ul></li>'
    }

    mainNav.append(htmlStr);


}


/***
 * 查询所有角色
 */
function getALlRolesList(){
    Application.Util.ajaxConstruct(Application.serverHost + "/rolelist/"+1,'POST',{},'json',function(data){
        $('#dataListTab').empty();

        var selectdata = [];

        if(data.errcode == 0){
            $('#dataListTab').append('<a href="#rawDataTab" class="btn btn-success" onclick="getUserlistByid(-1)" data-toggle="tab">全部用户</a>');
            for(var item in data.data){
                selectdata.push({id:data.data[item].id,text:data.data[item].name});

                $('#dataListTab').append('<a href="#" class="btn btn-default" role = "'+data.data[item].code +'" data-toggle="tab" onclick ="getUserlistByid('+data.data[item].id+')" >'+data.data[item].name+'</a>')
            }

            Application.rightgroup = selectdata;
            $("#rightgroup").select2({
                data: function () {
                    return { results: selectdata };
                }
            })
        }else{
            console.log('查询失败！！')
        }
//初始化工具
        initTabs('dataListTab');
    },function(data){
        console.log('查询失败！！')
    })
}

/***
 * 权限列表
 */
function getUserGrouplist(){
    Application.Util.ajaxConstruct(Application.serverHost + "/rolelist/"+1,'POST',{},'json',function(data){

        if(data.errcode == 0){
            for(var i in data.data){
                data.data[i].num = parseInt(i)+1;
            }

            $('#managerolelist').bootstrapTable('load',data.data);

        }else{
            G.ui.tips.info('查询失败！！')
        }

    },function(data){
        G.ui.tips.info('查询失败！！')
    })
}

function getUserlistByid(id){
    if(id ==-1){
        var d =  $('#manageuserlist').bootstrapTable('getData');
        $('#manageuserlist').bootstrapTable('load',Application.adminuserData);
    }else{
        var data = []
        for(var index in Application.adminuserData){
            if(id == Application.adminuserData[index].gid){
                data.push(Application.adminuserData[index]);
            }
        }

        $('#manageuserlist').bootstrapTable('load',data);
    }

}

/***
 *查询所有的管理员
 */
function getAdminRoleList(){
    Application.Util.ajaxConstruct(Application.serverHost + '/roleadminlist/1/-1','POST',{},'json',function(data){
        if(data.errcode == 0){

            for(var i =0;i < data.data.length; i++){
                data.data[i].num = i+1;
            }
            Application.adminuserData = data.data;
            $('#manageuserlist').bootstrapTable('load',data.data);
        }else {
            g.ui.tips.info('查询失败！！')
        }
    }
    )
}


//保存新建角色
function submitNewRole(){

    var title = $('#rolename').val();
    if(title == '' || title == null){
        return;
    }

    var pri = []
    var checks = $('.treecheckbox').each(function(index, item){
        if(item['checked'] ==true){
            if($(this).attr('data') !='undefined'){
                pri.push($(this).attr('data'));
            }

        }
    });
    if(pri.length ==0){
        G.ui.tips.info('当前角色的权限为空，将导致该权限的用户不能正常使用！！')
        return;
    }
    if($('#managegroupaddbutton').attr('operate') == 'update'){

        var selectedData = $('#managerolelist').bootstrapTable('getSelections');
        if(selectedData.lenth == 0){
            G.ui.tips.info('请选择要更改的纪录！')
            return;
        }
        Application.Util.ajaxConstruct(Application.serverHost + "/updaterole",'POST','parameter='+JSON.stringify({id:Application.rowRole.id,priv:pri.join(','),name:title,authority:selectedData[0].authority,code:'s'}),'json',function(data){
            if(data.errcode == 0){
                getUserGrouplist()
                $('#restoremanagegroup').tab('show')

                G.ui.tips.suc('保存成功！')
            }else{
                G.ui.tips.err('保存失败！')
            }

        },function(data){
            G.ui.tips.err('保存失败！')
        },'application/x-www-form-urlencoded')
    }else{



        Application.Util.ajaxConstruct(Application.serverHost + "/insertrole",'POST','parameter='+JSON.stringify({priv:pri.join(','),name:title,authority:'ROLE_ADMIN',code:'s'}),'json',function(data){
            if(data.errcode == 0){
                getUserGrouplist()
                $('#restoremanagegroup').tab('show')

                G.ui.tips.suc('保存成功！')
            }else{
                G.ui.tips.err('保存失败！')
            }

        },function(data){
            G.ui.tips.err('保存失败！')
        },'application/x-www-form-urlencoded')
    }



}
//重置
function resettree(){
    $('#rolename').val('');
    $('.treecheckbox').each(function(index, item){
        $(this).removeAttr("checked");
    });

}

//改变按钮状态,

function initTabs(tabId) {
    var selector = $("#" + tabId + " a");
    selector.click(function() {
        selector.removeClass("btn-success");
        selector.addClass("btn-default");
        $(this).removeClass("btn-default");
        $(this).addClass("btn-success");
        //switch ($(this).attr("href")) {
        //    case "#rawDataTab":
        //        pDataListId = "rawDataList";
        //        break;
        //    case "#dealedDataTab":
        //        pDataListId = "dealedDataList";
        //        break;
        //    case "#submitedDataTab":
        //        pDataListId = "submitedDataList";
        //        break;
        //}
    });
    //$("#" + tabId + " a:first").click();
}

function initPersonInfo(id){

    Application.isAdd =false;

    var rowdata =  $('#manageuserlist').bootstrapTable('getData');
    $("#rightgroup").attr('disabled',false);
    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })

    for(var i in rowdata){
        if(id == rowdata[i].id){

            //Application.selecteduser =  rowdata[i];

            // if(rowdata[i].live == "y"){
            //     $("#userboollive").attr("checked","checked");
            // }else{
            //     $("#userboollive").prop("checked",false);
            // }
            // for(var index in Application.rightgroup){
            //     if(rowdata[i].roleId == Application.rightgroup[index].id){
            //
            //         $('#rightgroup').select2('val',rowdata[i].roleId)
            //
            //     }
            // }
            // $('#specialpanel').hide();
            // $("#username").val(rowdata[i].username);
            // $("#realname").val(rowdata[i].name);
            //
            // $("#passwordquestion").val(rowdata[i].passwordQuestion);
            // $("#passwordanswer").val(rowdata[i].passwordAnswer);
            //
            // $('#idnumber').val(rowdata[i].zjhm);
            //
            // $("#gender").select2({
            //         data:function () {
            //             return { results: [{id:1,text:'男'},{id:2,text:'女'}]};
            //         }
            //
            // }).select2("val",rowdata[i].gender);
            //
            // $("#email").val(rowdata[i].email);
            //
            // $("#birthday").val(new Date( parseInt((rowdata[i].birthday&&rowdata[i].birthday.toString().length==10)?rowdata[i].birthday+'000':rowdata[i].birthday)).Format('yyyy-MM-dd'));
            // $("#phone").val(rowdata[i].phone);
            //
            // $("#cellphone").val(rowdata[i].cellphone);
            //
            // $("#pravince").val(rowdata[i].province);
            //
            //
            // $("#unitnum").val(rowdata[i].unit);
            //
            // $("#address").val(rowdata[i].addr);
            // $("#postnum").val(rowdata[i].postcode);
            //
            // $("#remark").val(rowdata[i].remark);
            // $("#addtime").val(rowdata[i].addDate);

            Application.user = rowdata[i];
            var row = rowdata[i];

            // if (row.live == "y") {
            //     $("#userboollive").attr("checked", "checked");
            // }
            if (row.state != "w") {
                $("#userboollive").prop("checked", "checked");
            }

            $('#rightgroup').select2('val', row.gid)
            $('#rightgroup').attr('disabled',true);

            $("#username").val(row.username);
            $("#realname").val(row.name);

            $("#passwordquestion").val(row.passwordQuestion);
            $("#passwordanswer").val(row.passwordAnswer);

            $('#idnumber').val(row.zjhm);

            $("#gender").select2({
                data: function () {
                    return {results: [{id: 1, text: '男'}, {id: 2, text: '女'}]};
                }

            }).select2("val", row.gender);

            $("#email").val(row.email);
            $("#birthday").val(row.birthday);
            $("#phone").val(row.phone);

            $("#cellphone").val(row.cellphone);

            $("#pravince").val(row.province);


            $("#unitnum").val(row.unit);

            $("#address").val(row.addr);
            $("#postnum").val(row.postcode);

            $("#remark").val(row.remark);
            $("#adddate").val(new Date( parseInt(row.add_Date.toString().length==10?row.add_Date+'000':value)).Format('yyyy-MM-dd').toString());
            $(".specialchk").prop('checked', false);
            for (var i in row.signSpecial.split(',')) {
                $('#specialpanel .specialchk').each(function (index, value) {
                    if ($(this).attr('data-id') == row.signSpecial.split(',')[i]) {
                        $(this).prop('checked', 'checked');
                    }
                    //else{
                    //    $(this).attr('checked', false);
                    //}
                })
            }



        }
    }
    $('#div_baseinfopanel').modal();
}

/****
 * 新增学员
 */
function newPersonInfo(){
    $('#specialpanel').show();
    $('#userboollive').attr('checked',false);
    $('#div_baseinfopanel').modal('toggle');
    $('#rightgroup').attr('disabled',false);
    $('#rightgroup').select2('val','');
    $("#username").val('');
    $("#password").val('');
    $("#confirmpassword").val('');
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
    var date = new Date().getTime();
    $("#gender").select2("val",'');
    $("#adddate").val(new Date( parseInt(date.toString().length==10?date+'000':date)).Format('yyyy-MM-dd'));
    Application.isAdd = true;
    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })
    $("#gender").select2({
        data:function () {
            return { results: [{id:1,text:'男'},{id:2,text:'女'}]};
        }

    })

    $('#div_baseinfopanel').modal();
}

function newStudentInfo(){
   //$('#specialpanel').hide();
    $('#div_baseinfopanel').modal('toggle');
    $('#rightgroup').attr('disabled',true);
    $('#rightgroup').select2('val')
    $("#username").val('');
    $("#password").val('');
    $("#confirmpassword").val('');
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
    var date = new Date().getTime()
    $("#gender").select2("val")
    $("#adddate").val(new Date( parseInt(date.toString().length==10?date+'000':date)).Format('yyyy-MM-dd'));
    Application.isAdd = true;
    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    }).select2("val",13);
    $("#gender").select2({
        data:function () {
            return { results: [{id:1,text:'男'},{id:2,text:'女'}]};
        }

    })
    $(".specialchk").prop('checked', false);
    $('#div_baseinfopanel').modal();
}


function newstateinfo(){
    if($('#allstudentlist').bootstrapTable('getSelections').length<=0){
        G.ui.tips.info('请选择至少一个要修改的用户！');
        return;
    }
    $('#studentstatemodal').modal('toggle');
}
function closestateinfo(){
    $('#studentstatemodal').modal('toggle');
}
function openExportStudentInfoPanel(){
    $('#exportStundentFields').modal();
}
function newyouxiaoriqi(){
    if($('#allstudentlist').bootstrapTable('getSelections').length<=0){
        G.ui.tips.info('请选择至少一个要修改的用户！');
        return;
    }
    $('#studentyouxiaoriqi').modal('toggle');
}
function exportStudent(){

    var tempForm = document.getElementById('exportStundetInfo');

    tempForm.method="post";
    $("input[name='s_operatename']").val(Application.user.name);
    $('input[name="s_operatenfromnum"]').val(parseInt($('#fromnum').val())-1);
    $('input[name="s_operatentonum"]').val(parseInt($('#tonum').val())-1);
    if($('#fromnum').val()!="" && $('#tonum').val()!="" ){
        if( ($('#tonum').val() - $('#fromnum').val()<=0)){
            G.ui.tips.info('导出数据时必须选择正确的数据范围！');
            return;
        }

    }
    tempForm.action=Application.serverHost + "/export/exportUserList";
    tempForm.submit();
}


function openexportScorespanel(){
    $("#exportStundentExam").modal();
}

function exportScores(){

    var specialid = $('#exportexamspecial').val();
    if(specialid==null || specialid==""){
        G.ui.tips.info('请选择需要导出的专业!')
        return;
    }
    var tempForm = document.getElementById('exportExamInfo');

    tempForm.method="post";
    $("#exportStundentExam input[name='s_operatename']").val(Application.user.name);
    $('#exportStundentExam input[name="s_mayor"]').val($('#exportexamspecial').val());

    if($('#examfromnum').val()!="" && $('#examtonum').val()!="" ){
        if( ($('#examtonum').val() - $('#examfromnum').val()<=0)){
            G.ui.tips.info('导出数据时必须选择正确的数据范围！');
            return;
        }

    }


    $('#exportStundentExam input[name="s_operatenfromnum"]').val($('#examfromnum').val());
    $('#exportStundentExam input[name="s_operatentonum"]').val($('#examtonum').val());
    tempForm.action=Application.serverHost + "/export/exportScoresList";
    tempForm.submit();
    //window.open(Application.serverHost + "/export/exportScoresList")


}

function closeyouxiaoriqi(){
    $('#studentyouxiaoriqi').modal('toggle');
}
function closebatchimportstudentdialog(){
    $('#batchimportstudentdialog').modal('toggle');
}

function submityouxiaoriqi(){

    var selectdata = $('#allstudentlist').bootstrapTable('getSelections');
    if(selectdata.length ==0){
        G.ui.tips.info('请选择要修改状态的用户！');
        return;
    }
    var endTime = $('#youxiaotime').val();
    if(endTime ==''||endTime==null){
        G.ui.tips.info('请选择日期！');
        return;
    }

    endTime = new Date(endTime).getTime();

    for(var item in selectdata){



        selectdata[item].regEnd =endTime/1000;
        //selectdata[item].duration = selectdata[item].regEnd - selectdata[item].regDate;
        submityouxiao(selectdata[item]);
    }
}

function submityouxiao(user){
    var para ='parameter='+JSON.stringify(user);
    Application.Util.ajaxConstruct(Application.serverHost + "/user/changvalidperiod",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#studentyouxiaoriqi').modal('toggle');
            initStudentMangeList()
            G.ui.tips.suc('修改成功！')
        }else{

            G.ui.tips.err('修改失败！'+data.data);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function submitstateinfo(){

    var selectdata = $('#allstudentlist').bootstrapTable('getSelections');
    if(selectdata.length ==0){
        G.ui.tips.info('请选择要修改状态的用户！');
        return;
    }

    var state = $('.studentstate1').select2('val');

    for(var item in selectdata){

        switch (state){
            case 'y':
                if(selectdata[item].regDate==0){
                    changeUserstate(state, selectdata[item])
                }else{
                    G.ui.tips.err( "[用户id:"+selectdata[item].username+"] 用户已经开通，无法再次开通");

                }
                break;
            default :
                changeUserstate(state, selectdata[item]);
            break;
        }

    }

}


function changeUserstate(state, user){
    switch (state){
        case 'y':
            var startTime = $('#starttime').val();

            if(startTime!='' ||startTime!=null){
                startTime = new Date(startTime).getTime();
            }else{
                startTime = new Date().getTime();
            }

            var endTime = $('#endtime').val();

            var duration = 0;
            if(endTime!='' ||endTime!=null){
                duration = new Date(endTime).getTime() - startTime;
            }else{
                duration = 380 * 24 * 60 * 60*1000;
            }
            user.regDate = startTime;
            user.isTempUser = 0;
            user.duration = duration/1000;
            user.state = 'y';
            user.birthday = new Date( parseInt(user.birthday.toString().length==10?user.birthday+'000':user.birthday)).Format('yyyy-MM-dd')



            break;
        case 'x':
            var startTime = $('#xiuxuestarttime').val();

            if(startTime!='' ||startTime!=null){
                startTime = new Date(startTime).getTime() -8*60*60*1000;
            }else{
                startTime = new Date().getTime()-8*60*60*1000;
            }

            var endTime = $('#xiuxueendtime').val();
            endTime = new Date(endTime).getTime()-8*60*60*1000;
            if(startTime > endTime){
                G.ui.tips.info('休学开始时间不能大于截止时间！');
                return;
            }

            if (startTime < user.regDate || endTime < user.regDate){
                G.ui.tips.info("[用户id:"+selectdata[item].username+"]休学时间不能位于学期开始前");
                return;
            }



            if((endTime-startTime) >180*24*60*60*1000 || (endTime-startTime) <30*24*60*60*1000){
                G.ui.tips.info("申请休学必须大于30天，小于180天");
                return;
            }

            user.approve =1;
            user.qStartDate = startTime/1000;
            user.qEndDate = endTime/1000;
            user.state = 'x';
            user.birthday = new Date( parseInt(user.birthday.toString().length==10?user.birthday+'000':user.birthday)).Format('yyyy-MM-dd')

            break;
        case 'q':
            user.state = 'q';
            break;
        case 'j':
            user.state = 'j';
            break;
        case 't':
            user.state = 't';
            break;
        case 'e':
            yanxuestarttime
            var startTime = $('#yanxuestarttime').val();

            if(startTime!='' ||startTime!=null){
                startTime = new Date(startTime).getTime()-8*60*60*1000;
            }else{
                G.ui.tips.info('请选择开始时间！');
                return;
            }

            var endTime = $('#yanxueendtime').val();
            if(endTime!='' ||endTime!=null){
                endTime = new Date(endTime).getTime()-8*60*60*1000;
            }else{
                G.ui.tips.info('请选择结束时间！');
                return;
            }
            if(endTime-startTime < 30*24*3600){
                G.ui.tips.info('延学时间不能短于一个月！');
                return;
            }

            if (startTime < user.regDate || endTime < user.regDate){
                G.ui.tips.info("延学时间不能位于学期开始前");
                return;
            }
            if (startTime < user.regDate+user.duration || endTime < user.regDate+user.duration ){
                G.ui.tips.info("延学时间不能位于学期之间");
                return;
            }
            user.qStartDate = startTime/1000;
            user.qEndDate = endTime/1000;
            user.state = 'e';
            break;
        case "h":

            var endTime = $('#jiesuendtime').val();
            if(endTime!='' ||endTime!=null){
                endTime = new Date(endTime).getTime()-8*60*60*1000;
            }else{
                G.ui.tips.info('请选择结束时间！');
                return;
            }
            user.qEndDate = endTime/1000;
            user.qStartDate = endTime/1000;
            user.state = 'h';
            break;
    }

    changeUserState(user);
}

function caculateStudentState(user){
    var currentTime = new Date().getTime();
    if(user.state =='q'){

    }
}

function changeUserState(user){
    //Application.user.
    var para ='parameter='+JSON.stringify(user);
    Application.Util.ajaxConstruct(Application.serverHost + "/user/changusersate",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#studentstatemodal').modal('toggle');
            initStudentMangeList()
            G.ui.tips.suc('修改成功！')
        }else{

            G.ui.tips.err('修改失败！'+data.data);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

/***
 * 删除学员
 */
function deletestudent(id){

    var selects = $(id).bootstrapTable('getSelections');
    if(selects.length==0){
        G.ui.tips.info('请至少选择一个要删除的用户！');
        return;
    }
    for(var i= 0,len=selects.length;i<len;i++){

        var data = 'parameter='+JSON.stringify({id:selects[i].id});
        Application.Util.ajaxConstruct(Application.serverHost + '/student/deleteBatchSignUp','POST',data,'json',function(data){
                if(data.errcode == 0){
                    initBatchRegisterUser();
                    initStudentMangeList();
                    G.ui.tips.suc('删除成功！')

                }else {
                    G.ui.tips.err('删除失败！')
                }
            },function(){
                G.ui.tips.suc('删除失败！')
            },'application/x-www-form-urlencoded'
        )
    }
}

function searchuser(){
    var obj = {};
    obj.name = $('#batchusername').val();
    obj.state = $('#studentstate').select2('val');
    initBatchRegisterUser(obj);
}

function searchuserpoint(){
    var obj = {};
    obj.username = $('#username1').val();
    obj.name = $('#name1').val();
    obj.state = $('#state1').val();
    obj.provice = $('#province1').val();
    obj.unit = $('#unit1').val();
    obj.last_modify=$('#modifydate1').val()==""||$('#modifydate1').val()==null?-1:new Date($('#modifydate1').val()).getTime()/1000;



    $('#exportStundentExam input[name="s_state"]').val(obj.state);
    $('#exportStundentExam input[name="s_province"]').val(obj.province);
    $('#exportStundentExam input[name="s_username"]').val(obj.username);
    $('#exportStundentExam input[name="s_name"]').val(obj.name);

    $('#exportStundentExam input[name="s_unit"]').val(obj.unit);
    $('#exportStundentExam input[name="s_modify"]').val(obj.last_modify);


    initStudentResultsMangeList(obj);
}

function searchmanageuser(){
    var obj = {};
    obj.username = $('#managestudentname').val();
    obj.name = $('#managename').val();
    obj.unit = $('#manageunit').val();
    obj.last_modify = ($('#managedate').val()!=null&&$('#managedate').val()!="")?new Date($('#managedate').val()).getTime()/1000:-1;
    obj.state = $('#managestudentstate').select2('val');
    obj.province = $('#manageallprovince').select2('val');
    obj.special = $('#manageallspecial').select2('val');
    $('input[name="s_state"]').val(obj.state);
    $('input[name="s_province"]').val(obj.province);
    $('input[name="s_username"]').val(obj.username);
    $('input[name="s_name"]').val(obj.name);
    $('input[name="s_mayor"]').val(obj.special);
    $('input[name="s_unit"]').val(obj.unit);
    //$('input[name="s_modify"]').val(obj.last_modify!=null?new Date(obj.last_modify).getTime()/1000:-1);


    initStudentMangeList(obj);
}


/*
 * 时间控件change事件
 *
 */
function onDatePickerChange(e, id) {
    if(e.date == undefined){
        return;
    }
    var timeStamp = e.date.getTime();
    switch (id) {

        case "birthday":

            break;
        case "adddate":
            //$("#adddate").datepicker("setStartDate", e.date);

            break;

    }
}

//格式化时间格式
function formmatDate(timeStamp) {
    var date = new Date(timeStamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var dateStr = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return year+"-"+month+"-"+dateStr;
}
$('#div_baseinfopanel').on('show.bs.modal', function (event) {
    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })
});



//关闭对话框
function closeModal() {
    $('#div_baseinfopanel').modal('toggle');
    $('#specialpanel').show();
    $('#rightgroup').attr('disabled',true);
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

    $("#gender").select2("val");

    $('#div_baseinfopanel  input').val('');

    //$('#div_baseinfopanel input[type=checkbox]').attr("checked",false);


}



/***
 * 保存用户
 */
function submitUserInfo(){

    var parameter = {};
    if($('#rightgroup').select2('val')==''){
        G.ui.tips.info('请选择权限组！')
        return;
    }
    parameter.role = $('#rightgroup').select2('val');
    if(parameter.role ==13){
        parameter.userType = 2;
    }else{
        parameter.userType = 1;
    }
    if($("#username").val()!=""&&$("#username").val().length<6){
        G.ui.tips.info('用户名必须是大于六位的字符！')
        return;
    }
    parameter.username = $("#username").val();
    if($("#password").val()!=""&&$("#password").val().length<6){
        G.ui.tips.info('密码必须是大于六位的字符！')
        return;
    }
    parameter.password = $("#password").val().length>5?$("#password").val():parameter.password;
    parameter.passwordQuestion = $("#passwordquestion").val();
    parameter.passwordAnswer = $("#passwordanswer").val();
    parameter.name = $("#realname").val();
    parameter.phone = $("#phone").val();
    parameter.cellphone = $("#cellphone").val();
    parameter.email = $("#email").val();
    parameter.zjhm = $('#idnumber').val();
    parameter.birthday = $("#birthday").val();
    parameter.province = $("#pravince").val();
    parameter.unit =  $("#unitnum").val();
    parameter.addr = $("#address").val();
    parameter.postcode = $("#postnum").val();
    parameter.remark = $("#remark").val();
    parameter.addtime = $("#adddate").val();
    parameter.gid = $("#rightgroup").select2("val");
    parameter.regDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
    parameter.gender = $("#gender").select2("val");
    parameter.uid = Application.adminuser.id;
    parameter.state = 'y';
    var special=[]
    $('#specialpanel .specialchk').each(function(index, item){
        if($(this).is(':checked')){
            special.push($(this).attr('data-id'));
        }

    })


    parameter.signSpecial = special.join(',');
    if($("#userboollive").prop("checked")==true){
        parameter.live = 'y'
    }else{
        parameter.live = 'n';
    }
    if(Application.isAdd == true){



        saveUser('parameter='+JSON.stringify(parameter));
    }else{


        //Application.user.username = $("#username").val();
        //if($("#password").val()!=""&&$("#password").val().length<6){
        //    G.ui.tips.info('密码必须是大于六位的字符！')
        //    return;
        //}
        //if($('#rightgroup').select2('val')==''){
        //    G.ui.tips.info('请选择权限组！')
        //    return;
        //}
        //Application.user.password = $("#password").val();
        //if($("#userboollive").prop("checked")==true){
        //    Application.user.live = 'y'
        //}else{
        //    Application.user.live = 'n';
        //}
        //if(Application.user.role ==13){
        //    Application.user.userType = 2;
        //}else{
        //    Application.user.userType = 1;
        //}
        //Application.user.gid = $("#rightgroup").select2("val");
        //Application.user.name = $("#realname").val();
        //Application.user.phone = $("#phone").val();
        //Application.user.cellphone = $("#cellphone").val();
        //Application.user.email = $("#email").val();
        //Application.user.zjhm = $('#idnumber').val();
        //Application.user.birthday = $("#birthday").val();
        //Application.user.province = $("#pravince").val();
        //Application.user.unit =  $("#unitnum").val();
        //Application.user.addr = $("#address").val();
        //Application.user.postcode = $("#postnum").val();
        //Application.user.remark = $("#remark").val();
        //Application.user.state = 'y';
        //Application.user.gender = $("#gender").select2("val");
        //Application.user.gid = $("#rightgroup").select2("val");
        //var para ='parameter='+JSON.stringify(Application.user);

        updateUser('parameter='+JSON.stringify(parameter));
    }
    $('#div_baseinfopanel  input').val('');
    //$('#div_baseinfopanel input[type=checkbox]').attr("checked",false);
}

/***
 *  保存用户
 * @param data
 */

function saveUser(data){
    Application.Util.ajaxConstruct(Application.serverHost + '/manage/createUser','POST',data,'json',function(data){
            if(data.errcode == 0){
                Application.isAdd =false;
                getALlRolesList();
                getAdminRoleList();
                initStudentMangeList();
                initBatchRegisterUser();
                G.ui.tips.suc('保存成功！')
                $('#div_baseinfopanel').modal('toggle');
            }else {
                G.ui.tips.err('保存失败！'+data.errmsg);
            }
        },function(){
            G.ui.tips.err('保存失败！')
        },'application/x-www-form-urlencoded'
    )
}

function updateUser(para){
    Application.Util.ajaxConstruct(Application.serverHost + "/authenticate/changepassword",'POST',para,'json',function(data){
        if(data.errcode == 0){
            getALlRolesList();
            getAdminRoleList();
            initStudentMangeList();
            initBatchRegisterUser();
            $('#div_baseinfopanel').modal('toggle');
            G.ui.tips.suc('修改成功！')
        }else{
            G.ui.tips.err('修改失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function clickDeleteUser(){
    var selectdata = $('#manageuserlist').bootstrapTable('getSelections');

    for(var i in selectdata){

        var para = 'parameter='+JSON.stringify({userid:selectdata[i].id});
        deleteUser(para);
    }

}

/***
 * 删除用户
 */
function deleteUser(data){


    Application.Util.ajaxConstruct(Application.serverHost + '/manage/deleteUser','POST',data,'json',function(data){
            if(data.errcode == 0){
                getALlRolesList();
                getAdminRoleList();
                G.ui.tips.suc('删除成功！')

            }else {
                G.ui.tips.info('删除失败！')
            }
        },function(){
            G.ui.tips.info('删除失败！')
        },'application/x-www-form-urlencoded'
    )
}

//删除用户组

function deleteUserGroup(id){
    Application.Util.ajaxConstruct(Application.serverHost + '/deleterole/'+id,'POST',{},'json',function(data){
            if(data.errcode == 0){
                getUserGrouplist()
                G.ui.tips.suc('删除成功！')

            }else {
                G.ui.tips.err('删除失败！')
            }
        },function(){
            G.ui.tips.err('删除失败！')
        }
    )
}

/***
 *
 */
function getManageuserList(){
    $('#manageuserlist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

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
              field:'state',
                align:'center',

                checkbox:true

            },
            {
                field: 'live',
                title: '激活',
                align: 'center',
                formatter: function (value, row) {
                    return value == 'n'?'否':'是';
                }

            },

            {
                field: 'username',
                align: 'center',
                title: '用户名',
                formatter: function (value, row) {

                    return '<a href="#" onclick="initPersonInfo('+row.id+')">' + value + '</a>'

                }
            },
            {
                field: 'gid',
                title: '权限组',
                align: 'center',
                formatter: function (value, row) {
                    for(var item in Application.rightgroup){
                        if(value == Application.rightgroup[item].id){
                            return Application.rightgroup[item].text;
                        }
                    }
                }

            },
            {
                field: 'province',
                title: '省份',
                align: 'center'

            },
            {
                field: 'cellphone',
                title: '手机',
                align: 'center'

            },
            {
                field: 'remark',
                title: '备注',
                align: 'center'
            },
            {
                field: 'creator',
                title: '添加人',
                align: 'center'

            }
            ,
            {
                field: 'regDate',
                title: '注册日期',
                align: 'center',

                formatter:function(value, row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            }

        ]
    });
}


/***
 * 初始化管理权限列表
 */
function initManageRoleList() {
    $('#managerolelist').bootstrapTable({
        classes: "table table-hover table-condensed",
        striped: true,
        toolbar: '#rawdata-toolbar',
        pagination: true,
        clickToSelect:true,
        showColumns: true,
        showRefresh: false,
        showToggle: true,
        singleSelect:true,
        columns: [{
            field: 'num',
            align: 'center',
            title: '编号'

        },
            {
                field: 'state',
                align: 'center',

                checkbox: true

            },
            {
                field: 'name',
                title: '名称',
                align: 'center',

                formatter: function (value, row) {
                    return '<a href="#menutreediv"  data-toggle="tab">' + value + '</a>'
                }

            },

            {
                field: 'priv',
                align: 'center',
                title: '权限',
                formatter: function (value, row) {
                    var html =''
                    for(var i in value.split(',')){
                        for(var j in Application.treeData.children){
                            for(var k in  Application.treeData.children[j].children){
                                if(Application.treeData.children[j].children[k].root_id ==value.split(',')[i] ){
                                    html+='<p>'+Application.treeData.children[j].title+'->'+Application.treeData.children[j].children[k].title+'</p>'
                                }
                            }
                        }
                    }

                    return html;
                }

            }]
    }).on('click-row.bs.table', function (e, row, $element) {
            $('#rolename').val(row.name);

        Application.rowRole = row;
        $('#managegroupaddbutton').attr('operate','update');

            for(var i = 0; i<row.priv.split(',').length; i++){

                $('.treecheckbox').each(function(index, item){
                    if(item.data !='undefined'){
                        if($(this).attr('data') !='undefined'&&$(this).attr('data')==row.priv.split(',')[i]){
                            $(this).attr('checked','true');
                        }

                    }
                })



            }

        });

}


var specialrole = [
    {
        "id": 0,
        'specialname':'管理员3333',


        "num":0

    },
    {
        "id": 0,
        'specialname':'管理员3333',

        "num":0
    },
    {
        "id": 0,
        'specialname':'管理33员',


        "num":0
    },
    {
        "id": 0,
        'specialname':'管333理员',


        "num":0
    }

]

/***
 * 查询专业列表
 */
function getSpecialList(selectid){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getProfessionalManagementList",'POST',{},'json',function(data){
        if(data.errcode == 0){

            $('#managespeciallist').bootstrapTable('load',data);

            var specials = []
            for(var i in data.data){
                if(data.data[i].valid !=0 ){
                    specials.push(data.data[i]);
                }
            }

            Application.specialList = specials;

            //初始化下拉列表
            var arr = []
            arr.push({id:"", text:'全部',ord:''})
            for(var i in Application.specialList){
                arr.push({id:Application.specialList[i].id, text:Application.specialList[i].title,ord:Application.specialList[i].ord})
            }

            $("#specialmoduleselect").select2({
                data: function () {
                    return { results: arr};
                },placeholder:'-------------全部专业------------'
            }).select2("val",10).on("change", function (e) {
                var moduledata = $('#managemodulelist').bootstrapTable('getData');
                 for(var i in moduledata){
                    if(moduledata[i].paths.indexOf(e.val) !=-1){
                        moduledata[i].status = 1;
                    }else{
                        moduledata[i].status = 0;
                    }
                }
               $('#managemodulelist').bootstrapTable('load',moduledata);

            });

            $("#special").select2({
                data: function () {
                    return { results: arr};
                }
            });

            $('.allspecial').select2({
                data: function () {
                    return { results: arr};
                },
                placeholder:'--全部专业--'
            })
            $("#allspecialforquestion").select2(
                {
                    data: function () {
                        return { results: arr};
                    },
                    placeholder:'--全部专业--'
                }
            ).on('change',function(e){

                    var arr=[]
                    var arr1=[]
                    arr.push({id:'',text:"全部"})
                    for(var item in Application.courseData){
                        if(Application.courseData[item].path == '0-'+ e.val){
                            arr.push({id:Application.courseData[item].id,text:Application.courseData[item].title});
                            arr1.push({id:Application.courseData[item].id,text:Application.courseData[item].no+' '+Application.courseData[item].title});
                        }
                    }
                    $('#chapterforquestionListTab').select2(
                        {
                            data: function () {
                                return { results:arr};
                            },
                            placeholder:'所属课程'
                        }
                    ).on('change',function(e){
                            initQuestionsList(e.val);
                        });

                    $('#editorlesson').select2(
                        {
                            data: function () {
                                return { results:arr1};
                            },
                            placeholder:'所属课程'
                        }
                    )

            })
            $('#modifyspecial').select2({
                data: function () {
                    return { results: arr};
                },
                placeholder:'--全部专业--'
            }).on('change',function(e){
                getWorkAndExamTable('0-'+e.val);
            });

            $("#authenticategroup").select2({
                data: function () {
                    return { results: arr};
                }
            }).on("change", function (e) {

            });
            $('#lessonListTab').empty();

            //var selectdata = [];

            if(data.errcode == 0){
                $('#lessonListTab').append('<a href="#rawDataTab" class="btn btn-success" onclick="getLessonListByid(-1)" data-toggle="tab">全部课程</a>');
                for(var item in specials){

                    $('#lessonListTab').append('<a href="#" class="btn btn-default" lessonid = "'+specials[item].id +'" data-toggle="tab" title = "'+specials[item].title +'" onclick ="getLessonListByid('+specials[item].id+')" >'+specials[item].title+'</a>')
                }

                //Application.rightgroup = selectdata;
            }else{
                console.log('查询失败！！')
            };
            //专业列表
            var chkhtml = '';
            for(var item in specials){
                chkhtml+='<input class="specialchk" data-id="'+specials[item].id+'" type="checkbox"/><a>'+specials[item].title+'</a>&nbsp;&nbsp;'
            }
            $('#specialpanel').empty();
            $('#specialpanel').append(chkhtml);
            $('#signspecialpanel').empty();
            $('#signspecialpanel').append(chkhtml);

            //初始化工具
            initTabs('lessonListTab');
            initTabs('selectlessontab');


        }else{
            console.log(data.errmsg);
        }

    },function(data){
        console.log('查询失败！！')
    })
}

function getWorkAndExamTable(path){

    var para ='parameter='+ JSON.stringify({userId:Application.user.id,path:path});
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getWorkAndExamList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            var arr = [];
            for(var i = 0,len = data.data.length;i<len;i++){
                arr.push({id:data.data[i].id,text:data.data[i].title})
            }

           $('#modifycourse').select2({
               data: function () {
                   return { results: arr};
               },
               placeholder:'--全部课程--'
           }).on('change',function(e){
               var cate =2
               if(Application.addtype == 'chapter'){
                   cate =2
               }else{
                   cate = 4
               }
               Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassChapterList",'POST',"parameter="+JSON.stringify({iid: e.val,cate:cate}),'json',function(data){
                   if(data.errcode == 0){
                       var arr1 = [];
                       for(var j = 0,len = data.data.length;j<len;j++){
                           arr1.push({id:data.data[j].id,text:data.data[j].title})
                       }

                       $('#modifychapter').select2({
                           data: function () {
                               return { results: arr1};
                           },
                           placeholder:'--请选择章节--'
                       })
                   }else{
                       G.ui.tips.err(data.errmsg);
                   }

               },function(data){
                   G.ui.tips.err('查询失败！！')
               },'application/x-www-form-urlencoded');
           });
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function getNewsList(flag){
    if(!Application.specialList){
        getSpecialList();
    }

    var pid = {};
    if(flag ==1){
        pid.state = 'n';
    }else if(flag ==2){
        pid.state = 'z';
    }
    //初始化资讯管理
    $('#manageinfolist').bootstrapTable('destroy');
    $('#manageinfolist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes: "table table-hover table-condensed",
        striped: true,
        toolbar: '#rawdata-toolbar',

        showColumns: true,
        showRefresh: false,
        showToggle: true,
        pagination: true,
        sidePagination: "server",
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache: false,
        pageNumber: 1,
        method: 'POST',
        url: Application.serverHost + "/news/getNewsList",
        ajaxOptions: {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': $.cookie("Token")
            },
            dataType: 'json'
        },

        queryParams: function (params) {
            var data = null
            if (typeof pid === 'object') {
                pid['index'] = (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter=' + JSON.stringify(pid);
            } else {
                data = 'parameter=' + JSON.stringify({
                    'pageno': (params.offset / params.limit) + 1,
                    'pageSize': params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if (data.errcode == 0) {
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    tableData.rows.push(
                        {
                            id :data.data[i].id,
                            num: i + 1,
                            kword:data.data[i].kword,
                            title: data.data[i].title,
                            username: data.data[i].username,
                            state: data.data[i].state,
                            add_date: data.data[i].add_date,
                            path:data.data[i].path,
                            picture:data.data[i].picture,
                            hits:data.data[i].hits,
                            _from:data.data[i]._from,
                            text:data.data[i].text,

                        })
                }
                return tableData;
            } else {
                G.ui.tips.info('查询数据出错！' + data.errmsg);
                return;
            }

        },
        columns: [{
            field: 'num',
            align: 'center',
            title: '编号'

        },
            {
                field: 'status',
                align: 'center',

                checkbox: true

            },
            {
                field: 'title',
                title: '标题',
                align: 'center',

                formatter: function (value, row) {
                    return '<a href="#infopanel"  data-toggle="tab">' + value + '</a>'
                }

            },

            {
                field: 'username',
                align: 'center',
                title: '添加用户'

            },

            {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value, row){
                    if(value =='n'){
                        return '发布';
                    }else if(value =='z'){
                        return '不发布';
                    }
                }
            },

            {
                field: 'add_date',
                align: 'center',
                title: '添加时间',
                formatter:function(value, roe){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            }]
    }).on('click-row.bs.table', function (e, row, $element) {
        $('#newstitle').attr('data',JSON.stringify(row));
        Application.isupdatenews =true
        $('#newsstate').select2('val',row.state);
        $('#newsspecial').select2('val',row.path.split('-')[1]);

        $('#newstitle').val(row.title);
        $('#keyword').val(row.kword);
        $('#newsource').val(row._from);
        $('#newsadddate').val(new Date( parseInt(row.add_date.toString().length==10?row.add_date+'000':row.add_date)).Format('yyyy-MM-dd'))
        $('.summernote').summernote('code', row.text);
    });


}

function deleteNews(){
    var datas = $('#manageinfolist').bootstrapTable('getSelections');
    if(datas.length == 0){
        G.ui.tips.info('请至少选择一条要删除的记录！');
        return;
    }
    for(var i = 0,len = datas.length;i<len;i++){
        var para = 'parameter='+JSON.stringify({id:datas[i].id});
        Application.Util.ajaxConstruct(Application.serverHost + "/news/deleteNews",'POST',para,'json',function(data){
            if(data.errcode == 0){
                G.ui.tips.info('删除成功！')
                getNewsList();
            }else{
                G.ui.tips.info('删除失败！')
            }

        },function(){},'application/x-www-form-urlencoded');
    }


}

/***
 * 利用课程编号进行课程过滤
 */
function getLessonListByid(id){
    if(id ==-1){
        $('#managecourselist').bootstrapTable('getData');
        $('#managecourselist').bootstrapTable('load',Application.lessonData);
    }else if(id ==1){
        var data = []
        for(var index in Application.lessonData){
            if('n' == Application.lessonData[index].state && ($('#lessonListTab >.btn-success').attr('lessonid')?$('#lessonListTab >.btn-success').attr('lessonid') ==Application.lessonData[index].pid:true)){
                data.push(Application.lessonData[index]);
            }
        }

        $('#managecourselist').bootstrapTable('load',data);
    }else if(id ==2){
        var data = []
        for(var index in Application.lessonData){
            if('z' == Application.lessonData[index].state&& ($('#lessonListTab >.btn-success').attr('lessonid')?$('#lessonListTab >.btn-success').attr('lessonid') ==Application.lessonData[index].pid:true)){
                data.push(Application.lessonData[index]);
            }
        }

        $('#managecourselist').bootstrapTable('load',data);
    }
    else {
        var data = []
        var sindex = $('#selectlessontab a').index($('#selectlessontab >.btn-success'))
        if(sindex ==0){
            for(var index in Application.lessonData){
                if(id == Application.lessonData[index].pid){
                    data.push(Application.lessonData[index]);
                }
            }
        }else if(sindex ==1){
            for(var index in Application.lessonData){
                if(id == Application.lessonData[index].pid && Application.lessonData[index].state=='n'){
                    data.push(Application.lessonData[index]);
                }
            }
        }else if(sindex ==2) {
            for(var index in Application.lessonData){
                if(id == Application.lessonData[index].pid && Application.lessonData[index].state=='z'){
                    data.push(Application.lessonData[index]);
                }
            }
        }


        $('#managecourselist').bootstrapTable('load',data);
    }
}
/***
 * 新增课程
 */
function addLesson(){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/insertClassManagement",'POST',{},'json',function(data){
        if(data.errcode == 0){

        }
    });
}
function deleteLesson(para){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/deleteClassManagement",'POST',para,'json',function(data){
        if(data.errcode == 0){
            G.ui.tips.info('删除成功！')
            getManageCourse();
        }else{
            G.ui.tips.info('删除失败！')
        }

    },function(){},'application/x-www-form-urlencoded');
}
/***
 * 新增章节
 */
function addchapter(){


    var title = $('#coursetitle').val();
    var des = $('#coursedescription').val();
    var num =$('#coursenum').val();
    var special = $("#special").select2("val");
    var path = '';
    var uid = '';
    for(var i in Application.specialList){
        if(Application.specialList[i].id == special){

            path = '0-'+Application.specialList[i].id;
            uid = Application.specialList[i].ord;
        }
    }
    var duration = $('#courseduration').val();
    if(duration ==null || duration ==""){
        G.ui.tips.err('请填写学时！！');
        return;
    }
    var point = $('#coursepoint').val();
    if(point ==null || point ==""){
        G.ui.tips.err('请填写分数！！');
        return;
    }
    var limit = $('#timelimit').val();
    if(limit ==null || limit ==""){
        G.ui.tips.err('请填写时间限制！！');
        return;
    }
    var spent = $('#coursespend').val();
    if(spent ==null || spent ==""){
        G.ui.tips.err('请填写学费！！');
        return;
    }
    var status = $("#courseeditorstatus").is(':checked')?'n':'z'


    if(Application.updateChapter==false){
        var para = 'parameter='+JSON.stringify({uid:1,state:'n',no:num,path:path,title:title,xueshi:parseInt(duration),xuefen:parseFloat(point),date_limit:limit,cost:parseFloat(spent),text:''});
        Application.Util.ajaxConstruct(Application.serverHost + "/content/insertClassManagement",'POST',para,'json',function(data){
            if(data.errcode == 0){
                getManageCourse();
                G.ui.tips.suc('保存成功！')
                $('#restoremanagecourseeditor').tab('show');
            }
            else{
                G.ui.tips.err('保存失败！')
            }
        },function(data){
            console.log('查询失败！！')
        },'application/x-www-form-urlencoded');
    }else if(Application.updateChapter==true){
        var para = 'parameter='+JSON.stringify({id:Application.chapterid,uid:1,state:status,no:num,path:path,title:title,xueshi:parseInt(duration),xuefen:parseFloat(point),date_limit:limit,cost:parseFloat(spent),text: $('#coursedescription').val()});
        Application.Util.ajaxConstruct(Application.serverHost + "/content/updateClassManagement",'POST',para,'json',function(data){
            if(data.errcode == 0){
                getManageCourse();
                G.ui.tips.suc('保存成功！')
                $('#restoremanagecourseeditor').tab('show');
            }
            else{
                G.ui.tips.err('保存失败！')
            }
        },function(data){
            console.log('查询失败！！')
        },'application/x-www-form-urlencoded');
    }

}

/***
 * 查询模块列表
 */
function getModuleList(id){


    if(!Application.specialList){
        getSpecialList(id?id:null);
    }

    Application.Util.ajaxConstruct(Application.serverHost + "/content/getmodulelist",'POST',{},'json',function(data){
        if(data.errcode == 0){
            $('#managemodulelist').bootstrapTable('load',data);

            //if(id){
                var moduledata = $('#managemodulelist').bootstrapTable('getData');
                for(var i in moduledata){
                    if(moduledata[i].paths.indexOf($("#specialmoduleselect").select2('val')) !=-1){
                        moduledata[i].status = 1;
                    }else{
                        moduledata[i].status = 0;
                    }
                }

                $('#managemodulelist').bootstrapTable('load', moduledata);
            //}

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
function getManageCourse(){
    if(!Application.specialname){
        getSpecialList();
    }

        Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassManagementList",'POST',{},'json',function(data){
            if(data.errcode == 0){
                var lessons = [];
                lessons.push({id:'',text:'全部'});
                for(var item in data.data){
                    data.data[item]['num'] = parseInt(item)+1;
                    lessons.push({id:data.data[item].id,text:data.data[item].title+data.data[item].no})
                }
                $('#examlesson').select2({
                    data:function(){
                        return { results: lessons };
                    },
                    placeholder:'--课程--'
                }).on('change',function(e){

                    var para = 'parameter='+JSON.stringify({iid: e.val,cate:2});
                    getChapterContent(para)
                })

                $('#managecourselist').bootstrapTable('load',data.data);

                Application.lessonData = data.data;

            }else{
                G.ui.tips.err('查询失败！！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！');
        })


}
function changeSpecialState(){
    $('#newspecialname').attr('operate','');
    $('#newspecialname').val('');
    $('#nameboolvalid').attr('checked',false);
}
/***
 * 新增专业
 */
function addSpecial(){

    if($('#newspecialname').attr('operate')=='update'){
        updateSpecial();
    }else{
        if($('#newspecialname').val() == null || $('#newspecialname').val() ==''){
            G.ui.tips.info("请输入专业名称！！");
            return;
        }

        var data =  {'parameter':JSON.stringify({
            path:0,
            deep:1,
            module:'manage/course',
            title:$('#newspecialname').val(),
            valid:$("#nameboolvalid").is(':checked')?1:0
        })};

        Application.Util.ajaxConstruct(Application.serverHost + "/content/insertProfessionalManagement",'POST',data,'json',function(data){
            if(data.errcode == 0){
                getSpecialList();
                $('#newspecialname').attr('operate','');
                $('.chapterset').tab('show');
                $('#restoremanagespecial').tab('show')
            }else{
                G.ui.tips.err(data.errmsg);
            }

        },function(data){
            console.log('查询失败！！')
        },'application/x-www-form-urlencoded')
    }



}

/***
 * 删除专业
 */
function deleteSpecial(){

    var rowdata = $('#managespeciallist').bootstrapTable('getSelections');

    for(var i in rowdata){
        var para ='parameter='+ JSON.stringify({pmid:rowdata[i].id});

        Application.Util.ajaxConstruct(Application.serverHost + "/content/deleteProfessionalManagement",'POST',para,'json',function(data){
            if(data.errcode == 0){
                getSpecialList();
                $('#restoremanagespecial').tab('show')
            }else{
                G.ui.tips.err(data.errmsg);
            }

        },function(data){
            console.log('查询失败！！')
        },'application/x-www-form-urlencoded')
    }
}

function updateSpecial(){
    if($('#newspecialname').val() == null || $('#newspecialname').val() ==''){
        G.ui.tips.info("请输入专业名称！！");
    }

    var data =  JSON.stringify({
        path:0,
        deep:1,
        module:'manage/course',
        title:$('#newspecialname').val(),
        valid:$("#nameboolvalid").is(':checked')?1:0,
        ord:$('#newspecialname').attr('ord'),
        id :parseInt($('#newspecialname').attr('sid'))
    });
    var para ='parameter='+ data;
        Application.Util.ajaxConstruct(Application.serverHost + "/content/updateProfessionalManagementById",'POST',para,'json',function(data){
            if(data.errcode == 0){
                getSpecialList();
                $('#restoremanagespecial').tab('show')
            }else{
                G.ui.tips.err(data.errmsg);
            }

        },function(data){
            G.ui.tips.err('查询失败！！')
        },'application/x-www-form-urlencoded')

}

/**
 * 重置专业编辑框
 */
function restSpecialEditor(){
    $('#newspecialname').val('');
    $("#nameboolvalid").attr("checked",false);
}

function initManageSpecialList(){
    $('#managespeciallist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 230,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        columns: [ {
            field: 'ord',
            align: 'center',
            title: '编号'

        },
            {
                field:'state',
                align:'center',

                checkbox:true

            },
            {
                field: 'title',
                title: '名称',
                align: 'center',
                formatter:function(value, row){
                    return '<a href="#managespecialeditor"  data-toggle="tab">' + value + '</a>'
                }
            },

            {
                field: 'status',
                align: 'center',
                title: '状态',

                formatter:function(value, row){
                    return row.valid==0?"无效":"有效";
                }

            },{
                field: 'id',
                align: 'center',
                title: 'ID'

            }]
    }).on('click-row.bs.table', function (e, row, $element) {


        $('#newspecialname').val(row.title);
        $('#newspecialname').attr('operate','update');
        $('#newspecialname').attr('ord',row.ord);
        $('#newspecialname').attr('sid',row.id);
        if(row.valid ==1){
            $('#nameboolvalid').attr('checked',true);
        }else if(row.valid == 0){
            $('#nameboolvalid').attr('checked',false);
        }


    });
}


function initManageInfoList(){



}

/****
 * 初始化课程列表
 */
function initCourseList(){
    $('#managecourselist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,

        columns: [ {
            field: 'num',
            align: 'center',
            title: '序号'

        },
            {
                field: 'no',
                align: 'center',
                title: '编号'

            }
            ,
            {
                field:'status',
                align:'center',

                checkbox:true

            },
            {
                field: 'pmTitle',
                title: '专业',
                align: 'center'

                //formatter:function(value, row){
                //    return '<a href="#menutreediv"  data-toggle="tab">'+value+'</a>'
                //}

            },

            {
                field: 'title',
                title: '课程标题',
                align: 'center',

                formatter:function(value, row){
                    return '<a href="#managecourseeditor"  data-toggle="tab">'+value+'</a>'
                }

            },
            {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value, row){
                    return value =='n'?'有效':'无效'
                }


            },{
                field: 'add_date',
                align: 'center',
                title: '添加时间',
                formatter:function(value, row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            },{
                field: 'operate',
                align: 'center',
                title: '章节设置',
                formatter:function(value, row){
                    return '<a class="btn-primary btn-sm chapterset" href="#managecoursechapter"  data-toggle="tab">章节设置</a>';
                }
            }]
    }).on('click-row.bs.table', function (e, row, $element) {


        if($element.context.cellIndex == 7){
            var para = '';
            para = 'parameter='+JSON.stringify({iid:row.id,cate:1});
            $('#chapterListTab').attr('iid',row.id);
            //$("#chaptertitle").attr('rid',row.id)
            getChapterContent(para);
        }else{
            $('#coursetitle').val(row.title);
            $('#coursedescription').val(row.text);
            $('#coursenum').val(row.no);
            $("#special").select2("val",row.pid);
            $('#courseduration').val(row.xueshi);
            $('#coursepoint').val(row.xuefen);
            $('#timelimit').val(row.date_limit);
            $('#coursespend').val(row.cost);

            $('#addcoursedate').val(new Date(parseInt(row.add_date.toString().length==10?row.add_date+'000':row.add_date)).Format('yyyy-MM-dd'));
            if(row.state =='n'){
                $('#courseeditorstatus').prop('checked','checked');
            }else if(row.state == 'z'){
                $('#courseeditorstatus').attr('checked',false);
            }
            Application.chapterid = row.id;
            Application.updateChapter = true;
        }


    });
}

function copyLesson(id){
    if(!$('#allspecialforquestion').select2('val')){
        G.ui.tips.err('请选择所属专业!');
        $('#restorequestionsetting').tab('show');
        return;
    }
    if($('#chapterforquestionListTab').select2('val') == ''){
        G.ui.tips.err('请选择所属课程!');
        $('#restorequestionsetting').tab('show');
        return;
    }
    $('#editorquestiontype').select2('val','');
    $('#editorchapterboollive').select2('val','');
    $('#editorlesson').select2('val',$('#chapterforquestionListTab').select2('val'));
    $('#editorchapter').select2('val','');
    $('#editorinputtitle').val('');
    $('#answerA').val('');
    $('#answerB').val('');
    $('#answerC').val('');
    $('#answerD').val('');
    $('#editorremarker').val('');
    $('.options').each(function(index, value){
        if($(this).is(':checked')){
            $(this).attr('checked',false);
        }
    });
    $('#addquestiondate').val('');

    initQuestionsList($("#chapterforquestionListTab").select2('val'));
    switch (id){
        case 1:
            Application.questionoperate = 'add';
            break;
        case 2:
            Application.questionoperate = 'copy';
            break;
        case 3:
            Application.questionoperate = 'update';
            break

    }
}

/***
 *
 * 条件搜索问题
 */
function searchquestion(){

    var obj ={}
    var title =$('#chapterinputtitle').val();
    if(title!=''){
        obj.title =title;
    }
    var chapter = $('#chapter').select2('val');
    if(chapter!=null && chapter!=''){
        obj.cpath = chapter;
    }
    var chapterboollive = $('#chapterboollive').select2('val');
    if(chapterboollive!=null && chapterboollive!=''){
        obj.cate = chapterboollive;
    }
    var questiontype = $('#questiontype').select2('val');
    if(questiontype!=null && questiontype!=''){
        obj.type = questiontype;
    }
    var para = 'parameter='+JSON.stringify(obj);

    //obj.cid = $('#chapterforquestionListTab .btn-success').attr('data-id');
    var cid = $('#chapterforquestionListTab').select2('val');
    if(cid !=null && cid != ''){
        obj.cid = cid;
    }
    initQuestionsList(obj);

    //Application.Util.ajaxConstruct(Application.serverHost + "/content/getQuestionsManagementList",'POST',para,'json',function(data){
    //    if(data.errcode == 0){
    //
    //        $('#managequestionslist').bootstrapTable('load',data.data)
    //    }else{
    //        G.ui.tips.err('搜索失败！！');
    //    }
    //
    //},function(data){
    //    G.ui.tips.err('搜索失败！！');
    //},'application/x-www-form-urlencoded')
}

/***
 * 新建问题
 */
function addquestion(){

    var uid= 1
    var type = $('#editorquestiontype').select2('val');
    var cate = $('#editorchapterboollive').select2('val');
    var cid = $('#editorlesson').select2('val');
    var ccid = 0;
    var title = $('#editorinputtitle').val()?$('#editorinputtitle').val():'';
    var op1 = $('#answerA').val()?$('#answerA').val():'';
    var op2 = $('#answerB').val()?$('#answerB').val():'';
    var op3 = $('#answerC').val()?$('#answerC').val():'';
    var op4 = $('#answerD').val()?$('#answerD').val():'';

    var answerarr = [];
    $('.options').each(function(index, value){
        if($(this).is(':checked')){
            switch (index){
                case 0:
                    answerarr.push('A');
                    break;
                case 1:
                    answerarr.push('B');
                    break;
                case 2:
                    answerarr.push('C');
                    break;
                case 3:
                    answerarr.push('D');
                    break
            }

        }
    });
    var answer = answerarr.join(',');
    var add_date = $('#editorremarker').val();
    var score = 0.0;
    var remark = $('#editorremarker').val();
    var cpath = $('#editorchapter').val();
    var zl =1;
    var anli_id = 0;
    var para = 'parameter='+JSON.stringify({id:parseInt($('#restorequestionsetting').attr('rowid')),uid:uid,type:type,cate:cate,cid:cid,ccid:ccid,
            title:title,op1:op1,op2:op2,op3:op3,op4:op4,answer:answer,add_date:add_date,
            score:score,remark:remark,cpath:cpath,zl:zl,anli_id:anli_id});

    switch ( Application.questionoperate){
        case 'copy':
         case 'add':
            Application.Util.ajaxConstruct(Application.serverHost + "/content/insertQuestionsManagement",'POST',para,'json',function(data){
                if(data.errcode == 0){
                    G.ui.tips.suc('保存成功')
                    var id = $('#chapterforquestionListTab .btn-success').attr('data-id')
                    initQuestionsList(id);

                    $('#editorquestiontype').select2('val','');
                    $('#editorchapterboollive').select2('val','');
                    $('#editorlesson').select2('val','');
                    $('#editorchapter').select2('val','');
                    $('#editorinputtitle').val('');
                    $('#answerA').val('');
                    $('#answerB').val('');
                    $('#answerC').val('');
                    $('#answerD').val('');
                    $('#editorremarker').val('');
                    $('.options').each(function(index, value){
                        if($(this).is(':checked')){
                            $(this).attr('checked',false);
                        }
                    });
                    $('#restorequestionsetting').tab('show');

                }

            },function(data){
                G.ui.tips.err('保存失败！！')
            },'application/x-www-form-urlencoded');

            break;
        case 'update':


            Application.Util.ajaxConstruct(Application.serverHost + "/content/updateQuestionsManagement",'POST',para,'json',function(data){
                if(data.errcode == 0){
                    G.ui.tips.suc('保存成功')
                    var id = $('#chapterforquestionListTab .btn-success').attr('data-id')
                    initQuestionsList(id);
                    $('#restorequestionsetting').tab('show');

                }

            },function(data){
                G.ui.tips.err('保存失败！！')
            },'application/x-www-form-urlencoded');

            break
    }
}

function showcoursexamwork(boolid){
    if(boolid ==1){
        Application.ischapter = true;
    }else if(boolid==2){
        Application.isupdatechapter = 2;
        Application.ischapter = false;
    }

    else if(boolid==4){
        Application.isupdatechapter = 4;
        Application.ischapter = false;
    }

}
//新增教学材料
//(cate,iid,path,ord,deep,title,ppt_url,video_url,video_url1,text,exam_set,duration)
function addNewCourse(){

    if(Application.isUpdatecoursechapterlist){
        var par ='parameter='+JSON.stringify({id:parseInt($("#chaptertitle").attr('rid')),cate:1,iid:parseInt($('#chapterListTab').attr('iid')),path:0,deep:1,ord:parseInt($('#chaptertitle').attr('ord')),deep:1,title:$('#chaptertitle').val(),ppt_url:$('#pptaddress').val(),video_url:$('#vedioaddress').val(),text:$('#contentdes').val(),exam_set:"2,,|3,,",duration:60})
        updateNewCourse(par,1);
    }else{
        var par ='parameter='+JSON.stringify({cate:1,iid:parseInt($('#chapterListTab').attr('iid')),path:0,deep:1,ord:$('#coursechapterlist').bootstrapTable('getData').length,deep:1,title:$('#chaptertitle').val(),ppt_url:$('#pptaddress').val(),video_url:$('#vedioaddress').val(),text:$('#contentdes').val(),exam_set:"2,,|3,,",duration:60})
        intsertNewCourse(par,1);
    }

}

//新增章节作业
function addNewChapterwork(){
    if(Application.isupdatechapter == 1){
        var exam_set = '2,'+$('#singlequestion').val()+','+$('#singletotalpoints').val()+'|3,'+$('#multiquestion').val()+','+$('#multitotalpoints').val();
        var par ='parameter='+JSON.stringify({id:parseInt($("#chaptertitle").attr('rid')),iid:parseInt($('#chapterListTab').attr('iid')),cate:2,path:0,deep:1,ord:$('#courseworklist').bootstrapTable('getData').length,deep:1,title:$('#chapterworktitle').val(),exam_set:exam_set,duration:parseInt($('#chapterworkduration').val())})
        updateNewCourse(par,2);
    }else if(Application.isupdatechapter == 2){
        var exam_set = '2,'+$('#singlequestion').val()+','+$('#singletotalpoints').val()+'|3,'+$('#multiquestion').val()+','+$('#multitotalpoints').val();
        var par ='parameter='+JSON.stringify({iid:parseInt($('#chapterListTab').attr('iid')),cate:2,path:0,deep:1,ord:$('#courseworklist').bootstrapTable('getData').length,deep:1,title:$('#chapterworktitle').val(),exam_set:exam_set,duration:parseInt($('#chapterworkduration').val())})
        intsertNewCourse(par,2);
    }else if(Application.isupdatechapter == 3){
        var exam_set = '2,'+$('#singlequestion').val()+','+$('#singletotalpoints').val()+'|3,'+$('#multiquestion').val()+','+$('#multitotalpoints').val();
        var par ='parameter='+JSON.stringify({id:parseInt($("#chaptertitle").attr('rid')),iid:parseInt($('#chapterListTab').attr('iid')),cate:4,path:0,deep:1,ord:$('#courseworklist').bootstrapTable('getData').length,deep:1,title:$('#chapterworktitle').val(),exam_set:exam_set,duration:parseInt($('#chapterworkduration').val())})
        updateNewCourse(par,4);
    }else if(Application.isupdatechapter == 4){
        var exam_set = '2,'+$('#singlequestion').val()+','+$('#singletotalpoints').val()+'|3,'+$('#multiquestion').val()+','+$('#multitotalpoints').val();
        var par ='parameter='+JSON.stringify({iid:parseInt($('#chapterListTab').attr('iid')),cate:4,path:0,deep:1,ord:$('#courseworklist').bootstrapTable('getData').length,deep:1,title:$('#chapterworktitle').val(),exam_set:exam_set,duration:parseInt($('#chapterworkduration').val())})
        intsertNewCourse(par,4);
    }

}


function updateNewCourse(para,cate){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/updateClassChapter",'POST',para,'json',function(data){
        if(data.errcode == 0){
            if(cate ==1){
                $('#restorechapterworkeditor').tab('show');

                para = 'parameter='+JSON.stringify({iid:parseInt($('#chapterListTab').attr('iid')),cate:1});

                getChapterContent(para);
            }
            else if(cate==2){
                $('#restorechaptersetting').tab('show');
                getChapterWork(2);
            }else if(cate==4){
                //$('#courseexamlist').bootstrapTable('load',data.data);
                $('#restorechaptersetting').tab('show');
                getChapterWork(4);
            }else if(cate==3){
                $('#coursefudaolist').bootstrapTable('load',data.data);
            }
            G.ui.tips.suc("更新成功");
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')

}
function intsertNewCourse(para,cate){

    Application.Util.ajaxConstruct(Application.serverHost + "/content/insertClassChapter",'POST',para,'json',function(data){
        if(data.errcode == 0){
            Application.isUpdatecoursechapterlist = false;
            Application.isupdatechapter = 2;
            Application.isupdatechapter = 3;
            if(cate ==1){
                $('#restorechapterworkeditor').tab('show');

                para = 'parameter='+JSON.stringify({iid:parseInt($('#chapterListTab').attr('iid')),cate:1});

                getChapterContent(para);
            }
            else if(cate==2){
                getChapterWork(2);
                $('#restorechaptersetting').tab('show');
                //$('#courseworklist').bootstrapTable('load',data.data);
            }else if(cate==4){
                getChapterWork(4);
                $('#restorechaptersetting').tab('show');
                //$('#courseexamlist').bootstrapTable('load',data.data);
            }else if(cate==3){
                $('#coursefudaolist').bootstrapTable('load',data.data);
            }

        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')

}

//章节考试
function initcourseexamlist(){
    $('#courseexamlist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,

        columns: [
            {
                field:'status',
                align:'center',

                checkbox:true

            },
            {
                field: 'title',
                title: '标题',
                align: 'left',

                formatter:function(value, row){
                    return '<a href="#chapterworkeditor"  data-toggle="tab">'+value+'</a>'
                }

            },
            {
                field: 'id',
                align: 'center',
                title: '编号'

            }]
    }).on('click-row.bs.table', function (e, row, $element) {
        Application.isupdatechapter =3;
        $("#chapterworktitle").val(row.title);
        $("#chaptertitle").attr('rid',row.id);
        $("#chapterworkduration").val(row.duration)
        $("#singlequestion").val(row.exam_set.split('|')[0].split(',')[1]);
        $("#singletotalpoints").val(row.exam_set.split('|')[0].split(',')[2]);

        $("#multiquestion").val(row.exam_set.split('|')[1].split(',')[1]);
        $("#multitotalpoints").val(row.exam_set.split('|')[1].split(',')[2]);
    });
}

//章节辅导
function initfudaoWork(){
    $('#coursefudaolist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,

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
                    return '<a href="#chapterworkeditor"  data-toggle="tab">'+value+'</a>'
                }

            },
            {
                field: 'id',
                align: 'center',
                title: '编号'

            }]
    }).on('click-row.bs.table', function (e, row, $element) {
        $("#chaptertitle").val(row.title)

        $("#pptaddress").val(row.ppt_url)

        $("#vedioaddress").val(row.video_url);
        $("#contentdes").val(row.text);
    });
}

//章节作业
function initChapterWork(){
    $('#courseworklist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,

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
                    return '<a href="#chapterworkeditor"  data-toggle="tab">'+value+'</a>'
                }

            },
            {
                field: 'id',
                align: 'center',
                title: '编号'

            }]
    }).on('click-row.bs.table', function (e, row, $element) {

        Application.isupdatechapter = 1;
        //$('#chapterListTab').attr('iid',row.id);
        $("#chaptertitle").attr('rid',row.id);
        $("#chapterworktitle").val(row.title)
        $("#chapterworkduration").val(row.duration)
        $("#singlequestion").val(row.exam_set.split('|')[0].split(',')[1]);
        $("#singletotalpoints").val(row.exam_set.split('|')[0].split(',')[2]);

        $("#multiquestion").val(row.exam_set.split('|')[1].split(',')[1]);
        $("#multitotalpoints").val(row.exam_set.split('|')[1].split(',')[2]);

        //$("#vedioaddress").val(row.video_url);
        //$("#contentdes").val(row.text);
    });
}


function getChapterWork(cate){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassChapterList",'POST',"parameter="+JSON.stringify({iid:parseInt($('#chapterListTab').attr('iid')),cate:cate}),'json',function(data){
        if(data.errcode == 0){
            if(cate==2){
                $('#courseworklist').bootstrapTable('load',data.data);
            }else if(cate==4){
                $('#courseexamlist').bootstrapTable('load',data.data);
            }else if(cate==3){
                $('#coursefudaolist').bootstrapTable('load',data.data);
            }

        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded');

}

function deleteR(id){
    if(id==1){
        var data = $('#coursechapterlist').bootstrapTable('getSelections');

        for(var i in data){
            deleteChapter(data[i].id,1);
        }
    }
    if(id==2){
        var data = $('#courseworklist').bootstrapTable('getSelections');

        for(var i in data){
            deleteChapter(data[i].id,2);
        }
    }
    if(id==4){
        var data = $('#courseexamlist').bootstrapTable('getSelections');

        for(var i in data){
            deleteChapter(data[i].id,4);
        }
    }
}

function deleteChapter(id,cate){

    Application.Util.ajaxConstruct(Application.serverHost + "/content/deleteClassChapter",'POST',"parameter="+JSON.stringify({id:id}),'json',function(data){
        if(data.errcode == 0){
            //if(cate ==1){
            //    coursechapterlist
            //}
            //if(cate==2){
            //    $('#courseworklist').bootstrapTable('load',data.data);
            //}else if(cate==4){
            //    $('#courseexamlist').bootstrapTable('load',data.data);
            //}else if(cate==3){
            //    $('#coursefudaolist').bootstrapTable('load',data.data);
            //}
            if(cate ==1){
                $('#restorechapterworkeditor').tab('show');

                para = 'parameter='+JSON.stringify({iid:parseInt($('#chapterListTab').attr('iid')),cate:1});

                getChapterContent(para);
            }
            else if(cate==2){
                getChapterWork(2);
                $('#restorechaptersetting').tab('show');
                //$('#courseworklist').bootstrapTable('load',data.data);
            }else if(cate==4){
                getChapterWork(4);
                $('#restorechaptersetting').tab('show');
                //$('#courseexamlist').bootstrapTable('load',data.data);
            }else if(cate==3){
                $('#coursefudaolist').bootstrapTable('load',data.data);
            }
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded');
}

/***
 * 查询章节列表
 * @param para
 */
function getChapterContent(para){
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassChapterList",'POST',para,'json',function(data){
        if(data.errcode == 0){

            var chapterlist=[];
            var result = [];
            result.push({id:'',text:'全部'});
            for(var i in data.data){
                data.data[i].num=parseInt(i)+1;
                 result.push({id:data.data[i].path+'-'+data.data[i].id,text:data.data[i].title});
            }

            $('#examchapter').select2({
                data: function () {
                    return { results: result};
                },
                placeholder:'章节'
            })

            $('#chapter').select2({
                data: function () {
                    return { results: result};
                },
                placeholder:'章节'
            });

            $('#chapterboollive').select2({
                data: function () {
                    return { results: [{id:'',text:'全部'},{id:'y',text:'有效'},{id:'n',text:'无效'}]};
                },
                placeholder:'是否有效'
            })
            $('#editorchapterboollive').select2({
                data: function () {
                    return { results: [{id:'y',text:'有效'},{id:'n',text:'无效'}]};
                },
                placeholder:'是否有效'
            })
            $('#questiontype').select2({
                data: function () {
                    return { results: [{id:'',text:'全部'},{id:2,text:'单选'},{id:3,text:'多选'}]};
                },
                placeholder:'题型'
            });
            $('#editorquestiontype').select2({
                data: function () {
                    return { results: [{id:2,text:'单选'},{id:3,text:'多选'}]};
                },
                placeholder:'题型'
            });

            $('#editorchapter').select2(
                {
                    data: function () {
                        return { results:result};
                    },
                    placeholder:'所属章节'
                }
            );
            Application.chapterlist = chapterlist;

            $('#coursechapterlist').bootstrapTable('load', data.data);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function initChapterSetList(){
    $('#coursechapterlist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,

        columns: [ {
            field: 'num',
            align: 'center',
            title: '序号'

        }
            ,
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

            },
            {
                field: 'id',
                align: 'center',
                title: '编号'

            }]
    }).on('click-row.bs.table', function (e, row, $element) {

        Application.isUpdatecoursechapterlist = true;

         $("#chaptertitle").val(row.title)
        $("#chaptertitle").attr('rid',row.id);
        $("#chaptertitle").attr('ord',row.ord);
        $("#pptaddress").val(row.ppt_url)

        $("#vedioaddress").val(row.video_url);
        $("#contentdes").val(row.text);
    });
}
$("#chapteraddbutton").click(function(){
    Application.isUpdatecoursechapterlist = false;
})
//更新课程信息,还没有实现
function updateCourseEditor(){
    $('#coursetitle').val();
    $('#coursedescription').val();
    $('#coursenum').val();
    $("#special").select2("val");
    $('#courseduration').val();
    $('#coursepoint').val();
    $('#timelimit').val();
    $('#coursespend').val();

    $("#courseeditorstatus").is(':checked')?1:0


    //Application.Util.ajaxConstruct(Application.serverHost + "/content/updateProfessionalManagementById",'POST',data,'json',function(data){
    //    if(data.errcode == 0){
    //        getSpecialList();
    //        $('#restoremanagespecial').tab('show')
    //    }else{
    //        G.ui.tips.err(data.errmsg);
    //    }
    //
    //},function(data){
    //    G.ui.tips.err('查询失败！！')
    //},'application/x-www-form-urlencoded')

}

//重置课程编辑
function resetCourseEditor(){
    $('#coursetitle').val('');
    $('#coursedescription').val('');
    $('#coursenum').val('');
    $("#special").select2("val",'');
    $('#courseduration').val('');
    $('#coursepoint').val('');
    $('#timelimit').val('');
    $('#coursespend').val('');

    $('#addcoursedate').val('');

    $('#courseeditorstatus').attr('checked',false);
    Application.updateChapter = false;
    Application.chapterid = -1;
}


function resetChapter(){
    $("#chaptertitle").val('')

    $("#pptaddress").val('')

    $("#vedioaddress").val('');
    $("#contentdes").val('');
}

function resetChapterworkeditor(){
    $("#chapterworktitle").val('')

    $("#chapterworkduration").val('')

    $("#singlequestion").val('');

    $("#singletotalpoints").val('');
    $("#multiquestion").val('');
    $("#multitotalpoints").val('');
}
function getQuestionsList(){
    if(!Application.specialname){
        getSpecialList();
    }
    $("#allspecialforquestion").select2('val','');
    $("#chapterforquestionListTab").select2('val','');
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getClassManagementList",'POST',{},'json',function(data){
        if(data.errcode == 0){

            for(var item in data.data){
                data.data[item]['num'] = parseInt(item)+1;
            }
            $('#managecourselist').bootstrapTable('load',data.data);

            Application.lessonData = data.data;
            //$('#chapterforquestionListTab').empty();
            var html = '';
            var arr =[];
            for(var i= 0,len=data.data.length;i<len;i++){
                arr.push({id:data.data[i].id,text:data.data[i].title})
                //if(i==0){
                //    html+='<a class="btn btn-success btn-sm" data-id ='+data.data[i].id+' onclick="initQuestionsList('+data.data[i].id+')">'+data.data[i].no+'-'+data.data[i].title+'</a>'
                //}else{
                //    html+='<a class="btn btn-default btn-sm" data-id ='+data.data[i].id+' onclick="initQuestionsList('+data.data[i].id+')">'+data.data[i].no+'-'+data.data[i].title+'</a>'
                //}
            }
            Application.courseData = data.data;
            $('#chapterforquestionListTab').select2(
                {
                    data: function () {
                        return { results:[]};
                    },
                    placeholder:'所属课程'
                }
            ).on('change',function(e){
                    initQuestionsList(e.val);

                    $('#editorlesson').select2('val', e.val)
                });

            initQuestionsList({});
        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    })
}


function deleteQuestion(){

    var selectData = $('#managequestionslist').bootstrapTable('getSelections');

    for(var i in selectData){
        var para = 'parameter='+JSON.stringify({id:selectData[i].id});
            Application.Util.ajaxConstruct(Application.serverHost + "/content/deleteQuestionsManagement",'POST',para,'json',function(data){
                if(data.errcode == 0){

                    var id = $('#chapterforquestionListTab .btn-success').attr('data-id')
                    initQuestionsList(id);
                }else{
                    G.ui.tips.err('删除失败！！');
                }

            },function(data){
                G.ui.tips.err('删除失败！！');
            },'application/x-www-form-urlencoded')

    }


}

/***
 * 重置试题编辑
 */
function resetquestionseditor(){

    $('#editorquestiontype').select2('val');
    $('#editorchapterboollive').select2('val');
    $('#editorlesson').select2('val');

    $('#editorinputtitle').val('')
    $('#answerA').val('')
    $('#answerB').val('')
    $('#answerC').val('')
    $('#answerD').val('')


    $('#editorremarker').val('');

    $('#editorremarker').val('');
    $('#editorchapter').val('');
}



function initQuestionsList(pid){
    //if(!Application.chapterlist){\
    if(typeof pid === 'object'){
        para = 'parameter='+JSON.stringify({iid:pid.cid,cate:2});
        getChapterContent(para);
    }else{
        para = 'parameter='+JSON.stringify({iid:pid,cate:2});
        getChapterContent(para);
    }



    $('#managequestionslist').bootstrapTable('destroy');
    $('#managequestionslist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url:Application.serverHost + "/content/getQuestionsManagementList",
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        sidePagination: "server",
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache:false,
        pageNumber:1,
        method:'POST',
        ajaxOptions:{
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
                'X-Auth-Token':$.cookie("Token")
            },
            dataType:'json'
        },

        queryParams: function (params) {
            var data =null
            if(typeof pid === 'object'){
                pid['index']= (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter='+JSON.stringify(pid);
            }else {
                data = 'parameter='+JSON.stringify({
                        'index': (params.offset / params.limit) + 1,
                        'cid':pid,
                        'pageSize':params.limit
                    })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if(data.errcode == 0){
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    tableData.rows.push(
                        {
                            id: data.data[i].id,
                            num: i + 1,
                            title: data.data[i].title,
                            type: data.data[i].type,
                            addtime: data.data[i].add_date,
                            uid: 1,
                            cate: data.data[i].cate,
                            cid: data.data[i].cid,
                            ccid: 0,
                            op1: data.data[i].op1,
                            op2: data.data[i].op2,
                            op3: data.data[i].op3,
                            op4: data.data[i].op4,
                            answer: data.data[i].answer,
                            add_date: data.data[i].add_date,
                            score: 0.0,
                            remark: data.data[i].remark,
                            cpath: data.data[i].cpath,
                            zl: 1,
                            anli_id: 0
                        })
                }
                return tableData;
            }else{
                G.ui.tips.info('查询数据出错！'+ data.errmsg);
                return;
            }

        },
        columns: [ {
            field: 'num',
            align: 'center',
            title: '序号'

        },

            {
                field: 'status',
                align: 'center',

                checkbox:true
            },

            {
                field: 'title',
                title: '题目',
                align: 'left',
                formatter:function(value, row){
                    return '<a href="#questioneditor" data-toggle="tab">'+value+'</a>'
                }

            },
            {
                field: 'type',
                align: 'center',
                title: '题型',
                formatter:function(value, row){
                    if(value ==2){
                        return '单选'
                    }
                    if(value ==3){
                        return '多选'
                    }
                }

            },{
                field: 'addtime',
                align: 'center',
                title: '添加时间',
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            }]
    }).on('click-row.bs.table', function (e, row, $element) {

        if($element.context.cellIndex ==2){
            copyLesson(3)
            $('#editorquestiontype').select2('val',row.type);
            $('#editorchapterboollive').select2('val',row.cate);
            $('#editorlesson').select2('val',row.cid);
            $('#restorequestionsetting').attr('rowid',row.id);
            $('#editorinputtitle').val(row.title);
            $('#answerA').val(row.op1)
            $('#answerB').val(row.op2)
            $('#answerC').val(row.op3)
            $('#answerD').val(row.op4)


            var answerarr = row.answer.split(',');
            for(var i= 0,len = answerarr.length;i<len;i++){

                    switch (answerarr[i]){
                        case 'A':
                            $('#chk1').prop('checked','checked')
                            break;
                        case 'B':
                            $('#chk2').prop('checked','checked')
                            break;
                        case 'C':
                            $('#chk3').prop('checked','checked')
                            break;
                        case 'D':
                            $('#chk4').prop('checked','checked')
                            break;
                    }


            }
            $('#addquestiondate').val(new Date(parseInt(row.add_date.toString().length==10?row.add_date+'000':row.add_date)).Format('yyyy-MM-dd'));

            $('#editorremarker').val(row.remark);
            $('#editorchapter').select2('val',row.cpath);


        }

    }).on('check.bs.table',function (e, row, $element) {
        $('#editorquestiontype').select2('val',row.type);
        $('#editorchapterboollive').select2('val',row.cate);
        $('#editorlesson').select2('val',row.cid);

        $('#editorinputtitle').val(row.title +'_新复制');
        $('#answerA').val(row.op1)
        $('#answerB').val(row.op2)
        $('#answerC').val(row.op3)
        $('#answerD').val(row.op4)


        var answerarr = row.answer.split(',');
        for(var i= 0,len = answerarr.length;i<len;i++){

            switch (answerarr[i]){
                case 'A':
                    $('#chk1').attr('checked','checked')
                    break;
                case 'B':
                    $('#chk2').attr('checked','checked')
                    break;
                case 'C':
                    $('#chk3').attr('checked','checked')
                    break;
                case 'D':
                    $('#chk4').attr('checked','checked')
                    break;
            }


        }
        $('#addquestiondate').val(new Date(parseInt(row.add_date.toString().length==10?row.add_date+'000':row.add_date)).Format('yyyy-MM-dd'));

        $('#editorremarker').val(row.remark);
        $('#editorchapter').select2('val',row.cpath);
    });
}


function getManageAuthenticateList(state){
    if(!Application.specialList){
        getSpecialList();
    }
    initTabs('selectauthenticatetab');
    var para = 'parameter='+JSON.stringify({'state':state});
    if(state ==-1){
        para={}
    }
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getAppraisalList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            for(var i in data.data){

                data.data[i].num = 1+parseInt(i);

            }
            $('#manageauthenticatelist').bootstrapTable('load',data.data);

        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded')
}

/***
 * 初始化鉴定辅导列表
 */
function initManageAuthenticateList(){
    $('#manageauthenticatelist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        search:true,
        columns: [ {
            field: 'num',
            align: 'center',
            title: '序号'

        },

            {
                field: 'no',
                align: 'center',
                title: '编号'

            },
            {
                field:'status',
                align:'center',

                checkbox:true

            },
            {
                field: 'path',
                title: '专业',
                align: 'center',
                formatter:function(value, row){
                    var code = value.split('-')[1];
                    for(var i in Application.specialList){
                        if(code == Application.specialList[i].id){
                            return Application.specialList[i].title;
                        }
                    }
                }

            },
            {
                field: 'title',
                align: 'center',
                title: '辅导栏目',

                formatter:function(value, row){
                    return '<a href="#insertauthenticatenode"  data-toggle="tab">'+value+'</a>'
                }

            }, {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value, row){
                    if(value=='n'){
                        return '有效'
                    }else{
                        return '无效'
                    }
                }

            },{
                field: 'add_date',
                align: 'center',
                title: '添加时间',
                formatter:function(value, row){
                    var time=new Date(parseInt(value.toString().length==10?value.toString()+'000':value.toString()));

                    return time.Format('yyyy-MM-dd hh:mm:ss')
                }

            },{
                field: 'operate',
                align: 'center',
                title: '操作',
                formatter:function(value, row){
                    return '<a href="#manageauthenticatenode" class="btn btn-primary btn-sm" data-toggle="tab">节点设置</a>'
                }

            }]
    }).on('click-row.bs.table', function (e, row, $element) {
        if($element.context.cellIndex ==4){

            Application.jiedianupdate =true;
            if(row.state =='n'){
                $('#authenticatelive').attr('checked',true);
            }

            $('#authenticategroup').select2("val",row.path.split('-')[1]);
            Application.rowid = row.id;
            $('#fudaonum').val(row.num);
            $('#fudaotitle').val(row.title)
            $("#addauthenticatetime").val(row.add_date);
        }else if($element.context.cellIndex == 7){
            $('#restorechapternode').attr('iid',row.id);
            getManageAuthenticateNodeList(row.id);
        }

    });
}

/***
 * 查询节点列表
 * @param id
 */
function getManageAuthenticateNodeList(id){
    var para = 'parameter='+JSON.stringify({'iid':id});
    Application.Util.ajaxConstruct(Application.serverHost + "/content/getAppraisalNodesList",'POST',para,'json',function(data){
        if(data.errcode == 0){
            for(var i in data.data){

                data.data[i].num = 1+parseInt(i);

            }
            $('#manageauthenticatenodelist').bootstrapTable('load',data.data);

        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded')
}

/***
 * 保存鉴定辅导
 */
function saveAuthenticate(){

    var live = 'y'
    if($('#authenticatelive').is(':checked')){
        live = 'n';
    }
    var group = $('#authenticategroup').val();
    var num =$('#fudaonum').val();
    var fudaotitle = $('#fudaotitle').val()
    var time = $("#addauthenticatetime").val();
    var uid ='';
    var id = $('#authenticategroup').val()
    for(var item in Application.specialList){
        if(Application.specialList[item].id == group){
            uid = Application.specialList[item].ord;

        }
    }

    var para ='parameter='+JSON.stringify({id:Application.rowid,uid:uid,no:num,path:'0-'+group+'',title:fudaotitle,add_date:time,state:live});
    var url = ''
    if(Application.jiedianupdate==true){
        url = Application.serverHost + "/content/updateAppraisalById"
    }else if(!Application.jiedianupdate){
        url = Application.serverHost + "/content/insertAppraisal"
    }

    Application.Util.ajaxConstruct(url,'POST',para,'json',function(data){
        if(data.errcode == 0){
            Application.jiedianupdate=undefined
            $('#restoreauthenticatenode').tab('show');
            getManageAuthenticateList();
        }else{
            G.ui.tips.err('更新失败！！');
        }

    },function(data){
        G.ui.tips.err('更新失败！！');
    },'application/x-www-form-urlencoded');
}

/***
 * 删除鉴定辅导
 */
function deleteAuthenticate(){

    var deldata =  $('#manageauthenticatelist').bootstrapTable('getSelections');

    for(var i= 0,len = deldata.length;i<len;i++){

        var para = 'parameter='+JSON.stringify({id:deldata[i].id});
        Application.Util.ajaxConstruct(Application.serverHost + "/content/deleteAppraisalById",'POST',para,'json',function(data){
            if(data.errcode == 0){
                $('#restoreauthenticatenode').tab('show');
                getManageAuthenticateList();
            }else{
                G.ui.tips.err('删除失败！！');
            }

        },function(data){
            G.ui.tips.err('删除失败！！');
        },'application/x-www-form-urlencoded');

    }


}

/***
 * 新增节点
 */
function insertAuthenticateNode(){
    var row = {};
    var iid =parseInt($('#restorechapternode').attr('iid'));
    row.iid = iid;
    row.path = '0';
    row.deep = 1;
    row.title = $('#nodetitle').val()==''?'':$('#nodetitle').val();
    row.ppt_url = $('#nodepptaddress').val()==''?'':$('#nodepptaddress').val();
    row.video_url = $('#nodevedioaddress').val()==''?'':$('#nodevedioaddress').val();
    row.video_url1 = '';
    row.attachment = '';
    row.text =$('#nodecontentdes').val()==''?'':$('#nodecontentdes').val();
    var para = 'parameter='+JSON.stringify(row);
    Application.Util.ajaxConstruct(Application.serverHost + "/content/insertAppraisalNodes",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#restorechapternode').tab('show');
            getManageAuthenticateNodeList(row.iid);
        }else{
            G.ui.tips.err('更新失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded');
}
/***
 * 更新节点
 */
function updateAuthenticateNode(){
    if(Application.isupdatenode ==true){
        var row = JSON.parse($('#nodetitle').attr('data'));
        row.title = $('#nodetitle').val()==''?'':$('#nodetitle').val();
        row.ppt_url = $('#nodepptaddress').val()==''?'':$('#nodepptaddress').val();
        row.video_url = $('#nodevedioaddress').val()==''?'':$('#nodevedioaddress').val();
        row.text =$('#nodecontentdes').val()==''?'':$('#nodecontentdes').val();
        var para = 'parameter='+JSON.stringify(row);
        Application.Util.ajaxConstruct(Application.serverHost + "/content/updateAppraisalNodes",'POST',para,'json',function(data){
            if(data.errcode == 0){
                $('#restorechapternode').tab('show');
                Application.isupdatenode = false;
                getManageAuthenticateNodeList(row.iid);
            }else{
                G.ui.tips.err('更新失败！！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！');
        },'application/x-www-form-urlencoded');
    }else{
        insertAuthenticateNode()
    }

}

function updatenews(){
    if(Application.isupdatenews ==true){
         var row = JSON.parse($('#newstitle').attr('data'));
        row.title = $('#newstitle').val()==''?'':$('#newstitle').val();
        row.state = $('#newsstate').select2('val')==''?'':$('#newsstate').select2('val');
        row.path = $('#newsspecial').select2('val') ==''?"":0+'-'+$('#newsspecial').select2('val');
        row.add_date = new Date($('#newsadddate').val()==''?'':$('#newsadddate').val()).getTime()/1000;
        row.text = $('.summernote').summernote('code');
        row.kword = $('#keyword').val()==''?'':$('#keyword').val();
        row._from =  $('#newssource').val();
        var para = 'parameter='+JSON.stringify(row);
        Application.Util.ajaxConstruct(Application.serverHost + "/news/saveNews",'POST',para,'json',function(data){
            if(data.errcode == 0){
                $('#restoremanageinfo').tab('show');
                Application.isupdatenews = false;
                getNewsList();
            }else{
                G.ui.tips.err('更新失败！！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！');
        },'application/x-www-form-urlencoded');
    }else{
        insertNews()
    }
}

function insertNews(){

    var row = {};
    row.uid = Application.user.id;
    row.path = $('#newsspecial').select2('val') ==''?"":0+'-'+$('#newsspecial').select2('val');
    row.title = $('#newstitle').val()==''?'':$('#newstitle').val();
    row.state = $('#newsstate').select2('val')==''?'':$('#newsstate').select2('val');
    row.add_date = new Date($('#newsadddate').val()==''?'':$('#newsadddate').val()).getTime()/1000;
    row.text =$('.summernote').val()==''?'':$('.summernote').val();
    row.kword = $('#keyword').val()==''?'':$('#keyword').val();
    //row.path = '0-20';
    row.picture ='';
    row._from =  $('#newssource').val();
    row.hits = 0;
    var para = 'parameter='+JSON.stringify(row);
    Application.Util.ajaxConstruct(Application.serverHost + "/news/insertNews",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#restoremanageinfo').tab('show');
            Application.isupdatenews = false;
            getNewsList();
        }else{
            G.ui.tips.err('更新失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded');
}
function encodeUTF8(str){
    var temp = "",rs = "";
    for( var i=0 , len = str.length; i < len; i++ ){
        temp = str.charCodeAt(i).toString(16);
        rs  += "\\u"+ new Array(5-temp.length).join("0") + temp;
    }
    return rs;
}
function decodeUTF8(str){
    return str.replace(/(\\u)(\w{4}|\w{2})/gi, function($0,$1,$2){
        return String.fromCharCode(parseInt($2,16));
    });
}
function deleteAuthenticateNode(){

    var data = $('#manageauthenticatenodelist').bootstrapTable('getSelections');

    for(var i in data){
        var para = 'parameter='+ JSON.stringify({id:data[i].id});
        Application.Util.ajaxConstruct(Application.serverHost + "/content/deleteAppraisalNodes",'POST',para,'json',function(data){
            if(data.errcode == 0){

                getManageAuthenticateNodeList(parseInt($('#restorechapternode').attr('iid')));
            }else{
                G.ui.tips.err('删除失败！！');
            }

        },function(data){
            G.ui.tips.err('删除失败！！');
        },'application/x-www-form-urlencoded');
    }

}


function initAuthenticateNodeList(){
    $('#manageauthenticatenodelist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        search:true,
        columns: [ {
            field: 'num',
            align: 'center',
            title: '序号'

        },

            {
                field:'status',
                align:'center',

                checkbox:true

            }
           ,
            {
                field: 'title',
                align: 'center',
                title: '标题',

                formatter:function(value, row){
                    return '<a href="#manageauthenticatenodeedit"  data-toggle="tab">'+value+'</a>'
                }

            },{
                field: 'id',
                align: 'center',
                title: 'ID'

            }]
    }).on('click-row.bs.table', function (e, row, $element) {
        Application.isupdatenode=true;

        $('#nodetitle').val(row.title);
        $('#nodepptaddress').val(row.ppt_url);
        $('#nodevedioaddress').val(row.video_url);
        $('#nodecontentdes').val(row.text);
        $('#nodetitle').attr('data',JSON.stringify(row));

    });;

}

function resetauthenticate(){

    $('#authenticatelive').attr('checked',false);


    $('#authenticategroup').select2("val",0);

    $('#fudaonum').val('');
    $('#fudaotitle').val('')
    $("#addauthenticatetime").val('');
}

function resetnodeedit(){
    $('#nodetitle').val('');
    $('#nodepptaddress').val('');
    $('#nodevedioaddress').val('');
    $('#nodecontentdes').val('');
}

function resetnewsedit(){
    Application.isupdatenews =false;
    $('#newsstate').select2('val','');
    $('#newsspecial').select2('val','');
    $('#newstitle').val('');
    $('#keyword').val('');
    $('#newssource').val('');
    $('#newsadddate').val('');
    $('.summernote').summernote('code', '');
}
/***
 * 初始化模块列表
 */
function initModuleSelectList(){
    $('#managemodulelist').bootstrapTable({
        height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        search:true,
        columns: [

            {
                field:'name',
                align:'center',
                title:'模块'

            }
            , {
                field: 'status',
                align: 'center',
                title: '状态',
                formatter:function(value, row){
                    return value ==0?'不可见':'可见';
                }
            },{
                field: 'operate',
                align: 'center',
                title: '操作',
                formatter:function(value, row){
                    var text = row.status == 0?'使可见':'使不可见';
                    var arg = row.id+'|'+row.paths+'|'+row.status;
                    return '<a class="btn btn-primary btn-sm" data ="'+arg+'"  onclick="changeStatus(event)" data-toggle="tab">'+text+'</a>'
                }

            }]
    });




    $('#studentduration').bootstrapTable({

        singleSelect:true,
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,


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


function changeStatus(e) {
    var arg = $(e.target).attr('data');
    var argarr = arg.split('|');
    var sid = ''
    var id = argarr[0];
    var specialId = $("#specialmoduleselect").select2('val');
    var status = argarr[2];
    if(status ==0){
        sid = argarr[1]  + specialId+';'
    }else{
        var i = argarr[1].indexOf(specialId);
        if(argarr[1].length == i+specialId.length){
            sid = argarr[1].replace(specialId,'');
        }else{
            sid = argarr[1].replace(specialId+';','');
        }


    }

    if(sid == ''){
        sid = 'n;'
    }


    Application.Util.ajaxConstruct(Application.serverHost + "/content/updatemodule/"+parseInt(id)+"/"+sid, 'POST', {}, 'json', function (data) {
        if (data.errcode == 0) {
            getModuleList(specialId);

        }else{
            G.ui.tips.err('更新失败！！');
        }
    })
}

/***
 *
 * @param pid
 */
function initBatchRegisterUser(pid){


    if(!Application.specialList){
        getSpecialList()
    }

    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })


    $('#batchstate').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'状态'
    });

    $('#batchregistermodulelist').bootstrapTable('destroy');
    $('#batchregistermodulelist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url:Application.serverHost + "/student/getBatchSignUpList",
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        sidePagination: "server",
        showColumns: true,
        showRefresh:false,
        showToggle:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache:false,
        pageNumber:1,
        method:'POST',
        ajaxOptions:{
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
                'X-Auth-Token':$.cookie("Token")
            },
            dataType:'json'
        },

        queryParams: function (params) {
            var data =null
            if(typeof pid === 'object'){
                pid['index']= (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter='+JSON.stringify(pid);
            }else {
                data = 'parameter='+JSON.stringify({
                    'index': (params.offset / params.limit) + 1,
                    'pageSize':params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if(data.errcode == 0){
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    if(data.data[i].userType ==2){
                        tableData.rows.push(
                            {
                                num:i+1,
                                id: data.data[i].id,
                                live:data.data[i].live,
                                gid:data.data[i].gid,
                                username:data.data[i].username,
                                password:data.data[i].password,
                                passwordQuestion:data.data[i].passwordQuestion,
                                passwordAnswer:data.data[i].passwordAnswer,
                                name:data.data[i].name,
                                gender:data.data[i].gender,
                                phone:data.data[i].phone,
                                email:data.data[i].email,
                                cellphone:data.data[i].cellphone,
                                zjlx:data.data[i].zjlx,
                                zjhm:data.data[i].zjhm,
                                city:data.data[i].city,
                                addr:data.data[i].addr,
                                postcode:data.data[i].posrcode,
                                birthday:data.data[i].birthday,
                                remark:data.data[i].remark,
                                add_Date:data.data[i].add_Date,
                                regDate:data.data[i].regDate,
                                lastactivity:data.data[i].lastactivity,
                                uid:data.data[i].uid,
                                state:data.data[i].state,
                                userType:data.data[i].userType,
                                province:data.data[i].province,
                                education:data.data[i].education,
                                special:data.data[i].special,
                                signSpecial:data.data[i].signSpecial,
                                signClass:data.data[i].signClass,
                                haveClass:data.data[i].haveClass,
                                haveClassDate:data.data[i].haveClassDate,
                                aspid:data.data[i].aspid,
                                duration:data.data[i].duration,
                                isExtendUser:data.data[i].isExtendUser,
                                lastModify:data.data[i].lastModify,
                                isTempUser:data.data[i].isTempUser,
                                graduateDate:data.data[i].graduateDate,
                                regEnd:data.data[i].regEnd,
                                unit:data.data[i].unit,
                                isGraduated:data.data[i].isGraduated,
                                creator:data.data[i].creator
                            })
                    }

                }
                return tableData;
            }else{
                G.ui.tips.info('查询数据出错！'+ data.errmsg);
                return;
            }

        },
        columns: [ {
            field: 'num',
            align: 'center',
            title: '编号'

        },

            {
                field: 'status',
                align: 'center',

                checkbox:true
            },
            {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value,row){

                    switch (value){
                        case 'w':
                            return "未开通";
                        break;
                        case 'y':
                            return "在学";
                        break;
                        case 'x':
                            return "休学";
                        break;
                        case 'c':
                            return "超期";
                        break;
                        case 'z':
                            return "滞学";
                        break;
                        case 'q':
                            return "退学";
                        break;
                        case  "j":
                            return "结业";
                        break;
                        case "t":
                            return "临时学员";
                        break;
                        case "e":
                            return "延学";
                        case "h":
                            return "恢复"

                        break;


                    }
                }
            },

            {
                field: 'username',
                title: '用户名',
                align: 'center',
                formatter:function(value,row){
                    return '<a href="#" >'+value+'</a>'
                }
            },
            {
                field: 'name',
                title: '姓名',
                align: 'center'
            },
            {
                field: 'province',
                title: '省份',
                align: 'center'
            },
            {
                field: 'cellphone',
                title: '手机',
                align: 'center'
            },{
                field: 'email',
                title: '邮箱',
                align: 'center'
            }
            ,{
                field: 'creator',
                title: '添加人',
                align: 'center'
            },
           {
                field: 'regDate',
                align: 'center',
                title: '注册日期',
               formatter:function(value, row){
                   return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
               }

            }]
    }).on('click-row.bs.table', function (e, row, $element) {

        if($element.context.cellIndex ==3){
            Application.isAdd = false;
            $('#div_baseinfopanel').modal();
            $('#specialpanel').show();

            if (row.state != "w") {
                $("#userboollive").prop("checked", "checked");
            }


            $('#rightgroup').select2('val', row.gid)
            $('#rightgroup').attr('disabled',true);

            $("#username").val(row.username);
            $("#realname").val(row.name);

            $("#passwordquestion").val(row.passwordQuestion);
            $("#passwordanswer").val(row.passwordAnswer);

            $('#idnumber').val(row.zjhm);

            $("#gender").select2({
                data: function () {
                    return {results: [{id: 1, text: '男'}, {id: 2, text: '女'}]};
                }

            }).select2("val", row.gender);

            $("#email").val(row.email);
            $("#birthday").val(row.birthday);
            $("#phone").val(row.phone);

            $("#cellphone").val(row.cellphone);

            $("#pravince").val(row.province);


            $("#unitnum").val(row.unit);

            $("#address").val(row.addr);
            $("#postnum").val(row.postcode);

            $("#remark").val(row.remark);
            $("#adddate").val(new Date( parseInt(row.add_Date.toString().length==10?row.add_Date+'000':value)).Format('yyyy-MM-dd').toString());
            $(".specialchk").prop('checked', false);
            for (var i in row.signSpecial.split(',')) {
                $('#specialpanel .specialchk').each(function (index, value) {
                    if ($(this).attr('data-id') == row.signSpecial.split(',')[i]) {
                        $(this).prop('checked', 'checked');
                    }
                    //else{
                    //    $(this).attr('checked', false);
                    //}
                })
            }
        }

    }).on('check.bs.table',function (e, row, $element) {

    });
}


/***
 * 学员管理
 * @param pid
 */
function initStudentMangeList(pid){


    if(!Application.specialList){
        getSpecialList()
    }

    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })


    $('#batchstate').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'状态'
    });

    $('#allstudentlist').bootstrapTable('destroy');
    $('#allstudentlist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url:Application.serverHost + "/student/getBatchSignUpList",
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        sidePagination: "server",
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache:false,
        pageNumber:1,
        method:'POST',
        ajaxOptions:{
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
                'X-Auth-Token':$.cookie("Token")
            },
            dataType:'json'
        },

        queryParams: function (params) {
            var data =null
            if(typeof pid === 'object'){
                pid['index']= (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter='+JSON.stringify(pid);
            }else {
                data = 'parameter='+JSON.stringify({
                    'index': (params.offset / params.limit) + 1,
                    'pageSize':params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if(data.errcode == 0){
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    if(data.data[i].userType!=1){
                        tableData.rows.push(
                            {
                                num:tableData.rows.length+1,

                                id: data.data[i].id,
                                live:data.data[i].live,
                                gid:data.data[i].gid,
                                username:data.data[i].username,
                                password:data.data[i].password,
                                passwordQuestion:data.data[i].passwordQuestion,
                                passwordAnswer:data.data[i].passwordAnswer,
                                name:data.data[i].name,
                                gender:data.data[i].gender,
                                phone:data.data[i].phone,
                                email:data.data[i].email,
                                cellphone:data.data[i].cellphone,
                                zjlx:data.data[i].zjlx,
                                zjhm:data.data[i].zjhm,
                                city:data.data[i].city,
                                addr:data.data[i].addr,
                                postcode:data.data[i].postcode,
                                birthday:data.data[i].birthday==null?'1970-01-01':new Date(data.data[i].birthday.time).Format('yyyy-MM-dd'),
                                remark:data.data[i].remark,
                                add_Date:data.data[i].add_Date,
                                regDate:data.data[i].regDate,
                                lastactivity:data.data[i].lastactivity,
                                uid:data.data[i].uid,
                                state:data.data[i].state,
                                userType:data.data[i].userType,
                                province:data.data[i].province,
                                education:data.data[i].education,
                                special:data.data[i].special,
                                signSpecial:data.data[i].signSpecial,
                                signClass:data.data[i].signClass,
                                haveClass:data.data[i].haveClass,
                                haveClassDate:data.data[i].haveClassDate,
                                aspid:data.data[i].aspid,
                                duration:data.data[i].duration,
                                isExtendUser:data.data[i].isExtendUser,
                                lastModify:data.data[i].lastModify,
                                isTempUser:data.data[i].isTempUser,
                                graduateDate:data.data[i].graduateDate,
                                regEnd:data.data[i].regEnd,
                                unit:data.data[i].unit,
                                isGraduated:data.data[i].isGraduated,
                                creator:data.data[i].creator
                            })
                    }

                }
                return tableData;
            }else{
                G.ui.tips.info('查询数据出错！'+ data.errmsg);
                return;
            }

        },
        columns: [ {
            field: 'num',
            align: 'center',
            title: '编号'

        },

            {
                field: 'status',
                align: 'center',

                checkbox:true
            },
            {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value,row){


                    //if((new Date()).getTime()/1000>row.regEnd&&!row.state=="x"&&!row.state=="j"){
                    //
                    //    return "超期";
                    //
                    //}
                    //
                    //if((new Date()).getTime()/1000 -row.lastactivity>90*24*60*60){
                    //    return "滞学";
                    //}


                    switch (value){
                        case 'w':
                            return "未开通";
                            break;
                        case 'y':
                            return "在学";
                            break;
                        case 'x':
                            return "休学";
                            break;
                        case 'c':
                            return "超期";
                            break;
                        case 'z':
                            return "滞学";
                            break;
                        case 'q':
                            return "退学";
                            break;
                        case  "j":
                            return "结业";
                            break;
                        case "t":
                            return "临时学员";
                            break;
                        case "e":
                            return "延学";
                        case "h":
                            return "恢复"

                            break;


                    }





                }
            },

            {
                field: 'username',
                title: '用户名',
                align: 'center',
                formatter:function(value,row){
                    return '<a href="#" >'+value+'</a>'
                }
            },
            {
                field: 'name',
                title: '姓名',
                align: 'center'
            }
            ,{
                field: 'creator',
                title: '添加人',
                align: 'center'
            },
            {
                field: 'regEnd',
                align: 'center',
                title: '截止日期',
                formatter:function(value,row){
                    return'<a href="#" >' +new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')+'</a>'
                }


            },
            {
                field: 'duration',
                align: 'center',
                title: '开通时长',
                formatter:function(value,row){
                    return Math.round(value/3600/24) +'天';
                }

            },
            {
                field: 'regDate',
                align: 'center',
                title: '注册日期',
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }

            },
            {
                field: 'regDate',
                align: 'center',
                title: '习题记录'
                ,
                formatter:function(value, row){
                    return '<a class="btn btn-primary btn-xs">习题记录</a>'
                }

            },
            {
                field: 'regDate',
                align: 'center',
                title: '考试记录'
                ,
                formatter:function(value, row){
                    return '<a class="btn btn-primary btn-xs">考试记录</a>'
                }

            }
            //,
            //{
            //    field: 'regDate',
            //    align: 'center',
            //    title: '强制注销',
            //    formatter:function(value, row){
            //        return '<a class="btn btn-primary btn-xs">注销</a>'
            //    }
            //
            //}
        ]
    }).on('click-row.bs.table', function (e, row, $element) {

        if($element.context.cellIndex ==3) {
            $('#div_baseinfopanel').modal();
            //Application.user = row
            $('#specialpanel').show();
            // if (row.live == "y") {
            //     $("#userboollive").attr("checked", "checked");
            // }
            if (row.state != "w") {
                $("#userboollive").prop("checked", "checked");
            }

            $('#rightgroup').select2('val', row.gid)
            $('#rightgroup').attr('disabled',true);

            $("#username").val(row.username);
            $("#realname").val(row.name);

            $("#passwordquestion").val(row.passwordQuestion);
            $("#passwordanswer").val(row.passwordAnswer);

            $('#idnumber').val(row.zjhm);

            $("#gender").select2({
                data: function () {
                    return {results: [{id: 1, text: '男'}, {id: 2, text: '女'}]};
                }

            }).select2("val", row.gender);

            $("#email").val(row.email);
            $("#birthday").val(row.birthday);
            $("#phone").val(row.phone);

            $("#cellphone").val(row.cellphone);

            $("#pravince").val(row.province);


            $("#unitnum").val(row.unit);

            $("#address").val(row.addr);
            $("#postnum").val(row.postcode);

            $("#remark").val(row.remark);
            $("#adddate").val(new Date( parseInt(row.add_Date.toString().length==10?row.add_Date+'000':value)).Format('yyyy-MM-dd').toString());
            $(".specialchk").prop('checked', false);
            for (var i in row.signSpecial.split(',')) {
                $('#specialpanel .specialchk').each(function (index, value) {
                    if ($(this).attr('data-id') == row.signSpecial.split(',')[i]) {
                        $(this).prop('checked', 'checked');
                    }
                    //else{
                    //    $(this).attr('checked', false);
                    //}
                })
            }

        }else if($element.context.cellIndex ==6) {
            initStateInfoTable(row.id)

        }


        else if($element.context.cellIndex ==9){
            $.cookie('uid',row.id, { expires: 1, path: '/' });
            $.cookie('cate',2, { expires: 1, path: '/' });
            window.open('examrecord.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
        }

        else if($element.context.cellIndex ==10){
            $.cookie('uid',row.id, { expires: 1, path: '/' });
            $.cookie('cate',4, { expires: 1, path: '/' });
            window.open('examrecord.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
        }

    }).on('check.bs.table',function (e, row, $element) {

    });
}


function initStateInfoTable(userid){
    var para ='parameter='+ JSON.stringify({userid:userid})
    Application.Util.ajaxConstruct(Application.serverHost + "/student/getStateInfo",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#studentduration').bootstrapTable('load',data.data);
            $('#learninfomodal').modal();
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

/***
 * 学员成绩管理
 * @param pid
 */
function initStudentResultsMangeList(pid){


    if(!Application.specialList){
        getSpecialList()
    }

    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })


    $('#batchstate').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'状态'
    });

    $('#allstudentresultlist').bootstrapTable('destroy');
    $('#allstudentresultlist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url:Application.serverHost + "/student/getBatchSignUpList",
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        sidePagination: "server",
        singleSelect:false,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache:false,
        pageNumber:1,
        method:'POST',
        ajaxOptions:{
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
                'X-Auth-Token':$.cookie("Token")
            },
            dataType:'json'
        },

        queryParams: function (params) {
            var data =null
            if(typeof pid === 'object'){
                pid['index']= (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter='+JSON.stringify(pid);
            }else {
                data = 'parameter='+JSON.stringify({
                    'index': (params.offset / params.limit) + 1,
                    'pageSize':params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if(data.errcode == 0){
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    if(data.data[i].gid ==13){
                        tableData.rows.push(
                            {
                                num:i+1,
                                id: data.data[i].id,
                                live:data.data[i].live,
                                gid:data.data[i].gid,
                                username:data.data[i].username,
                                PASSWORD:data.data[i].PASSWORD,
                                passwordQuestion:data.data[i].passwordQuestion,
                                passwordAnswer:data.data[i].passwordAnswer,
                                name:data.data[i].name,
                                gender:data.data[i].gender,
                                phone:data.data[i].phone,
                                email:data.data[i].email,
                                cellphone:data.data[i].cellphone,
                                zjlx:data.data[i].zjlx,
                                zjhm:data.data[i].zjhm,
                                city:data.data[i].city,
                                addr:data.data[i].addr,
                                postcode:data.data[i].posrcode,
                                birthday:data.data[i].birthday,
                                remark:data.data[i].remark,
                                add_Date:data.data[i].add_Date,
                                regDate:data.data[i].regDate,
                                lastactivity:data.data[i].lastactivity,
                                uid:data.data[i].uid,
                                state:data.data[i].state,
                                userType:data.data[i].userType,
                                province:data.data[i].province,
                                education:data.data[i].education,
                                special:data.data[i].special,
                                signSpecial:data.data[i].signSpecial,
                                signClass:data.data[i].signClass,
                                haveClass:data.data[i].haveClass,
                                haveClassDate:data.data[i].haveClassDate,
                                aspid:data.data[i].aspid,
                                duration:data.data[i].duration,
                                isExtendUser:data.data[i].isExtendUser,
                                lastModify:data.data[i].lastModify,
                                isTempUser:data.data[i].isTempUser,
                                graduateDate:data.data[i].graduateDate,
                                regEnd:data.data[i].regEnd,
                                unit:data.data[i].unit,
                                isGraduated:data.data[i].isGraduated,
                                creator:data.data[i].creator
                            })
                    }

                }
                return tableData;
            }else{
                G.ui.tips.info('查询数据出错！'+ data.errmsg);
                return;
            }

        },
        columns: [ {
            field: 'num',
            align: 'center',
            title: '编号'

        },

            {
                field: 'status',
                align: 'center',

                checkbox:true
            },
            {
                field: 'state',
                align: 'center',
                title: '状态',
                formatter:function(value,row){

                    switch (value){
                        case 'w':
                            return "未开通";
                            break;
                        case 'y':
                            return "在学";
                            break;
                        case 'x':
                            return "休学";
                            break;
                        case 'c':
                            return "超期";
                            break;
                        case 'z':
                            return "滞学";
                            break;
                        case 'q':
                            return "退学";
                            break;
                        case  "j":
                            return "结业";
                            break;
                        case "t":
                            return "临时学员";
                            break;
                        case "e":
                            return "延学";
                        case "h":
                            return "恢复"

                            break;


                    }}
            },

            {
                field: 'username',
                title: '用户名',
                align: 'center',
                formatter:function(value,row){
                    return '<a href="#" >'+value+'</a>'
                }
            },
            {
                field: 'name',
                title: '姓名',
                align: 'center'
            },
            {
                field: 'regEnd',
                align: 'center',
                title: '截止日期'
                ,
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }

            },
            {
                field: 'duration',
                align: 'center',
                title: '开通时长',
                formatter:function(value,row){
                    return Math.round(value/3600/24) +'天';
                }

            },
            {
                field: 'regDate',
                align: 'center',
                title: '注册日期'
                ,
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }

            },
            {
                field: 'regDate',
                align: 'center',
                title: '习题记录'
                ,
                formatter:function(value, row){
                    return '<a class="btn btn-primary btn-xs">习题记录</a>'
                }

            },
            {
                field: 'regDate',
                align: 'center',
                title: '考试记录'
                ,
                formatter:function(value, row){
                    return '<a class="btn btn-primary btn-xs">考试记录</a>'
                }

            }

           ]
    }).on('click-row.bs.table', function (e, row, $element) {

        if($element.context.cellIndex ==3){
            $('#div_baseinfopanel').modal();
            $('#specialpanel').show();

            // if(row.live == "y"){
            //     $("#userboollive").attr("checked","checked");
            // }
            if (row.state != "w") {
                $("#userboollive").prop("checked", "checked");
            }

            $('#rightgroup').select2('val',row.gid)

            $('#rightgroup').attr('disabled',true);

            $("#username").val(row.username);
            $("#realname").val(row.name);

            $("#passwordquestion").val(row.passwordQuestion);
            $("#passwordanswer").val(row.passwordAnswer);

            $('#idnumber').val(row.zjhm);

            $("#gender").select2({
                data:function () {
                    return { results: [{id:1,text:'男'},{id:2,text:'女'}]};
                }

            }).select2("val",row.gender);

            $("#email").val(row.email);

            $("#birthday").val(new Date( parseInt(row.birthday.time.toString().length==10?row.birthday.time+'000':row.birthday.time)).Format('yyyy-MM-dd'));

            $("#phone").val(row.phone);

            $("#cellphone").val(row.cellphone);

            $("#pravince").val(row.province);


            $("#unitnum").val(row.unit);

            $("#address").val(row.addr);
            $("#postnum").val(row.postcode);

            $("#remark").val(row.remark);
            $("#addtime").val(row.addDate);

            for(var i in row.signSpecial.split(',')){
                $('#specialpanel .specialchk').each(function(index, value){
                    if($(this).attr('data-id') == row.signSpecial.split(',')[i]){
                        $(this).attr('checked','checked');
                    }
                })
            }

        }else if($element.context.cellIndex ==8){
            $.cookie('uid',row.id, { expires: 1, path: '/' });
            $.cookie('cate',2, { expires: 1, path: '/' });
            window.open('examrecord.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
        }

        else if($element.context.cellIndex ==9){
            $.cookie('uid',row.id, { expires: 1, path: '/' });
            $.cookie('cate',4, { expires: 1, path: '/' });
            window.open('examrecord.html','newwindow','height='+document.body.clientHeight+',width='+document.body.clientWidth+',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
        }

    }).on('check.bs.table',function (e, row, $element) {

    });
}

function assertapply(){
    if($('#applicationlist').bootstrapTable('getSelections').length ==0){
        G.ui.tips.info('请至少选择一条记录！');
        return;
    }
    $('#restoreprocessaplication').tab('show');
    var data = $('#applicationlist').bootstrapTable('getSelections');
    var applystate = '';
    $.each([{id:'x',text:'休学'},{id:'e',text:'延学'},{id:'h',text:'恢复'}],function( index,item){
        if(data[0].applystate == item.id){
            applystate = item.text;
        }
    });

    var state = '';
    $.each([{id:'w',text:'未开通'},{id:"y",text:"在学"},{id:"x",text:"休学"},{id:"c",text:"超期"},{id:"z",text:"滞学"},{id:"q",text:"退学"},{id:"j",text:"结业"}, {id:"t",text:"临时学员"},{id:"e",text:"延学"},{id:"h",text:"恢复"}],function(index,item){
        if(data[0].state == item.id){
            state = item.text;
        }
    })

    $('#applystate').val(state);
    $('#applyusername').val(data[0].username);
    $('#applyname').val(data[0].name);
    $('#apply').val(applystate);
    $('#applydate').val(new Date( parseInt(data[0].applydate.toString().length==10?data[0].applydate+'000':data[0].applydate)).Format('yyyy-MM-dd') );
    $('#applystartdate').val(new Date( parseInt(data[0].startdate.toString().length==10?data[0].startdate+'000':data[0].startdate)).Format('yyyy-MM-dd') );
    $('#applyenddate').val(new Date( parseInt(data[0].enddate.toString().length==10?data[0].enddate+'000':data[0].enddate)).Format('yyyy-MM-dd'));
    $('#addedinfo').val(data[0].applyresult);

}

function submitapplydeal(){

    var data = $('#applicationlist').bootstrapTable('getSelections');
    if($('#applyresult').select2('val') == null){
        G.ui.tips.info('请选择审核意见！');
        return ;
    }
    var para ='parameter='+JSON.stringify({id:data[0].id,approve:$('#applyresult').select2('val'),username:data[0].username,applystate:data[0].applystate,startdate:data[0].startdate,enddate:data[0].enddate,userid:data[0].userid,addedinfo:$('#addedinfo').val()});

    Application.Util.ajaxConstruct(Application.serverHost + "/student/dealtudentApplyById",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#restoreapply').tab('show');
            initApplyMangeList({approve:$('#auditopinion').select2('val')});
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function deleteapply(){
   var data = $('#applicationlist').bootstrapTable('getSelections');
    if(data.length == 0){
        G.ui.tips.info('请至少选择一条要删除的申请！');
    }
    var para ='parameter='+JSON.stringify({id:data[0].id});

    Application.Util.ajaxConstruct(Application.serverHost + "/student/deleteStudentApplyById",'POST',para,'json',function(data){
        if(data.errcode == 0){
            initApplyMangeList({approve:$('#auditopinion').select2('val')});
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

/***
 * 申请管理
 * @param pid
 */
function initApplyMangeList(pid){


    if(!Application.specialList){
        getSpecialList()
    }

    $("#rightgroup").select2({
        data: function () {
            return { results: Application.rightgroup };
        }
    })


    $('#batchstate').select2({
        data: function () {
            return { results: []};
        },
        placeholder:'状态'
    });

    $('#applicationlist').bootstrapTable('destroy');
    $('#applicationlist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url:Application.serverHost + "/student/getStudentApplyList",
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        sidePagination: "server",
        showColumns: true,
        showRefresh:false,
        showToggle:true,

        singleSelect:true,
        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache:false,
        pageNumber:1,
        method:'POST',
        ajaxOptions:{
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/x-www-form-urlencoded',
                'X-Auth-Token':$.cookie("Token")
            },
            dataType:'json'
        },

        queryParams: function (params) {
            var data =null
            if(typeof pid === 'object'){
                pid['index']= (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter='+JSON.stringify(pid);
            }else {
                data = 'parameter='+JSON.stringify({
                    'index': (params.offset / params.limit) + 1,
                    'pageSize':params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if(data.errcode == 0){
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    tableData.rows.push(
                        {
                            num:i+1,
                            id: data.data[i].id,
                            live:data.data[i].live,
                            gid:data.data[i].gid,
                            username:data.data[i].username,
                            approve:data.data[i].approve,
                            name:data.data[i].name,
                            applystate:data.data[i].applystate,
                            state:data.data[i].state,
                            applydate:data.data[i].applydate,
                            startdate:data.data[i].startdate,
                            enddate:data.data[i].enddate,
                            userid:data.data[i].userid

                        })
                }
                return tableData;
            }else{
                G.ui.tips.info('查询数据出错！'+ data.errmsg);
                return;
            }

        },
        columns: [ {
            field: 'num',
            align: 'center',
            title: '编号'

        },

            {
                field: 'status',
                align: 'center',

                checkbox:true
            },
            {
                field: 'username',
                title: '用户名',
                align: 'center'
            },
            {
                field: 'name',
                title: '姓名',
                align: 'center'
            },
            {
                field: 'state',
                title: '状态',
                align: 'center',
                formatter:function(value,row){

                    switch (value){
                        case 'w':
                            return "未开通";
                            break;
                        case 'y':
                            return "在学";
                            break;
                        case 'x':
                            return "休学";
                            break;
                        case 'c':
                            return "超期";
                            break;
                        case 'z':
                            return "滞学";
                            break;
                        case 'q':
                            return "退学";
                            break;
                        case  "j":
                            return "结业";
                            break;
                        case "t":
                            return "临时学员";
                            break;
                        case "e":
                            return "延学";
                        case "h":
                            return "恢复"

                            break;


                    }
                }
            },
            {
                field: 'applystate',
                title: '申请',
                align: 'center',
                formatter:function(value,row){

                    switch (value){
                        case 'w':
                            return "未开通";
                            break;
                        case 'y':
                            return "在学";
                            break;
                        case 'x':
                            return "休学";
                            break;
                        case 'c':
                            return "超期";
                            break;
                        case 'z':
                            return "滞学";
                            break;
                        case 'q':
                            return "退学";
                            break;
                        case  "j":
                            return "结业";
                            break;
                        case "t":
                            return "临时学员";
                            break;
                        case "e":
                            return "延学";
                        case "h":
                            return "恢复"

                            break;


                    }
                }
            },{
                field: 'startdate',
                title: '开始日期',
                align: 'center'
                ,
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            }
            ,{
                field: 'enddate',
                title: '结束日期',
                align: 'center'
                ,
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            },
            {
                field: 'approve',
                align: 'center',
                title: '审核意见',
                formatter:function(value,row){
                    if(value ==2){
                        return '反对';
                    }else if(value ==1){
                        return '通过';
                    }else if(value==0){
                        return "待审核";
                    }
                }

            },
            {
                field: 'applydate',
                align: 'center',
                title: '申请日期'
                ,
                formatter:function(value,row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }

            }]
    }).on('click-row.bs.table', function (e, row, $element) {

        if($element.context.cellIndex ==3){

        }

    }).on('check.bs.table',function (e, row, $element) {

    });
}

function searchapply(){
    var username = $('#applicationusername').val();
    var application = $('#application').select2('val');
    var applicationstate = $('#applicationstate').select2('val');
    var auditopinion = $('#auditopinion').select2('val');
    var obj = {};
    if(auditopinion!=''){
        obj.approve = auditopinion;
    }
    if(application!=''){
        obj.applystate = application;
    }
    if(applicationstate!=''){
        obj.state = applicationstate
    }
    if(username !=''){
        obj.username = username;
    }
    initApplyMangeList(obj);
}


//结业详细查询
function graduationsearch(){

    var queryobj = {};
    if($('#graduatestate').select2('val') != null&&$('#graduatestate').select2('val')!=undefined &&$('#graduatestate').select2('val') !=''){
        queryobj.graduated = $('#graduatestate').select2('val');
    }
    if($('#graduateusername').val()!=null&&$('#graduateusername').val()!=''){
        queryobj.username = $('#graduateusername').val();
    }
    if($('#graduatename').val()!=null&&$('#graduatename').val()!=''){
        queryobj.name = $('#graduatename').val();
    }
    if($('#graduateunit').val()!=null&&$('#graduateunit').val()!=''){
        queryobj.unit = $('#graduateunit').val();
    }
    if($('#graduationquery .allspecial').select2('val') != null&&$('#graduationquery .allspecial').select2('val')!=''){
        queryobj.pmid = $('#graduationquery .allspecial').select2('val');
    }

    $('input[name="s_username"]').val(queryobj.username);
    $('input[name="s_name"]').val(queryobj.name);
    $('input[name="s_mayor"]').val(queryobj.pmid);
    $('input[name="s_unit"]').val(queryobj.unit);
    $('input[name="s_isgraduate"]').val(queryobj.graduated);
    initGraduationQueryList(queryobj)
}

/***
 * 结业查询
 * @param pid
 */
function initGraduationQueryList(pid) {
    if (!Application.specialList) {
        getSpecialList()
    }

    $('#graduationquerylist').bootstrapTable('destroy');
    $('#graduationquerylist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url: Application.serverHost + "/student/getGraduatedList",
        classes: "table table-hover table-condensed",
        striped: true,
        toolbar: '#rawdata-toolbar',
        pagination: true,
        sidePagination: "server",

        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache: false,
        pageNumber: 1,
        method: 'POST',
        ajaxOptions: {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': $.cookie("Token")
            },
            dataType: 'json'
        },

        queryParams: function (params) {
            var data = null
            if (typeof pid === 'object') {
                pid['index'] = (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter=' + JSON.stringify(pid);
            } else {
                data = 'parameter=' + JSON.stringify({
                    'index': (params.offset / params.limit) + 1,
                    'pageSize': params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if (data.errcode == 0) {
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    tableData.rows.push(
                        {
                            num: i + 1,
                            id: data.data[i].id,
                            username: data.data[i].username,
                            state:data.data[i].state,
                            name: data.data[i].name,
                            is_graduated: data.data[i].is_graduated,
                            graduate_date: data.data[i].graduate_date,
                            title: data.data[i].title
                        })
                }
                return tableData;
            } else {
                G.ui.tips.info('查询数据出错！' + data.errmsg);
                return;
            }

        },
        columns: [
            {
            field: 'num',
            align: 'center',
            title: '编号'
            },
            {
                field: 'username',
                title: '用户名',
                align: 'center'
            },
            {
                field: 'name',
                title: '姓名',
                align: 'center'
            },
            {
                field: 'title',
                title: '课程',
                align: 'center'
            }, {
                field: 'is_graduated',
                title: '结业',
                align: 'center',
                formatter:function(value,row){
                    if(row.state!='j'){
                        return '否'
                    }else if(row.state=='j'){
                        return '是'
                    }
                }
            }
            , {
                field: 'graduate_date',
                title: '结业日期',
                align: 'center',
                formatter:function(value, row){
                    if(value !=0){
                        return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                    }else{
                        return '';
                    }

                }
            }
            ]
    }).on('click-row.bs.table', function (e, row, $element) {

        if ($element.context.cellIndex == 3) {

        }

    }).on('check.bs.table', function (e, row, $element) {

    });
}


//延期管理详细查询
function postponedsearch(){
    var queryobj = {};

    if($('#postponedusername').val()!=null&&$('#postponedusername').val()!=''){
        queryobj.username = $('#postponedusername').val();
    }
    if($('#postponedname').val()!=null&&$('#postponedname').val()!=''){
        queryobj.name = $('#postponedname').val();
    }
    if($('#postponedunit').val()!=null&&$('#postponedunit').val()!=''){
        queryobj.unit = $('#postponedunit').val();
    }
    if($('#postponedstate').select2('val') != null&&$('#postponedstate').select2('val')!=''){
        queryobj.state = $('#postponedstate').select2('val');
    }

    if($('#managepostponed .allspecial').select2('val') != null&&$('#managepostponed .allspecial').select2('val')!=''){
        queryobj.pmid = $('#managepostponed .allspecial').select2('val');
    }

    initManagePostponedList(queryobj);
}
/***
 * 延期管理
 * @param pid
 */
function initManagePostponedList(pid) {
    if (!Application.specialList) {
        getSpecialList()
    }

    $('#managepostponedlist').bootstrapTable('destroy');
    $('#managepostponedlist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url: Application.serverHost + "/student/getDurationList",
        classes: "table table-hover table-condensed",
        striped: true,
        toolbar: '#rawdata-toolbar',
        pagination: true,
        sidePagination: "server",

        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache: false,
        pageNumber: 1,
        method: 'POST',
        ajaxOptions: {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': $.cookie("Token")
            },
            dataType: 'json'
        },

        queryParams: function (params) {
            var data = null
            if (typeof pid === 'object') {
                pid['index'] = (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter=' + JSON.stringify(pid);
            } else {
                data = 'parameter=' + JSON.stringify({

                    'index': (params.offset / params.limit) + 1,
                    'pageSize': params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if (data.errcode == 0) {
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    if(data.data[i].state =='e' ){
                        tableData.rows.push(
                            {
                                num: i + 1,
                                id: data.data[i].id,
                                username: data.data[i].username,
                                name: data.data[i].name,
                                duration: data.data[i].duration,
                                title: data.data[i].title,
                                reg_date: data.data[i].reg_date,
                                extend_duration:data.data[i].extend_duration,
                                pause_duration:data.data[i].pause_duration,
                                state: data.data[i].state,
                                reg_end:data.data[i].reg_end
                            })
                    }

                }
                return tableData;
            } else {
                G.ui.tips.info('查询数据出错！' + data.errmsg);
                return;
            }

        },
        columns: [
            {
                field: 'num',
                align: 'center',
                title: '编号'
            },
            {
                field: 'username',
                title: '用户名',
                align: 'center'
            },
            {
                field: 'name',
                title: '姓名',
                align: 'center'
            },
            {
                field: 'state',
                title: '状态',
                align: 'center'
            ,
            formatter:function(value,row){

        switch (value){
            case 'w':
                return "未开通";
                break;
            case 'y':
                return "在学";
                break;
            case 'x':
                return "休学";
                break;
            case 'c':
                return "超期";
                break;
            case 'z':
                return "滞学";
                break;
            case 'q':
                return "退学";
                break;
            case  "j":
                return "结业";
                break;
            case "t":
                return "临时学员";
                break;
            case "e":
                return "延学";
            case "h":
                return "恢复"

                break;


        }}
            }, {
                field: 'reg_date',
                title: '开通日期',
                align: 'center',
                formatter:function(value, row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            },
            {
                field: '',
                title: '过期天数',
                align: 'center',
                formatter:function(value, row){
                    return Math.round((new Date().getTime()/1000-row["reg_date"] - row["duration"] - row.pause_duration)/24/3600);
                }
            }, {
                field: 'extend_duration',
                title: '到期延长',
                align: 'center',
                formatter:function(value, row){
                    return Math.round(value/24/3600);
                }

            }
            , {
                field: 'reg_end',
                title: '到期时间',
                align: 'center',
                formatter:function(value , row){
                    //return new Date( parseInt((row["reg_date"] + row["duration"] + row['extend_duration']+ row['extend_duration']).toString().length!=10?(row["reg_date"] + row["duration"] + row['extend_duration']+ row['extend_duration']):(row["reg_date"] + row["duration"] + row['extend_duration']+ row['extend_duration'])+'000')).Format('yyyy-MM-dd')
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            }
        ]
    }).on('click-row.bs.table', function (e, row, $element) {

        if ($element.context.cellIndex == 3) {

        }

    }).on('check.bs.table', function (e, row, $element) {

    });
}
function searchExamUser(){
 var obj = {};
    if($('#examusername').val()!=''){
        obj.username = $('#examusername').val();
    }
    if($("#examlesson").val()!=''){
        obj.course = $('#examlesson').select2('val');
    }
    if($("#examchapter").val()!=''){
        obj.chapter = $('#examchapter').select2('val');
    }
    initChapterExamList(obj);
}

function initChapterExamList(pid){

    if(!Application.lessonData){
        getManageCourse();
    }

    $('#chapterexamlist').bootstrapTable('destroy');
    $('#chapterexamlist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,
        url: Application.serverHost + "/exam/getChapterTestList",
        classes: "table table-hover table-condensed",
        striped: true,
        toolbar: '#rawdata-toolbar',
        pagination: true,
        sidePagination: "server",

        pageList: [100, 500, 1000, 2000],
        pageSize: 50,
        cache: false,
        pageNumber: 1,
        method: 'POST',
        ajaxOptions: {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': $.cookie("Token")
            },
            dataType: 'json'
        },

        queryParams: function (params) {
            var data = null
            if (typeof pid === 'object') {
                pid['index'] = (params.offset / params.limit) + 1;
                pid['pageSize'] = params.limit;
                data = 'parameter=' + JSON.stringify(pid);
            } else {
                data = 'parameter=' + JSON.stringify({
                    'index': (params.offset / params.limit) + 1,
                    'pageSize': params.limit
                })
            }
            return data;
        },
        responseHandler: function (data) {
            $("#txt_searchtable").removeAttr('disabled');
            if (data.errcode == 0) {
                var tableData = {};
                tableData.total = data.total;
                tableData.rows = [];
                for (var i = 0, len = data.data.length; i < len; i++) {
                    tableData.rows.push(
                        {
                            num: i + 1,
                            state: data.data[i].state,
                            no: data.data[i].no,
                            name: data.data[i].name,
                            time_used: data.data[i].time_used,
                            score: data.data[i].score,
                            uid: data.data[i].uid,
                            course: data.data[i].course,
                            chapter: data.data[i].chapter,
                            add_date: data.data[i].add_date,
                            username : data.data[i].username,
                            flag:data.data[i].flag

                        })
                }
                return tableData;
            } else {
                G.ui.tips.info('查询数据出错！' + data.errmsg);
                return;
            }

        },
        columns: [
            {
                field: 'num',
                align: 'center',
                title: '序号'
            },
            {
                field: 'flag',
                title: '状态',
                align: 'center'


                ,
                formatter:function(value,row){

                    switch (value){
                        case 'n':
                            return "考试中";
                            break;
                        case 'y':
                            return "已完成";
                            break;


                    }}



            },
            {
                field: 'no',
                title: '编号',
                align: 'center',
                formatter:function(value, row){
                    return '<a href="chapterexam.html" target="_blank">'+value+'<a>'
                }
            },
            {
                field: 'time_used',
                title: '用时',
                align: 'center'
            }
           , {
                field: 'score',
                title: '得分',
                align: 'center'
            },
            {
                field: 'username',
                title: '学员',
                align: 'center'
            }, {
                field: 'course',
                title: '课程',
                align: 'center'

            }
            , {
                field: 'chapter',
                title: '章节',
                align: 'center'
            }
            , {
                field: 'add_date',
                title: '添加时间',
                align: 'center',
                formatter:function(value, row){
                    return new Date( parseInt(value.toString().length==10?value+'000':value)).Format('yyyy-MM-dd')
                }
            }
        ]
    }).on('click-row.bs.table', function (e, row, $element) {

        if ($element.context.cellIndex == 2) {
            $.cookie("no",row.no,{ expires: 1, path: '/' });
            //getChapterExamDetail(row.no);
        }

    }).on('check.bs.table', function (e, row, $element) {

    });

}


function getChapterExamDetail(no){
    var para = 'parameter='+JSON.stringify({'no':no});

    Application.Util.ajaxConstruct(Application.serverHost + "/edu/getChapterTestListById",'POST',para,'json',function(data){
        if(data.errcode == 0){
           //var answerSheet =  genrateAnswerSheet();
            var content = ''
            for(var key in data.data){


                if(data.data[key].answer.split(',').length == 1){
                    content +='<li><div><h3>一、单项选择题（每小题只有一个最恰当的答案。错选、少选、多选，则该题均不得分。）</h3></div></li>'

                    //for (var item in Application.paperdata.single) {
                        var obj = {}
                        obj.answer= data.data[key].answer;
                        obj.point = data.data[key].sub_score;

                        obj.question_type_id=1;
                        content += getReportStringFromXML(1, data.data[key]);

                    //}

                }if(data.data[key].answer.split(',').length > 1){
                    content +='<li><div><h3>二、多项选择题（每题有多个答案正确。错选、少选、多选均不得分））</h3></div></li>';
                    //for (var item in Application.paperdata.multi) {
                        var obj = {}
                        obj.answer= data.data[key].answer;
                        obj.point = data.data[key].sub_score;
                        obj.question_type_id=2;
                        content += getReportStringFromXML(2, data.data[key]);

                    //}

                }


            }

            $('#finalexampaper-body').empty();
            $('#finalexampaper-body').append(content);

        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded');

}


function getReportStringFromXML(type, questionobj) {
    var sb = '';

    switch (type) {
        case 1:
            sb += "<li class=\"question qt-singlechoice\">";
            break;
        case 2:
            sb += "<li class=\"question qt-multiplechoice\">";
            break;
        case 3:
            sb += "<li><div class='casedes-div'><h6>"+questionobj.text+"</h6><div></li>"
            sb += "<li class=\" qt-casequestion\">";
            break;
        case 4:
            sb += "<li class=\"\"><div class='casedes-div'><h6>"+questionobj.text+"</h6><div>";
            break;
        case 5:            sb += "<li class=\"question qt-shortanswer\">";
            break;
        case 6:
            sb += "<li class=\"question qt-essay\">";
            break;
        case 7:
            sb += "<li class=\"question qt-analytical\">";
            break;
        default:
            break;
    }

    switch (type) {
        case 1:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no reportnum\"></span>";
            sb += "<span class=\"question-type\" style=\"display: none;\">"
            sb += "singlechoice</span>";
            sb += "<span class=\"knowledge-point-id\" style=\"display: none;\">" + questionobj.sub_score + "</span>";
            sb += "<span class=\"question-type-id\" style=\"display: none;\">" + questionobj.sub_score + "</span>";
            sb += "<span>[单选题]</span>";
            sb += "<span class=\"question-point-content\">";
            sb += "<span>(</span><span class=\"question-point\">" + questionobj.sub_score + "</span><span>分)</span>";
            sb += "</span>";
            sb += "<span class=\"question-id\" style=\"display:none;\">" + (questionobj.ord-1) + "</span>";

            sb += "</div>";
            sb += "<form class=\"question-body\">";
            sb += "<p class=\"question-body-text\">" + questionobj.sub_title;
            sb += "</p>";
            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"A\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'A' + ": " + questionobj.sub_op1 + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"B\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'B' + ": " + questionobj.sub_op2 + "</span></li></ul>";


            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"C\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'C' + ": " + questionobj.sub_op3 + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"D\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'D' + ": " + questionobj.sub_op4 + "</span></li></ul>";

            sb += "</form>"

            sb +="<div class=\"answer-desc\">";
            sb +="<div class=\"answer-desc-summary\">";
            sb +="<span>正确答案：</span><span id='perfectanswer' style='background:blanchedalmond'>"+questionobj.answer+"</span><br>";
            sb +="<span>你的答案：</span><span id='youranswer' style='background: #ff0000'>"+questionobj.sub_answer+"</span>";
            sb +="</div></div>";
            break;
        case 2:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no reportnum\"></span>";
            sb += "<span class=\"question-type\" style=\"display: none;\">"
            sb += "multiplechoice</span>";
            sb += "<span class=\"knowledge-point-id\" style=\"display: none;\">" + questionobj.sub_score + "</span>";
            sb += "<span class=\"question-type-id\" style=\"display: none;\">" + questionobj.sub_score + "</span>";
            sb += "<span>[多选题]</span>";
            sb += "<span class=\"question-point-content\">";
            sb += "<span>(</span><span class=\"question-point\">" + questionobj.sub_score + "</span><span>分)</span>";
            sb += "</span>";
            sb += "<span class=\"question-id\" style=\"display:none;\">" + (questionobj.ord-1) + "</span>";

            sb += "</div>";
            sb += "<form class=\"question-body\">";
            sb += "<p class=\"question-body-text\">" + questionobj.sub_title;
            sb += "</p>";
            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"A\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'A' + ": " + questionobj.sub_op1 + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"B\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'B' + ": " + questionobj.sub_op2 + "</span></li></ul>";


            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"C\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'C' + ": " + questionobj.sub_op3 + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"D\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'D' + ": " + questionobj.sub_op4 + "</span></li></ul>";

            sb += "</form>"

            sb +="<div class=\"answer-desc\">";
            sb +="<div class=\"answer-desc-summary\">";
            sb +="<span>正确答案：</span><span id='perfectanswer' style='background:blanchedalmond'>"+questionobj.answer+"</span><br>";
            sb +="<span>你的答案：</span><span id='youranswer' style='background: #ff0000'>"+questionobj.sub_answer+"</span>";
            sb +="</div></div>";
            break;
        case 3:


            for(var item in questionobj.caseSubQuestions){

                sb += "<div class=\"question question-title\">";
                sb += "<div class=\"question-title-icon\"></div>"
                sb += "<span class=\"question-no reportnum\"></span>";
                sb += "<span class=\"question-type\" style=\"display: none;\">"
                sb += "casequestion</span>";
                sb += "<span class=\"knowledge-point-id\" style=\"display: none;\"></span>";
                sb += "<span class=\"question-type-id\" style=\"display: none;\"></span>";
                if(questionobj.caseSubQuestions[item].type_id ==1){
                    sb += "<span>[多选题]</span>";
                }else{
                    sb += "<span>[单选题]</span>";
                }

                sb += "<span class=\"question-point-content\">";
                sb += "<span>(</span><span class=\"question-point\">" + questionobj.caseSubQuestions[item].type_id + "</span><span>分)</span>";
                sb += "</span>";
                sb += "<span class=\"question-id\" style=\"display:none;\">" + questionobj.caseSubQuestions[item].case_question_id + "</span>";

                sb += "</div>";
                sb += "<form class=\"question-body\">";
                sb += "<p class=\"question-body-text\">" + questionobj.caseSubQuestions[item].text;
                sb += "</p>";
                sb += "<ul class=\"question-opt-list\">";
                sb += "<li class=\"question-list-item\">";

                if(questionobj.caseSubQuestions[item].type_id ==1){
                    sb += "<input type=\"checkbox\" value=\"A\" name=\"question-checkbox1\" class=\"question-input\">"
                }else{
                    sb += "<input type=\"radio\" value=\"A\" name=\"question-checkbox1\" class=\"question-input\">"
                }
                //sb += "<input type=\"checkbox\" value=\"A\" name=\"question-checkbox1\" class=\"question-input\">"
                sb += "<span class=\"question-li-text\">";
                sb += 'A' + ": " + questionobj.caseSubQuestions[item].a + "</span></li></ul>";

                sb += "<ul class=\"question-opt-list\">";
                sb += "<li class=\"question-list-item\">";

                if(questionobj.caseSubQuestions[item].type_id ==1){
                    sb += "<input type=\"checkbox\" value=\"B\" name=\"question-checkbox1\" class=\"question-input\">"
                }else{
                    sb += "<input type=\"radio\" value=\"B\" name=\"question-checkbox1\" class=\"question-input\">"
                }
                //sb += "<input type=\"checkbox\" value=\"B\" name=\"question-checkbox1\" class=\"question-input\">"
                sb += "<span class=\"question-li-text\">";
                sb += 'B' + ": " + questionobj.caseSubQuestions[item].b + "</span></li></ul>";


                sb += "<ul class=\"question-opt-list\">";
                sb += "<li class=\"question-list-item\">";

                if(questionobj.caseSubQuestions[item].type_id ==1){
                    sb += "<input type=\"checkbox\" value=\"C\" name=\"question-checkbox1\" class=\"question-input\">"
                }else{
                    sb += "<input type=\"radio\" value=\"C\" name=\"question-checkbox1\" class=\"question-input\">"
                }
                //sb += "<input type=\"checkbox\" value=\"C\" name=\"question-checkbox1\" class=\"question-input\">"
                sb += "<span class=\"question-li-text\">";
                sb += 'C' + ": " + questionobj.caseSubQuestions[item].c + "</span></li></ul>";

                sb += "<ul class=\"question-opt-list\">";
                sb += "<li class=\"question-list-item\">";

                if(questionobj.caseSubQuestions[item].type_id ==1){
                    sb += "<input type=\"checkbox\" value=\"D\" name=\"question-checkbox1\" class=\"question-input\">"
                }else{
                    sb += "<input type=\"radio\" value=\"D\" name=\"question-checkbox1\" class=\"question-input\">"
                }
                //sb += "<input type=\"checkbox\" value=\"D\" name=\"question-checkbox1\" class=\"question-input\">"
                sb += "<span class=\"question-li-text\">";
                sb += 'D' + ": " + questionobj.caseSubQuestions[item].d + "</span></li></ul>";

                sb += "</form>"
                sb +="<div class=\"answer-desc\">";
                sb +="<div class=\"answer-desc-summary\">";

                var answers=[];
                for(var key in questionobj.caseSubQuestions[item].answer.split(',')){
                    switch (questionobj.caseSubQuestions[item].answer.split(',')[key]){
                        case '0':
                            answers.push('A');
                            break
                        case '1':
                            answers.push('B');
                            break;
                        case '2':
                            answers.push('C');
                            break;
                        case '3':
                            answers.push('D');
                            break;
                    }
                }


                sb +="<span>正确答案：</span><span id='perfectanswer'style='background:blanchedalmond'>"+answers.join(',')+"</span><br>";
                sb +="<span >你的答案：</span><span id='youranswer' style='background: #ff0000'>"+answersheet[Application.answerorder].answer+"</span>";
                sb +="</div></div>";
                Application.answerorder+=1;
            }
            break;

        case 4:

            for(var item in questionobj.essayQuestions){

                sb += "<div class=\"question-title\">";
                sb += "<div class=\"question-title-icon\"></div>"
                sb += "<span  class=\"question-no reportnum\"></span>";
                sb += "<span class=\"question-type\" style=\"display: none;\">"
                sb +="shortanswer</span>";
                sb +="<span class=\"knowledge-point-id\" style=\"display: none;\">"+questionobj.essayQuestions[item].score+"</span>";
                sb +="<span class=\"question-type-id\" style=\"display: none;\">"+questionobj.essayQuestions[item].score+"</span>";
                sb +="<span>[简答题]</span>";
                sb +="<span class=\"question-point-content\">";
                sb +="<span>(</span><span class=\"question-point\">"+questionobj.essayQuestions[item].score+"</span><span>分)</span>";
                sb +="</span>";
                //sb.append("<span>(</span><span class=\"question-point\">").append(pointStrFormat(questionQueryResult.getQuestionPoint())).append("</span><span>分)</span>");
                //
                sb +="</div>";
                sb +="<form class=\"question-body  \">";
                sb +="<p class=\"question-body-text\">"+questionobj.essayQuestions[item].text;

                sb +="</p><div class='question qt-shortanswer'>";
                sb +="<span class=\"question-id\" style=\"display:none;\">"+(questionobj.ord-1) +"</span>";
                sb +="<textarea class=\"question-textarea \">"+questionobj.essayQuestions[item].answer+"</textarea></div>";
                sb +="</form>";

                //sb +="<span>正确答案：</span><span id='perfectanswer'>"+questionobj.essayQuestions[item].answers+"</span><br>";
                sb +="<span>你的答案：</span><span id='youranswer' style='background: #ff0000'>"+answersheet[ Application.answerorder].answer+"</span>";
                sb +="</div></div>";
                Application.answerorder+=1
            }

            break;
    }


    sb += "</li>";
    return sb;
}



//模拟考试，正式考试选择题

function getChoiceQuestionsStringHtml(type, questionobj) {
    var sb = '';

    switch (type) {
        case 1:
            sb += "<li class=\"question qt-singlechoice\">";
            break;
        case 2:
            sb += "<li class=\"question qt-multiplechoice\">";
            break;

    }


    switch (type) {
        case 1:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no\"></span>";
            sb += "<span class=\"question-type\" style=\"display: none;\">"
            sb += "singlechoice</span>";
            sb += "<span class=\"knowledge-point-id\" style=\"display: none;\">" + questionobj.order_no + "</span>";
            sb += "<span class=\"question-type-id\" style=\"display: none;\">" + questionobj.suite_id + "</span>";
            sb += "<span>[单选题]</span>";
            sb += "<span class=\"question-point-content\">";
            sb += "<span>(</span><span class=\"question-point\">" + 1 + "</span><span>分)</span>";
            sb += "</span>";
            sb += "<span class=\"question-id\" style=\"display:none;\">" + (questionobj.order_no-1) + "</span>";

            sb += "</div>";
            sb += "<form class=\"question-body\">";
            sb += "<p class=\"question-body-text\">" + questionobj.text;
            sb += "</p>";
            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"A\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'A' + ": " + questionobj.a + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"B\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'B' + ": " + questionobj.b + "</span></li></ul>";


            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"C\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'C' + ": " + questionobj.c + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"D\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'D' + ": " + questionobj.d + "</span></li></ul>";

            sb += "</form>"

            break;
        case 2:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no\"></span>";
            sb += "<span class=\"question-type\" style=\"display: none;\">"
            sb += "multiplechoice</span>";
            sb += "<span class=\"knowledge-point-id\" style=\"display: none;\">" + questionobj.order_no + "</span>";
            sb += "<span class=\"question-type-id\" style=\"display: none;\">" + questionobj.suite_id + "</span>";
            sb += "<span>[多选题]</span>";
            sb += "<span class=\"question-point-content\">";
            sb += "<span>(</span><span class=\"question-point\">" + 1 + "</span><span>分)</span>";
            sb += "</span>";
            sb += "<span class=\"question-id\" style=\"display:none;\">" + (questionobj.order_no-1) + "</span>";

            sb += "</div>";
            sb += "<form class=\"question-body\">";
            sb += "<p class=\"question-body-text\">" + questionobj.text;
            sb += "</p>";
            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"A\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'A' + ": " + questionobj.a + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"B\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'B' + ": " + questionobj.b + "</span></li></ul>";


            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"C\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'C' + ": " + questionobj.c + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"D\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'D' + ": " + questionobj.d + "</span></li></ul>";

            sb += "</form>"
            break;

    }
    sb += "</li>";
    return sb;
}


function getChoiceQuestionsStringHtmlReport(type, questionobj,answersheet) {
    var sb = '';

    switch (type) {
        case 1:
            sb += "<li class=\"question qt-singlechoice\">";
            break;
        case 2:
            sb += "<li class=\"question qt-multiplechoice\">";
            break;

    }


    switch (type) {
        case 1:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no reportnum\"></span>";
            sb += "<span class=\"question-type\" style=\"display: none;\">"
            sb += "singlechoice</span>";
            sb += "<span class=\"knowledge-point-id\" style=\"display: none;\">" + questionobj.order_no + "</span>";
            sb += "<span class=\"question-type-id\" style=\"display: none;\">" + questionobj.suite_id + "</span>";
            sb += "<span>[单选题]</span>";
            sb += "<span class=\"question-point-content\">";
            sb += "<span>(</span><span class=\"question-point\">" + 1 + "</span><span>分)</span>";
            sb += "</span>";
            sb += "<span class=\"question-id\" style=\"display:none;\">" + (questionobj.order_no-1) + "</span>";

            sb += "</div>";
            sb += "<form class=\"question-body\">";
            sb += "<p class=\"question-body-text\">" + questionobj.text;
            sb += "</p>";
            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"A\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'A' + ": " + questionobj.a + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"B\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'B' + ": " + questionobj.b + "</span></li></ul>";


            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"C\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'C' + ": " + questionobj.c + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"radio\" value=\"D\" name=\"question-radio1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'D' + ": " + questionobj.d + "</span></li></ul>";

            sb += "</form>"

            break;
        case 2:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no reportnum\"></span>";
            sb += "<span class=\"question-type\" style=\"display: none;\">"
            sb += "multiplechoice</span>";
            sb += "<span class=\"knowledge-point-id\" style=\"display: none;\">" + questionobj.order_no + "</span>";
            sb += "<span class=\"question-type-id\" style=\"display: none;\">" + questionobj.suite_id + "</span>";
            sb += "<span>[多选题]</span>";
            sb += "<span class=\"question-point-content\">";
            sb += "<span>(</span><span class=\"question-point\">" + 1 + "</span><span>分)</span>";
            sb += "</span>";
            sb += "<span class=\"question-id\" style=\"display:none;\">" + (questionobj.order_no-1) + "</span>";

            sb += "</div>";
            sb += "<form class=\"question-body\">";
            sb += "<p class=\"question-body-text\">" + questionobj.text;
            sb += "</p>";
            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"A\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'A' + ": " + questionobj.a + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"B\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'B' + ": " + questionobj.b + "</span></li></ul>";


            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"C\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'C' + ": " + questionobj.c + "</span></li></ul>";

            sb += "<ul class=\"question-opt-list\">";
            sb += "<li class=\"question-list-item\">";

            sb += "<input type=\"checkbox\" value=\"D\" name=\"question-checkbox1\" class=\"question-input\">"
            sb += "<span class=\"question-li-text\">";
            sb += 'D' + ": " + questionobj.d + "</span></li></ul>";

            sb += "</form>"
            break;

    }
    sb +="<div class=\"answer-desc\">";
    sb +="<div class=\"answer-desc-summary\">";


    var answers=[];
    for(var key in questionobj.answer.split(',')){
        switch (questionobj.answer.split(',')[key]){
            case '0':
                answers.push('A');
                break
            case '1':
                answers.push('B');
                break;
            case '2':
                answers.push('C');
                break;
            case '3':
                answers.push('D');
                break;
        }
    }

    sb +="<span>正确答案：</span><span id='perfectanswer'>"+answers.join(',')+"</span><br>";
    sb +="<span>你的答案：</span><span id='youranswer'>"+questionobj.sub_answer+"</span>";
    sb +="</div></div>";
    return sb;
}







function getExamTypeList(){
    if (!Application.specialList) {
        getSpecialList()
    }
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getGraduationExamList",'POST',{},'json',function(data){
        if(data.errcode == 0){

            $('#examtypelist').bootstrapTable('load',data.data);
        }else{
            G.ui.tips.err('查询失败！！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！');
    },'application/x-www-form-urlencoded');
}

function initExamTypeList(){
    $('#examtypelist').bootstrapTable({
        //height: (document.documentElement.clientHeight || document.body.clientHeight) - 200,

        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',
        pagination:true,
        showColumns: true,
        showRefresh:false,
        showToggle:true,


        columns: [
            {
                field: 'name',
                align: 'center',
                title: '结业考试类型'

            },
            {
                field:'duration',
                align:'center',
                title:'时长(分钟)'

            },
            {
                field: 'specialName',
                title: '专业',
                align: 'center'


            },
            {
                field: 'enabled',
                title: '有效',
                align: 'center',
                formatter:function(value,row){
                    if(row.enabled == 1) {
                        return '是'
                    }else{
                        return '否'
                    }
                }


            },
            {
                field: 'operate1',
                title: '',
                align: 'center',
                formatter:function(value,row){
                    if(row.enabled == 1){
                        return '<a data-value="'+row.id+'|'+0+'" onclick="updateGraduationExamEnabledById(event)" class="btn btn-primary btn-xs">disable</a>'
                    }else{
                        return '<a data-value="'+row.id+'|'+1+'" onclick="updateGraduationExamEnabledById(event)" class="btn btn-primary btn-xs">enable</a>'
                    }
                }

            },
            //{
            //    field: '',
            //    align: 'center',
            //    title: '详情'
            //
            //},
            {
                field: 'operate2',
                title: '',
                align: 'center',
                formatter: function (value, row) {
                    return '<a href="#paperseditor" onclick="getExamManagementList('+row.id+')" data-toggle="tab" class="btn btn-primary btn-xs">管理试卷</a>'
                }

            }
        ]
    });
}


function updateGraduationExamEnabledById(e){



    var datavalue = $(e.target).attr('data-value');
    var id = datavalue.split('|')[0],enable =  datavalue.split('|')[1];
    var para = 'parameter='+JSON.stringify({id:id,enabled:enable});

    Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateGraduationExamEnabledById",'POST',para,'json',function(data){
        if(data.errcode == 0){

            getExamTypeList();
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded');
}

function getExamManagementList(id){
    Application.currenteditorpaperid = id;
    var para = 'parameter='+JSON.stringify({examTypesId:id});

    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getExamStaticByTestTypeId",'POST',para,'json',function(data){
        if(data.errcode == 0){

            Application.questionsInfo = data.data;
            for(var item in data.data){
                if(data.data[item].type_no ==1){
                    $('#choicenum1').val(data.data[item].count_no);
                }
                if(data.data[item].type_no ==2){
                    $('#casenum1').val(data.data[item].count_no);
                }
                if(data.data[item].type_no ==3){
                    //$('#casenum1').val(data.data[item].count_no);
                }
            }

            Application.Util.ajaxConstruct(Application.serverHost + "/exam/getExamManagementList",'POST',para,'json',function(data){
                if(data.errcode == 0){

                    $('#paperslist').bootstrapTable('load',data.data);
                }else{
                    G.ui.tips.err(data.errmsg);
                }

            },function(data){
                G.ui.tips.err('查询失败！！')
            },'application/x-www-form-urlencoded');

        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded');



}



function initCoursePapersList(){
    $('#paperslist').bootstrapTable({
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',

        columns: [
            {
                field: 'name',
                align: 'center',
                title: '试卷名称'

            },
            {
                field: '',
                align: 'center',
                title: '',
                formatter:function(value,row){
                    var id = row.id;

                    return '<a class="btn btn-primary btn-xs" href="#choicePanel" onclick="getChoiceQuestionsList('+id+')" data-toggle="tab">选择题</a>&nbsp;&nbsp;&nbsp;&nbsp<a href="#casePanel" data-toggle="tab" onclick="getCaseQuestionsList('+id+')" class="btn btn-primary btn-xs">案例分析题</a>&nbsp;&nbsp;&nbsp;&nbsp<a onclick="getEssayQuestionsList('+id+')" href="#caseQAPanel" data-toggle="tab" class="btn btn-primary btn-xs">问答题</a>'

                }

            }
            ,
            {
                field:'enabled',
                align:'center',
               formatter:function(value,row){
                   if(value ==1){
                       return '<a data-value=0-'+row.id+'-'+row.is_real+'-'+row.is_mock+' onclick="updateExamEnableManagementById(event)" class="btn btn-primary btn-xs">使无效</a>'
                   }else{
                       return '<a data-value=1-'+row.id+'-'+row.is_real+'-'+row.is_mock+' onclick="updateExamEnableManagementById(event)" class="btn btn-primary btn-xs">使有效</a>'
                   }
               }

            },
            {
                field: 'is_real',

                align: 'center',
                formatter:function(value, row){
                    if(row.is_real == 0&&row.is_mock==0){
                        return '模拟考试试卷&nbsp;&nbsp<a data-value=1-'+row.id+' onclick="updateExamMockManagementById(event)" class="btn btn-primary btn-xs">设为结业考试题</a>&nbsp;&nbsp<a data-value=0-'+row.id+' onclick="updateExamMockManagementById(event)" class="btn btn-primary btn-xs">设为模拟考试题</a>'
                    }
                    else if(value==1){
                        return '结业考试试卷&nbsp;&nbsp<a data-value=0-'+row.id+' onclick="updateExamMockManagementById(event)" class="btn btn-primary btn-xs">设为模拟考试题</a>'

                    }else{
                        return '模拟考试试卷&nbsp;&nbsp<a data-value=1-'+row.id+' onclick="updateExamMockManagementById(event)" class="btn btn-primary btn-xs">设为结业考试题</a>'

                    }
                }

            },

            {
                field: 'operate2',
                title: '',
                align: 'center',
                formatter: function (value, row) {
                    return '<a href="#" data-toggle="tab" onclick="deleteSuiteByid('+row.id+')" class="btn btn-primary btn-xs">删除试卷</a>'
                }

            }
        ]
    });
}

function deleteSuiteByid(id){
    var para = 'parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/deleteSuiteById",'POST',para,'json',function(data){
        if(data.errcode == 0){
            getExamManagementList(Application.currenteditorpaperid);
            G.ui.tips.suc('删除成功！')
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('删除失败！！')
    },'application/x-www-form-urlencoded')
}


function updateExamEnableManagementById(e){
    var datavalue = $(e.target).attr('data-value');
    var para = 'parameter='+JSON.stringify({id:datavalue.split('-')[1],enabled:datavalue.split('-')[0],is_real:datavalue.split('-')[2],is_mock:datavalue.split('-')[3]});
    updateExamManagementById(para)
}

function updateExamMockManagementById(e){
    var datavalue = $(e.target).attr('data-value');
    var para = 'parameter='+JSON.stringify({id:datavalue.split('-')[1],is_real:datavalue.split('-')[0],is_mock:datavalue.split('-')[0]==0?1:0});
    updateExamManagementById(para)
}

function updateExamManagementById(para){

    Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateExamManagementById",'POST',para,'json',function(data){
        if(data.errcode == 0){

            getExamManagementList(Application.currenteditorpaperid);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function updateExamManagementById(para){

    Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateExamManagementById",'POST',para,'json',function(data){
        if(data.errcode == 0){

            getExamManagementList(Application.currenteditorpaperid);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function addexampapers(){
    if($('#newpapersname').val()==''){
        G.ui.tips.info('请输入试卷名称！');
        return;
    }
    var para ='parameter='+JSON.stringify({name:$('#newpapersname').val(),test_type_id:Application.currenteditorpaperid,enable:0,is_real:0,is_mock:0});

    Application.Util.ajaxConstruct(Application.serverHost + "/exam/createExamByTestTypeId",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#newpapersname').val('');
            getExamManagementList(Application.currenteditorpaperid);
        }else{
            G.ui.tips.err(data.errmsg);
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

//关闭对话框
function closeQuestionModal() {
    $('#choicequestionseditor').modal('toggle');
}

function savaChoiceQuestion(){

    switch (Application.suitetype){
        case 'choice':
            if(Application.choiceRow == null){
                var choiceobj = {};
                choiceobj.text = $('#questiontitle').val();
                choiceobj.type_no = $('#choicequestionstype').select2('val');

                choiceobj.a = $('#choicequestionsanswerA').val();
                choiceobj.b =$('#choicequestionsanswerB').val();
                choiceobj.c =$('#choicequestionsanswerC').val();
                choiceobj.d =$('#choicequestionsanswerD').val();

                if($('#choicequestionstype').select2('val') ==0){
                    $('.radiooptopns').each(function(index, item){

                        if($(this).prop("checked")==true){
                            choiceobj.answer = index;
                        }

                    })
                    choiceobj.type_no =0;
                }else if($('#choicequestionstype').select2('val') == 1){
                    var answerarr=[]
                    $('.checkptopns').each(function(index, item){
                        if($(this).prop("checked") == true){
                            answerarr.push(index);
                        }
                    });
                    choiceobj.type_no =1;
                    choiceobj.answer = answerarr.join(",");
                }
                choiceobj.suite_id = Application.selectSuitPaperId;
                choiceobj.order_no =  $('#choicequestionslist').bootstrapTable('getData').length+1;
                var para ='parameter='+JSON.stringify(choiceobj);
                Application.Util.ajaxConstruct(Application.serverHost + "/exam/InsertChoiceQuestion",'POST',para,'json',function(data){
                    if(data.errcode == 0){

                        getChoiceQuestionsList(Application.selectSuitPaperId);
                        $('#choicequestionseditor').modal('toggle');
                        $('#questiontitle').val('')
                        $('#choicequestionsanswerA').val('');
                        $('#choicequestionsanswerB').val('');
                        $('#choicequestionsanswerC').val('');
                        $('#choicequestionsanswerD').val('');
                        $('.radiooptopns').each(function(index, item){

                            if($(this).prop("checked")==true){
                                $(this).prop("checked",false);
                            }

                        })
                        $('.checkptopns').each(function(index, item){
                            if($(this).prop("checked") == true){
                                $(this).prop("checked",false);
                            }
                        });
                        G.ui.tips.suc('保存成功！')
                    }else{
                        G.ui.tips.err('保存失败！');
                    }

                },function(data){
                    G.ui.tips.err('保存失败！！')
                },'application/x-www-form-urlencoded')
            }else{
                Application.choiceRow.text = $('#questiontitle').val();
                Application.choiceRow.type_no = $('#choicequestionstype').select2('val');

                Application.choiceRow.a = $('#choicequestionsanswerA').val();
                Application.choiceRow.b =$('#choicequestionsanswerB').val();
                Application.choiceRow.c =$('#choicequestionsanswerC').val();
                Application.choiceRow.d =$('#choicequestionsanswerD').val();

                if($('#choicequestionstype').select2('val') ==0){
                    $('.radiooptopns').each(function(index, item){

                        if($(this).prop("checked")==true){
                            Application.choiceRow.answer = index;
                        }

                    })

                }else if($('#choicequestionstype').select2('val') == 1){
                    var answerarr=[]
                    $('.checkptopns').each(function(index, item){
                        for(var k = 0,l=row.answer.split(',').length;k<l;k++){

                            if($(this).prop("checked") == true){
                                answerarr.push(index);
                            }
                        }

                    });
                    Application.choiceRow.answer = answerarr.join(",");
                }
                var para ='parameter='+JSON.stringify(Application.choiceRow);
                Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateChoiceQuestion",'POST',para,'json',function(data){
                    if(data.errcode == 0){
                        Application.choiceRow = null;
                        getChoiceQuestionsList(Application.selectSuitPaperId);
                        $('#choicequestionseditor').modal('toggle');
                        G.ui.tips.suc('更新成功！')
                    }else{
                        G.ui.tips.err('更新失败！');
                    }

                },function(data){
                    G.ui.tips.err('更新失败！！')
                },'application/x-www-form-urlencoded')
            }


            break;
        case 'case':



            if(Application.choiceRow == null){
                var choiceobj = {};
                choiceobj.text = $('#questiontitle').val();
                choiceobj.type_id = $('#choicequestionstype').select2('val');

                choiceobj.a = $('#choicequestionsanswerA').val();
                choiceobj.b =$('#choicequestionsanswerB').val();
                choiceobj.c =$('#choicequestionsanswerC').val();
                choiceobj.d =$('#choicequestionsanswerD').val();

                if($('#choicequestionstype').select2('val') ==0){
                    $('.radiooptopns').each(function(index, item){

                        if($(this).prop("checked")==true){
                            choiceobj.answer = index;
                        }

                    })
                    choiceobj.type_id =0;
                }else if($('#choicequestionstype').select2('val') == 1){
                    var answerarr=[]
                    $('.checkptopns').each(function(index, item){
                        if($(this).prop("checked") == true){
                            answerarr.push(index);
                        }
                    });
                    choiceobj.type_id =1;
                    choiceobj.answer = answerarr.join(",");
                }
                choiceobj.case_question_id = Application.case_question_id;
                choiceobj.idx =  $('#casesubquestionslist').bootstrapTable('getData').length+1;
                var para ='parameter='+JSON.stringify(choiceobj);
                Application.Util.ajaxConstruct(Application.serverHost + "/exam/insertSubChoiceQuestion",'POST',para,'json',function(data){
                    if(data.errcode == 0){

                        getSubCaseQuestionList(Application.case_question_id);
                        $('#choicequestionseditor').modal('toggle');
                        $('#questiontitle').val('')
                        $('#choicequestionsanswerA').val('');
                        $('#choicequestionsanswerB').val('');
                        $('#choicequestionsanswerC').val('');
                        $('#choicequestionsanswerD').val('');
                        $('.radiooptopns').each(function(index, item){

                            if($(this).prop("checked")==true){
                                $(this).prop("checked",false);
                            }

                        })
                        $('.checkptopns').each(function(index, item){
                            if($(this).prop("checked") == true){
                                $(this).prop("checked",false);
                            }
                        });
                        G.ui.tips.suc('保存成功！')
                    }else{
                        G.ui.tips.err('保存失败！');
                    }

                },function(data){
                    G.ui.tips.err('保存失败！！')
                },'application/x-www-form-urlencoded')
            }else{
                Application.choiceRow.text = $('#questiontitle').val();
                Application.choiceRow.type_id = $('#choicequestionstype').select2('val');

                Application.choiceRow.a = $('#choicequestionsanswerA').val();
                Application.choiceRow.b =$('#choicequestionsanswerB').val();
                Application.choiceRow.c =$('#choicequestionsanswerC').val();
                Application.choiceRow.d =$('#choicequestionsanswerD').val();

                if($('#choicequestionstype').select2('val') ==0){
                    $('.radiooptopns').each(function(index, item){

                        if($(this).prop("checked")==true){
                            Application.choiceRow.answer = index;
                        }

                    })

                }else if($('#choicequestionstype').select2('val') == 1){
                    var answerarr=[]
                    $('.checkptopns').each(function(index, item){

                            if($(this).prop("checked") == true){
                                answerarr.push(index);
                            }


                    });
                    Application.choiceRow.answer = answerarr.join(",");
                }
                var para ='parameter='+JSON.stringify(Application.choiceRow);
                Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateSubCaseQuestion",'POST',para,'json',function(data){
                    if(data.errcode == 0){
                        Application.choiceRow = null;
                        getSubCaseQuestionList(Application.case_question_id);
                        $('#choicequestionseditor').modal('toggle');
                        $('#choicequestionseditor').modal('toggle');
                        $('#questiontitle').val('')
                        $('#choicequestionsanswerA').val('');
                        $('#choicequestionsanswerB').val('');
                        $('#choicequestionsanswerC').val('');
                        $('#choicequestionsanswerD').val('');
                        $('.radiooptopns').each(function(index, item){

                            if($(this).prop("checked")==true){
                                $(this).prop("checked",false);
                            }

                        })
                        $('.checkptopns').each(function(index, item){
                            if($(this).prop("checked") == true){
                                $(this).prop("checked",false);
                            }
                        });
                        G.ui.tips.suc('更新成功！')
                    }else{
                        G.ui.tips.err('更新失败！');
                    }

                },function(data){
                    G.ui.tips.err('更新失败！！')
                },'application/x-www-form-urlencoded')
            }


            break
    }



}

function initSelectQuestionsList(){
    $('#choicequestionslist').bootstrapTable({
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',

        columns: [
            {
                field: 'num',
                align: 'center',
                title: '题号'

            },
            {
                field: 'text',
                align: 'left',
                title: '题干'

            },

            {
                field: 'is_real',
                align: 'center',
                title:'操作',
                width:150,
                formatter:function(value, row){
                    return '<a class="btn btn-primary btn-xs" onclick="editChoiceQuestions('+row.id+')">编辑</a>&nbsp;&nbsp<a onclick="deleteChoiceQuestion('+row.id+')" class="btn btn-primary btn-xs">删除</a>'
                }

            }
        ]
    });
}
function deleteChoiceQuestion(id){
    var para ='parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/deleteChoiceQuestionsById",'POST',para,'json',function(data){
        if(data.errcode == 0){
            getChoiceQuestionsList(Application.selectSuitPaperId);
            G.ui.tips.suc('删除成功！')
        }else{
            G.ui.tips.err('删除失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}
function editChoiceQuestions(id){
    var data = $('#choicequestionslist').bootstrapTable('getData');
    var row = null;

    for(var i in data){
        if(id == data[i].id){
            row = data[i];
        }
    }
    Application.choiceRow = row;
    if(row.type_no == 1){
        $('.radiooptopns').hide();
        $('.checkptopns').show()
    }else{
        $('.checkptopns').hide()
        $('.radiooptopns').show();
    }

    if(row.type_no == 0){
        $('.radiooptopns').each(function(index, item){
            if(row.answer == index){
                $(this).prop("checked","checked");
            }
        })
    }
    $('.checkptopns').each(function(index, item){
        $(this).prop("checked",false);
    });


    if(row.type_no == 1){
        $('.checkptopns').each(function(index, item){
            for(var k = 0,l=row.answer.split(',').length;k<l;k++){
                if(row.answer.split(',')[k] == index){
                    $(this).prop("checked","checked");
                }

            }

        })
    }
    $('#choicequestionseditor').modal('toggle');
    $('#questiontitle').val(row.text);
    $('#choicequestionstype').select2('val',row.type_no);

    $('#choicequestionsanswerA').val(row.a);
    $('#choicequestionsanswerB').val(row.b);
    $('#choicequestionsanswerC').val(row.c);
    $('#choicequestionsanswerD').val(row.d);
}


function initCaseQuestionsList(){
    $('#casequestionslist').bootstrapTable({
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',

        columns: [
            {
                field: 'num',
                align: 'center',
                title: '题号'

            },
            {
                field: 'text',
                align: 'left',
                title: '题干'

            },

            {
                field: 'is_real',
                align: 'center',
                title:'操作',
                formatter:function(value, row){
                    var id = row.id;
                    return '<a href="#casequestionmanagepanel" data-toggle = "tab" class="btn btn-primary btn-xs" onclick="editCaseQuestions('+id+')">编辑</a>&nbsp;&nbsp<a data-num="'+id+'" onclick="deleteCaseQuestion(event)" class="btn btn-primary btn-xs">删除</a>'
                }

            }
        ]
    }).on('click-row.bs.table', function (e, row, $element) {
        if($element.context.cellIndex ==2){
            $('#casetext').text(row.text);
            getSubCaseQuestionList(row.id);
            Application.case_question_id = row.id;
            Application.case_question_row = row;

        }


    });
}


function savecasesubquestiontext(){
    Application.case_question_row.text = $('#casetext').val();
    var para = 'parameter='+JSON.stringify(Application.case_question_row);
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateCaseQuestion",'POST',para,'json',function(data){
        if(data.errcode == 0){
            //for(var i= 0,len=data.data.length; i<len;i++){
            //    data.data[i].num = i+1;
            //}
            //$('#casesubquestionslist').bootstrapTable('load',data.data);
            getCaseQuestionsList(Application.selectSuitPaperId);
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')


}


function getSubCaseQuestionList(id){
    var para = 'parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getSubCaseQuestions",'POST',para,'json',function(data){
        if(data.errcode == 0){
            for(var i= 0,len=data.data.length; i<len;i++){
                data.data[i].num = i+1;
            }
            $('#casesubquestionslist').bootstrapTable('load',data.data);
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}
function initCaseSubQuestionsList(){
    $('#casesubquestionslist').bootstrapTable({
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',

        columns: [
            {
                field: 'num',
                align: 'center',
                title: '题号'

            },
            {
                field: 'text',
                align: 'left',
                title: '题干'

            },

            {
                field: 'is_real',
                align: 'center',
                title:'操作',
                formatter:function(value, row){

                    return '<a href="#casequestionmanagepanel" data-toggle = "tab" class="btn btn-primary btn-xs">编辑</a>&nbsp;&nbsp<a data-num="'+row.num+'" onclick="deleteSubCaseQuestion(event)" class="btn btn-primary btn-xs">删除</a>'
                }

            }
        ]
    }).on('click-row.bs.table', function (e, row, $element) {
        if($element.context.cellIndex ==2){

            Application.choiceRow = row;
            if(row.type_id == 1){
                $('.radiooptopns').hide();
                $('.checkptopns').show()
            }else{
                $('.checkptopns').hide()
                $('.radiooptopns').show();
            }

            if(row.type_id == 0){
                $('.radiooptopns').each(function(index, item){
                    if(row.answer == index){
                        $(this).prop("checked","checked");
                    }
                })
            }
            $('.checkptopns').each(function(index, item){
                $(this).prop("checked",false);
            });


            if(row.type_id == 1){
                $('.checkptopns').each(function(index, item){
                    for(var k = 0,l=row.answer.split(',').length;k<l;k++){
                        if(row.answer.split(',')[k] == index){
                            $(this).prop("checked","checked");
                        }

                    }

                })
            }
            $('#choicequestionseditor').modal('toggle');
            $('#questiontitle').val(row.text);
            $('#choicequestionstype').select2('val',row.type_id);

            $('#choicequestionsanswerA').val(row.a);
            $('#choicequestionsanswerB').val(row.b);
            $('#choicequestionsanswerC').val(row.c);
            $('#choicequestionsanswerD').val(row.d);


        }


    });
}

//关闭对话框
function closeCaseQuestionModal() {
    $('#casequestionseditor').modal('toggle');
}

/***
 * 增加案例分析选择题
 */
function editCaseQuestions(id){

}

/***
 * 删除案例分析
 */
function deleteSubCaseQuestion(e){
    e.stopPropagation();
    var num = $(e.currentTarget).attr('data-num');
    var data =  $('#casesubquestionslist').bootstrapTable("getData");
    var para = 'parameter='+JSON.stringify(data[num-1]);
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/deleteSubCaseQuestionByidxAndCaseQuestionId",'POST',para,'json',function(data){
        if(data.errcode == 0){
            for(var i= 0,len=data.data.length; i<len;i++){
                data.data[i].num = i+1;
            }
            getSubCaseQuestionList(Application.case_question_id);
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function deleteCaseQuestion (e){
    e.stopPropagation();
    var id = $(e.currentTarget).attr('data-num');
    var para = 'parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/deleteCaseQuestion",'POST',para,'json',function(data){
        if(data.errcode == 0){
            //for(var i= 0,len=data.data.length; i<len;i++){
            //    data.data[i].num = i+1;
            //}
            //getSubCaseQuestionList(Application.case_question_id);
            getCaseQuestionsList(Application.selectSuitPaperId);
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function initQAlist(){
    $('#QAlist').bootstrapTable({
        classes:"table table-hover table-condensed",
        striped:true,
        toolbar:'#rawdata-toolbar',

        columns: [
            {
                field: 'num',
                align: 'center',
                title: '题号'

            },
            {
                field: 'text',
                align: 'left',
                title: '题干'

            },

            {
                field: 'is_real',
                align: 'center',
                title:'操作',
                formatter:function(value, row){
                    return '<a href="#caseQAEditorPanel" data-toggle="tab" class="btn btn-primary btn-xs" onclick="editEssayQuestions()">编辑</a>&nbsp;&nbsp<a data-id="'+row.id+'" onclick="deleteEssayQuestion(event)" class="btn btn-primary btn-xs">删除</a>'
                }

            }
        ]
    }).on('click-row.bs.table', function (e, row, $element) {
        if($element.context.cellIndex ==2){

            Application.essayquestionRow = row;
            $('#essayeditortextarea').val(row.text);
            $('#essayanswertextarea').val(row.answer);
            $('#esssyscore').val(row.score);

        }


    });;
}


function submitPassword(){
    var pw1 = document.getElementById("newPassword").value;
    var pw2 = document.getElementById("passwordAgain").value;

    if(pw1.length<6 || pw2.length < 6){
        G.ui.tips.err('密码长度必须大于6位！')
        return;
    }
    if(pw1 != pw2){
        G.ui.tips.err('两次输入密码不一致！')
        return;
    }
    Application.user.password =document.getElementById("newPassword").value;
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
//关闭修改密码对话框
function closePasswordModal() {
    $('#passwordmodal').modal('toggle');

    $('#updatePwd_form input[type = "password"]').val('');
}
//关闭修改密码对话框
function closelearninfoModal() {
    $('#learninfomodal').modal('toggle');

}

function closechapterexamModal() {
    $('#chapterexamdetail').modal('toggle');

}
function closeexportStundentModal(){
    $('#exportStundentFields').modal('toggle');
}
function closeexportExamModal(){
    $('#exportStundentExam').modal('toggle');
}

function modifychapertestModal() {
    $('#modifychapertest').modal('toggle');

    //$('#updatePwd_form input[type = "password"]').val('');
}
function saveTestType(){
    var para = {};
    if($('#examtype').val()!=null){
        para.name = $('#examtype').val();
    }
    if($('#examduration').val()!=null){
        para.duration = $('#examduration').val();
    }
    if($('#examspecial').select2('val')!=null){
        para.major_id = $('#examspecial').select2('val');
    }
    if($('#choicenum').val()!=null){
        para.choice_number = $('#choicenum').val();
    }
    if($('#choiceratio').val()!=null){
        para.choice_ratio = $('#choiceratio').val();
    }

    if($('#casenumber').val()!=null){
        para.case_number = $('#casenumber').val();
    }
    if($('#caseratio').val()!=null){
        para.case_ratio = $('#caseratio').val();
    }

    if($('#eassynumber').val()!=null){
        para.essay_number = $('#eassynumber').val();
    }
    if($('#eassyratio').val()!=null){
        para.essay_ratio = $('#eassyratio').val();
    }
    //var examtype =


    var para ='parameter='+JSON.stringify(para);
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/createTestType",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#restoregraduateexam').tab('show');
            getExamTypeList();
            G.ui.tips.suc('修改成功！')
        }else{
            G.ui.tips.err('修改失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function getChoiceQuestionsList(id){
    Application.selectSuitPaperId = id;
    Application.suitetype = 'choice';
    var para ='parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getChoiceQuestionsBySuitId",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#choicenum2').val(data.data.length);
            if($('#choicenum2').val()!=$('#choicenum1').val()){
                $('#addchoice').show();
            }else{
                $('#addchoice').hide();
            }
            for(var i= 0,len=data.data.length; i<len;i++){
                data.data[i].num = i+1;
            }

            $('#choicequestionslist').bootstrapTable('load',data.data);
            //$('#choicequestionseditor').modal('toggle');
            G.ui.tips.suc('查询成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function getCaseQuestionsList(id){
    Application.selectSuitPaperId = id;
    Application.suitetype = 'case';
    var para ='parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getCaseQuestionsBySuitId",'POST',para,'json',function(data){
        if(data.errcode == 0){
            $('#casenum2').val(data.data[0].count);
            if($('#casenum2').val()!=$('#casenum1').val()){
                $('#addcase').show();
            }else{
                $('#addcase').hide();
            }
            for(var i= 0,len=data.data.length; i<len;i++){
                data.data[i].num = i+1;
            }

            $('#casequestionslist').bootstrapTable('load',data.data);
            //$('#choicequestionseditor').modal('toggle');
            G.ui.tips.suc('查询成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function getEssayQuestionsList(id){
    Application.selectSuitPaperId = id;


    var para ='parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getEssayQuestionBySuiteid",'POST',para,'json',function(data){
        if(data.errcode == 0){
            getEssayContent(id);
            for(var i= 0,len=data.data.length; i<len;i++){
                data.data[i].num = i+1;
            }
            $('#QAlist').bootstrapTable('load',data.data);
            for(var item in Application.questionsInfo){
                if(Application.questionsInfo[item].type_no ==3){
                    $('#essaynum1').val(Application.questionsInfo[item].count_no);
                }
            }
            $('#essaynum2').val(data.data.length);
            //$('#casenum2').val(data.data[0].count);
            //if($('#casenum2').val()!=$('#casenum1').val()){
            //    $('#addcase').show();
            //}else{
            //    $('#addcase').hide();
            //}

            //$('#choicequestionseditor').modal('toggle');
            G.ui.tips.suc('查询成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')


}


function getEssayContent(id){
    Application.selectSuitPaperId = id;


    var para ='parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/getEssayContentBySuiteid",'POST',para,'json',function(data){
        if(data.errcode == 0){
            //$('#casenum2').val(data.data[0].count);
            //if($('#casenum2').val()!=$('#casenum1').val()){
            //    $('#addcase').show();
            //}else{
            //    $('#addcase').hide();
            //}

            Application.essayContent = data.data;
            $('#essaytextarea').val(data.data.text);
            //$('#choicequestionseditor').modal('toggle');
            G.ui.tips.suc('查询成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function saveEssayContent(){

    if(Application.essayContent==""||Application.essayContent==null){
        insertEssayContent()
    }else{
        Application.essayContent.text = $('#essaytextarea').val();
        var para ='parameter='+JSON.stringify(Application.essayContent);
        Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateEssayContent",'POST',para,'json',function(data){
            if(data.errcode == 0){
                //$('#casenum2').val(data.data[0].count);
                //if($('#casenum2').val()!=$('#casenum1').val()){
                //    $('#addcase').show();
                //}else{
                //    $('#addcase').hide();
                //}
                //$('#essaytextarea').val(data.data.text);
                //$('#choicequestionseditor').modal('toggle');
                G.ui.tips.suc('保存成功！')
            }else{
                G.ui.tips.err('查询失败！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！')
        },'application/x-www-form-urlencoded')
    }

}


function insertEssayContent(){

    var essayContent = {};
    essayContent.text = $('#essaytextarea').val();
    essayContent.suite_id = Application.selectSuitPaperId;
    var para ='parameter='+JSON.stringify(essayContent);
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/insertEssayContent",'POST',para,'json',function(data){
        if(data.errcode == 0){

            G.ui.tips.suc('保存成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function editEssayQuestions(){

}


function saveessayquestion(){


    if(Application.essayquestionRow == null){
        var obj = {};
        obj.text = $('#essayeditortextarea').val();
        obj.answer = $('#essayanswertextarea').val();
        obj.score = $('#esssyscore').val();
        obj.suite_id = Application.selectSuitPaperId;
        obj.order_no =  $('#QAlist').bootstrapTable('getData').length;
        var para ='parameter='+JSON.stringify(obj);
        Application.Util.ajaxConstruct(Application.serverHost + "/exam/insertEssayQuestion",'POST',para,'json',function(data){
            if(data.errcode == 0){
                //$('#casenum2').val(data.data[0].count);
                //if($('#casenum2').val()!=$('#casenum1').val()){
                //    $('#addcase').show();
                //}else{
                //    $('#addcase').hide();
                //}
                //$('#essaytextarea').val(data.data.text);
                //$('#choicequestionseditor').modal('toggle');
                getEssayQuestionsList(Application.selectSuitPaperId);
                Application.essayquestionRow == null;
                $('#restorecaseQAPanel').tab('show');
                G.ui.tips.suc('保存成功！')
            }else{
                G.ui.tips.err('查询失败！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！')
        },'application/x-www-form-urlencoded')

    }else{
        Application.essayquestionRow.text = $('#essayeditortextarea').val();
        Application.essayquestionRow.answer = $('#essayanswertextarea').val();
        Application.essayquestionRow.score = $('#esssyscore').val();

        var para ='parameter='+JSON.stringify(Application.essayquestionRow);
        Application.Util.ajaxConstruct(Application.serverHost + "/exam/updateEssayQuestionByid",'POST',para,'json',function(data){
            if(data.errcode == 0){
                //$('#casenum2').val(data.data[0].count);
                //if($('#casenum2').val()!=$('#casenum1').val()){
                //    $('#addcase').show();
                //}else{
                //    $('#addcase').hide();
                //}
                //$('#essaytextarea').val(data.data.text);
                //$('#choicequestionseditor').modal('toggle');
                getEssayQuestionsList(Application.selectSuitPaperId);
                Application.essayquestionRow == null;
                $('#restorecaseQAPanel').tab('show');
                G.ui.tips.suc('保存成功！')
            }else{
                G.ui.tips.err('查询失败！');
            }

        },function(data){
            G.ui.tips.err('查询失败！！')
        },'application/x-www-form-urlencoded')

    }


}


function deleteEssayQuestion(e){
    var id = $(e.currentTarget).attr('data-id');
    var para ='parameter='+JSON.stringify({id:id});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/deleteEssayQuestionByid",'POST',para,'json',function(data){
        if(data.errcode == 0){
            getEssayQuestionsList(Application.selectSuitPaperId);

            G.ui.tips.suc('保存成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function saveCaseQuestion(){
    var suiteId = Application.selectSuitPaperId;
    var order_no = $('#casequestionslist').bootstrapTable('getData').length;
    var text =$('#casetextarea').val();
    var para ='parameter='+JSON.stringify({suite_id:suiteId,order_no:order_no,text:text});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/insertCaseQuestion",'POST',para,'json',function(data){
        if(data.errcode == 0){
            getCaseQuestionsList(Application.selectSuitPaperId);
            $('#casequestionseditor').modal('toggle');
            G.ui.tips.suc('保存成功！')
        }else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}

function openmodifychapertest(){
    $('#modifyusername').val('');
    $('#modifyspecial').select2("val",'');
    $('#modifycourse').select2("val",'');
    $('#modifychapter').select2("val",'');
    $('#modifyscore').val('');
    Application.addtype = 'chapter';
    $('#modifytile').text('添加章节作业');
}
function openmodifydanketest(){
    Application.addtype = '';
    $('#modifyusername').val('');
    $('#modifyspecial').select2("val",'');
    $('#modifycourse').select2("val",'');
    $('#modifychapter').select2("val",'');
    $('#modifyscore').val('');
    $('#modifytile').text('添加单科考试');
}
function submitmodifychapterwork(){
    var isdanke = false;
    if(Application.addtype == 'chapter'){
        isdanke = false;
    }else{
        isdanke = true;
    }
    var uid = $('#modifyusername').val();
    var cid = $('#modifycourse').select2('val');
    var cpath = '0-'+$('#modifychapter').select2('val');
    var time_limit =90;

    if(uid =="" || cid== "" || cpath == "" || $('#modifyscore').val() == ""){
        G.ui.tips.info('请输入完整信息！');
        return;
    }

    var para ='parameter='+JSON.stringify({uid:uid,cid:cid,cpath:cpath,time_limit:time_limit,score:$('#modifyscore').val(),isDanke:isdanke});
    Application.Util.ajaxConstruct(Application.serverHost + "/exam/insertChapterRocord",'POST',para,'json',function(data){
        Application.addtype = null;
        if(data.errcode == 0){
            initChapterExamList();
            $('#modifychapertest').modal('toggle');
            G.ui.tips.suc('保存成功！')
        }else if(data.errcode == -1){
            G.ui.tips.err('请填写正确的用户名！');
        }

        else{
            G.ui.tips.err('查询失败！');
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
    },'application/x-www-form-urlencoded')
}


function check_all(t,n){
    var c=document.getElementById('toggle_'+n).checked;
    var f = document.form1;
    for(i=1;i<=t;i++) {
        cb=document.getElementById('cb_'+n+'_'+i);
        if(cb){
            cb.checked=c;
        }
    }
}