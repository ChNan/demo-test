var licensesetting = {
	init:function(){
		licensesetting.loadData();
	},
	loadData: function() {
		$.ajax({
			url: "/license/query",
			type: "get",
			async: false,
			dataType: "json",
			success: function (result) {
				if (result.ret == 1) {
					licensesetting.license(result.rows);
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
		//	expirationDateStr += "  ("+ $.i18n.prop('licensesetting.js.remain',restDays) +")";
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
		if(status[license.status] != $.i18n.prop('licensesetting.js.active')) {
			$("#releaseBtn").hide();
			$("#goActiveBtn").show();
		}else {
            $("#goActiveBtn").hide();
            $("#releaseBtn").show();
            if(license.type == 2) {
                $("#goUpdateBtn").show();
            }
		}
		var type;
		if(license.type == 0) {
			type = $.i18n.prop('licensesetting.js.license.try');
		}else if(license.type == 1) {
			type = $.i18n.prop('licensesetting.js.license.online');
		}else if(license.type == 2) {
			type = $.i18n.prop('licensesetting.js.license.offline');
            $("#releaseBtn").hide();
		}
		$("#status").val(status[license.status]);
		$("#type").val(type);
		$("#license").val(licenseNo);
		$("#permissionAmount").val(license.permissionAmount + $.i18n.prop('licensesetting.js.cur.ports'));
		$("#validDay").val(validDay);
		$("#expirationDate").val(expirationDateStr);
	},
	activate: function() {
		var validate = licensesetting.licenseValidate("activationForm");
		if(!validate) {
			return false;
		}
        showProgress($.i18n.prop('licence.js.btn.msg.activating'));
		var license = $.trim($("#licenseIpt").val().replace(/-/g, ""));
		$.ajax({
		 	url: "/license/activate",
			type: "post",
			async: true,
			data: {
				licenseNo: license
			},
			dataType: "json",
			traditional: true,
			success: function (result) {
                setTimeout(function () {
                	hideProgressBar();
					if(result.ret == 1) {
						alertPromptMsgDlg($.i18n.prop('licensesetting.js.active.success', 1));
						$("#licenseIpt").val("");
						licensesetting.license(result.rows);
					}else {
						alertPromptMsgDlg(result.message, 3);
					}
                }, 500);
			}
		 });
	},
	update: function() {
        var validate = licensesetting.licenseValidate("updateLicForm");
        if(!validate) {
        	$("#updateLicForm .help-block").css("padding-left", 105);
            return false;
        }
        $("#modalCommon").modal("hide");
        showProgress($.i18n.prop('licence.js.btn.msg.activating'));
        var license = $.trim($("#newLicenseIpt").val().replace(/-/g, ""));
        $.ajax({
            url: "/license/activate",
            type: "post",
            async: true,
            data: {
                licenseNo: license
            },
            dataType: "json",
            traditional: true,
            success: function (result) {
                setTimeout(function () {
                    hideProgressBar();
                    if(result.ret == 1) {
                        alertPromptMsgDlg($.i18n.prop('licensesetting.js.active.success'), 1, function () {
                            $("#modalCommon").modal("hide");
                        });
                        $("#licenseIpt").val("");
                        licensesetting.license(result.rows);
                    }else {
                        alertPromptMsgDlg(result.message, 3, function () {
                            $("#modalCommon").modal("show");
                        });
                    }
                }, 500);
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
					required:$.i18n.prop('licensesetting.js.license.require')
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
		}).form();
		return validate;
	},
	releaseConfirm: function() {
        alertConfirmationMsgDlgDetail($.i18n.prop('licensesetting.js.license.release'), $.i18n.prop('licensesetting.js.tip.release')
			, $.i18n.prop('global.js.ok'), licensesetting.release)
	},
    release: function () {
        showProgress($.i18n.prop('licence.js.btn.msg.releasing'));
        var license = $("#license").val().replace(/-/g, "");
        $.ajax({
            url: "/license/release",
            type: "post",
            async: true,
            data: {
                licenseNo: license
            },
            dataType: "json",
            success: function (result) {
                setTimeout(function () {
                    hideProgressBar();
                    alertPromptMsgDlg(result.message, 1);
                    if (result.ret == 1) {
                        licensesetting.license(null);
                    }
                }, 500);
            }
        });
    },
    goActive: function () {
        $("#activationForm").show();
        $("#licenseInfoForm").hide();
    },
    goUpdate: function () {
        $("#modalCommon .modal-content").html(template("updateLicModalContent"));
        $("#modalCommon .modal-dialog").css("width", 680);
        $("#modalCommon").modal("show");
    }
}
