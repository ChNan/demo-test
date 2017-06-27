<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page isELIgnored="false"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 不缓存 -->
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
    <META HTTP-EQUIV="Expires" CONTENT="0">
    <!-- 设置向导 -->
    <title><spring:message code="wizard.main.title.wizard"/></title>

    <!-- Bootstrap core CSS -->
    <link href="${pageContext.request.contextPath}/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/bootstrap-table.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/daterangepicker-bs3-1.3.7.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link href="${pageContext.request.contextPath}/css/dashboard.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/common.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/global.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/font-awesome.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/zTreeStyle/zTreeStyle.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/switch.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/wizard.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/showLoading.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/chosen.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<nav class="navbar navbar-inverse navbar-fixed-top g-menu" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand m-logo" href="/main">
                <img src="${pageContext.request.contextPath}/img/main/menu/logo_ch.png">
            </a>
        </div>
        <div id="navbar" class="navbar-collapse collapse" aria-expanded="false">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="languageDropDown">
                        <c:choose>
                            <c:when test="${sessionScope.language eq 'zh_CN'}"><spring:message code="wizard.main.title.chinese"/></c:when>
                            <c:when test="${sessionScope.language eq 'en'}"><spring:message code="wizard.main.title.english"/></c:when>
                            <c:otherwise></c:otherwise>
                        </c:choose>
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu c-lan" role="menu">
                        <li data-val="zh-CN" <c:if test="${sessionScope.language eq 'zh_CN'}">class="active"</c:if>>
                            <a href="#"><spring:message code="wizard.main.title.chinese"/></a>
                        </li>
                        <li data-val="en-US" <c:if test="${sessionScope.language eq 'en'}">class="active"</c:if>>
                            <a href="#"><spring:message code="wizard.main.title.english"/></a>
                        </li>
                    </ul>
                </li>
                <c:if test="${isWizarded}">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">${staff.name} <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <!-- 修改密码 -->
                        <li><a href="javascript:void(0);" onclick="accountmanage.readyChangePwdConferencePage('account_manage_content')"><spring:message code="system.main.label.chgpass"/></a></li>
                        <!-- 修改邮箱 -->
                        <li><a href="javascript:void(0);" onclick="accountmanage.readyChangeMailConferencePage('account_manage_content')"><spring:message code="system.main.label.chgmail"/></a></li>
                        <!-- 退出 -->
                        <li><a href="${pageContext.request.contextPath}/logout"><spring:message code="system.main.label.logout"/></a></li>
                    </ul>
                </li>
                </c:if>
            </ul>
            <span class="m-com-name-wizard pull-right">
                ${enterprise.name}
            </span>
        </div>
    </div>
