var licensesettingwizard = {
    init:function(){
        licensesettingwizard.loadData();

    },
    loadData: function() {
        $.ajax({
            url: "/license/wizard/query",
            type: "get",
            async: false,
            dataType: "json",
            success: function (result) {
                if (result.ret == 1) {
                    licensesettingwizard.license(result.rows);
                } else {
                    $("#activationForm").show();
                    $("#licenseInfoForm").hide();
                }
            }
        });
    },
    license: function(license) {
        if(!license) {
            $("#activationForm").show();
            $("#licenseInfoForm").hide();
            return;
        }
        $("#activationForm").hide();
        $("#licenseInfoForm").show();
        var licenseNo = license._id;
        if(license._id.length == 24) {
            licenseNo = license._id.substr(0,4) + "-" + license._id.substr(4,5) + "-" + license._id.substr(9,5) +
                "-" + license._id.substr(14,5) + "-" + license._id.substr(19,5);
        }
        var validDay;
        if(license.validDay < 0) {
            validDay = $.i18n.prop('licensesetting.js.forever');
        } else if(license.validDay < 30) {
            validDay = license.validDay + "" + $.i18n.prop('licensesetting.js.day');
        } else if(license.validDay < 365) {
            validDay = license.validDay / 30 + "" + $.i18n.prop('licensesetting.js.month',' ');
        }
        else {
            validDay = license.validDay / 365 + "" + $.i18n.prop('licensesetting.js.year');
        }
        var expirationDate = new Date(license.expirationDate).Format("yyyy/MM/dd")
        var restDate = license.expirationDate - new Date().getTime();
        var restDays = Math.floor(restDate / (24*3600*1000));
        var expirationDateStr = expirationDate;
        //if(restDays >= 0) {
        //    expirationDateStr += "  ("+$.i18n.prop('wizard.js.licence.remain') + restDays + $.i18n.prop('wizard.js.licence.day') + ")";
        //}
        if(license.type == 2) {
            $("#releaseBtn").hide();
        }
        var status = {
            ACTIVATED: $.i18n.prop('licensesetting.js.active'),
            EXPIRED: $.i18n.prop('licensesetting.js.overdue'),
            ABNORMAL: $.i18n.prop('licensesetting.js.unusual'),
            DISABLE: $.i18n.prop('licensesetting.js.forbid')
        };
        var type;
        if(license.type == 0) {
            type = $.i18n.prop('wizard.js.licence.testpermit');
        }else if(license.type == 1) {
            type = $.i18n.prop('wizard.js.licence.onlinepermit');
        }else if(license.type == 2) {
            type = $.i18n.prop('wizard.js.licence.offlinepermit');
        }
        $("#status").val(status[license.status]);
        $("#type").val(type);
        $("#license").val(licenseNo);
        $("#permissionAmount").val(license.permissionAmount + $.i18n.prop('licensesetting.js.cur.ports'));
        $("#validDay").val(validDay);
        $("#expirationDate").val(expirationDateStr);
    },
    activate: function() {
        //var validate = licensesettingwizard.licenseValidate("activationForm");
        //if(!validate) {
        //    return false;
        //}
        var license = $.trim($("#licenseIpt").val().replace(/-/g, ""));
        $.ajax({
            url: "/license/wizard/activate",
            type: "post",
            async: false,
            data: {
                licenseNo: license
            },
            dataType: "json",
            traditional: true,
            success: function (result) {
                //alert(result.message);
                if(result.ret == 1) {
                    $("#licenseIpt").val("")
                    licensesettingwizard.license(result.rows);

                    // 跳到下一步骤
                    licensesettingwizard.confirmNextstep();
                } else {
                    alertPromptMsgDlg(result.message, 3);
                }
            }
        });
    },
    licenseValidate:function(formId){
        var validate = $('#' + formId).validate({
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules:{
                licenseIpt:{
                    required:true
                }
            },
            messages:{
                licenseIpt:{
                    required:$.i18n.prop('wizard.js.licence.notnull')
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
        return validate;
    },
    release: function() {
        var license = $("#license").val().replace(/-/g, "");
        $.ajax({
            url: "/license/release",
            type: "post",
            async: false,
            data: {
                licenseNo: license
            },
            dataType: "json",
            success: function (result) {
                alertPromptMsgDlg(result.message,3);
                if (result.success) {
                    licensesettingwizard.license(null);
                }
            }
        });
    },
    laststep:function(){
        userinfochg.init();
        // 修改样式 及 页面展示切换
        wizardLastStep('licencesetting','userinfochg', 3);
    },
    confirmNextstep:function(){
        //初始化下一个先
        smtpsettingwizard.init();
        // 修改样式 及 页面展示切换
        wizardConfirmNextStep('licencesetting','smtpsetting', 4);
    },
    jumpToNextStep:function(){
        this.confirmNextstep();
    }
}
