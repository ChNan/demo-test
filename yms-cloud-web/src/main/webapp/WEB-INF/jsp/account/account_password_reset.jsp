<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit">
    <title><spring:message code="account.reset.password.title.name"/></title>
    <link rel="shortcut icon" href="${pageContext.request.contextPath}/images/cloud.ico"/>
    <link href="${pageContext.request.contextPath}/css/style.min.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/login.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/common.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/global.css?${sessionScope.cacheTime}" rel="stylesheet">

</head>
<body class="password-reset-body">
<!-- <div class="col-sm-offset-1 col-sm-10"><hr class="top-seperator"></div> -->

<div class="password-reset-content">
    <div class="password-reset-title">
        <spring:message code="account.reset.password.title.name"/>
    </div>

    <div class="form-horizontal password-reset-form">
        <div class="form-group" id="divNewPassword">
            <label class="control-label">
                <spring:message code="account.modify.password.label.password.new"/>
            </label>
            <input type="password" class="form-control  pwd-reset-input" id="newPassword" minlength="8"
                   maxlength="64" autocomplete="off"
                   placeholder="<spring:message code="account.modify.password.input.prompt.password.new" />"
                   title="<spring:message code="account.modify.password.input.prompt.password.new" />">
            <label id="errorNewPassword" class="control-label password-reset-error-label"></label>
        </div>

        <div class="form-group" id="divRepeatPassword">
            <label class="control-label">
                <spring:message code="account.modify.password.label.password.repeat"/>
            </label>
            <input type="password" class="form-control pwd-reset-input" id="repeatPassword"
                   maxlength="64" autocomplete="off"
                   title="<spring:message code="account.modify.password.input.prompt.password.repeat" />">
            <label id="errorRepeatPassword" class="control-label password-reset-error-label"></label>
        </div>

        <div class="form-footer-div">
            <button id="submitResetPwdBtn" class="btn btn-success btn-lg btn-block pull-left">
                <spring:message code="system.common.button.ok"/>
            </button>
            <a href="${pageContext.request.contextPath}/" class="btn btn-default btn-lg pull-right">
                <spring:message code="account.forgot.pwd.button.to.login"/>
            </a>
        </div>
    </div>
    <input type="hidden" id="basePath" value="${pageContext.request.contextPath}">
    <input type="hidden" id="activeCode" value="${activeCode}">
    <input type="hidden" id="csrfToken" value="${sessionScope.csrfToken}">

    <!-- 提示框 -->

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
                    </h4> <!-- 提示 -->
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
</div>
<div class="modal fade" data-backdrop="static" data-keyboard="false" style="top:-20% !important;"
     aria-hidden="true" id="modalProgressBar">
    <div class="modal-dialog div-progress-bar-dialog-location custom-modal-size">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title custom-modal-title custom-no-padding-left" id="progressBarTitle">
                    <%-- 此处的提示语在common.js showProgress中填充 --%>
                </h4>
            </div>
            <div class="modal-body">
                <div class="progress progress-striped active">
                    <div class="progress-bar progress-bar-success div-progress-bar-dialog-body" role="progressbar">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--[if lt IE 9]>
<script src="${pageContext.request.contextPath}/3rdLibrary/ie-compatible/ie.compatible.min.js"></script>
<![endif]-->
</body>
<script src="${pageContext.request.contextPath}/js/jquery.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath}/js/template-debug.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.i18n.properties.js"></script>
<script src="${pageContext.request.contextPath}/js/i18nutil.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/DES3.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/common.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/validate/validate.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/validate/validateutil.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/account/account.js?${sessionScope.cacheTime}"></script>
<script src="${pageContext.request.contextPath}/js/MD5.js"></script>
<script type="text/javascript">
    $(function () {
        readyLanguage();
        readyResetPwdAfterForgot();
    });
</script>
</html>