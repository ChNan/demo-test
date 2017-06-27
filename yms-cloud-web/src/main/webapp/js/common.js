/**
 * 判断ie浏览器版本，只判断是否是ie6、ie7、ie8,ie9
 * @returns 6、7、8,9，ie版本；0，非ie6、7、8,9
 */
function IEVersion() {
    if (window.ActiveXObject) {
        var browser = navigator.appName;
        var version = navigator.appVersion.split(";");
        var trimVersion = version[1].replace(/[ ]/g, "");
        if (browser == "Microsoft Internet Explorer") {
            switch (trimVersion) {
                case "MSIE6.0":
                    return 6;
                case "MSIE7.0":
                    return 7;
                case "MSIE8.0":
                    return 8;
                case "MSIE9.0":
                    return 9;
                default:
                    return 0;
            }
        }
    }
    return 0;
}

/**
 * 还原表单输入框的效果.</br> 命名规则：</br> 错误域所在的div 以div+错误域的ID</br> 错误域外层的span
 * 以span+错误域的ID</br> 错误提示标签icon 以icon+错误域的ID</br> 错误信息lable 以error+错误域的ID</br>
 *
 * @param fieldId
 *            错误域的Id，例如projectTitle
 */
function restoreInputField(fieldId) {
    var newFileldId = fieldId.substr(0, 1).toLocaleUpperCase()
        + fieldId.slice(1);
    $("#div" + newFileldId).removeClass("has-error");
    $("#div" + newFileldId).removeClass("has-success");
    $("#icon" + newFileldId).removeClass("icon-warning-sign icon-large");
    $("#icon" + newFileldId).removeClass("icon-ok-sign icon-large");
    $("#error" + newFileldId).html("&nbsp;");
}
/**
 * 渲染表单输入框错误域的效果.</br> 命名规则：</br> 错误域所在的div 以div+错误域的ID</br> 错误域外层的span
 * 以span+错误域的ID</br> 错误提示标签icon 以icon+错误域的ID</br> 错误信息lable 以error+错误域的ID</br>
 *
 * @param isSuccess
 *            渲染状态 success时为true； error时为false
 * @param fieldId
 *            错误域的Id，例如projectTitle
 * @param errorMsg
 *            错误的提示信息，例如:名称不能为空
 */
function renderInputField(isSuccess, fieldId, errorMsg) {
    var newFileldId = fieldId.substr(0, 1).toLocaleUpperCase()
        + fieldId.slice(1);
    if (isSuccess) {
        $("#div" + newFileldId).removeClass("has-error");
        $("#icon" + newFileldId).removeClass("icon-warning-sign icon-large");
        $("#error" + newFileldId).html("&nbsp; ");
    } else {
        $("#div" + newFileldId).removeClass("has-success");
        $("#div" + newFileldId).addClass("has-error");
        $("#span" + newFileldId).addClass("block input-icon input-icon-right");
        $("#icon" + newFileldId).removeClass("icon-ok-sign icon-large");
        $("#icon" + newFileldId).addClass("icon-warning-sign icon-large");
        $("#error" + newFileldId).text(errorMsg);
    }
}


function setMessage(messageId, message) {
    if (!validateNull(messageId)) {
        $("#" + messageId).text(message);
    }
}


/**
 * 检测Caps Lock键是否打开
 *
 * @param e
 */
function checkCapsLock(e) {
    var valueCapsLock = e.keyCode ? e.keyCode : e.which; // 判断Caps
    // Lock键是否按下
    var isShift = e.shiftKey || (e.keyCode == 16) || false; // shift键是否按住
    if ((valueCapsLock >= 65 && valueCapsLock <= 90) && !isShift
        || (valueCapsLock >= 97 && valueCapsLock <= 122) && isShift) {
        return true;
    } else {
        return false;
    }
}
/**
 /**
 * 弹出消息提示框
 *
 * @param message
 *            提示的消息
 * @param type
 *            提示消息的类型, 1:success, 2:warn, 3:error。默认为0
 * @param callbackFunction
 * @param arrArgs
 *            回调函数的名称，不需要以字符串的形式传递
 *
 */
