/*
 * Sync(scroll) documents with video players
 * 
 * Dependency: JQuery(above 1.0)
 *              Page variable: syncData (initialized by intiSyncPoint());
 * 
 * Author: Ricepig
 *
 */

function Synchonizer()
{
	// disable text selection
	var element = document;
	if (typeof(element.onselectstart) != "undefined") {        
		// IE�½�ֹԪ�ر�ѡȡ        
		element.onselectstart = new Function("return false");        
	} else {
		// firefox�½�ֹԪ�ر�ѡȡ�ı�ͨ�취        
		element.onmousedown = new Function("return false");        
		element.onmouseup = new Function("return true");        
	} 
	
	// disable context menu
	document.oncontextmenu=function(){ return false};

    //var elems = $(".syncpoint");
    //elems.css("color", "white");
    //elems.css("font-size", "2px");
    //var count = elems.size();
    //this.timepoints = [];
    //this.lastSyncPoint = 0;
    //for(var i=0;i<count;i++)
    //{
    //    var elem = elems.get(i);
    //    var timeStr = elem.innerHTML;
    //    var pos = timeStr.indexOf(':');
    //    if(pos>0)
    //    {
    //            var time = parseInt(timeStr.substr(0, pos)) * 60 + parseInt(timeStr.substr(pos+1));
    //            var obj = { timePoint:time, element:elem};
    //            this.timepoints.push(obj);
    //    }
    //}
}

Synchonizer.prototype.findAndScroll =
    function(timeStr)
{
    var time = parseInt(timeStr);
    for(var i=1;i<this.timepoints.length;i++)
    {
        var tp = this.timepoints[i];
        if(tp.timePoint > time)
        {
            this.scrollTo(i-1);
            break;
        }
    }

    if(i>=this.timepoints.length)
    {
        this.scrollTo(this.timepoints.length-1);
    }
}

Synchonizer.prototype.scrollTo =
function(elemIndex)
{
    if(elemIndex != this.lastSyncPoint)
    {
		//alert(elemIndex);
		this.lastSyncPoint = elemIndex;
		var elem = this.timepoints[elemIndex].element;
		var top = this.elementPosition(elem).y;
		
		// Hack for firefox
		if(document.documentElement.scrollTop)
		{
			document.documentElement.scrollTop = top;
		}
		else
		{
			document.body.scrollTop = top;
		}
    }
}

Synchonizer.prototype.elementPosition =
function(obj) {
    var curleft = 0, curtop = obj.clientHeight;

    if (obj.offsetParent) {
     curleft = obj.offsetLeft;
     curtop = obj.offsetTop;

     while (obj = obj.offsetParent) {
             curleft += obj.offsetLeft;
             curtop += obj.offsetTop;
     }
    }
    return { x: curleft, y: curtop };
}