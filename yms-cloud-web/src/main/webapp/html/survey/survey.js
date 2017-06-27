// //@ sourceURL=survey.js
// /*var s60=["60s","59s","58s","57s","56s","55s","54s","53s","52s","51s","50s","49s","48s","47s","46s","45s","44s","43s","42s","41s","40s"
//  ,"39s","38s","37s","36s","35s","34s","33s","32s","31s","30s","29s","28s","27s","26s","25s","24s","23s","22s","21s","20s"
//  ,"19s","18s","17s","16s","15s","14s","13s","12s","11s","10s","9s","8s","7s","6s","5s","4s","3s","2s","1s","0s"];*/
// var s60=[60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40
//     ,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20
//     ,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];
// var survey = {
//     intervalCount:0,
//     formatDigital:function(num){
//         if(isNaN(num)){
//             return "";
//         }
//         var tmp=parseInt(num*100+0.5);
//         return tmp/100;
//     },
//     formatMem:function(num){
//         var tmp=num/1024/1024/1000;
//         tmp=parseInt(tmp*100+0.5);
//         return tmp/100;
//     },
//     licenseInfo:{
//         init:function(){
//             $.ajax({
//                 type: "GET",
//                 url: "license/query",
//                 dataType: "json",
//                 success: function(result){
//                     if(result.ret>0){
//                         survey.licenseInfo.setValue(result.rows);
//                     }
//                     else{
//                         survey.licenseInfo.recirectLicencePage();
//                         $("#survey_license_inactive").show();
//                         $("#survey_license_active").hide();
//                     }
//                 }
//             });
//         },
//
//         setValue:function(data){
//             if(data.status=="ACTIVATED"){
//                 if(survey.conference.data.lisenceMCU){
//                     survey.conference.data.lisenceMCU=data.permissionAmount;
//                 }
//                 else{
//                     survey.conference.data.lisenceMCU=data.permissionAmount;
//                     survey.conference.show();
//                 }
//                 var expiredDate=new Date();
//                 expiredDate.setTime(data.expirationDate);
//                 var year=new Number(expiredDate.getFullYear()).toString();
//                 var month=new Number(expiredDate.getMonth() + 1).toString();
//                 var day=new Number(expiredDate.getDate()).toString();
//                 var expiredStr="";
//                 if(month.length<2){
//                     month="0"+month;
//                 }
//                 if(day.length<2){
//                     day="0"+day;
//                 }
//                 for(var i=0;i<year.length;i++){
//                     expiredStr+="<span>"+year.charAt(i)+"</span>";
//                 }
//                 expiredStr+="&nbsp;";
//                 for(var i=0;i<month.length;i++){
//                     expiredStr+="<span>"+month.charAt(i)+"</span>";
//                 }
//                 expiredStr+="&nbsp;";
//                 for(var i=0;i<day.length;i++){
//                     expiredStr+="<span>"+day.charAt(i)+"</span>";
//                 }
//                 $("#lisence_date").html(expiredStr);
//                 $("#survey_license_inactive").hide();
//                 $("#survey_license_active").show();
//             }
//             else{
//                 survey.licenseInfo.recirectLicencePage();
//                 $("#survey_license_inactive").hide();
//                 $("#survey_license_active").show();
//             }
//         },
//         recirectLicencePage:function(){
//             $('#survey_license_goto_active').off('click').on('click',function(){
//                 $('.g-main').show();
//                 $('.g-other').hide();
//                 var _this = ("li[name='item5']");
//                 var itemText = $(_this).find('span').text();;
//
//                 if(!$(_this).hasClass('active')){
//                     //选中样式
//                     $(_this).siblings().removeClass('active');
//                     $(_this).addClass('active');
//                 }
//                 $(main.MAIN_DATA).css("margin-left","280px");
//                 $(main.MAIN_MENU).show(0,function(){
//                     main.menuInit(main.MENU_TREE_ITEM,itemText,function(){
//                         menutree.selectNode(11);
//                     });
//                 })
//             });
//         }
//     },
//     currentTime:{
//         domId:"currentTime",
//         lastTime:0,
//         setValue:function(currTime){
//             //if(typeof(currTime)=="object"){
//             //	this.lastTime=currTime[currTime.length-1];
//             //}
//             //else{
//             //	this.lastTime=currTime;
//             //}
//             //this.show();
//         },
//         refresh:function(period){
//             //this.lastTime+=period;
//             //this.show();
//         },
//         show:function(){
//             //var date=new Date();
//             //date.setTime(this.lastTime);
//             //var timeStr=date.getFullYear()+"-";
//             //var month=date.getMonth()+1;
//             //if(month<10){
//             //	timeStr+="0";
//             //}
//             //timeStr+=month+"-";
//             //var day=date.getDate();
//             //if(day<10){
//             //	timeStr+="0";
//             //}
//             //timeStr+=day+" ";
//             //var hour=date.getHours();
//             //if(hour<10){
//             //	timeStr+="0";
//             //}
//             //timeStr+=hour+":";
//             //var minute=date.getMinutes();
//             //if(minute<10){
//             //	timeStr+="0";
//             //}
//             //timeStr+=minute+":";
//             //var second=date.getSeconds();
//             //if(second<10){
//             //	timeStr+="0";
//             //}
//             //timeStr+=second+" GMT";
//             //var gmtHours = -date.getTimezoneOffset()/60;
//             //var gmtMinutes=-date.getTimezoneOffset()%60;
//             //if(gmtHours<0){
//             //	timeStr+="-";
//             //}
//             //else{
//             //	timeStr+="+";
//             //}
//             //gmtHours=Math.abs(gmtHours);
//             //if(gmtHours<10){
//             //	timeStr+="0"
//             //}
//             //timeStr+=gmtHours+":";
//             //if(gmtMinutes<10){
//             //	timeStr+="0"
//             //}
//             //timeStr+=gmtMinutes;
//             //$("#"+this.domId).text(timeStr);
//         }
//     },
//     sysCurrentTimeAndOffset : {
//         domId:"currentTime",
//         tzOffset:0,
//         timemills:0,
//         setValue:function(systemInfo){
//             this.tzOffset=systemInfo.timezoneOffset;
//             var timeMethod = systemInfo.timeMethod;
//             var currentTime = systemInfo.currentTime;
//             var currentDateFromTheTimeZone;
//             currentDateFromTheTimeZone = new Date(currentTime);
//             this.timemills = currentDateFromTheTimeZone.getTime();
//             this.show();
//         },
//         refresh:function(period){
//             this.timemills+=period;
//             this.show();
//         },
//         show:function(){
//             var date=new Date();
//             date.setTime(this.timemills);
//             var timeStr = internationalFormatTime(date);
//             timeStr+=" GMT";
//             var timezoneoffsetStr = '';
//             var offset = parseFloat(this.tzOffset);
//             if(parseInt(this.tzOffset) == 0) {
//                 timezoneoffsetStr += '+00:00';
//             } else {
//                 if (offset > 0) {
//                     timezoneoffsetStr += '+';
//                 } else {
//                     timezoneoffsetStr += '-';
//                 }
//                 var intOff = Math.floor(offset);
//                 if (Math.abs(intOff) < 10) {
//                     timezoneoffsetStr += '0';
//                 }
//                 timezoneoffsetStr += Math.abs(intOff) + ':';
//                 if (this.tzOffset.indexOf('.') > -1) {
//                     timezoneoffsetStr += Math.abs((offset-intOff)*60);
//                 } else {
//                     timezoneoffsetStr += '00';
//                 }
//             }
//             timeStr += timezoneoffsetStr;
//             $("#"+this.domId).text(timeStr);
//         }
//     },
//     launchTime:{
//         domId:"launchTime",
//         period:0,
//         setValue:function(time){
//             if(typeof(time)=="object"){
//                 this.period=time[time.length-1];
//             }
//             else{
//                 this.period=time;
//             }
//             this.show();
//         },
//         refresh:function(period){
//             this.period+=period;
//             this.show();
//         },
//         show:function(){
//             var tmp=this.period;
//             tmp=parseInt(tmp/1000);
//             var second=tmp%60;
//             tmp=parseInt(tmp/60);
//             var minute=tmp%60;
//             tmp=parseInt(tmp/60);
//             var hour=tmp%24;
//             var day=parseInt(tmp/24);
//             var periodStr="";
//             if(day>0){
//                 periodStr+=day+$.i18n.prop('survey.js.day')+' ';
//             }
//             if(hour<10){
//                 periodStr+="0"+hour+":";
//             }
//             else{
//                 periodStr+=hour+":";
//             }
//             if(minute<10){
//                 periodStr+="0"+minute+":";
//             }
//             else{
//                 periodStr+=minute+":";
//             }
//             if(second<10){
//                 periodStr+="0"+second;
//             }
//             else{
//                 periodStr+=second;
//             }
//             $("#"+this.domId).text(periodStr);
//         }
//     },
//     version:{
//         domId:"softwareVersion",
//         init:function(){
//             var that=this;
//             $.ajax({
//                 type: "GET",
//                 url: "softwareVersion/query",
//                 dataType: "json",
//                 success: function(result){
//                     if(result.ret>=0){
//                         $("#"+that.domId).text(result.data.softwareVersion);
//                     }
//                 }
//             });
//         },
//         setValue:function(v){
//
//         }
//     },
//     conference:{
//         chart:null,
//         data:{},
//         setValue:function(data){
//             for(var key in data){
//                 this.data[key]=data[key];
//             }
//             this.show();
//
//         },
//         show:function(){
//             var options = this.chart.getOption();
//             options.title[0].text=$.i18n.prop('survey.js.NumberofConcurrentLicenses')+' '+(this.data.lisenceMCU?this.data.lisenceMCU+$.i18n.prop('survey.js.a'):'Unknown');
//
//             var data= new Array();
//             var usedName=$.i18n.prop('survey.js.unumber',this.data.mcu)+$.i18n.prop('survey.js.a');
//             var used={"name":usedName,"value":this.data.mcu};
//             var leftName=$.i18n.prop('survey.js.rest')+' '+(this.data.lisenceMCU?(this.data.lisenceMCU-this.data.mcu)+$.i18n.prop('survey.js.a'):0+$.i18n.prop('survey.js.a'));
//             data.push(used);
//             var left={"name":leftName,"value":0};
//             if(this.data.lisenceMCU){
//                 left.value=this.data.lisenceMCU-this.data.mcu;
//             }
//             data.push(left);
//             options.legend[0].data=[usedName,leftName];
//             options.series[0].data=data;
//             this.chart.setOption(options);
//             this.chart.hideLoading();
//             $("#conference_user").text(this.data.user);
//             $("#conference_num").text(this.data.num);
//         },
//         init:function(){
//             $('#showUserStatus').click(function(){
//                 main.pageInit(main.MAIN_DATA,"systemstatus",function(){
//                     $('#systemstatus a[href="#tab2"]').tab('show');
//                 })
//             });
//             $('#showConfStatus').click(function(){
//                 main.pageInit(main.MAIN_DATA, "systemstatus", function(){
//                     $('#systemstatus a[href="#liveMeeting"]').tab('show');
//                 })
//             });
//             this.chart=echarts.init(document.getElementById("lisence_pie"));
//             this.chart.setOption({
//                 title:{
//                     show:true,
//                     x:"50%",
//                     y:"60px",
//                     text:$.i18n.prop('survey.js.Portconcurrentlicense'),
//                     textStyle:{
//                         fontSize:14,
//                         fontWeight:'normal'
//                     }
//                 },
//                 color:[
//                     "#14e6ad", '#f1f1f1',
//                     '#ff7f50', '#12b5b0', '#87cefa', '#32cd32', '#6495ed',
//                     '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
//                     '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
//                     '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
//                 ],
//                 tooltip : {
//                     trigger: 'item',
//                     formatter: "{a} <br/>{b}"
//                 },
//
//                 legend: {
//                     orient : 'vertical',
//                     x : '50%',
//                     y:'90px',
//                     textStyle:{
//                         fontSize:14
//                     },
//                     data:[$.i18n.prop('survey.js.Currentlyused'),$.i18n.prop('survey.js.Remainingavailable')]
//                 },
//                 toolbox: {
//                     show : false
//                 },
//                 series : [
//                     {
//                         name:$.i18n.prop('survey.js.Portconcurrentlicense'),
//                         type:'pie',
//                         radius : ['60%', '75%'],
//                         center:['30%','50%'],
//                         itemStyle : {
//                             normal : {
//                                 shadowColor:'rgba(100, 100, 100, 0.3)',
//                                 shadowBlur:5,
//                                 shadowOffsetX:3,
//                                 shadowOffsetY:3,
//                                 label : {
//                                     show : false
//                                 }
//                             },
//                             emphasis : {
//                                 label : {
//                                     show : false
//                                 },
//                                 labelLine:{
//                                     show:true
//                                 }
//                             }
//                         },
//                         data:[
//                             {value:0, name:$.i18n.prop('survey.js.Currentlyused')},
//                             {value:0, name:$.i18n.prop('survey.js.Remainingavailable')}
//                         ]
//                     }
//                 ]
//             });
//         }
//     },
//     cpu:{
//         domId:"cpu_chart",
//         chart:null,
//         setValue:function(dataList){
//             var options = this.chart.getOption();
//             var data= options.series[0].data;
//             var lastData;
//             var rate;
//             for(var i=0;i<dataList.length;i++){
//                 lastData=dataList[i];
//                 rate=survey.formatDigital(lastData.usageRate);
//                 data.push(rate);
//             }
//             while(data.length<61){
//                 data.unshift(0);
//             }
//             while(data.length>61){
//                 data.shift();
//             }
//             options.title[0].text="CPU";//只显示cpu
//             this.chart.setOption(options);
//             this.chart.hideLoading();
//             var cpuInfo=lastData.curfreq/1000000000+" GHz("+rate+"%)";
//             $("#cpu_text").text(cpuInfo);
//         },
//         init:function(){
//             this.chart=echarts.init(document.getElementById("cpu_chart"));
//             this.chart.setOption({
//                 title : {
//                     show: true,
//                     x:"left",
//                     left: 40,
//                     text: 'CPU'
//                 },
//                 color:[
//                     "#00bdea", "#14e6ad", '#f1f1f1'
//                 ],
//                 tooltip : {
//                     trigger: 'axis',
//                     formatter: function (params) {
//                         var timeStr = !params[0].name? $.i18n.prop("survey.js.now") : $.i18n.prop("survey.js.before", params[0].name);
//                         return timeStr + "<br>" + params[0].seriesName+ ": " + params[0].data + "%";
//                     }
//                 },
//                 legend: {
//                     x:"center",
//                     y:"bottom",
//                     data:[$.i18n.prop('survey.js.userate')]
//                 },
//                 toolbox: {
//                     show : false
//                 },
//                 calculable : true,
//                 xAxis : [
//                     {
//                         type : 'category',
//                         boundaryGap : false,
//                         data : s60,
//                         axisLabel : {
//                             formatter: function (value) {
//                                 return !value? 0 : value + "s";
//                             },
//                             interval: 4
//                         },
//                         axisTick: {
//                             interval: 4
//                         }
//                     }
//                 ],
//                 yAxis : [
//                     {
//                         type : 'value',
//                         max: 100,
//                         axisLabel : {
//                             formatter: '{value}%'
//                         }
//                     }
//                 ],
//                 series : [
//                     {
//                         name:$.i18n.prop('survey.js.userate'),
//                         type:'line',
//                         data:[],
//                         areaStyle: {
//                             normal: {
//                                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                                     offset: 0,
//                                     color: '#c3e8f1'
//                                 }, {
//                                     offset: 1,
//                                     color: '#ffffff'
//                                 }])
//                             }
//                         },
//                         showSymbol: false,/*关闭显示标记图形*/
//                         animation: false/*关闭动画效果*/
// 						/*,
// 						 markPoint : {
// 						 data : [
// 						 {type : 'max', name: '$.i18n.prop('')'},
// 						 {type : 'min', name: '$.i18n.prop('')'}
// 						 ]
// 						 },
// 						 markLine : {
// 						 data : [
// 						 {type : 'average', name: '$.i18n.prop('')'}
// 						 ]
// 						 }*/
//                     }
//                 ]
//             });
//         }
//     },
//     mem:{
//         domId:"mem_chart",
//         chart:null,
//         setValue:function(dataList){
//             var options = this.chart.getOption();
//             var data= options.series[0].data;
//             var lastData;
//             var used;
//             for(var i=0;i<dataList.length;i++){
//                 lastData=dataList[i];
//                 used=survey.formatMem(lastData.used-lastData.cached);
//                 data.push(used);
//             }
//             while(data.length<61){
//                 data.unshift(0);
//             }
//             while(data.length>61){
//                 data.shift();
//             }
//             var total=survey.formatMem(lastData.total);
//             options.title[0].text=$.i18n.prop('survey.js.ram');//去掉内存大小
//             options.yAxis[0].max = total;
//             this.chart.setOption(options);
//             this.chart.hideLoading();
//             var memInfo=used+"/"+survey.formatMem(lastData.total)+"GB("+survey.formatDigital(used/total*100)+"%)";
//             $("#mem_text").text(memInfo);
//         },
//         init:function(){
//             this.chart=echarts.init(document.getElementById(this.domId));
//             this.chart.setOption({
//                 title : {
//                     show: true,
//                     x:"left",
//                     left: 40,
//                     text: $.i18n.prop('survey.js.ram')
//                 },
//                 color:[
//                     "#00bdea", "#14e6ad", '#f1f1f1'
//                 ],
//                 tooltip : {
//                     trigger: 'axis',
//                     formatter: function (params) {
//                         var timeStr = !params[0].name? $.i18n.prop("survey.js.now") : $.i18n.prop("survey.js.before", params[0].name);
//                         return timeStr + "<br>" + params[0].seriesName+ ": " + params[0].data;
//                     }
//                 },
//                 legend: {
//                     x:"center",
//                     y:"bottom",
//                     data:[$.i18n.prop('survey.js.useofram')]
//                 },
//                 toolbox: {
//                     show : false
//                 },
//                 calculable : true,
//                 xAxis : [
//                     {
//                         type : 'category',
//                         boundaryGap : false,
//                         data : s60,
//                         axisLabel : {
//                             formatter: function (value) {
//                                 return !value? 0 : value + "s";
//                             },
//                             interval: 4/*标签显示间隔*/
//                         },
//                         axisTick: {
//                             interval: 4/*刻度间隔*/
//                         }
//                     }
//                 ],
//                 yAxis : [
//                     {
//                         type : 'value'
//                     }
//                 ],
//                 series : [
//                     {
//                         name:$.i18n.prop('survey.js.useofram'),
//                         type:'line',
//                         data:[],
//                         areaStyle: {
//                             normal: {
//                                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                                     offset: 0,
//                                     color: '#c3e8f1'
//                                 }, {
//                                     offset: 1,
//                                     color: '#ffffff'
//                                 }])
//                             }
//                         },
//                         showSymbol: false,
//                         animation: false
// 						/*,
// 						 markPoint : {
// 						 data : [
// 						 {type : 'max', name: '$.i18n.prop('')'},
// 						 {type : 'min', name: '$.i18n.prop('')'}
// 						 ]
// 						 },
// 						 markLine : {
// 						 data : [
// 						 {type : 'average', name: '$.i18n.prop('')'}
// 						 ]
// 						 }*/
//                     }
//                 ]
//             });
//         }
//     },
//     network:{
//         domId:"network_chart",
//         unit: "Kbps",
//         chart:null,
//         data:[],
//         xaxis:s60,
//         series:{},
//         setValue:function(array){
//             for(var i=0;i<array.length;i++){
//                 this.data.push(array[i]);
//             }
//             while(this.data.length>62){
//                 this.data.shift();
//             }
//             var prevItem={};
//             for(var i=0;i<this.data[0].length;i++){
//                 var name=this.data[0][i].name;
//                 prevItem[name]=this.data[0][i];
//                 if(this.series[name]){
//                     this.series[name].outBytes.splice(0,this.series[name].outBytes.length);
//                     this.series[name].inBytes.splice(0,this.series[name].inBytes.length);
//                 }
//                 else{
//                     this.series[name]={inBytes:[],outBytes:[]};
//                     $("#network_if").append("<option value='"+name+"'>"+name+"</option>");
//                 }
//             }
//             for(var i=1;i<this.data.length;i++){
//                 var item={};
//                 for(var j=0;j<this.data[i].length;j++){
//                     var currIf=this.data[i][j];
//                     var name=currIf.name;
//                     item[name]=currIf;
//                     var lastIf=prevItem[name];
//                     if(lastIf){
//                         if(this.series[name]){
//                             var inBytes=survey.formatDigital((currIf.inBytes-lastIf.inBytes)*8/1024);
//                             var outBytes=survey.formatDigital((currIf.outBytes-lastIf.outBytes)*8/1024);
//                             this.series[name].inBytes.push(inBytes);
//                             this.series[name].outBytes.push(outBytes);
//                         }
//                         else{
//                             this.series[name]={inBytes:[],outBytes:[]};
//                             $("#network_if").append("<option value='"+name+"'>"+name+"</option>");
//                         }
//                     }
//                 }
//                 prevItem=item;
//             }
//             var totalIn=0,totalOut=0;
//             for(var key in this.series){
//                 var currIf=this.series[key];
//                 while(currIf.inBytes.length<61){
//                     currIf.inBytes.unshift(0);
//                 }
//                 while(currIf.outBytes.length<61){
//                     currIf.outBytes.unshift(0);
//                 }
//                 totalIn+=currIf.inBytes[60];
//                 totalOut+=currIf.outBytes[60];
//             }
//             var isMbps = totalIn >= 1024 || totalOut >= 1024;
//             if(totalIn>0){
//                 totalIn = isMbps?
//                     (survey.formatDigital(totalIn / 1024)+"Mbps") : (survey.formatDigital(totalIn) + "Kbps");
//             }
//             if(totalOut>0){
//                 totalOut = isMbps?
//                     (survey.formatDigital(totalOut / 1024)+"Mbps") : (survey.formatDigital(totalOut) + "Kbps");
//             }
//             $("#network_in").text(totalIn);
//             $("#network_out").text(totalOut);
//             this.show();
//         },
//         show:function(){
//             var options=this.chart.getOption();
//             var ifKey=$("#network_if").val();
//             //options.xAxis[0].data=this.xaxis;
//             options.series[0].data=this.series[ifKey].outBytes;
//             options.series[1].data=this.series[ifKey].inBytes;
//             var maxOut = Math.max.apply(null, options.series[0].data);
//             var maxIn = Math.max.apply(null, options.series[1].data);
//             this.unit = "Kbps";
//             if(maxOut >= 1024 || maxIn >= 1024) {
//                 this.unit = "Mbps";
//             }
//             $("#network_title").text($.i18n.prop("survey.html.port", this.unit));
//             this.chart.setOption(options);
//             this.chart.hideLoading();
//         },
//         init:function(){
//             $("#network_title").text($.i18n.prop("survey.html.port", this.unit));
//             this.chart=echarts.init(document.getElementById(this.domId));
//             this.chart.setOption({
//                 title : {
//                     show: false
//                 },
//                 tooltip : {
//                     trigger: 'axis',
//                     formatter: function (params) {
//                         var timeStr = !params[0].name? $.i18n.prop("survey.js.now") : $.i18n.prop("survey.js.before", params[0].name);
//                         var send = (survey.network.unit == "Mbps")?
//                             survey.formatDigital(params[0].data / 1024) : params[0].data;
//                         var rec = (survey.network.unit == "Mbps")?
//                             survey.formatDigital(params[1].data / 1024) : params[1].data;
//                         return timeStr + "<br>" +
//                             params[0].seriesName+ ": " + send + "<br>" +
//                             params[1].seriesName+ ": " + rec;
//                     }
//                 },
//                 grid:{
//                     y:25
//                 },
//                 color:[
//                     "#00bdea", "#14e6ad", '#f1f1f1'
//                 ],
//                 legend: {
//                     x:"center",
//                     y:"bottom",
//                     orient:'vertical',
//                     data:[$.i18n.prop('survey.js.send'),$.i18n.prop('survey.js.rec')]
//                 },
//                 toolbox: {
//                     show : false
//                 },
//                 calculable : true,
//                 xAxis : [
//                     {
//                         type : 'category',
//                         boundaryGap : false,
//                         data : s60,
//                         axisLabel : {
//                             formatter: function (value) {
//                                 return !value? 0 : value + "s";
//                             },
//                             interval: 4
//                         },
//                         axisTick: {
//                             interval: 4
//                         }
//                     }
//                 ],
//                 yAxis : [
//                     {
//                         type : 'value',
//                         axisLabel : {
//                             formatter: function (value, index) {
//                                 var formatVal = (survey.network.unit == "Mbps")?
//                                     survey.formatDigital(value / 1024) : value;
//                                 return formatVal;
//                             }
//                         }
//                     }
//                 ],
//                 series : [
//                     {
//                         name:$.i18n.prop('survey.js.send'),
//                         type:'line',
//                         data:[],
//                         showSymbol: false,
//                         animation: false
// 						/*,
// 						 markPoint : {
// 						 data : [
// 						 {type : 'max', name: '$.i18n.prop('')'},
// 						 {type : 'min', name: '$.i18n.prop('')'}
// 						 ]
// 						 },
// 						 markLine : {
// 						 data : [
// 						 {type : 'average', name: '$.i18n.prop('')'}
// 						 ]
// 						 }*/
//                     },
//                     {
//                         name:$.i18n.prop('survey.js.rec'),
//                         type:'line',
//                         data:[],
//                         showSymbol: false,
//                         animation: false
// 						/*,
// 						 markPoint : {
// 						 data : [
// 						 {type : 'max', name: '$.i18n.prop('')'},
// 						 {type : 'min', name: '$.i18n.prop('')'}
// 						 ]
// 						 },
// 						 markLine : {
// 						 data : [
// 						 {type : 'average', name: '$.i18n.prop('')'}
// 						 ]
// 						 }*/
//                     }
//                 ]
//             });
//         }
//     },
//     disk:{
//         domId:"diskInfo",
//         data:{},
//         setValue:function(dataList){
//             var lastData=dataList[dataList.length-1];
//             for(var key in lastData){
//                 this.data[key]=lastData[key];
//             }
//             this.show();
//         },
//         show:function(){
//             var options = this.chart.getOption();
//             var data= new Array();
//             var names=new Array();
//             options.title[0].text=survey.formatMem(this.data.total)+"GB";
//             var used=survey.formatMem(this.data.used);
//             var free=survey.formatMem(this.data.total-this.data.used)
//             names[0]=$.i18n.prop('survey.js.Usedspace')+":"+used+"GB";
//             names[1]=$.i18n.prop('survey.js.Availablespace')+":"+free+"GB";
//             data.push({"name":names[0],"value":used});
//             data.push({"name":names[1],"value":free});
//             options.legend[0].data=names;
//             options.series[0].data=data;
//             this.chart.setOption(options);
//             this.chart.hideLoading();
//         },
//         init:function(){
//             this.chart=echarts.init(document.getElementById("disk_chart"));
//             this.chart.setOption({
//                 title:{
//                     show:true,
//                     x:"center",
//                     y:"middle",
//                     text: '0G',
//                     subtext:$.i18n.prop('survey.js.Diskcapacity'),
//                     textStyle:{
//                         fontSize:30
//                     },
//                     subtextStyle:{
//                         fontSize:18
//                     }
//                 },
//                 color:[
//                     "#14e6ad", '#f1f1f1',
//                     '#ff7f50', '#12b5b0', '#87cefa', '#32cd32', '#6495ed',
//                     '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
//                     '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
//                     '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
//                 ],
//                 tooltip : {
//                     trigger: 'item',
//                     formatter: "{a}<br/>{b}({d}%)"
//                 },
//                 legend: {
//                     orient : 'vertical',
//                     x : 'center',
//                     y:'bottom',
//                     fontSize:'9px',
//                     data:[$.i18n.prop('survey.js.Usedspace'),$.i18n.prop('survey.js.Availablespace')]
//                 },
//                 toolbox: {
//                     show : false
//                 },
//                 series : [
//                     {
//                         name:$.i18n.prop('survey.js.Diskusage'),
//                         type:'pie',
//                         radius : ['60%', '80%'],
//                         itemStyle : {
//                             normal : {
//                                 shadowColor:'rgba(100, 100, 100, 0.3)',
//                                 shadowBlur:5,
//                                 shadowOffsetX:3,
//                                 shadowOffsetY:3,
//                                 label : {
//                                     show : false
//                                 }
//                             },
//                             emphasis : {
//                                 label : {
//                                     show : false
//                                 },
//                                 labelLine:{
//                                     show:true
//                                 }
//                             }
//                         },
//                         data:[
//                             {value:0, name:$.i18n.prop('survey.js.Usedspace')},
//                             {value:0, name:$.i18n.prop('survey.js.Availablespace')}
//                         ]
//                     }
//                 ]
//             });
//         }
//     },
//
//     serviceInfos:{
//         init:function(){
//             $('#m-ser-table').bootstrapTable({
//                 striped:true,
//                 sidePagination: "server",
//                 locale:getLan(),
//                 columns: [
//                     {
//                         field:'number',
//                         title:' ',
//                         align:'left',
//                         width:50,
//                         formatter: function(value,row,index){
//                             return index + 1;
//                         }
//                     },
//                     {
//                         field: 'name',
//                         title: $.i18n.prop('survey.js.servicename')
//                     }, {
//                         field: 'status',
//                         title: $.i18n.prop('survey.js.servicests'),
//                         formatter:function(value,row,index){
//                             if (value == 0){
//                                 return $.i18n.prop('survey.js.notstarted');
//                             }else {
//                                 return $.i18n.prop('survey.js.started');
//                             }
//                         }
//                     }
//                 ],
//                 pagination:false,
//                 url: 'serviceInfos/query',
//                 method: 'get',
//                 onLoadSuccess:function(data){
//                     //console.log(data);
//                 }
//             });
//         },
//         refresh:function(){
//             $('#m-ser-table').bootstrapTable("refresh");
//         }
//     },
//     resize:function(){
//         var width=$("#tab11").width();
//         $("#cpu_chart").width(width);
//         $("#mem_chart").width(width);
//         $("#network_chart").width(width);
//         if(survey.cpu.chart){
//             survey.cpu.chart.resize();
//         }
//         if(survey.mem.chart){
//             survey.mem.chart.resize();
//         }
//         if(survey.network.chart){
//             survey.network.chart.resize();
//         }
//     },
//     init:function(){
//         survey.serviceInfos.init();
//         survey.version.init();
//         //$.i18n.prop('')lisence$.i18n.prop('')，$.i18n.prop('')
//         survey.licenseInfo.init();
//         survey.conference.init();
//         survey.cpu.init();
//         survey.mem.init();
//         survey.network.init();
//         survey.disk.init();
//         setTimeout("survey.resize()",500);
//         $("#network_if").change(function(){survey.network.show();})
//         $(window).unbind("resize").bind("resize",function(){
//             if(survey){
//                 survey.resize();
//             }
//         });
//
//         $.ajax({
//             type: "GET",
//             url: "conferenceStatus/query",
//             dataType: "json",
//             success: function(result){
//                 if(result.ret>=0){
//                     for(var key in result.data){
//                         survey[key].setValue(result.data[key]);
//                     }
//                 }
//                 $.ajax({
//                     type: "GET",
//                     url: "systemStatus/query?offset=0",
//                     dataType: "json",
//                     success: function(result){
//                         if(result.ret>=0){
//                             var subArray=survey.parseArrayData(result.data);
//                             for(var key in subArray){
//                                 survey[key].setValue(subArray[key]);
//                             }
//                         }
//                         survey.timerTask=setInterval("survey.secondJob()",1000);
//                     }
//                 });
//             }
//         });
//         $.ajax({
//             type: "GET",
//             url: "systemStatus/systime",
//             dataType: "json",
//             success: function(result){
//                 survey.sysCurrentTimeAndOffset.setValue(result.data);
//             }
//         });
//
//     },
//     onDestory:function(){
//         if(survey.timerTask){
//             console.log("destroy timer");
//             clearInterval(survey.timerTask);
//             survey.timerTask=null;
//         }
//         if(survey.conference.chart){
//             survey.conference.chart.dispose();
//             survey.conference.chart=null;
//         }
//         if(survey.cpu.chart){
//             survey.cpu.chart.dispose();
//             survey.cpu.chart=null;
//         }
//         if(survey.mem.chart){
//             survey.mem.chart.dispose();
//             survey.mem.chart=null;
//         }
//         if(survey.disk.chart){
//             survey.disk.chart.dispose();
//             survey.disk.chart=null;
//         }
//         if(survey.network.chart){
//             survey.network.chart.dispose();
//             survey.network.chart=null;
//         }
//     },
//     lastTime:0,
//     secondJob:function(){
//         $("#text_second").text((9-survey.intervalCount)+"s");
//         survey.sysCurrentTimeAndOffset.refresh(1000);
//         survey.launchTime.refresh(1000);
//         if(++survey.intervalCount%10==0){
//             survey.serviceInfos.refresh();
//             survey.intervalCount=0;
//             var that=this;
//             $.ajax({
//                 type: "GET",
//                 url: "systemStatus/query?offset="+this.lastTime,
//                 dataType: "json",
//                 success: function(result){
//                     if(result.ret>=0){
//                         var subArray=that.parseArrayData(result.data);
//                         for(var key in subArray){
//                             survey[key].setValue(subArray[key]);
//                         }
//                     }
//                 }
//             });
//             $.ajax({
//                 type: "GET",
//                 url: "conferenceStatus/query",
//                 dataType: "json",
//                 success: function(result){
//                     if(result.ret>=0){
//                         for(var key in result.data){
//                             survey[key].setValue(result.data[key]);
//                         }
//                     }
//                 }
//             });
//
//         }
//
//     },
//     parseArrayData:function(dataList){
//         var ret={};
//         for(var i=0;i<dataList.length;i++){
//             var data=dataList[i];
//             if(this.lastTime<data.currentTime){
//                 this.lastTime=data.currentTime;
//             }
//             for(var key in data){
//                 if(!ret[key]){
//                     ret[key]=new Array();
//                 }
//                 ret[key].push(data[key]);
//             }
//         }
//         return ret;
//     }
// }