function alertPromptMsgDlg(message, type, callbackFunction) {
    clearRenderPromptMsgDlg();
    if (type == 1) {
        $('#promptModal .modal-body').html("<div class='m-modal-icon m-modal-icon-right' id='m-modal-icon'></div><span style='font-size: 22px;color: #444444'>" + message + "</span>");

        $('#promptModal .modal-body').css('padding-bottom',40)
        $('#promptModal .modal-dialog').css({
            width:'446px',
            height:'240px'
        })
        $('#promptModal').modal('show');
        $('body .modal-backdrop').css('background-color','transparent');
        setTimeout(function(){
            $('#promptModal').modal('hide')
            if (callbackFunction) {
                callbackFunction();
            }
        },3000);
    } else  {
        errorMsgDlg(message, type, callbackFunction)
    }
}
/**
 /**
 * 弹出消息提示框
 *
 * @param message
 *            提示的消息
 * @param type
 *            提示消息的类型, 1:success, 2:warn, 3:error。默认为0
 * @param callbackFunction
 * @param arrArgs
 *            回调函数的名称，不需要以字符串的形式传递
 *
 */
function alertPromptMsgDlgWithDiyContent(content, type, callbackFunction) {
    clearRenderPromptMsgDlg();
    $('#promptModal .modal-body').html("<div class='m-modal-icon m-modal-icon-right' id='m-modal-icon'></div>" + content);

    $('#promptModal .modal-body').css('padding-bottom',40)
    $('#promptModal .modal-dialog').css({
        width:'446px',
        height:'240px'
    })
    $('#promptModal').modal('show');
    $('body .modal-backdrop').css('background-color','transparent');
    setTimeout(function(){
        $('#promptModal').modal('hide')
        if (callbackFunction) {
            callbackFunction();
        }
    },3000);
}
function errorMsgDlg(message, type, callbackFunction){

    $('#promptModalWithbtn .modal-body').html("<span style='font-size: 14px;color: #444444'>" + message + "</span>");

    $('#promptModalWithbtn .modal-body').css('padding-bottom',40)
    $('#promptModalWithbtn .modal-dialog').css({
        width:'446px'
    })
    $('#promptModalWithbtn').modal('show');

    $("#promptModalWithbtn, .close").click(function () {
        if (callbackFunction != null
            && callbackFunction != ''
            && callbackFunction != undefined) {
            callbackFunction();
            callbackFunction = null;
        }
    });

}


/**
 * 清除弹窗的渲染样式
 */
function clearRenderPromptMsgDlg() {
    $('#promptModalBody').removeClass("alert");
    $('#promptModalBody').removeClass("alert-success");
    $('#promptModalBody').removeClass("alert-warning");
    $('#promptModalBody').removeClass("alert-danger");
    $('#promptModalBody').removeClass("alert-info");
}

/**
 * 参数[标题、提示信息、确认按钮文字、回调函数、回调函数参数...]
 */
function alertConfirmationMsgDlgDetail() {

    // 获取传入参数
    var args = arguments;
    if (args && args.length < 2) {
        return;
    }

    // 将参数数组转化为Array类型的数组
    var arrArgs = new Array();
    for (var i = 0; i < args.length; i++) {
        arrArgs[i] = args[i];
    }

    var title = arrArgs.shift();
    var message = arrArgs.shift();
    var okBtn = arrArgs.shift();
    var callbackFunction = arrArgs.shift();

    $('#confirmModalTitle').html(title);
    $('#confirmModalBody').html(message);
    $("#confirmModalOkBtn").html(okBtn).one('click', function () {
        if (arrArgs.length >= 1) {
            callbackFunction.apply(this, arrArgs);
        } else {
            callbackFunction();
        }
    });
    $('#confirmModal').on('hide.bs.modal', function () {
        $('#confirmModalOkBtn').unbind();
    });
    $('#confirmModal').modal('show');
}

