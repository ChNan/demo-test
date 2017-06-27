var intervalJobId;//正在进行会议页面的周期任务id
var countDownJobId;
var datofweek;
var indexOfDayWeek;
var ONE_DAY_MILLS = 24 * 60 * 60 * 1000;
var ONE_MONTH_MIN_MILLS =28 * 24 * 60 * 60 * 1000;
var ONE_YEAR_MIN_MILLS =365 * 24 * 60 * 60 * 1000;
$(function() {
    datofweek = {
        Sunday: $.i18n.prop("conferenceplan.js.sunday"),
        Monday: $.i18n.prop("conferenceplan.js.monday"),
        Tuesday: $.i18n.prop("conferenceplan.js.tuesday"),
        Wednesday: $.i18n.prop("conferenceplan.js.wednesday"),
        Thursday: $.i18n.prop("conferenceplan.js.thursday"),
        Friday: $.i18n.prop("conferenceplan.js.friday"),
        Saturday: $.i18n.prop("conferenceplan.js.saturday"),
        Day: $.i18n.prop("conferenceplan.js.day"),
        Weekday: $.i18n.prop("conferenceplan.js.weekday"),
        WeekendDay: $.i18n.prop("conferenceplan.js.weekendDay")
    },
    indexOfDayWeek = {
        Sunday: 1,
        Monday: 2,
        Tuesday: 3,
        Wednesday: 4,
        Thursday: 5,
        Friday: 6,
        Saturday: 7
    }
});

