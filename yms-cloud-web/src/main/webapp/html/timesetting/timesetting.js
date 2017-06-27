var timesetting = {
	TIME_SETTING_INTERVAL : null,
	TIME_SETTING_CUR_TIMEMILLS : 0,
	init:function(){
		$('#saveTimes').click(function(){
			if(!timesetting.timeServerValidate()){
				return;
			}
			alertConfirmationMsgDlgDetail($.i18n.prop('timesetting.js.hint'),$.i18n.prop('timesetting.js.willaffect'),$.i18n.prop('timesetting.js.sure'),function(){
				timesetting.save();
			});
		});

		timesetting.addValidateMethod();
		var locale = {
			format: 'YYYY/MM/DD HH:mm:ss',
			"separator": " -222 ",
			"applyLabel": $.i18n.prop('timesetting.js.sure'),
			"cancelLabel": $.i18n.prop('timesetting.js.cancle'),
			"fromLabel": $.i18n.prop('timesetting.js.begintime'),
			"toLabel": $.i18n.prop('timesetting.js.endtime'),
			"customRangeLabel": $.i18n.prop('timesetting.js.customize'),
			"weekLabel": "W",
			"daysOfWeek": [$.i18n.prop('timesetting.js.day'), $.i18n.prop('timesetting.js.one'), $.i18n.prop('timesetting.js.two'), $.i18n.prop('timesetting.js.three'), $.i18n.prop('timesetting.js.four'), $.i18n.prop('timesetting.js.five'), $.i18n.prop('timesetting.js.six')],
			"monthNames": [$.i18n.prop('timesetting.js.January'), $.i18n.prop('timesetting.js.February'), $.i18n.prop('timesetting.js.March'), $.i18n.prop('timesetting.js.April'), $.i18n.prop('timesetting.js.May'), $.i18n.prop('timesetting.js.June'), $.i18n.prop('timesetting.js.July'), $.i18n.prop('timesetting.js.August'), $.i18n.prop('timesetting.js.September'), $.i18n.prop('timesetting.js.October'), $.i18n.prop('timesetting.js.November'), $.i18n.prop('timesetting.js.December')],
			"firstDay": 1
		};
		$('#m-ts-time').daterangepicker({
			//---$.i18n.prop('') 1.3.7 $.i18n.prop('')
			"format": 'YYYY/MM/DD HH:mm:ss',
			"timePicker12Hour" : false,//$.i18n.prop('')12$.i18n.prop('')
			"timePickerIncrement" : 1,
			"timePicker" : true,
			//---$.i18n.prop('') 1.3.7 $.i18n.prop('')
			"showDropdowns": true,
			"singleDatePicker": true,
			"timePicker": true,
			"timePicker24Hour": true,
			"timePickerSeconds": true,
			"applyClass" : "btn-yealink",
			locale: locale
		});

		$('.m-ts [name="timeMethod"]').off('change').on('change',function(){
			if($(this).val() == '0'){
				$('.m-ts-timemethod1').hide();
				$('.m-ts-timemethod0').show();
			}else{
				$('.m-ts-timemethod0').hide();
				$('.m-ts-timemethod1').show();
			}
		});

		// $.i18n.prop('')
		$.ajax({
			type: "get",
			url: 'timeZone/listWin',
			async : false,
			success: function (data) {
				if (data.ret >= 0) {
					var timeZoneList = data.rows;
					var timeZoneObj = $("#timeZone");
					timeZoneObj.empty();
					for (var i=0; i<timeZoneList.length; i++) {
                        var tzVal = timeZoneList[i].zoneId;
                        var tzLabel = getLan().indexOf("en") == -1 ? timeZoneList[i].cnZoneName : timeZoneList[i].usZoneName;
						timeZoneObj.append('<option value="'+tzVal+'">' +tzLabel+ '</option>');
					}
				}
			}
		});
		$.post('timesetting/query',{type:'timeConfig'},function(result){
			if(result && result.ret >=0){
				var timeMethod = result.rows.data.timeMethod;
				//var currentDateFromTheTimeZone = toTheTimeZoneTime(result.rows.timezoneOffset);
				var currentDateFromTheTimeZone = new Date(result.rows.currentTime);
				var currentTimeFromTheTimeZone = internationalFormatTime(currentDateFromTheTimeZone);
				timesetting.TIME_SETTING_CUR_TIMEMILLS = currentDateFromTheTimeZone.getTime();

				$('.m-ts [name="currentTime"]').html(currentTimeFromTheTimeZone);
				timesetting.startRefreshServerTimeTask();
				$('.m-ts [name="summerTime"]').val(result.rows.data.summerTime);
				$('.m-ts [value="'+timeMethod+'"]').trigger('click');

				$('#m-ts-time').data('daterangepicker').setStartDate(moment(currentTimeFromTheTimeZone).format('YYYY/MM/DD HH:mm:ss'));
				$('.m-ts [name="timeServer"]').val(result.rows.data.timeServer);
				$('.m-ts [name="timeZone"]').val(result.rows.data.winTimeZone);
                if(!result.rows.data.winTimeZone) {
                    var offsetLocale = new Date().getTimezoneOffset() * -60;
                    $('.m-ts [name="timeZone"] option[offset="' + offsetLocale + '"]:first').attr("selected", true);
                    if(offsetLocale == 8 * 3600) {
                        $('.m-ts [name="timeZone"] option[selected="selected"]').removeAttr("selected");
                        $('.m-ts [name="timeZone"]').val('China_Standard_Time');
                    }
                }
                $('.m-ts [name="timeZone"]').chosen({
                    search_contains: true,
                    width: "520px"
                });

			}else{
				alertPromptMsgDlg($.i18n.prop('timesetting.js.loadingfail'),3);
			}
		});

	},
	save:function(){

		var dataObj = {};
		dataObj.timeMethod = $('.m-ts [name="timeMethod"]:checked').val();
		dataObj.summerTime = $('.m-ts [name="summerTime"]').val()

		if(dataObj.timeMethod == '0'){
			if(timesetting.timeServerValidate()){
				dataObj.timeServer = $('.m-ts [name="timeServer"]').val();
				dataObj.winTimeZone =$('.m-ts [name="timeZone"]').val();
			}else {
				return false;
			}
		}else{
			dataObj.time = $('#m-ts-time').val();
		}

		// $.i18n.prop('')
		$('#timesettingAllDivid').showLoading();
		$.ajax({
			type: 'POST',
			url: 'timesetting/timeconfig',
			data:JSON.stringify(dataObj),
			dataType : "json",
			contentType: 'application/json',
			success: function(result){
				// $.i18n.prop('')
				$('#timesettingAllDivid').hideLoading();
				if (result && result.ret>=0){
					alertPromptMsgDlg($.i18n.prop('timesetting.js.savesucess'),1);

					//var currentDateFromTheTimeZone = toTheTimeZoneTime(result.rows.timezoneOffset);
					var currentDateFromTheTimeZone = new Date(result.rows.currentTime);
					var currentTimeFromTheTimeZone = internationalFormatTime(currentDateFromTheTimeZone);
					timesetting.stopServerTimeTask();
					timesetting.TIME_SETTING_CUR_TIMEMILLS = currentDateFromTheTimeZone.getTime();
					$('.m-ts [name="currentTime"]').html(currentTimeFromTheTimeZone);
					timesetting.startRefreshServerTimeTask();
					$('#m-ts-time').data('daterangepicker').setStartDate(moment(currentTimeFromTheTimeZone).format('YYYY/MM/DD HH:mm:ss'));

					if (result.ret == 99) {
						// 重启web服务
						alertPromptMsgDlg($.i18n.prop('timesetting.js.restart.tips'), 1, function(){
							netsetting.restart('timesettingAllDivid');
						});
					}
				}
			},
			error:function(){
				// $.i18n.prop('')
				$('#timesettingAllDivid').hideLoading();
				alertPromptMsgDlg($.i18n.prop('timesetting.js.changefail'),0);
			}
		});
	},
	timeServerValidate:function(){
		var res = $('#m-times-form').validate({
			errorElement : 'span',
			errorClass : 'help-block',
			focusInvalid : false,
			rules:{
				timeServer:{
					required:true,
					checkIpAndDn : true
				}
			},
			messages:{
				timeServer:{
					required:$.i18n.prop('timesetting.js.notempty'),
					checkIpAndDn : $.i18n.prop('timesetting.js.illegal')
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
				error.css('padding-left', '185px');
				error.css('margin-bottom', '1px');
				element.parent('div').prepend(error);
			}
		}).form();
		return res;
	},
	addValidateMethod:function(){
		// ����ip������ У��
		var checkDs = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
		var checkIp = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/;
		$.validator.addMethod("checkIpAndDn",function(value,element,params){
			return checkIp.test(value) || checkDs.test(value);
		},'');
	},
	startRefreshServerTimeTask : function() {
		timesetting.TIME_SETTING_INTERVAL = setInterval(function(){
			//定时刷新服务器当前时间
			timesetting.TIME_SETTING_CUR_TIMEMILLS += 1000;
			var newDate = new Date();
			newDate.setTime(timesetting.TIME_SETTING_CUR_TIMEMILLS);
			$('.m-ts [name="currentTime"]').html(internationalFormatTime(newDate));
		}, 1000);
	},
	stopServerTimeTask : function(){
		if (timesetting.TIME_SETTING_INTERVAL) {
			clearInterval(timesetting.TIME_SETTING_INTERVAL);
			timesetting.TIME_SETTING_INTERVAL = null;
		}
	},
	onDestory : function() {
		timesetting.stopServerTimeTask();
	}
}