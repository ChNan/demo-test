<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<nav class="navbar navbar-inverse navbar-fixed-top g-menu" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand m-logo" href="#" onclick="conferenceplan.reloadMain()">
                <c:choose>
                    <c:when test="${sessionScope.language eq 'zh_CN'}"><img src="${pageContext.request.contextPath}/img/main/menu/logo_ch.png"></c:when>
                    <c:when test="${sessionScope.language eq 'en'}"><img src="${pageContext.request.contextPath}/img/main/menu/logo_en.png"></c:when>
                    <c:otherwise></c:otherwise>
                </c:choose>
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
                <li class="dropdown g-account-dropdown">
                    <a href="#" class="dropdown-toggle" title="${account.name}" data-toggle="dropdown"
                       aria-expanded="false">
                       ${account.name}
                    </a>
                    <span class="caret"></span>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:void(0);" onclick="accountmanage.readyChangePwdConferencePage('account_manage_content')"><spring:message code="system.main.label.chgpass"/></a></li>
                        <li><a href="javascript:void(0);" onclick="accountmanage.readyChangeMailConferencePage('account_manage_content')"><spring:message code="system.main.label.chgmail"/></a></li>
                        <li><a href="${pageContext.request.contextPath}/logout"><spring:message code="system.main.label.logout"/></a></li>
                    </ul>
                </li>
            </ul>
            <span class="m-com-name pull-right" id="enterprise_name" style="position:inherit;clear: right;margin-top:25px;">${sessionScope.enterprise.name}</span>
        </div>

    </div>
</nav>