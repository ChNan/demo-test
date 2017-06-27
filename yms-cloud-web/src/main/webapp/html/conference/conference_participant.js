var conplan_participantselect = {
	staffModel:null,
	init:function(){
		$.ajax({
            async: false,
            type: "post",
            dataType: "json",
            url: getContextPath() + "/staff/search",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "pageNo": 1, "pageSize": Math.pow(2, 31) - 1, //查询的size
                "orderByField": "namePinyin", "orderByType": 1
            }),
            success: function (result) { //请求成功后处理函数。此处的data是JSON对象
                if (result.ret == 1) {
                	conplan_participantselect.staffModel = result.rows.records;
                } else {
                    alertPromptMsgDlg(result.message,3);
                }
            }
        });
	},
    setting: {
        view: {
            selectedMulti: false
        },
        check: {
            enable: false,
            autoCheckTrigger: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        callback: {
        	onCheck: function (event, treeId, treeNode) {
                conplan_participantselect.checkNodes(treeNode, treeId);
                return true;
            },
            onClick: function (e, treeId, node) {
            	var search_div = $('#' + treeId).parents('.modal').find('#search_staff_div');
                $(search_div).find('input').val("");
                $(search_div).find('#result_ul').html("");
                $(search_div).find('#result_div').hide();
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                //zTree.checkNode(node, true, true, true);
                /*if (!node['email']) {
                	alertPromptMsgDlg("该成员未绑定邮箱，添加不成功", 3, null);
                	return;
                }*/
                conplan_participantselect.addNode(node, treeId);
            }
        }
    },
    //主键ID
    keyId: "id",
    keyName: "name",
    keyType: "type",
    keyEmail: "email",
    keyOriginalName: "originalName",
    keyInternalType: "Internal",
    keyExternalType: "External",
    participantTreeId: "participant_staff_list_ul",
    presenterTreeId: "presenter_staff_list_ul",
    checkNodes: function (treeNode, treeId) {  //增加所有节点
        if (treeNode.checked) {
            if (!treeNode['email'] && treeNode['extra'] == 'NC') {//只有普通会议才是必须要邮箱
                alertPromptMsgDlg($.i18n.prop('conference.js.bindfail'), 2, null);
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                zTree.checkNode(treeNode, false, true, true);
                return;
            }
            conplan_participantselect.addNode(treeNode, treeId);
        } else {
            conplan_participantselect.removeNode(treeNode, treeId);
        }
    },
    bindingEvent: function (modalId, treeId, selectInput, staffDiv, mainPageId) {
        conplan_participantselect.confirmSave(modalId, treeId, selectInput, staffDiv, mainPageId);
        conplan_participantselect.bindingSearchStaffNode(modalId, treeId);
    },
    deleteStaff: function (keyIdVal, treeId, type, e) {  //删除操作
    	var zTree = $.fn.zTree.getZTreeObj(treeId);
    	$(e).parent().parent().remove();
    	var modal =$('#' + treeId).parents('.modal');
    	var count = $(modal).find('#selected_staff li').length;
        if(count>0){
        	$(modal).find('#select_count').text("("+count+")"+$.i18n.prop('conference.js.count'));
        }
        else{
        	$(modal).find('#select_count').text("");
        }
        /*if (type == conplan_participantselect.keyEmail) {
            $(e).parent().parent().remove();
        } else {
            var nodes = zTree.getNodesByParam(conplan_participantselect.keyId, keyIdVal, null);
            var nodeFirst = nodes[0];
            zTree.checkNode(nodeFirst, false, true, true);
        }*/
    },
    confirmSave: function (modalId, treeId, selectInput, staffDiv, mainPageId) {
        $("#" + modalId + " #confirmSelectStaff").off("mouseup").on("mouseup",function () {
            var nodes = $('#' + modalId).find("#selected_staff li");
            var userNames=new Array();
            $.each(nodes, function () {
            	userNames.push( $(this).attr('username'));
            });
            nodes.remove();
            if(userNames.length>0){
	            var param={"confEntity":conf_ctrl.confInfo.confEntity};
	            var url=getContextPath() + "/conferencectrl/invite";
	            for(var i=0;i<userNames.length;i++){
	            	param.invitee=userNames[i];
	            	sendCmd(url, param);
	            }
            }
            else{
            	alertPromptMsgDlg($.i18n.prop('conference.js.uninvite'), 3);
            }
        });
    },
    removeItem: function (e, id, selectInput) {
        $(e).parent().remove();
        var selectInputObj = $('#' + selectInput);
        if ($(selectInputObj).val()) {
            var participantsArray = $(selectInputObj).val().split(';');
            var participantMailArray = $("#selectParticipantMails").val().split(';');
            var relStaffId = "";
            var relMail = "";
            for (i in participantsArray) {
                if (participantsArray.hasOwnProperty(i) && participantsArray[i] && participantsArray[i] != id) {
                    relStaffId = relStaffId + participantsArray[i] + ";";
                    relMail += ";" + participantMailArray[i];
                }
            }
            $(selectInputObj).val(relStaffId);
            $("#selectParticipantMails").val(relMail.substr(1))
        }
    },
    //获取根节点
    getRoots: function (treeId) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        //返回根节点集合
        var nodes = zTree.getNodesByFilter(function (node) {
            return node.level == 0
        });
        return nodes
    },
    //增加节点

    addNode: function (treeNode, treeId) {
        if (!conplan_participantselect.isHaveAdd(treeNode, treeId)) {
            var ret = {
                "treeId": treeId, "id": treeNode[conplan_participantselect.keyId], "nameWithEmail": treeNode[conplan_participantselect.keyName]
                , "name": treeNode[conplan_participantselect.keyOriginalName]
                , "email": treeNode[conplan_participantselect.keyEmail], "isCreator": treeNode['isCreator'],
                "username":treeNode['accountUsername']
            };
            var modal =$('#' + treeId).parents('.modal')
            $(modal).find('#selected_staff').append(template("selected_staff_li", ret));
            var count = $(modal).find('#selected_staff li').length;
            $(modal).find('#select_count').text("("+count+")"+$.i18n.prop('conference.js.count'));
        }
    },
    removeNode: function (treeNode, treeId) {
        //if (conplan_participantselect.isHaveAdd(treeNode, treeId)) {
            var modal =$('#' + treeId).parents('.modal');
            $(modal).find("#selected_staff li[id='" + treeNode[conplan_participantselect.keyId] + "']").remove();
            var count = $(modal).find('#selected_staff li').length;
            if(count>0){
            	$(modal).find('#select_count').text("("+count+")"+$.i18n.prop('conference.js.count'));
            }
            else{
            	$(modal).find('#select_count').text("");
            }
        //}
    },
    addExternalStaff: function (modalId) {
        var isHaveAdd = false;
        var email = $("#external_email input[name='email']").val();
        var nodes = $('#' + modalId).find("#selected_staff li");
        $(nodes).each(function (index, element) {
            if ($(element).attr("id") == email) {
                isHaveAdd = true;
            }
        })
        if (!isHaveAdd) {
            if (!validateutil.valid({contextId: "external_email", nodes: [{name: "email", method: 'require,email'}]})) {
                return;
            }
            var ret = {"id": email, "nameWithEmail": email, "type": "email"};
            $('#add_participant_modal').find('#selected_staff').append(template("selected_staff_li", ret));
            validateutil.clearCurrentNodeErrorMsg('external_email');
        }

    },
    //是否右边有相同的节点
    isHaveAdd: function (treeNode, treeId) {
        var isHaveAdd = false;
        var nodes = $('#' + treeId).parents('.modal').find("#selected_staff li");
        $(nodes).each(function (index, element) {
            if ($(element).attr('id') == treeNode[conplan_participantselect.keyId]) {
                isHaveAdd = true;
            }
        })
        return isHaveAdd;
    },
    initStaffTree: function (treeId, selectInputId) {
        var selectedParticipantsStr = $('#' + selectInputId).val().split(';');
        for (i in selectedParticipantsStr) {
            if (selectedParticipantsStr.hasOwnProperty(i) && selectedParticipantsStr[i]) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                var nodes = zTree.getNodesByParam(conplan_participantselect.keyId, selectedParticipantsStr[i], null);
                var nodeFirst = nodes[0];
                conplan_participantselect.addNode(nodeFirst,treeId)
            }
        }
    },
    showStaffListModal: function (modalId, treeId, selectInput, staffDiv, mainPageId) {
        var staffNodes = [];
        var page = 1;
        $("#"+modalId).find('#select_count').text("");
        var data = conplan_participantselect.staffModel;
        jQuery.each(data, function (i, item) {
        	var exists=conf_ctrl.participantModel.getParticipantIds();
        	var idToFind=","+item.staff._id+",";
        	//if(exists.indexOf(idToFind)<0){//如果没在会议里，可以作为备选对象。
                var email = item.staff.email ? item.staff.email : $.i18n.prop('conference.js.unbindemail');
                if(item.sipAccount){
                    staffNodes.push(new staffAccountSearch.StaffAccountNode(item.staff._id, item.staff.name + "(" + email + ")",
                        item.staff.namePinyin, item.staff.namePinyinAlia, item.sipAccount.username, null, treeId, item.staff.email, item.staff.name, "../../img/conference/internal_staff.png"
                    ));
            	}
            //}
        });
        $.fn.zTree.init($("#" + treeId), conplan_participantselect.setting, staffNodes);
        $("#" + modalId + " #selected_staff").empty();
        conplan_participantselect.initStaffTree(treeId, selectInput);
        conplan_participantselect.bindingEvent(modalId, treeId, selectInput, staffDiv, mainPageId);
        $("#" + modalId).modal("show");
    },
    bindingSearchStaffNode: function (modalId, treeId) {
        $("#" + modalId + ' #search_staff').autocomplete({
            multiple: true,
            source:function(query,process){
                this.options.items = 1000;//允许返回结果集最大数量
                $.ajax({
                    url: getContextPath() + "/staff/autoComplete",
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
                return {"data-value":item["name"], "real-value":item["id"], "username":item["username"]};
            },
            updater: function (item) {
                var selectId = $("#" + modalId + " .typeahead.dropdown-menu").find(".active").attr("real-value");
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                var node = zTree.getNodeByParam("id", selectId);
                conplan_participantselect.addNode(node, treeId);
            }
        });

        var searchbox = $("#" + modalId + ' #search_staff').siblings("span.searchbox-icon");
        if(!searchbox) {
            return;
        }
        searchbox.off("click").on("click", function (event) {
            $("#" + modalId + ' #search_staff').focus();
            $("#" + modalId + ' #search_staff').autocomplete("lookup");
        });
    },
    scrollStaffList: function (page, staffNodes, modalId, treeId) {
        $('#' + modalId + ' #staff_list_container').scroll(function () {
            /*判断窗体高度与竖向滚动位移大小相加 是否 超过内容页高度*/
            var _this = this;
            if (($(_this).height() + $(_this).scrollTop()) >= $('#' + treeId).height()) { //滚到最底部加载
                $.ajax({
                    url: getContextPath() + "/staff/search",
                    type: "post",
                    async: true,
                    data: JSON.stringify({
                        "pageNo": ++page, "pageSize": Math.pow(2, 8) - 1,
                        "orderByField": "creationDate", "orderByType": 1
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (ret) {
                        var data = ret.rows.records;
                        jQuery.each(data, function (i, item) {
                            staffNodes.push(new staffAccountSearch.StaffAccountNode(item.staff._id, item.staff.name,
                                item.staff.namePinyin, item.staff.namePinyinAlia, item.sipAccount.username, treeId
                            ));
                        });
                        $.fn.zTree.init($("#" + treeId), conplan_participantselect.setting, staffNodes);
                        $(_this).scrollTop = $(_this).scrollTop() * page
                    }
                });
            }
        });
    }
}

