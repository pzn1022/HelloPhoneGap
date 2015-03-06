// JavaScript Document
//127.0.0.1 本地测试版本
//10.0.2.2 android虚拟机
//192.168.121.1 编译测试版本
$(document).ready(function () {
	if(typeof(PhoneGap)!='undefined')
	{
		$('body>*').css({minHeight:window.innerHeight+'px!important'});
	}
	loaded();
}); //注册事件的函数，和普通的dom对象不同

function Refresh()
{
	loaded();
	$('ul').listview('refresh')
}//刷新页面
function loaded()
{
	var HttpAjaxRequertUrl="http://127.0.0.1/ajax/ServerHelper.ashx?id=";
//	$("#yes").attr("href", HttpAjaxRequertUrl+"1");
	 
	var i;
	    $.ajaxSetup({
        async:false//将ajax异步处理设置成同步
    });
	//获取所有设别信息
	for(i=1;i<=9;i++)
	{
		$.getJSON(
			HttpAjaxRequertUrl+i.toString(),
			function(data) {
				binddata(data,i);
		});
	}
	//获取温湿度日志
		$.getJSON(
			HttpAjaxRequertUrl+"gettemploglist",
			function(data) {
				bindtemplog(data);
		});
	//获取日志信息
		$.getJSON(
			HttpAjaxRequertUrl+"getloglist",
			function(data) {
				bindlog(data);
		});
}//载入页面
function getprestr(id)
{
	var rt="";
	if(id=="1")
	{rt="Air_";}
	else if(id=="2")
	{rt="Smoke_";}
	else if(id=="3")
	{rt="Temp_";}
	else if(id=="4")
	{rt="Video_";}
	else if(id=="5")
	{rt="AlarmBell_";}
	else if(id=="6")
	{rt="FireHydrant_";}
	else if(id=="7")
	{rt="HandFireExtinguisher_";}
	else if(id=="8")
	{rt="WallHandFireExtinguisher_";}
	else if(id=="9")
	{rt="HandPropelledFireExtinguisher_";}
	return rt;
}//判断设备类型，得到前缀
function bindlog(data)
{
var nomal=0,alerts=0,errors=0,others=0;
var time="",name="",times="",message="";
  $.each(data, function(kay, value) {
	  $.each(value, function(kay2, value2) {
		  if(kay2=="Log_Content")
		  {name=value2;}
		  if(kay2=="Log_Time")
		  {times=value2;}
		  if(kay2=="Log_Level")
		  {
			  state=value2;
			  if(value2=="1")
			  {nomal++;}
			  else if(value2=="2")
			  {alerts++;}
			  else if(value2=="3")
			  {errors++;}
			  else
			  {others++;}
		  }
	  })
	  message=message+"<li data-theme='c'><a href='#' data-transition='slide'>"+name+"&nbsp;时间："+times+"</a></li>";
  })
 
  $("#Log_List").html("<li role='heading' data-role='list-divider'>正常："+nomal.toString()+"&nbsp;&nbsp;&nbsp; 错误："+errors.toString()+"&nbsp;&nbsp;&nbsp; 警告："+alerts.toString()+"&nbsp;&nbsp;&nbsp;  其他异常:"+others.toString()+"</li>");
  $("#Log_List").append(message);
}
function bindtemplog(data)
{
var nomal=0,alerts=0,fixs=0;
var time="",name="",w="";s="",times="",message="";
  $.each(data, function(kay, value) {
	  $.each(value, function(kay2, value2) {
		  if(kay2=="TempLog_Id")
		  {name=value2;}
		  if(kay2=="TempLog_S")
		  {s=parseInt(value2).toString();}
		  if(kay2=="TempLog_W")
		  {w=parseInt(value2).toString();}
		  if(kay2=="TempLog_Time")
		  {times=value2;}
		  if(kay2=="TempLog_State")
		  {
			  state=value2;
			  if(value2=="2")
			  {nomal++;}
			  else if(value2=="4")
			  {fixs++;}
			  else
			  {alerts++;}
		  }
	  })
	  message=message+"<li data-theme='c'><a href='#' data-transition='slide'>设备:"+name+" 温度："+w+" 湿度："+s+" 时间："+times+"</a></li>";
  })
 
  $("#TempLog_List").html("<li role='heading' data-role='list-divider'>正常："+nomal.toString()+"&nbsp;&nbsp;&nbsp; 报警："+alerts.toString()+"&nbsp;&nbsp;&nbsp;  检修:"+fixs.toString()+"</li>");
  $("#TempLog_List").append(message);
}//绑定温湿度记录
function binddata(data,i)
{
  var message="",name="",state="",prestr="";
  prestr=getprestr(i.toString());
  var nomal=0,alerts=0,fixs=0,otherss=0
  $.each(data, function(kay, value) {
	  $.each(value, function(kay2, value2) {
		  if(kay2==prestr+"Name")
		  {name=value2;}
		  if(kay2==prestr+"Area")
		  {name=name+"-"+value2;}
		  if(kay2==prestr+"Module")
		  {name=name+"-"+value2;}
		  if(kay2==prestr+"State")
		  {
			  state=value2;
			  if(value2=="2")
			  {nomal++;}
			  else if(value2=="4")
			  {fixs++;}
			  else if(value2=="0"||value2=="1"||value2=="3"||value2=="5"||value2=="6"||value2=="7"||value2=="8"||value2=="9")
			  {alerts++;}
			  else
			  {otherss++;}
		  }
	  })
	  message=message+GetItemSytle(name,state);
  })
 
  $("#"+prestr+"List").html("<li role='heading' data-role='list-divider'>正常："+nomal.toString()+"&nbsp;&nbsp;&nbsp; 报警："+alerts.toString()+"&nbsp;&nbsp;&nbsp;  维修:"+fixs.toString()+"&nbsp;&nbsp;&nbsp;  其他："+otherss.toString()+"</li>");
  $("#"+prestr+"List").append(message);
}//绑定设备数据
function GetItemSytle(name,state)
{
	var str="";
	if(state=="0")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：烟雾 设备:"+name+" </a></li>";
	else if(state=="1")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：火警 设备:"+name+" </a></li>";
	else if(state=="2")
	str="<li data-theme='c'><a href='#' data-transition='slide'>状态：正常 设备:"+name+"</a></li>";
	else if(state=="3")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：出错 设备:"+name+"</a></li>";
	else if(state=="4")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：检修 设备:"+name+"</a></li>";
	else if(state=="5")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：故障 设备:"+name+"</a></li>";
	else if(state=="6")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：辅助报警 设备:"+name+"</a></li>";
	else if(state=="7")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：预警 设备:"+name+"</a></li>";
	else if(state=="8")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：一级火警 设备:"+name+"</a></li>";
	else if(state=="9")
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：二级火警 设备:"+name+"</a></li>";
	else
	str="<li data-theme='e'><a href='#' data-transition='slide'>状态：未知状态 设备:"+name+"</a></li>";
	return str;
}//判断设备状态