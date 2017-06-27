<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="zh-cn">
<style>
    body .modal{
        top: 20%;
    }
</style>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 忘记密码 -->
    <title><spring:message code="account.password.forgot.title"/></title>
    <link href="${pageContext.request.contextPath}/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/login.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/global.css?${sessionScope.cacheTime}" rel="stylesheet">
</head>
<body>
    <div class="m-login-container">
        <%@include file="../common/language_drop.jsp" %>

        <div class="m-login-logo">
            <img src="../img/login/logo.png">
        </div>
        <div class="m-login">
            <div class="m-form">
                <!-- 忘记密码 -->
                <div><p class="m-login-title"><spring:message code="account.password.forgot.title"/></p></div>
                <form  role="form" onsubmit="return false;" id="forgotForm">
                    <div class="form-group m-fgpwd-notice">
                        <span><spring:message code="account.password.forgot.reset.mailtips"/></span>
                    </div><!-- 输入您注册时所使用的邮箱,系统将向您的电子邮箱地址发送重置密码链接 -->
                    <div class="form-group">
                        <label id="m-fgpwd-usernameError" class="m-error-message"></label>
                        <!-- 账号 -->
                        <input type="text" class="form-control m-login-usn" placeholder='<spring:message code="account.password.forgot.username"/>'
                               id="username" maxlength="16" name="email" autofocus/>
                    </div>
                    <div class="form-group">
                        <label id="m-fgpwd-emailError" class="m-error-message"></label>
                        <!-- 邮箱 -->
                        <input type="text" class="form-control m-login-mail" placeholder='<spring:message code="account.password.forgot.mailbox"/>' id="email" maxlength="128"
                               name="email" autofocus/>
                    </div>

                    <div class="form-group  m-login-cap" id="divCaptcha">
                        <label id="m-fgpwd-captchaError" class="m-error-message"></label>
                        <!-- 验证码 -->
                        <input class="form-control input-no-radius" id="captcha" maxlength="4" autocomplete="off"
                               onkeyup="value=value.replace(/[^\w]|_/ig,'')"
                               title='<spring:message code="account.password.forgot.captach"/>'
                               placeholder='<spring:message code="account.password.forgot.captach"/>'/>
                        <img alt='<spring:message code="account.password.forgot.captach"/>'
                             src="${pageContext.request.contextPath}/img/system/loading.gif"
                             id="img-captcha" align="middle" onclick="reloadCaptcha();"
                             title="" class="captcha">
                    </div>
                    <div class="form-group m-fgpwd-form-btn">
                        <a id="forgotSub" class="btn  m-login-btn m-login-width-171"><spring:message code="account.password.forgot.confirm"/></a> <!-- 确定 -->
                        <!-- 返回登录 -->
                        <a id="backHome" href="${pageContext.request.contextPath}/" class="btn pull-right m-login-btn m-login-width-171"><spring:message code="account.password.forgot.returnlogin"/></a>
                    </div>

                    <input type="hidden" id="csrfToken" value="${sessionScope.csrfToken}">
                </form>
            </div>
        </div>
        <div class="m-login-foot">
            <!-- Copyright©2016 厦门亿联网络技术股份有限公司 All rights reserved -->
            <%--<p class="m-login-size-12">${copyright}</p>--%>
        </div>
    </div>

<div class="modal fade" id="promptModal" tabindex="-1" role="dialog" data-backdrop="static"
     hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-body  custom-confirm-modal-body" id="promptModalBody">

            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="promptModalWithbtn" tabindex="-1" role="dialog" data-backdrop="static"
     hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-header custom-modal-header">
                <button type="button" class="close custom-close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title custom-modal-title">
                    <spring:message code="account.password.reset.tips"/>
                </h4><!-- 提示 -->
            </div>
            <div class="modal-body  custom-confirm-modal-body">

            </div>
            <div class="modal-footer  custom-modal-footer">
                <div class="col-sm-offset-4  col-sm-4 custom-button-col-no-padding">
                    <button type="button" class="btn btn-success btn-lg btn-block m-close" id="promptModalOkBtn"
                            data-dismiss="modal">
                        <spring:message code="account.password.reset.confirm"/>
                    </button><!-- 确认 -->
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 本项目的context --%>
<input type="hidden" id="projectContext" value="${pageContext.request.contextPath}">
<input type="hidden" id="projectURL"
       value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}">
<input type="hidden" id="browserLang" value="${sessionScope.language }">
<input type="hidden" id="basePath" value="${pageContext.request.contextPath}">
<%-- 项目中浏览器版本提示框 --%>
<div id="browserTips" class="browser-tips">
</div>
</body>
<script src="${pageContext.request.contextPath}/js/jquery.js"></script>
<script src="${pageContext.request.contextPath}/js/template-debug.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.i18n.properties.js"></script>
<script src="${pageContext.request.contextPath}/js/i18nutil.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/common.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/MD5.js?${sessionScope.cacheTime}"></script>
<!-- Placed at the end of the document so the pages load faster -->
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath}/js/validate/validate.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/validate/validateutil.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/captcha/captcha.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/account/account.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript">
    $(function () {
        readyLanguage();
        readyForgotPwd();
    });
</script>
</html>