</nav>
<div id="account_manage_content" style="display:none;position: absolute;background: #ffffff;width: 100%;height:100%; z-index: 100;margin-top: 30px">
</div>
<div style="margin-top: 40px;">
    <div class="container-fluid">
        <div class="g-main-data">
            <div class="row m-ns" id="settingwizard">
                <div class="panel panel-body m-wizard-panel" style="">
                    <!-- 设置向导 -->
                    <span class="wizard-header-h1"><spring:message code="wizard.main.title.wizard"/></span>
                    <div class="y-process y-process-5">
                        <span class="y-unit y-current" id="netsettingSpanID">
                            <!-- 网络配置 -->
                            <div class="img i1-a"></div><span class="wi-wizard-tab-font-a"><spring:message code="wizard.main.title.netsetting"/></span>
                        </span>
                        <span class="y-arrow y-current-unit" id="arrowSpanId1">
                            <span class="y-next"></span>
                            <span class="y-prev"></span>
                        </span>
                        <span class="y-unit" id="timesettingSpanID">
                            <!-- 时间/时区设置 -->
                            <div class="img i2"></div><span class="wi-wizard-tab-font"><spring:message code="wizard.main.title.timesetting"/></span>
                        </span>
                        <span class="y-arrow" id="arrowSpanId2">
                            <span class="y-next"></span>
                            <span class="y-prev"></span>
                        </span>
                        <span class="y-unit" id="userinfochgSpanID">
                            <!-- 用户名/密码修改 -->
                            <div class="img i3"></div><span class="wi-wizard-tab-font"><spring:message code="wizard.main.title.userchg"/></span>
                        </span>
                        <span class="y-arrow" id="arrowSpanId3">
                            <span class="y-next"></span>
                            <span class="y-prev"></span>
                        </span>
                        <span class="y-unit" id="licencesettingSpanID">
                            <!-- 激活licence -->
                            <div class="img i4"></div><span class="wi-wizard-tab-font"><spring:message code="wizard.main.title.licence"/></span>
                        </span>
                        <span class="y-arrow" id="arrowSpanId4">
                            <span class="y-next"></span>
                            <span class="y-prev"></span>
                        </span>
                        <span class="y-unit" id="smtpsettingSpanID">
                            <!-- SMTP邮箱设置 -->
                            <div class="img i5"></div><span class="wi-wizard-tab-font"><spring:message code="wizard.main.title.smtpsetting"/></span>
                        </span>
                    </div>
                    <div class="wi-main-div">
                        <div class="m-tab wi-wizard-display" id="netsetting">
                            <%@include file="netsetting.jsp"%>
                        </div>
                        <div class="m-tab wi-wizard-display-none" id="timesetting">
                            <%@include file="timesettint.jsp"%>
                        </div>
                        <div class="m-tab wi-wizard-display-none" id="userinfochg">
                            <%@include file="userinfochg.jsp"%>
                        </div>
                        <div class="m-tab wi-wizard-display-none" id="licencesetting">
                            <%@include file="licence.jsp"%>
                        </div>
                        <div class="m-tab wi-wizard-display-none" id="smtpsetting">
                            <%@include file="smtpsetting.jsp"%>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

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
                    <!-- 提示 -->
                    <spring:message code="wizard.main.title.tip"/>
                </h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body">

            </div>
            <div class="modal-footer  custom-modal-footer">
                <div class="col-sm-offset-4  col-sm-4 custom-button-col-no-padding">
                    <button type="button" class="btn btn-success btn-lg btn-block m-close" id="promptModalOkBtn"
                            data-dismiss="modal">
                        <!-- 确定 -->
                        <spring:message code="wizard.main.title.confirm"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalCommon" tabindex="-1" role="dialog" data-backdrop="static"
     aria-hidden="true">
    <div class="modal-dialog">
        <div id="modalCommonContent" class="modal-content">
        </div>
    </div>
</div>
<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" data-backdrop="static"
     aria-hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-header custom-modal-header">
                <button type="button" style="margin-top: -6px;" class="close custom-close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title custom-modal-title " style="margin-top: -4px;" id="confirmModalTitle"></h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body" id="confirmModalBody">

            </div>
            <div class="modal-footer custom-modal-footer">
                <button type="button" class="btn   btn-success btn-lg" id="confirmModalOkBtn"
                        data-dismiss="modal"><spring:message code="wizard.main.title.confirm"/>
                </button><!-- 确定 -->
                <button type="button" style="margin-left: 15px;" class="btn btn-block btn-lg"
                        data-dismiss="modal"><spring:message code="wizard.main.title.cancel"/>
                </button><!-- 取消 -->
            </div>
        </div>
    </div>
</div>

<input type="hidden" id="projectContext" value="${pageContext.request.contextPath}">
<input type="hidden" id="projectURL" value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}">
<input type="hidden" id="browserLang" value="${sessionScope.language }">
<input type="hidden" id="basePath" value="${pageContext.request.contextPath}">
<input type="hidden" id="wizardFlag" value="<c:out value='${isWizarded}'/>" />
<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="${pageContext.request.contextPath}/js/jquery.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="${pageContext.request.contextPath}/js/ie10-viewport-bug-workaround.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap-treeview.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap-table.js"></script>

<script src="${pageContext.request.contextPath}/js/moment.js"></script>
<script src="${pageContext.request.contextPath}/js/common.js"></script>
<script src="${pageContext.request.contextPath}/js/daterangepicker-1.3.7.js"></script>
<!-- put your locale files after bootstrap-table.js -->
<script src="${pageContext.request.contextPath}/js/bootstrap-table-zh-CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/validate.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/formutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/popup_layer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/chosen.jquery.min.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/DES3.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.ztree.all-3.5.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/DateFormat.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/html/accountmanage/accountmanage.js?${sessionScope.cacheTime}"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.i18n.properties.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/loading/jquery.showLoading.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/i18nutil.js?${sessionScope.cacheTime}"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/html/wizard/wizard.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/wizard/netsetting.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/wizard/timesetting.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/wizard/licence.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/wizard/userinfochg.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/wizard/smtpsetting.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/validateutil.js?${sessionScope.cacheTime}"></script>

</body>
</html>
