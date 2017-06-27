/* A JavaScript implementation of the RSA Data Security,Inc. MD5 Message Digest Algorithm,as defined in RFC 1321.*/
function MDH(num) {
    var c = "0123456789abcdef";
    str = "";
    for (j = 0; j <= 3; j++)str += c.charAt((num >> (j * 8 + 4)) & 0x0F) + c.charAt((num >> (j * 8)) & 0x0F);
    return str
}
function MD(str) {
    nblk = ((str.length + 8) >> 6) + 1;
    blks = new Array(nblk * 16);
    for (i = 0; i < nblk * 16; i++)blks[i] = 0;
    for (i = 0; i < str.length; i++)blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks
}
function MDA(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF)
}
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}
function cmn(q, a, b, x, s, t) {
    return MDA(rol(MDA(MDA(a, q), MDA(x, t)), s), b)
}
function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
}
function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t)
}
function MD5(str) {
    x = MD(str + '');
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = MDA(a, olda);
        b = MDA(b, oldb);
        c = MDA(c, oldc);
        d = MDA(d, oldd);
    }
    return MDH(a) + MDH(b) + MDH(c) + MDH(d)
}

/**
 * 忘记密码申请初始化
 */
function readyForgotPwd() {
    $('#username').focus();
    $("#username").blur(function() {
        validateUsername("username");
    });

    $('#email').blur(function () {
        validateMail('email');
    });

    $('#captcha').blur(function () {
        checkCaptcha();
    });

    $("#forgotSub").click(function () {
        forgotPwd();
        return false;
    });
    bindEnterForForgot('email');
    bindEnterForForgot('captcha');
    bindEnterForForgot('username');
    bindCaptchaInput('m-fgpwd-captchaError');
}

/**
 * 绑定输入框的回车事件为登录
 * @param inputId 组件Id
 */
function bindEnterForForgot(inputId) {
    $('#' + inputId).bind('keypress', function (event) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode == 13) {
            forgotPwd();
            return false;
        }
    });
}

/**
 * 忘记密码申请提交
 */
function forgotPwd() {
    if(!validateUsername("username"))
        return false;
    if (!validateMail('email'))
        return false;
    if (!checkCaptcha()) {
        return false;
    }

    var params = {
        username: $.trim($("#username").val()),
        mail: $.trim($("#email").val()),
        captcha: $("#captcha").val()
    }
    $.ajax({
        url: getContextPath() + "/account/password/submitResetApply",
        type: "post",
        async: true,
        data: params,
        dataType: "json",
        success: function (result) {
            alertPromptMsgDlg(result.message, 2, reload);
        },
        error: function () {
            alertPromptMsgDlg("重置密码失败，请稍后重试...", 3);
        }
    });
}

/**
 * 刷新忘记密码申请页面
 */
function refresh() {
    window.location = $("#projectContext").val() + "/account/password/forwardToForgot";

}


function validateUsername(inputId) {
    var inputObj = $("#" + inputId);
    var value = $.trim($(inputObj).val());
    if (validateNull(value)) {
        validateutil.defaultFormErrorFmter($(inputObj), $.i18n.prop("account.js.validator.username.null"));
        return false;
    }

    if (!isAccount(value)) {
        validateutil.defaultFormErrorFmter($(inputObj), $.i18n.prop("login.js.tips.username.invalid"));
        return false;
    } else {
        validateutil.clearFormNodeErrorMsg($(inputObj));
        return true;
    }
}

/**
 * 校验邮箱格式
 * @param 邮箱组件的id
 * @returns boolean
 */
