<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<div class="panel panel-body m-wizard-body-panel" id="netSettingDivId">
    <form role="form" id="form1">
        <div class="form-group">
            <!-- 本机域名： -->
            <label class="control-label m-ns-label"><spring:message code="wizard.netsetting.label.domainname"/></label>
            <input type="text" name="domainName" id="domainName" class="form-control m-ns-input"
                    maxlength="128">
        </div>
        <label>
            <div id="intranetSettingDiv" class="wi-net-font">
                <!-- 内网设置 -->
                <input type="checkbox" name="intranet" id="intranet"> <spring:message code="wizard.netsetting.label.intranetset"/>
            </div>
        </label>
        <div class="m-ns-intranet display-none">
            <div class="form-group">
                <!-- 网卡设置： -->
                <label class="control-label m-ns-label"><spring:message code="wizard.netsetting.label.selectnetcard"/></label>
                <select class="form-control m-ns-input" name="intranetCard" id="intranetCard">
                </select>
            </div>
            <div class="form-group">
                <!-- 网口类型： -->
                <label class="control-label m-ns-label"><spring:message code="wizard.netsetting.label.cardtype"/></label>
                <div class="radio">
                    <label>
                        <!-- 静态IP地址 -->
                        <input type="radio" tp="1" checked name="intIpMethod"> <spring:message code="wizard.netsetting.label.static"/>
                    </label>
                </div>
            </div>
            <div class="m-ns-staticipaddress m-ns-intranetSetting">
                <div class="form-group">
                    <!-- IP地址： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.ipaddress"/></label>
                    <input type="text" class="form-control ipFormatInput" name="ipAddress" placeholder='<spring:message code="wizard.netsetting.label.ipaddress"/>'>
                </div>
                <div class="form-group">
                    <!-- 子网掩码： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.netmask"/></label>
                    <input type="text" class="form-control ipFormatInput" name="subnetMask" placeholder='<spring:message code="wizard.netsetting.label.netmask"/>'>
                </div>
                <div class="form-group">
                    <!-- 网关地址： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.gateway"/></label>
                    <input type="text" class="form-control ipFormatInput" name="gateway" placeholder='<spring:message code="wizard.netsetting.label.gateway"/>'>
                </div>
                <div class="form-group">
                    <!-- 首选DNS： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.preferdns"/></label>
                    <input type="text" class="form-control ipFormatInput" name="preferredDNS" placeholder='<spring:message code="wizard.netsetting.label.preferdns"/>'>
                </div>
                <div class="form-group">
                    <!-- 备选DNS： -->
                    <label class="control-label"><spring:message code="wizard.netsetting.label.alterdns"/></label>
                    <input type="text" class="form-control ipFormatInput" name="alternativeDNS" placeholder='<spring:message code="wizard.netsetting.label.alterdns"/>'>
                </div>
            </div>
        </div>

        <label class="display-block">
            <!-- 外网设置 -->
            <input type="checkbox" name="extranet" id="extranet"> <span class="wi-net-font"><spring:message code="wizard.netsetting.label.extranet"/></span>
        </label>
        <div class="m-ns-extranet display-none">
            <div class="form-group">
                <!-- 网卡设置： -->
                <label class="control-label m-ns-label"><spring:message code="wizard.netsetting.label.selectnetcard"/></label>
                <select class="form-control m-ns-input" name="extranetCard" id="extranetCard">
                </select>
            </div>
            <div class="form-group">
                <!-- 网口类型： -->
                <label class="control-label m-ns-label"><spring:message code="wizard.netsetting.label.cardtype"/></label>
                <div class="radio">
                    <label>
                        <!-- 静态IP地址 -->
                        <input type="radio" tp="1" checked name="extIpMethod"> <spring:message code="wizard.netsetting.label.static"/>
                    </label>
                </div>
            </div>
            <div class="m-ns-staticipaddress m-ns-extranetSetting">
                <div class="form-group">
                    <!-- IP地址： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.ipaddress"/></label>
                    <input type="text" class="form-control ipFormatInput" name="ipAddress1" placeholder='<spring:message code="wizard.netsetting.label.ipaddress"/>'>
                </div>
                <div class="form-group">
                    <!-- 子网掩码： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.netmask"/></label>
                    <input type="text" class="form-control ipFormatInput" name="subnetMask1" placeholder='<spring:message code="wizard.netsetting.label.netmask"/>'>
                </div>
                <div class="form-group">
                    <!-- 网关地址： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.gateway"/></label>
                    <input type="text" class="form-control ipFormatInput" name="gateway1" placeholder='<spring:message code="wizard.netsetting.label.gateway"/>'>
                </div>
                <div class="form-group">
                    <!-- 首选DNS： -->
                    <label class="control-label "><spring:message code="wizard.netsetting.label.preferdns"/></label>
                    <input type="text" class="form-control ipFormatInput" name="preferredDNS1" placeholder='<spring:message code="wizard.netsetting.label.preferdns"/>'>
                </div>
                <div class="form-group">
                    <!-- 备选DNS： -->
                    <label class="control-label"><spring:message code="wizard.netsetting.label.alterdns"/></label>
                    <input type="text" class="form-control ipFormatInput" name="alternativeDNS1" placeholder='<spring:message code="wizard.netsetting.label.alterdns"/>'>
                </div>
            </div>

            <div class="form-group">
                <label class="control-label m-ns-label">NAT：</label>
                <label >
                    <!-- 启用 -->
                    <input type="checkbox" name="nat" id="nat"> <spring:message code="wizard.netsetting.label.start"/>
                </label>
            </div>
            <div class="m-ns-natSetting m-ns-staticipaddress display-none">
                <div class="form-group">
                    <!-- IP地址： -->
                    <label class="control-label"><spring:message code="wizard.netsetting.label.publicaddr"/></label>
                    <input type="text" class="form-control ipFormatInput" name="publicNetAddr" id="publicNetAddr" placeholder='<spring:message code="wizard.netsetting.label.publicaddr"/>'>
                </div>
            </div>
        </div>

        <label class="display-block m-ns-lt1">
            <!-- 路由规则 -->
            <input type="checkbox" name="routeSet" id="routeSet" disabled> <span><spring:message code="wizard.netsetting.label.routeset"/> </span>
            <!-- 路由规则可指定访问目标IP地址时使用的网卡。当使用双网卡时，至少要设置一项。 -->
            <span class="m-ns-routerdesc"><spring:message code="wizard.netsetting.label.intraextrroute"/></span>
        </label>
        <div class="m-ns-routesetting display-none">
            <table id="m-ns-routeset-table"></table>
            <a class="no-underline" href="javascript:void(0);"
               id="addRouterSetAhref">
                <!-- 添加路由规则 -->
                <img src="<%=request.getContextPath()%>/img/button/add.png"><span class="m-ns-route-addbtn"><spring:message code="wizard.netsetting.label.addroute"/></span>
            </a>
        </div>

        <div class="form-group step-btn-group">
            <button type="button" onclick="netsettingwizard.save('basicConfig')" class="btn btn-lg btn-yealink-wizard">
                <spring:message code="wizard.userchg.label.confirmnextstep"/>
            </button>
            <c:if test="${isWizarded}">
                <!-- 跳过 -->
                <input type="button" onclick="netsettingwizard.confirmNextstep()" class="btn btn-lg btn-yealink-wizard step-btn-group-btn2" value='<spring:message code="wizard.userchg.label.jumpstep"/>'/>
            </c:if>
        </div>
    </form>
</div>