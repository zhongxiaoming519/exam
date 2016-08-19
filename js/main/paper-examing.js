/**
 * Created by zhongxiaoming on 2015/11/25.
 * Class t
 */
$(function () {
    modal.dateFormatter();
    modal.prepare();
    examing.initial();
    Application.user =  JSON.parse($.cookie("user"));
    var paperpara = 'parameter='+$.cookie('querypara');
    Application.paperpara = $.cookie('querypara');
    $('#answerid').text(Application.user.name);
    $('#examduration').text(new Date().toLocaleString());
    $('#exampaper-title-name').text($.cookie('examtype'));

    var testtypeid = $.cookie('testtypeid');


    var answerobj = {};
    answerobj.index=0
    Application.Util.ajaxConstruct(Application.serverHost + $.cookie('queryurl'), 'POST', paperpara, 'json', function (data) {
        if(data.errcode == 0){
            var content = '';
            Application.paperdata = data.data;
            if(data.data.single){
                content +='<li><div><h3>一、单项选择题（每小题只有一个最恰当的答案。错选、少选、多选，则该题均不得分。）</h3></div></li>'

                for (var item in data.data.single) {
                    var obj = {}
                    obj.answer= data.data.single[item].answer;
                    obj.point = data.data.single[item].sub_score;
                    //if(item>1&&data.data.single[item].answer.split(',').length!=data.data.single[item-1].answer.split(',').length&&data.data.single[item-1].answer.split(',').length==1){
                    //    content +='<li><div><h3>二、多项选择题（每题有多个答案正确。错选、少选、多选均不得分））</h3></div></li>'
                    //}
                    //if(data.data.single[item].answer.split(',').length >1){
                    //    obj.question_type_id=2;
                    //    content += getStringHtml(2, data.data.single[item]);
                    //}else{
                        obj.question_type_id=1;
                        content += getStringHtml(1, data.data.single[item]);
                    //}


                    answerobj[item]=obj;
                }
                examing.answers=answerobj;
            }if(data.data.multi){
                content +='<li><div><h3>二、多项选择题（每题有多个答案正确。错选、少选、多选均不得分））</h3></div></li>';
                for (var item in data.data.multi) {
                    var obj = {}
                    obj.answer= data.data.multi[item].answer;
                    obj.point = data.data.multi[item].sub_score;
                    obj.question_type_id=2;
                    content += getStringHtml(2, data.data.multi[item]);
                    answerobj[parseInt(item)+data.data.single.length]=obj;
                }
                examing.answers=answerobj;
            }


            else if(data.data.CaseQuestions.length>0){
                content +='<li class=\"\"><div><h3>三、技能选择题（请分别根据案例回答，共100道题。每题1分，满分100分。每小题有一个或多个答案正确，错选、少选、多选，该题不得分。</h3><div></div></li>'
                for(var item in data.data.CaseQuestions){

                    content += getStringHtml(3, data.data.CaseQuestions[item],item,answerobj);

                }

                if(data.data.EssayQuestions!=null){
                    content +='<li class=\"\"><div><h3>四、案例问答题（满分100分）</h3><div></div></li>'

                    content += getStringHtml(4, data.data.EssayQuestions,null,answerobj);
                }

            }else if(data.data.ChoiceQuestions.length>0){
                content +='<li><div><h3>一、单项选择题（每小题只有一个最恰当的答案。错选、少选、多选，则该题均不得分。）</h3></div></li>'

                for (var item in data.data.ChoiceQuestions) {
                    var obj = {}
                    obj.answer= data.data.ChoiceQuestions[item].answer;
                    obj.point = data.data.ChoiceQuestions[item].sub_score?data.data.ChoiceQuestions[item].sub_score:1;
                    if(item>1&&data.data.ChoiceQuestions[item].type_no!=data.data.ChoiceQuestions[item-1].type_no){
                        content +='<li><div><h3>二、多项选择题（每题有多个答案正确。错选、少选、多选均不得分））</h3></div></li>'
                    }
                    if(data.data.ChoiceQuestions[item].answer.split(',').length >1){
                        obj.question_type_id=2;
                        content += getChoiceQuestionsStringHtml(2, data.data.ChoiceQuestions[item]);
                    }else{
                        obj.question_type_id=1;
                        content += getChoiceQuestionsStringHtml(1, data.data.ChoiceQuestions[item]);
                    }
                    answerobj[item]=obj;
                }
                examing.answers=answerobj;
            }

            $('#exampaper-body').empty();
            $('#exampaper-body').append(content);

            $('#exam-timestamp').html($.cookie('duration'));
            examing.addNumber();
            examing.updateSummery();
            examing.refreshNavi();
            examing.bindFinishOne();
            examing.startTimer();

        }
        else{

        }

    }, function (data) {
        G.ui.tips.err('查询失败！！')
    }, 'application/x-www-form-urlencoded');
});

