var calldetail = {
    init:function () {
        $(".g-back").on("click", function () {
            main.pageInit(main.MAIN_DATA, "callrecord");
        })
    },
    showDetail: function (id, type) {
        if(type == "p2p") {
            p2pDetail.showP2p(id);
        } else {
            confDetail.showConf(id);
        }
    }
}

var confDetail = {
    offset: 0,
    CALL_DETAIL_COLUMNS: [
    {
        field: '',
        title: '',
        width: '20px',
        formatter: function(value, row, index){
            return confDetail.offset + index + 1;
        }
    },{
        field: 'name',
        class: 'g-text-ellipsis',
        width: '25%',
        title: $.i18n.prop("calldetail.html.participate.name"),
        formatter: function(value, row, index){
            return '<span title="' + value + '">' + value + '</span>';
        }
    },{
        field: 'username',
        title: $.i18n.prop("calldetail.html.participate.account")
    },{
        field: '',
        width: '15%',
        title: $.i18n.prop("calldetail.html.participate.time"),
        formatter: function(value, row, index){
            return moment(row.startTime).format("YYYY/MM/DD HH:mm:ss");
        }
    }, {
        field: 'duration',
        title: $.i18n.prop("calldetail.html.participate.duration"),
        formatter: function(value, row, index){
            return timeUtil.durationFormat(value);
        }
    }, {
        field: 'userAgent',
        width: '30%',
        title: $.i18n.prop("calldetail.html.participate.agent")
    }, {
        field: 'attendanceRole',
        title: $.i18n.prop("calldetail.html.participate.role"),
        formatter: function(value, row, index){
            return $.i18n.prop("calldetail.js.role." + value);
        }
    }],
    attendeeTable: function () {
        $('#m-at-table').bootstrapTable({
            striped:true,
            classes: 'table table-hover g-table-fixed',
            columns: confDetail.CALL_DETAIL_COLUMNS,
            url: "/callrecord/conf/attendances",
            method: 'post',
            pagination: true,
            sortable: false,
            sortOrder: "desc",
            queryParams: confDetail.queryParams,
            sidePagination: "server",
            pageNumber:1,
            pageSize: getTablePageSizeForBS('m-at-table'),
            pageList: [10, 20, 50, 100],
            strictSearch: false,
            locale:getLan(),
            clickToSelect: true,
            cardView: false,
            detailView: false,
            onLoadSuccess: function (data) {
                $("#cd_attendees").text(data.total);
            }
        });
    },
    showConf: function (id) {
        $("#confUuid").val(id);
        $("#attendeeList").show();
        var confData = confDetail.loadData(id);
        confDetail.render(confData);
        confDetail.attendeeTable();
    },
    loadData: function (id) {
        var resultData;
        $.ajax({
            url: "callrecord/conf/" + id,
            type: "get",
            dataType: "json",
            async:false,
            success: function (result) {
                resultData = result.rows;
            }
        });
        return resultData;
    },
    render: function(data) {
        $("div[name='conf_info']").show();
        $("div[name='p2p_info']").hide();
        $("#cd_title").text(data.subject + "(ID: " + data.conferenceId + ")");
        $("#cd_title").attr("title", data.subject + "(ID: " + data.conferenceId + ")");
        $("#cd_type").text($.i18n.prop("callrecord." + data.type));
        $("#cd_organizer").text(data.organizerName);
        $("#cd_organizer").attr("title", data.organizerName);
        $("#cd_dateTime").text(timeUtil.startEndTimeFormat(data.startTime, data.endTime));
        $("#cd_duration").text(timeUtil.durationFormat(data.duration));
        if(data.type == "meetnow") {
            $(".m-cd-logo").attr("class", "m-cd-logo m-cd-meetnow");
        } else {
            $(".m-cd-logo").attr("class", "m-cd-logo m-cd-recurrence");
        }
    },
    queryParams: function (params) {
        if(params) {
            confDetail.offset = params.offset;
        }
        return $.extend(params, {
            confUuid: $("#confUuid").val()
        });
    }
}

var p2pDetail = {
    showP2p: function (id) {
        $("#attendeeList").hide();
        var data = p2pDetail.loadData(id);
        p2pDetail.render(data);
    },
    loadData: function (id) {
        var data;
        $.ajax({
            url: "callrecord/p2p/" + id,
            type: "get",
            dataType: "json",
            async:false,
            success: function (result) {
                if(result.ret != 1) {

                }
                data = result.rows;
            }
        });
        return data;
    },
    render: function(data) {

        var p2pTitle = $.i18n.prop("callrecord.js.someone.call.someone", data.callerName, data.calleeName);
        if(!data.callerName || !data.calleeName) {
            p2pTitle = "--";
        }
        $("div[name='conf_info']").hide();
        $("div[name='p2p_info']").show();
        $(".m-cd-logo").attr("class", "m-cd-logo m-cd-p2p");
        $("#cd_title").text(p2pTitle);
        $("#cd_title").attr("title", p2pTitle);
        $("#cd_type").text($.i18n.prop("callrecord.p2p"));
        $("#cd_caller").text(data.callerNumber + (data.callerName? ("(" + data.callerName + ")") : ""));
        $("#cd_callee").text(data.calleeNumber + (data.calleeName? ("(" + data.calleeName + ")") : ""));
        $("#cd_caller").attr("title", data.callerNumber + (data.callerName? ("(" + data.callerName + ")") : ""));
        $("#cd_callee").attr("title", data.calleeNumber + (data.calleeName? ("(" + data.calleeName + ")") : ""));
        $("#cd_dateTime").text(timeUtil.startEndTimeFormat(data.startTime, data.endTime));
        $("#cd_duration").text(timeUtil.durationFormat(data.duration));
    }
}