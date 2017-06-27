var sysupdate = {
	init:function(){

		// 添加验证方法
		sysupdate.addValidateMethod();

		$.post('sysupdate/query', {}, function (result) {
			if (result && result.ret >= 0) {
				console.log(result.rows.version)
				$('#m-su-version').text(result.rows.version);
				$('#m-su-time').text(result.rows.time);
			} else {
				alertPromptMsgDlg($.i18n.prop('sysupdate.js.load.fail'),3);
			}
		});

		$('#ff').on('change',function(){
			if($(this).val()){
				$('#importFileName').text($(this).val())
			}else{
				$('#importFileName').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
			}
			var valid = sysupdate.vaildateBackConfig('ff');
		});

		$('.m-cancel').on('click',function(){
			$('#ff').val('');
			$('#importFileName').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
			$('#ff-error-div').text('')
		})

		$('.m-su .m-commit').on('click',function(){
			var validate = sysupdate.vaildateBackConfig('ff');
			if (!validate) {
				return;
			}
			// 验证 是否其它人在做升级或者磁盘设置
			var ret = sysupdate.workControl();
			if (ret == 1) {
				alertPromptMsgDlg($.i18n.prop('sysupdate.js.update.not.sametime'),2);
				return;
			} else if (ret == 2) {
				alertPromptMsgDlg($.i18n.prop('sysupdate.js.update.not.setting'),2);
				return;
			}

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
				}, 1000*60);

				var loginUrl="";
				$.ajax({
					type: "get",
					url: '/sysupdate/getloginurl',
					async : false,
					success: function (data) {
						if (data.ret >= 0) {
							loginUrl = data.rows;
						}
					}
				});

				// 设置升级状态
				sysupdate.startWork();
				$.ajaxFileUpload({
					url: '/sysupdate/update',
					type: 'post',
					secureuri: false, //一般设置为false
					fileElementId: 'ff', // 上传文件的id、name属性名
					dataType: 'application/json', //返回值类型，一般设置为json、application/json
					success: function(data, status){
					}
				});

				setTimeout(function () {
					if (loginUrl != '') {
						window.location.href = loginUrl;
					} else {
						window.location.reload();
					}
				},1000*60*5);

			}, 500);
		});

		$('#browseBtn').on('click', function () {
			$('#ff').trigger('click');
		});
	},
	addValidateMethod : function() {
		$.validator.addMethod("checkRequired", function(value,element,params){
			if ($.trim(value) == '') {
				return false;
			}
			return true;
		},'');
		$.validator.addMethod("checkTarFile", function(value,element,params){
			var subfix = value.substr(value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
			if (subfix != '.tar' && subfix != '.gz') {
				return false;
			}
			if (subfix == '.gz') {
				var substr = value.substr(0, value.lastIndexOf("."));
				var ttt = substr.substr(substr.lastIndexOf(".")).toLowerCase();
				if (ttt != '.tar') {
					return false;
				}
			}
			return true;
		},'');
	},
	SYSUPDATE_VALIDATE_RULES : {
		ff: {
			checkRequired: true,
			checkTarFile: true
		}
	},
	SYSUPDATE_VALIDATE_MESSAGES : {
		ff: {
			checkRequired : $.i18n.prop('sysupdate.js.file.notNull'),
			checkTarFile : $.i18n.prop('sysupdate.js.file.notTar')
		}
	},
	// 验证
	vaildateBackConfig:function(fileName){
		var rules = sysupdate.SYSUPDATE_VALIDATE_RULES;
		var messages = sysupdate.SYSUPDATE_VALIDATE_MESSAGES;
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
	workControl: function() {
		var ret = 0;
		var dataUrl = 'sysupdate/workcontrol';
		$.ajax({
			type: "get",
			url: dataUrl,
			async : false,
			success: function (data) {
				ret = data.ret;
			}
		});
		return ret;
	},
	startWork: function() {
		var ret = 0;
		var dataUrl = 'sysupdate/startwork';
		$.ajax({
			type: "get",
			url: dataUrl,
			async : false,
			success: function (data) {
				ret = data.ret;
			}
		});
		return ret;
	}
}