var disksetting = {
	lockFlag:false,
	recordDefaultVolume : 10,
	serverlogDefaultVolume : 5,
	termlogDefaultVolume : 5,
	backDefaultVolume : 5,
	termromDefaultVolume : 5,
	serverAvailVolume : 0,
	serverTotalVolume : 0,
	serverDiskChart : null,
	transferBarCalInterval : null,
	oldDefaultPath : '',
	usedVolume : [],
	init:function(){
		disksetting.lockFlag = false;
		var _self = this;

		//初始化国际化
		var language = window['getLan'] ? getLan() : 'en-US';
		if (language == 'en-US' || language == 'en') {
			$('.disk-language-en').show();
			$('.disk-language-zh').hide();
			$('.m-disks-input-sub').css('padding-left','40px');
		} else {
			$('.disk-language-en').hide();
			$('.disk-language-zh').show();
		}

		// 初始化饼图
		_self.initChart();

		// 增加自定义linux路径格式 校验
		$.validator.addMethod("checkLinuxPath",function(value,element,params){
			var checkLinuxPath = /^([\/][\w-]+)*$/;
			return this.optional(element)||(checkLinuxPath.test(value));
		},$.i18n.prop('disksetting.js.input.rightRoot')); //请输入正确的路径

		// 初始化默认值
		$('#recordDefaultVolume').text(_self.recordDefaultVolume);
		$('#serverlogDefaultVolume').text(_self.serverlogDefaultVolume);
		$('#termDefaultVolume').text(_self.termlogDefaultVolume);
		$('#backDefaultVolume').text(_self.backDefaultVolume);
		$('#termromDefaultVolume').text(_self.termromDefaultVolume);
		// 各个总容量
		var totalVolume = [];

		// 从数据库获取数据
		$.post('disksetting/query', {type: 'diskConfig'}, function (result) {
			if (result && result.ret >= 0) {
				var dd = result.rows.data;
				$('.m-disks [name="defaultPath"]').val(dd.defaultPath);
				$('.m-disks [name="callRecord"]').val(dd.callRecord);
				$('#callRecordVolume').text(dd.callRecord);
				$('.m-disks [name="serverLog"]').val(dd.serverLog);
				$('#serverlogVolume').text(dd.serverLog);
				$('.m-disks [name="termLog"]').val(dd.termLog);
				$('#termlogVolume').text(dd.termLog);
				$('.m-disks [name="backup"]').val(dd.backup);
				$('#backTotalVolume').text(dd.backup);
				$('.m-disks [name="termFirmware"]').val(dd.termFirmware);
				$('#termromVolume').text(dd.termFirmware);
				$('.m-disks [name="diskUpdateTime"]').val(result.rows.updateTime);
				disksetting.oldDefaultPath = dd.defaultPath;

				var serverlogRatioArr = disksetting.getServerlogRatio(dd.serverlogRatio);
				$('.m-disks [name="webVolumeRatio"]').val(serverlogRatioArr[0]);
				$('.m-disks [name="fsVolumeRatio"]').val(serverlogRatioArr[1]);
				$('.m-disks [name="mcuVolumeRatio"]').val(serverlogRatioArr[2]);
				$('.m-disks [name="turnVolumeRatio"]').val(serverlogRatioArr[3]);

				totalVolume = [dd.callRecord,
					dd.serverLog,
					dd.termLog,
					dd.backup,
					dd.termFirmware];
				var serverlogSubTotalVolume = disksetting.getServerLogSubVolume(dd.serverLog, dd.serverlogRatio);
				for (var i=0; i<serverlogSubTotalVolume.length; i++) {
					totalVolume.splice(2+i,0,serverlogSubTotalVolume[i]);
				}

				if (dd.mailNotice) {
					$('.m-disks [name="mailNotice"]').prop('checked', true);
				}

				// 获取服务器容量信息
				var serverVolumeObj = result.rows.serverVolume;
				_self.decroateChart(serverVolumeObj);
				_self.serverTotalVolume = parseFloat(serverVolumeObj.serverVolume).toFixed(0);
				_self.serverAvailVolume = parseFloat(serverVolumeObj.serverAvailVolume).toFixed(2);

				disksetting.usedVolume = [serverVolumeObj.recordUsedVolume,
					serverVolumeObj.serverlogUsedVolume,
					serverVolumeObj.webUsedVolume,
					serverVolumeObj.fsUsedVolume,
					serverVolumeObj.mcuUsedVolume,
					serverVolumeObj.turnUsedVolume,
					serverVolumeObj.termlogUsedVolume,
					serverVolumeObj.backUsedVolume,
					serverVolumeObj.termromUsedVolume];

				$('#callRecordAvailVolume').text(serverVolumeObj.recordAvailVolume.toFixed(2));
				$('#serverlogAvailVolume').text(serverVolumeObj.serverlogAvailVolume.toFixed(2));
				$('#termlogAvailVolume').text(serverVolumeObj.termlogAvailVolume.toFixed(2));
				$('#backAvailVolume').text(serverVolumeObj.backAvailVolume.toFixed(2));
				$('#termromAvailVolume').text(serverVolumeObj.termromAvailVolume.toFixed(2));
				$('#webLogAvailVolume').text((serverlogSubTotalVolume[0]-serverVolumeObj.webUsedVolume).toFixed(2));
				$('#fsLogAvailVolume').text((serverlogSubTotalVolume[1]-serverVolumeObj.fsUsedVolume).toFixed(2));
				$('#mcuLogAvailVolume').text((serverlogSubTotalVolume[2]-serverVolumeObj.mcuUsedVolume).toFixed(2));
				$('#turnserverLogAvailVolume').text((serverlogSubTotalVolume[3]-serverVolumeObj.turnUsedVolume).toFixed(2));
				$('#webLogVolume').text(serverlogSubTotalVolume[0]);
				$('#fsLogVolume').text(serverlogSubTotalVolume[1]);
				$('#mcuLogVolume').text(serverlogSubTotalVolume[2]);
				$('#turnserverLogVolume').text(serverlogSubTotalVolume[3]);

				//初始化百分比
				var rateArr = new Array(totalVolume.length);
				for (var i=0; i<totalVolume.length; i++) {
					rateArr[i] = _self.initRate(totalVolume[i],disksetting.usedVolume[i]);
				}

				$(".m-disk-progress-rate").each(function(i,val){
					$(this).parent().find('.progress-bar').css('width', rateArr[i]+'%');
					// 超过100设置红色
					if (rateArr[i] > 100) {
						$(this).html('<span style="color: red">'+rateArr[i]+'%'+'</span>');
					} else {
						$(this).html('<span style="color: #616161">'+rateArr[i]+'%'+'</span>');
					}
				});

				// 加入验证
				disksetting.initValidateSave();

			} else {
				alertPromptMsgDlg($.i18n.prop('disksetting.js.dataLoad.fail'),3);
			}
		});

		// 目录浏览
		_self.ServerDir.init();
		// 浏览服务器目录
		$('#browseDirBtn').click(function(e){
			_self.ServerDir.showLoad();
		});
		// 默认路径绑定
		$('#defaultPath').off('change').on('change',function(){
			var nowDefaultPath = encodeURI($(this).val());
			$.get('disksetting/serverVolume', {'serverPath' : nowDefaultPath}, function (result) {
				if (result && result.ret >= 0) {
					var serverVolumeObj = result.rows;
					disksetting.decroateChart(serverVolumeObj);
					disksetting.serverTotalVolume = parseFloat(serverVolumeObj.serverVolume).toFixed(0);
					disksetting.serverAvailVolume = parseFloat(serverVolumeObj.serverAvailVolume).toFixed(2);
					// 更新验证
					disksetting.updataFormValidate();
				}
			});
			disksetting.lockFlag = true;
		});
		$('#callRecord,#serverLog,#termLog,#backup,#termFirmware').off('change').on('change',function(){
			disksetting.lockFlag = true;
			disksetting.updataFormValidate($(this).attr('id'));
		});
		// 服务器日志详情点击 显示子项目
		$('.m-disk-server-sub-guide').click(function(e){
			var subModuleDiv = $('#serverlogSubModuleTbody');
			if(subModuleDiv.is(":hidden")){
				subModuleDiv.show();
				$('.m-disk-server-sub-guide').addClass('dropup');
			} else {
				subModuleDiv.hide();
				$('.m-disk-server-sub-guide').removeClass('dropup');
			}
		});
		// 立即清理按钮
		$('.m-disk-btn-clear input').click(function(e){
			disksetting.clearDiskInfo($(this).attr('tp'), $(this).attr('tpname'));
		});
	},
	initRate : function(total, used) {
        used = used.toFixed(2);
		var rate = 0;
		try {
			rate = parseFloat(used)*100/parseFloat(total);
			rate = rate.toFixed(2);
		} catch(e){
			alertPromptMsgDlg(e,3);
		}
		return rate;
	},
	getServerLogSubVolume : function(serverlogVolume, serverlogRatios) {
		var serverlogRatioArr = disksetting.getServerlogRatio(serverlogRatios);
		var serverlogSubVolume = new Array(4);
		for (var i=0; i<4; i++) {
			serverlogSubVolume[i]=(serverlogVolume*serverlogRatioArr[i]/100).toFixed(2);
		}
		return serverlogSubVolume;
	},
	getServerlogRatio : function(serverlogRatios){
		var initRatio = 25;
		var webRatio = initRatio;
		var fsRatio = initRatio;
		var mcuRatio = initRatio;
		var turnRatio = initRatio;
		if (serverlogRatios && serverlogRatios.web) {
			webRatio = serverlogRatios.web;
			fsRatio = serverlogRatios.fs;
			mcuRatio = serverlogRatios.mcu;
			turnRatio = serverlogRatios.turn;
		}
		return [webRatio,fsRatio,mcuRatio,turnRatio];
	},
	clearDiskInfo : function(tp, tpname){
		var confirmMsg = $.i18n.prop('disksetting.js.tips.delete')+'['+tpname+"],"+$.i18n.prop('disksetting.js.tips.confirm');
		alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),confirmMsg,$.i18n.prop('global.js.ok'), function () {
			$('#ds_clearBtnDiv_'+tp).showLoading();
			$.ajax({
				type: "get",
				url: 'disksetting/deldiskdata?tp='+tp,
				success: function (data) {
					// 隐藏滚动条
					$('#ds_clearBtnDiv_'+tp).hideLoading();
					if (data.ret >= 0) {
						// 成功
						$('#ds_clear_msginfo_'+tp).text($.i18n.prop('disksetting.js.msg.delsucc'));
						// 刷新下
						disksetting.init();
					} else {
						// 失败
						$('#ds_clear_msginfo_'+tp).text($.i18n.prop('disksetting.js.msg.delfail'));
					}
					// 2秒后把清理消息提示删掉
					setTimeout(function(){
						$('#ds_clear_msginfo_'+tp).text('');
					}, 2000);
				}
			});
		});
	},
	initChart : function() {
		this.serverDiskChart=echarts.init(document.getElementById("serverDiskPie"));
		this.serverDiskChart.setOption({
			title:{
				text : '',
				left:'center',
				top:'35',
				show:true,
				textStyle:{
					fontSize:30,
					color : '#616161'
				},
				subtext:$.i18n.prop('disksetting.js.diskSpace'),
				subtextStyle:{
					fontSize:12,
					color:'#000'
				}
			},
			color:[
				"#14e6ad", '#f1f1f1',
				'#ff7f50', '#12b5b0', '#87cefa', '#32cd32', '#6495ed',
				'#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
				'#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
				'#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
			],
			tooltip : {
				trigger: 'item',
				formatter: "{a}<br/>{b}({d}%)"
			},
			legend: {
				orient : 'horizontal',
				x : 'center',
				y:'bottom',
				fontSize:'8px',
				itemWidth:15,
				data:[$.i18n.prop('disksetting.js.hasUse'),$.i18n.prop('disksetting.js.canUse')]
			},
			toolbox: {
				show : false
			},
			series : [
				{
					name:$.i18n.prop('disksetting.js.serverSpace'),
					type:'pie',
					radius : ['60%', '75%'],
					center: ['50%', '40%'],
					itemStyle : {
						normal : {
							shadowColor:'rgba(100, 100, 100, 0.3)',
							shadowBlur:5,
							shadowOffsetX:3,
							shadowOffsetY:3,
							label : {
								show : false
							}
						},
						emphasis : {
							label : {
								show : false
							},
							labelLine:{
								show:true
							}
						}
					},
					data:[
						{value:0, name:$.i18n.prop('disksetting.js.hasUse')},
						{value:0, name:$.i18n.prop('disksetting.js.canUse')}
					]
				}
			]
		});
	},
	decroateChart : function(serverVolumeObj) {
		var options = disksetting.serverDiskChart.getOption();
		var data= new Array();
		var names = new Array();
		var total = serverVolumeObj.serverVolume;
		var free = serverVolumeObj.serverAvailVolume;
		var used = (total-free).toFixed(0);

		names[0]=$.i18n.prop('disksetting.js.hasUse')+":"+used+"G";
		names[1]=$.i18n.prop('disksetting.js.canUse')+":"+free+"G";
		var used={"name":names[0],"value":used};
		data.push(used);
		data.push({"name":names[1],"value":free});
		options.legend[0].data=names;
		options.series[0].data=data;
		options.title[0].text = total+'G';
		disksetting.serverDiskChart.setOption(options);
		disksetting.serverDiskChart.hideLoading();
	},
	getValidateRangeByType:function(type) {
		//根据类型获取该类型容量范围验证数组 第一个是最小，第二个最大
		var _self = disksetting;
		var ranges = [];

		if (type ==  'call') {
			ranges[0] = parseFloat(_self.recordDefaultVolume)<parseFloat(_self.usedVolume[0])?parseFloat(_self.usedVolume[0]):parseFloat(_self.recordDefaultVolume);
		} else if (type ==  'server') {
			ranges[0] = parseFloat(_self.serverlogDefaultVolume)<parseFloat(_self.usedVolume[1])?parseFloat(_self.usedVolume[1]):parseFloat(_self.serverlogDefaultVolume);
		} else if (type ==  'term') {
			ranges[0] = parseFloat(_self.termlogDefaultVolume)<parseFloat(_self.usedVolume[6])?parseFloat(_self.usedVolume[6]):parseFloat(_self.termlogDefaultVolume);
		} else if (type ==  'back') {
			ranges[0] = parseFloat(_self.backDefaultVolume)<parseFloat(_self.usedVolume[7])?parseFloat(_self.usedVolume[7]):parseFloat(_self.backDefaultVolume);
		} else if (type ==  'termfirm') {
			ranges[0] = parseFloat(_self.termromDefaultVolume)<parseFloat(_self.usedVolume[8])?parseFloat(_self.usedVolume[8]):parseFloat(_self.termromDefaultVolume);
		}

		var totalUsedVolume = parseFloat(_self.usedVolume[0]) + parseFloat(_self.usedVolume[1])
							+ parseFloat(_self.usedVolume[6]) + parseFloat(_self.usedVolume[7])
							+ parseFloat(_self.usedVolume[8]);
		var inputTotalVolume = _self.getInputVolume('call')
								+ _self.getInputVolume('server')
								+ _self.getInputVolume('term')
								+ _self.getInputVolume('back')
								+ _self.getInputVolume('termfirm');
		var curInputVol = _self.getInputVolume(type);

		ranges[1] = parseFloat(_self.serverAvailVolume)+totalUsedVolume-inputTotalVolume+curInputVol;
		return ranges;
	},
	getInputVolume: function(type){
		//获取输入的容量大小 不是数字或空的 返回默认容量
		var _self = disksetting;
		var inputVolume;
		var defaultVol;
		if (type ==  'call') {
			inputVolume = $.trim($('.m-disks [name="callRecord"]').val());
			defaultVol = _self.recordDefaultVolume;
		} else if (type ==  'server') {
			inputVolume = $.trim($('.m-disks [name="serverLog"]').val());
			defaultVol = _self.serverlogDefaultVolume;
		} else if (type ==  'term') {
			inputVolume = $.trim($('.m-disks [name="termLog"]').val());
			defaultVol = _self.termlogDefaultVolume;
		} else if (type ==  'back') {
			inputVolume = $.trim($('.m-disks [name="backup"]').val());
			defaultVol = _self.backDefaultVolume;
		} else if (type ==  'termfirm') {
			inputVolume = $.trim($('.m-disks [name="termFirmware"]').val());
			defaultVol = _self.termromDefaultVolume;
		}
		if (inputVolume == '') {
			inputVolume = defaultVol;
		} else {
			try {
				inputVolume = parseFloat(inputVolume);
			} catch (e) {
				inputVolume = defaultVol;
			}
		}
		return inputVolume;
	},
	updataFormValidate : function(id) {
		var _self = disksetting;
		$("#callRecord").rules("add",{
			range:[_self.getValidateRangeByType('call')[0], _self.getValidateRangeByType('call')[1]]
		});
		$("#serverLog").rules("add",{
			range:[_self.getValidateRangeByType('server')[0], _self.getValidateRangeByType('server')[1]]
		});
		$("#termLog").rules("add",{
			range:[_self.getValidateRangeByType('term')[0], _self.getValidateRangeByType('term')[1]]
		});
		$("#backup").rules("add",{
			range:[_self.getValidateRangeByType('back')[0], _self.getValidateRangeByType('back')[1]]
		});
		$("#termFirmware").rules("add",{
			range:[_self.getValidateRangeByType('termfirm')[0], _self.getValidateRangeByType('termfirm')[1]]
		});
		if (id) {
			$("#"+id).trigger('blur');
		} else {
			$("#callRecord").trigger('blur');
			$("#serverLog").trigger('blur');
			$("#termLog").trigger('blur');
			$("#backup").trigger('blur');
			$("#termFirmware").trigger('blur');
		}
	},
	initValidateSave:function() {
		var _self = disksetting;
		$("#diskSettingForm").validate({
			onsubmit:true,// 是否在提交是验证
			errorElement : 'span',
			errorClass : 'help-block',
			focusInvalid : false,
			rules: {
				defaultPath : {
					required : true,
					checkLinuxPath : true
				},
				callRecord : {
					required : true,
					digits : true,
					range:[_self.getValidateRangeByType('call')[0], _self.getValidateRangeByType('call')[1]]
				},
				serverLog : {
					required : true,
					digits : true,
					range:[_self.getValidateRangeByType('server')[0], _self.getValidateRangeByType('server')[1]]
				},
				termLog : {
					required : true,
					digits : true,
					range:[_self.getValidateRangeByType('term')[0], _self.getValidateRangeByType('term')[1]]
				},
				backup : {
					required : true,
					digits : true,
					range:[_self.getValidateRangeByType('back')[0], _self.getValidateRangeByType('back')[1]]
				},
				termFirmware : {
					required : true,
					digits : true,
					range:[_self.getValidateRangeByType('termfirm')[0], _self.getValidateRangeByType('termfirm')[1]]
				},
				webVolumeRatio :{
					digits : true,
					range:[1,100]
				},
				fsVolumeRatio :{
					digits : true,
					range:[1,100]
				},
				mcuVolumeRatio :{
					digits : true,
					range:[1,100]
				},
				turnVolumeRatio :{
					digits : true,
					range:[1,100]
				}
			},
			messages:{
				defaultPath : {
					required : $.i18n.prop('disksetting.js.defaultRoot.require'),
					checkLinuxPath : $.i18n.prop('disksetting.js.defaultRoot.invalidate')
				},
				callRecord : {
					required : $.i18n.prop('disksetting.js.commRec.require'),
					digits : $.i18n.prop('disksetting.js.commRec.int'),
					range: $.i18n.prop('disksetting.js.tips.range')
				},
				serverLog : {
					required : $.i18n.prop('disksetting.js.serverLogContainer.require'),
					digits : $.i18n.prop('disksetting.js.serverLogContainer.int'),
					range: $.i18n.prop('disksetting.js.tips.range')
				},
				termLog : {
					required :$.i18n.prop('disksetting.js.termLogContainer.require'),
					digits : $.i18n.prop('disksetting.js.termLogContainer.int'),
					range: $.i18n.prop('disksetting.js.tips.range')
				},
				backup : {
					required :$.i18n.prop('disksetting.js.backupContainer.require'),
					digits : $.i18n.prop('disksetting.js.backupContainer.int'),
					range: $.i18n.prop('disksetting.js.tips.range')
				},
				termFirmware : {
					required : $.i18n.prop('disksetting.js.termContainer.require'),
					digits : $.i18n.prop('disksetting.js.termContainer.int'),
					range: $.i18n.prop('disksetting.js.tips.range')
				},
				webVolumeRatio :{
					digits : $.i18n.prop('disksetting.js.msg.integer'),
					range:$.i18n.prop('disksetting.js.msg.volrange')
				},
				fsVolumeRatio :{
					digits : $.i18n.prop('disksetting.js.msg.integer'),
					range:$.i18n.prop('disksetting.js.msg.volrange')
				},
				mcuVolumeRatio :{
					digits : $.i18n.prop('disksetting.js.msg.integer'),
					range:$.i18n.prop('disksetting.js.msg.volrange')
				},
				turnVolumeRatio :{
					digits : $.i18n.prop('disksetting.js.msg.integer'),
					range:$.i18n.prop('disksetting.js.msg.volrange')
				}
			},
			highlight : function(element) {
				$(element).closest('div').addClass('has-error');
			},
			success : function(label) {
				label.closest('div').removeClass('has-error');
				label.remove();
			},
			errorPlacement : function(error, element) {
				element.parent('div').append(error);
			},
			submitHandler : function(form) {
				disksetting.save();
			},
			invalidHandler: function(form, validator) {
				return false;
			}
		});

		$('#diskSettingForm input').keypress(function(e) {
			if (e.which == 13) {
				return false;
			}
		});
	},
	save:function(){
		var dataObj = {};
		dataObj.defaultPath = encodeURI($('.m-disks [name="defaultPath"]').val());
		dataObj.callRecord = $('.m-disks [name="callRecord"]').val();
		dataObj.serverLog = $('.m-disks [name="serverLog"]').val();
		dataObj.termLog = $('.m-disks [name="termLog"]').val();
		dataObj.backup = $('.m-disks [name="backup"]').val();
		dataObj.termFirmware = $('.m-disks [name="termFirmware"]').val();
		dataObj.mailNotice = $('.m-disks [name="mailNotice"]').prop('checked');
		dataObj.updateTime = $('.m-disks [name="diskUpdateTime"]').val();
		dataObj.webVolumeRatio = $('.m-disks [name="webVolumeRatio"]').val();
		dataObj.fsVolumeRatio = $('.m-disks [name="fsVolumeRatio"]').val();
		dataObj.mcuVolumeRatio = $('.m-disks [name="mcuVolumeRatio"]').val();
		dataObj.turnVolumeRatio = $('.m-disks [name="turnVolumeRatio"]').val();

		//服务器日志子项目比例和必须是100
		if ((parseInt(dataObj.webVolumeRatio)+parseInt(dataObj.fsVolumeRatio)
				+parseInt(dataObj.mcuVolumeRatio)+parseInt(dataObj.turnVolumeRatio)) != 100) {
			alertPromptMsgDlg($.i18n.prop('disksetting.js.msg.totalhundred'), 3);
			return false;
		}


		var isPathChange = false;
		var confirmMsg = $.i18n.prop('disksetting.js.diskSetting.modify.sure');
		// 判断存储路径是否变更
		if ($('.m-disks [name="defaultPath"]').val() != disksetting.oldDefaultPath) {
			confirmMsg = $.i18n.prop('disksetting.js.tips.saveRoot.change');
			isPathChange = true;
		}
		alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),confirmMsg,$.i18n.prop('global.js.ok'), function () {

			// 迁移总数据大小
			var total = 0;
			$.ajax({
				type: "get",
				url: 'disksetting/getcurdirvolume?serverPath='+disksetting.oldDefaultPath,
				async : false,
				success: function (data) {
					if (data.ret >= 0) {
						try {
							total = data.rows;
						} catch(e){
						}
					}
				}
			});

			$.ajax({
				type: 'POST',
				url: 'disksetting/diskconfig',
				data: JSON.stringify(dataObj),
				dataType: "json",
				contentType: 'application/json',
				success: function (result) {
					if (result.ret >0) {
						// 刷新下
						disksetting.init();
						if (!isPathChange) {
							alertPromptMsgDlg($.i18n.prop('disksetting.js.modify.success'),1);
						}
					} else {
						if (isPathChange) {
							// 失败
							disksetting.showTransferedInfo(false);
						}
						alertPromptMsgDlg(result.message,3);
						disksetting.init();
					}
				},
				error: function () {
					alertPromptMsgDlg('error',1);
				}
			});

			if (isPathChange) {
				// 添加进度条
				disksetting.addTransferProgressBar(total);
			}
		});

	},
	getCurDirVolume:function(total){
		var nowDefaultPath = $('#defaultPath').val();
		var rate = -1;
		$.ajax({
			type: "get",
			url: 'disksetting/getcurdirvolume?serverPath='+nowDefaultPath,
			async : false,
			success: function (data) {
				if (data.ret >= 0) {
					try {
						rate = parseFloat(data.rows)*100/parseFloat(total);
						rate = rate.toFixed(2);
					} catch(e){
					}
				}
			}
		});
		return rate;
	},
	addTransferProgressBar:function(total){
		// 进度条
		$("#diskprogressBarModal").modal('show');
		$("#diskprogressBarFooter").css("display", "block");
		//隐藏错误提示窗口
		$("#diskTransferedSuccess").css("display", "none");
		$("#diskTransferedFail").css("display", "none");
		$("#progressValueshow").css("display", "");
		$('#progressValueshow').text('0%');
		$('#transferProgressDiv').css('width', '0%');
		$("#disktransferProgressId").css("display", "block");
		//进度条
		var progressTotal = 0;

		disksetting.transferBarCalInterval = setInterval(function () {
			progressTotal = disksetting.getCurDirVolume(total);
			if (progressTotal>=100) {
				// 成功
				disksetting.showTransferedInfo(true);
			} else if (progressTotal==-1) {
				// 失败
				disksetting.showTransferedInfo(false);
			}
			$('#transferProgressDiv').css('width', progressTotal + '%');
			$('#progressValueshow').text(progressTotal + '%');
		}, 1000);

	},
	showTransferedInfo:function(flag){
		clearInterval(disksetting.transferBarCalInterval);
		$("#disktransferProgressId").css("display", "none");
		$("#diskprogressBarFooter").css("display", "none");
		$("#progressValueshow").css("display", "none");
		if (flag) {
			$("#diskTransferedSuccess").css("display", "");
		} else {
			$("#diskTransferedFail").css("display", "");
		}
		setTimeout(function () {
			$("#diskprogressBarModal").modal('hide');
			if (flag) {
				alertPromptMsgDlg($.i18n.prop('disksetting.js.modify.success'),1);
			}
		},1000);
	},
	ServerDir:{
		showTreeObj : null,
		setting : {},
		serverPathName : 'defaultPath',
		browseDirModelName: 'browseDirModal',
		url : 'disksetting/browse',
		ztreeName : 'serverDirTree',
		// 初始化
		init:function(){
			this.showTreeObj = $('#'+this.ztreeName);
			this.setting = {
				view: {
					selectedMulti: false
				},
				check: {
					enable: true,
					autoCheckTrigger:false
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onDblClick: this.zTreeOnDblClick,
					onClick : this.zTreeOnlClick
				},
				check : {
					enable : false
				},
				async: {
					enable: true,
					url: this.url,
					autoParam:["id", "name"]
				}
			};
		},
		showLoad: function() {
			$("#"+this.browseDirModelName).modal('show');
			this.loadTree();
		},
		//异步加载树
		loadTree:function(){
			$.fn.zTree.init($(this.showTreeObj), this.setting);
		},
		// 双击获取返回目录
		zTreeOnDblClick: function(event, treeId, treeNode) {
			var _self = disksetting.ServerDir;
			if (treeNode) {
				//$("#"+_self.serverPathName).val(treeNode.id);
				//$("#"+_self.browseDirModelName).modal('hide');
			}
		},
		// 单击获取返回目录
		zTreeOnlClick: function(event, treeId, treeNode, clickFlag) {
			var _self = disksetting.ServerDir;
			$("#selectedServerDirPath").html(treeNode.id);
		},
		getSelectedServerPath: function() {
			var zTree = $.fn.zTree.getZTreeObj(this.ztreeName);
			var selectedNodes = zTree.getSelectedNodes();
			if (selectedNodes != null && selectedNodes.length > 0) {
				var treeNode = selectedNodes[0];
				$("#"+this.serverPathName).val(treeNode.id);
				$("#"+this.serverPathName).trigger('change');
				$("#"+this.browseDirModelName).modal('hide');
			}
		}
	}
}