<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div  class="text pop-up-content">
    <p><span class="span-text-ellipsis" title="{{subject}}"><spring:message code="conferenceplan.jsp.common.theme"/>: {{subject}}</span></p>
    <p><span><spring:message code="conferenceplan.jsp.common.datetime"/>: {{startTime | conferenceDurationTime : expiryTime}} </span></p>
    {{if rooms!=null}}
        <p>
            <span class="span-text-ellipsis-ng" title="{{roomListShow(rooms,'title')}}">
                <spring:message code="conferenceplan.jsp.list.location"/>: {{roomListShow(rooms,'text')}}
            </span>
        </p>
    {{/if}}
    <p><span><spring:message code="conferenceplan.jsp.common.conference.type"/>:
        {{if conferenceType==='VC'}}<spring:message code="conferenceplan.jsp.common.video.conference"/>
        {{else if conferenceType==='NC'}}<spring:message code="conferenceplan.jsp.common.general.conference"/>
        {{else}}<spring:message code="conferenceplan.jsp.common.meetnow.conference"/> {{/if}}</span></p>
    {{if conferenceType==='VC' || conferenceType==='MN'}}
        <p><span><spring:message code="conferenceplan.jsp.common.conference.id"/>: {{conferenceNumber}}</span></p>
    {{/if}}
    <p><span class="span-text-ellipsis" title="{{organizerName}}">
        <spring:message code="conferenceplan.jsp.common.organizer"/>: {{organizerName}}
    </span></p>

    <div class="clearfix">
        {{if state ===2 || state ===1 }}
                <a href="javascript:conferenceplan.showConferenceEndLivingRecordDetail('{{conferenceRecordId}}');" class="btn btn-success btn-sm popup-btn-detail">
                    <spring:message code="conferenceplan.jsp.common.label.see.details"/></a>
        {{else}}
                <a class="btn btn-success btn-sm popup-btn-detail" href="javascript:conferenceplan.showConferenceReadyRecordDetail('{{conferenceRecordId}}','{{conferencePlanId}}');"
                   ><spring:message code="conferenceplan.jsp.common.label.see.details"/></a>
                </a>
        {{/if}}
        {{if isPresenter }}
            {{if !isOutlookLogin}}
                {{if state ===1 && (conferenceType==='VC'|| conferenceType==='MN')}}
                    <a class="btn btn-success btn-sm popup-btn-ctrl pull-right" href="/html/conference/conference_ctrl.html?confId={{conferenceRecordId}}"
                       ><spring:message code="conferenceplan.jsp.common.conference.ctrl"/>
                    </a>
                {{else if state=== 0 && active===true && conferenceType==='VC'}}
                    <a class="btn btn-success btn-sm popup-btn-ctrl pull-right" href="/html/conference/conference_ctrl.html?confId={{conferenceRecordId}}"
                        ><spring:message code="conferenceplan.jsp.common.conference.ctrl"/>
                    </a>
                {{/if}}
            {{/if}}
            {{if state ===0 && active!=true}}
                <a href="javascript:conferenceplan.showDelete('{{conferencePlanId}}','{{conferenceRecordId}}',false);" class="btn btn-danger btn-sm popup-btn-delete pull-right">
                    <spring:message code="conferenceplan.jsp.btn.remove"/></a>
                </a>
            {{/if}}
        {{/if}}
    </div>
</div>
