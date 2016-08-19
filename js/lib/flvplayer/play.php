<?
include "../config.php";
require "../include/function.php";
require "../include/db_mysql.php";
require "../include/page.class.php";
$db=_mysql_connect();
if($_GET['_f'])
{
    $m=get_db_msg("select * from ".$table_pre."course_chapter where id='".$_GET['_f']."'");
}
else
{
    $m=get_db_msg("select * from ".$table_pre."jianding_node where id='".$_GET['_j']."'");
}

$_f=($_GET['_net_stat']=="low")?$m["video_url1"]:$m["video_url"];
$_f = $flv_perfix.$_f;

$_sync = $_GET['_sync'];

//$_f=$_GET["_f"];
$_h=$_GET["_h"];
$_w=$_GET["_w"];
$_t=$_GET["_t"];
//$_f=$_f?$_f:"video/video.flv";
//$_t=$_t?$_t:0;
$_h=$_h?$_h:240;
$_w=$_w?$_w:320;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
    <title>play</title>
    <script type="text/javascript" src="swfobject.js"></script>
</head>
<body style="margin-left:5px;margin-top:2px">

    <div id="mediaspace">正在加载视频</div>

    <script type="text/javascript">

        var so = new SWFObject('pl.swf','mpl','<? echo $_w ?>','<? echo $_h ?>','9');

        so.addParam('allowfullscreen','true');
        so.addParam('allowscriptaccess','always');
        so.addParam('wmode','opaque');
        so.addVariable('file','<? echo $_f ?>');
        so.addVariable('frontcolor','333333');
        so.addVariable('autostart','true');
        so.addVariable('controlbar','over');
        so.addVariable('controlbar.idlehide', 'true');
        so.addVariable('playerready','playerReadyCallback');
        <?php

            if($_sync && $_sync > 0)
            {
                echo "so.addVariable('start', '$_sync');";
            }
        ?>

        if(location.protocol=='http:')
        {
            so.addVariable('provider','http');
            so.addVariable('http.startparam','start');
        }

        so.write('mediaspace');

        var player;

        function playerReadyCallback(obj) {

            player = document.getElementById(obj['id']);
            player.addModelListener("TIME","showtime");  //播放时间监听器
            player.addModelListener("STATE", "trackstate");
        };

        function showtime(objs)
        {
            var pptFrame = parent.getFrame("ppt");
            if(pptFrame.sync)
            {
                pptFrame.sync.findAndScroll(objs.position.toString());
                parent.syncTime = Math.floor(objs.position);
            }     
        }
        
        function trackstate(obj) {  
            
            if (obj["newstate"] == "COMPLETED") {  
                parent.goto_next_chapter();
            }  
        }
 
        

    </script>

</body>
</html>