function validateMail(inputId) {
    var inputObj = $("#" + inputId);
    var value = $.trim($(inputObj).val());
    if (!validateNull(value)) {
        if (!isMail(value)) {
            validateutil.defaultFormErrorFmter($(inputObj), $.i18n.prop("account.js.tips.invalid.email"))
            return false;
        } else {
            validateutil.clearFormNodeErrorMsg($(inputObj))
            return true;
        }
    } else {
        validateutil.defaultFormErrorFmter($(inputObj), $.i18n.prop("account.js.tips.fill.email"))
        return false;
    }
}
// email的判断。
function isMail(mail) {
    if (validateNull(mail)) {
        return false;
    }
    return (new RegExp(
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
        .test(mail));
}
/**
 * 忘记密码之后的重置密码
 */
function readyResetPwdAfterForgot() {
    $("#newPassword").focus();
    $("#newPassword").blur(function () {
        validateNewPwd("newPassword", "repeatPassword");
    });

    $("#submitResetPwdBtn").click(function () {
        resetPwdAfterForgot();
        return;
    });

    $("#repeatPassword").blur(function () {
        validateRepeatPwd("newPassword", "repeatPassword");
    });

}

/**
 * 校验重复密码输入框
 * @param newPwdId 新密码输入框id
 * @param repeatPwdId 重复密码输入框id
 * @returns boolean
 * 重复密码是否为空、是否与输入的新密码相等
 */
function validateRepeatPwd(newPwdId, repeatPwdId) {
    var value = $("#" + repeatPwdId).val();
    var newPswValue = $("#" + newPwdId).val();
    if (!validateNewPwd(newPwdId, repeatPwdId)) {
        return false;
    }
    if (validateNull(value)) {
        renderInputField(false, repeatPwdId, $.i18n.prop("account.js.tips.password.fill.repeatPwd"));
        return false;
    } else if (value != newPswValue) {
        renderInputField(false, repeatPwdId, $.i18n.prop("account.js.tips.password.not.consistent"));
        return false;
    } else {
        renderInputField(true, repeatPwdId, "");
        return true;
    }
}

/**
 * 校验新密码输入框
 * @param newPwdId 新密码输入框id
 * @param repeatPwdId 重复密码输入框id，新密码不正确后要清除重复密码输入框的渲染
 * @returns boolean
 * 新密码是否为空、至少8位、至少一个字母数字
 */
function validateNewPwd(newPwdId, repeatPwdId) {
    var value = $("#" + newPwdId).val();
    var repeatValue = $("#" + repeatPwdId).val();
    restoreInputField(repeatPwdId);
    if (validateNull(value)) {
        renderInputField(false, newPwdId, $.i18n.prop("account.js.tips.password.fill.newPwd"));
        restoreInputField(repeatPwdId);
        return false;
    } else if (value.length < 8) {
        renderInputField(false, newPwdId, $.i18n.prop("account.js.tips.password.6.characters.min"));
        restoreInputField(repeatPwdId);
        return false;
    } else if (value.length > 64) {
        renderInputField(false, newPwdId, $.i18n.prop("account.js.tips.password.16.characters.max"));
        restoreInputField(repeatPwdId);
        return false;
    } else if (!validateNull(repeatValue) && value != repeatValue) {
        renderInputField(false, repeatPwdId, $.i18n.prop("account.js.tips.password.not.consistent"));
        return false;
    } else {
        renderInputField(true, newPwdId, "");
        restoreInputField(repeatPwdId);
        return true;
    }
}
/**
 * 忘记密码之后的重置密码提交
 */
function resetPwdAfterForgot() {
    if (!validateNewPwd("newPassword", "repeatPassword")) {
        $("#newPassword").focus();
        return;
    }
    if (!validateRepeatPwd("newPassword", "repeatPassword")) {
        $("#repeatPassword").focus();
        return;
    }
    var des3Key = randomString(32);
    var params = {
        newPassword: DES3.encrypt(des3Key, $("#newPassword").val()),
        activeCode: $("#activeCode").val(),
        des3Key:des3Key
    }
    showProgress($.i18n.prop('account.js.tips.password.fill.reseting'));
    setTimeout(function(){
        $.ajax({
            url: "reset",
            type: "post",
            async: false,
            data: params,
            dataType: "json",
            success: function (result) {
                hideProgressBar();
                var type = (result.success) ? 1 : 2;
                var message = result.message;
                alertPromptMsgDlg(result.message, type, function () {
                    if (result.success) {
                        window.location = getContextPath() + '/';
                    }
                });
            },
            error: function () {
                alertPromptMsgDlg("重置密码失败,请稍后重试...", 3);
            }
        });
    },500);
}

function isAccount(str) {
    var pattern = /^([0-9a-zA-Z_\.])*$/;
    return pattern.test(str);
}