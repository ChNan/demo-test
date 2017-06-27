<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="m-cp clearfix">
    <div class="col-xs-12">
        <div class="row">
            &lt;&nbsp;<a class="back" href="javascript:conferenceplan.returnMain();"><spring:message code="conferenceplan.jsp.btn.back"/></a>
            &lt;&nbsp;<spring:message code="conferenceplan.jsp.main.title.book.nc"/>
        </div>
        <div class="row" style="margin-top:30px">
            <form class="form-horizontal" role="form" id="m_ncp_add" onsubmit="return false">
                <div class="c-row-title">
                    <a onclick="conferenceplan.toggleSource('m_ncp_add', this)"  id="toggleSource" style="cursor: pointer;color: #00beeb;"><spring:message code="conferenceplan.jsp.common.label.roomutilization"/>
                        <i class="glyphicon glyphicon-chevron-up"></i>
                    </a>
                </div>
                <div class="c-row-block panel panel-body" name="confSourcePanel">
                    <div class="form-group">
                        <div class="clearfix">
                            <span class="pull-left"><spring:message code="conferenceplan.jsp.common.label.room.list"/></span>
                            <div class="pull-right c-resource-datetimepicker">
                                <span class="control-label"><spring:message code="conferenceplan.jsp.common.label.date"/>:</span>
                                <input class="form-control ical-icon" name="queryDate" readonly/>
                            </div>
                        </div>
                        <div class="calendar" style="width:100%"></div>
                    </div>
                </div>

                <div class="c-row-title"><spring:message code="conferenceplan.jsp.common.label.meeting.info"/></div>
                <div class="c-row-block panel panel-body">
                    <%--会议主题--%>
                    <label class="m-conf-msg-offset m-error-message" hidden="hidden"></label>
                    <div class="form-group">
                        <div class="m-conf-info-title control-label">
                            <span class="pull-left">
                                <spring:message code="conferenceplan.jsp.book.label.theme"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-60">
                            <input class="form-control" name="name" maxlength="128" value="{{defaultName}}" style="color: #999"/>
                        </div>
                    </div>
                    <%--时间日期--%>
                    <div class="form-group">
                        <div class="m-conf-info-title">
                            <span class="pull-left control-label">
                                <spring:message code="conferenceplan.jsp.common.datetime"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-60">
                            <div class="row">
                                <div id="date_time_select">
                                    <div class="m-conf-date">
                                            <input class="form-control" name="conferenceDate" readonly style="max-width: 240px;"/>
                                    </div>
                                    <div class="m-conf-time">
                                            <input class="form-control" name="conferenceStartTime" readonly />
                                    </div>
                                    <div class="m-conf-to control-label" style="text-align: center"><spring:message code="conferenceplan.common.date.to"/></div>
                                    <div class="m-conf-date">
                                        <input class="form-control" name="conferenceEndDate" readonly style="max-width: 240px;"/>
                                    </div>
                                    <div class="m-conf-time">
                                            <input class="form-control" name="conferenceEndTime" readonly/>
                                    </div>
                                </div>
                                <div class="m-conf-timezone-recurrence control-label"  style="text-align: left">
                                    <a class="conf-a" href="javascript:void(0)" onclick="conferenceplan.showTimeZone('m_ncp_add',this)"><spring:message code="conferenceplan.jsp.book.label.display.time.zone"/></a>
                                    <a class="conf-a" href="javascript:void(0)" onclick="conferenceplan.setConferencePeriod('add','m_ncp_add')"><spring:message code="conferenceplan.jsp.book.recur.label.recurrence"/></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <%--会议时区--%>
                    <div class="form-group" id="time_zone_div">
                        <div class="m-conf-info-title control-label">
                            <span class="pull-left">
                                <spring:message code="conferenceplan.jsp.book.label.time.zone"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-60 content">
                            <select name="timeZoneName" class="form-control" id="time_zone">
                                {{each timeZones as prop}}
                                    <option value="{{prop.zoneId}}" utcOffset="{{prop.utcOffset}}">
                                        <c:choose>
                                            <c:when test="${sessionScope.language eq 'zh_CN'}">{{prop.cnZoneName}}</c:when>
                                            <c:when test="${sessionScope.language eq 'en'}">{{prop.usZoneName}}</c:when>
                                            <c:otherwise></c:otherwise>
                                        </c:choose>
                                    </option>
                                {{/each}}
                            </select>
                        </div>
                    </div>
                    <%--会议周期--%>
                    <div class="form-group" id="recurrence_pattern_div" hidden="true">
                        <div class="m-conf-info-title"><span class="pull-left"><spring:message code="conferenceplan.jsp.book.recur.label.recurrence"/> </span></div>
                        <div class="m-conf-content-percent-60 content">
                        </div>
                    </div>
                    <%--会议室--%>
                    <label class="m-conf-msg-offset m-error-message" hidden="hidden"></label>
                    <div class="form-group validate" id="conferenceRoomIdDiv">
                        <div class="m-conf-info-title">
                            <span class="pull-left control-label">
                                <spring:message code="conferenceplan.jsp.common.label.room"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-89">
                            <select name="conferenceRoomId" id="conferenceRoomId" class="form-control">
                                <%-- 带图标下拉框 --%>
                                <%--{{each rows.records as prop index}}
                                    <option value="{{prop.conferenceRoomId}}"
                                        {{if prop.conferenceRoomType === 'normal_room'}}
                                            data-iconurl="/img/conference/green_nr.png"
                                        {{else}}
                                            data-iconurl="/img/conference/green_vr.png"
                                        {{/if}}
                                    >{{prop.name}}</option>
                                {{/each}}--%>
                                {{each rows.records as prop index}}
                                    <option value="{{prop.conferenceRoomId}}">{{prop.name}}</option>
                                {{/each}}
                            </select>
                        </div>
                    </div>
                    <%--参会人员--%>
                    <div class="form-group">
                        <div class="m-conf-info-title">
                            <span class="pull-left control-label">
                                <spring:message code="conferenceplan.jsp.book.participants"/>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-89">
                            <div id="participant_content">
                                <div class="content-block-removeable">
                                    <img src="img/conference/internal_staff.png">
                                        <span title="{{ loginStaffName | showStaffName:loginStaffEmail}}">
                                            {{ loginStaffName | showStaffName:loginStaffEmail}}
                                        </span>
                                </div>
                            </div>

                            <div class="content-block-removeable no-border-padding">
                                <a class="no-underline conf-plus-circle m-conf-add" href="javascript:void(0);" onclick="conferenceplan.addParticipant('nc_plan_add','NC')" title="<spring:message code="conferenceplan.jsp.book.addstaff.btn.add.participants"/>">
                                    <img src="img/operation/add-blue.png"><span></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    {{if isOutlookLogin==="false" }}
                    <%--备注--%>
                    <div class="form-group">
                        <div class="m-conf-info-title">
                            <span class="pull-left conf-info-label">
                                <spring:message code="conferenceplan.jsp.book.conference.description"/>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-89">
                            <textarea name="editor_nc_plan_add" id="editor_nc_add" rows="3" cols="80">
                            </textarea>
                        </div>
                    </div>
                    {{/if}}
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col-xs-2 col-xs-offset-3">
                <button type="button" class="btn btn-success" onclick="conferenceplan.save('m_ncp_add','NC')">
                    <spring:message code="conferenceplan.jsp.book.submit.send.email"/>
                </button>
            </div>
            <div class="col-xs-2 col-xs-offset-2">
                <button type="button" class="btn btn-block btn-default" onclick="conferenceplan.cancelOperation()">
                    <spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                </button>
            </div>
        </div>
    </div>
</div>
<input type="hidden" id="creatorId" value="{{creatorId}}"/>