var examing = {
    initial: function initial() {
        $(window).scroll(examing.fixSideBar);

        //this.refreshNavi();
        this.bindNaviBehavior();
        //this.addNumber();
//		this.securityHandler();

        this.bindOptClick();
        this.updateSummery();
        this.bindQuestionFilter();
        this.bindfocus();
        //this.bindFinishOne();
        //this.startTimer();

        this.bindSubmit();
    },

    fixSideBar: function fixSideBar() {
        var nav = $("#bk-exam-control");
        var title = $("#exampaper-title");
        var container = $("#exampaper-desc-container");
        if ($(this).scrollTop() > 147) {
            nav.addClass("fixed");
            title.addClass("exampaper-title-fixed");
            container.addClass("exampaper-desc-container-fixed");

        } else {
            nav.removeClass("fixed");
            title.removeClass("exampaper-title-fixed");
            container.removeClass("exampaper-desc-container-fixed");
        }
    },


    bindNaviBehavior: function bindNaviBehavior() {

        var nav = $("#question-navi");
        var naviheight = $("#question-navi").height()+26;
        var bottompx = "-" + naviheight + "px;";
        var scrollBottomRated = $("footer").height() + 2 + 100 + naviheight;

        $("#exampaper-footer").height($("#question-navi").height());

        nav.css({
            position: 'fixed',
            bottom: '0px',
            "z-index": '1'
        });


        $("#question-navi-controller").click(function () {
            var scrollBottom = document.body.scrollHeight - $(window).scrollTop() - $(window).height();

            var nav = $("#question-navi");
            var attr = nav.attr("style");

            if (nav.css("position") == "fixed") {
                if (nav.css("bottom") == "0px") {
                    nav.css({
                        bottom: "-" + naviheight + "px"
                    });
                } else {
                    nav.css({
                        bottom: 0
                    });
                }

            }

        });

    },

    securityHandler: function securityHandler() {
        // 右键禁用
        if (document.addEventListener) {
            document.addEventListener("contextmenu", function (e) {
                e.preventDefault();
            }, false);
        } else {
            document.attachEvent("contextmenu", function (e) {
                e.preventDefault();
            });
        }

        $(window).bind('beforeunload', function () {
            return "考试正在进行中...";
        });
    },

    /**
     * 刷新试题导航
     */
    refreshNavi: function refreshNavi() {
        $("#exam-control #question-navi").empty();
        var questions = $(".question");

        questions.each(function (index) {
            var btnhtml = "<a class=\"question-navi-item\">" + (index + 1) + "</a>";


            $("#question-navi-content").append(btnhtml);
        });
    },

    /**
     * 更新题目简介信息
     */
    updateSummery: function updateSummery() {
        if ($(".question").length === 0) {
            return false;
        }
        var questiontypes = this.questiontypes;
        var summery = "";
        for (var i = 0; i < questiontypes.length; i++) {
            var question_sum_q = $("." + questiontypes[i].code).length;
            if (question_sum_q == 0) {
                continue;
            } else {
                summery = summery + "<span class=\"\">"
                + questiontypes[i].name + "[<span class=\"\"></span><span class=\"\">"
                + $("." + questiontypes[i].code).length + "</span>]<span class=\"\" style=\"display:none;\">"
                + questiontypes[i].code + "</span></span>";
            }
        }
        // summery = summery.substring(0, summery.length - 2);
        //$("#exampaper-desc").html(summery);

        //examing.doQuestionFilt($($(".exampaper-filter-item")[0]).find(".efi-qcode").text());
    },

    questiontypes: new Array({
        "name": "单选题",
        "code": "qt-singlechoice"
    }, {
        "name": "多选题",
        "code": "qt-multiplechoice"
    }, {
        "name": "判断题",
        "code": "qt-trueorfalse"
    }, {
        "name": "填空题",
        "code": "qt-fillblank"
    }, {
        "name": "简答题",
        "code": "qt-shortanswer"
    }, {
        "name": "论述题",
        "code": "qt-essay"
    }, {
        "name": "分析题",
        "code": "qt-analytical"
    }),
    /**
     * 绑定考题focus事件(点击考题导航)
     */
    bindfocus: function bindfocus() {
        $("#question-navi").delegate("a.question-navi-item ", "click", function () {
            var clickindex = $("a.question-navi-item").index(this);
            var questions = $(".question");
            var targetQuestion = questions[clickindex];

            var targetQuestionType = $(questions[clickindex]).find(".question-type").text();

            examing.doQuestionFilt("qt-" + targetQuestionType);

            examing.scrollToElement($(targetQuestion));
        });
    },

    scrollToElement: function scrollToElement(selector, time, verticalOffset) {
        time = typeof (time) != 'undefined' ? time : 500;
        verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
        element = $(selector);
        offset = element.offset();
        offsetTop = offset.top + verticalOffset-150;
        $('html, body').animate({
            scrollTop: offsetTop
        }, time);
    },

    /**
     * 完成一道题触发的function
     */
    bindFinishOne: function bindFinishOne() {
        $(".question-input").change(function () {


            var current_index = $(".question").index($(this).parent().parent().parent().parent());
            if(current_index == -1){
                current_index = $(".question").index($(this).parent().parent().parent().prev());
            }

            $($(".question-navi-item")[current_index]).addClass("pressed");
        });

        $("input[type=checkbox]").change(function () {
            var current_question = $(this).parent().parent().parent().parent();
            var current_index = $(".question").index(current_question);
            var checkedboxs = current_question.find("input[type=checkbox]:checked");
            if (checkedboxs.length > 0) {
                $($("a.question-navi-item")[current_index]).addClass("pressed");
            } else {
                $($("a.question-navi-item")[current_index]).removeClass("pressed");
            }
        });


        $(".question textarea").bind('input propertychange', function () {

            var current_index = $(".question").index($(this).parent());
            if ($(this).val() != "") {
                $($("a.question-navi-item")[current_index]).addClass("pressed");
            } else {
                $($("a.question-navi-item")[current_index]).removeClass("pressed");
            }
        });

    },

    /**
     * 开始倒计时
     */
    startTimer: function startTimer() {
        Application.startTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var timestamp = parseInt($("#exam-timestamp").text());
        var int = setInterval(function () {
            $("#exam-timestamp").text(timestamp);
            $("#exam-clock").text(examing.toHHMMSS(timestamp));
            if (timestamp < 600) {
                var exam_clock = $("#question-time");
                exam_clock.removeClass("question-time-normal");
                exam_clock.addClass("question-time-warning");
            }

            timestamp-- || examing.examTimeOut(int);
        }, 1000);
    },

    /**
     * 考试时间到
     * @param int
     */
    examTimeOut: function examTimeOut(int) {
        clearInterval(int);
        examing.finishExam();
    },

    /**
     * 时间formater
     *
     * @param timestamp
     * @returns {String}
     */
    toHHMMSS: function toHHMMSS(timestamp) {
        var sec_num = parseInt(timestamp, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var time = hours + ':' + minutes + ':' + seconds;
        return time;
    },


    /**
     * 对题目重新编号排序
     */
    addNumber: function addNumber() {
        var questions = $(".question");

        questions.each(function (index) {
            if($(this).find(".question-no").length==0){
                $(this).parent().prev().find(".question-no").text(index + 1 + ".");
            }else{
                $(this).find(".question-no").text(index + 1 + ".");
            }

        });
    },

    /**
     * 切换考题类型事件
     */
    bindQuestionFilter: function bindQuestionFilter() {
        // $(".exampaper-filter-item").bi
//
        // $("span.efi-selected").find(".efi-qcode").text();
        $("#exampaper-desc").delegate("span.exampaper-filter-item", "click", function () {
            var qtype = $(this).find(".efi-qcode").text();
            // var questions = $("li.question");
            // questions.hide();
            // $("#exampaper-body ." + qtype).show();
            // $(".exampaper-filter-item").removeClass("efi-selected");
            // $(this).addClass("efi-selected");
            examing.doQuestionFilt(qtype);
        });
    },


    /**
     *切换到指定的题型
     */
    doQuestionFilt: function doQuestionFilt(questiontype) {

        if ($("#exampaper-desc .efi-" + questiontype).hasClass("efi-selected")) {
            return false;
        } else {
            var questions = $("li.question");
            questions.hide();
            $("#exampaper-body ." + questiontype).show();

            $(".exampaper-filter-item").removeClass("efi-selected");
            $("#exampaper-desc .efi-" + questiontype).addClass("efi-selected");
        }


    },

    bindSubmit: function bindSubmit() {
        $("#question-submit button").click(function () {
            if (confirm("确认交卷吗？")) {
                examing.finishExam();
            }
        });
    },

    finishExam: function finishExam() {
        //modal.showProgress();
        var answersheet = examing.genrateAnswerSheet();
        Application.endTime = new Date().Format('yyyy-MM-dd hh:mm:ss')
        //$.cookie("answersheet",JSON.stringify(answerSheet), { expires: 1, path: '/' });
        //判卷
        var result ={};
        result.total = 0;
        result.rights = 0;
        result.wrongs = 0;
        for(var item in examing.answers){
            if(item!='index'){


                if(answersheet[item].question_type_id == 5){
                    for(var key in examing.answers[item].answer.split('|')){
                        if(answersheet[item].answer&&answersheet[item].answer.indexOf(examing.answers[item].answer.split('|')[key].split(',')[0])!=-1){
                            result.total+=examing.answers[item].answer.split('|')[key].split(',')[1];

                            examing.answers[item].bool =true;
                        }

                    }

                    if(!examing.answers[item].bool){
                        examing.answers[item].bool =false;
                        result.wrongs+=1;
                    }else{
                        result.rights+=1;
                    }
                }else{
                    examing.answers[item].answer= examing.answers[item].answer.replace(/0/,'A');;

                    examing.answers[item].answer=examing.answers[item].answer.replace(/1/,'B');
                    examing.answers[item].answer=examing.answers[item].answer.replace(/2/,'C');
                    examing.answers[item].answer=examing.answers[item].answer.replace(/3/,'D');
                    if(examing.answers[item].answer==answersheet[item].answer){
                        result.total+=examing.answers[item].point;
                        result.rights+=1;
                        examing.answers[item].bool =true;
                    }else{
                        examing.answers[item].bool =false;
                        result.wrongs+=1;
                    }

                }
            }


        }


        $('#totalpoint').text(result.total)
        $(".add-role .label-info").text(result.rights+result.wrongs);
        $(".exam-report-correct .label-success").text(result.rights);
        $(".exam-report-error .label-danger").text(result.wrongs);
        Morris.Donut({
            element : 'graph-base',
            data : [{
                label : "答对题目",
                value : parseInt($(".exam-report-correct .label-success").text())

            }, {
                label : "答错题目",
                value : parseInt($(".exam-report-error .label-danger").text())
            }],
            colors : ['#5cb85c', '#da4f49'],
            labelColor : '#1ba1e2'
        });
        generatenavicontent(examing.answers);

        var answerobj = {};
        for(var anitem in answersheet){
            answerobj[anitem] = answersheet[anitem].answer;
        }
        if($.cookie('examtype')=='分节测试'||$.cookie('examtype')=='单科考试'){
            submitDiffChapterTest(result.total)
        }else if($.cookie('examtype')=='模拟考试'){

                var para = 'parameter='+JSON.stringify({userId:Application.user.id,testTypeId: $.cookie('examtid'),testSuitesId:Application.paperdata.CaseQuestions[0]?Application.paperdata.CaseQuestions[0].suite_id:Application.paperdata.ChoiceQuestions[0].suite_id,finished:1,score:result.total,startTime:Application.startTime,endTime:Application.endTime,questionCount:result.rights+result.wrongs,mock:1,submitTime:Application.endTime,answer:answerobj});
                submitMockOrRealExam(para);

        }else if($.cookie('examtype').substr(-4)=='结业考试'){
            var para = 'parameter='+JSON.stringify({userId:Application.user.id,testTypeId: $.cookie('examtid'),testSuitesId:Application.paperdata.CaseQuestions[0]?Application.paperdata.CaseQuestions[0].suite_id:Application.paperdata.ChoiceQuestions[0].suite_id,finished:1,score:result.total,startTime:Application.startTime,endTime:Application.endTime,questionCount:result.rights+result.wrongs,mock:0,submitTime:Application.endTime,answer:answerobj});
            submitMockOrRealExam(para);
            //if(result.total>59){
                var testtypeid = $.cookie('testtypeid');
                //
                // Application.user.isGraduated =3;
                 Application.user.birthday = '0000-00-00';



                var para ='parameter='+JSON.stringify({userId:Application.user.id});
                Application.Util.ajaxConstruct(Application.serverHost + "/edu/getFinalScore",'POST',para,'json',function(data){
                    if(data.errcode == 0){
                        for(var i=0,len=data.data.length;i<len;i++){
                            if(data.data[i].score < 60){
                                return;
                            }
                        }
                        Application.user.state ='j';
                        updateIsGraduate(result.total);
                        //G.ui.tips.suc('修改成功！')
                    }else{
                        //G.ui.tips.err('修改失败！');
                    }

                },function(data){
                    G.ui.tips.err('查询失败！！')
                },'application/x-www-form-urlencoded')


                //updateIsGraduate(result.total);
            //}
        }


        var content = ''


        if(Application.paperdata.single){
            content +='<li><div><h3>一、单项选择题（每小题只有一个最恰当的答案。错选、少选、多选，则该题均不得分。）</h3></div></li>'

            for (var itemsingle in Application.paperdata.single) {
                var obj = {}
                obj.answer= Application.paperdata.single[itemsingle].answer;
                obj.point = Application.paperdata.single[itemsingle].sub_score;

                obj.question_type_id=1;
                content += getReportStringFromXML(1, Application.paperdata.single[itemsingle],answersheet[itemsingle]);

            }

        }if(Application.paperdata.multi){
            content +='<li><div><h3>二、多项选择题（每题有多个答案正确。错选、少选、多选均不得分））</h3></div></li>';
            for (var itemmulti in Application.paperdata.multi) {
                var obj = {}
                obj.answer= Application.paperdata.multi[itemmulti].answer;
                obj.point = Application.paperdata.multi[itemmulti].sub_score;
                obj.question_type_id=2;
                content += getReportStringFromXML(2, Application.paperdata.multi[itemmulti],answersheet[Application.paperdata.single.length + parseInt(itemmulti)]);

            }

        }
        else if(Application.paperdata.CaseQuestions.length>0){
            content +='<li class=\"\"><div><h3>三、技能选择题（请分别根据案例回答，共100道题。每题1分，满分100分。每小题有一个或多个答案正确，错选、少选、多选，该题不得分。</h3><div></div></li>'
            Application.answerorder = 0;
            for(var itemcase in Application.paperdata.CaseQuestions){

                content += getReportStringFromXML(3, Application.paperdata.CaseQuestions[itemcase],answersheet);
            }

            if(Application.paperdata.EssayQuestions!=null){
                content +='<li class=\"\"><div><h3>四、案例问答题（满分100分）</h3><div></div></li>'

                content += getReportStringFromXML(4, Application.paperdata.EssayQuestions,answersheet);

            }

        }

        else if(Application.paperdata.ChoiceQuestions.length>0){
            content +='<li><div><h3>一、单项选择题（每小题只有一个最恰当的答案。错选、少选、多选，则该题均不得分。）</h3></div></li>'

            for (var itempcase in Application.paperdata.ChoiceQuestions) {
                var obj = {}
                obj.answer= Application.paperdata.ChoiceQuestions[itempcase].answer;
                obj.point = Application.paperdata.ChoiceQuestions[itempcase].sub_score;
                if(item>1&&Application.paperdata.ChoiceQuestions[itempcase].type_no!=Application.paperdata.ChoiceQuestions[itempcase-1].type_no){
                    content +='<li><div><h3>二、多项选择题（每题有多个答案正确。错选、少选、多选均不得分））</h3></div></li>'
                }
                if(Application.paperdata.ChoiceQuestions[itempcase].answer.split(',').length >1){
                    obj.question_type_id=2;
                    content += getChoiceQuestionsStringHtmlReport(2, Application.paperdata.ChoiceQuestions[itempcase],answersheet[itempcase]);
                }else{
                    obj.question_type_id=1;
                    content += getChoiceQuestionsStringHtmlReport(1, Application.paperdata.ChoiceQuestions[itempcase],answersheet[itempcase]);
                }

            }

        }

        $('#finalexampaper-body').empty();
        $('#finalexampaper-body').append(content);
        addreportNumber()



        $('#showfinalpaper').tab('show');


        if($.cookie('examtype')=='分节测试'){
            opener.startChapterTest(JSON.parse(Application.paperpara).cid,null,'test');
        }
        if($.cookie('examtype')=='单科考试'){
            opener.startChapterTest(JSON.parse(Application.paperpara).cid,null,'exam');
        }


    },

    genrateAnswerSheet: function genrateAnswerSheet() {
        //		var as = new Array();
        var as = {};
        var questions = $(".question");

        for (var i = 0; i < questions.length; i++) {
            var answerSheetItem = new Object();

            if ($(questions[i]).hasClass("qt-singlechoice")) {
                var radio_checked = $(questions[i]).find("input[type=radio]:checked");
                var radio_all = $(questions[i]).find("input[type=radio]");
                if (radio_checked.length == 0) {
                    answerSheetItem.answer = "";
                } else {
                    var current_index = $(radio_all).index(radio_checked);
                    answerSheetItem.answer = String.fromCharCode(65 + current_index);
                }
                answerSheetItem.question_type_id = 1;
            } else if ($(questions[i]).hasClass("qt-multiplechoice")) {

                var checkbox_checked = $(questions[i]).find("input[type=checkbox]:checked");
                var checkbox_all = $(questions[i]).find("input[type=checkbox]");
                if (checkbox_checked.length == 0) {
                    answerSheetItem.answer = "";
                } else {
                    //var tm_answer = "";
                    var multitm_answer=[];
                    for (var l = 0; l < checkbox_checked.length; l++) {
                        var current_index = $(checkbox_all).index($(checkbox_checked[l]));
                        //tm_answer = tm_answer + String.fromCharCode(65 + current_index);
                        multitm_answer.push(String.fromCharCode(65 + current_index))
                    }
                    answerSheetItem.answer = multitm_answer.join(',');
                }
                answerSheetItem.question_type_id = 2;
            } else if ($(questions[i]).hasClass("casequestion")) {

                var radio_checked = $(questions[i]).next().find("input:radio[name='question-checkbox1']:checked");
                var radio_all = $(questions[i]).next().find("input:radio[name='question-checkbox1']");


                var checkbox_checked = $(questions[i]).next().find("input:checkbox[name='question-checkbox1']:checked");
                var checkbox_all = $(questions[i]).next().find("input:checkbox[name='question-checkbox1']");

                if(radio_checked.length !=0){

                    if (radio_checked.length == 0) {
                        answerSheetItem.answer = "";
                    } else {
                        var current_index = $(radio_all).index(radio_checked);
                        answerSheetItem.answer = String.fromCharCode(65 + current_index);
                    }
                    answerSheetItem.question_type_id = 1;
                }else if(checkbox_all.length !=0){
                    if (checkbox_checked.length == 0) {
                        answerSheetItem.answer = "";
                    } else {
                        //var tm_answer = "";
                        var multitm_answer=[];
                        for (var l = 0; l < checkbox_checked.length; l++) {
                            var current_index = $(checkbox_all).index($(checkbox_checked[l]));
                            //tm_answer = tm_answer + String.fromCharCode(65 + current_index);
                            multitm_answer.push(String.fromCharCode(65 + current_index))
                        }
                        answerSheetItem.answer = multitm_answer.join(',');
                    }
                    answerSheetItem.question_type_id = 2;
                }else{
                    answerSheetItem.answer = "";
                }

            } else if ($(questions[i]).hasClass("qt-fillblank")) {
                answerSheetItem.answer = $(questions[i]).find("textarea").val();
                answerSheetItem.question_type_id = 4;
            } else if ($(questions[i]).hasClass("qt-shortanswer")) {
                answerSheetItem.answer = $(questions[i]).find("textarea").val();
                answerSheetItem.question_type_id = 5;
            } else if ($(questions[i]).hasClass("qt-essay")) {
                answerSheetItem.answer = $(questions[i]).find("textarea").val();
                answerSheetItem.question_type_id = 6;
            } else if ($(questions[i]).hasClass("qt-analytical")) {
                answerSheetItem.answer = $(questions[i]).find("textarea").val();
                answerSheetItem.question_type_id = 7;
            }
            answerSheetItem.point = 0;

            //var tmpkey = $(questions[i]).find(".question-id").text();
            var tmpkey = i +'';
            var tmpvalue = answerSheetItem;

            as[tmpkey] = tmpvalue;
        }
        return as;
    },
    bindOptClick: function bindOptClick() {
        $(".question-list-item").click(function () {
            $(this).parent().find(".question-list-item-selected").removeClass("question-list-item-selected");
            $(this).addClass("question-list-item-selected");
            $(this).find("input").prop("checked", true);
        });

    },

    constructPager: function () {
        var data = $.cookie('paper_data');
        var html = '';
        //单选
    }

};


function getStringHtml(type, questionobj,index,answerobj) {
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
            sb += "<li class=\"qt-casequestion\">";
            break;
        case 4:
            sb += "<li class=\"\"><div class='casedes-div'><h6>"+questionobj.text+"</h6><div>";
            break;
        default:
            break;
    }

    //sb += "<div class=\"question-title\">";
    //sb += "<div class=\"question-title-icon\"></div>"
    //sb += "<span class=\"question-no\"></span>";
    //sb += "<span class=\"question-type\" style=\"display: none;\">"

    switch (type) {
        case 1:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no\"></span>";
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

            break;
        case 2:
            sb += "<div class=\"question-title\">";
            sb += "<div class=\"question-title-icon\"></div>"
            sb += "<span class=\"question-no\"></span>";
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
            break;
        case 3:


            for(var item in questionobj.caseSubQuestions){

                var obj = {}
                //obj.answer= questionobj.caseSubQuestions[item].answer;
                obj.answer= questionobj.caseSubQuestions[item].answer;
                obj.point = 1;
                obj.question_type_id = questionobj.caseSubQuestions[item].type_id;
                answerobj[answerobj.index++]=obj;

                sb += "<div class=\"question casequestion\">";
                sb += "<div class=\"question-title-icon\"></div>"
                sb += "<span class=\"question-no\"></span>";
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
                sb += "<span class=\"question-id\" style=\"display:none;\">" + (answerobj.index-1) + "</span>";

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


            }

            examing.answers=answerobj;
            break;
        case 4:

            for(var item in questionobj.essayQuestions){

                var obj = {}
                //obj.answer= questionobj.caseSubQuestions[item].answer;
                obj.answer= questionobj.essayQuestions[item].answer;
                obj.point = 1;
                obj.question_type_id = questionobj.essayQuestions[item].type_id;
                answerobj[answerobj.index++]=obj;


                sb += "<div class=\"question-title\">";
                sb += "<div class=\"question-title-icon\"></div>"
                sb += "<span class=\"question-no\"></span>";
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
                sb +="<span class=\"question-id\" style=\"display:none;\">"+(answerobj.index-1) +"</span>";
                sb +="<textarea class=\"question-textarea \"></textarea></div>";
                sb +="</form>";

            }

            break;
    }
    sb += "</li>";
    return sb;
}


