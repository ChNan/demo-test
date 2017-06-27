<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<div class="panel panel-body m-wizard-body-panel m-ts" id="timesettingAllDivid">
    <form role="form" id="m-times-form">
        <div class="form-group m-account-group">
            <!-- 服务器当前时间： -->
            <label class="wizard-timeset-group_label"><spring:message code="wizard.timesetting.label.servertime"/></label>
            <input type="text" name="currentTime" class="form-control" readonly="readonly">
        </div>
        <div class="form-group m-account-group">
            <!-- 夏令时： -->
            <label class="wizard-timeset-group_label"><spring:message code="wizard.timesetting.label.summertime"/></label>
            <select name="summerTime" class="form-control">
                <option value="0"><spring:message code="wizard.timesetting.label.auto"/></option>
                <option value="1"><spring:message code="wizard.timesetting.label.stop"/></option>
            </select>
            <!-- 自动 停用 -->
        </div>
        <br>
        <div class="form-group">
            <!-- 时间获取方式 -->
            <label class="display-block wizard-m-ns-lt1"><spring:message code="wizard.timesetting.label.gettimemethod"/><div class="wizard-m-ns-lw2"><hr></div></label>
            <div class="wizard-timeset-radio ">
                <label>
                    <!-- 自动与Internet时间服务器同步 -->
                    <input type="radio" value="0" checked name="timeMethod"> <spring:message code="wizard.timesetting.label.autosync"/>
                </label>
            </div>
            <div class="wizard-timeset-group m-ts-timemethod0 wizard-timeset-auto-div">
                <div class="form-group ">
                    <!-- 服务器域名： -->
                    <label class="wizard-timeset-group_label"><spring:message code="wizard.timesetting.label.serverdomain"/></label>
                    <input type="text" class="form-control" name="timeServer">
                </div>
                <div class="form-group">
                    <!-- 时区： -->
                    <label class="wizard-timeset-group_label"><spring:message code="wizard.timesetting.label.timezone"/></label>
                    <select name="timeZone" class="form-control">
                    </select>
                </div>
            </div>
            <br>
            <div class="wizard-timeset-radio form-group">
                <label>
                    <!-- 手动设置时间和日期 -->
                    <input type="radio" value="1" name="timeMethod"> <spring:message code="wizard.timesetting.label.manualset"/>
                </label>
            </div>
            <div class="wizard-timeset-group m-ts-timemethod1 wizard-timeset-auto-div">
                <label class="wizard-timeset-group_label"></label>
                <span class="input-icon input-icon-right">
                    <input type="text" id="m-ts-time" readonly="readonly" class="form-control">
                    <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                </span>
            </div>
        </div>
        <div class="form-group step-btn-group">
            <button type="button"  onclick="timesettingwizard.laststep()" class="btn btn-lg btn-yealink-wizard-common"><spring:message code="wizard.userchg.label.laststep"/></button>
            <button type="button"  onclick="timesettingwizard.save()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2"><spring:message code="wizard.userchg.label.confirmnextstep"/></button>
            <c:if test="${isWizarded}">
                <!-- 跳过 -->
                <input type="button" onclick="timesettingwizard.confirmNextstep()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2" value='<spring:message code="wizard.userchg.label.jumpstep"/>'/>
            </c:if>
        </div>
    </form>
</div>