<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
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

    <title><spring:message code="system.html.title" text="YMS"/></title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/bootstrap-table.css" rel="stylesheet">
    <!--  bootstrap daterangepicker 1.3.7  bs3.0-->
    <link href="css/daterangepicker-bs3-1.3.7.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link href="css/dashboard.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/common.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/global.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/font-awesome.css" rel="stylesheet">
    <link href="css/zTreeStyle/zTreeStyle.css" rel="stylesheet">
    <link href="css/switch.css" rel="stylesheet">
    <link href="css/showLoading.css?${sessionScope.cacheTime}" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="g-body">
<input type="hidden" id="account_last_pageSize" value="50">
<input type="hidden" id="room_last_pageSize" value="50">
<nav class="navbar navbar-inverse navbar-fixed-top g-menu" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand m-logo" href="#">
                <c:choose>
                    <c:when test="${sessionScope.language eq 'zh_CN'}"><img src="${pageContext.request.contextPath}/img/main/menu/logo_ch.png"></c:when>
                    <c:when test="${sessionScope.language eq 'en'}"><img src="${pageContext.request.contextPath}/img/main/menu/logo_en.png"></c:when>
                    <c:otherwise></c:otherwise>
                </c:choose>
            </a>
        </div>
        <div id="navbar" class="navbar-collapse collapse" aria-expanded="false">
            <ul class="nav navbar-nav navbar-right">
                <%-- 首页 --%>
                <li><a id="index" href="#"><spring:message code="system.main.label.index"/></a></li>
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
                <li class="dropdown g-account-dropdown">
                    <a href="#" class="dropdown-toggle" title="${account.name}" data-toggle="dropdown" aria-expanded="false">${account.name}</a>
                    <span class="caret"></span>
                    <ul class="dropdown-menu" role="menu">
                        <!-- 修改密码 -->
                        <li><a href="javascript:void(0);" onclick="accountmanage.readyModifyPwdInitAdminPage()"><spring:message code="system.main.label.chgpass"/></a></li>
                        <!-- 修改邮箱 -->
                        <li><a href="javascript:void(0);" onclick="accountmanage.readyInitMailAdminPage()"><spring:message code="system.main.label.chgmail"/></a></li>
                        <!-- 退出 -->
                        <li><a href="javascript:void(0);" onclick="accountmanage.logout()"><spring:message code="system.main.label.logout"/></a></li>
                    </ul>
                </li>
            </ul>
            <span class="m-com-name pull-right">
                ${enterprise.name}
            </span>
        </div>
    </div>
</nav>
<c:if test="${account.admin eq 1}">
    <div class="g-leftmenu">
        <div class="sidebar">
            <ul class="nav nav-sidebar" style="width: 100%;margin-right: -1px;margin-left: 0px;">
                <%--<li name="systemstatus">--%>
                    <%--<a href="#">--%>
                        <%--<div class="menu-img m-img-a1" ></div>--%>
                        <%--<!-- 系统状态 -->--%>
                        <%--<span class="menu-text"> <spring:message code="system.main.label.menu.status"/> </span>--%>
                    <%--</a>--%>
                <%--</li>--%>
                <%--<li name="staffaccountmanage">--%>
                    <%--<a href="#">--%>
                        <%--<div class="menu-img m-img-a2" ></div>--%>
                        <%--<!-- 账号管理 -->--%>
                        <%--<span class="menu-text"> <spring:message code="system.main.label.menu.account"/> </span>--%>
                    <%--</a>--%>
                <%--</li>--%>
                <li name="conferenceroom">
                    <a href="#">
                        <div class="menu-img m-img-a3" ></div>
                        <!-- 会议室管理 -->
                        <span class="menu-text"> <spring:message code="system.main.label.menu.conforence"/> </span>
                    </a>
                </li>
                <%--<li name="callrecord">--%>
                    <%--<a href="#">--%>
                        <%--<div class="menu-img m-img-cr" ></div>--%>
                        <%--<!-- 统计与分析 -->--%>
                        <%--<span class="menu-text"> <spring:message code="system.main.label.menu.record"/> </span>--%>
                    <%--</a>--%>
                <%--</li>--%>
                <li name="item5" class="showMenu">
                    <a href="#">
                        <div class="menu-img m-img-a4" ></div>
                        <!-- 系统管理 -->
                        <span class="menu-text"> <spring:message code="system.main.label.menu.system"/> </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</c:if>