function getReportStringFromXML(type, questionobj,answersheet) {
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
            sb +="<span>你的答案：</span><span id='youranswer' style='background: #ff0000'>"+answersheet.answer+"</span>";
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
            sb +="<span>你的答案：</span><span id='youranswer' style='background: #ff0000'>"+answersheet.answer+"</span>";
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
    sb +="<span>你的答案：</span><span id='youranswer'>"+answersheet.answer+"</span>";
    sb +="</div></div>";
    return sb;
}


function generatenavicontent(data){
    var content=''
    for(var item in data){
        if(item!='index'){
            if(data[item].bool){
                content+='<a class="question-navi-item">'+(parseInt(item)+1)+'</a>';
            }else{
                content+='<a class="question-navi-item navi-item-error">'+(parseInt(item)+1)+'</a>';
            }
        }
    }

    $('#finalquestion-navi-content').append(content);
}
function addNumber() {
    var questions = $(".question");

    questions.each(function (index) {
        $(this).find(".question-no").text(index+ 1 + ".");
    });
}
function addreportNumber() {
    var questions = $(".reportnum");

    questions.each(function (index) {
        $(this).text(index+ 1 + ".");
    });
}

//提交章节测试单科考试

function submitDiffChapterTest(score){
    modal.showProgress();
    var para ='parameter='+ JSON.stringify({userId:Application.user.id,no:Application.paperdata.exam.no,score:score})
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/submitDiffChapterTest",'POST',para,'json',function(data){
        if(data.errcode == 0){
            modal.hideProgress();

        }else{
            modal.hideProgress();
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
        modal.hideProgress();
    },'application/x-www-form-urlencoded')
}

