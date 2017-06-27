var restart = {
	init:function(){
		$('.m-btn-reset').off('click').on('click',function(){
			alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),$.i18n.prop('restart.js.reset.sure'),$.i18n.prop('global.js.ok'), function () {
				restart.reset();
			})
		})
		$('.m-btn-restat').off('click').on('click',function(){
			alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),$.i18n.prop('restart.js.restart.sure'),$.i18n.prop('global.js.ok'), function () {
				restart.restart();
			})
		})
	},
	reset:function(){
		var val = $('[name="conn"]:checked').val();

		$('#progressBarFooter').text($.i18n.prop('restart.js.reseting'))
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
			}, 5000);


			$.post('restart/reset', {type: val}, function (result) {
				$(".progress").css("display", "none");
				$("#progressBarFooter").css("display", "none");
				$("#progressValueshow").css("display", "none");

				clearInterval(barCalc);
				if(result.ret >= 0 ){
					$('#sendMailTestSuccess').show();
					$("#progressBarModal").modal('hide');
					if (result.ret == 99) {
						// 需要重启
						alertPromptMsgDlg($.i18n.prop('restart.js.tips.restart'), 1, function(){
							$.ajax({
								type: 'POST',
								url: 'netsetting/restart',
								data: null,
								dataType: "json",
								contentType: 'application/json',
								success: function (data) {
									if( data.ret >= 0 ) {
										alertPromptMsgDlg($.i18n.prop('restart.js.restart.success'), 1, function(){
											var url = window.location.href;
											var aa = url.split('//');
											var tmp =  aa[1];
											aa[1] = tmp.substring(0,tmp.indexOf('/')+1);
											if (aa[1].indexOf(":") != -1) {
												aa[1] = aa[1].substring(0,aa[1].indexOf(':'));
											}
											window.location.href = aa.join("//");
										});
									}else{
										alertPromptMsgDlg(data.message, 3);
									}
								}
							});
						});
					} else {
						if(val == '1'){
							var url = window.location.href;
							var aa = url.split('//');
							var tmp =  aa[1];
							aa[1] = tmp.substring(0,tmp.indexOf('/')+1);
							window.location.href = aa.join("//");
						}
					}
				}else{
					$('#sendMailTestFail').show();
					setTimeout(function () {
						$("#progressBarModal").modal('hide');
					},3000);
				}

			});
		}, 500);
	},
	restart:function(){

		$('#progressBarFooter').text($.i18n.prop('restart.js.restarting'))
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
			}, 1000*30);

			setTimeout(function () {
				window.location.reload();
			},1000*60*5);


			$.post('restart/restart', {type: 1}, function (result) {
				//提交restart的方法
			});
		}, 500);
	}
}