var importProgressId;
var staffaccountmanage = {
    lockFlag:false,
    form:['m-sam-add','m-sam-edit'],
    init: function () {
        //$.i18n.prop('')，$.i18n.prop('')，$.i18n.prop('')，$.i18n.prop('')10
        var lastPageSize = $("#account_last_pageSize").val();
        staffaccountmanage.showStaffAccountList(1,lastPageSize);

        // $.i18n.prop('')
        $("#search_staff_account").autocomplete({
            source: function (query, process) {
                this.options.items = 1000;//$.i18n.prop('')
                $.ajax({
                    url: "staff/autoComplete",
                    type: "POST",
                    data: {
                        searchKey: query,
                        maxCount: this.options.items
                    },
                    dataType: "json",
                    success: function (respData) {
                        return process(respData.rows);
                    }
                });
            },
            formatItem: function (item) {
                return item["name"] + "(" + item["username"] + ")";
            },
            setValue: function (item) {
                return {"data-value": item["name"], "real-value": item["id"]};
            },
            updater: function (item) {
                var selectId = $(".typeahead.dropdown-menu").find(".active").attr("real-value");
                $("#selectStaffId").val(selectId);
                staffaccountmanage.showStaffAccountList(null, null, null, null, selectId);
            }
        });

        $("#search_staff_account").on('keydown', function (event) {
            if (event.keyCode == "13") {
                $('#search_box').trigger('click');
            }
        });
    },
    showStaffAccountList: function (pageNo, pageSize, orderByField, orderByType, staffIdFilter, searchKey, onlineStatus) {
        var data;
        orderByType = orderByType == undefined || orderByType == null ? 1 : orderByType;
        orderByField = orderByField == undefined || orderByField == null ? "namePinyin" : orderByField;
        searchKey = searchKey == undefined || searchKey == null ? "" : searchKey;
        data = JSON.stringify({
            "pageNo": pageNo == undefined ? 1 : pageNo, "pageSize": pageSize == undefined ? $("#account_last_pageSize").val() : pageSize,
            "orderByField": orderByField, "orderByType": orderByType,
            "staffIdFilter": staffIdFilter, "searchKey": searchKey, "onlineStatus": onlineStatus
        });
        $.ajax({
            url: getContextPath() + "/staff/search",
            type: "post",
            async: true,
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                var pageModelRet = $.extend(executePageModel(ret), {"orderByType": orderByType, "orderByField": orderByField, "searchKey": searchKey, "onlineStatus": onlineStatus});
                document.getElementById('m-am-table').innerHTML = template('staffAccountListTemp', pageModelRet);
                $("#orderbyType").val(orderByType);
                $("#orderbyField").val(orderByField);
            }
        });
    },
    searchByKeyFromBox: function (e) {
        var key = $("#search_staff_account").val();
        if(key==""||key==undefined){
            $("#selectStaffId").val("");
        }
        staffaccountmanage.showStaffAccountList(1, $("#account_last_pageSize").val(), null, null, null, key);
        $("#search_staff_account_div").find('#result_div').hide();
    },
    showListOrderBy: function (pageSize,orderByField, prevOrderByType, searchKey) {
        staffaccountmanage.showStaffAccountList(1, pageSize, orderByField, prevOrderByType * -1, $("#selectStaffId").val(), searchKey)
    },
    showListFilter: function (staffIdFilter) {
        staffaccountmanage.showStaffAccountList(1, $("#account_last_pageSize").val(), null, null, staffIdFilter)
    },
    changeSelectPageNo: function (pageNo, pageSize, orderByField, orderByType, searchKey, onlineStatus) {
        staffaccountmanage.showStaffAccountList(pageNo, pageSize, orderByField, orderByType, null, searchKey, onlineStatus)
    },
    changeSelectPageSize: function (pageNo, pageSize, orderByField, orderByType, searchKey, onlineStatus) {
        //$.i18n.prop('')
        $("#account_last_pageSize").val(pageSize);
        //$.i18n.prop('')，$.i18n.prop('')
        pageNo=1;
        staffaccountmanage.showStaffAccountList(pageNo, pageSize, orderByField, orderByType, null, searchKey, onlineStatus)
    },
    openAddPage: function () {
        staffaccountmanage.lockFlag = true;
        $('.m-am').each(function () {
            $(this).hide();
        });
        formutil.clearForm('m-sam-add');
        $('#staffAccount_create_prev').show();
        $("#m-sam-add").find('input,select,textarea').each(function(){
            $(this).blur(function () {
                staffaccountmanage.validate("m-sam-add");
            });
        })
        staffaccountmanage.resetValidate('m-sam-add');
    },
    openImportPage: function () {
        //$.i18n.prop('')
        $('#importFileName').html($.i18n.prop("staffaccountmanage.js.upload.select.file"));
        $('#importError').html('');
        $('#importResultModalContent').html('');
        $('.m-am').each(function () {
            $(this).hide();
        });
        $('#staffAccount_import').show();
        $("#importFile").fileupload({
            url: getContextPath() + "/staff/import",
            autoUpload: false,
            dataType: "json",
            add: function (e, data) {
                $('#importError').html('');
                $('#importResultModalContent').html('');
                $.each(data.originalFiles, function (index, file) {
                    var ext = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();
                    if (ext != ".xls" && ext != ".xlsx") {
                        $('#importError').html($.i18n.prop("staffaccountmanage.js.upload.unsupport.file"))
                        return false;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                        $('#importError').html($.i18n.prop("staffaccountmanage.js.file.large"));
                        return false;
                    }
                    $('#importFileName').html(file.name);
                    $('#importFile').data(data);
                });
            },
            progressall: function (e, data) {
                //$.i18n.prop('')
                var count = 12;
                var i = 1;
                var progressTotal = 20;
                importProgressId = setInterval(function () {
                    if (i <= count - 7) {
                        progressTotal = progressTotal + 10;
                    } else if (i <= count - 4) {
                        progressTotal = progressTotal + 5;
                    } else if (i <= count) {
                        progressTotal = progressTotal + 3;
                    }
                    $('#importProgress .progress-bar').show().css('width', progressTotal + '%');
                    i++;
                }, 600);
            },
            always: function (e, data) {
                clearInterval(importProgressId);
                $('#importProgress .progress-bar').hide();
                if (!data.result.success && data.result.validateMessage) {
                    $('#importError').html(data.result.validateMessage);
                } else if (!data.result.success) {
                    $('#importResultModalContent').html(template('staffAccountImportResultTemp', data.result));
                } else if (data.result.success) {
                    //todo $.i18n.prop('')ids
                    if($("#isBatchSendEmail").val()=="true"){
                        alertPromptMsgDlg($.i18n.prop('staffaccountmanage.js.insucesstosend'), 1);
                        setTimeout(function (){
                            staffaccountmanage.mailAjax(data.result.staffIds);
                        },3000);
                    }else {
                        alertPromptMsgDlg($.i18n.prop("staffaccountmanage.js.import.success"), 1, staffaccountmanage.returnMain);
                    }
                }
            }
        });
        $('#browseBtn').on('click', function () {
            $('#importFile').trigger('click');
        });
        $("#importStaffSaveBtn").on('click', function () {
            $('#importError').html('');
            $('#importResultModalContent').html('');
            if ($("#importFileName").text() == $.i18n.prop("staffaccountmanage.js.upload.select.file")) {
                $('#importError').html($.i18n.prop("staffaccountmanage.js.upload.pls.select"));
                return false;
            }
            if ($('#alreadyUpload').val() == 'false') {
                $('#importError').html($.i18n.prop("staffaccountmanage.js.upload.pls.upload"));
                return false;
            }
            $("#isBatchSendEmail").val("false");
            $('#importFile').data().submit();
        });
        $("#importStaffAndEmailSaveBtn").on('click', function () {
            $('#importError').html('');
            $('#importResultModalContent').html('');
            if ($("#importFileName").text() == $.i18n.prop("staffaccountmanage.js.upload.select.file")) {
                $('#importError').html($.i18n.prop("staffaccountmanage.js.upload.pls.select"));
                return false;
            }
            if ($('#alreadyUpload').val() == 'false') {
                $('#importError').html($.i18n.prop("staffaccountmanage.js.upload.pls.upload"));
                return false;
            }
            $("#isBatchSendEmail").val("true");
            $('#importFile').data().submit();
        });
    },
    returnMain: function () {
        $('.m-am').each(function () {
            $(this).hide();
        });
        staffaccountmanage.showStaffAccountList($("#pageNoSelect").val(), $("#pageSizeSelect").val(), $("#orderbyField").val(),
            $("#orderbyType").val(), $("#selectStaffId").val(), $("#search_staff_account").val());
        $('#staffAccount_manage').show();
        staffaccountmanage.lockFlag = false;
    },
    downloadTemplate: function () {
        location.href = getContextPath() + "/staff/template/download";
    },
    save: function (formId) {
        if (staffaccountmanage.validate(formId).form()){
            var params = {
                "username": $("#username_create").val(),
                "name": $("#name_create").val(),
                "email": $("#email_create").val()
            };
            showProgress($.i18n.prop('staffaccountmanage.js.saving'));
            setTimeout(function(){
                $.ajax({
                    url: getContextPath() + "/staff/create",
                    type: "post",
                    async: true,
                    data: params,
                    dataType: "json",
                    traditional: true,
                    success: function (result) {
                        hideProgressBar();
                        if (result.ret == 1) {
                            //formutil.clearErrorMsg('m-sam-add');
                            $('#staff_account_success_div').html(template('staffAccountCreateSuccessTemp', result));
                            $('#staffAccount_create_prev').hide();
                            if(result.rows.staff.email==null||result.rows.staff.email==""){
                                $("#mail").attr("disabled","disabled");
                            }else {
                                $("#mail").removeAttr("disabled");
                            }
                            $('#staffAccount_create_next').show();
                            staffaccountmanage.lockFlag= false;
                        } else {
                            alertPromptMsgDlg(result.message, 2, null);
                        }
                    }
                });
            },1000)
        }
    },
    openEditPage: function (id) {
        staffaccountmanage.lockFlag = true;
        $.ajax({
            url: getContextPath() + "/staff/" + id,
            type: "get",
            async: true,
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                document.getElementById('staffAccount_edit').innerHTML = template('staffAccountEditTemp', ret)
                $('.m-am').each(function () {
                    $(this).hide();
                });
                $('#staffAccount_edit').show();
                $("#m-sam-edit").find('input,select,textarea').each(function(){
                    $(this).blur(function () {
                        staffaccountmanage.validate("m-sam-edit");
                    });
                    //$(this).focus(function () {
                    //    staffaccountmanage.resetValidate("m-sam-edit");
                    //});
                })
                staffaccountmanage.resetValidate('m-sam-edit');
            }
        });
    },
    edit: function (formId, id, needMail) {
        if (staffaccountmanage.validate(formId).form()){
            //if (needMail && !$("#email_edit").val()) {
            //    validateutil.defaultFormErrorFmter($("#email_edit"), $.i18n.prop('staffaccountmanage.js.emailnotnull'));
            //    return false;
            //}
            var des3Key = randomString(32);
            var params = {
                "staffId": id,
                "username": $("#username_edit").val(),
                "name": $("#name_edit").val(),
                "email": $("#email_edit").val(),
                "password": DES3.encrypt(des3Key, $("#password_edit_hidden").val()),
                "des3Key": des3Key
            };
            if (needMail) {
                showProgress($.i18n.prop('staffaccountmanage.js.savingandsend'));
            }else{
                showProgress($.i18n.prop('staffaccountmanage.js.saving'));
            }
            $.ajax({
                url: getContextPath() + "/staff/edit",
                type: "post",
                async: true,
                data: params,
                dataType: "json",
                traditional: true,
                success: function (result) {
                    if (result.ret == 1) {
                        if (needMail && $("#email_edit").val()) {
                            staffaccountmanage.mailAjaxOnce([id]);
                            hideProgressBar();
                        } else {
                            alertPromptMsgDlg(result.message, 1, staffaccountmanage.returnMain);
                            hideProgressBar();
                        }
                        staffaccountmanage.lockFlag= false;
                    } else {
                        alertPromptMsgDlg(result.message, 2, null);
                        hideProgressBar();
                    }
                }
            });
        }
    },
    mail: function (id) {
        alertConfirmationMsgDlgDetail($.i18n.prop('staffaccountmanage.html.hint'), $.i18n.prop('staffaccountmanage.js.sentintheformofmail'), $.i18n.prop('staffaccountmanage.js.send'), staffaccountmanage.mailAjax, [id]);
    },
    mailBatch: function () {
        var _this = this;
        var staffIds = [];
        $('#m-am-table').find("input[id^='staffCheck_']").each(function () {
            if ($(this).prop('checked')) {
                staffIds.push($(this).attr("id").replace("staffCheck_", ""));
            }
        });
        if (staffIds.length == 0) {
            alertPromptMsgDlg($.i18n.prop('staffaccountmanage.js.pickcount'), 3, null);
            return;
        }
        alertConfirmationMsgDlgDetail($.i18n.prop('staffaccountmanage.html.hint'), $.i18n.prop('staffaccountmanage.js.sentintheformofmail'), $.i18n.prop('staffaccountmanage.js.send'), staffaccountmanage.mailAjax, staffIds);
    },
    deleteStaff: function (id) {
        alertConfirmationMsgDlgDetail($.i18n.prop('staffaccountmanage.html.hint'), $.i18n.prop('staffaccountmanage.js.suretodel'), $.i18n.prop('staffaccountmanage.js.sure'), staffaccountmanage.deleteAjax, [id]);
    },
    deleteBatch: function () {
        var staffIds = [];
        $('#m-am-table').find("input[id^='staffCheck_']").each(function () {
            if ($(this).prop('checked')) {
                staffIds.push($(this).attr("id").replace("staffCheck_", ""));
            }
        });
        if (staffIds.length == 0) {
            alertPromptMsgDlg($.i18n.prop('staffaccountmanage.js.pickcount'), 3, null);
            return;
        }
        alertConfirmationMsgDlgDetail($.i18n.prop('staffaccountmanage.html.hint'), $.i18n.prop('staffaccountmanage.js.delete.batch.suretodel'), $.i18n.prop('staffaccountmanage.js.sure'), staffaccountmanage.deleteAjax, staffIds);
    },
    resetpwd: function () {
        var pwd = randomNumberPwd(6);
        $('#password_edit').val(pwd);
        $("#password_edit_hidden").val(pwd);
    },
    mailAjax: function (staffIds) {
        showProgress($.i18n.prop('staffaccountmanage.js.seinding'));
        setTimeout(function () {
            $.ajax({
                url: getContextPath() + "/staff/mail",
                type: "post",
                data: {
                    staffIds: staffIds
                },
                dataType: "json",
                traditional: true,
                success: function (response) {
                    hideProgressBar();
                    if (response.ret == 1) {
                        alertPromptMsgDlg($.i18n.prop("staffaccountmanage.js.send.success"), 1, staffaccountmanage.returnMain);
                    } else {
                        if(response.rows){
                            if (response.rows.length == 1 && staffIds.length == 1) {
                                alertPromptMsgDlg($.i18n.prop("staffaccountmanage.js.send.mail.failed"), 2, staffaccountmanage.returnMain);
                            } else if (response.rows.length > 1) {
                                $('#modalCommon .modal-dialog').css('width', '410px');
                                $('#modalCommon .modal-dialog').css('height', '150px');
                                $("#modalCommonContent").html(template('staffAccountMailResultTemp', response));
                                $("#modalCommon").modal('show');
                                staffaccountmanage.returnMain();
                            }
                        }else{
                            alertPromptMsgDlg(response.message, 3, null);
                        }
                    }
                }
            });
        },1000);
    },
    mailAjaxOnce: function (staffIds) {
        $.ajax({
            url: getContextPath() + "/staff/mail",
            type: "post",
            data: {
                staffIds: staffIds
            },
            dataType: "json",
            traditional: true,
            success: function (response) {
                hideProgressBar();
                if (response.ret == 1) {
                    alertPromptMsgDlg($.i18n.prop("staffaccountmanage.js.send.success"), 1, staffaccountmanage.returnMain);
                } else {
                    alertPromptMsgDlg(response.message, 3);
                }
            }
        });
    },
    deleteAjax: function (staffIds) {
        showProgress($.i18n.prop('staffaccountmanage.js.deleting'));
        $.ajax({
            url: getContextPath() + "/staff/delete",
            type: "post",
            data: {
                staffIds: staffIds
            },
            dataType: "json",
            traditional: true,
            success: function (result) {
                hideProgressBar();
                if (result.ret == 1) {
                    alertPromptMsgDlg(result.message, 1, staffaccountmanage.returnMain);
                } else {
                    alertPromptMsgDlg(result.message, 3);
                }
            }
        });
    },
    checkAll: function (e) {
        var checked = $(e).prop('checked');
        $('#m-am-table').find("input[id^='staffCheck_']").each(function () {
            $(this).prop('checked', checked);
        });
        if (checked) {
            $('#batchMailStaff').disabled(true);
            $('#batchDeleteStaff').disabled(true);
        } else {
            $('#batchMailStaff').disabled(false);
            $('#batchDeleteStaff').disabled(false);
        }
    },
    search: function () {

    },
    returnLastPage: function () {
        $('.m-am').each(function () {
            $(this).hide();
        });
        staffaccountmanage.showStaffAccountList($("#totalPage").val(), $("#pageSizeSelect").val(), "createDate", 1);
        $("#orderbyField").val("createDate");
        $('#staffAccount_manage').show();
    },
    validate: function (formId){
        var _formId = "#"+formId;
        var validator = $(_formId).validate({
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            rules:{
                username:{
                    required:true,
                    number:true,
                    maxlength:4,
                    minlength:4
                },
                name:{
                    required:true
                },
                email:{
                    email:true
                }
            },
            messages:{
                username:{
                    required:$.i18n.prop('staffaccountmanage.js.namenotnull'),
                    number:$.i18n.prop('staffaccountmanage.js.nameonlynumber'),
                    maxlength:$.i18n.prop('staffaccountmanage.js.must4'),
                    minlength:$.i18n.prop('staffaccountmanage.js.must4')
                },
                name:{
                    required:$.i18n.prop('staffaccountmanage.js.xnamenotnull')
                },
                email:{
                    email:$.i18n.prop('staffaccountmanage.js.emailincorrect')
                }
            },
            highlight : function(element) {
                $(element).parent('div').addClass('has-error');
            },
            unhighlight:function(element){
                $(element).parent('div').removeClass('has-error');
                $(element).prev('label').text('');
            }, 
            success : function(span,element) {
                $(element).parent('div').removeClass('has-error');
                $(element).prev('label').text('');
            },
            errorPlacement : function(error, element) {
                $(element).prev('label').text(error.text());
            }
        });
        //var res = validator.form();
        return validator;
    },
    resetValidate:function(formId){
        var validator = staffaccountmanage.validate(formId);
        validator.resetForm();
    }
};

var staffoperation = {}
