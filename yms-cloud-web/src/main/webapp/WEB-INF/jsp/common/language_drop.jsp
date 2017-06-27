<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<div id="navbar" class="navbar-collapse collapse m-login-navi " aria-expanded="false" role="navigation">
    <form class="navbar-form form-inline navbar-right">
        <div class="form-group">
            <!-- Outlook插件下载 -->
            <a href="https://yealinkvc.com/3rdLibrary/download/yealink_outlook_plugin.exe" class="login-a-about" aria-expanded="false" id="outlookUrl"><spring:message code="account.password.forgot.outlook.download"/></a>
            <!-- 支持 -->
            <a href="http://support.yealink.com/documentFront/forwardToDocumentFrontDisplayPage?BaseInfoCateId=1313&NewsCateId=1313&CateId=1313&language=zh_cn#" target="_blank" class="login-a-about">
                <spring:message code="account.password.forgot.support"/>
            </a>
        </div>
        <div class="form-group div-language-select">
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
            </ul>
        </div>
    </form>
</div>