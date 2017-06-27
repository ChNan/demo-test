var netsettingwizard = {
    netCardsMap : {},
    ENTER_TYPE_BY_NETCARD : 1, //从外网还是内网访问该页面，0-内外网没配置 1-内网 2-外网 3-nat地址
    init: function () {
        var type = 'basicConfig';
        this.loadData(type);
        this.tabEvent[type]();
        // 添加验证方法
        this.addValidateMethod();

        $('#domainName').blur(function(e){
            netsettingwizard.clearErrorInfoNocondi();
        });
        $('#intranet').click(function(e){
            netsettingwizard.clearErrorInfoNocondi();
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');

        });
        $('#extranet').click(function(e){
            netsettingwizard.clearErrorInfoNocondi();
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');
        });

    },
    clearErrorInfo:function(){
        if (!$('#intranet').prop('checked')
            && !$('#extranet').prop('checked')
            && $.trim($('#domainName').val())=='') {
            $("span[id$='-error']").remove();
            $('.has-error').each(function(){
                $(this).removeClass('has-error');
            });
            $('#intranetSettingDiv').find('span').remove();
        }
    },
    clearErrorInfoNocondi:function(){
        $("span[id$='-error']").remove();
        $('.has-error').each(function(){
            $(this).removeClass('has-error');
        });
        $('#intranetSettingDiv').find('span').remove();
    },
    loadData: function (type) {
        var dataUrl = $('#projectContext').val()+'/netsetting/wizard/query';
        $.post(dataUrl, {type: type}, function (result) {
            if (result && result.ret >= 0) {
                netsettingwizard[type](result.rows);
            } else {
                //载入数据失败!请重新刷新页面!
                alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.loadfail'),3);
            }
        });
    },
    tabEvent:{
        basicConfig: function () {
            //初始化路由设置
            netsettingwizard.initRoterTable();

            $('#form1 input[name="intIpMethod"]').off('change').on('change', function () {
                if ($(this).attr('tp') == '1') {
                    $('.m-ns-intranetSetting').show();
                } else {
                    $('.m-ns-intranetSetting').hide();
                }
            })

            $('#form1 input[name="extIpMethod"]').off('change').on('change', function () {
                if ($(this).attr('tp') == '1') {
                    $('.m-ns-extranetSetting').show();
                } else {
                    $('.m-ns-extranetSetting').hide();
                }
            })

            $('#form1 input[name="intranet"]').off('change').on('change', function () {
                if($(this).prop('checked')){
                    $('.m-ns-intranet').show();
                }else{
                    $('.m-ns-intranet').hide();
                }
                //路由设置
                netsettingwizard.showOrHideRouter();
            })
            $('#form1 input[name="extranet"]').off('change').on('change', function () {
                if($(this).prop('checked')){
                    $('.m-ns-extranet').show();
                }else{
                    $('.m-ns-extranet').hide();
                }
                //路由设置
                netsettingwizard.showOrHideRouter();
            })

            $('#form1 input[name="nat"]').off('change').on('change', function () {
                if($(this).prop('checked')){
                    $('.m-ns-natSetting').show();
                }else{
                    $('.m-ns-natSetting').hide();
                }
            });

            //增加网关输入和路由联动
            netsettingwizard.gatewayLink();
            // 控制IP输入框
            ctlIpInput();
            //初始化验证信息
            netsettingwizard.ROUTER_VALIDATE_MESSAGES = {
                routeIpAddr: {
                    checkRequiredSpecial : $.i18n.prop('netsetting.js.valid.required'),
                    checkIp : $.i18n.prop('netsetting.js.invalidate'),
                    checkRouteIPAddrNotTheSame : $.i18n.prop('wizard.js.netsetting.ip.notsame'),
                    checkIpAndMaskSameZero : $.i18n.prop('wizard.js.netsetting.defaultrouter.format')
                },
                routeNetMask: {
                    checkRequiredSpecial : $.i18n.prop('netsetting.js.valid.required'),
                    checkMaskRequired : $.i18n.prop('netsetting.js.invalidate'),
                    checkIpAndMaskSameZero : $.i18n.prop('wizard.js.netsetting.defaultrouter.format')
                },
                routeGateWay: {
                    checkIpNoRequired : $.i18n.prop('wizard.js.netsetting.formaterror')
                }
            }
        }
    },
    basicConfig: function (retData) {

        // 清除下错误信息
        netsettingwizard.clearErrorInfoNocondi();

        var netCards = retData.netCards;
        if(netCards){
            var ncs = JSON.parse(netCards);
            var i = 0;
            $("#form1 [name='intranetCard']").empty();
            $("#form1 [name='extranetCard']").empty();
            var nets = ncs.nets;
            for(;i<nets.length;i++){
                if(nets[i].status == '1' ){
                    $("#form1 [name='intranetCard']").append('<option value="'+nets[i].index+'">'+nets[i].name+'</option>');
                    $("#form1 [name='extranetCard']").append('<option value="'+nets[i].index+'">'+nets[i].name+'</option>');
                    netsettingwizard.netCardsMap[nets[i].index] = nets[i];
                }
            }
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").off('change').on('change',function(){
                var val = $(this).val();
                var name = $(this).attr('name');
                if(name =='intranetCard'){
                    $("#form1 [name='intIpMethod']").trigger('click');
                    if(netsettingwizard.netCardsMap[val] != null){
                        $("#form1 .m-ns-intranetSetting [name='ipAddress']").val(netsettingwizard.netCardsMap[val].ip);
                        $("#form1 .m-ns-intranetSetting [name='subnetMask']").val(netsettingwizard.netCardsMap[val].mask);
                        $("#form1 .m-ns-intranetSetting [name='gateway']").val(netsettingwizard.netCardsMap[val].gateway);
                        $("#form1 .m-ns-intranetSetting [name='preferredDNS']").val(netsettingwizard.netCardsMap[val].dns1);
                        $("#form1 .m-ns-intranetSetting [name='alternativeDNS']").val(netsettingwizard.netCardsMap[val].dns2);
                    }
                }else if(name == 'extranetCard'){
                    $("#form1 [name='extIpMethod']").trigger('click');
                    if(netsettingwizard.netCardsMap[val] != null){
                        $("#form1 .m-ns-extranetSetting [name='ipAddress1']").val(netsettingwizard.netCardsMap[val].ip);
                        $("#form1 .m-ns-extranetSetting [name='subnetMask1']").val(netsettingwizard.netCardsMap[val].mask);
                        $("#form1 .m-ns-extranetSetting [name='gateway1']").val(netsettingwizard.netCardsMap[val].gateway);
                        $("#form1 .m-ns-extranetSetting [name='preferredDNS1']").val(netsettingwizard.netCardsMap[val].dns1);
                        $("#form1 .m-ns-extranetSetting [name='alternativeDNS1']").val(netsettingwizard.netCardsMap[val].dns2);
                    }
                }
            });
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');
        }else{
            //无法读取网卡信息!
            alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.getcarderror'),3);
            return ;
        }

        var dd = retData.data;
        $("#form1 [name='domainName']").val(dd.domainName);
        if(dd.intranet){
            $("#form1 [name='intranet']").prop('checked', true);
            $('#form1 input[name="intranet"]').trigger('change');
            $("#form1 [name='intranetCard']").val(dd.intranetCard);
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');
            $("#form1 [name='intIpMethod']").trigger('click');
        }else{
            // 如果是第一次进入，默认勾选内网
            var wizardStatus = netsettingwizard.getWizardStatus();
            if (wizardStatus == '') {
                $("#form1 [name='intranet']").prop('checked', true);
                $('#form1 input[name="intranet"]').trigger('change');
            } else {
                $("#form1 [name='intranet']").prop('checked', false);
                $('.m-ns-intranet').hide();
            }
        }

        if(dd.extranet){
            $("#form1 [name='extranet']").prop('checked', true);
            $('#form1 input[name="extranet"]').trigger('change');
            $("#form1 [name='extranetCard']").val(dd.extranetCard);
            $("#form1 [name='extIpMethod']").trigger('click');
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');

            if(dd.nat){
                $("#form1 [name='nat']").prop('checked', true);
                $(".m-ns-natSetting").show();
                $("#form1 [name='publicNetAddr']").val(dd.publicNetAddr);
            }else{
                $(".m-ns-natSetting").hide();
            }
        }else{
            $("#form1 [name='extranet']").prop('checked', false);
            $('.m-ns-extranet').hide();
        }

        // 获取进入页面网络类型
        netsettingwizard.ENTER_TYPE_BY_NETCARD = netsettingwizard.getEnterTypeByNetCard();

        //加载路由
        // var routeSetRows = dd.routerSetting;
        var routeSetRows = [];
        var routeConfigs = JSON.parse(netCards).router;
        if (routeConfigs != null && routeConfigs != undefined) {
            // 排序 把默认路由放到最前面
            routeConfigs = netsettingwizard.sortRouteMap(routeConfigs);
            for(var i=0;i<routeConfigs.length;i++) {
                var uniqueID = new Date().getTime()+i;
                var seq = i+1;
                var cardIndex = routeConfigs[i].ifindex;
                var oper = '<a class="no-underline m-ns-route-edit" title="' + $.i18n.prop('wizard.js.netsetting.edit') + '" ' +
                    'onclick="netsettingwizard.editRouterRow('+uniqueID+','+seq+')"'
                    +' href="javascript:void(0);"></a>'
                    +' <a class="no-underline m-ns-route-delete" title="' + $.i18n.prop('wizard.js.netsetting.del') + '" ' +
                    'onclick="netsettingwizard.deleteRouteRow('+uniqueID+')"'
                    +' href="javascript:void(0);"></a>'; // 编辑 删除

                routeSetRows.push({
                    uniqueID : uniqueID,
                    dataSeq: seq,
                    routerIpAddr: routeConfigs[i].dst,
                    routerNetMask: routeConfigs[i].mask,
                    routerGateWay: netsettingwizard.netCardsMap[cardIndex].gateway,
                    routerMetric: netsettingwizard.netCardsMap[cardIndex].name,
                    routerOper: oper,
                    routeNetCardSel : cardIndex
                });
            }
        }
        $('#m-ns-routeset-table').bootstrapTable('load',routeSetRows);
        // 控制路由设置勾选
        netsettingwizard.showOrHideRouter();
    },
    getEnterTypeByNetCard : function(){
        //判断获取进入页面类型
        var enterType = 1;
        var url = window.location.href;
        if (url != null) {
            if ($('#form1 [name="intranet"]').prop('checked') &&
                url.indexOf($("#form1 .m-ns-intranetSetting [name='ipAddress']").val()) != -1) {
                enterType = 1;
            } else if ($('#form1 [name="extranet"]').prop('checked')) {
                if ($('#form1 [name="nat"]').prop('checked') &&
                    url.indexOf($('#form1 [name="publicNetAddr"]').val()) != -1) {
                    enterType = 3;
                } else if (url.indexOf($("#form1 .m-ns-extranetSetting [name='ipAddress1']").val()) != -1) {
                    enterType = 2;
                }
            }
            if (!$('#form1 [name="intranet"]').prop('checked') && !$('#form1 [name="extranet"]').prop('checked')) {
                enterType = 0;
            }
        }
        return enterType;
    },
    sortRouteMap : function(routeConfigs) {
        var sortedRouterList = [];
        for(var i=0; i<routeConfigs.length; i++) {
            if (routeConfigs[i].dst == '0.0.0.0' &&
                routeConfigs[i].mask == '0.0.0.0' &&
                i>0) {
                sortedRouterList[i] =  sortedRouterList[0];
                sortedRouterList[0] = routeConfigs[i];
            } else {
                sortedRouterList[i] =  routeConfigs[i];
            }
        }
        return sortedRouterList;
    },
    getWizardStatus : function() {
        // 同步获取当前向导状态 主要控制第一次进去默认内网勾选设置
        var dataUrl = $('#projectContext').val()+'/wizard/status';
        var status='';
        $.ajax({
            type: "get",
            url: dataUrl,
            async : false,
            success: function (data) {
                if (data.ret >= 0) {
                    status = data.rows;
                }
            }
        });
        return status;
    },
    updateWizardStatus : function() {
        // 更新向导状态为STARTING
        var dataUrl = $('#projectContext').val()+'/wizard/updateStatus';
        var success = true;
        $.ajax({
            type: "get",
            url: dataUrl,
            async : false,
            success: function (data) {
                if (data.ret == -1) {
                    success = false;
                }
            }
        });
        return success;
    },
    save: function (type) {
        // 如果域名 内外网设置都为空直接跳到下一步骤 否则进行验证保存
        //if (!$('#intranet').prop('checked')
        //      && !$('#extranet').prop('checked')
        //      && $.trim($('#domainName').val())=='') {
        //    //下一步骤
        //    netsettingwizard.confirmNextstep();
        //} else {
        var commitData = {type: type};
        var result = netsettingwizard.valid[type]();
        if (result && result.ret) {
            netsettingwizard.commit(type, $.extend({}, commitData, result.retData));
        }
        //}
    },
    // ip地址转换为二进制
    praseIpToBinary:function(ipAddress) {
        var numArray = ipAddress.split(".");
        if(numArray.length != 4) {
            return;
        }
        var returnIpStr = "";
        for (var i = 0; i < 4; i++) {
            var curr_num = numArray[i];
            var number_Bin = parseInt(curr_num);
            number_Bin = number_Bin.toString(2);
            var iCount = 8-number_Bin.length;
            for (var j = 0; j < iCount; j++) {
                number_Bin = "0"+number_Bin;
            }
            returnIpStr += number_Bin;
        }
        return returnIpStr;
    },
    checkMask:function(ip) {
        // 先验证是否是IP
        var checkIp = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/;
        var isIp = checkIp.test(ip);
        if (isIp) {
            var binaryIpString = netsettingwizard.praseIpToBinary(ip).toString();
            var subIndex = binaryIpString.lastIndexOf("1")+1;
            var frontHalf = binaryIpString.substring(0,subIndex);
            var backHalf = binaryIpString.substring(subIndex);
            if(frontHalf.indexOf("0") != -1 || backHalf.indexOf("1") != -1){
                return false;
            }else{
                return true;
            }
        }
        return false;
    },
    addValidateMethod: function() {
        //带有checkbox选择后的端口验证
        $.validator.addMethod("hasCbPortCheck",function(value,element,params){
            // 参数格式为checkbox属性名加 验证值包括最小最大
            var paramArr = params.split(",");
            var checkminValue = parseInt(paramArr[1]);
            var checkmaxValue = parseInt(paramArr[2]);
            var isChecked = $(paramArr[0]).is(":checked");
            if (isChecked) {
                var required = value.length > 0;
                if (!required) {
                    return false;
                }
                var isDigit =  /^\d+$/.test( value );
                if (!isDigit) {
                    return false;
                }
                var valueCheck =  (value >= checkminValue && value <= checkmaxValue);
                return valueCheck;
            } else {
                return true;
            }
        },'');
        // 增加ip和域名 校验
        var checkDs = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
        var checkIp = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/;
        $.validator.addMethod("checkIpAndDnWizaed",function(value,element,params){
            // 可以为空
            var wizardStatus = netsettingwizard.getWizardStatus();
            if (wizardStatus != 'COMPLETED' && $.trim(value) == '') {
                return true;
            }
            return checkIp.test(value) || checkDs.test(value);
        },'');
        $.validator.addMethod("checkIp",function(value,element,params){
            return checkIp.test(value);
        },'');
        $.validator.addMethod("checkIpNoRequired",function(value,element,params){
            // 可以为空
            if ($.trim(value) == '') {
                return true;
            }
            return checkIp.test(value);
        },'');
        $.validator.addMethod("checkIpAndDnSpecial",function(value,element,params){
            var paramArr = params.split(",");
            if ($(paramArr[0]).prop('checked') && $("#form1 [name='"+paramArr[1]+"']:checked").attr('tp')=='1') {
                return checkIp.test(value) || checkDs.test(value);
            }
            return true;
        },'');
        $.validator.addMethod("checkIpSpecialWizard",function(value,element,params){
            // 可以为空
            if ($.trim(value) == '') {
                return true;
            }

            var paramArr = params.split(",");
            var secondParamCheck = true;
            if (paramArr.length>1) {
                secondParamCheck = $("#form1 [name='"+paramArr[1]+"']:checked").attr('tp')=='1';
            }
            if ($(paramArr[0]).prop('checked') && secondParamCheck) {
                return checkIp.test(value);
            }
            return true;
        },'');
        $.validator.addMethod("checkIpSpecialWizardRequired",function(value,element,params){
            var paramArr = params.split(",");
            var secondParamCheck = true;
            if (paramArr.length>1) {
                secondParamCheck = $("#form1 [name='"+paramArr[1]+"']:checked").attr('tp')=='1';
            }
            if ($(paramArr[0]).prop('checked') && secondParamCheck) {
                return checkIp.test(value);
            }
            return true;
        },'');
        $.validator.addMethod("checkMask",function(value,element,params){
            // 可以为空
            if ($.trim(value) == '') {
                return true;
            }
            var paramArr = params.split(",");
            var secondParamCheck = true;
            if (paramArr.length>1) {
                secondParamCheck = $("#form1 [name='"+paramArr[1]+"']:checked").attr('tp')=='1';
            }
            if ($(paramArr[0]).prop('checked') && secondParamCheck) {
                return netsettingwizard.checkMask(value);
            }
            return true;
        },'');
        $.validator.addMethod("checkMaskRequired",function(value,element,params){
            return netsettingwizard.checkMask(value);
        },'');
        //内外网设置互斥，必须有一个选择
        $.validator.addMethod("tranetMutex",function(value,element,params){
            if (!$('#intranet').prop('checked')
                && !$('#extranet').prop('checked')
                && $.trim($('#domainName').val())=='') {
                return true;
            }
            return $(element).prop('checked') || $(params).prop('checked');
        },'');
        //内外网网卡选择必须不一样
        $.validator.addMethod("tranetCardMutex",function(value,element,params){
            if ($('#intranet').prop('checked') && $('#extranet').prop('checked')) {
                var check = $(element).val() != $(params).val();
                return check;
            }
            return true;
        },'');

        // 验证路由配置目标地址不能重复
        $.validator.addMethod("checkRouteIPAddrNotTheSame",function(value,element,params){
            var rows = $('#m-ns-routeset-table').bootstrapTable('getData');
            var uniqueID = $(element).closest('tr').attr('data-uniqueid');
            if (rows.length > 0) {
                for (var i=0; i<rows.length; i++) {
                    if (uniqueID != rows[i].uniqueID
                        && value == rows[i].routerIpAddr) {
                        return false;
                    }
                }
            }
            return true;
        },'');
        // 验证目标地址和掩码不能同时为0.0.0.0
        $.validator.addMethod("checkIpAndMaskSameZero",function(value,element,params){
            if (value != '0.0.0.0' &&
                $("#form1 [name='"+params+"']").val() == '0.0.0.0') {
                return false;
            }
            return true;
        },'');
        $.validator.addMethod("checkRequiredSpecial",function(value,element,params){
            var paramArr = params.split(",");
            var secondParamCheck = true;
            if (paramArr.length>1) {
                secondParamCheck = $("#form1 [name='"+paramArr[1]+"']:checked").attr('tp')=='1';
            }
            if ($(paramArr[0]).prop('checked') && secondParamCheck) {
                return $.trim(value) != '';
            }
            return true;
        },'');
    },
    valid: {
        basicConfig: function () {
            var res = {
                ret: true
            };
            var retData = {};
            retData.domainName = $('#form1 [name="domainName"]').val();

            retData.intranet  = $('#form1 [name="intranet"]').prop('checked');
            retData.extranet  = $('#form1 [name="extranet"]').prop('checked');
            if(retData.intranet){
                retData.intranetCard = $('#form1 [name="intranetCard"]').val();
                retData.intranetSetting = {};
                retData.intranetSetting.ipmethod = $("#form1 [name='intIpMethod']:checked").attr('tp');
                if(retData.intranetSetting.ipmethod == '1'){
                    retData.intranetSetting.ipAddress = $("#form1 .m-ns-intranetSetting [name='ipAddress']").val();
                    retData.intranetSetting.subnetMask = $("#form1 .m-ns-intranetSetting [name='subnetMask']").val();
                    retData.intranetSetting.gateway = $("#form1 .m-ns-intranetSetting [name='gateway']").val();
                    retData.intranetSetting.preferredDNS = $("#form1 .m-ns-intranetSetting [name='preferredDNS']").val();
                    retData.intranetSetting.alternativeDNS = $("#form1 .m-ns-intranetSetting [name='alternativeDNS']").val();
                }
            }
            if(retData.extranet){
                retData.extranetCard = $('#form1 [name="extranetCard"]').val();
                retData.extranetSetting = {};
                retData.extranetSetting.ipmethod = $("#form1 [name='extIpMethod']:checked").attr('tp');
                if(retData.extranetSetting.ipmethod == '1'){
                    retData.extranetSetting.ipAddress = $("#form1 .m-ns-extranetSetting [name='ipAddress1']").val();
                    retData.extranetSetting.subnetMask = $("#form1 .m-ns-extranetSetting [name='subnetMask1']").val();
                    retData.extranetSetting.gateway = $("#form1 .m-ns-extranetSetting [name='gateway1']").val();
                    retData.extranetSetting.preferredDNS = $("#form1 .m-ns-extranetSetting [name='preferredDNS1']").val();
                    retData.extranetSetting.alternativeDNS = $("#form1 .m-ns-extranetSetting [name='alternativeDNS1']").val();
                }
                retData.nat  = $('#form1 [name="nat"]').prop('checked');
                if(retData.nat){
                    retData.publicNetAddr = $('#form1 [name="publicNetAddr"]').val();
                }
            }

            //路由设置
            var isRouterSet  = $('#form1 [name="routeSet"]').prop('checked');
            if (isRouterSet) {
                retData.routeMapList = $('#m-ns-routeset-table').bootstrapTable('getData');

                // 如果路由没配置，提示必须设置路由才能保存
                if (retData.routeMapList.length == 0) {
                    res.ret = false;
                    alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.router.mustone'),3);//路由必须至少设置一项!
                    return res;
                } else {
                    //请先完成路由设置才能保存
                    if ($("#form1 [name='routeIpAddr']").length > 0) {
                        res.ret = false;
                        alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.router.mustfinish'),3);
                        return res;
                    }

                    // 判断目标地址是否重复 主要考虑原来服务器路由设置有重复，但是前台没有修改的情况
                    var rows = $('#m-ns-routeset-table').bootstrapTable('getData');
                    var routeIpAddrs = '';
                    for (var i=0; i<rows.length; i++) {
                        if (routeIpAddrs != '' &&
                            routeIpAddrs.indexOf(rows[i].routerIpAddr + ',') != -1) {
                            res.ret = false;
                            alertPromptMsgDlg($.i18n.prop('netsetting.js.routing.repeat'),3);
                            return res;
                        }
                        routeIpAddrs = routeIpAddrs + rows[i].routerIpAddr + ',';
                    }
                }
            }

            res.retData = retData;
            res.ret = $("#form1").validate({
                errorElement : 'span',
                errorClass : 'help-block',
                focusInvalid : false,
                rules: {
                    domainName : {
                        checkIpAndDnWizaed : true
                    },
                    intranet : {

                    },
                    extranet : {

                    },
                    intranetCard : {
                        required : true,
                        tranetCardMutex : '#extranetCard'
                    },
                    extranetCard : {
                        required : true,
                        tranetCardMutex : '#intranetCard'
                    },
                    ipAddress : {
                        checkRequiredSpecial : '#intranet,intIpMethod',
                        checkIpSpecialWizard : '#intranet,intIpMethod'
                    },
                    subnetMask : {
                        checkRequiredSpecial : '#intranet,intIpMethod',
                        checkMask : '#intranet,intIpMethod'
                    },
                    gateway : {
                        checkRequiredSpecial : '#intranet,intIpMethod',
                        checkIpSpecialWizard : '#intranet,intIpMethod'
                    },
                    preferredDNS : {
                        checkIpSpecialWizard : '#intranet,intIpMethod'
                    },
                    alternativeDNS : {
                        checkIpSpecialWizard : '#intranet,intIpMethod'
                    },
                    ipAddress1 : {
                        checkRequiredSpecial : '#extranet,extIpMethod',
                        checkIpSpecialWizard : '#extranet,extIpMethod'
                    },
                    subnetMask1 : {
                        checkRequiredSpecial : '#extranet,extIpMethod',
                        checkMask : '#extranet,extIpMethod'
                    },
                    gateway1 : {
                        checkRequiredSpecial : '#extranet,extIpMethod',
                        checkIpSpecialWizard : '#extranet,extIpMethod'
                    },
                    preferredDNS1 : {
                        checkIpSpecialWizard : '#extranet,extIpMethod'
                    },
                    alternativeDNS1 : {
                        checkIpSpecialWizard : '#extranet,extIpMethod'
                    },
                    publicNetAddr : {
                        checkIpSpecialWizard : '#nat',
                        checkRequiredSpecial : '#nat'
                    }
                },
                messages:{
                    domainName : {
                        checkIpAndDnWizaed: $.i18n.prop('netsetting.js.localdns.invalidate')
                    },
                    intranet : {

                    },
                    extranet : {

                    },
                    intranetCard : {
                        required : $.i18n.prop('wizard.js.netsetting.intra.null'),
                        tranetCardMutex : $.i18n.prop('wizard.js.netsetting.not.same')
                    },
                    extranetCard : {
                        required : $.i18n.prop('wizard.js.netsetting.extra.null'),
                        tranetCardMutex : $.i18n.prop('wizard.js.netsetting.not.same')
                    },
                    ipAddress : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.ip.notnull'),
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.ip.format')
                    },
                    subnetMask : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.netmask.notnull'),
                        checkMask : $.i18n.prop('wizard.js.netsetting.netmask.format')
                    },
                    gateway : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.gateway.notnull'),
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.gateway.format')
                    },
                    preferredDNS : {
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.predns.format')
                    },
                    alternativeDNS : {
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.altdns.format')
                    },
                    ipAddress1 : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.ip.notnull'),
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.ip.format')
                    },
                    subnetMask1 : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.netmask.notnull'),
                        checkMask : $.i18n.prop('wizard.js.netsetting.netmask.format')
                    },
                    gateway1 : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.gateway.notnull'),
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.gateway.format')
                    },
                    preferredDNS1 : {
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.predns.format')
                    },
                    alternativeDNS1 : {
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.altdns.format')
                    },
                    publicNetAddr : {
                        checkIpSpecialWizard : $.i18n.prop('wizard.js.netsetting.pubaddr.format'),
                        checkRequiredSpecial : $.i18n.prop('wizard.js.netsetting.pubaddr.notnull')
                    }
                },
                highlight : function(element) {
                    var elementName = $(element).attr('name');
                    if (elementName=='intranet' || elementName=='extranet') {
                        //内外网互斥
                    } else {
                        $(element).closest('div').addClass('has-error');
                    }
                },
                success : function(label) {
                    var labelId = $(label).attr('id');
                    if (labelId=='intranet-error' || labelId=='extranet-error') {
                        //内外网互斥
                        $('#intranetSettingDiv').find('span').remove();
                    }
                    else {
                        label.closest('div').removeClass('has-error');
                        label.remove();

                        // 内外网卡不能选择一样
                        var errormsg = $.i18n.prop('wizard.js.netsetting.not.same');
                        if (labelId=='intranetCard-error'){
                            if ($('#extranetCard-error').html() == errormsg) {
                                $('#extranetCard-error').closest('div').removeClass('has-error');
                                $('#extranetCard-error').remove();
                            }
                        }
                        if (labelId=='extranetCard-error'){
                            if ($('#intranetCard-error').html() == errormsg) {
                                $('#intranetCard-error').closest('div').removeClass('has-error');
                                $('#intranetCard-error').remove();
                            }
                        }
                    }
                },
                errorPlacement : function(error, element) {
                    var elementName = $(element).attr('name');
                    if (elementName=='intranet' || elementName=='extranet') {
                        //内外网互斥
                        if ($('#intranetSettingDiv').find('span').length==0) {
                            error.css('color','#F00');
                            error.css('margin-bottom','0px');
                            $('#intranetSettingDiv').prepend(error);
                        }
                    }else if (elementName=='domainName') {
                        error.css('padding-left','188px');
                        error.css('margin-bottom','1px');
                        element.parent('div').prepend(error);
                    }else if (elementName=='intranetCard' || elementName=='extranetCard') {
                        error.css('padding-left','188px');
                        error.css('margin-bottom','1px');
                        element.parent('div').prepend(error);
                    }
                    else {
                        error.css('padding-left','95px');
                        error.css('margin-bottom','1px');
                        element.parent('div').prepend(error);
                    }
                }
            }).form();
            return res;
        }
    },
    AUTO_FORWARD_TIMESET : null, //自动跳转定时器
    getNewWebHost : function(ip, intraAddr) {
        var dataUrl = $('#projectContext').val()+'/netsetting/newwebhost?ipaddr='+ip+"&enterType="+netsettingwizard.ENTER_TYPE_BY_NETCARD+'&inAddr='+intraAddr;
        $.ajax({
            type: "get",
            url: dataUrl,
            async : false,
            success: function (data) {
                if (data.ret == 1) {
                    // 设置定时器，后自动跳转
                    var newWebHost = data.rows;
                    netsettingwizard.AUTO_FORWARD_TIMESET = setTimeout(function(){
                        window.location.href = newWebHost;
                    }, 1000*30);
                }
            }
        });
    },
    commit: function (type, dataObj) {
        $(window).scrollTop(0);
        // 增加滚动条
        $('#netSettingDivId').showLoading();

        // 基础设置 判断IP是否更改是的话获取新的web访问地址
        if (type == 'basicConfig') {
            var ip = "";
            if (netsettingwizard.ENTER_TYPE_BY_NETCARD == 1) {
                if ($('#form1 [name="intranet"]').prop('checked')) {
                    ip = $("#form1 .m-ns-intranetSetting [name='ipAddress']").val();
                }
            } else if (netsettingwizard.ENTER_TYPE_BY_NETCARD == 2) {
                if ($('#form1 [name="extranet"]').prop('checked')) {
                    ip = $("#form1 .m-ns-extranetSetting [name='ipAddress1']").val();
                }
            } else if (netsettingwizard.ENTER_TYPE_BY_NETCARD == 3) {
                if ($('#form1 [name="extranet"]').prop('checked') && $('#form1 [name="nat"]').prop('checked')) {
                    ip = $('#form1 [name="publicNetAddr"]').val();
                }
            }
            var intraAddr = $("#form1 .m-ns-intranetSetting [name='ipAddress']").val();
            netsettingwizard.getNewWebHost(ip,intraAddr);
        }

        var dataUrl = $('#projectContext').val()+'/netsetting/wizard/' + type.toLowerCase();
        $.ajax({
            type: 'POST',
            url: dataUrl,
            data: JSON.stringify(dataObj),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                // 隐藏滚动条
                $('#netSettingDivId').hideLoading();
                if (netsettingwizard.AUTO_FORWARD_TIMESET != null) {
                    clearTimeout(netsettingwizard.AUTO_FORWARD_TIMESET);
                }
                if( result.ret >= 0 ){
                    //alert('修改配置成功!');
                    if (netsettingwizard.updateWizardStatus()) {
                        //下一步骤
                        netsettingwizard.confirmNextstep();
                    } else {
                        alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.statusfail'),3);//更新向导状态失败!
                    }
                }else{
                    alertPromptMsgDlg(result.message,3);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                if (netsettingwizard.AUTO_FORWARD_TIMESET != null) {
                    clearTimeout(netsettingwizard.AUTO_FORWARD_TIMESET);
                }

                if (XMLHttpRequest.status == 0 &&
                    XMLHttpRequest.readyState == 0 &&
                    netsettingwizard.updateWizardStatus()) {
                    // 隐藏滚动条
                    $('#netSettingDivId').hideLoading();
                    //下一步骤
                    netsettingwizard.confirmNextstep();
                } else {
                    // 隐藏滚动条
                    $('#netSettingDivId').hideLoading();
                    alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.sysexception'),3);//系统异常!
                }
            }

        });
    },
    natChange:function(natMethod){
        if (natMethod=='0') {
            $('#publicNetAddr').val('');
            $('#publicNetAddr').attr('readonly','readonly');
            $('#publicNetAddr').closest('div').removeClass('has-error');
            $('#publicNetAddr').closest('div').find('span').remove();
        } else if(natMethod=='1') {
            $('#publicNetAddr').removeAttr('readonly');
        }
    },
    restart: function (loadingDivId) {
        // 增加滚动条
        $('#'+loadingDivId).showLoading();
        $.ajax({
            type: 'POST',
            url: $('#projectContext').val()+'/netsetting/restart',
            data: null,
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                // 隐藏滚动条
                $('#'+loadingDivId).hideLoading();
                if( result.ret >= 0 ) {
                    alertPromptMsgDlg($.i18n.prop('netsetting.js.restart.success'), 1, function(){
                        if (result.ret == 98 || result.ret == 99) {
                            var port = "";
                            if (result.ret == 98) {
                                port = $('#form2 [name="httpPort"]').val();
                            } else if (result.ret == 99) {
                                port = $('#form2 [name="httpsPort"]').val()
                            }
                            window.location.href = result.rows+port;
                        } else {
                            window.location.href = result.rows;
                        }
                    });
                }else{
                    alertPromptMsgDlg(result.message, 3);
                }
            }
        });
    },
    onDestory: function () {
        //console.log('destory');
    },
    confirmNextstep:function(){
        //初始化下一个先
        timesettingwizard.init();
        // 修改样式 及 页面展示切换
        wizardConfirmNextStep('netsetting','timesetting', 1);
    },
    //----以下基础设置-路由设置-----------
    ROUTER_OLD_EDIT_ROW: {}, //编辑的时候 原行记录，用于取消按钮用
    showOrHideRouter: function() {
        // 内外网同时设置才可以进行路由设置
        var isIntranet = $('#form1 input[name="intranet"]').prop('checked');
        var isExtranet = $('#form1 input[name="extranet"]').prop('checked');
        if (isIntranet && isExtranet) {
            $('#form1 input[name="routeSet"]').prop('checked',true);
            $('.m-ns-routesetting').show();
        } else {
            $('#form1 input[name="routeSet"]').prop('checked',false);
            $('.m-ns-routesetting').hide();
        }
    },
    gatewayLink : function() {
        // 网关联动
        $("#form1 [name='gateway'], #form1 [name='gateway1']").off('change').on('change',function(){
            var theNetCardText = '';
            var netCard = "";
            var extranetCard = $('#extranetCard').val();
            var intranetCard = $('#intranetCard').val();
            if ($(this).attr('name') == 'gateway') {
                netCard = intranetCard;
                theNetCardText = $('#intranetCard').find('option:selected').text();
            } else if ($(this).attr('name') == 'gateway1') {
                netCard = extranetCard;
                theNetCardText = $('#extranetCard').find('option:selected').text();
            }
            // 刷新路由表中其它列该网卡对应网关的值显示
            var $table = $('#m-ns-routeset-table');
            var rows = $table.bootstrapTable('getData');
            for (var i=0; i<rows.length; i++) {
                if (rows[i].routerIpAddr.indexOf('routeIpAddr') == -1 &&
                    rows[i].routerMetric == theNetCardText) {
                    rows[i].routerGateWay = $(this).val();
                    $table.bootstrapTable('updateByUniqueId', {
                        id: rows[i].uniqueID,
                        row: rows[i]
                    });
                }
            }
            var routeGateWayObj = $("#form1 [name='routeGateWay']");
            if (routeGateWayObj != null) {
                var routeMetric = $("#form1 [name='routeMetric']").val();
                if (netCard == routeMetric) {
                    routeGateWayObj.val($(this).val());
                }
            }
        });
    },
    initRoterTable:function() {
        // 初始化路由表
        $('#m-ns-routeset-table').bootstrapTable({
            striped:true,
            columns: [{
                field: 'uniqueID',
                visible : false
            }, {
                field: 'routeNetCardSel',
                visible : false
            }, {
                field: 'dataSeq',
                title: '',
                width: '10px'
            }, {
                field: 'routerIpAddr',
                title: $.i18n.prop('wizard.js.netsetting.ipaddr')
            }, {
                field: 'routerNetMask',
                title: $.i18n.prop('wizard.js.netsetting.netmask')
            }, {
                field: 'routerGateWay',
                title: $.i18n.prop('wizard.js.netsetting.gateway')
            }, {
                field: 'routerMetric',
                title: $.i18n.prop('wizard.js.netsetting.netcard')
            }, {
                field: 'routerOper',
                title: $.i18n.prop('wizard.js.netsetting.opt')
            }],
            sortable: false,           //是否启用排序
            strictSearch: false,
            clickToSelect: true,        //是否启用点击选中行
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            uniqueId : 'uniqueID'
        });

        // 添加路由按钮事件
        $("#addRouterSetAhref").off('click').on('click', function(){
            netsettingwizard.addRouterRow();
        });
    },
    addRouterRow : function() {
        if ($("#form1 [name='routeIpAddr']").length > 0) {
            alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.addrouter.save'),3);//请先完成当前操作才能继续添加路由规则。
            return;
        }
        // 添加路由
        var curTotal = $('#m-ns-routeset-table').bootstrapTable('getData').length;
        var addIndex = curTotal+1;
        var uniqueID = new Date().getTime();
        var addRow = netsettingwizard.generateEditRow(uniqueID, addIndex, 0,{routerIpAddr:"",routerNetMask:"",routerGateWay:""});
        $('#m-ns-routeset-table').bootstrapTable('insertRow', {
            index: curTotal,
            row: addRow
        });
        netsettingwizard.metricSelect();
        netsettingwizard.addTriggerForInput();
        // 触发网卡选择
        $("#form1 [name='routeMetric']").trigger('change');
    },
    metricSelect : function () {
        // 网卡选择 设置网关
        $("#form1 [name='routeMetric']").off('change').on('change',function(){
            var netCard = $(this).val();
            var extranetCard = $('#extranetCard').val();
            var intranetCard = $('#intranetCard').val();
            $("#form1 [name='routeGateWay']").attr('readonly','true');
            // 前台有选择，取前台值
            if (intranetCard==netCard) {
                var inGateWay = $("#form1 .m-ns-intranetSetting [name='gateway']").val();
                var exGateWay = $("#form1 .m-ns-extranetSetting [name='gateway1']").val();
                $("#form1 [name='routeGateWay']").val(inGateWay);
                if (extranetCard==netCard && inGateWay == '') {
                    $("#form1 [name='routeGateWay']").val(exGateWay);
                }
            } else if (extranetCard==netCard) {
                var exGateWay = $("#form1 .m-ns-extranetSetting [name='gateway1']").val();
                $("#form1 [name='routeGateWay']").val(exGateWay);
            } else {
                $("#form1 [name='routeGateWay']").val(netsettingwizard.netCardsMap[netCard].gateway);
            }
            $("#form1 [name='routeGateWay']").trigger('blur');
        });
    },
    addTriggerForInput:function() {
        // 增加鼠标离开 触发验证
        $("#form1 [name='routeIpAddr']").on('blur',function(){
            var uniqueID = $(this).closest('tr').attr('data-uniqueid');
            var value = $(this).val();
            var rules = netsettingwizard.ROUTER_VALIDATE_RULES;
            var messages = netsettingwizard.ROUTER_VALIDATE_MESSAGES;
            var valid = netsettingwizard.validateRouteIpAddr(uniqueID, value, rules, messages);
            if (valid) {
                $('#routeIpAddrError'+uniqueID).html('');
            }
        });
        ctlIpInput();

        $("#form1 [name='routeNetMask']").on('blur',function(){
            var uniqueID = $(this).closest('tr').attr('data-uniqueid');
            var value = $(this).val();
            var rules = netsettingwizard.ROUTER_VALIDATE_RULES;
            var messages = netsettingwizard.ROUTER_VALIDATE_MESSAGES;
            var valid = netsettingwizard.validateRouteNetMask(uniqueID, value, rules, messages);
            if (valid) {
                $('#routeNetMaskError'+uniqueID).html('');
            }
        });
        $("#form1 [name='routeGateWay']").on('blur',function(){
            var uniqueID = $(this).closest('tr').attr('data-uniqueid');
            var value = $(this).val();
            var rules = netsettingwizard.ROUTER_VALIDATE_RULES;
            var messages = netsettingwizard.ROUTER_VALIDATE_MESSAGES;
            var valid = netsettingwizard.validateRouteGateWay(uniqueID, value, rules, messages);
            if (valid) {
                $('#routeGateWayError'+uniqueID).html('');
            }
        });
    },
    generateEditRow : function(uniqueID, seq, flag,curRow) {
        //生成可编辑框 uniqueID-行唯一值 flag 0-新增 1-修改 seq-序号
        var ipAddr = '<input type="text" class="m-ns-route-input ipFormatInput" name="routeIpAddr" value="'+curRow.routerIpAddr+'"/>'
            +'<span class="m-ns-route-error" id="routeIpAddrError'+uniqueID+'"></span>';
        var netMask = '<input type="text" class="m-ns-route-input ipFormatInput" name="routeNetMask" value="'+curRow.routerNetMask+'"/>'
            +'<span class="m-ns-route-error" id="routeNetMaskError'+uniqueID+'"></span>';
        var gateWay = '<input type="text" class="m-ns-route-input" name="routeGateWay"  value="'+curRow.routerGateWay+'"/>'
            +'<span class="m-ns-route-error" id="routeGateWayError'+uniqueID+'"></span>';
        var metric = '<select class="m-ns-route-metricsel" name="routeMetric">'
            +$("#form1 [name='intranetCard']").html()
            +'</select>';
        var oper = '<button type="button" class="btn-xs btn-yealink" ' +
            ' onclick="netsettingwizard.saveRouterRow('+uniqueID+','+seq+')">'+$.i18n.prop('wizard.js.netsetting.save')+'</button>' +
            ' ' +
            '<button type="button" class="btn-xs" ' +
            ' onclick="netsettingwizard.cancelRouterRow('+uniqueID+','+flag+')">'+$.i18n.prop('wizard.js.netsetting.cacel')+'</button>';

        var row = {
            uniqueID : uniqueID,
            dataSeq: seq,
            routerIpAddr: ipAddr,
            routerNetMask: netMask,
            routerGateWay: gateWay,
            routerMetric: metric,
            routerOper: oper,
            routeNetCardSel : ''
        };
        return row;
    },
    cancelRouterRow:function(uniqueID, flag){
        var $table = $('#m-ns-routeset-table');
        //取消 0-新增 1-编辑
        if (flag == 0) {
            $table.bootstrapTable('remove', {
                field: 'uniqueID',
                values: [uniqueID]
            });
            // 刷新下
            //netsettingwizard.refreshRouterIndex();
        } else if (flag == 1) {
            // 编辑取消后 回到编辑前状态
            var editRow = netsettingwizard.ROUTER_OLD_EDIT_ROW[uniqueID];
            $table.bootstrapTable('updateByUniqueId', {
                id: uniqueID,
                row: editRow
            });
            delete netsettingwizard.ROUTER_OLD_EDIT_ROW[uniqueID];
        }
    },
    deleteRouteRow : function(uniqueID) {
        if ($("#form1 [name='routeIpAddr']").length > 0) {
            alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.delroute.save'),3);
            return;
        }
        // 删除
        var $table = $('#m-ns-routeset-table');
        $table.bootstrapTable('remove', {
            field: 'uniqueID',
            values: [uniqueID]
        });
        // 重刷seq
        netsettingwizard.refreshRouterIndex();
    },
    saveRouterRow:function(uniqueID, seq) {
        // 保存
        var $table = $('#m-ns-routeset-table');
        var routeIpAddr = $("#form1 [name='routeIpAddr']").val();
        var routeNetMask = $("#form1 [name='routeNetMask']").val();
        var routeGateWay = $("#form1 [name='routeGateWay']").val();
        var routeMetric = $("#form1 [name='routeMetric']").find("option:selected").text();
        var routeNetCardSel = $("#form1 [name='routeMetric']").val();

        // 验证
        if (netsettingwizard.validateRouteRow(uniqueID, routeIpAddr, routeNetMask, routeGateWay)) {
            // 编辑 删除按钮
            var oper = '<a class="no-underline m-ns-route-edit" title="'+$.i18n.prop('wizard.js.netsetting.edit')+'" onclick="netsettingwizard.editRouterRow('+uniqueID+','+seq+')"'
                +' href="javascript:void(0);"></a>'
                +' <a class="no-underline m-ns-route-delete" title="'+$.i18n.prop('wizard.js.netsetting.del')+'" onclick="netsettingwizard.deleteRouteRow('+uniqueID+')"'
                +' href="javascript:void(0);"></a>';
            // 更新row
            $table.bootstrapTable('updateByUniqueId', {
                id: uniqueID,
                row: {
                    uniqueID : uniqueID,
                    dataSeq: seq,
                    routerIpAddr: routeIpAddr,
                    routerNetMask: routeNetMask,
                    routerGateWay: routeGateWay,
                    routerMetric: routeMetric,
                    routerOper: oper,
                    routeNetCardSel : routeNetCardSel
                }
            });
            delete netsettingwizard.ROUTER_OLD_EDIT_ROW[uniqueID];

            if (routeIpAddr == '0.0.0.0' && routeNetMask == '0.0.0.0') {
                // 默认路由放到第一行
                var curRow = $table.bootstrapTable('getRowByUniqueId', uniqueID);
                $table.bootstrapTable('remove', {
                    field: 'uniqueID',
                    values: [uniqueID]
                });
                $table.bootstrapTable('insertRow', {index: 0, row: curRow});
                // 重刷seq
                netsettingwizard.refreshRouterIndex();
            }
        }
    },
    ROUTER_VALIDATE_RULES : {
        routeIpAddr: {
            checkRequiredSpecial : '#extranet',
            checkIp : true,
            checkRouteIPAddrNotTheSame : true,
            checkIpAndMaskSameZero : "routeNetMask"
        },
        routeNetMask: {
            checkRequiredSpecial : '#extranet',
            checkMaskRequired : true,
            checkIpAndMaskSameZero : "routeIpAddr"
        },
        routeGateWay: {
            checkIpNoRequired : true
        }
    },
    ROUTER_VALIDATE_MESSAGES : {

    },
    // 验证目标地址
    validateRouteIpAddr:function(uniqueID,routeIpAddr,rules,messages){
        // 清空
        $('#routeIpAddrError'+uniqueID).html('');
        var validResult = true;
        for (var key in rules.routeIpAddr) {
            if (!$.validator.methods[key].call(this,routeIpAddr,null,rules.routeIpAddr[key])) {
                validResult = false;
                $('#routeIpAddrError'+uniqueID).append(messages.routeIpAddr[key]);
                break;
            }
        }
        return validResult;
    },
    // 验证掩码
    validateRouteNetMask:function(uniqueID,routeNetMask,rules,messages){
        // 清空
        $('#routeNetMaskError'+uniqueID).html('');
        var validResult = true;
        for (var key in rules.routeNetMask) {
            if (!$.validator.methods[key].call(this,routeNetMask,null,rules.routeNetMask[key])) {
                validResult = false;
                $('#routeNetMaskError'+uniqueID).append(messages.routeNetMask[key]);
                break;
            }
        }
        return validResult;
    },
    // 验证网关
    validateRouteGateWay:function(uniqueID,routeGateWay,rules,messages){
        // 清空
        $('#routeGateWayError'+uniqueID).html('');
        var validResult = true;
        for (var key in rules.routeGateWay) {
            if (!$.validator.methods[key].call(this,routeGateWay,null,rules.routeGateWay[key])) {
                validResult = false;
                $('#routeGateWayError'+uniqueID).append(messages.routeGateWay[key]);
                break;
            }
        }
        return validResult;
    },
    // 验证
    validateRouteRow : function(uniqueID, routeIpAddr, routeNetMask, routeGateWay){
        var rules = netsettingwizard.ROUTER_VALIDATE_RULES;
        var messages = netsettingwizard.ROUTER_VALIDATE_MESSAGES;

        // 验证
        var ipValid = netsettingwizard.validateRouteIpAddr(uniqueID,routeIpAddr,rules,messages);
        var netMaskValid = netsettingwizard.validateRouteNetMask(uniqueID,routeNetMask,rules,messages);
        var gateWayValid = netsettingwizard.validateRouteGateWay(uniqueID,routeGateWay,rules,messages);

        return ipValid && netMaskValid && gateWayValid;
    },
    editRouterRow:function(uniqueID,seq) {
        if ($("#form1 [name='routeIpAddr']").length > 0) {
            alertPromptMsgDlg($.i18n.prop('wizard.js.netsetting.addrouter.save'),3);
            return;
        }
        var $table = $('#m-ns-routeset-table');
        var curRow = $table.bootstrapTable('getRowByUniqueId', uniqueID);
        var oldEditRow = $.extend(true,{},curRow);
        netsettingwizard.ROUTER_OLD_EDIT_ROW[uniqueID] = oldEditRow;

        var editRow = netsettingwizard.generateEditRow(uniqueID, curRow.dataSeq, 1, curRow);
        //下拉框 text
        var oldMetric = curRow.routerMetric;
        // 更新row
        $table.bootstrapTable('updateByUniqueId', {
            id: uniqueID,
            row: editRow
        });
        netsettingwizard.metricSelect();
        // 设置选中
        $('#form1 [name="routeMetric"] option:contains(' + oldMetric + ')').each(function(){
            if ($(this).text() == oldMetric) {
                $(this).attr('selected', true);
                $("#form1 [name='routeMetric']").trigger('change');
            }
        });
        netsettingwizard.addTriggerForInput();
    },
    refreshRouterIndex: function () {
        var $table = $('#m-ns-routeset-table');
        var rows = $table.bootstrapTable('getData');
        for (var i=1; i<=rows.length; i++) {
            $table.bootstrapTable('updateByUniqueId', {
                id: rows[i-1].uniqueID,
                row: {
                    dataSeq : i
                }
            });
        }
    }
}