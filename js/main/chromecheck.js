/**
 * Created by zhongxiaoming on 2016/4/8.
 * Class chromecheck
 */
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

//以下进行测试
var str = "您当前的浏览器为";
if (Sys.ie) {
    str = str+'IE: ' + Sys.ie;
    if(Sys.ie <=11.0){
        str += '；因为您当前的浏览器版本过低，请点击下载安装'+'<a href="http://21.44.44.211:8081/ExamPages/" style="cursor:pointer">"ie8以上版本"</a>、<a style="cursor:pointer" href="http://21.44.44.211:8081/ExamPages/">"firefox"</a>、<a style="cursor:pointer" href="http://21.44.44.211:8081/ExamPages/">"chrome"</a>';
    }


    $('#topinfo').html(str);
}