<div class="g-main">
    <div  class="container-fluid">
        <div class="g-main-menu">
        </div>
        <div class="g-main-data">
        </div>
    </div>
</div>
<!-- 修改密碼 -->
<div id="editPwd" class="row m-am-content g-other" >
    <div class="col-xs-12  col-xs-12 main">
        <!-- 修改密码 -->
        <span class="m-title"><spring:message code="system.main.label.chgpass"/></span>
        <div class="panel panel-body m-df-panel">
            <form role="form" id="m-am-edit" class="form-horizontal">
                <div class="form-group m-am-group">
                    <!-- 当前密码 -->
                    <div class="col-xs-3 input-span"><spring:message code="system.main.label.curpass"/><span style="color: red">*</span></div>
                    <div class="col-xs-6">
                        <label class="m-error-message"></label>
                        <input class="form-control" id="currentPsw" name="currentPsw" type="password" maxlength="16" autocomplete="off"/>
                    </div>
                </div>
                <div class="form-group m-am-group">
                    <!-- 新密码 -->
                    <div class="col-xs-3 input-span"><spring:message code="system.main.label.newpass"/><span style="color: red">*</span></div>
                    <div class="col-xs-6">
                        <label class="m-error-message"></label>
                        <input class="form-control" id="newPsw" name="newPsw" type="password" maxlength="16" autocomplete="off"/>
                    </div>
                </div>
                <div class="form-group m-am-group">
                    <!-- 确认密码 -->
                    <div class="col-xs-3 input-span"><spring:message code="system.main.label.confirmpass"/><span style="color: red">*</span></div>
                    <div class="col-xs-6">
                        <label class="m-error-message"></label>
                        <input class="form-control" id="repeatPsw" name="repeatPsw" type="password" maxlength="16" autocomplete="off"/>
                    </div>
                </div>
            </form>
            <div class="row" style="margin-top: 38px">
                <div class="col-xs-6">
                    <!-- 修改 -->
                    <button id="btn_pwd_modify" class="btn btn-yealink btn-default-size m-commit pull-right"
                            data-loading-text="{[global.html.btn.ok]}"
                            type="button" onclick="accountmanage.modifyPsw('m-am-edit')"><spring:message code="system.main.btn.change"/></button>
                </div>
                <div class="col-xs-6">
                    <!-- 返回 -->
                    <button id="btn_pwd_return" class="btn btn-default btn-yealink-cancel btn-default-size m-commit" type="button"><spring:message code="system.main.btn.return"/></button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 修改邮箱 -->
<div id="editMail" class="row  m-am-content g-other"  hidden="true">
    <div class="col-xs-12  col-xs-12 main">
        <!-- 修改邮箱 -->
        <span class="m-title"><spring:message code="system.main.label.chgmail"/></span>
        <div class="panel panel-body m-df-panel">
            <form role="form" id="m-am-mailEdit">
                <div class="form-group m-am-group">
                    <!--<label class="m-error-message"></label><br/>-->
                    <!-- 当前邮箱 -->
                    <label><spring:message code="system.main.label.curmailbox"/><span style="color: red">*</span></label>
                    <input class="form-control" id="currentMail" name="currentMail" readonly="readonly"/>
                </div>
                <div class="form-group m-am-group">
                    <!--<label class="m-error-message"></label><br/>-->
                    <!-- 新邮箱 -->
                    <label><spring:message code="system.main.label.newmailbox"/><span style="color: red">*</span></label>
                    <input class="form-control" id="newMail" name="newMail" type="text"/>
                </div>
                <div style="margin-left: 188px;margin-top: 38px">
                    <!-- 修改 -->
                    <button class="btn btn-yealink btn-default-size m-commit pull-left" type="button" onclick="accountmanage.modifyMail('m-am-mailEdit')"><spring:message code="system.main.btn.change"/></button>
                    <!-- 返回 -->
                    <button id="btn_email_return" class="btn btn-default btn-yealink-cancel btn-default-size m-commit" type="button" style="margin-left: 30px"><spring:message code="system.main.btn.return"/></button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- 提示框 -->
