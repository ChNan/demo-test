
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 登录 -->
    <title><spring:message code="account.login.title.login"/></title>
    <link href="${pageContext.request.contextPath}/css/bootstrap.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/login.css?${sessionScope.cacheTime}" rel="stylesheet">
    
</head>
<body>
<div class="m-login-container">
    <%@include file="common/language_drop.jsp" %>

    <div class="m-login-logo">
        <img src="../img/login/logo.png">
    </div>
    <div class="m-login">
        <div class="m-form">
            <!-- 亿联视频会议管理平台 -->
            <div><p class="m-login-title"><spring:message code="account.login.title.sysname"/></p></div>
            <form role="form" onsubmit="return false;" id="login">
                <div class="form-group">
                    <label  class="m-error-message" id="errorLoginMessage" ></label>
                    <!-- 账号 -->
                    <input type="text" class="form-control m-login-usn" placeholder='<spring:message code="account.password.forgot.username"/>' id="username" maxlength="32" name="username"  autofocus
                            style="ime-mode:disabled"
                            />
                </div>
                <div class="form-group">
                    <label  class="m-error-message"></label>
                    <!-- 密码 -->
                    <input type="password" class="form-control  m-login-pwd" placeholder='<spring:message code="account.login.label.password"/>' id="password" maxlength="16"/>
                </div>
                <div class="form-group  m-login-cap" id="divCaptcha" <c:if test="${sessionScope.login_error_count eq 0}">style="display: none" </c:if>>
                    <label class="m-error-message"></label>
                    <!-- 验证码 -->
                    <input class="form-control" id="captcha" maxlength="4" autocomplete="off" name="captcha"
                           onkeyup="value=value.replace(/[^\w]|_/ig,'')"
                           title='<spring:message code="account.password.forgot.captach"/>'
                           placeholder='<spring:message code="account.password.forgot.captach"/>'/>
                    <img alt='<spring:message code="account.password.forgot.captach"/>'
                         src="${pageContext.request.contextPath}/img/system/loading.gif"
                         id="img-captcha"  onclick="reloadCaptcha();"
                         title="" class="captcha">
                </div>
                <div class="form-group m-mg-choose">
                    <div class="checkbox">
                        <label>
                            <!-- 记住密码 -->
                            <input type="checkbox" id="rememberMe" value="rememberMe" ><span class="rememberMe"><spring:message code="account.login.label.remberpass"/></span>
                        </label>
                    </div>
                    <!-- 忘记密码 -->
                    <a class="forget-pwd pull-right" href="${pageContext.request.contextPath}/account/forgot_pwd" id="forgot_btn"><img src="../img/login/question.png"> <spring:message code="account.login.label.forgetpass"/></a>
                </div>

                <div class="form-group">
                    <!-- 登录 -->
                    <button class="btn m-login-btn m-login-width-100" id="submitLoginBtn"><spring:message code="account.login.title.login"/></button>
                </div>
                <input type="hidden" id="csrfToken" value="${sessionScope.csrfToken}">
            </form>
        </div>
    </div>
    <div class="m-login-foot">
        <%--<p>${copyright}</p>--%>
    </div>
</div>

<%-- 本项目的context --%>
<input type="hidden" id="projectContext" value="${pageContext.request.contextPath}">
<input type="hidden" id="projectURL" value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}">
<input type="hidden" id="browserLang" value="${sessionScope.language}">

<input type="hidden" id="basePath" value="${pageContext.request.contextPath}">
<%-- 项目中浏览器版本提示框 --%>
<div id="browserTips" class="browser-tips">
</div>
</body>
<!-- Placed at the end of the document so the pages load faster -->
<script src="${pageContext.request.contextPath}/js/jquery.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath}/js/template-debug.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.i18n.properties.js"></script>
<script src="${pageContext.request.contextPath}/js/moment.js"></script>
<script src="${pageContext.request.contextPath}/js/MD5.js"></script>
<script src="${pageContext.request.contextPath}/js/DES3.js"></script>

<script src="${pageContext.request.contextPath}/js/i18nutil.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/common.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/validate/validate.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/validate/validateutil.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/captcha/captcha.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/login/login.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript">
    $(function () {
        //prompt ie6 && ie7 version low
        if (IEVersion() == 6 || IEVersion() == 7) {
            $('#browserTips').show();
        }
        readyLogin();
    });
    $('.c-lan li').on('click',function(){
        if($(this).hasClass('active')){
            return;
        }
        var val = $(this).data('val');
        var text = $(this).text();

        $.post('/system/locale/change',{language:val},function(result){
            if(result.success){
                setLan(val)
                window.location.reload();
            }
        })
    });
</script>
</html>