function alertDiyPromptMsgDlg(title, message, type, callbackFunction) {
    $('#promptModalBody').html("<i id='icon-class' class=' icon-large'/>" + message);
    clearRenderPromptMsgDlg();
    if (type == 1) {
        $('#icon-class').addClass("icon-ok-sign custom-success");
    } else if (type == 2) {
        $('#icon-class').addClass("icon-exclamation-sign custom-warn");
    } else if (type == 3) {
        $('#icon-class').addClass(" icon-remove-sign custom-failed");
    }
    $('#promptModal .custom-modal-title').html(title);
    $('#promptModal').on(
        'shown.bs.modal',
        function () {
            $("#promptModalOkBtn,.close.custom-close").click(
                function () {
                    if (callbackFunction != null
                        && callbackFunction != ''
                        && callbackFunction != undefined) {
                        callbackFunction();
                        callbackFunction = null;
                    }
                });
        });
    $('#promptModal').modal('show');
}

/**
 * 产生随机字符串
 * @param 字符串长度
 * @returns 随机字符串
 */
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnoprstuvwxyz012345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
/**
 * 产生随机数字
 * @param 字符串长度
 * @returns 随机字符串
 */
function randomNumberPwd(len) {
    len = len || 32;
    var $chars = '0123456789';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}


function executePageModel(ret) {
    var pageArray = getPageNoArray(ret.rows.totalPages);
    return {"pageModel": ret.rows, "pageArray": pageArray};
}
function getPageNoArray(totalPage) {
    var pages = new Array();
    for (var i = 1; i <= totalPage; i++) {
        pages.push(i);
    }
    return pages;
}


function validateNull(name) {
    if (name == null || $.trim(name) == "" || name.length == 0) {
        return true;
    } else {
        return false;
    }
}

var staffAccountSearch = {
    staffAccountSearchInit: {
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
    },
    StaffAccountNode: function (id, name, namePinyin, namePinyinAlia, accountUsername,
                                accountId, treeId, email, originalName, icon,extra,isCreator) {
        this.id = id;
        this.name = name;
        this.fullName = name;
        this.namePinyin = namePinyin;
        this.namePinyinAlia = namePinyinAlia;
        this.accountUsername = accountUsername;
        this.accountId = accountId;
        this.treeId = treeId;
        this.icon = icon;
        this.email = email;
        this.originalName = originalName;
        this.extra = extra;
        this.isCreator = isCreator;
    },
    searchFilter: function (node, key) {
        if (validateNull(key)) {
            return false;
        }
        key = $.trim(key).toLocaleLowerCase();

        if (!validateNull(node.name)) {
            if (node.name.toLocaleLowerCase().indexOf(key) != -1) {
                return true;
            }
        }

        if (!validateNull(node.namePinyin)) {
            if (node.namePinyin.toLocaleLowerCase().indexOf(key) != -1) {
                return true;
            }
        }

        if (!validateNull(node.namePinyinAlia)) {
            if (node.namePinyinAlia.toLocaleLowerCase().indexOf(key) != -1) {
                return true;
            }
        }
        if (!validateNull(node.accountUsername)) {
            if (node.accountUsername.toLocaleLowerCase().indexOf(key) != -1) {
                return true;
            }
        }
        return false;
    }
}

var searchOperate = {
    clearSearchDiv: function (div) {
        $("#" + div).find('input').val("");
        $("#" + div).find('#result_ul').html("");
        $("#" + div).find('#result_div').hide();
    }
}

/**
 * 获取绝对路径
 * 目前jsp中绝对路径赋值给id为projectContext或basePath
 * @returns 系统绝对路径
 */
function getContextPath() {
    var contextPath = $("#projectContext").val();
    if (validateNull(contextPath)) {
        contextPath = $("#basePath").val();
    }
    if (validateNull(contextPath)) {
        contextPath = "";
    }
    return contextPath;
}
/**
 * 密码输入框大写锁定提示
 * @param pwdId 密码输入框组件Id
 * @param msg 大写锁定提示语
 */
