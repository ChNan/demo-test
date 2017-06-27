var configback = {
	MAIN_TABLE_COLUMNS:[
		{
			field: 'ckbox',
			checkbox:true,
		},
		{
			field: 'fileName',
			title: $.i18n.prop('configback.js.fileName'),
			width: '40%',
			class: 'g-text-ellipsis',
            formatter: function(value, row, index) {
                return '<span title="'+value+'">' + value + '</span>';
            }
		}, {
			field: 'size',
			title: $.i18n.prop('configback.js.fileSize'),
			formatter:function(value,row,index){
				if (value == null || value == '') {
					return '';
				}
				return (value/(1024*1024)).toFixed(2);
			}
		}, {
			field: 'createTime',
            width: '25%',
			title: $.i18n.prop('configback.js.createDate'),
			formatter:function(value,row,index){
				return moment(value).format('YYYY/MM/DD HH:mm:ss');
			}
		}, {
			field: 'opr',
			title: $.i18n.prop('configback.js.opration'),
			formatter:function(value,row,index){
				return '<button class="m-cb-table-down m-btn-down" title="'+$.i18n.prop('configback.js.download')+'" ></button>'
					+'&nbsp;<button class="m-cb-table-reduce m-btn-reduce margin-left15" title="'+$.i18n.prop('configback.js.restore')+'" ></button>'
					+'&nbsp;<button class="m-cb-table-del m-btn-sgdel margin-left15" title="'+$.i18n.prop('configback.js.delete')+'" ></button>';
			},
			events:{
				'click button':function(e, value, row, index){
					////冒泡咯
					//switch ($(this).attr('class')){
					//	case 'm-cb-table-down':
					//		configback.download(row._id);
					//		break;
					//	case 'm-cb-table-reduce':
					//		configback.reduce(row._id);
					//		break;
					//	case 'm-cb-table-del':
					//		configback.remove(row._id);
					//		break;
					//}

					if($(this).hasClass('m-cb-table-down')){
						configback.download(row._id);
					}else if($(this).hasClass('m-cb-table-reduce')){
						configback.reduce(row._id);
					}else if($(this).hasClass('m-cb-table-del')){
						configback.remove(row._id);
					}

				}
			}
		}],
	init:function(){
		var _this = this;
		$('.m-header-btn button').off('click').on('click',function(){
			if($(this).hasClass('m-tau-addbtn')){
				configback.openAddModal();
			};
			if($(this).hasClass('m-tau-uploadbtn')){
				configback.openUploadModal();
			};
			if($(this).hasClass('m-tau-cogbtn')){
				configback.openConfigModal();
			};
		});

		var selpageSize = getTablePageSizeForBS('m-cb-table');
		$('#m-cb-table').bootstrapTable({
			striped:true,
            classes: 'table table-hover g-table-fixed',
			pagination:true,
			url: 'configback/query',
			method: 'post',
			sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
			pageNumber:1,            //初始化加载第一页，默认第一页
			pageSize: selpageSize,            //每页的记录行数（*）
			pageList: [10, 20, 50, 100],    //可供选择的每页的行数（*）
			locale:getLan(),
			columns: _this.MAIN_TABLE_COLUMNS,
			onLoadSuccess:function(data){

			}
		});

		$('.m-btn-batch-del').on('click',function(){
			configback.batchdel();
		});

		// 添加验证方法
		configback.addValidateMethod();
	},
	openAddModal:function(){
		var dd = moment().format('YYYYMMDD_HHmmss');
		$('#m-cb-add [name="fileName"]').val('Backup_'+dd);

		$('#m-cb-add .m-commit').off('click').on('click',function(){
			configback.submit();
		});

		$('#m-cb-add [name="fileName"]').on('blur',function(){
			var valid = configback.vaildateBackConfig('fileName');
		});
		$('#m-cb-add [name="fileName"]').trigger('blur');

		$('#m-cb-add').modal({
			show:true
		})
	},
	openUploadModal:function(){
		$('#m-cb-upload').modal({
			show:true
		})

		$('#m-cb-upload .m-commit').off('click').on('click',function(){
			configback.submitUpload();
		});

		$('#ff').val('');
		$('#importFileName').text($.i18n.prop("staffaccountmanage.js.upload.select.file"));
		$('#ff-error-div').html('');

		$('#ff').on('change',function(){
			if($(this).val()){
				$('#importFileName').text($(this).val())
			}else{
				$('#importFileName').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
			}
			var valid = configback.vaildateBackConfig('ff');
		});


		$('#browseBtn').on('click', function () {
			$('#ff').trigger('click');
		});

	},
	CUR_SEL_REPEAT:null,
	openConfigModal:function(){

		$('#m-cb-config [name="timedAutoBackup"]').off('change').on('change',function(){
			if($(this).prop('checked')){
				$('#m-cb-config .modal-content').css('height','420px');
				$('#m-cb-config .m-cb-config').show();
			}else{
				$('#m-cb-config .modal-content').css('height','235px');
				$('#m-cb-config .m-cb-config').hide();
			}
		});

		$.post('configback/queryconfig', {type: 'smtpConfig'}, function (result) {
			if(result.rows){
				var dd = result.rows.data;

				if(dd.timedAutoBackup){
					$('#m-cb-config [name="timedAutoBackup"]').prop('checked',true);
					$('#m-cb-config .modal-content').css('height','420px');
					$('#m-cb-config .m-cb-config').show();
					configback.changeSelectEvent(dd.repeat);
					$('#m-cb-config [name="date"]').val(dd.date);
					$('#m-cb-config [name="maxFiles"]').val(dd.maxFiles);


				}else{
					$('#m-cb-config [name="timedAutoBackup"]').prop('checked',false);
					$('#m-cb-config .modal-content').css('height','235px');
					$('#m-cb-config .m-cb-config').hide();
					$('#m-cb-config [name="maxFiles"]').val("3");
				}

				$('#m-cb-config').modal({
					show:true
				})
				$('#m-cb-config .m-commit').off('click').on('click',function(){
					configback.submitConfig();
				});


				$('#maxFiles').on('blur',function(){
					var valid = configback.vaildateBackConfig('maxFiles');
				});
				$('#maxFiles').trigger('blur');

			}else{
				alertPromptMsgDlg($.i18n.prop('configback.js.read.fail'),3);
			}
		});

		$('#m-cb-config .m-commit').off('click').on('click',function(){
			configback.submitConfig();
		});

	},
	changeSelectEvent:function(val){
		// 点击后样式修改
		$(".m-cb-round-sel-label a").each(function(){
			if ($(this).attr('round') == val) {
				$(this).find('span').attr('class','').addClass('m-cb-auto-round-span-sel');
			} else {
				$(this).find('span').attr('class','').addClass('m-cb-auto-round-span-not-sel');
			}
		});

		configback.CUR_SEL_REPEAT = val;

		var dd = [];
		var i = 1,j=0;
		//con计时器的第一天是星期日。
		var weekfmt = [$.i18n.prop('configback.js.Sunday'),$.i18n.prop('configback.js.Monday'),
			$.i18n.prop('configback.js.Tuesday'),$.i18n.prop('configback.js.Wednesday'),
			$.i18n.prop('configback.js.Thursday'),$.i18n.prop('configback.js.Friday'),$.i18n.prop('configback.js.Saturday')];
		switch (val){
			case 'month':
				for(;i<=28;i++){
					dd.push('<option value="'+i+'">'+i+'</option>');
				};
				dd.push('<option value="L-3">'+$.i18n.prop('configback.js.last3days')+'</option>');
				dd.push('<option value="L-2">'+$.i18n.prop('configback.js.last2days')+'</option>');
				dd.push('<option value="L">'+$.i18n.prop('configback.js.lastdays')+'</option>');
				break;
			case 'week':
				for(;i<8;i++){
					dd.push('<option value="'+i+'">'+weekfmt[i-1]+'</option>');
				};
				break;
			case 'day':
				for(;j<24;j++){
					dd.push('<option value="'+j+'">'+j+':00</option>');
				};
				break;
		}
		$('#m-cb-config [name="date"]').empty();
		$('#m-cb-config [name="date"]').append(dd.join())
	},
	addValidateMethod : function() {
		$.validator.addMethod("checkRequired", function(value,element,params){
			if ($.trim(value) == '') {
				return false;
			}
			return true;
		},'');
		$.validator.addMethod("checkTarFile", function(value,element,params){
			var targzRegex = /^.*(\.tar\.gz)$/;
			if (!targzRegex.test(value)) {
				return false;
			}
			return true;
		},'');
		$.validator.addMethod("checkDigitRange", function(value,element,params){
			var autoBack = $(params).prop('checked');
			if (!autoBack) {
				return true;
			}
			if ($.trim(value) == '') {
				return false;
			}
			var reg = /^\d+$/g;
			if (!reg.test(value)) {
				return false;
			}
			if (value < 1 || value > 30) {
				return false;
			}
			return true;
		},'');
		$.validator.addMethod("checkRequiredSpecial",function(value,element,params){
			var paramArr = params.split(",");
			if ($(paramArr[0]).prop('checked')) {
				return $.trim(value) != '';
			}
			return true;
		},'');
		$.validator.addMethod("checkFileNameSpecial", function(value,element,params){
			var fileNameRegex = /^[\w\.]{1,128}$/;
			if (!fileNameRegex.test(value)) {
				return false;
			}
			return true;
		},'');
		$.validator.addMethod("checkFileNameForPathSpecial", function(value,element,params){
			value = value.replace(/\\/g, '/');
			var fileNameArr = value.split('/');
			var fileNameRegex = /^[\w\.]{1,128}$/;
			if (!fileNameRegex.test(fileNameArr[fileNameArr.length-1].replace(/\.tar\.gz$/,''))) {
				return false;
			}
			return true;
		},'');

	},
	BACKCONFIG_VALIDATE_RULES : {
		fileName: {
			checkRequired : true,
			checkFileNameSpecial : true
		},
		ff: {
			checkRequired : true,
			checkTarFile : true,
			checkFileNameForPathSpecial : true
		},
		maxFiles : {
			checkRequiredSpecial : '#timedAutoBackup',
			checkDigitRange : '#timedAutoBackup'
		}
	},
	BACKCONFIG_VALIDATE_MESSAGES : {
		fileName: {
			checkRequired : $.i18n.prop('configback.js.fileName.notNull'),
			checkFileNameSpecial : $.i18n.prop('configback.js.filename.format')
		},
		ff: {
			checkRequired : $.i18n.prop('configback.js.file.notNull'),
			checkTarFile : $.i18n.prop('configback.js.file.tar'),
			checkFileNameForPathSpecial : $.i18n.prop('configback.js.filename.format')
		},
		maxFiles : {
			checkRequiredSpecial : $.i18n.prop('configback.js.max.notNull'),
			checkDigitRange : $.i18n.prop('configback.js.max.range')
		}
	},
	// 验证
	vaildateBackConfig:function(fileName){
		var rules = configback.BACKCONFIG_VALIDATE_RULES;
		var messages = configback.BACKCONFIG_VALIDATE_MESSAGES;
		var errorDivId = fileName + '-error-div';
		var curValue = $('#'+fileName).val();
		// 清空
		$('#'+errorDivId).html('');
		var validResult = true;
		for (var key in rules[fileName]) {
			if (!$.validator.methods[key].call(this,curValue,null,rules[fileName][key])) {
				validResult = false;
				$('#'+errorDivId).append(messages[fileName][key]);
				break;
			}
		}
		return validResult;
	},
	submit:function(){
		var fileName = $('#m-cb-add [name="fileName"]').val();
		var validate = configback.vaildateBackConfig('fileName');
		if (!validate) {
			return;
		}
		$('#m-cb-add .modal-content').showLoading();
		$.post('configback/add',{fileName:fileName},function(result){
			$('#m-cb-add .modal-content').hideLoading();
			if(result.ret >= 0 ){
				$('#m-cb-add').modal('hide');
				$('#m-cb-table').bootstrapTable('refresh');
			}else{
				alertPromptMsgDlg(result.message,3,function(){
					$('#m-cb-add [name="fileName"]').focus();
				});
			}
		},'json')

	},
	submitUpload:function(){
		var validate = configback.vaildateBackConfig('ff');
		if (!validate) {
			return;
		}

		$('#m-cb-upload').modal('hide');

		//显示进度条
		$('.progress-bar').css('width', '20%');
		$("#progressBarModal").modal('show');
		$(".progress").css("display", "");
		$("#progressBarFooter").css("display", "block");
		//隐藏错误提示窗口
		$("#sendMailTestSuccess").css("display", "none");
		$("#sendMailTestFail").css("display", "none");
		$("#authenticationFail").css("display", "none");
		$("#connectFail").css("display", "none");
		$("#progressValueshow").css("display", "");
		$('#progressValueshow').text('20%');

		setTimeout(function () {
			//假进度条
			var count = 12;
			var i = 1;
			var progressTotal = 20;
			var barCalc = setInterval(function () {
				if (i <= count - 7) {
					progressTotal = progressTotal + 10;
				} else if (i <= count - 4) {
					progressTotal = progressTotal + 5;
				} else if (i <= count) {
					progressTotal = progressTotal + 3;
				}
				$('.progress-bar').css('width', progressTotal + '%');
				$('#progressValueshow').text(progressTotal + '%');
				i++;
			}, 20000);

			$.ajaxFileUpload({
				url: 'configback/upload',
				type: 'post',
				secureuri: false, //一般设置为false
				fileElementId: 'ff', // 上传文件的id、name属性名
				dataType: 'application/json', //返回值类型，一般设置为json、application/json
				success: function(data, status){
					var res =  JSON.parse($(data).text()).ret;
					var message =  JSON.parse($(data).text()).message;
					var rows =  JSON.parse($(data).text()).rows;
					if(res >= 0 ){

						configback.restoreCallBackHandleSuccess(rows, barCalc);

					}else{
						// 失败
						configback.reduceProgressInfoCtl(false, barCalc);
						setTimeout(function(){
							$("#progressBarModal").modal('hide');
						},3000);
						if (message != null && message != '') {
							alertPromptMsgDlg(message, 3);
						}
					}
				}
			});
		}, 500);
	},
	submitConfig:function(){
		var data = {};
		data.timedAutoBackup = $('#m-cb-config [name="timedAutoBackup"]').prop('checked');
		if (data.timedAutoBackup) {
			data.repeat = configback.CUR_SEL_REPEAT;
			data.date =  $('#m-cb-config [name="date"]').val();
			data.maxFiles = $('#m-cb-config [name="maxFiles"]').val();
		}
		var validate = configback.vaildateBackConfig('maxFiles');
		if (!validate) {
			return;
		}

		$.post('configback/savecfg',data,function(result){
			if(result.ret >= 0 ){
				alertPromptMsgDlg(result.message,1,function(){
					$('#m-cb-config').modal('hide');
				});

			}else{
				alertPromptMsgDlg($.i18n.prop('configback.js.setting.fail'),3);
			}
		},'json')

	},
	batchdel:function(){

		var rows = $('#m-cb-table').bootstrapTable('getAllSelections');
		if(rows.length == 0 ){
			alertPromptMsgDlg($.i18n.prop('configback.js.choose.delete'),2);
			return;
		}
		//删除吧
		var ids = '';
		var flag = false;
		$.each(rows,function(){
			ids += ',' + this._id;
			if(this.latest){
				flag = true;
			}
		})
		ids = ids.substring(1);
		configback.remove(ids)
	},
	remove:function(ids){
		alertConfirmationMsgDlgDetail($.i18n.prop('configback.js.tip'),$.i18n.prop('configback.js.delete.sure'),$.i18n.prop('configback.js.ok'), function () {
			$.post('configback/delete',{ids:ids},function(result){
				if(result.ret >= 0 ){
					alertPromptMsgDlg(result.message,1,function(){
						$('#m-cb-table').bootstrapTable('refresh')
					});
				}else{
					alertPromptMsgDlg($.i18n.prop('configback.js.delete.fail'),3);
				}
			},'json')
		})
	},
	download:function(id){
		window.location.href = 'configback/'+id+'/download';
	}
	,
	reduce:function(id){
		alertConfirmationMsgDlgDetail($.i18n.prop('configback.js.tip'),$.i18n.prop('configback.js.restore.sure'),$.i18n.prop('configback.js.ok'), function () {
			//显示进度条
			$('.progress-bar').css('width', '20%');
			$("#progressBarModal").modal('show');
			$(".progress").css("display", "");
			$("#progressBarFooter").css("display", "block");
			//隐藏错误提示窗口
			$("#sendMailTestSuccess").css("display", "none");
			$("#sendMailTestFail").css("display", "none");
			$("#authenticationFail").css("display", "none");
			$("#connectFail").css("display", "none");
			$("#progressValueshow").css("display", "");
			$('#progressValueshow').text('20%');

			setTimeout(function () {
				//假进度条
				var count = 12;
				var i = 1;
				var progressTotal = 20;
				var barCalc = setInterval(function () {
					if (i <= count - 7) {
						progressTotal = progressTotal + 10;
					} else if (i <= count - 4) {
						progressTotal = progressTotal + 5;
					} else if (i <= count) {
						progressTotal = progressTotal + 3;
					}
					$('.progress-bar').css('width', progressTotal + '%');
					$('#progressValueshow').text(progressTotal + '%');
					i++;
				}, 20000);

				$.post('configback/reduce',{id:id},function(result){
					if(result.ret >= 0 ){

						configback.restoreCallBackHandleSuccess(result.rows, barCalc);

					}else{
						// 失败
						configback.reduceProgressInfoCtl(false, barCalc);
						setTimeout(function(){
							$("#progressBarModal").modal('hide');
						},3000);
						if (result.message != null && result.message != '') {
							alertPromptMsgDlg(result.message, 3);
						}
					}
				},'json');
			}, 500);
		});
	},
	REDUCE_UPDATE_NETCONFIG_SUCCFLAG : false,
	restoreCallBackHandleSuccess : function(result, barCalc) {
		// 还原成功处理
		setTimeout(function(){
			var hostArr = result.split(";");
			var newWebHost = hostArr[0];
			var tempWebHost = hostArr[1];

			//var webStarted = configback.isWebServerLive(tempWebHost);
			//while (!webStarted) {
			//	webStarted = configback.isWebServerLive(tempWebHost);
			//}
			// 更新重启
			configback.updateNetConfigAndRestart(tempWebHost);

			//判断是否执行完成
			var i=0;
			var timerCalc = setInterval(function(){

				// 每隔5秒 判断一下是否执行完成 或者执行超过5分钟就自动跳转
				if (configback.REDUCE_UPDATE_NETCONFIG_SUCCFLAG
				    || i==60) {
					clearInterval(timerCalc);

					// 等待10秒后 把进度条去掉显示重启操作系统中。。。
					setTimeout(function(){
						configback.reduceProgressInfoCtl(true, barCalc);
					}, 10000);
					// 等待1分钟后跳转
					setTimeout(function(){
						window.location.href = newWebHost;
					}, 1000*60);

				}
				i++;

			}, 5000);


		}, 1000);
	},
	reduceProgressInfoCtl:function(flag, barCalc){
		// 还原成功失败信息提示显示控制方法
		$(".progress").css("display", "none");
		$("#progressBarFooter").css("display", "none");
		$("#progressValueshow").css("display", "none");
		clearInterval(barCalc);
		if (flag) {
			$('#sendMailTestSuccess').show();
		} else {
			$('#sendMailTestFail').show();
		}
	},
	restart: function () {
		$.ajax({
			type: 'POST',
			url: 'netsetting/restart',
			data: null,
			dataType: "json",
			contentType: 'application/json',
			success: function (result) {
				if( result.ret >= 0 ) {
					setTimeout(function(){
						window.location.href = result.rows;
					},3000);
				}else{
					alertPromptMsgDlg(result.message, 3);
				}
			}
		});
	},
	updateNetConfigAndRestart: function (newWebHost) {
		// 更新还原后，需要更新服务器的一些配置
		var reqUrl = newWebHost+'/configback/updatenetAndStart';
		$.ajax({
			type: 'POST',
			url: reqUrl,
			data: null,
			dataType: "json",
			contentType: 'application/json',
			success: function (result) {
				configback.REDUCE_UPDATE_NETCONFIG_SUCCFLAG = true;
				if( result.ret >= 0 ) {
				}else{
					alertPromptMsgDlg(result.message, 3);
				}
			}
		});
	},
	isWebServerLive : function(newWebHost) {
		// 判断web服务是否存活
		var flag = false;
		var reqUrl = newWebHost+'/configback/testwebserverlive';
		$.ajax({
			type: 'post',
			url: reqUrl,
			data: null,
			dataType: "json",
			contentType: 'application/json',
			async : false,
			success: function (result) {
				flag = true;
			}
		});
		return flag;
	}
}

