//@ sourceURL=callrecord.js
var callrecord = {
    init:function () {
        callRecordStatistics.query(this.queryParams());
        callRecordList.init();

    },
    /**
     * 查询最近几个月内的通话记录
     * @param month
     */
    queryRecent: function (event) {
        var event = event || window.event;
        var obj = event.srcElement ? event.srcElement : event.target;
        var $obj = $(obj);
        $(".m-cr-time-option a").removeClass("option-selected");
        $obj.addClass("option-selected");

        callRecordList.query();
        callRecordStatistics.query(this.queryParams());
    },
    queryParams: function () {
        var month = Number($(".m-cr-time-option .option-selected").attr("month"));
        var yesterdayMills = moment(moment().format("YYYY-MM-DD")).valueOf() - 1;
        var monthAgoMills = moment(moment().format("YYYY-MM-DD")).subtract(month, 'M').valueOf();
        var data = {
            startTime: monthAgoMills,
            endTime: moment().valueOf()
        };
        var queryTimeFmt = "(" + moment(monthAgoMills).format("YYYY/MM/DD") + " ~ " + moment().format("YYYY/MM/DD") + ")";
        $("#call_query_time").text(queryTimeFmt);
        return data;
    },
    export: function () {
        var params = $.extend(callRecordList.queryParams(), {
            offset: new Date().getTimezoneOffset() * -60
        });
        var downloadUri = "callrecord/export";
        for(var i in params) {
            if(!params.hasOwnProperty(i)){
                continue;
            }
            downloadUri = setUrlParam(downloadUri, i, params[i]);
        }
        location.href = downloadUri;
    }
}

var callRecordList = {
    offset : 0,
    CALL_RECORD_COLUMNS: [
    {
        field: '',
        title: '',
        width: '60px',
        class: 'g-text-ellipsis',
        formatter: function(value, row, index){
            return "<span class='g-text-ellipsis' title='" + (callRecordList.offset + index + 1) + "'>" + (callRecordList.offset + index + 1) +"</span>";
        }
    },{
        field: 'subject',
        title: $.i18n.prop("callrecord.js.title.record.tabtitle.subject"),
        width: '30%',
        class: 'g-text-ellipsis',
        formatter: function(value, row, index){
            var dispTxt;
            if(value) {
                dispTxt = value;
                if(row.type == "meetnow") {
                    dispTxt = $.i18n.prop("calldetail.js.meetnow.subject", row.organizerName);
                }
            } else if(!row.callerName || !row.calleeName) {
                dispTxt = "--"
            } else {
                dispTxt = $.i18n.prop("callrecord.js.someone.call.someone", row.callerName, row.calleeName);
            }
            var recordId = (row.type == "p2p")? row.callId : row.conferenceUuid;
            return "<a title='" + dispTxt + "' " +
                "onclick=\"callRecordList.detail(\'" + recordId + "\',\'" + row.type + "\')\" " +
                "style='cursor: pointer'> " + dispTxt + " </a>";
        }
    },{
        field: 'type',
        title: $.i18n.prop("callrecord.js.title.record.tabtitle.type"),
        formatter: function(value, row, index){
            return $.i18n.prop("callrecord." + value);
        }
    },{
        field: 'conferenceId',
        title: $.i18n.prop("callrecord.js.title.record.tabtitle.id"),
        formatter: function(value, row, index){
            return value? value : "--";
        }
    }, {
        field: 'callTime',
        width: '29%',
        title: $.i18n.prop("callrecord.js.title.record.tabtitle.time"),
        formatter: function(value, row, index){
            return timeUtil.startEndTimeFormat(row.startTime, row.endTime);
        }
    }, {
        field: 'duration',
        title: $.i18n.prop("callrecord.js.title.record.tabtitle.duration"),
        formatter: function(value, row, index){
            return timeUtil.durationFormat(value);
        }
    }, {
        field: '',
        title: $.i18n.prop("callrecord.js.title.record.tabtitle.detail"),
        formatter: function(value, row, index){
            var recordId = (row.type == "p2p")? row.callId : row.conferenceUuid;
            return "<a onclick=\"callRecordList.detail(\'" + recordId + "\',\'" + row.type + "\')\"" +
                " style='cursor: pointer'> " + $.i18n.prop("callrecord.js.tale.detail") + "</a>";
        }
    }],
    init: function () {
        $('#m-cr-table').bootstrapTable({
            striped: true,
            classes: 'table table-hover g-table-fixed',
            columns: callRecordList.CALL_RECORD_COLUMNS,
            url: '/callrecord/list',
            queryParams: callRecordList.queryParams,     //传递参数（*）
            method: 'post',
            pagination: true,
            sortable: false,           //是否启用排序
            sortOrder: "desc",          //排序方式
            sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                        //初始化加载第一页，默认第一页
            pageSize: getTablePageSizeForBS('m-cr-table'),        //每页的记录行数（*）
            pageList: [10, 20, 50, 100],          //可供选择的每页的行数（*）
            strictSearch: false,
            locale: getLan(),
            clickToSelect: true,        //是否启用点击选中行
            cardView: false,          //是否显示详细视图
            detailView: false         //是否显示父子表
        });

        $(".m-cr-calloperation button[name='callTypeBtn']").off('click').on('click', function (event) {
            var event = event || window.event;
            var obj = event.srcElement ? event.srcElement : event.target;
            $(".m-cr-calloperation button[name='callTypeBtn']").attr("class", "btn btn-default");
            $(obj).attr("class", "btn btn-yealink");
            callRecordList.query();
        });

        $('#callRecordSearchIpt').off('keypress').on('keypress', function (event) {
            var keycode = event.keyCode ? event.keyCode : event.which;
            if (keycode == 13) {
                callRecordList.query();
                return false;
            }
        });
    },
    queryParams: function (params) {
        if(params) {
            callRecordList.offset = params.offset;
        }
        var type = $(".m-cr-calloperation button[name='callTypeBtn'].btn-yealink").attr("quryType");
        var key = $.trim($("#callRecordSearchIpt").val());
        var queryParams = $.extend(callrecord.queryParams(), params, {
            type: type,
            search: key
        });
        return queryParams;
    },
    query: function () {
        $('#m-cr-table').bootstrapTable("refresh", {url: 'callrecord/list'});
    },
    /**
     * 查看会议详情
     * @param id
     * @param type
     */
    detail: function (id, type) {
        main.pageInit(main.MAIN_DATA, "calldetail",function () {
            calldetail.showDetail(id, type);
        });
    }
}

