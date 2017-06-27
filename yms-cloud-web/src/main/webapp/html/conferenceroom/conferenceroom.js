var conferenceroom = {
    conferenceRoomSearch: {
        conferenceRoomSearchInit: {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid"
                }
            },
            callback: {
                onClick: {}
            }
        }
    },
    conferenceRoomNodeClick: {
        onClickSearchStaffAccountNode: function (e, treeId, node, type) {
            searchOperate.clearSearchDiv('search_staff_account_div_' + type);
            $("#m_crm_binding_account_name_div").show();
            $("#m_crm_search_account_div_" + type).hide();
            $('#account_binding_id_' + type).val(node.accountId);
            $('#m_crm_binding_account_name_div_' + type).text(node.name);
            $('#account_binding_username_' + type).text(node.accountUsername);
        }
    },
    init: function () {
        var lastPageSize = $("#room_last_pageSize").val();
        conferenceroom.showConferenceRoomList(1, lastPageSize);
        conferenceroom.bindingFuzzySearchRoom();
        $("#search_conference_room").on('keydown', function (event) {
            if (event.keyCode == "13") {
                $('#search_conference_room_box').trigger('click');
            }
        });

        $('.m-crm-bt1 button').each(function(){
           $(this).on('click',function(){
                $('.m-crm-bt1 button').removeClass('conf-selected');
                $(this).addClass('conf-selected');
            })
        });
    },
    bindingFuzzySearchRoom: function () {
        $("#search_conference_room").autocomplete({
            source:function(query,process){
                this.options.items = 1000;//允许返回结果集最大数量
                $.ajax({
                    url: "conferenceRoom/autoComplete",
                    type: "POST",
                    data: JSON.stringify({
                        searchKey: query,
                        roomType:$('#room_type').val(),
                        maxCount: this.options.items
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (respData) {
                        return process(respData.rows);
                    }
                });
            },
            formatItem:function(item){
                return item["name"];
            },
            setValue:function(item){
                return {"data-value":item["name"], "real-value":item["_id"]};
            },
            updater: function(item) {
                var id = $(".typeahead.dropdown-menu").find(".active").attr("real-value");
                if(!id) {
                    return;
                }
                conferenceroom.showConferenceRoomList(1, $("#room_last_pageSize").val(), null, null, null, id);
            }
        });
    },
    showConferenceRoomList: function (pageNo, pageSize, orderByField, orderByType, roomType, roomId, searchKey) {
        $('#room_type').val(roomType);
        var data;
        orderByType = orderByType == undefined || orderByType == null ? 1 : orderByType;
        orderByField = orderByField == undefined || orderByField == null ? "namePinyin" : orderByField;
        roomType = roomType == undefined || roomType == null ? "" : roomType;
        searchKey = searchKey == undefined || searchKey == null ? "" : searchKey;
        data = JSON.stringify({
            "pageNo": pageNo == undefined ? 1 : pageNo, "pageSize": pageSize == undefined ? $("#room_last_pageSize").val() : pageSize,
            "orderByField": orderByField, "orderByType": orderByType,
            "roomIdFilter": roomId, "roomTypeFilter": roomType, "searchKey": searchKey
        });
        $.ajax({
            url: getContextPath() +"/conferenceRoom/search",
            type: "post",
            async: true,
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                var pageModelRet = executePageModel(ret);
                pageModelRet = $.extend({"roomType": roomType, "orderByType": orderByType, "orderByField": orderByField, "searchKey": searchKey}, pageModelRet);
                document.getElementById('m-crm-table').innerHTML = template('conferenceRoomListTemp', pageModelRet)
            }
        });
    },
    showListOrderBy: function (pageNo, pageSize, orderByField, prevOrderByType, roomType,searchKey) {
        conferenceroom.showConferenceRoomList(pageNo, pageSize, orderByField, prevOrderByType * -1, roomType, null, searchKey)
    },
    changeSelectPageNo: function (pageNo, pageSize, orderByField, prevOrderByType, roomType, searchKey) {
        conferenceroom.showConferenceRoomList(pageNo, pageSize, orderByField, prevOrderByType, roomType, null, searchKey)
    },
    changeSelectPageSize: function (pageNo, pageSize, orderByField, prevOrderByType, roomType, searchKey) {
        $("#room_last_pageSize").val(pageSize);
        pageNo=1;
        conferenceroom.showConferenceRoomList(pageNo, pageSize, orderByField, prevOrderByType, roomType, null, searchKey)
    },
    openAddPage: function () {
        formutil.clearText('m-crm-add');
        var addForm = $('#m-crm-add');
        $(addForm).find('#account_binding_username_add').text($.i18n.prop('conferenceroom.js.choose.account'));
        $(addForm).find("#m_crm_binding_account_name_div").hide();
        $(addForm).find('#m_crm_binding_account_name_div_add').text('');
        $(addForm).find("input[value='normal_room']").trigger('click');
        $(addForm).modal('show');
        conferenceroom.showBindingAccountListByFilter('add');
        conferenceroom.showSearchAccount('add');
    },
    switchPage: function (type, operateType) {
        formutil.clearErrorMsg('m-crm-' + operateType);
        if (type == 'vc_room') {
            $('#m-crm-' + operateType).find('#m-crm-binding-account-div').show();
            if($('#m_crm_search_account_div_'+operateType).css("display")!='none'){
                $('#account_binding_username_'+operateType).parent().trigger('click');
            }
            $("#account_binding_" + operateType).blur();
        } else {
            $('#m-crm-' + operateType).find('#m-crm-binding-account-div').hide();
        }
    },
    searchByKey: function () {
        var key = $('#search_conference_room').val();
        conferenceroom.showConferenceRoomList(1, $("#room_last_pageSize").val(), null, null, $('#room_type').val(), null, key);
        $("#search_conference_room_div").find('#result_div').hide();
    },
    showSearchAccount: function (type) {
        $("#search_staff_account_input_crm_" + type).autocomplete({
            source:function(query,process){
                this.options.items = 1000;//允许返回结果集最大数量
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
            formatItem:function(item){
                return item["name"]+"("+item["username"]+")";
            },
            setValue:function(item){
                return {"data-value":item["name"], "real-value":item["businessAccountId"], "username":item["username"]};
            },
            updater: function(item) {
                var searchDivDomObj = $('#search_staff_account_div_'+type);
                var id = $(searchDivDomObj).find(".typeahead.dropdown-menu").find(".active").attr("real-value");
                var name = $(searchDivDomObj).find(".typeahead.dropdown-menu").find(".active").attr("data-value");
                var username = $(searchDivDomObj).find(".typeahead.dropdown-menu").find(".active").attr("username");

                if(!id) {
                    return;
                }
                conferenceroom.selectBindingAccount(id, type, name, username);
            }
        });
    },
    showBindingAccountListBySearchKey: function (type) {
        $('#m_crm_search_account_div_' + type).find('.div-scroll-table-body').off("scroll");
        var searchKey = $.trim($("#search_staff_account_input_crm_" + type).val());
        /*如果关键字为空，则按原来的分批加载账号列表*/
        if(!searchKey) {
            conferenceroom.showBindingAccountListByFilter(type);
            return;
        }
        var page = 1;
        var totalPages = 1;
        var pageSize = 10000;
        var dataForList;
        dataForList = JSON.stringify({
            "pageNo": page,
            "pageSize": pageSize,
            "orderByField": "namePinyin",
            "orderByType": 1,
            "searchKey": searchKey
        });
        $.ajax({
            url: getContextPath() +"/staff/search",
            type: "post",
            async: true,
            data: dataForList,
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                totalPages = ret.rows.totalPages;
                var pageModelRet = $.extend({"type": type}, executePageModel(ret));
                $('#search_account_list_crm_' + type).html(template('conferenceRoomStaffAccountListTemp', pageModelRet));
            }
        });
    },
    nodataCall: function (type) {
        $('#search_account_list_crm_' + type).html($.i18n.prop('conferenceroom.js.nodata'));
        $("#m_crm_search_account_div_" + type).find("#result_ul").html("");
        $("#m_crm_search_account_div_" + type).find("#result_div").hide();
    },
    showBindingAccountListByFilter: function (type, searchKey) {
        var page = 1;
        var totalPages = 1;
        var dataForList;
        searchKey = searchKey == undefined || searchKey == null ? "" : searchKey;
        dataForList = JSON.stringify({
            "pageNo": page, "pageSize": 100,
            "orderByField": "namePinyin", "orderByType": 1, "searchKey": searchKey
        });
        $.ajax({
            url: getContextPath() +"/staff/search",
            type: "post",
            async: true,
            data: dataForList,
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                totalPages = ret.rows.totalPages;
                var pageModelRet = $.extend({"type": type}, executePageModel(ret));
                $('#search_account_list_crm_' + type).html(template('conferenceRoomStaffAccountListTemp', pageModelRet));
                if (totalPages > 1 && page <= totalPages) {
                    var searchAccountDiv = $('#m_crm_search_account_div_' + type);
                    $(searchAccountDiv).find('.div-scroll-table-body').scroll(function () {
                        /*判断窗体高度与竖向滚动位移大小相加 是否 超过内容页高度*/
                        var _this = this;
                        if (($(_this).height() + $(_this).scrollTop()) >= $(searchAccountDiv).find('.table-content').height()) { //滚到最底部加载
                            $.ajax({
                                url:getContextPath() + "/staff/search",
                                type: "post",
                                async: true,
                                data: JSON.stringify({
                                    "pageNo": ++page, "pageSize": 100,
                                    "orderByField": "namePinyin", "orderByType": 1, "searchKey": searchKey
                                }),
                                contentType: "application/json; charset=utf-8",
                                success: function (ret) {
                                    var pageModelRet = $.extend({"type": type}, executePageModel(ret));
                                    $('#search_account_list_crm_' + type).append(template('conferenceRoomStaffAccountListTemp', pageModelRet));
                                    $(_this).scrollTop = $(_this).scrollTop() * page
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    selectBindingAccount: function (id, type, name, username) {
        searchOperate.clearSearchDiv('search_staff_account_div_' + type);
        $("#m_crm_binding_account_name_div").show();
        $("#m_crm_search_account_div_" + type).hide();
        $('#account_binding_id_' + type).val(id);
        $('#m_crm_binding_account_name_div_' + type).text(name);
        $('#account_binding_username_' + type).text(username);
    },
    returnMain: function () {
        $('.m-crm').each(function () {
            $(this).hide();
        });
        conferenceroom.init();
        $('#conferenceRoom_manage').show();
    },
    save: function (formId) {
        formutil.submitForm({
            formId: formId,
            autoCommit: true,
            nodes: [{
                name: 'name',
                method: 'require'
            }],
            succ: function () {
                if ($("input[name='type']:checked").val() == 'vc_room' && !$('#account_binding_id_add').val()) {
                    formutil.defaultErrorFmter($('#account_binding_id_add'), 'require')
                    return false;
                }
                var params = {
                    "type": $("input[name='type']:checked").val(),
                    "name": $("#name_create").val(),
                    "businessAccountId": $('#account_binding_id_add').val()
                };
                $.ajax({
                    url: getContextPath() +"/conferenceRoom/create",
                    type: "post",
                    async: false,
                    data: params,
                    dataType: "json",
                    traditional: true,
                    success: function (result) {
                        if (result.ret == 1) {
                            $('#m-crm-add').modal("hide");
                            alertPromptMsgDlg($.i18n.prop('conferenceroom.js.add.success'), 1, conferenceroom.returnMain);
                            //formutil.clearErrorMsg('m-sam-add');
                        } else {
                            alertPromptMsgDlg(result.message, 2, null);
                        }
                    }
                });
            }
        });
    },
    openEditPage: function (id) {
        $.ajax({
            url: getContextPath() +"/conferenceRoom/" + id,
            type: "get",
            async: true,
            contentType: "application/json; charset=utf-8",
            success: function (ret) {
                document.getElementById('m-crm-edit').innerHTML = template('conferenceRoomEditTemp', ret)
                $('#m-crm-edit').modal('show');
                conferenceroom.showBindingAccountListByFilter('edit');
                conferenceroom.showSearchAccount('edit');
            }
        });
    },
    edit: function (formId) {
        formutil.submitForm({
            formId: formId,
            autoCommit: true,
            nodes: [{
                name: 'name',
                method: 'require'
            }],
            succ: function () {
                if ($("#m-crm-editform").find("input[name='type']:checked").val() == 'vc_room' && !$('#account_binding_id_edit').val()) {
                    formutil.defaultErrorFmter($('#account_binding_id_edit'), 'require')
                    return false;
                }
                var params = formutil.getFormData('m-crm-editform');
                $.ajax({
                    url: getContextPath() +"/conferenceRoom/edit",
                    type: "post",
                    async: false,
                    data: params,
                    dataType: "json",
                    traditional: true,
                    success: function (result) {
                        if (result.ret == 1) {
                            $('#m-crm-edit').modal("hide");
                            alertPromptMsgDlg(result.message, 1, conferenceroom.returnMain);
                        } else {
                            alertPromptMsgDlg(result.message, 2, null);
                        }
                    }
                });
            }
        });
    },
    showAccountBingDropDown: function (type) {
        $('#m_crm_search_account_div_' + type).toggle();
        setTimeout(function () {
            $("#search_staff_account_input_crm_" + type).focus()
        }, 150);
    },
    deleteRoom: function (id) {
        alertConfirmationMsgDlgDetail($.i18n.prop('conferenceroom.js.delete.confrence'), $.i18n.prop('conferenceroom.js.deleteOne.tips'), $.i18n.prop('conferenceroom.js.delete'), conferenceroom.deleteAjax, [id]);
    },
    deleteBatch: function () {
        var conferenceRoomIds = [];
        $('#m-crm-table').find("input[id^='conferenceRoomCheck_']").each(function () {
            if ($(this).prop('checked')) {
                conferenceRoomIds.push($(this).attr("id").replace("conferenceRoomCheck_", ""));
            }
        });
        if (conferenceRoomIds.length == 0) {
            alertPromptMsgDlg($.i18n.prop('conferenceroom.js.choose.room'), 3, null);
            return;
        }
        alertConfirmationMsgDlgDetail($.i18n.prop('conferenceroom.js.delete.confrence'), $.i18n.prop('conferenceroom.js.delete.tips'), $.i18n.prop('conferenceroom.js.delete'), conferenceroom.deleteAjax, conferenceRoomIds);
    },
    deleteAjax: function (conferenceRoomIds) {
        $.ajax({
            url: getContextPath() +"/conferenceRoom/delete",
            type: "post",
            data: {
                conferenceRoomIds: conferenceRoomIds
            },
            dataType: "json",
            traditional: true,
            success: function (result) {
                if (result.ret == 1) {
                    alertPromptMsgDlg(result.message, 1, conferenceroom.returnMain);
                } else {
                    alertPromptMsgDlg(result.message, 3);
                }
            }
        });
    },
    checkAll: function (e) {
        var checked = $(e).prop('checked');
        $('#m-crm-table').find("input[id^='conferenceRoomCheck_']").each(function () {
            $(this).prop('checked', checked);
        });
    },
    search: function () {

    },
    showDate: function (timestamp) {
        var d = new Date(timestamp);
        return d.toLocaleDateString();
    },
    toggleShowEquip:function(ele,event){
        var e = window.event || event;
        var x = e.clientX - 110/2;
        var y = e.clientY + 12;
        var devices = $(ele).data('devices').split(';');
        if(devices&&devices.length>0){
            var html = "";
            $.each(devices,function(i,item){
                if($.trim(item)){
                    html+="<tr><td>"+ $.trim(item)+"</td></tr>";
                }
            })
            if(html){
                $('#m-crm-equip').find('tbody').html(html);
                $('#m-crm-equip .modal-dialog').css({"top":y + 'px',"left":x + 'px'});
                $('#m-crm-equip').modal('show');
                $('body').find('.modal-backdrop').css('opacity',0);
            }
        }
    }
};