var conferenceplan = {
    //会议提前开始时间
    //FIXME 后续修改成从后台获取
    leadTime: 5,
    /**
     * 整个会议预约的初始化方法，处理
     * 1：outlook的调用
     * 2：首页日历控件的渲染
     * 3：添加会议室模态窗弹出后的日历控件的渲染
     * 4：正在进行会议，待开始的会议，已结束的会议的tab点击切换，实现查询功能
     * 5：我为主持方的会议，视频会议checkbox过滤查询。
     * */
    init: function () {
        readyLanguage();
        if ($('#browserLang').val() == 'en') {
            $.datetimepicker.setLocale('en');
        } else if ($('#browserLang').val() == 'zh_CN') {
            $.datetimepicker.setLocale('ch');
        }

        //判断是否是outlook端的登录
        if($("#isOutlookLogin").val()=="true"){
            conferenceplan.outlookInit();
        }

        $('#add_participant_modal').on('hide.bs.modal', function () {
            searchOperate.clearSearchDiv('add_participant_modal #search_staff_div');
            $('#add_participant_modal #selected_staff').empty();
        });
        $('#add_presenter_modal').on('hide.bs.modal', function () {
            searchOperate.clearSearchDiv('add_presenter_modal #search_staff_div');
            $('#add_participant_modal #selected_staff').empty();
        });
        $("#add_conference_rooms").on('shown.bs.modal', function () {
            conplancalendar.showCalendarWithRoomsChecked('add_conference_rooms', 'timelineDay');
        });
        //我为主持方的会议，视频会议,checkbox过滤查询。
        $('.m-c-checkbox').on('click', function () {
            var selectedBtn = $('.conf-selected');
            var redirect = $(selectedBtn).attr('redirect');
            var searchType = $(selectedBtn).attr('searchType');
            var checkRole = $("#check_role");
            var checkConfType = $("#check_conf_type");
            var queryDate = null;
            var template = $(selectedBtn).attr('template');
            var data;
            var orderByType = 1;
            if (searchType == 2) { // 已经结束的会议排序倒序
                orderByType = -1;
            }
            if ($(this).attr('name') == 'role') {
                data = {
                    "searchType": searchType,
                    "confType": $(checkConfType).prop('checked') ? $(checkConfType).val() : null,
                    "role": $(this).prop('checked') ? $(this).val() : null,
                    "queryDate": queryDate,
                    "orderByType":orderByType
                }
            } else {
                data = {
                    "searchType": searchType,
                    "confType": $(this).prop('checked') ? $(this).val() : null,
                    "role": $(checkRole).prop('checked') ? $(checkRole).val() : null,
                    "queryDate": queryDate,
                    "orderByType":orderByType
                };
            }
            if (searchType == -1) {
                queryDate = $('#c_plan_index').find("input[name='queryDate']").val();
                queryDate = moment(queryDate).valueOf();
                conplancalendar.showMyConferenceCalendar('c_plan_index', 'agendaWeek', 550, $.extend(data, {"queryDate": queryDate,"pageNo": 1, "pageSize": Math.pow(2, 31) - 1}));
            } else if (searchType == -2) {
                data = $.extend({"searchKey": $("#search_key_conferenceplan").val()}, data);
                conferenceplan.searchConference(data, redirect, null, template);
            } else if (searchType == 2 || searchType == -1) { //我的全部会议和已结束的会议不显示数量
                conferenceplan.searchConference(data, redirect, null, template);
            } else {
                conferenceplan.searchConference(data, redirect, selectedBtn, template);
            }
        });
        //正在进行会议，待开始的会议，已结束的会议的tab点击切换，实现查询功能
        $('.conf-btn').on('click', function () {
            var _this = this;
            var redirect = $(_this).attr('redirect');
            var searchType = $(_this).attr('searchType');
            $('.conf-btn').removeClass('conf-selected');
            $(_this).addClass('conf-selected');
            var checkRole = $("#check_role");
            var checkConfType = $("#check_conf_type");
            $('#checked_search_type').val(searchType);
            if (searchType == -1) {
                $('.m-cp-main-sub').hide();
                $('#' + redirect).show();
                conplancalendar.showMyConferenceCalendar('c_plan_index', 'agendaWeek', 550, {"queryDate": moment().valueOf(),
                    "confType": $(checkConfType).prop('checked') ? $(checkConfType).val() : null,
                    "role": $(checkRole).prop('checked') ? $(checkRole).val() : null,
                    "pageNo": 1, "pageSize": Math.pow(2, 31) - 1});
            }else {
                var orderByType = 1;
                if (searchType == 2) { // 已经结束的会议排序倒序
                    orderByType = -1;
                }
                conferenceplan.searchConference({
                    "searchType": searchType,
                    "confType": $(checkConfType).prop('checked') ? $(checkConfType).val() : null,
                    "role": $(checkRole).prop('checked') ? $(checkRole).val() : null,
                    "orderByType":orderByType,
                    "pageNo": 1, "pageSize": 50
                }, redirect, (searchType == -2 || searchType == -1 || searchType == 2) ? null : _this, $(_this).attr("template"));
            }
        });
        //搜索框的实现，alpha暂不实现
        $('#search_conference_box').on('click', function () {
            var _this = this;
            var redirect = $(_this).attr('redirect');
            var searchType = $(_this).attr('searchType');
            var checkRole = $("#check_role");
            var checkConfType = $("#check_conf_type");
            $('#checked_search_type').val(searchType);
            var key = $("#search_key_conferenceplan").val();
            var orderByType = 1;
            if(searchType==2){
                orderByType=-1;
            }
            conferenceplan.searchConference({
                "searchType": searchType,
                "confType": $(checkConfType).prop('checked') ? $(this).val() : null,
                "role": $(checkRole).prop('checked') ? $(checkRole).val() : null,
                "searchKey": key,
                "orderByType":orderByType
            }, redirect, null, $(_this).attr("template"));
        })
        var searchKeyConferenceplan = $('#search_key_conferenceplan');
        $(searchKeyConferenceplan).on('keydown', function (event) {
            if (event.keyCode == "13") {
                $('#search_conference_box').trigger('click');
            }
        });
        conferenceDateTimePicker.queryDatepickerMainPage();
        conferenceplan.adjustIndexCalendarWidth();

        if($('#searchType').val()){
            $("button[searchType=" + $('#searchType').val() + "]").trigger('click');
        }
        $(window).resize(conferenceplan.adjustIndexCalendarWidth);
    },
    /**
     * 适应首页右边的日历大小
     * */
    adjustIndexCalendarWidth: function() {
        var indexCalendar = $(".calendar.pull-right");
        var parentWidth = indexCalendar.parent().width();
        var leftWidth = indexCalendar.prev().width();
        var adjustWidth = parentWidth - leftWidth - 15;
        indexCalendar.width(adjustWidth < 670 ? 670 : adjustWidth);

    },
    /**
     * outlook端的初始化
     * */
    outlookInit:function(){
        //outlook相关url拦截跳转页面
        var url = window.location.href;
        if(url.indexOf("bookVideo")>0){
            conferenceplan.switchAddPage("m-cp-main","vc_plan_add");
            return;
        }
        if(url.indexOf("bookOrdinary")>0){
            conferenceplan.switchAddPage("m-cp-main","nc_plan_add");
            return;
        }
        if(url.indexOf("conferenceManage")>0){
            conferenceplan.returnMain();
            return;
        }
        if(url.indexOf("presentOnline")>0){
            var conferenceRecordId = url.substring(url.indexOf("conferenceRecordId=")+19,url.length);
            conferenceplan.showConferenceEndLivingRecordDetail(conferenceRecordId);
            return;
        }
        if(url.indexOf("presentReady")>0){ // "/main?type=presentReady&staffId=userId&conferenceRecordId=conferenceRecordId&conferencePlanId=conferencePlanId"
            var conferencePlanId = url.substring(url.indexOf("conferencePlanId=")+17,url.length);
            var conferenceRecordId =  url.substring(url.indexOf("conferenceRecordId=")+19,url.indexOf("&conferencePlanId"));
            conferenceplan.showConferenceReadyRecordDetail(conferenceRecordId,conferencePlanId);
            return;
        }
        $("#c_plan_index").show();
        conplancalendar.showMyConferenceCalendar('c_plan_index', 'agendaWeek', 550, {"queryDate": moment().valueOf(), "pageNo": 1, "pageSize": Math.pow(2, 31) - 1})
    },
    /**
     * 查询会议数据
     * */
    searchConference: function searchConference(data, redirect, btn, temp) {
        $.ajax({
            url: getContextPath() + "/conference/query",
            type: "post",
            async: false,
            data: JSON.stringify($.extend({"pageNo": 1, "pageSize": 50}, data)),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                conferenceplan.searchParam = $.extend({"pageNo": 1, "pageSize": 50}, data);
                if (result.ret == 1) {
                    $('.m-cp-main-sub').hide();
                    $('#' + redirect).html(template(temp, $.extend(result.rows,
                        {
                            "pageArray": getPageNoArray(result.rows.pageModel.totalPages),
                            "loginStaffId": $("#loginStaffId").val(),
                            "redirect": redirect,
                            "temp": temp
                        }
                    ))).show();
                    var total = result.rows.totalCount;
                    if (btn) {
                        $(btn).text($(btn).attr('content') + "(" + $.i18n.prop("conferenceplan.js.conference.count", total) + ")")
                    }
                    conferenceplan.compensateScroll("#" + redirect + " div.list-table-header","#" + redirect + " div.div-scroll-table-body");
                    if(redirect=='conf_living'){
                        conferenceplan.showCountDown();
                    }
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    searchParam:{},
    searchConferenceByPage:function(pageNo,pageSize,redirect, temp){
        var data= $.extend(conferenceplan.searchParam,{"pageNo": pageNo, "pageSize": pageSize});
        conferenceplan.searchConference(data,redirect, null, temp);
    },
    /**
     * 设置会议周期
     * */
    setConferencePeriod: function (type, pageFormid) {
        var modal = $('#' + type + "_recurrence_pattern");
        $(modal).modal('show');
        if (!$(modal).find('#pattern_start_date').val()) {
            $(modal).find('#pattern_start_date').val(moment(new Date()).format('YYYY-MM-DD'));
        }
        $(modal).find('#pattern_start_date').datetimepicker({
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            scrollInput: false,
            onSelectDate: function (date, $input) {
                $input.blur();
            }
        });
        conferenceDateTimePicker.conferencePatternStartDatePick(pageFormid,modal);
        conferenceDateTimePicker.conferencePatternEndDatePick(pageFormid,modal);
        conferenceDateTimePicker.patternStartTime(pageFormid,modal);
        conferenceDateTimePicker.patternEndTime(pageFormid,modal);
        if (!$(modal).find('#pattern_end_date').val()) {
            $(modal).find('#pattern_end_date').val(moment(new Date()).format('YYYY-MM-DD'));
        }
        $(modal).find('#pattern_end_date').datetimepicker({
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            scrollInput: false,
            timepicker: false
        });
        $(modal).on('hide.bs.modal', function () {
            validateutil.clearErrorMsg(type + "_recurrence_pattern #recurrence_pattern_form");
        })
        $('#' + type + "_recurrence_pattern #recurrence_pattern_btn").off('click').on('click', function () {
            conplan_recurrencepattern.saveRecurrencePattern(type, pageFormid);
        });
        $("#" + type + "_recurrence_pattern #clearRecursBtn").off('click').on("click", function () {
            this.blur();
            if(typeof ($(this).attr("disclick")) != "undefined") {
                return;
            }
            $("#" + type + "_recurrence_pattern").modal("hide");
            conplan_recurrencepattern.clearRecurrencePattern(type, pageFormid);
        });
    },
    /**
     * 预约和编辑视频会议的时候，点击添加会议室模态窗弹出
     * */

     addRooms: function (formId,patternDivId) {
        $("#add_conference_rooms").attr("sourceForm", formId);
        $("#add_conference_rooms").modal("show");
        $('#confirmSaveRooms').off('click').on('click', function () {
            conferenceplan.confirmSaveAddRooms(formId,patternDivId)
        });
    },
    /**
     * 预约和编辑视频会议的时候，点击添加会议室模态窗弹出
     * */
    confirmSaveAddRooms: function (formId,patternDivId) {
        var modal = $("#add_conference_rooms");
        var conferenceDate =$("#" + formId + " input[name='conferenceDate']");
        var conferenceEndDate =$("#" + formId + " input[name='conferenceEndDate']");

        var selectedDate =  $(modal).find("input[name='queryDate']").val();
        $(conferenceDate).val(selectedDate);
        $(conferenceEndDate).val($(conferenceEndDate).val() > selectedDate ? $(conferenceEndDate).val() : selectedDate);

        var selectConferenceRoomIds = [];
        $(modal).find("input[id^='checkRoom_']").each(function () {
            var _this = this;
            if ($(_this).prop('checked')) {
                var roomId = $(_this).attr('resource_id');
                selectConferenceRoomIds.push(roomId)
            }
        });

        var params = conferenceplan.constructData(formId,patternDivId , null);
        params = $.extend({
            "recurrenceType": "RECURS_ONCE", // 如果params中有值就会把它覆盖掉
            "creatorId": $('#loginStaffId').val(),
            "conferenceRoomIds": selectConferenceRoomIds,
            "utcOffset": $("#" + formId +" #time_zone").find("option:selected").attr("utcOffset")
        }, params);

        $.ajax({
            url: getContextPath() + "/conferencePlan/rooms/conflict",
            type: "post",
            async: false,
            data: params,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var roomIds = "";
                    var roomNames = "";
                    var html = "";
                    $(modal).find("input[id^='checkRoom_']").each(function () {
                        var _this = this;
                        if ($(_this).prop('checked')) {
                            var roomId = $(_this).attr('resource_id');
                            var name = $(_this).attr('resource_title');
                            roomIds = roomIds + roomId + ";";
                            roomNames += ";" + name;
                            var roomObj = {"id": roomId, "name": name, "selectInput": "selectRoomIds", "type": $(_this).attr('room_type')};
                            html += template('rooms_temp', roomObj);
                        }
                    });
                    $("#" + formId).find('#rooms_content').html(html);
                    $("#selectRoomIds").val(roomIds);
                    $("#selectRoomNames").val(roomNames.substr(1));
                    $(modal).modal('hide');

                } else {
                    alertPromptMsgDlg(result.message, 3, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 预约和编辑视频会议的时候，点击参会者弹出框
     * */
    addParticipant: function (mainPageId, type) {
        conplan_participantselect.initParticipant('add_participant_modal', conplan_participantselect.participantTreeId,
            'selectParticipantIds', 'participant_content', mainPageId, type, $('#creatorId').val());
        validateutil.clearCurrentNodeErrorMsg("external_email");

        $("#add_participant_modal #external_email .close ").hide();
        var selectExternalParticipantIds = $('#selectExternalParticipantIds').val().split(';');
        for (i in selectExternalParticipantIds) {
            if (selectExternalParticipantIds.hasOwnProperty(i) && selectExternalParticipantIds[i]) {
                var ret = {"id": selectExternalParticipantIds[i],
                    "treeId":conplan_participantselect.participantTreeId,
                    "nameWithEmail": selectExternalParticipantIds[i],
                    "type": "email"};
                $('#add_participant_modal').find('#selected_staff').append(template("selected_staff_li", ret));
            }
        }
        var modal =$('#' + conplan_participantselect.participantTreeId).parents('.modal');
        var count = $(modal).find('#selected_staff div').length;
        $(modal).find('#select_count').text($(modal).find('#select_count').attr('content').replace('%',count));
        $("#add_participant_modal").modal("show");
    },
    /**
     * 预约和编辑视频会议的时候，点击添加主持人弹出框
     * */
    addPresenter: function (mainPageId, type) {
        conplan_participantselect.initPresenter('add_presenter_modal', conplan_participantselect.presenterTreeId,
            'selectPresenterIds', 'presenter_content', mainPageId, type, $('#'+mainPageId).find('#creatorId').val());
        $("#add_presenter_modal").modal("show");
    },

    /**
     * 正在进行的和已经结束的会议查询历史会议的详细数据
     * */
    showConferenceEndLivingRecordDetail: function (conferenceRecordId) {
        $.ajax({
            url: getContextPath() + "/conference/" + conferenceRecordId, type: "get",
            async: false, dataType: "json", traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var rows = $.extend(result.rows, {"localeTimeZoneDisplay": getZoneDisplay(moment().utcOffset())});
                    var detailPageDiv;
                    var detailPageDivTemp;
                    if (result.rows.conferenceType == 'NC') {
                        detailPageDiv = "nc_detail_end";
                        detailPageDivTemp = "nc_detail_end_living_temp";
                    } else {
                        detailPageDiv = "vc_detail_end";
                        detailPageDivTemp = "vc_detail_end_living_temp";
                    }
                    $('#' + detailPageDiv).html(template(detailPageDivTemp, rows));
                    conferenceplan.switchDetailPage('m-cp-main', detailPageDiv);
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 正在进行的和已经结束的会议查询历史会议的详细数据，待开始的会议，但是已经被独立编辑过了，不需要依赖会议模板了。
     * */
    showConferenceReadyRecordDetail: function (conferenceRecordId,conferencePlanId) {
        $.ajax({
            url: getContextPath() + "/conference/" + conferenceRecordId, type: "get",
            async: false, dataType: "json", traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var rows = $.extend(result.rows, {"conferencePlanId": conferencePlanId, "localeTimeZoneDisplay": getZoneDisplay(moment().utcOffset())});
                    var detailPageDiv;
                    var detailPageDivTemp;
                    if (result.rows.conferenceType == 'NC') {
                        detailPageDiv = "nc_detail_ready";
                        detailPageDivTemp = "nc_detail_ready_temp";
                    } else {
                        detailPageDiv = "vc_detail_ready";
                        detailPageDivTemp = "vc_detail_ready_temp";
                    }
                    $('#' + detailPageDiv).html(template(detailPageDivTemp, rows));
                    conferenceplan.switchDetailPage('m-cp-main', detailPageDiv);
                    $('#' + detailPageDiv).find('#toggleSource').trigger('click');
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 待开始的会议显示编辑页面
     * */
    showEdit: function (conferencePlanId,conferenceRecordId) {
        $.ajax({
            url: getContextPath() + "/conferencePlan/" + conferencePlanId,
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    if (result.rows.conferencePlan.recurrencePattern.recurrenceType != 'RECURS_ONCE') { // 如果不是单次会议，是周期会议，那么就有两个选项
                        $("#editConferenceRecord").off('click').on('click', function () {
                            conferencerecord.showEditRecord(conferenceRecordId)
                        });
                        $("#editConferencePlan").off('click').on('click', function () {
                            conferenceplan.showEditPlan(conferencePlanId);
                        });
                        $('#editChooseModal').modal('show');
                    } else {
                        conferenceplan.showEditPlan(conferencePlanId);
                    }
                } else {
                    alertPromptMsgDlg(result.message, 2, null, function () {
                        window.location.href = result.returnUrl;
                    });
                }
            }
        });
    },
    showEditPlan: function (conferencePlanId) {
        conplan_recurrencepattern.canSaveRecurrencePattern = false;
        $.ajax({
            url: getContextPath() + "/conferencePlan/edit/" + conferencePlanId,
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var editPageDiv = result.rows.conferencePlan.conferenceType.toLowerCase() + "_plan_edit";
                    var editPageDivTemp = result.rows.conferencePlan.conferenceType.toLowerCase() + "_plan_edit_temp";
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
                        editor.setData(result.rows.conferencePlan.emailRemark);
                    }

                    var monthOfYear = [];
                    var monthName = [$.i18n.prop("conferenceplan.js.january"), $.i18n.prop("conferenceplan.js.february"), $.i18n.prop("conferenceplan.js.march"),
                        $.i18n.prop("conferenceplan.js.april"), $.i18n.prop("conferenceplan.js.may"), $.i18n.prop("conferenceplan.js.june"),
                        $.i18n.prop("conferenceplan.js.july"), $.i18n.prop("conferenceplan.js.august"), $.i18n.prop("conferenceplan.js.september"),
                        $.i18n.prop("conferenceplan.js.october"), $.i18n.prop("conferenceplan.js.november"), $.i18n.prop("conferenceplan.js.december")];
                    for (var i = 1; i <= 12; i++) {
                        monthOfYear.push({"monthCode": i - 1, "name": monthName[i - 1]});
                    }
                    $('#edit_recurrence_pattern').html(template("edit_recurrence_pattern_temp", $.extend(result.rows, {"monthOfYear": monthOfYear})));
                    conferenceplan.switchDetailPage('m-cp-main', editPageDiv);
                    $(editPageDom).find('#time_zone').chosen({
                        search_contains: true,
                        width: "100%"
                    });
                    $(editPageDom).find('#conferenceRoomId').closest("div.m-conf-content-percent-89").attr("class", "m-conf-content-percent-60");
                    $(editPageDom).find('#conferenceRoomId').chosen({
                        forceScroll40: true,
                        disable_search:true,
                        width: "100%"
                    });
                    $(editPageDom).find('#time_zone_div').toggle();

                    var selectParticipantIds = "";
                    var selectExternalParticipantIds = "";
                    var selectPresenterIds = "";
                    var selectRoomIds = "";
                    var selectParticipantMails = "";
                    var selectPresenterMails = "";

                    if (result.rows.conferenceParticipants) {
                        $.each(result.rows.conferenceParticipants, function () {
                            if (this[conplan_participantselect.keyType] == conplan_participantselect.keyInternalType) {
                                selectParticipantIds = selectParticipantIds + this[conplan_participantselect.keyId] + ";";
                                selectParticipantMails += ";" + this[conplan_participantselect.keyEmail];
                            } else {
                                selectExternalParticipantIds = selectExternalParticipantIds + this[conplan_participantselect.keyEmail] + ";";
                            }
                        });
                    }
                    selectParticipantMails = selectParticipantMails.substr(1);
                    if (result.rows.conferencePresenters) {
                        $.each(result.rows.conferencePresenters, function () {
                            selectPresenterIds = selectPresenterIds + this[conplan_participantselect.keyId] + ";";
                            selectPresenterMails += ";" + this[conplan_participantselect.keyEmail];
                        });
                    }
                    selectPresenterMails = selectPresenterMails.substr(1);
                    if (result.rows.conferencePlan.conferenceRooms) {
                        $.each(result.rows.conferencePlan.conferenceRooms, function () {
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

                    conferenceplan.delayLoadParticipant(editPageDiv,result.rows.conferencePlan.conferenceType);
                    if($("#isOutlookLogin").val()=="true"){
                        $("#add_conference_rooms").on('shown.bs.modal', function () {
                            conplancalendar.showCalendarWithRoomsChecked('add_conference_rooms', 'timelineDay');
                        });
                    }
                    var selectedTimezoneOffset = $(div).find("#time_zone option:selected").attr("utcoffset");
                    $(div).find("#time_zone").data('lastSelected', selectedTimezoneOffset);
                    conferenceplan.dateTimeChangeByTimeZone(div,'edit');
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 延时加载人员数据，给参与者和主持人用。
     * */
    delayLoadParticipant:function(modulPageId,type){
        if(type=="VC") {
            setTimeout(function () {
                var staffNodes = conplan_participantselect.showStaffListModal('add_participant_modal', conplan_participantselect.participantTreeId,
                    'selectParticipantIds', 'participant_content', modulPageId, 'VC', $('#creatorId').val());
                $.fn.zTree.init($("#" + conplan_participantselect.participantTreeId), conplan_participantselect.setting, staffNodes);
                $.fn.zTree.init($("#" + conplan_participantselect.presenterTreeId), conplan_participantselect.setting, staffNodes);
            }, 200);
        }else {
            setTimeout(function () {
                var staffNodes = conplan_participantselect.showStaffListModal('add_participant_modal', conplan_participantselect.participantTreeId,
                    'selectParticipantIds', 'participant_content',modulPageId,'NC', $('#creatorId').val());
                $.fn.zTree.init($("#" + conplan_participantselect.participantTreeId), conplan_participantselect.setting, staffNodes);
            }, 200);
        }
    },
    /**
     * 首页日历视图里，鼠标放到一个会议上，弹出可操作的popup
     * */
    showConferencePopupOperate: function (_this, id) {
        conferenceplan.showConferencePopup(_this, "/conference/" + id, 'popUpContentOperate', "left");
    },
    /**
     * 预约，编辑，详情页的查看会议室资源日历视图里，鼠标放到一个会议上，显示简略的会议信息
     * */
    showConferencePopupSummary: function (_this, id) {
        conferenceplan.showConferencePopup(_this, "/conferencePlan/summary/" + id, 'popUpContentSummary', "left");
    },
    /**
     * 显示会议弹出框信息
     * */
    showConferencePopup: function (_this, url, templateStr, placement) {
        $.ajax({
            url: getContextPath() + url,
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    $(_this).off("mouseenter").off("mouseleave");
                    $(_this).popover({
                        trigger: 'manual',
                        placement: placement, //top, bottom, left or right
                        html: 'true',
                        title: '',
                        container: $(_this).parents(".m-cp-main"),
                        content: context(result.rows)
                    }).on("mouseenter", function () {
                        var _this = this;
                        $(this).popover("show");
                        $(".popover").css("z-index", 1039);
                        $("body .popover").on("mouseleave", function () {
                            $(_this).popover('hide');
                            $(_this).off("mouseenter").off("mouseleave");
                        });
                    }).on("mouseleave", function () {
                        var _this = this;
                        setTimeout(function () {
                            if (!$(".popover:hover").length) {
                                $(_this).popover("hide");
                                $(_this).off("mouseenter").off("mouseleave");
                            }
                        }, 100);
                    });
                    $(_this).trigger('mouseenter');
                } else {
                    alertPromptMsgDlg(result.message, 2, conferenceplan.reloadMain, result.returnUrl);
                }
                function context(res) {
                    return template(templateStr, $.extend(res, {"isOutlookLogin": $("#isOutlookLogin").val() == "true"}));
                }
            }
        });
    },
    /**
     * 返回首页，如果是outlook就重新加载，如果是web直接返回
     * */
    returnMain: function () {
        if($("#isOutlookLogin").val()=='true'){
            location.href = getContextPath() + "/main";
        }else{
            $('.m-cp-main').hide();
            $('#c_plan_index').show();
            setTimeout(conferenceplan.adjustIndexCalendarWidth, 500);
            conferenceplan.clearData();
        }
    },
    cancelOperation:function(){
        alertConfirmationMsgDlgDetail($.i18n.prop("conferenceplan.js.common.title.notice"), $.i18n.prop("conferenceplan.js.cancle.operation.notice"),
		$.i18n.prop("conferenceplan.js.common.btn.confirm"), conferenceplan.returnMain);
    },
    reloadMain: function () {
        location.href = getContextPath() + "/main";
    },
    clearData: function () {
        $('#selectParticipantIds').val('');
        $('#selectParticipantMails').val('');
        $('#selectPresenterIds').val('');
        $('#selectPresenterMails').val('');
        $('#selectRoomIds').val('');
        $('#selectRoomNames').val('');
        $('#selectExternalParticipantIds').val('');

    },
    /**
     * 跳转到会议详情页
     * */
    switchDetailPage: function (clazz, pageDiv) {
        $('.' + clazz).hide();
        $('#' + pageDiv).show();
        conferenceDateTimePicker.queryDatepicker(pageDiv);
        conplancalendar.showCalendarWhenPageInit(pageDiv, 'timelineDay');
    },
    /**
     * 跳转到会议预约界面
     * */
    switchAddPage: function switchAddPage(clazz, divId) {
        conplan_recurrencepattern.canSaveRecurrencePattern = false;
        $.ajax({
            url: getContextPath() + "/conferenceRoom/search",
            type: "post",
            async: true,
            data: JSON.stringify({
                "pageNo": 1, "pageSize": Math.pow(2, 31) - 1, "orderByField": "namePinyin", "orderByType": 1
            }),
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                var isOutlookLogin="false";
                if($("#isOutlookLogin").val()=="true"){
                    isOutlookLogin="true";
                }
                var defaultNameKey = divId.indexOf("nc") != -1? "conferenceplan.js.conference.default.name.suffix.meeting" :
                    "conferenceplan.js.conference.default.name.suffix.video";
                divId.indexOf("nc") == -1
                ret = $.extend({
                    "isOutlookLogin":isOutlookLogin,
                    "timeZones": timezoneUtil.getWinTimezoneList(),
                    "localOffset": timezoneUtil.localTimeZoneOffset(),
                    "defaultName": $.i18n.prop(defaultNameKey, $("#loginStaffName").val()),
                    "loginStaffName": $("#loginStaffName").val(),
                    "loginStaffEmail": $("#loginStaffEmail").val(),
                    "creatorId": $('#loginStaffId').val()
                }, ret);
                var div = $('#' + divId);
                $(div).html(template(divId + '_temp', ret));
                $('.' + clazz).hide();
                if(isOutlookLogin=="false"){
                    CKEDITOR.replace('editor_'+divId, {
                        language: $("#browserLang").val().toLowerCase().replace("_", "-")
                    });
                }
                $(div).show();
                $('#add_recurrence_pattern').html(template("add_recurrence_pattern_temp"));
                conplancalendar.showCalendarWhenPageInit(divId, 'timelineDay');
                conferenceplan.defaultSelectedTimezone(div);
                conferenceDateTimePicker.queryDatepicker(divId);

                conferenceDateTimePicker.conferenceStartDatePick(div);
                conferenceDateTimePicker.conferenceStartDateTimePick(div);

                conferenceDateTimePicker.conferenceEndDatePick(div);
                conferenceDateTimePicker.conferenceEndDateTimePick(div);

                $(div).find('#conferenceRoomId').closest("div.m-conf-content-percent-89").attr("class", "m-conf-content-percent-60");
                $(div).find('#conferenceRoomId').chosen({
                    forceScroll40: true,
                    disable_search:true,
                    width: "100%"
                });
                if (divId == 'vc_plan_add') { // 视频会议默认把创建者加入主持人
                    $('#selectPresenterIds').val($('#loginStaffId').val());
                    $('#selectParticipantIds').val($('#loginStaffId').val());
                    $('#selectPresenterMails').val($('#loginStaffEmail').val());
                    $('#selectParticipantMails').val($('#loginStaffEmail').val());

                    conferenceplan.delayLoadParticipant(divId,"VC");
                    if($("#isOutlookLogin").val()=="true"){
                        $("#add_conference_rooms").on('shown.bs.modal', function () {
                            conplancalendar.showCalendarWithRoomsChecked('add_conference_rooms', 'timelineDay');
                        });
                    }
                }else{ // 普通会议默认天加到参会者
                    $('#selectParticipantIds').val($('#loginStaffId').val());
                    $('#selectParticipantMails').val($('#loginStaffEmail').val());
                    conferenceplan.delayLoadParticipant(divId,"NC");
                }
                $("#" + divId + " input[name='name']").one("focus", function () {
                    $(this).removeAttr("style");
                    $(this).val("");
                }).off("blur").on("blur", function () {
                    if (validateNull($(this).val())) {
                        validateutil.showErrorFmter($(this), $.i18n.prop("conferenceplan.js.tips.fill.name"));
                    }else {
                        validateutil.clearFormAllErrorMsg($(div));
                    }
                })
                conferenceplan.dateTimeChangeByTimeZone($(div).find(".form-horizontal[id^='m_'][id$='_add']"), 'add');
            }
        });
    },
    dateTimeChangeByTimeZone:function(div,type){
        var conferenceStartDate = $(div).find("input[name='conferenceDate']");
        var conferenceStartTime = $(div).find("input[name='conferenceStartTime']");
        var conferenceEndDate = $(div).find("input[name='conferenceEndDate']");
        var conferenceEndTime = $(div).find("input[name='conferenceEndTime']");
        $(div).find("#time_zone").on('change',function(){
            var utcOffsetPrevious = $(div).find("#time_zone").data('lastSelected');
            var utcOffset = $(div).find("#time_zone option:selected").attr("utcoffset");
            $(div).find("#time_zone").data('lastSelected',utcOffset); // 把修改完之后的值赋值到默认值当中
            var diffOffSet = utcOffset- utcOffsetPrevious;

            var previousStartDateTime = moment($(conferenceStartDate).val() + " " + $(conferenceStartTime).val()).valueOf();
            var previousEndDateTime = moment($(conferenceEndDate).val() + " " + $(conferenceEndTime).val()).valueOf();
            var currentStartDateTime = previousStartDateTime + (diffOffSet * 1000);
            var currentEndDateTime = previousEndDateTime + (diffOffSet * 1000);
            $(conferenceStartDate).val(moment(currentStartDateTime).format("YYYY-MM-DD"));
            $(conferenceStartTime).val(moment(currentStartDateTime).format("HH:mm:ss"));
            $(conferenceEndDate).val(moment(currentEndDateTime).format("YYYY-MM-DD"));
            $(conferenceEndTime).val(moment(currentEndDateTime).format("HH:mm:ss"));

            //var form = $("#" + type + "_recurrence_pattern #recurrence_pattern_form");
            //var recurrenceType = $(form).find("input[name='recurrenceType']:checked").val();
            //
            //if (recurrenceType != 'RECURS_ONCE') {
            //    conplan_recurrencepattern.saveRecurrencePattern(type, div.attr('id'));
            //}
        })
    },
    /**
     * 设置默认选中时区，默认选中优先顺序如下：
     * 1.设置在cookie中的选中值
     * 2.系统设置的时区
     * 3.与本地操作系统时区偏移量相同的第一个
     * @param div
     */
    defaultSelectedTimezone: function (div) {
        var recommendedTimezone = timezoneUtil.recommendedTimezone();
        var localTimeZoneOffset = timezoneUtil.localTimeZoneOffset();
        if(recommendedTimezone) {
            $(div).find("#time_zone").val(recommendedTimezone);
        } else {
            $(div).find("#time_zone option[utcoffset='" + localTimeZoneOffset +"']:first").attr("selected", true);
            if(localTimeZoneOffset == 8 * 3600) {
                $(div).find('#time_zone option[selected="selected"]').removeAttr("selected");
                $(div).find("#time_zone").val('China_Standard_Time');
            }
        }
        $(div).find('#time_zone').chosen({
            search_contains: true,
            width: "100%"
        });
        var selectedTimezoneOffset = $(div).find("#time_zone option:selected").attr("utcoffset");
        if(localTimeZoneOffset == Number(selectedTimezoneOffset)) {
            $(div).find('#time_zone_div').toggle();
        }
        $(div).find("#time_zone").data('lastSelected', selectedTimezoneOffset);
    },
    /**
     * 删除会议预约记录
     * */
    showDelete:function(conferencePlanId,conferenceRecordId,stayFuturePage){
        $.ajax({
            url: getContextPath() + "/conferencePlan/" + conferencePlanId,
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    if (result.rows.conferencePlan.recurrencePattern.recurrenceType != 'RECURS_ONCE') { // 如果不是单次会议，是周期会议，那么就有两个选项
                        $("#deleteConferenceRecord").off('click').on('click', function () {
                            conferencerecord.deleteConferenceRecord(conferenceRecordId,stayFuturePage,result);
                        });
                        $("#deleteConferencePlan").off('click').on('click', function () {
                            conferenceplan.deleteConferencePlan(conferencePlanId, stayFuturePage, result);
                        });
                        $('#deleteChooseModal').modal('show');
                    } else {
                        conferenceplan.deleteConferencePlan(conferencePlanId, stayFuturePage, result);
                    }
                } else {
                    alertPromptMsgDlg(result.message, 2, null, function () {
                        window.location.href = result.returnUrl;
                    });
                }
            }
        });
    },
    /**
     * 删除会议预约记录
     * */
    deleteConferencePlan: function (id,stayFuturePage,result) {
        $("#confirmModalBody").css("text-align", "left");
        var buttonTxt = $.i18n.prop("conferenceplan.js.common.btn.confirm");
        var title = $.i18n.prop("conferenceplan.js.common.title.notice");
        var message = $.i18n.prop("conferenceplan.js.message.confirm.cancle.conference");
        alertConfirmationMsgDlgDetail(title, message, buttonTxt, conferenceplan.deleteConferencePlanAjax, id, result.rows.conferencePlan.appointmentId, stayFuturePage);
    },
    /**
     * 删除会议预约记录2,发送请求部分
     * stayFuturePage 判断是否留在待开始的会议页面
     * */
    deleteConferencePlanAjax: function (id, appointmentId, stayFuturePage) {
        $.ajax({
            url: getContextPath() + "/conferencePlan/delete",
            type: "post",
            data: {
                conferencePlanId: id
            },
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    //outlook登录，post发送邮件信息
                    if($("#isOutlookLogin").val()!=null&&$("#isOutlookLogin").val()=="true") {
                        alertPromptMsgDlg(result.message, 1, conferenceplan.postDeleteOutlookNoParam(appointmentId,id));
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
    /**
     * 提交保存预约会议记录1
     * */
    save: function (formId, conferenceType) {
       var formDom =  $("#"+formId);
        validateutil.hideFormAllErrorMsg(formDom);
        var valid = true;
        var subject = $(formDom).find('input[name="name"]').attr("placeholder") || $(formDom).find('input[name="name"]').val();
        if (validateNull(subject)) {
            validateutil.showErrorFmter($(formDom).find('input[name="name"]'), $.i18n.prop("conferenceplan.js.tips.fill.name"));
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
        if (conferenceType == 'NC') {
            if (validateNull($(formDom).find('select[name="conferenceRoomId"]').val())) {
                validateutil.showErrorFmter($(formDom).find('select[name="conferenceRoomId"]'), $.i18n.prop("conferenceplan.js.tips.room.null"))
                valid = false;
            }
        }
        if(!valid)return;
        var params = conferenceplan.constructData(formId, 'add_recurrence_pattern', conferenceType);
        //outlook端登录没有此编辑框
        var emailRemark="";
        if($("#isOutlookLogin").val()=="true"){
            emailRemark="";
        }else {
            emailRemark=CKEDITOR.instances['editor_' + conferenceType.toLowerCase() + "_add"].getData();
        }
        params = $.extend({
            "recurrenceType": "RECURS_ONCE", // 如果params中有值就会把它覆盖掉
            "conferenceType": conferenceType,
            "creatorId": $('#loginStaffId').val(),
            "conferenceRoomIds": selectConferenceRoomIds,
            "emailRemark": emailRemark
        }, params, {
            "name": subject/*覆盖原来获取到的会议主题*/
        });
        params.location = selectConferenceRoomName;
        params.utcOffset = $("#" + formId +" #time_zone").find("option:selected").attr("utcOffset");
        SetCookie("lastTimezoneSelect", $("#" + formId +" #time_zone").val());
        showProgress($.i18n.prop("conferenceplan.js.book.submit.send.email"))
        setTimeout(function () {
            conferenceplan.ajaxSavePlan(params)
        }, 300)
    },
    /**
     * 提交保存预约会议记录2
     * */
    ajaxSavePlan:function(params){
        $.ajax({
            url: getContextPath() + "/conferencePlan/create",
            type: "post",
            async: false,
            data: params,
            dataType: "json",
            traditional: true,
            success: function (result) {
                hideProgressBar();
                if (result.ret == 1) {
                    //formutil.clearErrorMsg('m-sam-add');
                    //outlook登录，post发送邮件信息
                    if ($("#isOutlookLogin").val() != null && $("#isOutlookLogin").val() == "true") {
                        var username = $("#loginStaffName").val();
                        var conferencePlanObj = result.rows.conferencePlan;
                        params = $.extend({
                            "conferenceId": conferencePlanObj._id,
                            "type": "create",
                            "appointmentId": "",
                            "username":username,
                            "conferenceNumber":conferencePlanObj.conferenceNumber,
                            "pinCode":conferencePlanObj.pinCode,
                            "emailRemark":conferencePlanObj.emailRemark
                        }, params);
                        alertPromptMsgDlg($.i18n.prop("conferenceplan.js.book.success.mail.notice"), 1,
                            conferenceplan.postUpdateOutlookNoParam(params));
                    } else {
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
    postUpdateOutlookNoParam:function(params){
      return function (){
          //console.log(JSON.stringify(params));
          $("#params").val(JSON.stringify(params));
          $("#submitOutlookForm").submit();
          conferenceplan.reloadMain();
      }
    },
    postDeleteOutlookNoParam:function(appointmentId,id){
       return function (){
           var params={"type":"delete","appointmentId":appointmentId,"conferenceId":id};
           //console.log(JSON.stringify(params));
           $("#params").val(JSON.stringify(params));
           $("#submitOutlookForm").submit();
           conferenceplan.reloadMain();
       }
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
        showProgress($.i18n.prop("conferenceplan.js.book.submit.send.email"))
        setTimeout(function () {
            conferenceplan.ajaxEditPlan(params, appId)
        }, 300)
    },
    /**
     * 编辑会议2
     * */
    ajaxEditPlan:function(params,appId){
        $.ajax({
            url: getContextPath() + "/conferencePlan/edit",
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
                            "conferenceNumber":""
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
    /**
     * 点击显示、隐藏时区
     * */
    showTimeZone: function (pageId,e) {
        $("#" + pageId).find("#time_zone_div").toggle();
        if($("#" + pageId).find("#time_zone_div").is(':hidden')){
            $(e).text($.i18n.prop("conferenceplan.js.show.timezone"))
        }else{
            $(e).text($.i18n.prop("conferenceplan.js.hide.timezone"))
        }
    },
    /**
     * 正在进行的会议倒计时显示时间
     * */
    showCountDown:function(){
        $('#conf_living').find('.start_time').each(function(){
            var _this = this;
            var startTime = $(_this).data('start-time');
            if(!startTime)return;
            countDownJobId = setInterval(function () {
                var t = moment().diff(moment(startTime));
                var h=0;
                var m=0;
                var s=0;

                if(t>=0){
                    h=t/1000/60/60;
                    m=t/1000/60%60;
                    s=t/1000%60;
                }
                $(_this).text(zeroPreFill(parseInt(h), 2) + ":"
                    + zeroPreFill(parseInt(m), 2)+":"
                    + zeroPreFill(parseInt(s), 2));
            }, 1000)
        })
    },
    /**
     * 填充表头滚动条宽度
     * @param tableHeader
     * @param tableBody
     */
    compensateScroll: function(tableHeader, tableBody) {
        if(!$(tableBody)[0]) {
            return;
        }
        var scrollerWidth = $(tableBody)[0].offsetWidth
            - $(tableBody)[0].scrollWidth;
        $(tableHeader).css("padding-right", scrollerWidth);
    },

    /**
     *  创建‘正在进行的会议’页面的周期任务
     */
    createIntervalJob: function() {
        if(intervalJobId || $(".conf-selected").attr("redirect") != "conf_living") {
            return
        }

        $(".td-div-operation>a.no-underline").on("click", function() {
            conferenceplan.clearIntervalJob();
        });
        intervalJobId = setInterval(function() {
            $("button[redirect='conf_living']").click();
        }, 1000 * 30);

        intercept(accountmanage, "readyChangeMailConferencePage", conferenceplan.clearIntervalJob);
        intercept(accountmanage, "readyChangePwdConferencePage", conferenceplan.clearIntervalJob);
        intercept(conplancalendar, "showMyConferenceCalendar", conferenceplan.clearIntervalJob);
        intercept(conferenceplan, "searchConference", conferenceplan.clearIntervalJob);
        intercept(conferenceplan, "switchAddPage", conferenceplan.clearIntervalJob);
    },
    /**
     * 清除‘正在进行的会议’页面的周期任务
     */
    clearIntervalJob: function() {
        if(!intervalJobId) {
            return;
        }
        clearInterval(intervalJobId);
        intervalJobId = null;
    },
    toggleSource: function(formId, iObject) {
        var sourcePanelObj = $("#" + formId + " div[name='confSourcePanel']");
        var isVisible = sourcePanelObj.is(":visible");
        if(isVisible) {
            $(iObject).children().attr("class", "glyphicon glyphicon-chevron-down");
            sourcePanelObj.hide();
        } else {
            $('#' + formId + ' .calendar').fullCalendar('option', 'scrollTime', '08:00:00');
            sourcePanelObj.show();
            $('#' + formId + ' .calendar').fullCalendar('render');
            $(iObject).children().attr("class", "glyphicon glyphicon-chevron-up");
        }
    }

}
/**
 * 日期控件相关的统一处理对象
 * */
var conferenceDateTimePicker = {
    /**
     * 预约会议的时候的会议开始日期,默认当前日期
     * */
    conferenceStartDatePick: function (div) {
        var offset = $(div).find("select[name=timeZoneName] option:selected").attr("utcoffset") / 60;
        var startDateDom = $(div).find('input[name="conferenceDate"]');
        var defaultValue = (!startDateDom.val())? moment(new Date()).utcOffset(offset).format('YYYY-MM-DD') : startDateDom.val();
        $(startDateDom).datetimepicker({
            value: defaultValue,
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            scrollInput: false,
            onSelectDate: function (date, $input) {
                $input.blur();
                conferenceDateTimePicker.startDateTimeChange(date,$input,div,'date');
            }
        });
    },
    /**
     * 预约会议的时候的会议开始日期
     * */
    conferenceEndDatePick: function (div) {
        var startDate = $(div).find('input[name="conferenceDate"]').val();
        var startTime = $(div).find('input[name="conferenceStartTime"]').val();
        var startDateTime = startDate + " " + startTime;
        var endDateDom = $(div).find('input[name="conferenceEndDate"]');
        var defaultValue = (!endDateDom.val())? moment(startDateTime).add(30, "m").format('YYYY-MM-DD') : endDateDom.val();
        $(endDateDom).datetimepicker({
            value: defaultValue,
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            scrollInput: false,
            onSelectDate: function (date, $input) {
                $input.blur();
                conferenceDateTimePicker.endDateTimeChange(date,$input,div,'date');
            }
        });
    },
    eqCurrentDate:function(date){
        return moment(date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD');
    },
    /**
     * 预约会议的时候设置周期里面的会议开始日期
     * */
    conferencePatternStartDatePick: function (pageFormid,modal) {
        var pageForm = $("#" + pageFormid);
        var patternStartDateDom = $(modal).find('input[name="patternConferenceStartDate"]');

        var startDateDom = $(pageForm).find('input[name="conferenceDate"]');
        var endDateDom = $(pageForm).find('input[name="conferenceEndDate"]');
        var startTimeDom = $(pageForm).find('input[name="conferenceStartTime"]');
        var endTimeDom = $(pageForm).find('input[name="conferenceEndTime"]');
        var startDateTimeMills = moment(startDateDom.val()+" "+$(startTimeDom).val()).valueOf()
        var endDateTimeMills = moment(endDateDom.val()+" "+$(endTimeDom).val()).valueOf()

        $(modal).find('#duration').text(conferenceDateTimePicker.calDuration(endDateTimeMills,startDateTimeMills));

        var defaultValue =  startDateDom.val();
        $(patternStartDateDom).datetimepicker({
            value: defaultValue,
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            scrollInput: false,
            onSelectDate: function (date, $input) {
                $input.blur();
                conferenceDateTimePicker.patternStartDateTimeChange(date,$input,$("#" + pageFormid),$(modal),'date');
                $(modal).find('#duration').text(conferenceDateTimePicker.calDurationText(modal));
            }
        });
    },

    /**
     * 预约会议的时候的设置周期里面的会议结束日期
     * */
    conferencePatternEndDatePick: function (pageFormid,modal) {
        var pageForm = $("#" + pageFormid);
        var patternEndDateDom = $(modal).find('input[name="patternConferenceEndDate"]');
        var endDom = $(pageForm).find('input[name="conferenceEndDate"]');
        var defaultValue = endDom.val();
        $(patternEndDateDom).datetimepicker({
            value: defaultValue,
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            scrollInput: false,
            onSelectDate: function (date, $input) {
                $input.blur();
                conferenceDateTimePicker.patternEndDateTimeChange(date,$input,$("#" + pageFormid),$(modal),'date');
                $(modal).find('#duration').text(conferenceDateTimePicker.calDurationText(modal));
            }
        });
    },
    /**
     * 预约会议的时候的会议开始时间
     * */
    conferenceStartDateTimePick: function (div) {
        var offset = $(div).find("select[name=timeZoneName] option:selected").attr("utcoffset") / 60;
        var nowTimeStart = dateutil.round(moment().add(conferenceplan.leadTime, 'm').valueOf(), moment.duration(30, "minutes"), "ceil");
        var startTimeDom = $(div).find('input[name="conferenceStartTime"]');
        var defaultValue = (!startTimeDom.val())? moment(nowTimeStart).utcOffset(offset).format('HH:mm:ss') : startTimeDom.val();
        $(startTimeDom).datetimepicker({
            value: defaultValue,
            datepicker: false,
            format: 'H:i:00',
            step: 30,
            onSelectTime: function(time, $input) {
                $input.blur();
                conferenceDateTimePicker.startDateTimeChange(time,$input,div,'time');
            }
        });
    },
    /**
     * 预约会议的时候的会议结束时间
     * */
    conferenceEndDateTimePick: function (div) {
        var startDate = $(div).find('input[name="conferenceDate"]').val();
        var startTime = $(div).find('input[name="conferenceStartTime"]').val();
        var startDateTime = startDate + " " + startTime;
        
        var endTimeDom = $(div).find('input[name="conferenceEndTime"]');
        var defaultValue = (!endTimeDom.val())? moment(startDateTime).add(30, "m").format('HH:mm:ss') : endTimeDom.val();
        $(endTimeDom).datetimepicker({
            value: defaultValue,
            datepicker: false,
            step: 30,
            format: 'H:i:00',
            onSelectTime: function(time, $input) {
                $input.blur();
                conferenceDateTimePicker.endDateTimeChange(time,$input,div,'time');
            }
        });
    },
    /**
     * 周期设置上的开始时间
     * **/
    patternStartTime:function(pageFormid,modal){
        var nowTimeStart = dateutil.round(new Date(), moment.duration(30, "minutes"), "ceil");
        var startDom = $("#" + pageFormid).find('input[name="conferenceStartTime"]');
        var defaultValue = (!startDom.val())? nowTimeStart.format('HH:mm:ss') : startDom.val();
        $(modal).find('#pattern_start_time').datetimepicker({
            value: defaultValue,
            datepicker: false,
            format: 'H:i:00',
            step: 30,
            onSelectTime: function(time, $input) {
                $input.blur();
                conferenceDateTimePicker.patternStartDateTimeChange(time,$input,$("#" + pageFormid),$(modal),'time');
                $(modal).find('#duration').text(conferenceDateTimePicker.calDurationText(modal));
            }
        });

    },
    /**
     * 周期设置上的结束时间
     * **/
    patternEndTime:function(pageFormid,modal){
        var nowTimeStart = dateutil.round(new Date(), moment.duration(30, "minutes"), "ceil");
        var nowTimeEnd = moment(nowTimeStart).add(30, 'minutes').format('HH:mm:ss');
        var endDom = $("#" + pageFormid).find('input[name="conferenceEndTime"]');
        var defaultValue = (!endDom.val())? nowTimeEnd : endDom.val();
        $(modal).find('#pattern_end_time').datetimepicker({
            value: defaultValue,
            datepicker: false,
            format: 'H:i:00',
            step: 30,
            onSelectTime: function(time, $input) {
                $input.blur();
                conferenceDateTimePicker.patternEndDateTimeChange(time,$input,$("#" + pageFormid),$(modal),'time');
                $(modal).find('#duration').text(conferenceDateTimePicker.calDurationText(modal));
            }
        });
    },
    calDurationText: function (modal) {
        var patternStartDateDom = $(modal).find('input[name="patternConferenceStartDate"]');
        var patternEndDateDom = $(modal).find('input[name="patternConferenceEndDate"]');
        var patternStartTime = $(modal).find('input[name="patternStartTime"]');
        var patternEndTime = $(modal).find('input[name="patternEndTime"]');
        var startDateTimeMills = moment(patternStartDateDom.val() + " " + $(patternStartTime).val()).valueOf()
        var endDateTimeMills = moment(patternEndDateDom.val() + " " + $(patternEndTime).val()).valueOf();
        return conferenceDateTimePicker.calDuration(endDateTimeMills, startDateTimeMills);
    },
    calDuration:function(endDateTimeMills,startDateTimeMills){
        var t = moment(endDateTimeMills).diff(moment(startDateTimeMills));
        var h=0;
        var m=0;
        if(t>=0){
            h=Math.floor(t/1000/60/60);
            m=Math.floor(t/1000/60%60);
        }
        return (h * 60 + m) / 60 + $.i18n.prop("conferenceplan.js.label.hours");
    },
    startDateTimeChange:function(date,input,div,type){
        var startDateDom = $(div).find('input[name="conferenceDate"]');
        var endDateDom = $(div).find('input[name="conferenceEndDate"]');
        var startTimeDom = $(div).find('input[name="conferenceStartTime"]');
        var endTimeDom = $(div).find('input[name="conferenceEndTime"]');
        var startDateTime;
        if(type=='date'){
            var startText = moment(date).format('YYYY-MM-DD');
            startDateTime = moment(startText+" "+$(startTimeDom).val()).valueOf();
        }else{
            var startTimeText = moment(date).format('HH:mm:ss');
            startDateTime = moment($(startDateDom).val()+" "+startTimeText).valueOf();
        }
        var endDateTime = moment(endDateDom.val()+" "+$(endTimeDom).val()).valueOf();
        var adjustEnd = (endDateTime > startDateTime)? endDateTime : moment(startDateTime).add(30, 'minutes').valueOf();
        endDateDom.val(moment(adjustEnd).format('YYYY-MM-DD'));
        endTimeDom.val(moment(adjustEnd).format('HH:mm:ss'))
    },
    endDateTimeChange:function(date,input,div,type){
        var startDateDom = $(div).find('input[name="conferenceDate"]');
        var endDateDom = $(div).find('input[name="conferenceEndDate"]');
        var startTimeDom = $(div).find('input[name="conferenceStartTime"]');
        var endTimeDom = $(div).find('input[name="conferenceEndTime"]');
        var endDateTime;
        if(type=='date'){
            var endText = moment(date).format('YYYY-MM-DD');
            endDateTime = moment(endText+" "+$(endTimeDom).val()).valueOf();
        }else{
            var endTimeText = moment(date).format('HH:mm:ss');
            endDateTime = moment($(endDateDom).val()+" "+endTimeText).valueOf();
        }
        var startDateTime = moment(startDateDom.val()+" "+$(startTimeDom).val()).valueOf();
        var adjustStart = (endDateTime > startDateTime)? startDateTime : moment(endDateTime).add(-30, 'minutes').valueOf();

        if(moment(endDateTime).format('YYYY-MM-DD HH:mm:ss') ==moment().format('YYYY-MM-DD')+" 00:00:00"){ // 如果结束时间等于今天的0时
            endTimeDom.val('00:30:00');
            startDateDom.val(moment().format('YYYY-MM-DD'));
            startTimeDom.val(moment().format('00:00:00'));
        }else{
            startDateDom.val(moment(adjustStart).format('YYYY-MM-DD'));
            startTimeDom.val(moment(adjustStart).format('HH:mm:ss'))
        }
    },
    patternStartDateTimeChange:function(date,input,div,modal,type){
        var startDateDom = $(modal).find('input[name="patternConferenceStartDate"]');
        var endDateDom = $(modal).find('input[name="patternConferenceEndDate"]');
        var startTimeDom = $(modal).find('input[name="patternStartTime"]');
        var endTimeDom = $(modal).find('input[name="patternEndTime"]');

        var startDateTime;
        if(type=='date'){
            var startText = moment(date).format('YYYY-MM-DD');
            startDateTime = moment(startText+" "+$(startTimeDom).val()).valueOf();
        }else{
            var startTimeText = moment(date).format('HH:mm:ss');
            startDateTime = moment($(startDateDom).val()+" "+startTimeText).valueOf();
        }
        var endDateTime = moment(endDateDom.val()+" "+$(endTimeDom).val()).valueOf();
        var adjustEnd = (endDateTime > startDateTime)? endDateTime : moment(startDateTime).add(30, 'minutes').valueOf();
        endDateDom.val(moment(adjustEnd).format('YYYY-MM-DD'));
        endTimeDom.val(moment(adjustEnd).format('HH:mm:ss'));

        var conferenceStartTimeDom = $(div).find('input[name="conferenceStartTime"]');
        var conferenceEndTimeDom = $(div).find('input[name="conferenceEndTime"]');
        var conferenceStartDateDom = $(div).find('input[name="conferenceDate"]');
        var conferenceEndDateDom = $(div).find('input[name="conferenceEndDate"]');
        conferenceStartTimeDom.val(startTimeDom.val());
        conferenceEndTimeDom.val(endTimeDom.val());
        conferenceStartDateDom.val(startDateDom.val());
        conferenceEndDateDom.val(endDateDom.val());
    },
    patternEndDateTimeChange:function(date,input,div,modal,type){
        var startDateDom = $(modal).find('input[name="patternConferenceStartDate"]');
        var endDateDom = $(modal).find('input[name="patternConferenceEndDate"]');
        var startTimeDom = $(modal).find('input[name="patternStartTime"]');
        var endTimeDom = $(modal).find('input[name="patternEndTime"]');

        var endDateTime;
        if(type=='date'){
            var endText = moment(date).format('YYYY-MM-DD');
            endDateTime = moment(endText+" "+$(endTimeDom).val()).valueOf();
        }else{
            var endTimeText = moment(date).format('HH:mm:ss');
            endDateTime = moment($(endDateDom).val()+" "+endTimeText).valueOf();
        }
        var startDateTime = moment(startDateDom.val()+" "+$(startTimeDom).val()).valueOf();
        var adjustStart = (endDateTime > startDateTime)? startDateTime : moment(endDateTime).add(-30, 'minutes').valueOf();
        if(moment(endDateTime).format('YYYY-MM-DD HH:mm:ss') ==moment().format('YYYY-MM-DD')+" 00:00:00"){ // 如果结束时间等于今天的0时
            endTimeDom.val('00:30:00');
            startDateDom.val(moment().format('YYYY-MM-DD'));
            startTimeDom.val(moment().format('00:00:00'));
        }else{
            startDateDom.val(moment(adjustStart).format('YYYY-MM-DD'));
            startTimeDom.val(moment(adjustStart).format('HH:mm:ss'));
        }
        var conferenceStartTimeDom = $(div).find('input[name="conferenceStartTime"]');
        var conferenceEndTimeDom = $(div).find('input[name="conferenceEndTime"]');
        var conferenceStartDateDom = $(div).find('input[name="conferenceDate"]');
        var conferenceEndDateDom = $(div).find('input[name="conferenceEndDate"]');
        conferenceStartTimeDom.val(startTimeDom.val());
        conferenceEndTimeDom.val(endTimeDom.val());
        conferenceStartDateDom.val(startDateDom.val());
        conferenceEndDateDom.val(endDateDom.val());
    },
    /**
     * 会议首页左边的日期控件
     * */
    queryDatepickerMainPage: function () {
        var checkRole = $("#check_role");
        var checkConfType = $("#check_conf_type");
        $("#c_plan_index input[name='queryDate']").datetimepicker({
            lang: 'ch',
            format: 'Y-m-d',
            minDate: moment().add(-1, 'years').format('YYYY/MM/DD'),
            maxDate: moment().add(1, 'years').format('YYYY/MM/DD'),
            inline:true,
            timepicker: false,
            onSelectDate: function (date) {
                $.ajax({
                    url: getContextPath() + "/conference/query",
                    type: "post",
                    async: false,
                    data: JSON.stringify({
                        "queryDate": moment(date).valueOf(),
                        "confType": $(checkConfType).prop('checked') ? $(checkConfType).val() : null,
                        "role": $(checkRole).prop('checked') ? $(checkRole).val() : null,
                        "pageNo": 1, "pageSize": Math.pow(2, 31) - 1
                    }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        if (result.ret == 1) {
                            var calendar = $("#c_plan_index .calendar");
                            $(calendar).fullCalendar('destroy');
                            SetCookie("lastChooseDate",moment(date).format("YYYY-MM-DD HH:mm:ss"));
                            conplancalendar.createConfPlanCalendarNoRooms(calendar, date, result, 'agendaWeek', 550);
                        } else {
                            alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                        }
                    }
                });
                // call ajax to fetch conference
            }
        });
    },
    /**
     * 会议室资源右边点击日期查看会议室资源
     * */
    queryDatepicker: function (div) {
        $("#" + div).find("input[name='queryDate']").datetimepicker({
            value: moment(new Date()).format('YYYY-MM-DD'),
            minDate: '-1970/01/01',
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            scrollInput: false,
            onSelectDate: function (date, $input) {
                $input.blur();
                //$("#" + div + " input[name='conferenceDate']").datetimepicker({value: moment(date).format('YYYY-MM-DD')});
                $.ajax({
                    url: getContextPath() + "/conferencePlan/rooms?queryDate=" + moment(date).valueOf(),
                    type: "get",
                    async: false,
                    dataType: "json",
                    traditional: true,
                    success: function (result) {
                        if (result.ret == 1) {
                            var calendar = $('#' + div + ' .calendar');
                            $(calendar).fullCalendar('destroy');
                            conplancalendar.createConfPlanCalendarWithRooms(calendar, date, result, 'timelineDay', moment().utcOffset(), function (resourceObj, labelTds, bodyTds) {
                                $(labelTds).find('.fc-cell-content').parent().addClass('fc-cell-content-father');
                                var curHtml = $(labelTds).html();
                                $(labelTds).html(template("show_room_temp", {"type": resourceObj['type']}) + curHtml);
                                $('.fc-head .fc-resource-area').css('width','15%')
                            });
                        } else {
                            alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                        }
                    }
                });
                // call ajax to fetch conference
            }
        });
    },
    /**
     * 添加会议室弹框日期查询，日历渲染
     * */
    queryDatepickerAddRooms: function (div) {
        $("#" + div + " input[name='queryDate']").datetimepicker({
            lang: 'ch',
            format: 'Y-m-d',
            timepicker: false,
            onSelectDate: function (date) {
                var formId = $("#add_conference_rooms").attr("sourceForm");
                var selectedUtcOffset = Number($("#" + formId + " #time_zone option:selected").attr("utcoffset")) / 60;
                var offset = moment().utcOffset() - Number(selectedUtcOffset);
                var queryDate = moment(date).valueOf() + offset * 1000 * 60;
                $.ajax({
                    url: getContextPath() + "/conferencePlan/rooms?queryDate=" + queryDate,
                    type: "get",
                    async: false,
                    dataType: "json",
                    traditional: true,
                    success: function (result) {
                        if (result.ret == 1) {
                            var calendar = $('#' + div + ' .calendar');
                            $(calendar).fullCalendar('destroy');
                            conplancalendar.createConfPlanCalendarWithRooms(calendar, date, result, 'timelineDay', selectedUtcOffset, function (resourceObj, labelTds, bodyTds) {
                                var selectRoomIdsObj = $('#selectRoomIds');
                                var checked = false;
                                if ($(selectRoomIdsObj).val()) {
                                    checked = $(selectRoomIdsObj).val().indexOf(resourceObj['id']) > -1;
                                }
                                $(labelTds).find('.fc-cell-content').parent().addClass('fc-cell-content-father');
                                var curHtml = $(labelTds).html();
                                $(labelTds).html(template("check_room_temp", {"id": resourceObj['id'],"type": resourceObj['type'],"title": resourceObj['title'],"checked": checked}) + curHtml);
                            });
                        } else {
                            alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                        }
                    }
                });
                // call ajax to fetch conference
            }
        });
    }
}
/**
 * 日历控件统一处理对象
 * */
var conplancalendar = {
    /**
     * 首页日历头部，左右箭头查询
     * */
    queryOneWeek: function (calendar, firstDate) {
        var checkRole = $("#check_role");
        var checkConfType = $("#check_conf_type");
        $.ajax({
            url: getContextPath() + "/conference/query",
            type: "post",
            async: false,
            data: JSON.stringify({"queryDate": moment(firstDate).valueOf(),
                "confType": $(checkConfType).prop('checked') ? $(checkConfType).val() : null,
                "role": $(checkRole).prop('checked') ? $(checkRole).val() : null,
                "pageNo": 1, "pageSize": Math.pow(2, 31) - 1
            }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.ret == 1) {
                    $(calendar).fullCalendar('destroy');
                    conplancalendar.createConfPlanCalendarNoRooms(calendar, firstDate, result, 'agendaWeek', 550);
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 创建日历视图，不包含会议室的类型
     * */
    createConfPlanCalendarNoRooms: function (calendar, date, result, defaultView, height) {
        $("#c_plan_index input[name='queryDate']").datetimepicker({
            value: moment(date).format('YYYY-MM-DD'),
            scrollMonth: false
        });
        $(calendar).fullCalendar({
            firstHour: 8,
            firstDay: 0,
            timeFormat: 'H(:mm)',
            slotLabelFormat: "HH:mm",
            now: moment(date).format(),
            aspectRatio: 1.8,
            noMeridiemTimeFormat: true,
            noChunks : true,
            scrollTime: '08:00:00',
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            defaultView: defaultView,
            resourceLabelText: $.i18n.prop("conferenceplan.js.label.room"),
            contentHeight: height,
            allDaySlot: false,
            locale: $('#browserLang').val()=='zh_CN'?'zh-cn':'en',
            slotEventOverlap: false,
            header: {
                left: 'prev,next,title',
                center: '',
                right: ''
            },
            slotEventOverlap:false,
            columnFormat: $('#browserLang').val()=='zh_CN'?'dddd\nMMMD日':'dddd\nMMM D',
            // Sam：样式，需要改locale-all.js和fullcalendar.js，重新适配,
            resources: result.rows == null || result.rows.rooms == null ? [] : result.rows.rooms, // the roms is fake ,to make sure event can link to resource
            events: result.rows == null || result.rows.conferences == null ? [] : result.rows.conferences,
            eventDataTransform: function (event) {
                event.start = moment(Number(event.start)).format();
                event.end = moment(Number(event.end)).format();
                return event;
            },
            eventRender: function (event, element) {
                element.find(".fc-time").remove();
                if(event.state == 1) {
                    element.addClass("calendar-event-live");
                }else {
                    element.addClass("calendar-event-normal");
                }
                var data = {state: event.state, type: event.confType, elementHtml: element.html()};
                template.config("escape", false);
                element.html(template("show_event_temp", data));
                template.config("escape", true);
            },
            eventClick: function (calEvent, jsEvent, view) {
                if(calEvent.state ===2 || calEvent.state ===1) {
                    conferenceplan.showConferenceEndLivingRecordDetail(calEvent._id);
                }else {
                    conferenceplan.showConferenceReadyRecordDetail(calEvent._id,calEvent.conferencePlanId);
                }
            },
            eventDblclick: function (calEvent, jsEvent, view) {
                return false;
            },
            eventMouseover: function (calEvent, jsEvent, view) {
                // this 就是 event对应的日历上的div元素
                //alert($(this).html());
                var _this = this;
                var conferenceRecordId = calEvent['id'];
                conferenceplan.showConferencePopupOperate(_this, conferenceRecordId)
                return false;
            },
            eventMouseout: function (calEvent, jsEvent, view) {
                return false;
            }
        });
        $(calendar).find('.fc-prev-button,.fc-next-button').bind('click', function() {
            var view = $(calendar).fullCalendar('getView');
            conplancalendar.queryOneWeek(calendar, view.intervalStart.format())
        });
        var nowTimeAdjust = dateutil.round(new Date(), moment.duration(30, "minutes"), "floor");
        var nowFormat = moment(nowTimeAdjust).format('HH:mm:00');
        $("#c_plan_index tr[data-time='" + nowFormat + "']").addClass("calendar-highlight");
        var nowTimeAdjust = dateutil.round(new Date(), moment.duration(30, "minutes"), "floor");
        var nowFormat = moment(nowTimeAdjust).format('HH:mm:00');
        $("#c_plan_index tr[data-time='" + nowFormat + "']").find("td:first").addClass("calendar-highlight");
    },
    /**
     * 首页显示我的全部会议，日历视图
     * */
    showMyConferenceCalendar: function showMyConferenceCalendar(div, defaultView, height, data) {
        var now = new Date();
        var lastDate = GetCookie("lastChooseDate");
        if(lastDate && moment(lastDate).isValid()){
            $('#' + div + ' input[name="queryDate"]').val(moment(lastDate).format("YYYY-MM-DD"));
            $('#' + div + ' input[name="queryDate"]').datetimepicker({value: moment(lastDate).format("YYYY-MM-DD")});
            now=lastDate;
            data.queryDate = moment(lastDate).valueOf();
        }else{
            $('#' + div + ' input[name="queryDate"]').val(moment(now).format('YYYY-MM-DD'));
        }
        $.ajax({
            url: getContextPath() + "/conference/query",
            type: "post",
            async: false,
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.ret == 1) {
                    var calendar = $('#' + div + ' .calendar');
                    $(calendar).fullCalendar('destroy');
                    conplancalendar.createConfPlanCalendarNoRooms(calendar, now, result, defaultView, height);
                    setTimeout(function(){
                        conferenceplan.adjustIndexCalendarWidth();
                    },300);
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 增加，编辑，详情，页面初始化，渲染会议室资源
     * */
    showCalendarWhenPageInit: function (div, defaultView) {
        $.ajax({
            url: getContextPath() + "/conferencePlan/rooms?queryDate=" + moment(0, "HH").valueOf(),
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var calendar = $('#' + div + ' .calendar');
                    $(calendar).fullCalendar('destroy');
                    conplancalendar.createConfPlanCalendarWithRooms(calendar, new Date(), result, defaultView, moment().utcOffset(), function (resourceObj, labelTds, bodyTds) {
                        $(labelTds).find('.fc-cell-content').parent().addClass('fc-cell-content-father');
                        var curHtml = $(labelTds).html();
                        $(labelTds).html(template("show_room_temp", {"type": resourceObj['type']}) + curHtml);
                        $('.fc-head .fc-resource-area').css('width','15%')
                    });
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 添加会议室默认选中之前已经添加的会议室
     * */
    showCalendarWithRoomsChecked: function (div, defaultView) {
        var formId = $("#add_conference_rooms").attr("sourceForm");
        var selectedDate = $("#" + formId + " input[name='conferenceDate']").val();
        var selectedUtcOffset = Number($("#" + formId + " #time_zone option:selected").attr("utcoffset")) / 60;
        var offset = moment().utcOffset() - Number(selectedUtcOffset);
        var queryDate = moment(selectedDate).valueOf() + offset * 1000 * 60;
        $.ajax({
            url: getContextPath() + "/conferencePlan/rooms?queryDate=" + queryDate,
            type: "get",
            async: false,
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    var calendar = $('#' + div + ' .calendar');
                    $(calendar).fullCalendar('destroy');
                    conplancalendar.createConfPlanCalendarWithRooms(calendar, selectedDate, result, defaultView, selectedUtcOffset, function (resourceObj, labelTds, bodyTds) {
                        var selectRoomIdsObj = $('#selectRoomIds');
                        var checked = false;
                        if ($(selectRoomIdsObj).val()) {
                            checked = $(selectRoomIdsObj).val().indexOf(resourceObj['id']) > -1;
                        }
                        $(labelTds).find('.fc-cell-content').parent().addClass('fc-cell-content-father');
                        var curHtml = $(labelTds).html();
                        $(labelTds).html(template("check_room_temp", {"id": resourceObj['id'],"type": resourceObj['type'],"title": resourceObj['title'],"checked": checked}) + curHtml);
                    });
                    $('#' + div + ' input[name="queryDate"]').val(moment(selectedDate).format('YYYY-MM-DD'));
                    conferenceDateTimePicker.queryDatepickerAddRooms("add_conference_rooms");
                } else {
                    alertPromptMsgDlg(result.message, 2, null, result.returnUrl);
                }
            }
        });
    },
    /**
     * 包括会议室的日历渲染公用方法。使用的地方包括：会议室资源，添加会议室
     * */
    createConfPlanCalendarWithRooms: function (calendar, date, result, defaultView, utcOffset, resourceRender) {
        if(!utcOffset) {
            utcOffset = moment().utcOffset();
        }
        $(calendar).fullCalendar({
            firstHour: 8,
            timeFormat: 'HH(:mm)',
            slotLabelFormat: "H",
            now: moment(date).format('YYYY-MM-DD'),
            aspectRatio: 1.8,
            noMeridiemTimeFormat: true,
            scrollTime: '08:00:00', // undo default 6am scrollTime
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            defaultView: defaultView,
            resourceLabelText: $.i18n.prop("conferenceplan.js.label.room"),
            contentHeight: (result.rows.rooms.length * 32 + 32) > 250 ? 250 : "auto",
            header: false,
            allDaySlot: false,
            locale: $('#browserLang').val()=='zh_CN'?'zh-cn':'en',
            eventBackgroundColor: "#84c9ea",
            eventBorderColor: "#fff",
            resources: result.rows.rooms == null ? [] : result.rows.rooms,
            events: result.rows.conferences == null ? [] : result.rows.conferences,
            eventClick: function (calEvent, jsEvent, view) {
                return false;
            },
            eventDataTransform: function (event) {
                event.start = moment(Number(event.start)).utcOffset(utcOffset).format();
                event.end = moment(Number(event.end)).utcOffset(utcOffset).format();
                return event;
            },
            eventMouseover: function (calEvent, jsEvent, view) {
                // this 就是 event对应的日历上的div元素
                //alert($(this).html());
                var _this = this;
                var conferencePlanId = calEvent['id'];
                conferenceplan.showConferencePopupSummary(_this, conferencePlanId)
                return false;
            },
            eventMouseout: function (calEvent, jsEvent, view) {
                return false;
            },
            resourceRender: resourceRender
        });
    }
}
/**
 * 会议周期统一处理对象
 * */
var conplan_recurrencepattern = {
    canSaveRecurrencePattern: false,
    isClearRecurrencePattern: false,
    saveRecurrencePattern: function (type, pageFormId) {
        var form = $("#" + type + "_recurrence_pattern #recurrence_pattern_form");
        var recurrenceType = $(form).find("input[name='recurrenceType']:checked").val();
        var monthRecurrenceType = $(form).find("input[name='monthRecurrenceType']:checked").val();
        var yearRecurrenceType = $(form).find("input[name='yearRecurrenceType']:checked").val();
        var actualRecurrenceType;
        if (recurrenceType == 'RECURS_DAILY') {
            var dailyType = $(form).find('input[name="dailyType"]:checked').val();
            actualRecurrenceType = recurrenceType + "_" + dailyType;
        } else if (recurrenceType == 'RECURS_WEEKLY') {
            actualRecurrenceType = recurrenceType;
        } else if (recurrenceType == 'RECURS_MONTH') {
            actualRecurrenceType = monthRecurrenceType;
        } else if (recurrenceType == 'RECURS_YEAR') {
            actualRecurrenceType = yearRecurrenceType;
        }
        var params = conferenceplan.constructData(pageFormId, type + "_recurrence_pattern", null);
        //validate
        var isValid = true;
        var errorMessage =$.i18n.prop("conferenceplan.js.invalid.recurrence");
        var warningMsg="";

        var startDateTimeMills = moment(params['conferenceDate']+" "+params['conferenceStartTime']).valueOf()
        var endDateTimeMills = moment(params['conferenceEndDate']+" "+params['conferenceEndTime']).valueOf()

        var duration = moment(endDateTimeMills).diff(moment(startDateTimeMills));

        if(actualRecurrenceType=='RECURS_DAILY_1'){
            if(!valvalidate.method.require(params['interval']) || !valvalidate.method.gt(params['interval'],0)){
                isValid = false;
            }else if (duration > params['interval'] * ONE_DAY_MILLS) {
                isValid = false;
                errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");
            }
        } else if (actualRecurrenceType == 'RECURS_DAILY_-1' && duration > ONE_DAY_MILLS) {
            isValid = false;
            errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");;
        }else if(actualRecurrenceType=='RECURS_WEEKLY'){
            if(!valvalidate.method.require(params['interval']) || !valvalidate.method.gt(params['interval'],0) || params['daysOfWeeks'].length == 0){
                isValid = false;
            }else{
                var dayOfWeekArray =[];
                for(var i =0;i<params['daysOfWeeks'].length;i++){
                    dayOfWeekArray.push(indexOfDayWeek[params['daysOfWeeks'][i]]);
                }
                var minInterval = 7;
                if (dayOfWeekArray.length >= 2) {
                    for (var j = 0; j < dayOfWeekArray.length; j++) {
                        // 如果两个间隔大于等于4，例如星期一和星期五，实际上他们之间的间隔最小是 3，应该= -1*4+7=3
                        var diff = Math.abs(dayOfWeekArray[j] - dayOfWeekArray[j + 1]) >= 4 ? (-1 * Math.abs(dayOfWeekArray[j] - dayOfWeekArray[j + 1]) + 7) : Math.abs(dayOfWeekArray[j] - dayOfWeekArray[j + 1]);
                        minInterval = diff < minInterval ? diff : minInterval;
                    }
                }
                if (duration > minInterval * ONE_DAY_MILLS) {
                    isValid = false;
                    errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");
                }
            }
        }else if(actualRecurrenceType=='RECURS_MONTHLY'){
            if(!valvalidate.method.require(params['interval']) || !valvalidate.method.gt(params['interval'],0)){
                isValid = false;
            }else if(!valvalidate.method.require(params['dayOfMonth']) || !valvalidate.method.gt(params['dayOfMonth'],0) || valvalidate.method.gt(params['dayOfMonth'],31) ){
                isValid = false;
            }else if (duration > params['interval'] * ONE_MONTH_MIN_MILLS) {
                isValid = false;
                errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");;
            }
            if(valvalidate.method.require(params['dayOfMonth']) && params['dayOfMonth']==31 ){
                warningMsg=$.i18n.prop("conferenceplan.js.month.lessthen.31.days.notice");
            }
        }else if(actualRecurrenceType=='RECURS_MONTH_NTH'){
            if(!valvalidate.method.require(params['interval']) || !valvalidate.method.gt(params['interval'],0)){
                isValid = false;
            }else if (duration > params['interval'] * ONE_MONTH_MIN_MILLS) {
                isValid = false;
                errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");;
            }
        }else if(actualRecurrenceType=='RECURS_YEARLY'){
            if(!valvalidate.method.require(params['dayOfMonth']) || !valvalidate.method.gt(params['dayOfMonth'],0)){
                isValid = false;
            }else{
                var year = moment(params['conferenceDate']).year();
                var maxDay = new Date(year, (new Number(params['monthOfYear']) + 1), 0).getDate(); // 取出具体月份的最大的那一天，看用户填的天数是否大于那一天
                if (params['dayOfMonth'] > maxDay) {
                    isValid = false;
                }else if (duration > params['interval'] * ONE_YEAR_MIN_MILLS) {
                    isValid = false;
                    errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");;
                }
            }
        }else if(actualRecurrenceType=='RECURS_YEAR_NTH'){
            if (duration > params['interval'] * ONE_YEAR_MIN_MILLS) {
                isValid = false;
                errorMessage = $.i18n.prop("conferecenplan.js.recurrence.msg.duration.short.frequently");
            }
        }
        if(params['recurrenceRange']==2 && (!valvalidate.method.require(params['occurrences']) || !valvalidate.method.gt(params['occurrences'],0))){
            isValid = false;
        }
        // params['recurrenceType']=='RECURS_YEAR_NTH'){ // 不需要校验
        if(!isValid){
            alertPromptMsgDlg(errorMessage, 2);// 校验不成功，并返回
            return;
        }
        if(warningMsg.length>0){
            alertPromptMsgDlg(warningMsg, 2); // 只是警告而已
        }
        var text = "";
        var intervalStr = (params['interval'] > 1)? " " + params['interval'] + " " : "";
        if (actualRecurrenceType == 'RECURS_DAILY_1') {
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.daily", intervalStr);
        } else if (actualRecurrenceType == 'RECURS_DAILY_-1') {
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.workday");
        } else if (actualRecurrenceType == 'RECURS_WEEKLY') {
            var daysOfWeeks = [];
            var dayOfWeekText = "";
            $(form).find('#RECURS_WEEKLY').find('input[type="checkbox"]:checked').each(function (idx, item) {
                daysOfWeeks.push($(this).val())
                dayOfWeekText += "、" + datofweek[$(this).val()];
            });
            if (daysOfWeeks.length == 0) {
                alertPromptMsgDlg($.i18n.prop("conferenceplan.js.choise.dayofweek.notice"), 2);
                return;
            }
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.weekly", intervalStr, dayOfWeekText.substring(1));
        } else if (actualRecurrenceType == 'RECURS_MONTHLY') {
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.monthly", params['interval'], params['dayOfMonth']);
        } else if (actualRecurrenceType == 'RECURS_MONTH_NTH') {
            var indexText = params['dayOfWeekIndex'] == -1 ?
                $.i18n.prop("conferecenplan.js.recurrence.text.occur.index.last") :
                $.i18n.prop("conferecenplan.js.recurrence.text.occur.index."+ params['dayOfWeekIndex']);
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.month.nth", params['interval'],
                indexText, datofweek[params['dayOfWeek']])

        } else if (actualRecurrenceType == 'RECURS_YEARLY') {
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.month.yearly", intervalStr, $.i18n.prop("conferenceplan.js.month."+(new Number(params['monthOfYear']) + 1)), params['dayOfMonth']);
        } else if (actualRecurrenceType == 'RECURS_YEAR_NTH') {
            var indexText = params['dayOfWeekIndex'] == -1 ?
                $.i18n.prop("conferecenplan.js.recurrence.text.occur.index.last") :
                $.i18n.prop("conferecenplan.js.recurrence.text.occur.index." + params['dayOfWeekIndex']);
            text = $.i18n.prop("conferecenplan.js.recurrence.text.occur.month.year.nth", intervalStr,
                $.i18n.prop("conferenceplan.js.month."+(new Number(params['monthOfYear']) + 1)), indexText, datofweek[params['dayOfWeek']]);
        }
        if (params['recurrenceRange'] == 1) {
            text += $.i18n.prop("conferecenplan.js.recurrence.text.range", params['patternStartDate']);
        } else if (params['recurrenceRange'] == 2) {
            text += $.i18n.prop("conferecenplan.js.recurrence.text.range.repeat", params['patternStartDate'], params['occurrences']);
        } else if (params['recurrenceRange'] == 3) {
            text += $.i18n.prop("conferecenplan.js.recurrence.text.range.duration", params['patternStartDate'], params['patternEndDate']);
        }
        text += $.i18n.prop("conferecenplan.js.recurrence.text.time.duration", params['conferenceStartTime'], params['conferenceEndTime']);
        var recursDiv = $("#" + pageFormId).find('#recurrence_pattern_div');
        $(recursDiv).show();
        $(recursDiv).find('.content').text(text);

        $("#" + type + "_recurrence_pattern #clearRecursBtn").removeAttr("disclick");
        conplan_recurrencepattern.canSaveRecurrencePattern = true;
        conplan_recurrencepattern.isClearRecurrencePattern = false;
        $("#" + type + "_recurrence_pattern").modal("hide");
        $("#" +pageFormId).find('#date_time_select').hide();
    },
    switchRecurrencePattern: function (type, e) {
        $(e).parents('.modal').find('.recurs').hide();
        $(e).parents('.modal').find('#' + type).show();
    },
    /**
     * 清除会议周期
     */
    clearRecurrencePattern: function (type, pageFormId) {
        //隐藏“会议周期”文字
        var recursDiv = $("#" + pageFormId).find('#recurrence_pattern_div');
        $(recursDiv).hide();
        $(recursDiv).find('.content').text("");
        //重置会议周期面板
        type + "_recurrence_pattern",
        $('#' + type + '_recurrence_pattern').html(template("add_recurrence_pattern_temp"));
        $("#" + type + "_recurrence_pattern #pattern_start_date," +
            "#" + type + "_recurrence_pattern #pattern_end_date").val(moment(new Date()).format('YYYY-MM-DD'));
        $("#" + type + "_recurrence_pattern").modal("hide");
        conplan_recurrencepattern.canSaveRecurrencePattern = true;
        conplan_recurrencepattern.isClearRecurrencePattern = true;
        $("#" + pageFormId).find('#date_time_select').show();
    }
}

var dateutil = {
    round: function (date, duration, method) {
        return moment(Math[method]((+date) / (+duration)) * (+duration));// 下一个duration，比如6:10, 30 minutes,就是取下一个半小时，即6:30
    }
}

var timezoneUtil = {
    getWinTimezoneList: function () {
        var winTimezoneList;
        $.ajax({
            url: getContextPath() + "/timeZone/listWin",
            type: "get",
            async: false,
            success: function (res) {
                winTimezoneList = res.rows;
            }
        });
        return winTimezoneList;
    },
    recommendedTimezone: function () {
        var recommendedTimezone = GetCookie("lastTimezoneSelect");
        if(recommendedTimezone) {
            return recommendedTimezone;
        }
        $.ajax({
            url: getContextPath() + "/timesetting/query",
            type: "post",
            async: false,
            data: {type: "timeConfig"},
            success: function (res) {
                recommendedTimezone = res.rows.data.winTimeZone;
            }
        });
        return recommendedTimezone;
    },
    localTimeZoneOffset: function () {
        var d = new Date();
        var localOffset = d.getTimezoneOffset();//取得当地时间和GMT时间的差值，单位：分钟
        return localOffset * -60;
    }
}
/**
 * 计算持续时间
 */
template.helper('calcDuration', function(startTime,e) {
    if(!startTime) {
        return "";
    }
    setInterval(function () {
        var t = moment().diff(moment(startTime));
        var d=0;
        var h=0;
        var m=0;
        var s=0;
        if(t>=0){
            d=Math.floor(t/1000/60/60/24);
            h=Math.floor(t/1000/60/60%24);
            m=Math.floor(t/1000/60%60);
            s=Math.floor(t/1000%60);
        }
        return d + $.i18n.prop("conferecenplan.js.text.day") + zeroPreFill(parseInt(h), 2) + ":" + zeroPreFill(parseInt(m), 2)+ ":" + zeroPreFill(parseInt(s), 2);
    }, 0)

});

/**
 * 正在进行会议的周期任务
 */
template.helper('createJob', conferenceplan.createIntervalJob);

template.helper('showStaffName', function(name,email){
    if(email) return name;
    return name + "(" + $.i18n.prop("conferecenplan.js.unbind.mail") + ")";
});

/**
 * 计算会议持续时间， 年/月/日 时:分 - 时:分 或 年/月/日 时:分 - 年/月/日 时:分
 */
template.helper('conferenceDurationTime', function(startTime, expiryTime){
    var startTimeStr = moment(Number(startTime)).format("YYYY-MM-DD HH:mm");
    if(!expiryTime) {
        return startTimeStr;
    }
    var startDateStr = moment(Number(startTime)).format("YYYY-MM-DD");
    var expiryDateStr = moment(Number(expiryTime)).format("YYYY-MM-DD");
    return $.i18n.prop("conferenceplan.js.date.to", startTimeStr, (startDateStr != expiryDateStr)?
        moment(Number(expiryTime)).format("YYYY-MM-DD HH:mm") : moment(Number(expiryTime)).format("HH:mm"))
});

/**
 * 计算会议持续时间， 年/月/日 时:分 - 时:分 或 年/月/日 时:分 - 年/月/日 时:分
 */
template.helper('conferenceDurationTime', function(startTime, expiryTime){
    var startTimeStr = moment(Number(startTime)).format("YYYY-MM-DD HH:mm");
    if(!expiryTime) {
        return startTimeStr;
    }
    var startDateStr = moment(Number(startTime)).format("YYYY-MM-DD");
    var expiryDateStr = moment(Number(expiryTime)).format("YYYY-MM-DD");
    return $.i18n.prop("conferenceplan.js.date.to", startTimeStr, (startDateStr != expiryDateStr)?
        moment(Number(expiryTime)).format("YYYY-MM-DD HH:mm") : moment(Number(expiryTime)).format("HH:mm"))
});

/**
 * 计算会议持续时间，年/月/日(周) 时:分 - 时:分 或 年/月/日(周) 时:分 - 年/月/日(周) 时:分
 */
template.helper('conferenceDurationTimeWithWeek', function(startTime, expiryTime, test){
    var startFormat = moment(Number(startTime)).format("YYYY-MM-DD") + "(" +
        $.i18n.prop("conferenceplan.js." + moment(Number(startTime)).format("dddd").toLowerCase()) + ") " +
        moment(Number(startTime)).format("HH:mm");
    if(!expiryTime) {
        return startFormat;
    }
    var startDateStr = moment(Number(startTime)).format("YYYY-MM-DD");
    var expiryDateStr = moment(Number(expiryTime)).format("YYYY-MM-DD");
    if(startDateStr != expiryDateStr) {
        var expiryFormat = expiryDateStr + "(" +
            $.i18n.prop("conferenceplan.js." + moment(Number(expiryTime)).format("dddd").toLowerCase()) + ") " +
            moment(Number(expiryTime)).format("HH:mm");
        return $.i18n.prop("conferenceplan.js.date.to", startFormat, expiryFormat);
    } else {
        return $.i18n.prop("conferenceplan.js.date.to", startFormat, moment(Number(expiryTime)).format("HH:mm")) ;
    }
});

template.helper('durationTimeWithWeekAndOffset', function(startTime, expiryTime, utcOffset){
   var utcOffset = utcOffset / 3600;
    var startFormat = moment(Number(startTime)).utcOffset(utcOffset).format("YYYY-MM-DD") + "(" +
        $.i18n.prop("conferenceplan.js." + moment(Number(startTime)).utcOffset(utcOffset).format("dddd").toLowerCase()) + ") " +
        moment(Number(startTime)).utcOffset(utcOffset).format("HH:mm");
    if(!expiryTime) {
        return startFormat;
    }
    var startDateStr = moment(Number(startTime)).utcOffset(utcOffset).format("YYYY-MM-DD");
    var expiryDateStr = moment(Number(expiryTime)).utcOffset(utcOffset).format("YYYY-MM-DD");

    if(startDateStr != expiryDateStr) {
        var expiryFormat = expiryDateStr + "(" +
            $.i18n.prop("conferenceplan.js." + moment(Number(expiryTime)).utcOffset(utcOffset).format("dddd").toLowerCase()) + ") " +
            moment(Number(expiryTime)).utcOffset(utcOffset).format("HH:mm");
        return $.i18n.prop("conferenceplan.js.date.to", startFormat, expiryFormat);
    } else {
        return $.i18n.prop("conferenceplan.js.date.to", startFormat, moment(Number(expiryTime)).utcOffset(utcOffset).format("HH:mm")) ;
    }
});

/**
 * 计算会议持续时间，时:分 - 时:分 或 年/月/日 时:分 - 年/月/日 时:分
 */
template.helper('conferenceDurationSimpleTime', function(startTime, expiryTime){
    var startDateStr = moment(Number(startTime)).format("YYYY-MM-DD");
    var expiryDateStr = moment(Number(expiryTime)).format("YYYY-MM-DD");
    if(startDateStr != expiryDateStr) {
        return $.i18n.prop("conferenceplan.js.date.to", moment(Number(startTime)).format("YYYY-MM-DD HH:mm "),
            moment(Number(expiryTime)).format(" YYYY-MM-DD HH:mm"));
    }else {
        return  $.i18n.prop("conferenceplan.js.date.to", moment(Number(startTime)).format("HH:mm "),
            moment(Number(expiryTime)).format(" HH:mm"));
    }
});

/**
 * 会议室
 */
template.helper('roomListShow', function(list,type){
    if (!list || list.length == 0)return "";
    var s = "";
    if (type == 'title') {
        for(var i=0;i<list.length;i++){
            if(i<=9){
                if (i == list.length - 1) {
                    s += list[i].title;
                } else {
                    s += list[i].title + '\n';
                }
            }else{
                s+='...';
                break;
            }
        }
    } else {
        $.each(list, function (index, element) {
            if (index == list.length - 1) {
                s += element.title;
            } else {
                s += element.title + i18nShow.dotShow();
            }
        })
    }
    return s;
});



var  i18nShow={
    dotShow:function(){
        if ($('#browserLang').val() == 'en') {
            return ',';
        } else if ($('#browserLang').val() == 'zh_CN') {
            return '，'
        }
    }
}