<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<div class="panel panel-body m-wizard-body-panel">
    <form role="form" id="activationForm">
        <div class="form-group m-account-group">
            <!-- 许可证： -->
            <label><spring:message code="wizard.licence.label.licence"/></label>
            <input id="licenseIpt" name="licenseIpt" type="text" class="form-control" style="width: 500px!important;"/>
        </div>

        <div class="form-group step-btn-group">
            <button type="button" onclick="licensesettingwizard.laststep()" class="btn btn-lg btn-yealink-wizard-common">
                <spring:message code="wizard.userchg.label.laststep"/>
            </button>
            <button type="button" onclick="licensesettingwizard.activate()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2">
                <spring:message code="wizard.userchg.label.confirmnextstep"/>
            </button>
            <!-- 跳过 -->
            <input type="button" onclick="licensesettingwizard.jumpToNextStep()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2" value='<spring:message code="wizard.userchg.label.jumpstep"/>'/>
        </div>
    </form>

    <form role="form" id="licenseInfoForm" class="m-ls-detailform" hidden>
        <div class="form-group m-account-group">
            <!-- 许可证： -->
            <label><spring:message code="wizard.licence.label.licence"/></label>
            <input id="license" type="text" class="form-control"  readonly>
        </div>
        <div class="form-group m-account-group">
            <!-- 类型： -->
            <label><spring:message code="wizard.licence.label.type"/></label>
            <input id="type" type="text" class="form-control"  readonly>
        </div>
        <div class="form-group m-account-group">
            <!-- 状态： -->
            <label><spring:message code="wizard.licence.label.status"/></label>
            <input id="status" type="text" class="form-control"  readonly>
        </div>
        <div class="form-group m-account-group">
            <!-- 并发许可证数： -->
            <label><spring:message code="wizard.licence.label.permission"/></label>
            <input id="permissionAmount" type="text" class="form-control"  readonly>
        </div>
        <div class="form-group m-account-group">
            <!-- 有效日期： -->
            <label><spring:message code="wizard.licence.label.validay"/></label>
            <input id="validDay" type="text" class="form-control"  readonly>
        </div>
        <div class="form-group m-account-group">
            <!-- 失效日期： -->
            <label><spring:message code="wizard.licence.label.expire"/></label>
            <input id="expirationDate" type="text" class="form-control"  readonly>
        </div>

        <div class="form-group step-btn-group">
            <button type="button"  onclick="licensesettingwizard.laststep()" class="btn btn-lg btn-yealink-wizard-common">
                <spring:message code="wizard.userchg.label.laststep"/>
            </button>
            <button type="button" onclick="licensesettingwizard.confirmNextstep()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2">
                <spring:message code="wizard.userchg.label.confirmnextstep"/>
            </button>
        </div>
    </form>
</div>