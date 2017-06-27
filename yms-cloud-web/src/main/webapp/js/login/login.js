var usernameObj = $("#username");
var passwordObj = $("#password");
var captchaObj = $("#captcha");
function readyLogin() {
    readyLanguage();
    $('#username').focus();
    filUsernamePwd();
    /*loadOutlookDownloadUrl();*/
    bindEnter("username");
    bindEnter("password");
    bindEnter("captcha");
    $("#submitLoginBtn").click(function () {
        login();
    });

    $(usernameObj).blur(function () {
        $("#errorLoginMessage").text("");
        var username = $.trim($(usernameObj).val());
        if (validateNull(username)) {
            validateutil.defaultFormErrorFmter(usernameObj, $.i18n.prop("login.js.tips.fill.username"))
            return false;
        }else{
            // if (!isAccount(username)) {
            //     validateutil.defaultFormErrorFmter(usernameObj, $.i18n.prop("login.js.tips.username.invalid"))
            // } else {
                validateutil.clearFormNodeErrorMsg(usernameObj);
                var userMap={};
                userMap=parseJsonToMap(GetCookie(cookieUsername));
                var temp=userMap[username];
                if (temp == username) {
                    fillCookiePwd(username);//填充cookie中密码
                } else {//清除填充的cookie密码
                    $(passwordObj).val("");
                }
            // }
        }
    });


    $(passwordObj).blur(function () {
        $("#errorLoginMessage").text("");
        var password = $.trim($(passwordObj).val());
        if (validateNull(password)) {
            validateutil.defaultFormErrorFmter(passwordObj, $.i18n.prop("login.js.tips.fill.password"))
            return false;
        }else{
            validateutil.clearFormNodeErrorMsg(passwordObj);
        }
    });

    //判断是否ie11，ie11密码框大写已有提示
    if (!(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject)) {
        passwordFieldLockTips("password", $.i18n.prop("system.js.common.tips.capslock"));
    }

    bindCaptchaInput();
}

function loadOutlookDownloadUrl(){
    $.ajax({
        url: getContextPath() + "/outlook/downloadUrl",
        type: "get",
        async: true,
        dataType: "json",
        success: function (result) {
            if (result.ret == 1) {
                $("#outlookUrl").removeAttr("title");
                $("#outlookUrl").attr("href",result.rows.outlookDownloadUrl);
            }else {
                $("#outlookUrl").attr("title","获取outlook下载路径失败");
            }
        },
        error: function () {
            $("#outlookUrl").attr("title","获取outlook下载路径失败");
        }
    });
}

/**
 * 绑定输入框的回车事件为登录
 * @param inputId 组件Id
 */
function bindEnter(inputId) {
    $('#' + inputId).bind('keypress', function (event) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == 13) {
            login();
            return false;
        }
    });
}

/**
 * 检查登录表单是否合法
 * @returns {Boolean}
 */
