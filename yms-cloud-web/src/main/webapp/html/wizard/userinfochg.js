var userinfochg = {
    init:function(){
        // 加载用户名 邮箱
        $.ajax({
            type: "get",
            url: $("#projectContext").val()+'/wizard/userinfo',
            success: function (data) {
                var userInfoVo = data.rows;
                if (data.ret != -1) {
                    $('#userName').val(userInfoVo.userName);
                    $('#email').val(userInfoVo.email);
                    $('#_id').val(userInfoVo.id);
                    $('#password').val('');
                    $('#confirmPassword').val('');
                } else {
                    alertPromptMsgDlg(data.message,3);
                }
            }
        });

        // 添加验证方法
        $.validator.addMethod("confirmPasswordSame",function(value,element,params){
            return value == $(params).val();
        },'');

        // 验证
        userinfochg.validate();

        // 触发密码blur 其实没必要这么做。。
        $('#password,#confirmPassword,#email').on('blur',function(){
           if ($(this).val() == '') {
                if (!$(this).parent().hasClass('has-error')) {
                    $(this).parent().addClass('has-error');

                    var error = '';
                    if ($(this).attr('name') == 'password') {
                        error = '<span id="password-error" class="help-block null-blur-error" style="padding-left: 150px;">'+$.i18n.prop('wizard.js.userinfochg.valid.passnull')+'</span>';
                    } else if ($(this).attr('name') == 'confirmPassword') {
                        error = '<span id="confirmPassword-error" class="help-block null-blur-error" style="padding-left: 150px;">'+$.i18n.prop('wizard.js.userinfochg.valid.confirmpassnull')+'</span>';
                    } else if ($(this).attr('name') == 'email') {
                        error = '<span id="email-error" class="help-block null-blur-error" style="padding-left: 150px;">'+$.i18n.prop('wizard.js.userinfochg.valid.mailnull')+'</span>';
                    }
                    $(this).parent().prepend(error);
                }
           }
        });
        $('#password').on('change',function(){
            // 密码修改就把确认密码清空
            $('#confirmPassword').val('');
            $('#confirmPassword').parent().removeClass('has-error');
            $('#confirmPassword').parent().find('span.help-block').remove();
        });
        $('#userinfochg-form input').keypress(function(e) {
            if (e.which == 13) {
                return false;
            }
        });
    },
    save:function(){
        // 保存
        var newPsw = $("#password").val();
        var des3Key = randomString(32);
        var email = $("#email").val();
        var _id = $("#_id").val();
        var params = {
            "password": DES3.encrypt(des3Key, newPsw),
            "des3Key": des3Key,
            "email": email,
            "id": _id,
            "userName" : $("#userName").val()
        };

        $.ajax({
            url: $("#projectContext").val() + "/wizard/saveuserinfo",
            type: "post",
            async: true,
            data: JSON.stringify(params),
            dataType: "json",
            contentType:"application/json",
            success: function (result) {
                if (result.ret != -1) {
                    userinfochg.confirmNextstep();
                } else {
                    alertPromptMsgDlg(result.message,3);
                }
            }
        });
    },
    validate:function(){
        // 验证
        $("#userinfochg-form").validate({
            onsubmit:true,// 是否在提交是验证
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules: {
                password : {
                    required : true,
                    minlength : 6,
                    maxlength : 16
                },
                confirmPassword : {
                    required : true,
                    minlength : 6,
                    maxlength : 16,
                    confirmPasswordSame : '#password'
                },
                email : {
                    required : true,
                    email : true
                }
            },
            messages:{
                password : {
                    required : $.i18n.prop('wizard.js.userinfochg.valid.passnull'),
                    minlength : $.i18n.prop('wizard.js.userinfochg.valid.passminlength'),
                    maxlength : $.i18n.prop('wizard.js.userinfochg.valid.passmaxlength')
                },
                confirmPassword : {
                    required : $.i18n.prop('wizard.js.userinfochg.valid.confirmpassnull'),
                    minlength : $.i18n.prop('wizard.js.userinfochg.valid.passminlength'),
                    maxlength : $.i18n.prop('wizard.js.userinfochg.valid.passmaxlength'),
                    confirmPasswordSame : $.i18n.prop('wizard.js.userinfochg.valid.passconfirmpasssame')
                },
                email : {
                    required : $.i18n.prop('wizard.js.userinfochg.valid.mailnull'),
                    email : $.i18n.prop('wizard.js.userinfochg.valid.mailformat')
                }
            },
            highlight : function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            success : function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement : function(error, element) {
                element.parent('div').find('span.null-blur-error').remove();
                error.css('padding-left', '150px');
                element.parent('div').prepend(error);
            },
            submitHandler : function(form) {
                userinfochg.save();
            },
            invalidHandler: function(form, validator) {
                return false;
            }
        });
    },
    laststep:function(){
        timesettingwizard.init();
        // 修改样式 及 页面展示切换
        wizardLastStep('userinfochg','timesetting', 2);
    },
    confirmNextstep:function(){
        //初始化下一个先
        licensesettingwizard.init();
        // 修改样式 及 页面展示切换
        wizardConfirmNextStep('userinfochg','licencesetting', 3);
    },
    clearErrorInfo:function(){
        $("span[id$='-error']").remove();
        $('.has-error').each(function(){
            $(this).removeClass('has-error');
        });
    },
    jumpToNextStep:function(){
        this.clearErrorInfo();
        this.confirmNextstep();
    }

}