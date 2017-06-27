var smtpsetting = {
    init: function () {
        // $.i18n.prop('')
        var passwordInputFlag = true;
        //$.i18n.prop('')
        var passwordResetFlag = false;
        // 3desde key $.i18n.prop('')DesUtils$.i18n.prop('')key$.i18n.prop('')
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


        $.post('smtpsetting/query', {type: 'smtpConfig'}, function (result) {
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
                alertPromptMsgDlg($.i18n.prop('smtpsetting.js.loadfail'),3);
            }
        });

        smtpsetting.addValidateMethod();
    },
    save: function (formId) {
        var validate = smtpsetting.smtpValidate();
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

            $('#smtpSettingMainDiv').showLoading();
            $.ajax({
                type: 'POST',
                url: 'smtpsetting/smtpconfig',
                data: JSON.stringify(dataObj),
                dataType: "json",
                contentType: 'application/json',
                success: function (result) {
                    $('#smtpSettingMainDiv').hideLoading();
                    if (result.ret >= 0) {
                        alertPromptMsgDlg($.i18n.prop('smtpsetting.js.savesuc'),1);
                    } else {
                        alertPromptMsgDlg(result.message,1);
                    }
                },
                error: function () {
                    $('#smtpSettingMainDiv').hideLoading();
                    alertPromptMsgDlg($.i18n.prop('smtpsetting.js.savafail'),0);
                }

            });
        }
    },
    popupTestModal:function(formId){
        var validate = smtpsetting.smtpValidate();
        if (validate == true){
            $('#testMailModal').modal('show');
        }
    },
    startTestSendMail:function(formId){
        var validate = smtpsetting.mailValidate(formId);
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
            //$.i18n.prop('')
            $('#testMailModal').modal('hide');
            //$.i18n.prop('')
            $('.progress-bar').css('width', '20%');
            $("#progressBarModal").modal('show');
            $(".progress").css("display", "");
            $("#progressBarFooter").css("display", "block");
            //$.i18n.prop('')
            $("#sendMailTestSuccess").css("display", "none");
            $("#sendMailTestFail").css("display", "none");
            $("#authenticationFail").css("display", "none");
            $("#connectFail").css("display", "none");
            $("#progressValueshow").css("display", "");
            $('#progressValueshow').text('20%');

            setTimeout(function () {
                //$.i18n.prop('')
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
                    url: 'smtpsetting/test',
                    data: JSON.stringify(dataObj),
                    dataType: "json",
                    contentType: 'application/json',
                    success: function (result) {
                        $(".progress").css("display", "none");
                        $("#progressBarFooter").css("display", "none");
                        $("#progressValueshow").css("display", "none");
                        clearInterval(barCalc);
                        if (result.ret >= 1) {
                            //$("#sendMailTestSuccess").css("display", "");
                            alertPromptMsgDlg(result.message,1);
                        }else {
                            alertPromptMsgDlg(result.message,0);
                        };
                        //else if (result.ret == -1) {
                        //    $("#authenticationFail").css("display", "");
                        //} else if (result.ret == -2) {
                        //    $("#connectFail").css("display", "");
                        //} else {
                        //    $("#sendMailTestFail").css("display", "");
                        //}
                        setTimeout(function () {
                            $("#progressBarModal").modal('hide');
                        });

                    }
                });
            }, 1000);
        }
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
                    required:$.i18n.prop('smtpsetting.js.renotempty'),
                    email:$.i18n.prop('smtpsetting.js.E-mailformatincorrect')
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
                error.css('padding-left', '111px');
                error.css('position', 'absolute');
                error.css('top', '-25px');
                element.parent('div').prepend(error);
            }
        }).form();
        return res;
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
                    required:$.i18n.prop('smtpsetting.js.SMTP'),
                    checkIpAndDn :$.i18n.prop('smtpsetting.js.SMTPincorrect')
                },
                senderMail:{
                    required:$.i18n.prop('smtpsetting.js.sendernotnull'),
                    email:$.i18n.prop('smtpsetting.js.formaitincor')
                },
                username:{
                    required:$.i18n.prop('smtpsetting.js.usrnamenotnull')
                },
                password:{
                    required:$.i18n.prop('smtpsetting.js.pwdnotnull')
                },
                port:{
                    required:$.i18n.prop('smtpsetting.js.portnotnull'),
                    range:$.i18n.prop('smtpsetting.js.mustnumber')
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
                error.css('padding-left', '187px');
                error.css('margin-bottom', '1px')
                element.parent('div').prepend(error);
            }
        }).form();
        return res;
    },
    addValidateMethod:function(){
        // $.i18n.prop('')ip$.i18n.prop('') $.i18n.prop('')
        var checkDs = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
        var checkIp = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/;
        $.validator.addMethod("checkIpAndDn",function(value,element,params){
            return checkIp.test(value) || checkDs.test(value);
        },'');
    }

}