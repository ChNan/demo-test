var timesettingwizard = {
    defaultTimeServer: 'pool.ntp.org',
    TIME_SETTING_INTERVAL : null,
    TIME_SETTING_CUR_TIMEMILLS : 0,
    init:function(){
        $('#saveTimes').click(function(){
            timesettingwizard.save();
        });

        timesettingwizard.addValidateMethod();

        // 默认服务器域名
        $('.m-ts [name="timeServer"]').val(timesettingwizard.defaultTimeServer);

        $('#m-ts-time').daterangepicker({
            //---以下 1.3.7 兼容
            "format": 'YYYY/MM/DD HH:mm:ss',
            "timePicker12Hour" : false, //是否使用12小时制来显示时间
            "timePickerIncrement" : 1,
            "timePicker" : true,
            //---以上 1.3.7 兼容
            "showDropdowns": true,
            "singleDatePicker": true,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "applyClass" : "btn-yealink",
            locale: {
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
            }
        });

        $('.m-ts [name="timeMethod"]').off('click').on('click',function(){
            if($(this).val() == '0'){
                $('.m-ts-timemethod1').hide();
                $('.m-ts-timemethod0').show();
            }else{
                $('.m-ts-timemethod0').hide();
                $('.m-ts-timemethod1').show();
            }
        });

        // 同步获取时区列表
        $.ajax({
            type: "get",
            url: $('#projectContext').val()+'/timeZone/listWin',
            async : false,
            success: function (data) {
                if (data.ret >= 0) {
                    var timeZoneList = data.rows;
                    var timeZoneObj = $('.m-ts [name="timeZone"]');
                    timeZoneObj.empty();
                    for (var i=0; i<timeZoneList.length; i++) {
                        var tzVal = timeZoneList[i].zoneId;
                        var tzOffset = timeZoneList[i].utcOffset;
                        var tzLabel = getLan().indexOf("en") == -1 ? timeZoneList[i].cnZoneName : timeZoneList[i].usZoneName;
                        timeZoneObj.append('<option value="'+tzVal+'" offset="'+tzOffset+'">' +tzLabel+ '</option>');
                    }
                }
            }
        });
        var dataUrl = $('#projectContext').val()+'/timesetting/wizard/query';
        $.post(dataUrl,{type:'timeConfig'},function(result){
            if(result && result.ret >=0){
                var timeMethod = result.rows.data.timeMethod;
                //var currentDateFromTheTimeZone = toTheTimeZoneTime(result.rows.timezoneOffset);
                var currentDateFromTheTimeZone = new Date(result.rows.currentTime);
                var currentTimeFromTheTimeZone = internationalFormatTime(currentDateFromTheTimeZone);
                timesettingwizard.stopServerTimeTask();
                timesettingwizard.TIME_SETTING_CUR_TIMEMILLS = currentDateFromTheTimeZone.getTime();
                $('.m-ts [name="currentTime"]').val(currentTimeFromTheTimeZone);
                timesettingwizard.startRefreshServerTimeTask();
                $('.m-ts [name="summerTime"]').val(result.rows.data.summerTime);
                $('.m-ts [value="'+timeMethod+'"]').trigger('click');

                $('#m-ts-time').data('daterangepicker').setStartDate(moment(currentTimeFromTheTimeZone).format('YYYY/MM/DD HH:mm:ss'));
                $('.m-ts [name="timeServer"]').val(result.rows.data.timeServer);
                $('.m-ts [name="timeZone"]').val(result.rows.data.winTimeZone);
                if(!result.rows.data.winTimeZone) {
                    //var offsetLocale = new Date().getTimezoneOffset() * -60;
                    //$('.m-ts [name="timeZone"] option[offset="' + offsetLocale + '"]:first').attr("selected", true);
                    //if(offsetLocale == 8 * 3600) {
                    //    $('.m-ts [name="timeZone"] option[selected="selected"]').removeAttr("selected");
                    //    $('.m-ts [name="timeZone"]').val('China_Standard_Time');
                    //}
                    $('.m-ts [name="timeZone"]').append('<option value=""></option>');
                    $('.m-ts [name="timeZone"]').val('');
                    $('.chosen-single span').html('');

                }
                $('.m-ts [name="timeZone"]').chosen({
                    search_contains: true,
                    width: "500px"
                });

                if ($.trim($('.m-ts [name="timeServer"]').val()) == '') {
                    // 默认服务器域名
                    $('.m-ts [name="timeServer"]').val(timesettingwizard.defaultTimeServer);
                }

            }else{
                alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.loadfail'),3);
            }
        });
    },
    save:function(){

        var dataObj = {};
        dataObj.timeMethod = $('.m-ts [name="timeMethod"]:checked').val();
        dataObj.summerTime = $('.m-ts [name="summerTime"]').val()

        console.log(dataObj.timeMethod);

        if(dataObj.timeMethod == '0'){
            if(timesettingwizard.timeServerValidate()){
                dataObj.timeServer = $('.m-ts [name="timeServer"]').val();
                dataObj.winTimeZone =$('.m-ts [name="timeZone"]').val();
            }else {
                return false;
            }
        }else{
            dataObj.time = $('#m-ts-time').val();
        }

        // 增加滚动条
        $('#timesettingAllDivid').showLoading();
        var datatUrl = $('#projectContext').val() + '/timesetting/wizard/timeconfig';
        $.ajax({
            type: 'POST',
            url: datatUrl,
            data:JSON.stringify(dataObj),
            dataType : "json",
            contentType: 'application/json',
            success: function(result){
                // 隐藏滚动条
                $('#timesettingAllDivid').hideLoading();
                if (result && result.ret>=0){
                    //var currentDateFromTheTimeZone = toTheTimeZoneTime(result.rows.timezoneOffset);
                    var currentDateFromTheTimeZone = new Date(result.rows.currentTime);
                    var currentTimeFromTheTimeZone = internationalFormatTime(currentDateFromTheTimeZone);
                    timesettingwizard.stopServerTimeTask();
                    timesettingwizard.TIME_SETTING_CUR_TIMEMILLS = currentDateFromTheTimeZone.getTime();
                    $('.m-ts [name="currentTime"]').val(currentTimeFromTheTimeZone);
                    timesettingwizard.startRefreshServerTimeTask();
                    $('#m-ts-time').data('daterangepicker').setStartDate(moment(currentTimeFromTheTimeZone).format('YYYY/MM/DD HH:mm:ss'));

                    if (result.ret == 99) {
                        // 重启web服务
                        alertPromptMsgDlg($.i18n.prop('timesetting.js.restart.tips'), 1, function(){
                            netsettingwizard.restart('timesettingAllDivid');
                        });
                    } else {
                        timesettingwizard.confirmNextstep();
                    }
                }
            },
            error:function(){
                // 隐藏滚动条
                $('#timesettingAllDivid').hideLoading();
                alertPromptMsgDlg($.i18n.prop('wizard.js.timesetting.msg.savecfgerror'),3);
            }

        });
    },
    laststep:function(){
        netsettingwizard.init();
        // 修改样式 及 页面展示切换
        wizardLastStep('timesetting','netsetting', 1);
    },
    confirmNextstep:function(){
        //初始化下一个先
        userinfochg.init();
        // 修改样式 及 页面展示切换
        wizardConfirmNextStep('timesetting','userinfochg', 2);
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
                    required:$.i18n.prop('wizard.js.timesetting.valid.domainnull'),
                    checkIpAndDn : $.i18n.prop('wizard.js.timesetting.valid.domainformat')
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
                error.css('padding-left', '145px');
                element.parent('div').prepend(error);
            }
        }).form();

        //时区验证。。。。
        var timezoneObj =  $('.m-ts [name="timeZone"]');
        if (timezoneObj.val() == '') {
            var timezoneError = '<span id="timeZone-error" class="help-block" style="padding-left: 145px;">'
                                + $.i18n.prop('wizard.js.timesetting.valid.tznull') + '</span>';
            timezoneObj.parent('div').prepend(timezoneError);
            timezoneObj.closest('div').addClass('has-error');
            timezoneObj.off('change').on('change',function(){
                if (timezoneObj.val() != '') {
                    $('#timeZone-error').remove();
                }
            });
            return false;
        }

        return res;
    },
    addValidateMethod:function(){
        // 增加ip和域名 校验
        var checkDs = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
        var checkIp = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/;
        $.validator.addMethod("checkIpAndDn",function(value,element,params){
            return checkIp.test(value) || checkDs.test(value);
        },'');
    },
    startRefreshServerTimeTask : function() {
        timesettingwizard.TIME_SETTING_INTERVAL = setInterval(function(){
            //定时刷新服务器当前时间
            timesettingwizard.TIME_SETTING_CUR_TIMEMILLS += 1000;
            var newDate = new Date();
            newDate.setTime(timesettingwizard.TIME_SETTING_CUR_TIMEMILLS);
            $('.m-ts [name="currentTime"]').val(internationalFormatTime(newDate));
        }, 1000);
    },
    stopServerTimeTask : function(){
        if (timesettingwizard.TIME_SETTING_INTERVAL) {
            clearInterval(timesettingwizard.TIME_SETTING_INTERVAL);
            timesettingwizard.TIME_SETTING_INTERVAL = null;
        }
    }
}
