<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="m-cp">
    <div class="col-xs-12">
        <div class="row">

            &lt;&nbsp;<a class="back" href="javascript:conferenceplan.returnMain();"><spring:message code="conferenceplan.jsp.btn.back"/></a>
            &lt;&nbsp;<spring:message code="conferenceplan.jsp.common.edit.general.conference"/>
        </div>

        <div class="row" style="margin-top:30px">
            <form class="form-horizontal" role="form" id="m_ncp_edit" onsubmit="return false">
                <input class="form-control" name="conferencePlanId" maxlength="128"  value="{{conferencePlan._id}}" type="hidden"/>
                <div class="c-row-title">
                    <a onclick="conferenceplan.toggleSource('m_ncp_edit', this)"  id="toggleSource" style="cursor: pointer;color: #00beeb;"><spring:message code="conferenceplan.jsp.common.label.roomutilization"/>
                        <i class="glyphicon glyphicon-chevron-up"></i>
                    </a>
                </div>
                <div class="c-row-block panel panel-body" name="confSourcePanel">
                    <div class="form-group">
                        <div class="clearfix">
                            <span class="pull-left"><spring:message code="conferenceplan.jsp.common.label.room.list"/></span>
                            <div class="pull-right c-resource-datetimepicker">
                                <span class="control-label"><spring:message code="conferenceplan.jsp.common.label.date"/>:</span>
                                <input class="form-control  ical-icon" name="queryDate" readonly/>
                            </div>
                        </div>
                        <div class="calendar" style="width:100%"></div>
                    </div>
                </div>
                <div class="c-row-block panel panel-body">
                    <%--会议主题--%>
                    <label class="m-conf-msg-offset m-error-message" hidden="hidden"></label>
                    <div class="form-group">
                        <div class="m-conf-info-title">
                            <span class="pull-left control-label">
                                <spring:message code="conferenceplan.jsp.book.label.theme"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="col-xs-6">
                            <input class="form-control" name="name" maxlength="128"  value="{{conferencePlan.name}}"/>
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
                                <div id="date_time_select" {{if conferencePlan.recurrencePattern.recurrenceType!='RECURS_ONCE'}}hidden="true"{{/if}}>
                                    <div class="m-conf-date">
                                        <input class="form-control" name="conferenceDate"
                                               value="{{conferencePlan.conferenceDate}}"
                                               readonly style="max-width: 240px;"/>
                                    </div>
                                    <div class="m-conf-time validate">
                                        <input class="form-control" name="conferenceStartTime"
                                               value="{{conferencePlan.conferenceStartTime}}"
                                               readonly/>
                                    </div>
                                    <div class="m-conf-to control-label" style="text-align: center">
                                        <spring:message code="conferenceplan.common.date.to"/>
                                    </div>
                                    <div class="m-conf-date">
                                        <input class="form-control" name="conferenceEndDate" readonly style="max-width: 240px;" value="{{conferencePlan.conferenceEndDate}}"/>
                                    </div>
                                    <div class="m-conf-time">
                                        <input class="form-control" name="conferenceEndTime" readonly
                                               value="{{conferencePlan.conferenceEndTime}}"/>
                                    </div>
                                </div>
                                <div class="m-conf-timezone-recurrence control-label" style="text-align: left">
                                    <a class="conf-a" href="javascript:void(0)" onclick="conferenceplan.showTimeZone('m_ncp_edit',this)"><spring:message code="conferenceplan.jsp.book.label.display.time.zone"/></a>
                                    <a class="conf-a" href="javascript:void(0)" onclick="conferenceplan.setConferencePeriod('edit','m_ncp_edit')"><spring:message code="conferenceplan.jsp.book.recur.label.recurrence"/></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <%--会议时区--%>
                    <div class="form-group" id="time_zone_div">
                        <div class="m-conf-info-title">
                            <span class="pull-left control-label">
                                <spring:message code="conferenceplan.jsp.book.label.time.zone"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="col-xs-6 content">
                            <select name="timeZoneName" class="form-control" id="time_zone">
                                {{each timeZones as prop}}
                                <option value="{{prop.zoneId}}" utcOffset="{{prop.utcOffset}}"
                                        {{if prop.zoneId===conferencePlan.timeZoneName}}selected{{/if}}>
                                    <c:choose>
                                    <c:when test="${sessionScope.language eq 'zh_CN'}">{{prop.cnZoneName}}</c:when>
                                    <c:when test="${sessionScope.language eq 'en'}">{{prop.usZoneName}}</c:when>
                                        <c:otherwise></c:otherwise>
                                    </c:choose>
                                    {{/each}}
                            </select>
                        </div>
                    </div>
                    <%--会议周期--%>
                    <div class="form-group" id="recurrence_pattern_div" {{if conferencePlan.recurrencePattern.recurrenceType==='RECURS_ONCE'}}hidden="true"{{/if}}>
                        <div class="m-conf-info-title">
                            <span class="pull-left">
                                <spring:message code="conferenceplan.jsp.book.recur.label.recurrence"/>
                            </span>
                        </div>
                        <div class="col-xs-6 content">
                            {{conferencePlan.recurrencePattern.display}}
                        </div>
                    </div>
                    <%--会议室--%>
                    <label class="m-conf-msg-offset m-error-message" hidden="hidden"></label>
                    <div class="form-group validate">
                        <div class="m-conf-info-title">
                            <span class="pull-left">
                                <spring:message code="conferenceplan.jsp.common.label.room"/>
                                <span style="color: red">*</span>
                            </span>
                        </div>
                        <div class="col-xs-6">
                            <select name="conferenceRoomId" id="conferenceRoomId" class="form-control">
                                <%-- 带图标下拉选项 --%>
                                <%--{{each conferenceRooms as prop index}}
                                    <option value="{{prop._id}}"
                                        {{if prop._id===conferencePlan.conferenceRooms[0].id}}selected{{/if}}
                                        {{if prop.type === 'normal_room'}}
                                            data-iconurl="/img/conference/green_nr.png"
                                        {{else}}
                                            data-iconurl="/img/conference/green_vr.png"
                                        {{/if}}
                                        >{{prop.name}}
                                    </option>
                                {{/each}}--%>
                                {{each conferenceRooms as prop index}}
                                    <option value="{{prop._id}}" {{if prop._id===conferencePlan.conferenceRooms[0].id}}selected{{/if}} >{{prop.name}}</option>
                                {{/each}}
                            </select>
                        </div>
                    </div>
                    <%--参会人员--%>
                    <div class="form-group">
                        <div class="m-conf-info-title">
                            <span class="pull-left conf-info-label">
                                <spring:message code="conferenceplan.jsp.book.participants"/>
                            </span>
                        </div>
                        <div class="m-conf-content-percent-89">
                            <div id="participant_content">
                                {{each conferenceParticipants as prop index}}
                                <div class="content-block-removeable">
                                    {{if prop.type==='Internal'}}
                                        <img src="img/conference/internal_staff.png">
                                        {{if conferencePlan.creator.id!=prop.id}}
                                            <button  class="close btn-phone-close" onclick="conplan_participantselect.removeItem(this,'{{prop.id}}','selectParticipantIds')">×</button>
                                        {{/if}}
                                        <span title="{{ prop.name | showStaffName:prop.email}}">
                                            {{ prop.name | showStaffName:prop.email}}
                                        </span>
                                    {{else}}
                                        <img src="img/conference/external_staff.png">
                                        <button  class="close btn-phone-close" onclick="conplan_participantselect.removeItem(this,'{{prop.email}}','selectExternalParticipantIds')">×</button>
                                        <span title="{{prop.email}}">{{prop.email}}</span>
                                    {{/if}}
                                </div>
                                {{/each}}
                            </div>

                            <div class="content-block-removeable no-border-padding">
                                <a class="no-underline conf-plus-circle m-conf-add" href="javascript:void(0);" onclick="conferenceplan.addParticipant('nc_plan_edit','NC')" title="<spring:message code="conferenceplan.jsp.book.addstaff.btn.add.participants"/>">
                                    <img src="img/operation/add-blue.png"><span></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    {{if isOutlookLogin==='false' }}
                    <%--备注--%>
                    <div class="form-group">
                        <div class="m-conf-info-title">
                                <span class="pull-left conf-info-label">
                                    <spring:message code="conferenceplan.jsp.book.conference.description"/>
                                </span>
                        </div>
                        <div class="m-conf-content-percent-89">
                            <textarea name="editor_nc_plan_edit" id="editor_nc_edit" rows="3" cols="80">
                            </textarea>
                        </div>
                    </div>
                    {{/if}}
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col-xs-3">
            </div>
            <div class="col-xs-2">
                <button type="button" class="btn btn-success" onclick="conferenceplan.edit('m_ncp_edit','NC', '{{conferencePlan.appointmentId}}')">
                    <spring:message code="conferenceplan.jsp.common.btn.save.send.email"/>
                </button>
            </div>
            <div class="col-xs-2">
                <button type="button" class="btn btn-block btn-default" onclick="conferenceplan.cancelOperation()">
                    <spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                </button>
            </div>
        </div>
    </div>
</div>
<input type="hidden" id="creatorId" value="{{conferencePlan.creator.id}}"/>
