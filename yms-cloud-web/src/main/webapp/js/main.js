$(function() {
	$( document ).ajaxComplete(function( event, request, settings ) {
		if(request.status == 401) {
			alertPromptMsgDlg($.i18n.prop('system.session.timeout.tips'), 3, returnLogin);
		}
	});

	//IE 789没有console。这里加进去空方法防止报错
	if (!window["console"]){
		window.console = {
			log:function(){

			},
			info:function(){

			},
			debug:function(){

			},
			error: function () {

			}
		};
	}
	readyLanguage();
	//console.log($.i18n.prop('main.js.hello','yeah'));
	main.init();
});
var templateCacheStore = {};

var main = {

	MAIN_MENU:'.g-main-menu',//main区域菜单栏目的选择器
	MAIN_DATA:'.g-main-data',//main区域数据栏目的选择器
	DEFAULT_URL_PATTEN:'html/{}/{}.html',//默认的URL地址适配
	WELCOME_PAGE_ITEM:'conferenceroom',//欢迎页因为有独立事件，做成跟普通的页面一样的处理,modofiy by sean 2016-10-12
	MENU_TREE_ITEM:'menutree',
	ERROR_PAGE_PATH:'html/error.html',//失败页不需要做其他操作，只做一个页面载入即可,
	currentMudule:null,//记录下上一次操作的模块对象，
	init:function(){
		main.globalEvent();
		main.loadWelcomePage();
		$('#index').off('click').on('click',function(){
			if(main.currentMudule && main.currentMudule.lockFlag){
				main.checkFormChange(function(){
					$('.g-main').show();
					$('.g-other').hide();
					main.loadWelcomePage();
				});
			}else{
				$('.g-main').show();
				$('.g-other').hide();
				main.loadWelcomePage();
			}


		})
		$('#m-error-login').click(function(){
			returnLogin();
		})

	},
	globalEvent:function(){
		$("#sys-symbol").off('click').on('click',function(e){
			main.loadWelcomePage();
		});
		$('.g-leftmenu li').off('click').on('click',function(e){
			var _this = $(this);
			function showdata(){
				$('.g-main').show();
				$('.g-other').hide();
				var itemText = $(_this).find('span').text();;

				if(!$(_this).hasClass('active')){
					//选中样式
					$(_this).siblings().removeClass('active');
					$(_this).addClass('active');
				}

				var itemName = $(_this).attr('name');
				if($(_this).hasClass('showMenu')){
					$(main.MAIN_DATA).css("margin-left","280px");
					$(main.MAIN_MENU).show(0,function(){
						main.menuInit(main.MENU_TREE_ITEM,itemText);
					})
				}else{
					$(main.MAIN_DATA).css("margin-left","0px");
					$(main.MAIN_MENU).hide(0, function () {
						//初始化页面载入事件,如果已选中，则刷新数据
						main.pageInit(main.MAIN_DATA,itemName,function(){
							//console.log('载入页面成功！');
						});
					})
				}
			}

			if(main.currentMudule && main.currentMudule.lockFlag){
				main.checkFormChange(showdata);
			}else{
				showdata()
			}
	    });
		$.ajaxSetup ({
			cache: false //close AJAX cache
		});
		$('#fastset').off('click').on('click',function(){
			if(main.currentMudule && main.currentMudule.lockFlag){
				main.checkFormChange(function(){
					window.location = '/wizard/init'
				});
			}else{
				window.location = '/wizard/init'
			}
		})
	},
	checkFormChange:function(callback){
		if(main.currentMudule.form){
			var canShowData= true;
			$.each(main.currentMudule.form,function(i,item){ // 每个模块内部，注册需要校验的表单，如果表单的内容发生了变化则弹出提示框
				if(formIsDirty(document.getElementById(item))){
					alertConfirmationMsgDlgDetail($.i18n.prop('conferenceplan.js.common.title.notice'),
						$.i18n.prop('system.operation.leave.tips'),
						$.i18n.prop('conferenceplan.js.common.btn.confirm'), function () {
						callback();
						main.currentMudule.lockFlag = false;
					})
					canShowData = false;
				}
			})
			if(canShowData)callback();
		}else{
			alertConfirmationMsgDlgDetail($.i18n.prop('conferenceplan.js.common.title.notice'),
				$.i18n.prop('system.operation.leave.tips'),
				$.i18n.prop('conferenceplan.js.common.btn.confirm'), function () {
				callback();
				main.currentMudule.lockFlag = false;
			})
		}
	},
	menuInit:function(menuName,itemName,successEvent){
		main.pageInit(main.MAIN_MENU,menuName,successEvent
			//,function(){
			//$('.m-mt-header h2').text(itemName);
			//}
		);
	},
	pageInit:function(objectSelector,itemName,successEvent){
		//回收上一个页面的资源
		if(main.currentMudule && ('onDestory' in main.currentMudule)){
			main.currentMudule.onDestory();
		}
		//处理url
		var url = main.DEFAULT_URL_PATTEN.split('{}').join(itemName)
		//载入页面
		$(objectSelector).hide().load(url + '?' + new Date().getMilliseconds(),function(responseText, textStatus, XMLHttpRequest){

			if(XMLHttpRequest.status != 200){
				//if(XMLHttpRequest.status == 0){
				//	alertPromptMsgDlg("无法连接服务器!", 3, returnLogin);
				//}else{
				//	main.loadErrorPage(objectSelector,XMLHttpRequest.status);
				//}
				$('.g-main').empty();
				$('.g-other').hide();
				var errotContetn = $('#g-error-server').html();
				$('.g-main').html(errotContetn);
			}else{
				var obj;
				try {
					obj = eval("("+itemName+")");
					main.currentMudule = obj;
				}catch(e){
					//console.log('该模块不存在需要自动执行的对象!')
				}
				if(obj){
					obj.init();
				}
				if(successEvent && (successEvent instanceof Function)){
					successEvent();
				}
			}
		}).show('fast');
	},
	loadWelcomePage:function(){
		$(main.MAIN_MENU).hide()
		$(main.MAIN_DATA).css("margin-left","0px");
		main.pageInit(main.MAIN_DATA,main.WELCOME_PAGE_ITEM,null);
        $('.g-leftmenu li').removeClass('active');
	},
	loadErrorPage:function(objectSelector,errorCode){
		$(objectSelector).hide().load(main.ERROR_PAGE_PATH).show('fast');
	}
}

var managerTableSelSizeCache = {};// 表格分页页数选择缓存。。。。。。。。。。。。。。。。。。。。

// var moduleModel = {
// 	onDestory:function(){
// 		console.log('destory');
// 	}
// }

