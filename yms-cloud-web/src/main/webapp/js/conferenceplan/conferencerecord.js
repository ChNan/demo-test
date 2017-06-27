var conferencerecord = {
    /**
     * 待开始的会议显示编辑页面
     * */
    showEditRecord: function (conferenceRecordId) {
        conplan_recurrencepattern.canSaveRecurrencePattern = false;
        $.ajax({
            url: getContextPath() + "/conferenceRecord/edit/" + conferenceRecordId,
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var editPageDiv = result.rows.conferenceRecord.conferenceType.toLowerCase() + "_record_edit";
                    var editPageDivTemp = result.rows.conferenceRecord.conferenceType.toLowerCase() + "_record_edit_temp";
                    var editPageDom = $('#' + editPageDiv);
                    var isOutlookLogin="false";
                    if($("#isOutlookLogin").val()=="true"){
                        isOutlookLogin="true";
                    }
                    var param= $.extend(result.rows,{"isOutlookLogin":isOutlookLogin});
                    $(editPageDom).html(template(editPageDivTemp, param)); //渲染页面html
                    if(isOutlookLogin=="false"){
                        var editor = CKEDITOR.replace('editor_'+editPageDiv, {
                            language: $("#browserLang").val().toLowerCase().replace("_", "-")
                        });//参数‘content’是textarea元素的name属性值，而非id属性值
                        editor.setData(result.rows.conferenceRecord.emailRemark);
                    }

                    conferenceplan.switchDetailPage('m-cp-main', editPageDiv);
                    $(editPageDom).find('#time_zone').chosen({
                        search_contains: true,
                        width: "100%"
                    });
                    $(editPageDom).find('#conferenceRoomId').chosen({
                        disable_search:true
                    });
                    $(editPageDom).find('#time_zone_div').toggle();

                    var selectParticipantIds = "";
                    var selectExternalParticipantIds = "";
                    var selectPresenterIds = "";
                    var selectRoomIds = "";
                    var selectParticipantMails = "";
                    var selectPresenterMails = "";

                    if (result.rows.conferenceRecord.participants) {
                        $.each(result.rows.conferenceRecord.participants, function () {
                            if (this[conplan_participantselect.keyType] == conplan_participantselect.keyInternalType) {
                                if (this[conplan_participantselect.keyPermission] == conplan_participantselect.keyAttendee) {
                                    selectParticipantIds = selectParticipantIds + this["uid"] + ";";
                                    selectParticipantMails += ";" + this[conplan_participantselect.keyEmail];
                                }else if (this[conplan_participantselect.keyPermission] == conplan_participantselect.keyPresenter) {
                                    selectPresenterIds = selectPresenterIds + this["uid"] + ";";
                                    selectPresenterMails += ";" + this[conplan_participantselect.keyEmail];
                                }
                            } else {
                                selectExternalParticipantIds = selectExternalParticipantIds + this[conplan_participantselect.keyEmail] + ";";
                            }
                        });
                    }
                    selectParticipantMails = selectParticipantMails.substr(1);
                    selectPresenterMails = selectPresenterMails.substr(1);

                    if (result.rows.conferenceRecord.rooms) {
                        $.each(result.rows.conferenceRecord.rooms, function () {
                            selectRoomIds = selectRoomIds + this[conplan_participantselect.keyId] + ";";
                        });
                    }
                    $("#selectParticipantIds").val(selectParticipantIds);
                    $("#selectExternalParticipantIds").val(selectExternalParticipantIds);
                    $("#selectPresenterIds").val(selectPresenterIds);
                    $("#selectRoomIds").val(selectRoomIds);
                    $("#selectParticipantMails").val(selectParticipantMails);
                    $("#selectPresenterMails").val(selectPresenterMails);

                    var div = $(editPageDom).find(".form-horizontal[id^='m_'][id$='_edit']");//会议编辑表单
                    conferenceDateTimePicker.queryDatepicker(editPageDiv)
                    conferenceDateTimePicker.conferenceStartDatePick(div);
                    conferenceDateTimePicker.conferenceEndDatePick(div);
                    conferenceDateTimePicker.conferenceStartDateTimePick(div);
                    conferenceDateTimePicker.conferenceEndDateTimePick(div);

                    conferenceplan.delayLoadParticipant(editPageDiv,result.rows.conferenceRecord.conferenceType);
                    if($("#isOutlookLogin").val()=="true"){
                        $("#add_conference_rooms").on('shown.bs.modal', function () {
                            conplancalendar.showCalendarWithRoomsChecked('add_conference_rooms', 'timelineDay', 300);
                        });
                    }
                    var selectedTimezoneOffset = $(div).find("#time_zone option:selected").attr("utcoffset");
                    $(div).find("#time_zone").data('lastSelected', selectedTimezoneOffset);
                    conferenceplan.dateTimeChangeByTimeZone(div);
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 编辑会议1
     * */
    edit: function (formId, conferenceType, appId) {
        var formDom = $('#'+formId);
        validateutil.hideFormAllErrorMsg(formDom);
        var valid = true;
        if (validateNull($(formDom).find('input[name="name"]').val())) {
            validateutil.showErrorFmter($(formDom).find('input[name="name"]'), $.i18n.prop("conferenceplan.js.tips.fill.name"))
            valid = false;
        }
        var selectConferenceRoomIds = [];
        var selectConferenceRoomName;
        if (conferenceType == 'NC') { //todo modify later
            selectConferenceRoomIds.push($('#' + formId + ' select[name="conferenceRoomId"]').val());
            selectConferenceRoomName = $.trim($('#' + formId + ' select[name="conferenceRoomId"] option:selected').text());
        } else {
            selectConferenceRoomName = $("#selectRoomNames").val();
            var selectRoomIdsObj = $('#selectRoomIds');
            if ($(selectRoomIdsObj).val()) {
                var selectRoomIdsArray = $(selectRoomIdsObj).val().split(';');
                for (i in selectRoomIdsArray) {
                    if (selectRoomIdsArray.hasOwnProperty(i) && selectRoomIdsArray[i]) {
                        selectConferenceRoomIds.push(selectRoomIdsArray[i]);
                    }
                }
            }
        }
        if (conferenceType == 'NC') { // 校验会议室
            if (validateNull($(formDom).find('select[name="conferenceRoomId"]').val())) {
                validateutil.showErrorFmter($(formDom).find('select[name="conferenceRoomId"]'), $.i18n.prop("conferenceplan.js.tips.room.null"))
                valid = false;
            }
        }
        if (!valid)return;
        var params = conferenceplan.constructData(formId, 'edit_recurrence_pattern', conferenceType);
        //outlook端登录没有此编辑器
        var emailRemark="";
        if($("#isOutlookLogin").val()=="true"){
            emailRemark="";
        }else {
            emailRemark=CKEDITOR.instances['editor_' + conferenceType.toLowerCase() + "_edit"].getData();
        }
        // 如果params中有值就会把它覆盖掉
        params = $.extend({
            "recurrenceType": "RECURS_ONCE",
            "conferenceRoomIds": selectConferenceRoomIds,
            "emailRemark": emailRemark
        }, params);
        params.location = selectConferenceRoomName;
        params.utcOffset = $("#time_zone").find("option:selected").attr("utcOffset");
        params.timeZone = $("#time_zone").find("option:selected").attr("timeZone");
        showProgress($.i18n.prop("conferenceplan.js.book.submit.send.email"))
        setTimeout(function () {
            conferencerecord.ajaxEditPlan(params, appId)
        }, 300)
    },
    /**
     * 编辑会议2
     * */
    ajaxEditPlan:function(params,appId){
        $.ajax({
            url: getContextPath() + "/conferenceRecord/edit",
            type: "post",
            async: false,
            data: params,
            dataType: "json",
            traditional: true,
            success: function (result) {
                hideProgressBar();
                if (result.ret == 1) {
                    //如果是outlook登录，发送修改信息给outlook终端，用于修改outlook本地会议行程
                    if($("#isOutlookLogin").val()!=null&&$("#isOutlookLogin").val()=="true") {
                        params = $.extend({
                            "type": "edit",
                            "appointmentId": appId,
                            "conferenceId": params.conferencePlanId,
                            "conferenceNumber":"",
                            "conferenceStartTimeBefore":result.rows.conferenceStartTimeBefore, //更新之前的开始时间
                            "conferenceEndTimeBefore":result.rows.conferenceEndTimeBefore //更新之前的结束时间
                        }, params);
                        alertPromptMsgDlg($.i18n.prop("conferenceplan.js.edit.success.mail.notice"), 1, conferenceplan.postUpdateOutlookNoParam(params));
                    }else {
                        var warningMsg = result.rows.warningMsg;
                        var successMsg = result.rows.successMsg;
                        var emailErrorMsg = result.rows.emailErrorMsg;
                        var emailSuccMsg = result.rows.emailSuccMsg;
                        if(warningMsg){
                            alertPromptMsgDlg(warningMsg, 1, conferenceplan.reloadMain);
                        }else if(emailErrorMsg){
                            alertPromptMsgDlgWithDiyContent(
                                '<span style="font-size: 22px;color: #444444;">'+successMsg+'</span><br>' +
                                '<span style="font-size: 22px;color: red">'+emailErrorMsg+'</span>',
                                1, conferenceplan.reloadMain);
                        }else{
                            alertPromptMsgDlg(successMsg, 1, conferenceplan.reloadMain);
                        }
                    }
                } else {
                    alertPromptMsgDlg(result.message, 3, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 获取预约会议的相关数据
     * */
    constructData: function (formId, recurrencePatternModalId, conferenceType) {
        var requiredAttendees = "";
        var internalParticipants = [];
        var presenters = [];
        var selectExternalParticipantIds = [];

        var selectParticipantIdsObj = $('#selectParticipantIds');
        var selectPresenterIdsObj = $('#selectPresenterIds');
        var selectExternalParticipantIdsObj = $('#selectExternalParticipantIds');

        if ($(selectParticipantIdsObj).val()) {
            var participantsArray = $(selectParticipantIdsObj).val().split(';');
            for (i in participantsArray) {
                if (participantsArray.hasOwnProperty(i) && participantsArray[i]) {
                    internalParticipants.push(participantsArray[i]);
                }
            }
        }
        if ($(selectPresenterIdsObj).val()) {
            var presenterArray = $(selectPresenterIdsObj).val().split(';');
            for (i in presenterArray) {
                if (presenterArray.hasOwnProperty(i) && presenterArray[i]) {
                    presenters.push(presenterArray[i]);
                }
            }
        }
        if ($(selectExternalParticipantIdsObj).val()) {
            var selectExternalParticipantIdArray = $(selectExternalParticipantIdsObj).val().split(';');
            for (i in selectExternalParticipantIdArray) {
                if (selectExternalParticipantIdArray.hasOwnProperty(i) && selectExternalParticipantIdArray[i]) {
                    selectExternalParticipantIds.push(selectExternalParticipantIdArray[i]);
                }
            }
        }
        var recurrencePattern = $('#' + recurrencePatternModalId);
        var recurrenceType = $(recurrencePattern).find("input[name='recurrenceType']:checked").val();
        var monthRecurrenceType = $(recurrencePattern).find("input[name='monthRecurrenceType']:checked").val();
        var yearRecurrenceType = $(recurrencePattern).find("input[name='yearRecurrenceType']:checked").val();
        var actualRecurrenceType;
        var interval = 0;
        var recurrencePatternData = {};
        if (recurrenceType == 'RECURS_DAILY' || recurrenceType == 'RECURS_WEEKLY') {
            actualRecurrenceType = recurrenceType;
        } else if (recurrenceType == 'RECURS_MONTH') {
            actualRecurrenceType = monthRecurrenceType;
        } else if (recurrenceType == 'RECURS_YEAR') {
            actualRecurrenceType = yearRecurrenceType;
            interval = $(recurrencePattern).find('#RECURS_YEAR').find("input[name='interval']").val();
            recurrencePatternData['interval'] = interval;
        }

        var checkedRecurrenceRange = $(recurrencePattern).find('input[name="recurrenceRange"]:checked').val();
        $(recurrencePattern).find('#' + actualRecurrenceType + ", #recurrence_range_" + checkedRecurrenceRange).find('input[type="text"],input[type="radio"]:checked,select').each(function (idx, item) {
            recurrencePatternData[item.name] = item.value;
        });
        var daysOfWeeks = [];
        if (actualRecurrenceType == 'RECURS_WEEKLY') {
            $(recurrencePattern).find('#RECURS_WEEKLY').find('input[type="checkbox"]:checked').each(function (idx, item) {
                daysOfWeeks.push($(this).val())
            });
        }
        if (conplan_recurrencepattern.isClearRecurrencePattern) {
            recurrencePatternData['recurrenceType'] = "RECURS_ONCE";
        }else if (conplan_recurrencepattern.canSaveRecurrencePattern) {
            recurrencePatternData['recurrenceType'] = actualRecurrenceType;
        }

        recurrencePatternData['daysOfWeeks'] = daysOfWeeks;

        var attendees = $("#selectParticipantMails").val();
        if ($("#selectExternalParticipantIds").val()) {
            var temp = $("#selectExternalParticipantIds").val();
            attendees += ";" + temp;
        }
        if(conferenceType && conferenceType == "VC") {
            var selectPresenterMails = $("#selectPresenterMails").val();
            selectPresenterMails = (!selectPresenterMails)? $("#loginStaffEmail").val() : selectPresenterMails;
            attendees += ";" + selectPresenterMails;
        }
        var itemArray = attendees.split(';');
        attendees = "";
        for (i in itemArray) {
            if (itemArray.hasOwnProperty(i) && itemArray[i]) {
                attendees += ";" + itemArray[i];
            }
        }
        attendees = attendees.substr(1);
        var params = $.extend({
            "internalParticipants": internalParticipants,
            "presenters": presenters,
            "externalParticipants": selectExternalParticipantIds,
            "patternStartDate": $(recurrencePattern).find('#pattern_start_date').val(),
            "canSaveRecurrencePattern": conplan_recurrencepattern.canSaveRecurrencePattern,
            "attendees": attendees
        }, formutil.getFormData(formId), recurrencePatternData);
        return params;
    },
    toggleSource: function(formId, iObject) {
        var sourcePanelObj = $("#" + formId + " div[name='confSourcePanel']");
        var isVisible = sourcePanelObj.is(":visible");
        if(isVisible) {
            $(iObject).children().attr("class", "glyphicon glyphicon-chevron-down");
            sourcePanelObj.hide();
        } else {
            sourcePanelObj.show();
            $(iObject).children().attr("class", "glyphicon glyphicon-chevron-up");
        }
    },
    /**
     * 删除会议预约记录
     * */
    deleteConferenceRecord: function (id,stayFuturePage,result) {
        var title;
        var message;
        title = $.i18n.prop("conferenceplan.js.common.title.notice");
        message = $.i18n.prop("conferenceplan.js.message.confirm.cancle.conference");
        var buttonTxt = $.i18n.prop("conferenceplan.js.common.btn.confirm");
        alertConfirmationMsgDlgDetail(title, message, buttonTxt, conferencerecord.deleteConferenceRecordAjax, id, result.rows.conferencePlan.appointmentId, stayFuturePage);
    },
    /**
     * 删除会议预约记录2,发送请求部分
     * */
    deleteConferenceRecordAjax: function (id, appointmentId, stayFuturePage) {
        $.ajax({
            url: getContextPath() + "/conferenceRecord/delete",
            type: "post",
            data: {
                conferenceRecordId: id
            },
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    //outlook登录，post发送邮件信息
                    if($("#isOutlookLogin").val()!=null&&$("#isOutlookLogin").val()=="true") {
                        alertPromptMsgDlg(result.message, 1, conferencerecord.postDeleteOutlookNoParam(appointmentId,id,
                            result.rows.conferenceStartTimeBefore,result.rows.conferenceEndTimeBefore));
                    }else {
                        alertPromptMsgDlg(result.message, 1,  function () {
                            if (stayFuturePage == false) {
                                conferenceplan.reloadMain();
                            }else{
                                $("button[searchtype=0]").trigger('click');
                            }
                        });
                    }
                } else {
                    alertPromptMsgDlg(result.message, 3, null, result.returnUrl);
                }
            }
        });
    },
    postDeleteOutlookNoParam:function(appointmentId,id,conferenceStartTimeBefore,conferenceEndTimeBefore){
        return function (){
            var params={"type":"delete","appointmentId":appointmentId,"conferenceId":id,
                "conferenceStartTimeBefore":conferenceStartTimeBefore,
                "conferenceEndTimeBefore":conferenceEndTimeBefore};
            //console.log(JSON.stringify(params));
            $("#params").val(JSON.stringify(params));
            $("#submitOutlookForm").submit();
            conferenceplan.reloadMain();
        }
    }
}
