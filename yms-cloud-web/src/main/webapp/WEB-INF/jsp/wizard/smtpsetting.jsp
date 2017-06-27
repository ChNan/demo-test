<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<div class="panel panel-body m-wizard-body-panel m-smtps" id="wizardSmtpSettingDiv">
    <form role="form" id="config-form">
        <div class="form-group m-smtps-group">
            <!-- SMTP服务器： -->
            <label><spring:message code="wizard.smtpsetting.label.smtpserver"/></label>
            <input type="text" class="form-control" name="smtpServer" maxlength="128">
        </div>
        <div class="form-group m-smtps-group">
            <!-- 邮箱地址： -->
            <label><spring:message code="wizard.smtpsetting.label.sender"/></label>
            <input type="text" class="form-control" name="senderMail" maxlength="128">
        </div>
        <div class="form-group m-smtps-group">
            <!-- 用户名： -->
            <label><spring:message code="wizard.smtpsetting.label.username"/></label>
            <input type="text" class="form-control" name="username" maxlength="128">
        </div>
        <div class="form-group m-smtps-group">
            <!-- 密码： -->
            <label><spring:message code="wizard.smtpsetting.label.pass"/></label>
            <input type="password" class="form-control" name="password" maxlength="128">
        </div>
        <div class="form-group m-smtps-group">
            <!-- 端口： -->
            <label><spring:message code="wizard.smtpsetting.label.port"/></label>
            <input type="text" class="form-control" name="port" maxlength="128">
        </div>
        <div class="m-smtps-mgl155">
            <div class="checkbox">
                <label>
                    <!-- 此服务器要求安全连接 -->
                    <input type="checkbox" name="secureConn"> <spring:message code="wizard.smtpsetting.label.secureconn"/>
                </label>
                <select class="form-control inline-select display-none" name="method">
                    <option value="TLS">TLS</option>
                    <option value="SSL">SSL</option>
                </select>
            </div>
        </div>
        <div class="m-smtps-mgl155">
            <!-- 测试邮箱设置 -->
            <button class="btn btn-default " type="button" onmouseup="smtpsettingwizard.popupTestModal('config-form')">
                <spring:message code="wizard.smtpsetting.label.testsend"/>
            </button>
        </div>
        <div class="form-group step-btn-group">
            <button type="button"  onclick="smtpsettingwizard.laststep()" class="btn btn-lg btn-yealink-wizard-common "><spring:message code="wizard.userchg.label.laststep"/></button>
            <button type="button" onclick="smtpsettingwizard.save('config-form')" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2"><spring:message code="wizard.smtpsetting.label.finish"/></button>
            <c:if test="${isWizarded}">
                <!-- 跳过 -->
                <input type="button" onclick="smtpsettingwizard.jumpToHeadPage()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2" value='<spring:message code="wizard.userchg.label.jumpstep"/>'/>
            </c:if>
        </div>
    </form>
</div>

<!-- 邮件测试 模态框（Modal） -->
<div class="modal fade" id="testMailModal" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true" style="top:200px">
    <div class="modal-dialog" style="width: 680px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" style="text-align:center" id="myModalLabel"><spring:message code="wizard.smtpsetting.label.testsend"/></h4>
                <!-- 测试邮箱设置 -->
            </div>
            <div class="modal-body">
                <form id="testMailForm">
                    <div id="sendMailDiv" class="form-group m-smtps-group madal-content-padding-left">
                        <!-- 测试邮箱： -->
                        <label><spring:message code="wizard.smtpsetting.label.sendmail"/></label>
                        <input type="text" id="toAddress" class="form-control" name="toAddress"  style="width:60%;" maxlength="128">
                        <label class="control-label m-error-message"></label>
                        <div id="errorMsgDiv" style="color:#a94442;text-align:center"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer" style="text-align:center">
                <button type="button" class="btn btn-yealink btn-default" onclick="smtpsettingwizard.startTestSendMail('config-form')">
                    <spring:message code="wizard.main.title.confirm"/>
                </button>&nbsp;&nbsp;&nbsp;
                <button type="button" class="btn btn-default btn-default" data-dismiss="modal">
                    <spring:message code="wizard.main.title.cancel"/>
                </button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>

<!--测试邮件滚动条  -->
<div class="modal fade" id="progressBarModal" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true"  data-backdrop="static">
    <div class="modal-dialog" style="width: 713px;">
        <div class="modal-content" id="progressBarContent" style="height: 152px;width: 713px;">
            <div class="modal-body" style="padding-top: 45px;padding-left: 46px;">
                <span id="progressBarFooter" style="display: block;width: 100%;text-align: center;font-size: 22px;color: #454444;margin-bottom: 26px;height: 22px;"><spring:message code="wizard.smtpsetting.label.operating"/></span>
                <div class="progress" style="height: 12px;width: 575px;background-color: #d4d4d4;">
                    <div class="progress-bar" role="progressbar"  aria-valuenow="60"
                         aria-valuemin="0" aria-valuemax="100" style="width: 20%;background-color: #0cc295">
                    </div>
                </div>
                <span id="progressValueshow" style="position: relative;top: -38px;left: 587px; font-size: 16px;color: #444444">20%</span>
                <!-- 测试邮件设置成功！-->
                <div id="sendMailTestSuccess" style="text-align:center;font-size:20px;display:none">
                    <spring:message code="wizard.smtpsetting.label.testsendsucc"/>
                </div>
                <!-- 测试邮件设置失败！-->
                <div id="sendMailTestFail" style="text-align:center;font-size:20px;display:none">
                    <spring:message code="wizard.smtpsetting.label.sendfail"/>
                </div>
                <!-- 邮箱服务器认证失败!-->
                <div id="authenticationFail" style="text-align:center;font-size:20px;display:none">
                    <spring:message code="wizard.smtpsetting.label.authfail" />
                </div>
                <!-- 无法连接邮箱服务器!-->
                <div id="connectFail" style="text-align:center;font-size:20px;display:none">
                    <spring:message code="wizard.smtpsetting.label.connfail"/>
                </div>
            </div>
        </div>
    </div>
</div>