function checkLoginForm() {
    var username = $.trim($("#username").val());
    if (validateNull(username)) {
        validateutil.defaultFormErrorFmter(usernameObj, $.i18n.prop("login.js.tips.fill.username"))
        $("#username").focus();
        return false;
    }
    // if (!isAccount(username)) {
    //     validateutil.defaultFormErrorFmter(usernameObj, $.i18n.prop("login.js.tips.username.invalid"))
    //     $("#username").focus();
    //     return false;
    // }

    var password = $("#password").val();
    if (validateNull(password)) {
        validateutil.defaultFormErrorFmter(passwordObj, $.i18n.prop("login.js.tips.fill.password"))
        $("#password").focus();
        return false;
    }

    if (needCheckCaptcha() && !checkCaptcha()) {
        $("#captcha").focus();
        return false;
    }
    //restoreInputField("captcha");
    $("#errorLoginMessage").text("");


    return true;
}
function login() {
    if (!checkLoginForm()) {
        return false;
    }
    SetCookie("cookieId", generateUUID());
    var username=$.trim($("#username").val());
    var usernameMap={};
    usernameMap = parseJsonToMap(GetCookie(cookieUsername));
    usernameMap[username]=username;
    SetCookie(cookieUsername,  JSON.stringify(usernameMap));
    var des3Key = randomString(32);
    var params = {
        username: $.trim($("#username").val()),
        //fixme 加密模式
        password: DES3.encrypt(des3Key,$("#password").val()),
        captcha: $("#captcha").val(),
        des3Key: des3Key
    }
    $.ajax({
        url: getContextPath() + "/login",
        type: "post",
        async: false,
        data: params,
        dataType: "json",
        success: function (result) {
            if (result.ret == 1) {
                SetCookie(cookieLastUsername,username);
                storeCookiePwd(username);
                SetCookie("lastChooseDate", moment().format("YYYY-MM-DD HH:mm:ss")); //登陆成功把会议的查询日期记录为当天
                window.location.href = getContextPath() + "/main";
            } else {
                $('#divCaptcha').show();
                resetCookiePwd(username);
                var msg = result.message;
                if (msg.indexOf($.i18n.prop("login.js.message.contain.captcha")) != -1) {
                    $("#captcha").focus();
                    validateutil.defaultFormErrorFmter(captchaObj, msg)
                } else {
                    reloadCaptcha("img-captcha", "captcha", $("#basePath").val());
                    $(passwordObj).val("");
                    $(passwordObj).focus();
                    $("#captcha").val("");
                    $("#errorLoginMessage").text(msg);
                }
            }
        },
        error: function () {
            resetCookiePwd(username);
            reload();
        }
    });
}

/*在cookie中存储用户、密码的参数名*/
var cookieUsername = 'soft_mcu_username';
var cookiePassword = 'soft_mcu_password';
var cookieLastUsername = 'soft_mcu_last_username';
/**
 * 从cookie中获取用户信息，存在则填充
 */
function filUsernamePwd() {
    var username = GetCookie(cookieLastUsername);
    if (!validateNull(username)) {
        $('#username').val(username);
    }
    fillCookiePwd(username);
}

function fillCookiePwd(username) {
    var passMap={};
    passMap = parseJsonToMap(GetCookie(cookiePassword));
    var password;
    if(username==null||username==undefined){
        password="";
    }else {
        password = passMap[username];
    }
    if (!validateNull(password)) {
        $('#password').val(password);
        $('#rememberMe').prop("checked", true);
    }
}

//取Cookie的值
function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}
/**
 * json转map,并判空
 * @param key
 */
function parseJsonToMap(mapStr){
    var map= $.parseJSON(mapStr);
    if(map==null||map==undefined){
        map={};
    }
    return map;
}
//获取cookie中的变量值
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function storeCookiePwd(username) {
    if ($('#rememberMe').is(':checked') == true) {
        var passwordMap={};
        passwordMap=parseJsonToMap(GetCookie(cookiePassword));
        if(username==null||username==undefined){
            return;
        }
        passwordMap[username]=$("#password").val();
        SetCookie(cookiePassword,  JSON.stringify(passwordMap));
    } else {
        resetCookiePwd(username);
    }
}

function SetCookie(name, value, expires) {
    var defaultExpdate = new Date();
    defaultExpdate.setTime(defaultExpdate.getTime() + 30 * (24 * 60 * 60 * 1000));

    var argv = SetCookie.arguments;
    var argc = SetCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : defaultExpdate;
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape(value) +
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
}

function resetCookiePwd(username) {
    var passMap={};
    passMap = parseJsonToMap(GetCookie(cookiePassword));
    if(username==null||username==undefined){
        return;
    }
    delete passMap[username];
    SetCookie(cookiePassword,JSON.stringify(passMap));
}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};



/**
 * 判断字符串是否符合账号的规则
 * 英文字母、数字、下划线、点号（.），要求以英文字母开头
 * @param str
 * @returns
 */
function isAccount(str) {
    var pattern = /^([0-9a-zA-Z_\.])*$/;
    return pattern.test(str);
}
