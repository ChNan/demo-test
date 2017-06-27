var conplan_participantselect = {
    setting: {
        view: {
            selectedMulti: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        callback: {
            onClick: function (e, treeId, node) {
                var search_div = $('#' + treeId).parents('.modal').find('#search_staff_div');
                $(search_div).find('#result_ul').html("");
                $(search_div).find('#result_div').hide();

                /*if (!node['email'] && node['extra'] == 'NC') {//只有普通会议才是必须要邮箱
                    alertPromptMsgDlg($.i18n.prop("conferecenplan.js.unbind.mail.cannot.add"), 2, null);
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
    keyPermission: "permission",
    keyAttendee: "attendee",
    keyPresenter: "presenter",
    participantTreeId: "participant_staff_list_ul",
    presenterTreeId: "presenter_staff_list_ul",
    bindingConfirmSaveParticipant: function (modalId, treeId, selectInput, staffDiv, mainPageId,creatorId) {
        $("#" + modalId + " #confirmSelectStaff").off('click').on('click', function () {
            var presenterContentDiv = 'presenter_content';
            var selectPresenterInput ='selectPresenterIds';

            var existSelectParticipantIds = $('#'+selectInput).val()
            var nodes = $('#' + modalId).find("#selected_staff div[type!='email']");
            var html = "";
            var relStaffId = "";
            var mails = "";
            $(nodes).each(function () {
                relStaffId = relStaffId + $(this).attr(conplan_participantselect.keyId) + ";";
                var attendeeObj = {
                    "id": $(this).attr(conplan_participantselect.keyId), "name": $(this).attr('name'),
                    "email": $(this).attr('email'), "selectInput": selectInput, "creatorId": creatorId,"type":"internal",
                    "otherContent":presenterContentDiv,"otherSelectInput":selectPresenterInput
                };
                html += template('attendee_temp', attendeeObj);
                mails += ";" + $(this).attr('email');
            });
            $("#" + selectInput).val(relStaffId);
            $("#" + selectInput.replace("Ids", "Mails")).val(mails.substr(1));

            var selectExternalEmailObj = $('#selectExternalParticipantIds');
            var emailOpts = $("#" + modalId + " #selected_staff").find("div[type='email']");
            var relEmail = "";
            $(emailOpts).each(function () {
                relEmail += ";" + $(this).attr('id');
                var attendeeObj = {"id": $(this).attr('id'), "name": $(this).attr('id'),
                    "selectInput": 'selectExternalParticipantIds',"type":"external"};
                html += template('attendee_temp', attendeeObj);
            })
            $(selectExternalEmailObj).val(relEmail.substr(1));

            $("#" + mainPageId + " #" + staffDiv).html(html);

            var removePresenterIds =  Array.minus(existSelectParticipantIds.split(';'),relStaffId.split(';')); // 操作之前的人员，操作之后的人员，取差集，就是被移除的人员

            $.each(removePresenterIds,function(i,item){
                if(item){
                    var presenterBtnDom = $('#'+presenterContentDiv).find('button[btnid="attendee_'+item+'"]');
                    conplan_participantselect.removeItem(presenterBtnDom,item,selectPresenterInput)
                }
            })
        })
    },
    deleteStaff: function (keyIdVal, treeId, type, e) {  //弹出框右边红色×的操作
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        if (type == conplan_participantselect.keyEmail) {
            $(e).parent().remove();
            var modal =$('#' + treeId).parents('.modal');
            var count = $(modal).find('#selected_staff div').length;
            $(modal).find('#select_count').text($(modal).find('#select_count').attr('content').replace('%',count));
        } else {
            var nodes = zTree.getNodesByParam(conplan_participantselect.keyId, keyIdVal, null);
            var nodeFirst = nodes[0];
            conplan_participantselect.removeNode(nodeFirst, treeId);
        }
    },
    removeItem: function (e, id, selectInput,otherContentDivId,otherSelectInput) {
        $(e).parent().remove();
        conplan_participantselect.reLoadIdMail(id, selectInput);
        if(otherContentDivId){
            var otherBtnDom = $('#'+otherContentDivId).find('button[btnid="attendee_'+id+'"]');
            conplan_participantselect.removeItem(otherBtnDom,id,otherSelectInput)
        }
    },
    reLoadIdMail:function(id, selectInput){
        var selectInputObj = $('#' + selectInput);
        if ($(selectInputObj).val()) {
            var itemArray = $(selectInputObj).val().split(';');
            var participantMailArray = $("#" + selectInput.replace("Ids", "Mails")).val().split(';');
            var resultIds = "";
            var relMail = "";
            for (i in itemArray) {
                if (itemArray.hasOwnProperty(i) && itemArray[i] && itemArray[i] != id) {
                    resultIds = resultIds + itemArray[i] + ";";
                    relMail += ";" + participantMailArray[i];
                }
            }
            $(selectInputObj).val(resultIds);
            $("#" + selectInput.replace("Ids", "Mails")).val(relMail.substr(1))
        }
    },
    removeRoom: function (e, id, selectInput) {
        $(e).parent().remove();
        var selectInputObj = $('#' + selectInput);
        if ($(selectInputObj).val()) {
            var itemArray = $(selectInputObj).val().split(';');
            var resultIds = "";
            for (i in itemArray) {
                if (itemArray.hasOwnProperty(i) && itemArray[i] && itemArray[i] != id) {
                    resultIds = resultIds + itemArray[i] + ";";
                }
            }
            $(selectInputObj).val(resultIds);
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
                "treeId": treeId, "id": treeNode[conplan_participantselect.keyId],
                "nameWithEmail": treeNode[conplan_participantselect.keyName],
                "name": treeNode[conplan_participantselect.keyOriginalName],
                "email": treeNode[conplan_participantselect.keyEmail], "isCreator": treeNode['isCreator']
            };
            var modal =$('#' + treeId).parents('.modal')
            $(modal).find('#selected_staff').append(template("selected_staff_li", ret));
            var count = $(modal).find('#selected_staff div').length;
            $(modal).find('#select_count').text($(modal).find('#select_count').attr('content').replace('%',count));
            //去除有相同邮箱的外部人员
            $(modal).find("#selected_staff div").each(function (index, element) {
                if ($(element).attr("id") == treeNode[conplan_participantselect.keyEmail]) {
                    $(element).find("span:last-child").click();
                }
            });
        }
    },
    /**
     * 外部人员邮箱输入框内容改变时
     * @param iptNode
     */
    externalEmailIptChanged: function (iptNode) {
        if($(iptNode).val()) {
          $(iptNode).next("button.close").show();
        }else {
            $(iptNode).next("button.close").hide();
            validateutil.clearCurrentNodeErrorMsg('external_email');
        }
    },
    /**
     * 清除外部人员邮箱输入框
     * @param btnNode
     */
    clearExternalEmailIpt: function (btnNode) {
        $("#add_participant_modal input[name='email']").val("");
        validateutil.clearCurrentNodeErrorMsg('external_email');
        $(btnNode).hide();
    },
    addExternalStaff: function (modalId) { //只有参会者才能选择邮箱。
        var emailInput = $('#external_email').find('input[name="email"]');
        if (!validate.method.require($(emailInput))) {
            validateutil.defaultErrorFmter($(emailInput), $.i18n.prop("conferenceplan.js.mail.canot.empty"));
            return;
        } else if (!validate.method.email($(emailInput))) {
            validateutil.defaultErrorFmter($(emailInput), $.i18n.prop("conferenceplan.js.mail.invalid"));
            return;
        } else {
            validateutil.clearCurrentNodeErrorMsg($(emailInput).attr('id'));
        }
        var isHaveAdd = false;
        var email = $("#external_email input[name='email']").val();
        var nodes = $('#' + modalId).find("#selected_staff div");
        $(nodes).each(function (index, element) {
            if ($(element).attr("id") == email || $(element).attr("email") == email) {
                isHaveAdd = true;
            }
        });
        if(isHaveAdd) {
            validateutil.defaultErrorFmter($("#external_email input[name='email']"), $.i18n.prop("conferenceplan.js.mail.has.add"));
            return;
        }
        var ret = {
            "id": email,
            "nameWithEmail": email,
            "type": "email",
            "treeId":"participant_staff_list_ul"};
        var modal =$('#add_participant_modal');
        $(modal).find('#selected_staff').append(template("selected_staff_li", ret));
        var count = $(modal).find('#selected_staff div').length;
        $(modal).find('#select_count').text($(modal).find('#select_count').attr('content').replace('%',count));

        validateutil.clearCurrentNodeErrorMsg('external_email');
        $("#add_participant_modal input[name='email']").val("");
        $("#add_participant_modal input[name='email']").next("button.close").hide();
    },
    //是否右边有相同的节点
    isHaveAdd: function (treeNode, treeId) {
        var isHaveAdd = false;
        var nodes = $('#' + treeId).parents('.modal').find("#selected_staff div");
        $(nodes).each(function (index, element) {
            if ($(element).attr('id') == treeNode[conplan_participantselect.keyId]) {
                isHaveAdd = true;
            }
        })
        return isHaveAdd;
    },
    initStaffTree: function (treeId, selectInputId, modalId, creatorId) {
        var selectedParticipantsStr = $('#' + selectInputId).val().split(';');
        for (i in selectedParticipantsStr) {
            if (selectedParticipantsStr.hasOwnProperty(i) && selectedParticipantsStr[i]) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                var nodes = zTree.getNodesByParam(conplan_participantselect.keyId, selectedParticipantsStr[i], null);
                var nodeFirst = nodes[0];
                if (nodeFirst != null && nodeFirst != undefined) {
                    conplan_participantselect.addNode(nodeFirst, treeId);
                }
            }
        }
        var modal =$('#' + treeId).parents('.modal');
        var count = $(modal).find('#selected_staff div').length;
        $(modal).find('#select_count').text($(modal).find('#select_count').attr('content').replace('%',count));
    },
    showStaffListModal: function (modalId, treeId, selectInput, staffDiv, mainPageId, type, creatorId) {
        var staffNodes = [];
        $.ajax({
            async: false,
            type: "get",
            dataType: "json",
            url: getContextPath() + "/staff/cache/all",
            contentType: "application/json; charset=utf-8",
            success: function (result) { //请求成功后处理函数。此处的data是JSON对象
                if (result.ret == 1) {
                    var data = result.rows;
                    if (data && data.length > 0) {
                        jQuery.each(data, function (i, item) {
                            var email = item.email ? "" : "(" + $.i18n.prop("conference.js.unbindemail") + ")";
                            staffNodes.push(new staffAccountSearch.StaffAccountNode(item._id, item.name + email,
                                item.namePinyin, item.namePinyinAlia, null, null, treeId, item.email,
                                item.name, "img/conference/internal_staff.png", type, creatorId == item._id
                            ));
                        });
                    }
                    return staffNodes;
                } else {
                    alertPromptMsgDlg(result.message, 3);
                }
            }
        });
        return staffNodes;
    },
    /**
     * 初始化参会者的弹出框
     * 添加参会者，不会添加主持人
     * 移除参会者，如果该参会者在主持人中存在，也会移除主持人
     * 参会者弹出框中点击保存参会者，如果删除了之前在主持人中存在的人，就会删除主持人
     * */
    initParticipant:function(modalId, treeId, selectInput, staffDiv, mainPageId, type, creatorId){
        $("#" + modalId + " #selected_staff").empty();
        conplan_participantselect.initStaffTree(treeId, selectInput, modalId, creatorId);
        conplan_participantselect.bindingConfirmSaveParticipant(modalId, treeId, selectInput, staffDiv, mainPageId,creatorId);
        conplan_participantselect.bindingSearchStaffNode(modalId, treeId);
    },
     /**
     * 初始化主持人的弹出框
     * 添加主持人，默认添加参会者
     * 移除主持人，如果该主持人在参会者中存在，也会移除参会者
     * 主持人弹出框中点击保存主持人，如果删除了之前在参会者中存在的人，就会删除参会者
     * */
    initPresenter:function(modalId, treeId, selectInput, staffDiv, mainPageId, type, creatorId){
        $("#" + modalId + " #selected_staff").empty();
        conplan_participantselect.initStaffTree(treeId, selectInput, modalId, creatorId);
        conplan_participantselect.bindingConfirmSavePresenter(modalId, selectInput, creatorId, staffDiv, mainPageId);
        conplan_participantselect.bindingSearchStaffNode(modalId, treeId);
    },
    bindingConfirmSavePresenter: function (modalId, selectInput, creatorId, staffDiv, mainPageId) {
        $("#" + modalId + " #confirmSelectStaff").off('click').on('click', function () {
            var selectParticipantInput = 'selectParticipantIds';
            var participantContentDiv = 'participant_content';
            var existSelectParticipantIds = $('#selectParticipantIds').val();
            var existSelectParticipantMails = $('#selectParticipantMails').val();

            var existSelectPresenterIds = $('#' + selectInput).val();

            var nodes = $('#' + modalId).find("#selected_staff div[type!='email']");
            var presenterHtml = "";
            var participantHtml = "";
            var relPresenterStaffId = "";
            var presenterMails = "";
            var relParticipantStaffId = "";
            var participantMails = "";
            $(nodes).each(function () {
                relPresenterStaffId = relPresenterStaffId + $(this).attr(conplan_participantselect.keyId) + ";";
                var presenterAttendeeObj = {
                    "id": $(this).attr(conplan_participantselect.keyId), "name": $(this).attr('name'),
                    "email": $(this).attr('email'), "selectInput": selectInput, "creatorId": creatorId, "type": "internal",
                    "otherContent": participantContentDiv, "otherSelectInput": selectParticipantInput
                };
                presenterHtml += template('attendee_temp', presenterAttendeeObj);
                presenterMails += ";" + $(this).attr('email');

                if (existSelectParticipantIds.indexOf($(this).attr(conplan_participantselect.keyId)) < 0) { //如果之前不存在
                    var participantAttendeeObj = {
                        "id": $(this).attr(conplan_participantselect.keyId), "name": $(this).attr('name'),
                        "email": $(this).attr('email'), "selectInput": selectParticipantInput, "creatorId": creatorId, "type": "internal",
                        "otherContent": staffDiv, "otherSelectInput": selectInput
                    };
                    participantHtml += template('attendee_temp', participantAttendeeObj);
                    relParticipantStaffId += $(this).attr(conplan_participantselect.keyId) + ";";
                    participantMails += ";" + $(this).attr('email');
                }
            });
            $("#" + selectInput).val(relPresenterStaffId);
            $("#" + selectInput.replace("Ids", "Mails")).val(presenterMails.substr(1));
            $("#" + mainPageId + " #" + staffDiv).html(presenterHtml);

            $("#" + selectParticipantInput).val(existSelectParticipantIds + ";" + relParticipantStaffId);
            $("#" + selectParticipantInput.replace("Ids", "Mails")).val(existSelectParticipantMails + ";" + participantMails.substr(1));
            $("#" + mainPageId + " #" + participantContentDiv).append(participantHtml);

            var removePresenterIds = Array.minus(existSelectPresenterIds.split(';'), relPresenterStaffId.split(';')); // 操作之前的人员，操作之后的人员，取差集，就是被移除的人员

            $.each(removePresenterIds, function (i, item) {
                if (item) {
                    var participantBtnDom = $('#' + participantContentDiv).find('button[btnid="attendee_' + item + '"]');
                    conplan_participantselect.removeItem(participantBtnDom, item, selectParticipantInput)
                }
            });
        })
    },
    removeNode: function (treeNode, treeId) {
        if (conplan_participantselect.isHaveAdd(treeNode, treeId)) {
            var modal =$('#' + treeId).parents('.modal');
            $(modal).find("#selected_staff div[id='" + treeNode[conplan_participantselect.keyId] + "']").remove();
            var count = $(modal).find('#selected_staff div').length;
            $(modal).find('#select_count').text($(modal).find('#select_count').attr('content').replace('%',count));
        }
    },
    bindingSearchStaffNode: function (modalId, treeId) {
        $("#" + modalId + ' #search_staff').autocomplete({
            multiple: true,
            source: function (query, process) {
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
            formatItem: function (item) {
                return item["name"] + "(" + item["username"] + ")";
            },
            setValue: function (item) {
                return {"data-value": item["name"], "real-value": item["id"]};
            },
            updater: function (item) {
                var selectId = $("#" + modalId + " .typeahead.dropdown-menu").find(".active").attr("real-value");
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                var node = zTree.getNodeByParam("id", selectId);
               /* if (!node['email'] && node['extra'] == 'NC') {//只有普通会议才是必须要邮箱
                    alertPromptMsgDlg($.i18n.prop("conferecenplan.js.unbind.mail.cannot.add"), 2, null);
                    return;
                }*/
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
/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}
/**
 * each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
 * 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
 {%example
 <script>
      var a = [1,2,3,4].each(function(x){return x > 2 ? x : null});
      var b = [1,2,3,4].each(function(x){return x < 0 ? x : null});
      alert(a);
      alert(b);
 </script>
 %}
 * @param {Function} fn 进行迭代判定的函数
 * @param more ... 零个或多个可选的用户自定义参数
 * @returns {Array} 结果集，如果没有结果，返回空集
 */
Array.prototype.each = function(fn){
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < this.length; i++){
        var res = fn.apply(this,[this[i],i].concat(args));
        if(res != null) a.push(res);
    }
    return a;
};

/**
 * 得到一个数组不重复的元素集合<br/>
 * 唯一化一个数组
 * @returns {Array} 由不重复元素构成的数组
 */
Array.prototype.uniquelize = function(){
    var ra = [];
    for(var i = 0; i < this.length; i ++){
        if (ra.length == 0 || !ra.contains(this[i])) {
            ra.push(this[i]);
        }
    }
    return ra;
};

/**
 * 求两个集合的补集
 {%example
 <script>
      var a = [1,2,3,4];
      var b = [3,4,5,6];
      alert(Array.complement(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的补集
 */
Array.complement = function(a, b){
    return Array.minus(Array.union(a, b),Array.intersect(a, b));
};

/**
 * 求两个集合的交集
 {%example
 <script>
      var a = [1,2,3,4];
      var b = [3,4,5,6];
      alert(Array.intersect(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的交集
 */
Array.intersect = function(a, b){
    return a.uniquelize().each(function(o){return b.contains(o) ? o : null});
};

/**
 * 求两个集合的差集
 {%example
 <script>
      var a = [1,2,3,4];
      var b = [3,4,5,6];
      alert(Array.minus(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的差集
 */
Array.minus = function(a, b){
    return a.uniquelize().each(function(o){return b.contains(o) ? null : o});
};

/**
 * 求两个集合的并集
 {%example
 <script>
      var a = [1,2,3,4];
      var b = [3,4,5,6];
      alert(Array.union(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的并集
 */
Array.union = function(a, b){
    return a.concat(b).uniquelize();
};

