<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="removeable-li {{if !isCreator }}removeable-x-btn{{/if}} " id="{{id}}" type="{{type}}" name="{{name}}" email="{{email}}">
    {{if type=='email'}}
        <span class="external-staff-icon"/>
    {{else}}
        <span class="internal-staff-icon"/>
    {{/if}}
    <span class="chose-name" title="{{ name}}">{{nameWithEmail}}</span>
    {{if !isCreator }}
        <span class="remove-btn" title="<spring:message code="conferenceplan.jsp.btn.remove.staff"/>"
              onclick="conplan_participantselect.deleteStaff('{{id}}','{{treeId}}','{{type}}',this);"> </span>
    {{/if}}

</div>