function passwordFieldLockTips(pwdId, msg) {
    $("#" + pwdId).keypress(function (event) {
        if (checkCapsLock(event)) {
            restoreInputField(pwdId);
            var newFieldId = pwdId.substr(0, 1).toLocaleUpperCase() + pwdId.slice(1);
            $("#error" + newFieldId).text(msg)
            $("#errorLoginMessage").text(msg);
            $("#" + pwdId).attr("isCapsLock", "1");
        } else {
            if ($("#" + pwdId).attr("isCapsLock") == "1") {
                $("#" + pwdId).removeAttr("isCapsLock");
                restoreInputField(pwdId);
                $("#errorLoginMessage").text("");
            }
        }
    });

    $("#" + pwdId).blur(function () {
        if ($("#" + pwdId).attr("isCapsLock") == "1") {
            $("#" + pwdId).removeAttr("isCapsLock");
            restoreInputField(pwdId);
            $("#errorLoginMessage").text("");
        }
    });
}
function logout() {
    location.href = getContextPath() + "/logout";
}
function returnLogin() {
    location.href = getContextPath() + "/";
}

function reload() {
    window.location.reload();
}

/**
 * 显示进度条加载进度条 进度条div已经在header.jsp中定义
 *
 * @param prompt
 *            提示语的参数，如果未定义则使用默认的(请稍等...)作为提示语
 */
var gbarCalc;
function showProgress(prompt) {
    //
    if($("#progressBarModal").length >0 ){
        $("#progressBarModal").modal('show');
        $('#progressBarModal .progress-bar').css('width', '0%');
        $('#progressValueshow').text( '0%');
        $('#progressBarFooter').text( prompt);

        //假进度条
        var count = 12;
        var i = 1;
        var progressTotal = 20;
        gbarCalc = setInterval(function () {
            console.log(i);
            if (i <= count - 7) {
                progressTotal = progressTotal + 10;
            } else if (i <= count - 4) {
                progressTotal = progressTotal + 5;
            } else if (i <= count) {
                progressTotal = progressTotal + 3;
            }
            $('#progressBarModal .progress-bar').css('width', progressTotal + '%');
            $('#progressValueshow').text(progressTotal + '%');
            i++;
        }, 200);
    }else{

        if (prompt == "" || prompt == undefined) {
            prompt = $.i18n.prop("system.js.common.please.wait");
        }
        $("#progressBarTitle").text(prompt);
        $("#modalProgressBar").modal();

    }
}

/**
 * 隐藏进度条
 */
function hideProgressBar() {
    if($("#progressBarModal").length >0 ){
        $('#progressValueshow').text( '100%');
        $('#progressBarModal .progress-bar').css('width', '100%');
        clearInterval(gbarCalc);
        setTimeout(function(){
            $("#progressBarModal").modal('hide');
        },100)
    }else{
        $("#modalProgressBar").modal('hide');
        $(".btn-loading").button('reset');
    }

}

/**
 * 字符串前导零位填充
 * @param str
 * @param miniSize
 * @returns {string}
 */
function zeroPreFill(str, miniSize) {
    if(str.length >= miniSize) {
        return str;
    }
    var tempZeroStr = "";
    for(var i=0; i < miniSize; i++) {
        tempZeroStr += 0;
    }
    var s = tempZeroStr + str;
    return s.substr(s.length - miniSize);
}

/**
 * 拦截方法
 * 调用方式：intercept(window, "hello", fn);
 * @param example 遍历对象
 * @param funName 需要拦截的方法名
 * @param fun 拦截后执行的方法
 */
function intercept(example, funName, fun){
    Object.getOwnPropertyNames(example).forEach(function (property) {
        var original = example[property];
        if (typeof original === "function" && original.name == funName) {
            example[property] = function () {
                if(fun){
                    fun(property);
                }else{
                    return false;
                }
                original.apply(example, Array.prototype.slice.call(arguments));
            }
        }
    });
}

/**
 * 控制ip输入框输入
 */
