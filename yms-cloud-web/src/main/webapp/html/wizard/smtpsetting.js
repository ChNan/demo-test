var smtpsettingwizard = {
    init: function () {
        // 控制密码输入后清空原密码
        var passwordInputFlag = true;
        //控制当前密码是否是重新设置
        var passwordResetFlag = false;
        // 3desde key 为了跟DesUtils类的key保持一致
        var desKey = "56212235226886758978225025933009171679";

        $('.m-smtps [name="password"]').keypress(function(e){
            if (passwordInputFlag && e.which != 13) {
                $('#passWord').val("");
            }
            if (e.which != 13) {
                passwordInputFlag = false;
            }
        });

        $('.m-smtps [name="password"]').blur(function(e){
            passwordInputFlag = true;
        });

        $('.m-smtps [name="password"]').change(function(e){
            if ($('.m-smtps [name="password"]').val() != '') {
                var encryptPassword = DES3.encrypt(desKey, $('.m-smtps [name="password"]').val());
                $('.m-smtps [name="password"]').val(encryptPassword);
            }
        });

        $('.m-smtps [name="secureConn"]').off('change').on('change', function () {
            if ($(this).prop('checked')) {
                $('.m-smtps [name="method"]').show();
                $('.m-smtps [name="port"]').val(465);
            } else {
                $('.m-smtps [name="method"]').hide()
            }
        })


        $.post($("#projectContext").val()+'/smtpsetting/wizard/query', {type: 'smtpConfig'}, function (result) {
            if (result && result.ret >= 0) {
                var dd = result.rows.data;
                $('.m-smtps [name="smtpServer"]').val(dd.smtpServer);
                $('.m-smtps [name="senderMail"]').val(dd.senderMail);
                $('.m-smtps [name="username"]').val(dd.username);
                $('.m-smtps [name="password"]').val(dd.password);
                $('.m-smtps [name="port"]').val(dd.port);
                if (dd.secureConn) {
                    $('.m-smtps [name="secureConn"]').prop('checked', true);
                    $('.m-smtps [name="method"]').show();
                    $('.m-smtps [name="method"]').val(dd.method);
                }
            } else {
                alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.loadfail'),3);
            }
        });

        smtpsettingwizard.addValidateMethod();
        smtpsettingwizard.clearErrorInfoNocondi();
    },
    clearErrorInfoNocondi:function(){
        $("span[id$='-error']").remove();
        $('.has-error').each(function(){
            $(this).removeClass('has-error');
        });
    },
    save: function (formId) {

        //如果都不填 直接跳过
        if ($.trim($('.m-smtps [name="smtpServer"]').val()) == ''
             && $.trim($('.m-smtps [name="senderMail"]').val()) == ''
             && $.trim($('.m-smtps [name="username"]').val()) == ''
             && $.trim($('.m-smtps [name="password"]').val()) == ''
             && $.trim($('.m-smtps [name="port"]').val()) == '25') {
            // 使用新设置的ip进入登录页首页
            window.location.href = $("#projectContext").val()+'/wizard/wizardToLogin';
        }
        else {
            var validate = smtpsettingwizard.smtpValidate();
            if (validate == true){
                var dataObj = {};

                dataObj.smtpServer = $('.m-smtps [name="smtpServer"]').val();
                dataObj.senderMail = $('.m-smtps [name="senderMail"]').val();
                dataObj.username = $('.m-smtps [name="username"]').val();
                dataObj.password = $('.m-smtps [name="password"]').val();
                dataObj.port = $('.m-smtps [name="port"]').val();
                dataObj.secureConn = $('.m-smtps [name="secureConn"]').prop('checked');
                if (dataObj.secureConn) {
                    dataObj.method = $('.m-smtps [name="method"]').val();
                }

                $('#wizardSmtpSettingDiv').showLoading();
                $.ajax({
                    type: 'POST',
                    url: $("#projectContext").val()+'/smtpsetting/wizard/smtpconfig',
                    data: JSON.stringify(dataObj),
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (result) {
                        //alert('保存成功!');
                        $('#wizardSmtpSettingDiv').hideLoading();
                        if (result.ret >= 0) {
                            // 使用新设置的ip进入登录页首页
                            window.location.href = $("#projectContext").val()+'/wizard/wizardToLogin';
                        } else {
                            alertPromptMsgDlg(result.message,1);
                        }
                    },
                    error: function () {
                        $('#wizardSmtpSettingDiv').hideLoading();
                        alertPromptMsgDlg('error',3);
                    }
                });
            }
        }

    },
    jumpToHeadPage:function(){
        // 使用新设置的ip进入登录页首页
        window.location.href = $("#projectContext").val()+'/wizard/wizardToLogin';
    },
    popupTestModal:function(formId){
        var validate = smtpsettingwizard.smtpValidate();
        if (validate == true){
            $('#testMailModal').modal('show');
        }
    },
    startTestSendMail:function(formId){
        var validate = smtpsettingwizard.mailValidate(formId);
        if (validate){
            var dataObj = {};

            dataObj.smtpServer = $('.m-smtps [name="smtpServer"]').val();
            dataObj.senderMail = $('.m-smtps [name="senderMail"]').val();
            dataObj.username = $('.m-smtps [name="username"]').val();
            dataObj.password = $('.m-smtps [name="password"]').val();
            dataObj.port = $('.m-smtps [name="port"]').val();
            dataObj.secureConn = $('.m-smtps [name="secureConn"]').prop('checked');
            if (dataObj.secureConn) {
                dataObj.method = $('.m-smtps [name="method"]').val();
            }
            ;
            dataObj.receiverMail = $('#toAddress').val();
            //隐藏测试窗口
            $('#testMailModal').modal('hide');
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
                }, 1500);
                $.ajax({
                    type: 'POST',
                    url: $("#projectContext").val()+'/smtpsetting/wizard/test',
                    data: JSON.stringify(dataObj),
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (result) {
                        $(".progress").css("display", "none");
                        $("#progressBarFooter").css("display", "none");
                        $("#progressValueshow").css("display", "none");
                        clearInterval(barCalc);
                        if (result.ret >= 1) {
                            $("#sendMailTestSuccess").css("display", "");
                        } else if (result.ret == -1) {
                            $("#authenticationFail").css("display", "");
                        } else if (result.ret == -2) {
                            $("#connectFail").css("display", "");
                        } else {
                            $("#sendMailTestFail").css("display", "");
                        }
                        setTimeout(function () {
                            $("#progressBarModal").modal('hide');
                        }, 2000);

                    }
                });
            }, 500);
        }
    },

    smtpValidate:function(){
        var res = $('#config-form').validate({
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules:{
                smtpServer:{
                    required:true,
                    checkIpAndDn : true
                },
                senderMail:{
                    required:true,
                    email:true
                },
                username:{
                    required:true
                },
                password:{
                    required:true
                },
                port:{
                    required:true,
                    range:[1,65535]
                }
            },
            messages:{
                smtpServer:{
                    required:$.i18n.prop('wizard.js.smtpsetting.valid.servernull'),
                    checkIpAndDn : $.i18n.prop('wizard.js.smtpsetting.valid.serverformat')
                },
                senderMail:{
                    required:$.i18n.prop('wizard.js.smtpsetting.valid.sendernull'),
                    email:$.i18n.prop('wizard.js.smtpsetting.valid.mailformat')
                },
                username:{
                    required:$.i18n.prop('wizard.js.smtpsetting.valid.usernull')
                },
                password:{
                    required:$.i18n.prop('wizard.js.smtpsetting.valid.passnull')
                },
                port:{
                    required:$.i18n.prop('wizard.js.smtpsetting.valid.portnull'),
                    range:$.i18n.prop('wizard.js.smtpsetting.valid.portrange')
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
                error.css('padding-left', '165px');
                error.css('pmargin-buttom', '2px');
                element.parent('div').prepend(error);
            }
        }).form();
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
    mailValidate:function(formId){
        var res = $('#testMailForm').validate({
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules:{
                toAddress:{
                    required:true,
                    email:true
                }
            },
            messages:{
                toAddress:{
                    required:$.i18n.prop('wizard.js.smtpsetting.valid.receivenull'),
                    email:$.i18n.prop('wizard.js.smtpsetting.valid.mailformat')
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
        return res;
    },
    laststep:function(){
        // 修改样式 及 页面展示切换
        wizardLastStep('smtpsetting','licencesetting', 4);
    }
}