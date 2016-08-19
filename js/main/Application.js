/**
 * Created by zhongxiaoming on 2015/11/5.
 * Class Application
 */
Application = {}
//服务地址
Application.serverHost = 'http://localhost:8888/ExamService';
//系统地址
Application.host = 'http://localhost:63342/ExamPages';
//论坛地址
Application.forum = 'http://21.44.44.211/discuz3';
//真题双助地址
Application.exam = 'http://192.168.1.105:8081';
Application.examresult=null;
Application.answersheet=null;


jQuery.extend({
    browser: function()
    {
        var
            rwebkit = /(webkit)\/([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,
            browser = {},
            ua = window.navigator.userAgent,
            browserMatch = uaMatch(ua);

        if (browserMatch.browser) {
            browser[browserMatch.browser] = true;
            browser.version = browserMatch.version;
        }
        return { browser: browser };
    }
});

function uaMatch(ua)
{
    ua = ua.toLowerCase();

    var match = rwebkit.exec(ua)
        || ropera.exec(ua)
        || rmsie.exec(ua)
        || ua.indexOf("compatible") < 0 && rmozilla.exec(ua)
        || [];

    return {
        browser : match[1] || "",
        version : match[2] || "0"
    };
}


Application.rights= {
    y:['kecheng','jianding','slectspecial','examandcate','mocktest','finaltest','apply','online_list','personalinfo'],
    z:['apply'],
    j:['kecheng','jianding','slectspecial','examandcate','mocktest','online_list','personalinfo'],
    t:['kecheng','jianding','slectspecial','examandcate','mocktest','personalinfo'],
    e:['kecheng','jianding','slectspecial','examandcate','mocktest','finaltest','apply','online_list','personalinfo'],
    c:['apply']
};