<div class="modal fade" id="promptModal" tabindex="-1" role="dialog" data-backdrop="static"
     hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-body  custom-confirm-modal-body" >

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
                <spring:message code="system.main.label.tips"/>
            </h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body">

            </div>
            <div class="modal-footer  custom-modal-footer">
            <div class="col-sm-offset-4  col-sm-4 custom-button-col-no-padding">
            <button type="button" class="btn m-close btn-yealink btn-default-size" id="promptModalOkBtn"
            data-dismiss="modal">
                <!-- 确定 -->
                <spring:message code="system.main.label.confirm"/>
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
                <button type="button" class="btn btn-yealink btn-default-size" id="confirmModalOkBtn"
                        data-dismiss="modal">
                    <!-- 确定 -->
                    <spring:message code="system.main.label.confirm"/>
                </button>
                <button type="button" style="margin-left: 15px;" class="btn btn-block btn-lg btn-yealink-cancel btn-default-size"
                        data-dismiss="modal">
                    <!-- 取消 -->
                    <spring:message code="system.main.label.cancel"/>
                </button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" data-backdrop="static" data-keyboard="false"
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

<!-- 服务器错误 -->
<div id="g-error-server" style="display: none">
    <div class="g-error">
        <img src="${pageContext.request.contextPath}/img/cry.png">
        <!-- 不好意思，服务器异常~~  请稍后重新  登入 -->
        <spring:message code="system.main.label.interservererror"/>
        <spring:message code="system.main.label.plsrelogin"/>&nbsp;&nbsp;
        <a id="m-error-login" href="${pageContext.request.contextPath}/"><spring:message code="system.main.label.login"/></a>

    </div>
</div>
<input type="hidden" id="projectContext" value="${pageContext.request.contextPath}">
<input type="hidden" id="projectURL" value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}">
<input type="hidden" id="browserLang" value="${sessionScope.language }">
<input type="hidden" id="basePath" value="${pageContext.request.contextPath}">
<input type="hidden" id="loginStaffId" value="${sessionScope.sessionAccount.staffId}">
<input type="hidden" id="isAdmin" value="${account.admin}">
<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="${pageContext.request.contextPath}/js/jquery.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="${pageContext.request.contextPath}/js/ie10-viewport-bug-workaround.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap-treeview.js"></script>
<script src="${pageContext.request.contextPath}/js/bootstrap-table.js"></script>
<script src="${pageContext.request.contextPath}/js/template-debug.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.i18n.properties.js"></script>
<script src="${pageContext.request.contextPath}/js/moment.js"></script>
<script src="${pageContext.request.contextPath}/js/browser.js"></script>
<script src="${pageContext.request.contextPath}/js/daterangepicker-1.3.7.js"></script>
<script src="${pageContext.request.contextPath}/js/echarts3.3.1.min.js"></script>
<!-- put your locale files after bootstrap-table.js -->
<script src="${pageContext.request.contextPath}/js/bootstrap-table-zh-CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/popup_layer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ajaxfileupload.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/switch.js"></script>
<!-- 暂时放这儿调试方便些,后续移走 -->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-file-upload/vendor/canvas-to-blob.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-file-upload/vendor/jquery.ui.widget.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-file-upload/vendor/load-image.all.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-file-upload/jquery.fileupload.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-file-upload/jquery.fileupload-process.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-file-upload/jquery.fileupload-image.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.ztree.all-3.5.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/moment-timezone/moment-timezone.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap.autocomplete.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/i18nutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/common.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/validate.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/formutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/main.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/DES3.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/validateutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/staffaccountmanage/staffaccountmanage.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/conferenceroom/conferenceroom.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/accountmanage/accountmanage.js?${sessionScope.cacheTime}"></script>

<!-- 会议预约部分,后续移走 -->
<link href='${pageContext.request.contextPath}/css/fullcalendar/fullcalendar.css' rel='stylesheet'/>
<link href='${pageContext.request.contextPath}/css/fullcalendar/fullcalendar.print.css' rel='stylesheet' media='print'/>
<link href='${pageContext.request.contextPath}/css/fullcalendar/scheduler.css' rel='stylesheet'/>
<link href="${pageContext.request.contextPath}/css/jquery-datetimepicker/jquery.datetimepicker.css" rel="stylesheet" />
<script src='${pageContext.request.contextPath}/js/moment.js'></script>
<script src='${pageContext.request.contextPath}/js/fullcalendar/fullcalendar.js'></script>
<script src='${pageContext.request.contextPath}/js/fullcalendar/scheduler.js'></script>
<script src="${pageContext.request.contextPath}/js/jquery-datetimepicker/jquery.datetimepicker.full.js"></script>
<!-------------------------------->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/DateFormat.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/loading/jquery.showLoading.min.js"></script>
</body>
</html>