var callRecordStatistics = {
    query: function (queryParams) {
        $.ajax({
            url: "callrecord/statistics",
            dataType: "json",
            type: "post",
            async:false,
            data: JSON.stringify(queryParams),
            contentType: "application/json; charset=UTF-8",
            success: function (result) {
                callRecordStatistics.renderCallStatistics(result.rows.callStatisticsList);
                callRecordStatistics.renderLicenseStatistics(result.rows.licenseStatsSummary);
            }
        });
    },
    renderCallStatistics: function(data) {
        if(!data) {
            return;
        }
        var callCount = 0;
        var durationCount = 0;
        for(var i = 0; i < data.length; i++) {
            callCount += data[i].count;
            durationCount += data[i].duration;
            $("#duration_" + data[i].type).text(timeUtil.durationFormat(data[i].duration));
        }
        for(var i = 0; i < data.length; i++) {
            var rate = (Number(data[i].count / callCount) * 100).toFixed(2) + "%";
            $("#count_" + data[i].type).text(data[i].count + " (" + rate + ")");
        }
        $("#allcall_count").text(callCount);
        $("#allcall_duration").text(timeUtil.durationFormat(durationCount));
    },
    renderLicenseStatistics: function(data) {
        $("#port_count").text(data.permissionAmount);
        if(!data.occursRateList) {
            return;
        }
        $("#port_max").text(data.maxOccurs);
        var rateCount = 0;
        $("#port_statistics_table").html("");
        var i;
        for(i = 0; i < data.occursRateList.length && i < 4; i++) {
            rateCount += Number((data.occursRateList[i].rate * 100).toFixed(2));
            var trHtml = "<tr>" +
                "<td><label class=\"sort-index\">" + (i+1) +"</label></td>" +
                "<td>" + data.occursRateList[i].occurs + "</td>" +
                "<td>" + (data.occursRateList[i].rate * 100).toFixed(2) + "%</td>" +
                "</tr>";
            $("#port_statistics_table").append(trHtml);
        }
        var bankTr = 5 - data.occursRateList.length;
        if(rateCount < 100) {
            var trHtml = "<tr>" +
                "<td><label class=\"sort-index\">" + (i+1) +"</label></td>" +
                "<td>" + $.i18n.prop("callrecord.js.summary.port.occur.other") + "</td>" +
                "<td>" + (100 - rateCount).toFixed(2) + "%</td>" +
                "</tr>";
            $("#port_statistics_table").append(trHtml);
            bankTr -= 1;
        }
        for(var i = 0; i < bankTr; i++) {
            $("#port_statistics_table").append("<tr style='height: 42px'/>");
        }
    }
}

var timeUtil = {
    durationFormat: function (duration) {
        var h=0;
        var m=0;
        var s=0;
        if(duration >= 3600) {
            h  = parseInt(duration / 3600);
            duration %= 3600
        }
        if(duration >= 60) {
            m  = parseInt(duration / 60);
            duration %= 60
        }
        s = parseInt(duration);
        h = (h >= 10)? h : ((h)? "0" + h : "00");
        m = (m >= 10)? m : ((m)? "0" + m : "00");
        s = (s >= 10)? s : ((s)? "0" + s : "00");
        return h + ":" + m + ":" + s;
    },
    startEndTimeFormat: function(start, end) {
        var startDate = moment(start).format("YYYY/MM/DD");
        var endDate = moment(end).format("YYYY/MM/DD");
        var startDateTime = moment(start).format("YYYY/MM/DD HH:mm:ss");
        return startDateTime + " - " + ((startDate == endDate)? moment(end).format("HH:mm:ss") : moment(end).format("YYYY/MM/DD HH:mm:ss"));
    }
}