//提交模拟考试正式考试
function submitMockOrRealExam(para){
    modal.showProgress();

    //{"userId": 111,"testTypeId":1, "testSuitesId": 1,"finished":1, "startTime": "2011-08-21 17:48:19", "endTime":"2011-08-21 19:48:19", "score":100, "questionCount":100,"mock":1, "submitTime":"2011-08-21 20:00:13", "answer":{"1":"1","2":"1,2","3":"1,2,3","4":"4","5":"2,3","6":"1,2,3","7":"1,2","8":"3","9":"3,4","10":"2,3,4"}}


    //var para ='parameter='+ JSON.stringify({userId:Application.user.id,no:Application.paperdata.exam.no,score:score})
    Application.Util.ajaxConstruct(Application.serverHost + "/edu/submitMockOrRealExam",'POST',para,'json',function(data){
        if(data.errcode == 0){
            modal.hideProgress();

        }else{
            modal.hideProgress();
        }

    },function(data){
        G.ui.tips.err('查询失败！！')
        modal.hideProgress();
    },'application/x-www-form-urlencoded')
}



function updateIsGraduate(total){
    //Application.user.
    var para ='parameter='+JSON.stringify(Application.user);
    Application.Util.ajaxConstruct(Application.serverHost + "/authenticate/updateuser",'POST',para,'json',function(data){
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

var modal = {

    dateFormatter:function(){
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
    },

    prepare: function prepare() {
        $(".content").append("<div id=\"loading-progress\" style=\"display:none;\"><div id=\"loading-content\"> <h2>正在提交您的答案</h2><img class=\"loading-gif\" src=\"../img/loading.gif\"/><div> </div>");

    },
    showProgress: function showProgress() {
        $("#loading-progress").show();
    },

    hideProgress: function hideProgress() {
        $("#loading-progress").hide();
    }
};