function ctlIpInput() {
    //ip地址格式输入框限制输入 英文汉字及其他特殊字符
    $('.ipFormatInput').css("ime-mode", "disabled").attr('maxLength','255').on('keypress', function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        var copyPasteArr = [67,99,86,118,88,120];

        if ((code >= 48 && code <= 57) || code == 46 ||
            code==0x08 || code==0x09
            || (copyPasteArr.indexOf(code)!=-1 && e.ctrlKey)) {
            return true;
        } else {
            return false;
        }
    }).on('keyup', function(){
        // 非数字和. 则自动删除
        var reg=/([^\d\.]*)/g;
        $(this).val($(this).val().replace(reg,''));
    }).on('paste',function(){
        var _self = this;
        setTimeout(function(){
            var reg=/([^\d\.]*)/g;
            $(_self).val($(_self).val().replace(reg,''));
        },100);
    }).on('dragenter', function(){
        return false;
    });
}



function setLan(language) {
    var d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "language=" + escape(language) + "; " + expires + "; path=/";
};

function getLan(){
    var lan = navigator.language || navigator.userLanguage;
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == 'language') {
            lan = unescape(temp[1]);
        }
    }
    return lan;
}
function readyLanguage(){
    // 同步前后台的语言
    $('.c-lan li').off('click').on('click',function(){
        if($(this).hasClass('active')){
            return;
        }
        var val = $(this).data('val');
        var text = $(this).text();

        /*这段是改变dropdown的效果，如果是JSP，该效果直接在页面做了，不需要用js,如果是html可以参考下*/
        //$(this).addClass('active');
        //$(this).siblings().removeClass('active');
        //$(this).parents('li').find('a:first').html(text + ' <span class="caret">');

        $.post('/system/locale/change',{language:val},function(result){
            if(result.success){
                setLan(val);
                window.location.reload();
            }
        })
    })

    $.i18n.properties({
        name: ['message'],
        path: '/i18n/',
        mode: 'map',
        language: window['getLan']?getLan():'en-US'
    });
}

/*之前移除这个方法可能使底下的Array原型链方法添加成功，有些地方使用for in方式遍历没有判断元素是不是自有属性，可能运行出错*/
//FIXME 带Array添加的原型链方法去除后，将这个移除
template.helper('s', function () {
    
});


