var netsetting = {
    lockFlag:false,
    f_save:true,
    netCardsMap : {},
    ENTER_TYPE_BY_NETCARD : 1, //从外网还是内网访问该页面，0-内外网没配置 1-内网 2-外网 3-nat地址
    init: function () {

        $('input').off('change').on('change',function(){
            netsetting.f_save = false;
        })

        $('.m-ns a[data-toggle="tab"]').on('click',function(e){
            e.stopPropagation();
            var tabId = $(this).attr('href');
            var tab = tabId.substring(1);
            var $this = $(this);
            function showTab(){
                $this.tab('show');
                formutil.clearForm(tab);
                netsetting.tabEvent[tab]();
                netsetting.loadData(tab);
                netsetting.f_save = true;
            }
            if(netsetting.f_save){
                showTab();
            }else{
                alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),$.i18n.prop('netsetting.js.leave.sure'),$.i18n.prop('global.js.ok'), function () {
                    showTab();
                })
            }
        })
        $('.m-ns a[href="#basicConfig"]').trigger('click');
        // 添加验证方法
        this.addValidateMethod();
    },
    loadData: function (type) {
        $.post('netsetting/query', {type: type}, function (result) {
            if (result && result.ret >= 0) {
                netsetting[type](result.rows);
            } else {
                alertPromptMsgDlg($.i18n.prop('netsetting.js.load.fail'),3);
            }
        });
    },
    tabEvent:{
        basicConfig: function () {
            //初始化路由设置
            netsetting.initRoterTable();


            $('#form1 input[name="intranet"]').off('change').on('change', function () {
                netsetting.f_save = false;
                if($(this).prop('checked')){
                    $('.m-ns-intranet').show();
                }else{
                    $('.m-ns-intranet').hide();
                }
                //路由设置
                netsetting.showOrHideRouter();
                $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('blur');
                $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');
            })
            $('#form1 input[name="extranet"]').off('change').on('change', function () {
                netsetting.f_save = false;
                if($(this).prop('checked')){
                    $('.m-ns-extranet').show();
                }else{
                    $('.m-ns-extranet').hide();
                }
                //路由设置
                netsetting.showOrHideRouter();
                $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('blur');
                $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('change');
            })

            $('#form1 input[name="nat"]').off('change').on('change', function () {
                netsetting.f_save = false;
                if($(this).prop('checked')){
                    $('.m-ns-natSetting').show();
                }else{
                    $('.m-ns-natSetting').hide();
                }
            });

            //增加网关输入和路由联动
            netsetting.gatewayLink();

            //ip地址格式输入框限制输入 英文汉字及其他特殊字符
            ctlIpInput();
        },
        serverConfig: function () {
            $('#form2 [type="checkbox"]').off('change').on('change', function () {
                netsetting.f_save = false;
                if ($(this).prop('checked')) {
                    $(this).parent().next('div').show()
                } else {
                    $(this).parent().next('div').hide()
                }
            })
        },
        portConfig: function () {
            $('#form4 [type="checkbox"]').off('change').on('change', function () {
                netsetting.f_save = false;
                var controlDiv = $(this).parent().parent().parent().next('div');
                if ($(this).prop('checked')) {
                    controlDiv.show();
                } else {
                    controlDiv.hide();
                }
            })
        }
    },

    basicConfig: function (retData) {

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
                    netsetting.netCardsMap[nets[i].index] = nets[i];
                }
            }
            $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").off('change').on('change',function(){
                var val = $(this).val();
                var name = $(this).attr('name');
                if(name =='intranetCard'){
                    //if(netCardsMap[val].mode == '1'){
                    $("#form1 .m-ns-intranetSetting [name='ipAddress']").val(netsetting.netCardsMap[val].ip);
                    $("#form1 .m-ns-intranetSetting [name='subnetMask']").val(netsetting.netCardsMap[val].mask);
                    $("#form1 .m-ns-intranetSetting [name='gateway']").val(netsetting.netCardsMap[val].gateway);
                    $("#form1 .m-ns-intranetSetting [name='preferredDNS']").val(netsetting.netCardsMap[val].dns1);
                    $("#form1 .m-ns-intranetSetting [name='alternativeDNS']").val(netsetting.netCardsMap[val].dns2);
                    $("#form1 .m-ns-intranetSetting input").trigger('blur');
                    //}
                }else if(name == 'extranetCard'){
                    //if(netCardsMap[val].mode == '1'){
                    $("#form1 .m-ns-extranetSetting [name='ipAddress1']").val(netsetting.netCardsMap[val].ip);
                    $("#form1 .m-ns-extranetSetting [name='subnetMask1']").val(netsetting.netCardsMap[val].mask);
                    $("#form1 .m-ns-extranetSetting [name='gateway1']").val(netsetting.netCardsMap[val].gateway);
                    $("#form1 .m-ns-extranetSetting [name='preferredDNS1']").val(netsetting.netCardsMap[val].dns1);
                    $("#form1 .m-ns-extranetSetting [name='alternativeDNS1']").val(netsetting.netCardsMap[val].dns2);
                    $("#form1 .m-ns-extranetSetting input").trigger('blur');
                    //}
                }
            });
        }else{
            alertPromptMsgDlg($.i18n.prop('netsetting.js.read.neCart.fail'),3);
            return ;
        }

        var dd = retData.data;
        $("#form1 [name='domainName']").val(dd.domainName);
        if(dd.intranet){
            $("#form1 [name='intranet']").prop('checked', true);
            $("#form1 [name='intranetCard']").val(dd.intranetCard);
            $('.m-ns-intranet').show();
            if(netsetting.netCardsMap[dd.intranetCard] != null){
                $("#form1 .m-ns-intranetSetting [name='ipAddress']").val(netsetting.netCardsMap[dd.intranetCard].ip);
                $("#form1 .m-ns-intranetSetting [name='subnetMask']").val(netsetting.netCardsMap[dd.intranetCard].mask);
                $("#form1 .m-ns-intranetSetting [name='gateway']").val(netsetting.netCardsMap[dd.intranetCard].gateway);
                $("#form1 .m-ns-intranetSetting [name='preferredDNS']").val(netsetting.netCardsMap[dd.intranetCard].dns1);
                $("#form1 .m-ns-intranetSetting [name='alternativeDNS']").val(netsetting.netCardsMap[dd.intranetCard].dns2);
                $("#form1 .m-ns-intranetSetting input").trigger('blur');
            }
        }else{
            $("#form1 [name='intranet']").prop('checked', false);
            $('.m-ns-intranet').hide();
        }

        if(dd.extranet){
            $("#form1 [name='extranet']").prop('checked', true);
            $("#form1 [name='extranetCard']").val(dd.extranetCard);
            $('.m-ns-extranet').show();
            if(netsetting.netCardsMap[dd.extranetCard] != null){
                $("#form1 .m-ns-extranetSetting [name='ipAddress1']").val(netsetting.netCardsMap[dd.extranetCard].ip);
                $("#form1 .m-ns-extranetSetting [name='subnetMask1']").val(netsetting.netCardsMap[dd.extranetCard].mask);
                $("#form1 .m-ns-extranetSetting [name='gateway1']").val(netsetting.netCardsMap[dd.extranetCard].gateway);
                $("#form1 .m-ns-extranetSetting [name='preferredDNS1']").val(netsetting.netCardsMap[dd.extranetCard].dns1);
                $("#form1 .m-ns-extranetSetting [name='alternativeDNS1']").val(netsetting.netCardsMap[dd.extranetCard].dns2);
                $("#form1 .m-ns-extranetSetting input").trigger('blur');
            }
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
        $("#form1 [name='intranetCard'],#form1 [name='extranetCard']").trigger('blur');

        // 获取进入页面网络类型
        netsetting.ENTER_TYPE_BY_NETCARD = netsetting.getEnterTypeByNetCard();

        //加载路由
        // var routeSetRows = dd.routerSetting;
        var routeSetRows = [];
        var routeConfigs = JSON.parse(netCards).router;
        if (routeConfigs != null && routeConfigs != undefined) {
            // 排序 把默认路由放到最前面
            routeConfigs = netsetting.sortRouteMap(routeConfigs);
            for(var i=0;i<routeConfigs.length;i++) {
                var uniqueID = new Date().getTime()+i;
                var seq = i+1;
                var cardIndex = routeConfigs[i].ifindex;
                var oper = '<a class="no-underline m-ns-route-edit" title="'+$.i18n.prop('netsetting.js.edit') +'" ' +
                    'onclick="netsetting.editRouterRow('+uniqueID+','+seq+')"'
                    +' href="javascript:void(0);"></a>'
                    +' <a class="no-underline m-ns-route-delete" title="'+$.i18n.prop('netsetting.js.delete') +'" ' +
                    'onclick="netsetting.deleteRouteRow('+uniqueID+')"'
                    +' href="javascript:void(0);"></a>';

                routeSetRows.push({
                    uniqueID : uniqueID,
                    dataSeq: seq,
                    routerIpAddr: routeConfigs[i].dst,
                    routerNetMask: routeConfigs[i].mask,
                    routerGateWay: netsetting.netCardsMap[cardIndex].gateway,
                    routerMetric: netsetting.netCardsMap[cardIndex].name,
                    routerOper: oper,
                    routeNetCardSel : cardIndex
                });
            }
        }
        $('#m-ns-routeset-table').bootstrapTable('load',routeSetRows);
        // 设置路由设置勾选
        netsetting.showOrHideRouter();
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
    serverConfig: function (retData) {
        $('.m-restat-server').hide();
        var dd = retData.data;
        $.each([{http: 'httpPort'}, {http: 'publicWLanPort'}, {https: 'httpsPort'}, {ssh: 'sshPort'}], function () {
            var _this = this;
            for (var i in _this) {
                if (dd[i]) {
                    $('#form2 [name="' + i + '"]').prop('checked', true);
                    $('#form2 [name="' + i + '"]').parent().next('div').show();

                } else {
                    $('#form2 [name="' + i + '"]').prop('checked', false);
                    $('#form2 [name="' + i + '"]').parent().next('div').hide();
                }
                $('#form2 [name="' + _this[i] + '"]').val(dd[_this[i]]);
                $('#form2 [name="' + _this[i] + '"]').trigger('blur');
            }
        });
        // sip
        $('#form2 [name="sipUDPTCPPort"]').val(dd.sipUDPPort);
        $('#form2 [name="sipTLSPort"]').val(dd.sipTLSPort);

        //如果没有启用nat则把 http nat端口设置为只读 默认为原数据库数据 初始化是80
        if (!retData.isNatFromDb) {
            $('#form2 [name="publicWLanPort"]').attr('readonly','true');
        } else {
            $('#form2 [name="publicWLanPort"]').removeAttr('readonly');
        }

    },

    portConfig: function (retData) {
        var dd = retData.data;
        $('#form4 [name="signalingPortStart"]').val(dd.signalingPortStart);
        $('#form4 [name="signalingPortEnd"]').val(dd.signalingPortEnd);
        $('#form4 [name="mediaStreamPortStart"]').val(dd.mediaStreamPortStart);
        $('#form4 [name="mediaStreamPortEnd"]').val(dd.mediaStreamPortEnd);
        $('#form4 [name="turnServerPortStart"]').val(dd.turnServerPortStart);
        $('#form4 [name="turnServerPortEnd"]').val(dd.turnServerPortEnd);

    },
    save: function (type) {
        var commitData = {type: type};
        var result = netsetting.valid[type]();
        if (result && result.ret) {
            alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),$.i18n.prop('netsetting.js.restart.vcs.sure'),$.i18n.prop('global.js.ok'), function () {
                netsetting.commit(type, $.extend({}, commitData, result.retData));
            });
        }
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
            var binaryIpString = netsetting.praseIpToBinary(ip).toString();
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
        $.validator.addMethod("checkIpAndDn",function(value,element,params){
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
        $.validator.addMethod("checkIpSpecial",function(value,element,params){
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
        $.validator.addMethod("checkIpSpecialRequired",function(value,element,params){
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
                return netsetting.checkMask(value);
            }
            return true;
        },'');
        $.validator.addMethod("checkMaskRequired",function(value,element,params){
            return netsetting.checkMask(value);
        },'');
        //内外网设置互斥，必须有一个选择
        $.validator.addMethod("tranetMutex",function(value,element,params){
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
        //sip tcp端口不能和tls端口一致
        $.validator.addMethod("sipPortMutex",function(value,element,params){
            var check = $(element).val() != $(params).val();
            return check;
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
                    alertPromptMsgDlg($.i18n.prop('netsetting.js.routing.require'),3);
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
                        required : true,
                        checkIpAndDn : true
                    },
                    intranet : {
                        tranetMutex : '#extranet'
                    },
                    extranet : {
                        tranetMutex : '#intranet'
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
                        checkIpSpecial : '#intranet,intIpMethod'
                    },
                    subnetMask : {
                        checkRequiredSpecial : '#intranet,intIpMethod',
                        checkMask : '#intranet,intIpMethod'
                    },
                    gateway : {
                        checkRequiredSpecial : '#intranet,intIpMethod',
                        checkIpSpecial : '#intranet,intIpMethod'
                    },
                    preferredDNS : {
                        checkIpSpecial : '#intranet,intIpMethod'
                    },
                    alternativeDNS : {
                        checkIpSpecial : '#intranet,intIpMethod'
                    },
                    ipAddress1 : {
                        checkRequiredSpecial : '#extranet,extIpMethod',
                        checkIpSpecial : '#extranet,extIpMethod'
                    },
                    subnetMask1 : {
                        checkRequiredSpecial : '#extranet,extIpMethod',
                        checkMask : '#extranet,extIpMethod'
                    },
                    gateway1 : {
                        checkRequiredSpecial : '#extranet,extIpMethod',
                        checkIpSpecial : '#extranet,extIpMethod'
                    },
                    preferredDNS1 : {
                        checkIpSpecial : '#extranet,extIpMethod'
                    },
                    alternativeDNS1 : {
                        checkIpSpecial : '#extranet,extIpMethod'
                    },
                    publicNetAddr : {
                        checkIpSpecial : '#nat',
                        checkRequiredSpecial : '#nat'
                    }
                },
                messages:{
                    domainName : {
                        required :$.i18n.prop('netsetting.js.localdns.require'),
                        checkIpAndDn: $.i18n.prop('netsetting.js.localdns.invalidate')
                    },
                    intranet : {
                        tranetMutex : $.i18n.prop('netsetting.js.net.require')
                    },
                    extranet : {
                        tranetMutex : $.i18n.prop('netsetting.js.net.require')
                    },
                    intranetCard : {
                        required : $.i18n.prop('netsetting.js.innerNet.require'),
                        tranetCardMutex : $.i18n.prop('netsetting.js.net.repeat')
                    },
                    extranetCard : {
                        required : $.i18n.prop('netsetting.js.outNet.require'),
                        tranetCardMutex : $.i18n.prop('netsetting.js.net.repeat')
                    },
                    ipAddress : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.ip.notnull'),
                        checkIpSpecial :$.i18n.prop('netsetting.js.ip.invalidate')
                    },
                    subnetMask : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.netmask.notnull'),
                        checkMask : $.i18n.prop('netsetting.js.netMask.invalidate')
                    },
                    gateway : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.gateway.notnull'),
                        checkIpSpecial : $.i18n.prop('netsetting.js.gateway.invalidate')
                    },
                    preferredDNS : {
                        checkIpSpecial : $.i18n.prop('netsetting.js.dns.first.invalidate')
                    },
                    alternativeDNS : {
                        checkIpSpecial : $.i18n.prop('netsetting.js.dns.alt.invalidate')
                    },
                    ipAddress1 : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.ip.notnull'),
                        checkIpSpecial :$.i18n.prop('netsetting.js.ip.invalidate')
                    },
                    subnetMask1 : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.netmask.notnull'),
                        checkMask : $.i18n.prop('netsetting.js.netMask.invalidate')
                    },
                    gateway1 : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.static.gateway.notnull'),
                        checkIpSpecial :$.i18n.prop('netsetting.js.gateway.invalidate')
                    },
                    preferredDNS1 : {
                        checkIpSpecial :$.i18n.prop('netsetting.js.dns.first.invalidate')
                    },
                    alternativeDNS1 : {
                        checkIpSpecial : $.i18n.prop('netsetting.js.dns.alt.invalidate')
                    },
                    publicNetAddr : {
                        checkIpSpecial : $.i18n.prop('netsetting.js.outNet.invalidate'),
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.outNet.notNull')
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
                        $('#intranetSettingDiv').find('span:first').remove();
                    }
                    else {
                        label.closest('div').removeClass('has-error');
                        label.remove();

                        // 内外网卡不能选择一样
                        var errormsg = $.i18n.prop('netsetting.js.net.repeat');
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
                        if ($('#intranetSettingDiv').find('span').length==1) {
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
                    } else {
                        console.log(elementName)
                        error.css('padding-left','113px');
                        error.css('margin-bottom','1px');
                        element.parent('div').prepend(error);
                    }
                }
            }).form();
            return res;
        },
        serverConfig: function () {
            var res = {
                ret: true
            };
            var retData = {};

            retData.http = $('#form2 [name="http"]').prop('checked');
            retData.httpPort = $('#form2 [name="httpPort"]').val();
            retData.publicWLanPort = $('#form2 [name="publicWLanPort"]').val();

            retData.https = $('#form2 [name="https"]').prop('checked');
            retData.httpsPort = $('#form2 [name="httpsPort"]').val();

            retData.ssh = $('#form2 [name="ssh"]').prop('checked');
            retData.sshPort = $('#form2 [name="sshPort"]').val();

            retData.sipUDPPort = $('#form2 [name="sipUDPTCPPort"]').val();
            retData.sipTCPPort = $('#form2 [name="sipUDPTCPPort"]').val();
            retData.sipTLSPort = $('#form2 [name="sipTLSPort"]').val();

            //retData.telnet = $('#form2 [name="telnet"]').prop('checked');
            //retData.telnetPort = $('#form2 [name="telnetPort"]').val();

            res.retData = retData;
            res.ret = $("#form2").validate({
                errorElement : 'span',
                errorClass : 'help-block',
                focusInvalid : false,
                rules: {
                    httpPort : {
                        checkRequiredSpecial : '#http',
                        hasCbPortCheck : '#http,1,65535'
                    },
                    publicWLanPort : {
                        checkRequiredSpecial : '#http',
                        hasCbPortCheck : '#http,1,65535'
                    },
                    httpsPort : {
                        checkRequiredSpecial : '#https',
                        hasCbPortCheck : '#https,1,65535'
                    },
                    sshPort : {
                        checkRequiredSpecial : '#ssh',
                        hasCbPortCheck : '#ssh,1,65535'
                    },
                    //telnetPort : {
                    //    hasCbPortCheck : '#telnet,1,65535'
                    //}
                    sipUDPTCPPort : {
                        required : true,
                        digits : true,
                        range:[1,65535],
                        sipPortMutex:'#sipTLSPort'
                    },
                    sipTLSPort : {
                        required : true,
                        digits : true,
                        range:[1,65535],
                        sipPortMutex:'#sipUDPTCPPort'
                    }
                },
                messages:{
                    httpPort : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.port.notNull'),
                        hasCbPortCheck : $.i18n.prop('netsetting.js.port.invalidate')
                    },
                    publicWLanPort : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.port.notNull'),
                        hasCbPortCheck : $.i18n.prop('netsetting.js.port.invalidate')
                    },
                    httpsPort : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.port.notNull'),
                        hasCbPortCheck : $.i18n.prop('netsetting.js.port.invalidate')
                    },
                    sshPort : {
                        checkRequiredSpecial : $.i18n.prop('netsetting.js.port.notNull'),
                        hasCbPortCheck : $.i18n.prop('netsetting.js.port.invalidate')
                    },
                    //telnetPort : {
                    //    hasCbPortCheck : '端口必填,且必须是1到65535间的整数.'
                    //}
                    sipUDPTCPPort : {
                        required : $.i18n.prop('netsetting.js.port.notNull'),
                        digits : $.i18n.prop('netsetting.js.port.invalidate'),
                        range:$.i18n.prop('netsetting.js.port.invalidate'),
                        sipPortMutex:$.i18n.prop('netsetting.js.same.tls.invalidate')
                    },
                    sipTLSPort : {
                        required : $.i18n.prop('netsetting.js.port.notNull'),
                        digits :$.i18n.prop('netsetting.js.port.invalidate'),
                        range:$.i18n.prop('netsetting.js.port.invalidate'),
                        sipPortMutex:$.i18n.prop('netsetting.js.same.tls.invalidate')
                    }
                },
                highlight : function(element) {
                    $(element).closest('div').addClass('has-error');
                },
                success : function(label) {
                    label.closest('div').removeClass('has-error');
                    label.remove();
                    var labelId = $(label).attr('id');
                    var errormsg = $.i18n.prop('netsetting.js.same.tls.invalidate');
                    if (labelId=='sipUDPTCPPort-error'){
                        if ($('#sipTLSPort-error').html() == errormsg) {
                            $('#sipTLSPort-error').closest('div').removeClass('has-error');
                            $('#sipTLSPort-error').remove();
                        }
                    }
                    if (labelId=='sipTLSPort-error'){
                        if ($('#sipUDPTCPPort-error').html() == errormsg) {
                            $('#sipUDPTCPPort-error').closest('div').removeClass('has-error');
                            $('#sipUDPTCPPort-error').remove();
                        }
                    }
                },
                errorPlacement : function(error, element) {
                    error.css('padding-left', '188px');
                    error.css('margin-bottom','1px');
                    element.parent('div').prepend(error);
                }
            }).form();
            return res;
        },
        portConfig: function () {

            var res = {
                ret: true
            };
            var retData = {};
            retData.signalingPortStart = $('#form4 [name="signalingPortStart"]').val();
            retData.signalingPortEnd = $('#form4 [name="signalingPortEnd"]').val();
            retData.mediaStreamPortStart = $('#form4 [name="mediaStreamPortStart"]').val();
            retData.mediaStreamPortEnd = $('#form4 [name="mediaStreamPortEnd"]').val();
            retData.turnServerPortStart = $('#form4 [name="turnServerPortStart"]').val();
            retData.turnServerPortEnd = $('#form4 [name="turnServerPortEnd"]').val();

            res.retData = retData;
            res.ret = $("#form4").validate({
                errorElement : 'span',
                errorClass : 'help-block',
                focusInvalid : false,
                rules: {
                    signalingPortStart : {
                        required : true,
                        digits : true,
                        range:[30000,37999],
                        sipPortMutex : '#signalingPortEnd'
                    },
                    signalingPortEnd : {
                        required : true,
                        digits : true,
                        range:[30000,37999],
                        sipPortMutex : '#signalingPortStart'
                    },
                    turnServerPortStart : {
                        required : true,
                        digits : true,
                        range:[38000,49999],
                        sipPortMutex : '#turnServerPortEnd'
                    },
                    turnServerPortEnd : {
                        required : true,
                        digits : true,
                        range:[38000,49999],
                        sipPortMutex : '#turnServerPortStart'
                    },
                    mediaStreamPortStart : {
                        required : true,
                        digits : true,
                        range:[50000,59999],
                        sipPortMutex : '#mediaStreamPortEnd'
                    },
                    mediaStreamPortEnd : {
                        required : true,
                        digits : true,
                        range:[50000,59999],
                        sipPortMutex : '#mediaStreamPortStart'
                    }
                },
                messages:{
                    signalingPortStart : {
                        required : $.i18n.prop('netsetting.js.port.require'),
                        digits : $.i18n.prop('netsetting.js.port.int'),
                        range: $.i18n.prop('netsetting.js.port.range300'),
                        sipPortMutex : $.i18n.prop('netsetting.js.port.notsame')
                    },
                    signalingPortEnd : {
                        required : $.i18n.prop('netsetting.js.port.require'),
                        digits : $.i18n.prop('netsetting.js.port.int'),
                        range: $.i18n.prop('netsetting.js.port.range300'),
                        sipPortMutex : $.i18n.prop('netsetting.js.port.notsame')
                    },
                    turnServerPortStart : {
                        required : $.i18n.prop('netsetting.js.port.require'),
                        digits : $.i18n.prop('netsetting.js.port.int'),
                        range: $.i18n.prop('netsetting.js.port.range380'),
                        sipPortMutex : $.i18n.prop('netsetting.js.port.notsame')
                    },
                    turnServerPortEnd : {
                        required : $.i18n.prop('netsetting.js.port.require'),
                        digits : $.i18n.prop('netsetting.js.port.int'),
                        range: $.i18n.prop('netsetting.js.port.range380'),
                        sipPortMutex : $.i18n.prop('netsetting.js.port.notsame')
                    },
                    mediaStreamPortStart : {
                        required : $.i18n.prop('netsetting.js.port.require'),
                        digits : $.i18n.prop('netsetting.js.port.int'),
                        range: $.i18n.prop('netsetting.js.port.range500'),
                        sipPortMutex : $.i18n.prop('netsetting.js.port.notsame')
                    },
                    mediaStreamPortEnd : {
                        required : $.i18n.prop('netsetting.js.port.require'),
                        digits : $.i18n.prop('netsetting.js.port.int'),
                        range: $.i18n.prop('netsetting.js.port.range500'),
                        sipPortMutex : $.i18n.prop('netsetting.js.port.notsame')
                    }
                },
                highlight : function(element) {
                    $(element).css('border-color','#F00');
                },
                success : function(label) {
                    var eleSpanId = label.parent().attr('id');
                    if (eleSpanId) {
                        var id = eleSpanId.replace('-Span','');
                        $('#'+id).css('border-color','');

                        var portMatchList = {
                            signalingPortStart : 'signalingPortEnd',
                            signalingPortEnd : 'signalingPortStart',
                            mediaStreamPortStart : 'mediaStreamPortEnd',
                            mediaStreamPortEnd : 'mediaStreamPortStart',
                            turnServerPortStart : 'turnServerPortEnd',
                            turnServerPortEnd : 'turnServerPortStart'
                        };
                        var errormsg = $.i18n.prop('netsetting.js.port.notsame');
                        if ($('#'+portMatchList[id]+'-error').html() == errormsg) {
                            $('#'+portMatchList[id]+'-error').closest('div').removeClass('has-error');
                            $('#'+portMatchList[id]+'-error').remove();
                            $('#'+portMatchList[id]).css('border-color','');
                        }
                    }
                    label.remove();
                },
                errorPlacement : function(error, element) {
                    var showSpanName = $(element).attr('name')+'-Span';
                    error.removeClass('help-block').css('color','#F00');
                    $('#'+showSpanName).html('');
                    $('#'+showSpanName).append(error);
                }
            }).form();
            return res;
        }
    },
    AUTO_FORWARD_TIMESET : null, //自动跳转定时器
    getNewWebHost : function(ip, intraAddr) {
        var dataUrl = 'netsetting/newwebhost?ipaddr='+ip+"&enterType="+netsetting.ENTER_TYPE_BY_NETCARD+'&inAddr='+intraAddr;
        $.ajax({
            type: "get",
            url: dataUrl,
            async : false,
            success: function (data) {
                if (data.ret == 1) {
                    // 设置定时器，后自动跳转
                    var newWebHost = data.rows;
                    netsetting.AUTO_FORWARD_TIMESET = setTimeout(function(){
                        window.location.href = newWebHost;
                    }, 1000*30);
                }
            }
        });
    },
    commit: function (type, dataObj) {
        netsetting.f_save = true;
        $(window).scrollTop(0);
        // 增加滚动条
        $('#netSettingDivId').showLoading();

        // 基础设置 判断IP是否更改是的话获取新的web访问地址
        if (type == 'basicConfig') {
            var ip = "";
            if (netsetting.ENTER_TYPE_BY_NETCARD == 1) {
                if ($('#form1 [name="intranet"]').prop('checked')) {
                    ip = $("#form1 .m-ns-intranetSetting [name='ipAddress']").val();
                }
            } else if (netsetting.ENTER_TYPE_BY_NETCARD == 2) {
                if ($('#form1 [name="extranet"]').prop('checked')) {
                    ip = $("#form1 .m-ns-extranetSetting [name='ipAddress1']").val();
                }
            } else if (netsetting.ENTER_TYPE_BY_NETCARD == 3) {
                if ($('#form1 [name="extranet"]').prop('checked') && $('#form1 [name="nat"]').prop('checked')) {
                    ip = $('#form1 [name="publicNetAddr"]').val();
                }
            }
            var intraAddr = $("#form1 .m-ns-intranetSetting [name='ipAddress']").val();
            netsetting.getNewWebHost(ip,intraAddr);
        }

        $.ajax({
            type: 'POST',
            url: 'netsetting/' + type.toLowerCase(),
            data: JSON.stringify(dataObj),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                // 隐藏滚动条
                $('#netSettingDivId').hideLoading();
                if (netsetting.AUTO_FORWARD_TIMESET != null) {
                    clearTimeout(netsetting.AUTO_FORWARD_TIMESET);
                }
                if( result.ret >= 0 ){
                    alertPromptMsgDlg($.i18n.prop('netsetting.js.modify.success'),1);

                    if(type == 'serverConfig'){
                        if(result.ret == 99){
                            //netsetting.f_save = false;
                            //$('.m-restat-server').show();
                            //$('.m-restat-server a').off('click').on('click',function(){
                            //    netsetting.restart();
                            //})
                            // 重启web服务
                            alertPromptMsgDlg($.i18n.prop('timesetting.js.restart.tips'), 1, function(){
                                netsetting.restart();
                            });
                        }
                    }

                }else{
                    alertPromptMsgDlg(result.message,3);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                if (netsetting.AUTO_FORWARD_TIMESET != null) {
                    clearTimeout(netsetting.AUTO_FORWARD_TIMESET);
                }

                // 隐藏滚动条
                $('#netSettingDivId').hideLoading();

                if (XMLHttpRequest.status == 0 &&
                    XMLHttpRequest.readyState == 0) {
                    alertPromptMsgDlg($.i18n.prop('netsetting.js.modify.success'),1);
                } else {
                    alertPromptMsgDlg($.i18n.prop('netsetting.js.system.error'),3);
                }

            }

        });
    },
    restart: function (loadingDivId) {
        if (!loadingDivId) {
            loadingDivId = 'netSettingDivId';
        }
        // 增加滚动条
        $('#'+loadingDivId).showLoading();
        $.ajax({
            type: 'POST',
            url: 'netsetting/restart',
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

    //----以下基础设置-路由设置-----------
    ROUTER_TABLE_COLUMNS:[{
        field: 'uniqueID',
        visible : false
    },{
        field: 'routeNetCardSel',
        visible : false
    },{
        field: 'dataSeq',
        title: '',
        width: '10px'
    }, {
        field: 'routerIpAddr',
        title: $.i18n.prop('netsetting.js.des.ip')
    }, {
        field: 'routerNetMask',
        title: $.i18n.prop('netsetting.js.netMask')
    }, {
        field: 'routerGateWay',
        title: $.i18n.prop('netsetting.js.gateway')
    }, {
        field: 'routerMetric',
        title: $.i18n.prop('netsetting.js.netCart')
    }, {
        field: 'routerOper',
        title: $.i18n.prop('netsetting.js.opration')
    }],
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
            columns: netsetting.ROUTER_TABLE_COLUMNS,
            sortable: false,           //是否启用排序
            strictSearch: false,
            clickToSelect: true,        //是否启用点击选中行
            cardView: false,          //是否显示详细视图
            detailView: false,          //是否显示父子表
            uniqueId : 'uniqueID'
        });

        // 添加路由按钮事件
        $("#addRouterSetAhref").off('click').on('click', function(){
            netsetting.addRouterRow();
        });
    },
    addRouterRow : function() {
        if ($("#form1 [name='routeIpAddr']").length > 0) {
            alertPromptMsgDlg($.i18n.prop('netsetting.js.tip.routeSetting.save'),3);
            return;
        }
        // 添加路由
        var curTotal = $('#m-ns-routeset-table').bootstrapTable('getData').length;
        var addIndex = curTotal+1;
        var uniqueID = new Date().getTime();
        var addRow = netsetting.generateEditRow(uniqueID, addIndex, 0,{routerIpAddr:"",routerNetMask:"",routerGateWay:""});
        $('#m-ns-routeset-table').bootstrapTable('insertRow', {
            index: curTotal,
            row: addRow
        });
        netsetting.metricSelect();
        netsetting.addTriggerForInput();
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
                $("#form1 [name='routeGateWay']").val(netsetting.netCardsMap[netCard].gateway);
            }
            $("#form1 [name='routeGateWay']").trigger('blur');
        });
    },
    addTriggerForInput:function() {
        // 增加鼠标离开 触发验证
        $("#form1 [name='routeIpAddr']").on('blur',function(){
            var uniqueID = $(this).closest('tr').attr('data-uniqueid');
            var value = $(this).val();
            var rules = netsetting.ROUTER_VALIDATE_RULES;
            var messages = netsetting.ROUTER_VALIDATE_MESSAGES;
            var valid = netsetting.validateRouteIpAddr(uniqueID, value, rules, messages);
            if (valid) {
                $('#routeIpAddrError'+uniqueID).html('');
            }
        });
        ctlIpInput();

        $("#form1 [name='routeNetMask']").on('blur',function(){
            var uniqueID = $(this).closest('tr').attr('data-uniqueid');
            var value = $(this).val();
            var rules = netsetting.ROUTER_VALIDATE_RULES;
            var messages = netsetting.ROUTER_VALIDATE_MESSAGES;
            var valid = netsetting.validateRouteNetMask(uniqueID, value, rules, messages);
            if (valid) {
                $('#routeNetMaskError'+uniqueID).html('');
            }
        });
        $("#form1 [name='routeGateWay']").on('blur',function(){
            var uniqueID = $(this).closest('tr').attr('data-uniqueid');
            var value = $(this).val();
            var rules = netsetting.ROUTER_VALIDATE_RULES;
            var messages = netsetting.ROUTER_VALIDATE_MESSAGES;
            var valid = netsetting.validateRouteGateWay(uniqueID, value, rules, messages);
            if (valid) {
                $('#routeGateWayError'+uniqueID).html('');
            }
        });
    },
    generateEditRow : function(uniqueID, seq, flag,curRow) {
        //生成可编辑框 uniqueID-行唯一值 flag 0-新增 1-修改 seq-序号
        var ipAddr = '<input type="text" class="m-ns-route-input ipFormatInput" name="routeIpAddr"  value="'+curRow.routerIpAddr+'"/>'
            +'<span class="m-ns-route-error" id="routeIpAddrError'+uniqueID+'"></span>';
        var netMask = '<input type="text" class="m-ns-route-input ipFormatInput" name="routeNetMask" value="'+curRow.routerNetMask+'"/>'
            +'<span class="m-ns-route-error" id="routeNetMaskError'+uniqueID+'"></span>';
        var gateWay = '<input type="text" class="m-ns-route-input" name="routeGateWay"  value="'+curRow.routerGateWay+'"/>'
            +'<span class="m-ns-route-error" id="routeGateWayError'+uniqueID+'"></span>';
        var metric = '<select class="m-ns-route-metricsel" name="routeMetric">'
            +$("#form1 [name='intranetCard']").html()
            +'</select>';
        var oper = '<button type="button" class="btn-xs btn-yealink" ' +
            ' onclick="netsetting.saveRouterRow('+uniqueID+','+seq+')">'+$.i18n.prop('global.html.btn.ok') +'</button>' +
            ' ' +
            '<button type="button" class="btn-xs" ' +
            ' onclick="netsetting.cancelRouterRow('+uniqueID+','+flag+')">'+$.i18n.prop('global.html.btn.cancel') +'</button>';

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
            //netsetting.refreshRouterIndex();
        } else if (flag == 1) {
            // 编辑取消后 回到编辑前状态
            var editRow = netsetting.ROUTER_OLD_EDIT_ROW[uniqueID];
            $table.bootstrapTable('updateByUniqueId', {
                id: uniqueID,
                row: editRow
            });
            delete netsetting.ROUTER_OLD_EDIT_ROW[uniqueID];
        }
    },
    deleteRouteRow : function(uniqueID) {
        if ($("#form1 [name='routeIpAddr']").length > 0) {
            alertPromptMsgDlg($.i18n.prop('netsetting.js.tip.routeSetting.delete'),3);
            return;
        }
        var confirmMsg = $.i18n.prop('netsetting.js.deleteRouter.tips');
        alertConfirmationMsgDlgDetail($.i18n.prop('global.js.tip'),confirmMsg,$.i18n.prop('global.js.ok'), function () {
            // 删除
            var $table = $('#m-ns-routeset-table');
            $table.bootstrapTable('remove', {
                field: 'uniqueID',
                values: [uniqueID]
            });
            // 重刷seq
            netsetting.refreshRouterIndex();
        });
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
        if (netsetting.validateRouteRow(uniqueID, routeIpAddr, routeNetMask, routeGateWay)) {
            // 编辑 删除按钮
            var oper = '<a class="no-underline m-ns-route-edit" title="'+$.i18n.prop('netsetting.js.edit')+'" onclick="netsetting.editRouterRow('+uniqueID+','+seq+')"'
                +' href="javascript:void(0);"></a>'
                +' <a class="no-underline m-ns-route-delete" title="'+$.i18n.prop('netsetting.js.delete')+'" onclick="netsetting.deleteRouteRow('+uniqueID+')"'
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
            delete netsetting.ROUTER_OLD_EDIT_ROW[uniqueID];

            if (routeIpAddr == '0.0.0.0' && routeNetMask == '0.0.0.0') {
                // 默认路由放到第一行
                var curRow = $table.bootstrapTable('getRowByUniqueId', uniqueID);
                $table.bootstrapTable('remove', {
                    field: 'uniqueID',
                    values: [uniqueID]
                });
                $table.bootstrapTable('insertRow', {index: 0, row: curRow});
                // 重刷seq
                netsetting.refreshRouterIndex();
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
        routeIpAddr: {
            checkRequiredSpecial : $.i18n.prop('netsetting.js.valid.required'),
            checkIp : $.i18n.prop('netsetting.js.invalidate'),
            checkRouteIPAddrNotTheSame : $.i18n.prop('netsetting.js.addr.des.repeat'),
            checkIpAndMaskSameZero : $.i18n.prop('netsetting.js.IpAndMaskSameZero')
        },
        routeNetMask: {
            checkRequiredSpecial : $.i18n.prop('netsetting.js.valid.required'),
            checkMaskRequired : $.i18n.prop('netsetting.js.invalidate'),
            checkIpAndMaskSameZero : $.i18n.prop('netsetting.js.IpAndMaskSameZero')
        },
        routeGateWay: {
            checkIpNoRequired : $.i18n.prop('netsetting.js.invalidate')
        }
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
        var rules = netsetting.ROUTER_VALIDATE_RULES;
        var messages = netsetting.ROUTER_VALIDATE_MESSAGES;

        // 验证
        var ipValid = netsetting.validateRouteIpAddr(uniqueID,routeIpAddr,rules,messages);
        var netMaskValid = netsetting.validateRouteNetMask(uniqueID,routeNetMask,rules,messages);
        var gateWayValid = netsetting.validateRouteGateWay(uniqueID,routeGateWay,rules,messages);

        return ipValid && netMaskValid && gateWayValid;
    },
    editRouterRow:function(uniqueID,seq) {
        if ($("#form1 [name='routeIpAddr']").length > 0) {
            alertPromptMsgDlg($.i18n.prop('netsetting.js.tip.routeSetting.edit'),3);
            return;
        }
        var $table = $('#m-ns-routeset-table');
        var curRow = $table.bootstrapTable('getRowByUniqueId', uniqueID);
        var oldEditRow = $.extend(true,{},curRow);
        netsetting.ROUTER_OLD_EDIT_ROW[uniqueID] = oldEditRow;

        var editRow = netsetting.generateEditRow(uniqueID, curRow.dataSeq, 1, curRow);
        //下拉框 text
        var oldMetric = curRow.routerMetric;
        // 更新row
        $table.bootstrapTable('updateByUniqueId', {
            id: uniqueID,
            row: editRow
        });
        netsetting.metricSelect();
        // 设置选中
        $('#form1 [name="routeMetric"] option:contains(' + oldMetric + ')').each(function(){
            if ($(this).text() == oldMetric) {
                $(this).attr('selected', true);
                $("#form1 [name='routeMetric']").trigger('change');
            }
        });
        netsetting.addTriggerForInput();
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
