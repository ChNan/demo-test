<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="m-cp">
    <div class="col-xs-12">
        <div class="row">
            &lt;&nbsp;<a class="back" href="javascript:conferenceplan.returnMain();"><spring:message code="conferenceplan.jsp.btn.back"/></a>
            &lt;&nbsp;<spring:message code="conferenceplan.jsp.common.label.see.details"/>
        </div>
        <form class="form-horizontal" id="m_vcr_detail">
            <div class="row" style="margin-top:30px">
                <div class="c-row-title">
                    <a onclick="conferenceplan.toggleSource('m_vcr_detail', this)" id="toggleSource" style="cursor: pointer;color: #00beeb;"><spring:message code="conferenceplan.jsp.common.label.roomutilization"/>
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
                <div class="c-row-title"><spring:message code="conferenceplan.jsp.common.label.conference.detail"/></div>
                <div class="c-row-block panel panel-body">
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.theme"/></span></div>
                        <div class="col-xs-6 g-text-ellipsis" title="{{subject}}">
                            {{subject}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.datetime"/> </span></div>
                        <div class="col-xs-11">
                            {{conferenceDurationTimeWithWeek(startTime,expiryTime)}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.label.timezone"/></span></div>
                        <div class="col-xs-6">
                            {{localeTimeZoneDisplay}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.conference.type"/></span></div>
                        <div class="col-xs-6">
                            {{if conferenceType=='VC'}}
                                <spring:message code="conferenceplan.jsp.common.video.conference"/>
                            {{else if conferenceType=='MN'}}
                                <spring:message code="conferenceplan.jsp.common.meetnow.conference"/>
                            {{/if}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.conference.id"/></span></div>
                        <div class="col-xs-6">
                            {{conferenceNumber}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.conference.pwd"/></span></div>
                        <div class="col-xs-6">
                            {{pinCode}}
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-xs-1"><span class="pull-left"><spring:message code="conferenceplan.jsp.common.organizer"/></span></div>
                        <div class="col-xs-6 g-text-ellipsis" title="{{organizerName}}">
                            {{organizerName}}
                        </div>
                    </div>
                </div>
                <div class="c-row-title"><spring:message code="conferenceplan.jsp.common.label.room.info"/></div>
                <div class="c-row-block panel panel-body">
                    <div class="row">
                        <div class="col-xs-1"><span class="pull-left conf-info-label"><spring:message code="conferenceplan.jsp.common.label.room"/></span></div>
                        <div class="col-xs-10">
                            {{each rooms as prop index}}
                                <div class="c-m-block-detail">
                                    {{if prop.type=='normal_room'}}
                                        <img src="img/conference/green_nr.png">
                                    {{else if prop.type=='vc_room'}}
                                        <img src="img/conference/green_vr.png">
                                    {{/if}}
                                    {{prop.title}}
                                 </div>
                            {{/each}}
                        </div>
                    </div>
                </div>
                <div class="c-row-title"><spring:message code="conferenceplan.jsp.common.label.participant.info"/></div>
                <div class="c-row-block panel panel-body" >
                    <div class="row">
                        <div class="col-xs-1"><span class="pull-left conf-info-label"> <spring:message code="conferenceplan.jsp.book.participants"/></span></div>
                        <div class="col-xs-11" id="participant_show">
                            {{each participants as prop index}}
                                {{if prop.permission==='attendee'}}
                                   <div class="c-m-block-detail">
                                       {{if prop.uid!=null && prop.uid!=''}}
                                            <img src="img/conference/internal_staff.png">
                                            <span title="{{ prop.displayText | showStaffName:prop.email}}">
                                                {{ prop.displayText | showStaffName:prop.email}}
                                            </span>
                                       {{else}}
                                            <img src="img/conference/external_staff.png">
                                            <span title="{{prop.displayText}}">
                                                {{prop.displayText}}
                                             </span>
                                       {{/if}}
                                   </div>
                                {{/if}}
                            {{/each}}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-1"><span class="pull-left conf-info-label"><spring:message code="conferenceplan.jsp.common.label.basic.moderators"/></span></div>
                        <div class="col-xs-11">
                            {{each participants as prop index}}
                                {{if prop.permission==='presenter'}}
                                    <div class="c-m-block-detail">
                                        <img src="img/conference/internal_staff.png">
                                        <span title="{{ prop.displayText | showStaffName:prop.email}}">
                                            {{ prop.displayText | showStaffName:prop.email}}
                                        </span>
                                    </div>
                                {{/if}}
                            {{/each}}
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="row">
            {{if isPresenter}}
                <div class="col-xs-2 col-xs-offset-3">
                    <button type="button" class="btn btn-success" onclick="conferenceplan.showEdit('{{conferencePlanId}}','{{conferenceRecordId}}')">
                        <spring:message code="conferenceplan.jsp.btn.edit"/>
                    </button>
                </div>
            {{/if}}
            <div class="col-xs-2 col-xs-offset-2">
                <button type="button" class="btn btn-block btn-default" onclick="conferenceplan.returnMain()">
                    <spring:message code="conferenceplan.jsp.btn.back"/>
                </button>
            </div>
        </div>
    </div>
</div>