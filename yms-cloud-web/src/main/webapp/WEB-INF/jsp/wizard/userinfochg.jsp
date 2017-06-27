<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<div class="panel panel-body m-wizard-body-panel">
    <form role="form" id="userinfochg-form">
        <input type="hidden" name="_id" id="_id">
        <div class="form-group m-account-group">
            <!-- 用户名： -->
            <label><spring:message code="wizard.userchg.label.username"/></label>
            <input type="text" class="form-control" name="userName" id="userName" readonly="readonly">
        </div>
        <div class="form-group m-account-group validate">
            <!-- 密码： -->
            <label><spring:message code="wizard.userchg.label.pass"/></label>
            <input type="password" class="form-control" name="password" id="password"  maxlength="16" autocomplete="off">
        </div>
        <div class="form-group m-account-group">
            <!-- 确认密码： -->
            <label><spring:message code="wizard.userchg.label.confirmpass"/></label>
            <input type="password" class="form-control" name="confirmPassword" id="confirmPassword"  maxlength="16" autocomplete="off">
        </div>
        <div class="form-group m-account-group">
            <!-- 邮箱： -->
            <label><spring:message code="wizard.userchg.label.mailbox"/></label>
            <input type="text" class="form-control" name="email" id="email">
        </div>
        <div class="m-smtps-mgl155">
            <div class="checkbox">
                <label>
                    <!-- 同意参与用户改善计划 -->
                    <input type="checkbox" checked name="userImprovePlan" id="userImprovePlan"> <spring:message code="wizard.userchg.label.approvaluserplan"/>
                </label>
            </div>
        </div>
        <div class="form-group step-btn-group">
            <!-- 上一步 -->
            <button type="button" onclick="userinfochg.laststep()" class="btn btn-lg btn-yealink-wizard-common"><spring:message code="wizard.userchg.label.laststep"/></button>
            <!-- 确认,下一步 -->
            <input type="submit" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2" value='<spring:message code="wizard.userchg.label.confirmnextstep"/>'/>
            <c:if test="${isWizarded}">
            <!-- 跳过 -->
            <input type="button" onclick="userinfochg.jumpToNextStep()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2" value='<spring:message code="wizard.userchg.label.jumpstep"/>'/>
            </c:if>
        </div>
    </form>
</div>