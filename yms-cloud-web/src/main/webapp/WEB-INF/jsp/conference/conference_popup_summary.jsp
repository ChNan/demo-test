<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div  class="text pop-up-content">
    <p><span class="span-text-ellipsis" title="{{name}}"><spring:message code="conferenceplan.jsp.common.theme"/>: {{name}}</span></p>
    <p> <span ><spring:message code="conferenceplan.jsp.common.datetime"/>:
        {{ conferenceStartDateTime | conferenceDurationSimpleTime : conferenceEndDateTime}}
    </span></p>
    <p><span class="span-text-ellipsis" title="{{creator.name}}">
        <spring:message code="conferenceplan.jsp.common.organizer"/>: {{creator.name}}
    </span></p>
</div>