function formIsDirty(form) {
    if(!form) return false;
    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];
        var type = element.type;
        if (type == "checkbox" || type == "radio") {
            if (element.checked != element.defaultChecked) {
                return true;
            }
        }
        else if (type == "hidden" || type == "password" ||
            type == "text" || type == "textarea") {
            if (element.value != element.defaultValue) {
                return true;
            }
        }
        else if (type == "select-one" || type == "select-multiple") {
            for (var j = 0; j < element.options.length; j++) {
                if (element.options[j].selected !=
                    element.options[j].defaultSelected) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getTablePageSizeForBS(id) {
    var selpageSize = 50;
    if (managerTableSelSizeCache[id]) {
        selpageSize = managerTableSelSizeCache[id];
    }
    return selpageSize;
}



//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e){
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源
    var t = obj.type || obj.getAttribute('type');//获取事件源类型

    //获取作为判断条件的事件类型
    var vReadOnly = obj.readOnly || obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
    vReadOnly = (!vReadOnly) ? false : vReadOnly;
    vEnabled = (!vEnabled) ? true : vEnabled;

    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1=(ev.keyCode == 8 &&
    (t == "password" || t == "text" || t == "textarea") &&
    (vReadOnly || !vEnabled))? true:false;
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")? true:false;
    if(flag2){
        return false;
    }
    if(flag1){
        return false;
    }
}

/**
 * 设置或者获取url参数.<br/> 如果没有value值，则直接返回url <br/> 如果url已存在该参数名称和值，则替换值<br/>
 * 如果不存在，则根据是否有?添加参数
 * @author liyl
 * @since 2014-11-3
 * @param url 要设置的url，例如：/rdmp/project/list
 * @param name 参数名称,例如：title
 * @param value 参数值，例如：需求
 * @return /rdmp/project/list?title=需求
 *
 */
function setUrlParam(url, name, value) {
    if (getUrlParam(url, name) == "") {
        url = deleteUrlParam(url, name);
    }
    var reg = new RegExp("(\\\?|&)" + name + "=([^&]*)(&|$)", "i");
    var m = url.match(reg);
    // 如果值为空，就去掉该参数项
    if (value == null || value == undefined || value == '') {
        url = deleteUrlParam(url, name);
        return url;
    }
    if (m) {
        return (url.replace(reg, function($0, $1, $2) {
            return ($0.replace($2, escape(value)));
        }));
    } else {
        if (url.indexOf('?') == -1) {
            return (url + '?' + name + '=' + escape(value));
        } else {
            return (url + '&' + name + '=' + escape(value));
        }
    }
}

function deleteUrlParam(url, name) {
    // 重写
    name += "=";// 防止查找到 value 为title的
    var idxOfName = url.indexOf(name);
    if (idxOfName == -1) {
        return url;
    }
    var cart = url.charAt(idxOfName - 1);// 查看该参数是在url的什么位置
    // 以name的参数为起始位置，截断参数字符串
    var tmpUrlParams = url.substring(idxOfName, url.length);
    var baseUrl = url.substring(0, idxOfName);
    // 查找该字符串的第一个& 也可能为空
    var idxOfAmp = tmpUrlParams.indexOf("&");
    if (idxOfAmp == -1) {
        // 未找到&，即要删除的参数为最后一个
        return baseUrl.substring(0, baseUrl.length - 1);
    }
    // 找到了&
    // 如果该参数的前一个字符为 ?
    tmpUrlParams = tmpUrlParams
        .substring(idxOfAmp + 1, tmpUrlParams.length + 1);
    return baseUrl + tmpUrlParams;
}

function getUrlParam(url, name) {
    var reg = new RegExp("(\\\?|&)" + name + "=([^&]*)(&|$)", "i");
    var m = url.match(reg);
    if (m) {
        return m[2];
    }
    return "";
}

/**
 *  格式化持续时间
 * @param duration 持续时间，单位：s
 * @returns {string}
 */
function durationFormat(duration) {
    var h=0;
    var m=0;
    var s=0;
    if(duration >= 3600) {
        h  = parseInt(duration / 3600);
        duration %= 3600
    }
    if(duration > 60) {
        m  = parseInt(duration / 60);
        duration %= 60
    }
    s = parseInt(duration);
    h = (h >= 10)? h : ((h)? "0" + h : "00");
    m = (m >= 10)? m : ((m)? "0" + m : "00");
    s = (s >= 10)? s : ((s)? "0" + s : "00");
    return h + ":" + m + ":" + s;
}

/**
 * 格式化起止时间
 * @param start 开始时间戳
 * @param end   结束时间戳
 * @returns {string}
 */
function startEndTimeFormat(start, end) {
    var startDate = moment(start).format("YYYY/MM/DD");
    var endDate = moment(end).format("YYYY/MM/DD");
    var startDateTime = moment(start).format("YYYY/MM/DD HH:mm:ss");
    return startDateTime + " - " + ((startDate == endDate)? moment(end).format("HH:mm:ss") : moment(end).format("YYYY/MM/DD HH:mm:ss"));
}



function getZoneDisplay( zoneOffset) {
    var offset =zoneOffset *60;//将偏移量转化为小时（小数去除不要）
    var hour = parseInt((offset/3600));
    //偏移量对小时取余数，得到小数（以毫秒为单位）
    var decimals = offset % 3600;
    //显示为09:30分钟形式
    var decimalsZone = (decimals / 3600) * 60 / 100;
    var sAdd = "";
    if (hour >= 0) {
        sAdd = "+";
    } else {
        sAdd = "-";
    }
    hour = hour > 0 ? hour : -hour;
    var sHour = hour + "";
    if (sHour.length == 1) {
        sHour = '0' + sHour;
    }
    decimalsZone = decimalsZone < 0 ? -decimalsZone : decimalsZone;
    var sDecimalsZone = decimalsZone + "";
    sDecimalsZone = sDecimalsZone.substring(2);
    if (sDecimalsZone.length == 0) {
        sDecimalsZone = sDecimalsZone + '00';
    } if (sDecimalsZone.length == 1) {
        sDecimalsZone = sDecimalsZone + '0';
    } else if (sDecimalsZone.length >= 3) {
        sDecimalsZone = sDecimalsZone.substring(0, 2);
    }
    return ( "UTC" + sAdd + sHour + ':' + sDecimalsZone);
}