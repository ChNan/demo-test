var accountmanage = {
    init: function () {

    },
    lockFlag:false,
    form:['m-am-edit','m-am-mailEdit'],
    readyModifyPwdInitAdminPage: function (divId) {
        accountmanage.lockFlag=true;
        if(main.currentMudule && main.currentMudule.lockFlag){
            main.checkFormChange(function(){
                fun()
            });
        }else{
            fun()
        }
        function fun(){
            $('.g-main').hide();
            $('.g-other').hide();
            $('#editPwd').show();
            accountmanage.readyUpdatePwd(true);
            $("#btn_pwd_return").on("click",function(){
                $('#currentPsw').val("");
                $('#newPsw').val("");
                $('#repeatPsw').val("");
                $('#editPwd').hide();
                $('.g-main').show();
                validateutil.clearFormAllErrorMsg($('#m-am-edit'))
            });
        }
        //解决firefox autocomplete=off不成效问题
        setTimeout(function () {
            $("input[autocomplete=off]").val("");
        }, 100);
    },
    readyChangePwdConferencePage:function readyChangePwdConferencePage(divId){
    	var _divId="#"+divId;
        $(_divId).hide().load( '/html/accountmanage/accountmanage.html?' + new Date().getMilliseconds(),
            function(responseText, textStatus, XMLHttpRequest){
            if(XMLHttpRequest.status == 200){
                $('.m-cp-main').hide();
                $('#editPwd').show();
                accountmanage.readyUpdatePwd();
                $("#btn_pwd_return").on("click",function(){
                	$(_divId).hide().html("");
                    $('#c_plan_index').show();
                });
            }
        }).show('fast');
        //解决firefox autocomplete=off不成效问题
        setTimeout(function () {
            $("input[autocomplete=off]").val("");
        }, 100);
    },
    readyChangeMailConferencePage:function readyChangeMailConferencePage(divId){
    	var _divId="#"+divId;
        $(_divId).hide().load( '/html/accountmanage/accountmanage.html?' + new Date().getMilliseconds(),
            function(responseText, textStatus, XMLHttpRequest){
                if(XMLHttpRequest.status == 200){
                    $('.m-cp-main').hide();
                    $('#editMail').show();
                    accountmanage.readyUpdateMail();
                    $("#btn_email_return").on("click",function(){
                    	$(_divId).hide().html("");
                        $('#c_plan_index').show();
                    });
                }
            }).show('fast');
    },
    readyInitMailAdminPage: function (divId) {
        accountmanage.lockFlag=true;
        if(main.currentMudule && main.currentMudule.lockFlag){
            main.checkFormChange(function(){
                fun()
            });
        }else{
            fun()
        }
        function  fun(){
            accountmanage.resetValidateMail();
            $('.g-main').hide();
            $('.g-other').hide();
            $('#editMail').show();

            accountmanage.readyUpdateMail();
            $("#btn_email_return").on("click",function(){
                accountmanage.resetValidateMail();
                $('#newMail').val("");
                $('#editMail').hide();
                $('.g-main').show();
            });
        }
    },
    logout:function(){
        if(main.currentMudule && main.currentMudule.lockFlag){
            main.checkFormChange(function(){
                window.location.href='/logout';
            });
        }else{
            window.location.href='/logout';
        }

    },
    readyUpdatePwd: function (adminPage) {
        $("#currentPsw").focus();

        accountmanage.bindModifyPswEnter("currentPsw",adminPage);
        accountmanage.bindModifyPswEnter("newPsw",adminPage);
        accountmanage.bindModifyPswEnter("repeatPsw",adminPage);

        passwordFieldLockTips("currentPsw", $.i18n.prop('global.js.tips.capslock'));
        passwordFieldLockTips("newPsw", $.i18n.prop('global.js.tips.capslock'));
        passwordFieldLockTips("repeatPsw", $.i18n.prop('global.js.tips.capslock'));
        $("#currentPsw").blur(function () {
            validatePwd.validateCurrentPwd("currentPsw");
        });
        $("#newPsw").blur(function () {
            validatePwd.validateNewPwd("newPsw", "repeatPsw");
        });
        $("#repeatPsw").blur(function () {
            validatePwd.validateRepeatPwd("newPsw", "repeatPsw");
        });
    },
    readyUpdateMail:function(){
        accountmanage.bindModifyMailEnter('newMail');
        $("#newMail").blur(function () {
            accountmanage.validateMail("m-am-mailEdit");
        });
        $.ajax({
            url: $("#projectContext").val() + "/account/mail/query",
            type: "get",
            async: true,
            dataType: "json",
            success: function (result) {
                if (result.rows) {
                    $('#currentMail').val(result.rows);
                } else {
                    $('#currentMail').val($.i18n.prop('account.js.currentMail.null'));
                }
            }
        })
        $("#currentMail").focus();
    },
    modifyPsw: function (formId,adminPage) {
        $("#btn_pwd_modify").button('loading');
        if(!validatePwd.validateCurrentPwd("currentPsw"))return;
        if(!validatePwd.validateNewPwd("newPsw", "repeatPsw"))return;
        if(!validatePwd.validateRepeatPwd("newPsw", "repeatPsw"))return;
        var currentPsw = $("#currentPsw").val();
        var newPsw = $("#newPsw").val();
        var des3Key = randomString(32);
        var params = {
            "oldPassword": DES3.encrypt(des3Key, currentPsw),
            "newPassword": DES3.encrypt(des3Key, newPsw),
            "des3Key": des3Key
        };

        $.ajax({
            url: $("#projectContext").val() + "/account/password/edit",
            type: "post",
            async: true,
            data: params,
            dataType: "json",
            success: function (result) {
                if (result.success) {
                    alertPromptMsgDlg(result.message, 1,function(){
                        $('#btn_pwd_return').trigger('click');
                    });
                } else {
                    alertPromptMsgDlg(result.message, 3);
                }
            },
            complete: function () {
                setTimeout(function () {
                    $("#btn_pwd_modify").button('reset');
                }, 500)
            }
        });
    },

    validateForMail: function (formId){
        var _formId = "#"+formId;
        var validator = $('#m-am-mailEdit').validate({
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules:{
                newMail:{
                    required:true,
                    email:true
                }
            },
            messages:{
                newMail:{
                    required:$.i18n.prop('account.js.mail.notNull'),
                    email:$.i18n.prop('account.js.mail.invalid')
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
                error.css('padding-left', '188px');
                error.css('margin-bottom', '1px');
                element.parent('div').prepend(error);
            }
        });

        //var res = validator.form();
        return validator;
    },

    validateMail:function(){
       return accountmanage.validateForMail().form();
    },

    resetValidateMail:function(){
        var validator = accountmanage.validateForMail();
        validator.resetForm();
    },
    modifyMail: function (formId) {
        if (accountmanage.validateMail(formId)){
            var newMail = $("#newMail").val();
            var params = {
                email: newMail
            };
            $.ajax({
                url: $("#projectContext").val() + "/account/edit",
                type: "post",
                async: true,
                data: params,
                dataType: "json",
                success: function (result) {
                    if (result.success) {
                        alertPromptMsgDlg(result.message, 1,function(){
                            location.href = getContextPath() + "/main";
                        });
                    } else {
                        alertPromptMsgDlg(result.message, 3);
                    }
                }
            });
        }else {
            return false;
        }
    },
    /**
     * 绑定修改密码页的回车事件
     * @param inputId 输入框id
     */
    bindModifyPswEnter: function (inputId,adminPage) {
        $('#' + inputId).bind('keypress', function (event) {
            var keycode = event.keyCode ? event.keyCode : event.which;
            if (keycode == 13) {
                accountmanage.modifyPsw('m-am-edit',adminPage);
                return false;
            }
        });
    },

    /**
     * 绑定修改邮箱页的回车事件
     * @param inputId 输入框id
     */
    bindModifyMailEnter: function (inputId) {
        $('#' + inputId).bind('keypress', function (event) {
            var keycode = event.keyCode ? event.keyCode : event.which;
            if (keycode == 13) {
                accountmanage.modifyMail('m-am-mailEdit');
                return false;
            }
        });
    }

}

var validatePwd = {
    validateCurrentPwd: function (id) {
        var node = $("#" + id);
        var value = $(node).val();
        if (validateNull(value)) {
            validateutil.defaultFormErrorFmter(node, $.i18n.prop('account.js.current.pwd.notNull'));
            return false;
        } else {
            validateutil.clearFormNodeErrorMsg(node);
            return true;
        }
    },
    validateNewPwd: function (newPwdId, repeatPwdId) {
        var newPwdNode = $("#" + newPwdId);
        var repeatPwdNode = $("#" + repeatPwdId);

        var value = $(newPwdNode).val();
        var repeatValue = $(repeatPwdNode).val();
        if (validateNull(value)) {
            validateutil.defaultFormErrorFmter(newPwdNode, $.i18n.prop('account.js.pwd.validate'));
            validateutil.clearFormNodeErrorMsg(repeatPwdNode);
            return false;
        } else if (value.length < 8) {
            validateutil.defaultFormErrorFmter(newPwdNode, $.i18n.prop('account.js.pwd.validate'));
            validateutil.clearFormNodeErrorMsg(repeatPwdNode);
            return false;
        } else if (!validatePwd.isPassword(newPwdNode)) {
            validateutil.clearFormNodeErrorMsg(repeatPwdNode);
            return false;
        } else if (!validateNull(repeatValue) && value != repeatValue) {
            validateutil.clearFormNodeErrorMsg(newPwdNode)
            validateutil.defaultFormErrorFmter(repeatPwdNode, $.i18n.prop('account.js.pwd.notSame'))
            return false;
        } else {
            validateutil.clearFormNodeErrorMsg(newPwdNode)
            validateutil.clearFormNodeErrorMsg(repeatPwdNode)
            return true;
        }
    },
    validateRepeatPwd: function (newPwdId, repeatPwdId) {
        var repeatPwdNode = $("#" + repeatPwdId);
        var newPwdNode = $("#" + newPwdId);
        var value = $(repeatPwdNode).val();
        var newPswValue = $(newPwdNode).val();
        if (!validatePwd.validateNewPwd(newPwdId, repeatPwdId)) {
            return false;
        }
        if (validateNull(value)) {
            validateutil.defaultFormErrorFmter(repeatPwdNode, $.i18n.prop('account.js.pwd.repeat'));
            return false;
        } else if (value != newPswValue) {
            validateutil.defaultFormErrorFmter(repeatPwdNode, $.i18n.prop('account.js.pwd.notSame'));
            return false;
        } else {
            validateutil.clearFormNodeErrorMsg(repeatPwdNode);
            return true;
        }
    },

    /**
     * 判断密码复杂性
     * @param str 字符串
     * @returns {Boolean}
     */
    isPassword: function (newPwdNode) {
        var pwdStr = $(newPwdNode).val();
        var numLength;
        var chrLength;

        if (/[0-9]/.test(pwdStr)) {
            numLength = pwdStr.match(/[0-9]/g).length;
        } else {
            validateutil.defaultFormErrorFmter(newPwdNode, $.i18n.prop('account.js.pwd.number'))
            return false;
        }
        return true;
    }
}
