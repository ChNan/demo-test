<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<input type="hidden" id="projectContext" value="${pageContext.request.contextPath}">
<input type="hidden" id="projectURL" value="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}">
<input type="hidden" id="browserLang" value="${sessionScope.language }">
<input type="hidden" id="basePath" value="${pageContext.request.contextPath}">
<input type="hidden" id="loginStaffId" value="${sessionScope.sessionAccount.staffId}">
<input type="hidden" id="isAdmin" value="${account.admin}">
<input type="hidden" id="loginStaffName" value="${account.name}">
<input type="hidden" id="loginStaffEmail" value="${account.email}">
<input type="hidden" id="conferenceStartDate">
<input type="hidden" id="searchType" value="${searchType}">
<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.js"></script>
<%--<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-ui.js"></script>--%>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.i18n.properties.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap.min.js"></script>
<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ie10-viewport-bug-workaround.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap-treeview.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap-table.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/template-debug.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/moment.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/daterangepicker.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/echarts.js"></script>
<!-- put your locale files after bootstrap-table.js -->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap-table-zh-CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/popup_layer.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/ajaxfileupload.js"></script>
<!-- 暂时放这儿调试方便些,后续移走 -->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.ztree.all-3.5.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bootstrap.autocomplete.js"></script>
<link href='${pageContext.request.contextPath}/css/fullcalendar/fullcalendar.css' rel='stylesheet'/>
<link href='${pageContext.request.contextPath}/css/fullcalendar/fullcalendar.print.css' rel='stylesheet' media='print'/>
<link href='${pageContext.request.contextPath}/css/fullcalendar/scheduler.css' rel='stylesheet'/>
<link href="${pageContext.request.contextPath}/css/jquery-datetimepicker/jquery.datetimepicker.css" rel="stylesheet"/>
<script src='${pageContext.request.contextPath}/js/moment.js'></script>
<script src='${pageContext.request.contextPath}/js/fullcalendar/fullcalendar.js'></script>
<script src='${pageContext.request.contextPath}/js/fullcalendar/scheduler.js'></script>
<script src='${pageContext.request.contextPath}/js/fullcalendar/locale-all.js'></script>
<script src="${pageContext.request.contextPath}/js/jquery-datetimepicker/jquery.datetimepicker.full.js"></script>
<!-------------------------------->
<script type="text/javascript" src="${pageContext.request.contextPath}/js/DateFormat.js"></script>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/chosen.jquery.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/3rdLibrary/ckeditor/ckeditor.js"></script>
<%--<script type="text/javascript" src="${pageContext.request.contextPath}/3rdLibrary/selectBoxIt/jquery.selectBoxIt.min.js"></script>--%>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/valvalidate.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/common.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/i18nutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/accountmanage/accountmanage.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/DES3.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/validate.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/validate/validateutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/formutil.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/main.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/html/accountmanage/accountmanage.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/conferenceplan/outlook.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/conferenceplan/conferenceplan.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/conferenceplan/conferencerecord.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/conferenceplan/conferenceplan_participant.js?${sessionScope.cacheTime}"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/login/login.js?${sessionScope.cacheTime}"></script>

<!--[if lt IE 9]>
<![endif]-->
