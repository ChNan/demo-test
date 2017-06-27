/**
 * 重新加载验证码
 * @param imgId 验证码图片id
 * @param inputId 验证码输入框id
 * @param contextPath 系统基本路径
 */
function reloadCaptcha() {
    var captchaId = "captcha";
    var captchaImgId = "img-captcha";
    var createCaptchaUri = "/createCaptcha";
    document.getElementById(captchaImgId).src = getContextPath() + createCaptchaUri + "?nocache=" + new Date().getTime();
    $("#" + captchaId).val("");
    $("#" + captchaId).attr("checked", false);
}
/**
 * 对验证码输入框进行绑定，在初始化页面时调用.</br>
 * 默认验证码输入框id：captcha</br>
 * 默认验证码图片id：img-captcha</br>
 * 默认创建验证码请求uri：/createCaptcha</br>
 * 默认校验验证码请求uri：/checkCaptcha</br>
 * <li>加载验证码图片</li>
 * <li>绑定验证码输入框焦点丢失效果</li>
 * <li>绑定验证码输入框keyup事件</li>
 * @param captchaId 验证码输入框的id
 * @param contextPath 系统基本路径
 * @param messageId 验证码提示组件id,可为空
 *
 */
function bindCaptchaInput() {
    var captchaId = "captcha";
    var captchaImgId = "img-captcha";
    var createCaptchaUri = "/createCaptcha";
    var captchaObj = $("#" + captchaId);
    document.getElementById(captchaImgId).src = getContextPath() + createCaptchaUri;

    $(captchaObj).blur(function () {
        $("#errorLoginMessage").text("");
        if (!validateNull($("#" + captchaId).val())) {
            checkCaptcha();
        }
    });
    $(captchaObj).keyup(function (event) {
        $("#errorLoginMessage").text("");
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode != 13) {//屏蔽回车事件，防止回车登陆时再次进行验证码校验而导致错误
            $(captchaObj).attr("checked", false);
            var length = $(captchaObj).val().length;
            if (length < 4) {
                $("#divCaptcha").removeClass("has-error");
                validateutil.clearFormNodeErrorMsg($(captchaObj));
            } else if (length == 4) {
                submitCaptcha();
            } else {
                $("#divCaptcha").removeClass("has-success").addClass("has-error");
                validateutil.defaultFormErrorFmter($(captchaObj),$.i18n.prop("system.js.common.tips.captcha.error"))
            }
        }
    });
}
/**
 * 到后台验证验证码
 * @param captchaId 验证码输入框的id
 * @param contextPath 系统基本路径
 * @param messageId 验证码提示组件id,可为空
 * @returns {Boolean} true:验证码正确
 */
function submitCaptcha() {
    var captchaId = "captcha";
    var checkCaptchaUri = "/checkCaptcha";
    var captchaObj =$("#" + captchaId);
    if ($(captchaObj).attr("checked")) {
        return $("#divCaptcha").attr("class").indexOf("has-error") == -1;
    }
    var result = false;
    var inputCaptcha = $(captchaObj).val();
    var checkUrl = getContextPath() + checkCaptchaUri + "?inputCaptcha=" + $.trim(inputCaptcha);
    $.ajax({
        url: checkUrl,
        type: "post",
        async: false,
        dataType: "json",
        success: function (msg) {
            $(captchaObj).attr("checked", true);
            if(msg.success){
                $("#divCaptcha").removeClass("has-error")
                validateutil.clearFormNodeErrorMsg($(captchaObj));
            }else{
                $("#divCaptcha").addClass("has-error");
                validateutil.defaultFormErrorFmter($(captchaObj), msg.message);
            }
            result = msg.success;
        },
        error: function () {
            alertPromptMsgDlg($.i18n.prop("system_common_captcha_check_failed"), 3);
        }
    });
    return result;
}

/**
 * 校验验证码<br>
 * jsp中定义验证码的id为captcha
 * @param messageId 验证码提示组件id,可为空
 * @returns {Boolean} true:验证码正确
 */
function checkCaptcha() {
    var captchaId = "captcha";
    var captchaObj = $("#" + captchaId);
    var captcha = $.trim($(captchaObj).val());

    if (validateNull(captcha)) {
        $("#" + captchaId).attr("checked", true);
        validateutil.defaultFormErrorFmter($(captchaObj), $.i18n.prop("system.js.common.tips.fill.captcha"))
        return false;
    }
    if (captcha.length != 4 && captcha.length != 0) {
        $("#" + captchaId).attr("checked", true);
        validateutil.defaultFormErrorFmter($(captchaObj), $.i18n.prop("system.js.common.tips.captcha.error"))
        return false;
    }
    if (captcha.length == 4) {
        return submitCaptcha();
    }
}
function needCheckCaptcha() {
    return $('#divCaptcha').is(':hidden') == false;
}