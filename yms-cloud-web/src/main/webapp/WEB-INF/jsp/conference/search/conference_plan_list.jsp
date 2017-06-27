<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="list-table-header">
    <table class="table table-head" align="center">
        <thead>
        <tr class="table-tr-head">
            <th class="white-color"><spring:message code="conferenceplan.jsp.list.theme"/></th>
            <th width="20%" class="white-color">
                {{if state=== 0}}
                <spring:message code="conferenceplan.jsp.list.date.nearly.month"/>
                {{else}}
                <spring:message code="conferenceplan.jsp.list.date"/>
                {{/if}}
            </th>
            <th width="18%" class="white-color"><spring:message code="conferenceplan.jsp.list.location"/></th>
            <th width="15%" class="white-color"><spring:message code="conferenceplan.jsp.common.organizer"/></th>
            {{if state != 2}}
                <th width="9%" class="white-color"><spring:message code="conferenceplan.jsp.list.type"/></th>
            {{/if}}
            <th width="7%" class="white-color"><spring:message code="conferenceplan.jsp.common.conference.id"/></th>
            {{if state=== 1 || state=== 2}}
                <th width="10%" class="white-color"><spring:message code="conferenceplan.jsp.common.duration"/></th>
            {{/if}}
            <th width="7%" class="white-color"><spring:message code="conferenceplan.jsp.btn.operation"/></th>
        </tr>
        </thead>
    </table>
</div>
{{if totalCount >0}}
<div class="div-scroll-table-body" id="conf_scroll_div">

    <table class="table table-content" align="center" id="conf_scroll_table">
        <tbody>
        {{each pageModel.records as prop index}}
        <tr class=" {{if index % 2 ===0}}
                        table-striped-tr-even
                    {{else}}
                        table-striped-tr-odd
                    {{/if}}">
            <td title="{{ prop.subject}}">
                {{if prop.state ===2 || prop.state ===1 || (prop.state=== 0 && prop.active===true)}}
                <a class="no-underline" style="text-decoration:none;color: #444444" onclick="conferenceplan.showConferenceEndLivingRecordDetail('{{prop.conferenceRecordId}}')"
                   href="javascript:void(0);" title="{{ prop.subject}}">
                    {{ prop.subject}}
                </a>
                {{else}}
                <a class="no-underline" style="text-decoration:none;color: #444444" onclick="conferenceplan.showConferenceReadyRecordDetail('{{prop.conferenceRecordId}}')"
                   href="javascript:void(0);" title="{{ prop.subject}}">
                    {{ prop.subject}}
                </a>
                {{/if}}
            </td>
            <td width="20%" title="{{ prop.startTime | conferenceDurationTime : prop.expiryTime}}">
                {{ prop.startTime | conferenceDurationTime : prop.expiryTime}}
            </td>
            <td width="18%" title="{{roomListShow(prop.rooms,'title')}}" >
                {{roomListShow(prop.rooms,'text')}}
            </td>
            <td width="15%" title="{{ prop.organizerName}}">
                {{ prop.organizerName}}
            </td>
            {{if state != 2}}
                <td width="9%">
                    {{if prop.confType ===1 }}
                        <spring:message code="conferenceplan.jsp.common.video.conference"/>
                    {{else if prop.confType ===0}}
                        <spring:message code="conferenceplan.jsp.common.general.conference"/>
                    {{else}}
                        <spring:message code="conferenceplan.jsp.common.meetnow.conference"/>
                    {{/if}}
                </td>
            {{/if}}
             <td width="7%">
                {{ prop.conferenceNumber}}
            </td>
            {{if prop.state=== 1 }}
                <td width="10%" class="start_time" data-start-time="{{ prop.startTime}}">
                </td>
            {{else if prop.state=== 2}}
                <td width="10%">
                    {{prop.elapsedTime}}
                </td>
            {{/if}}

            <td width="7%">
            <div class="td-div-operation">
                  {{if prop.state ===2 || prop.state ===1 || (prop.state=== 0 && prop.active===true)}}
                        <a class="no-underline detail" onclick="conferenceplan.showConferenceEndLivingRecordDetail('{{prop.conferenceRecordId}}')"
                            href="javascript:void(0);" title="<spring:message code="conferenceplan.jsp.common.label.conference.detail"/>">
                        </a>
                  {{else}}
                        <a class="no-underline detail" onclick="conferenceplan.showConferenceReadyRecordDetail('{{prop.conferenceRecordId}}')"
                          href="javascript:void(0);" title="<spring:message code="conferenceplan.jsp.common.label.conference.detail"/>">
                        </a>
                  {{/if}}

                  {{if prop.isPresenter}}
                      {{if prop.state ===1 && (prop.confType ===1 || prop.confType ===2)}}
                          <a class="no-underline control margin-left15" href="/html/conference/conference_ctrl.html?confId={{prop.conferenceRecordId}}"
                              title="<spring:message code="conferenceplan.jsp.common.conference.ctrl"/>">
                          </a>
                      {{else if prop.state=== 0 && prop.active===true && prop.confType ===1}}
                            <a class="no-underline control margin-left15" href="/html/conference/conference_ctrl.html?confId={{prop.conferenceRecordId}}"
                                title="<spring:message code="conferenceplan.jsp.common.conference.ctrl"/>">
                            </a>
                     {{/if}}

                     {{if prop.state ===0 && prop.active!=true}}
                            <a class="no-underline delete margin-left15" id="delete_{{prop.conferenceRecordId}}"
                               href="javascript:conferenceplan.showDelete('{{prop.conferencePlanId}}','{{prop.conferenceRecordId}}',true);"
                               title="<spring:message code="conferenceplan.jsp.common.conference.remove"/>"
                               >
                            </a>
                      {{/if}}
                  {{/if}}
                </div>
            </td>
        </tr>
        {{/each}}
        </tbody>
    </table>

</div>

<div class="fixed-table-pagination">
    <input type="hidden" id="currentPageNo" value="{{ pageModel.pageNo }}">
    <input type="hidden" id="currentPageSize" value="{{ pageModel.pageSize }}">
    <input type="hidden" id="totalPage" value="{{ pageModel.totalPages }}">
    <div class="pull-right pagination">
        <ul class="pagination">
            {{if pageModel.totalPages === 1}}
                <li class="page-pre"><a href="javascript:void(0)" class="page-pre"></a></li>
                <li class="page-next"><a href="javascript:void(0)" class="page-next"></a></li>
                {{else}}
                {{if pageModel.pageNo === 1}}
                <li class="page-pre"><a href="javascript:void(0)" class="page-pre"></a></li>
                <li class="page-next"><a href="javascript:void(0)"
                                         onclick="conferenceplan.searchConferenceByPage({{pageModel.pageNo + 1}},{{pageModel.pageSize}},'{{redirect}}','{{temp}}')"
                                         class="page-next"></a></li>
                {{else if pageModel.pageNo === pageModel.totalPages}}
                <li class="page-pre"><a href="javascript:void(0)"
                                        onclick="conferenceplan.searchConferenceByPage({{pageModel.pageNo - 1}},{{pageModel.pageSize}},'{{redirect}}','{{temp}}')"
                                        class="page-pre"></a></li>
                <li class="page-next"><a href="javascript:void(0)"
                                         class="page-next"></a></li>
                {{else}}
                <li class="page-pre"><a href="javascript:void(0)"
                                        onclick="conferenceplan.searchConferenceByPage({{pageModel.pageNo - 1}},{{pageModel.pageSize}},'{{redirect}}','{{temp}}')"
                                        class="page-pre"></a></li>
                <li class="page-next"><a href="javascript:void(0)"
                                         onclick="conferenceplan.searchConferenceByPage({{pageModel.pageNo + 1}},{{pageModel.pageSize}},'{{redirect}}','{{temp}}')"
                                         class="page-next"></a></li>
                {{/if}}
            {{/if}}
        </ul>
    </div>
    <div class="pull-right pagination-detail">
        <span class="pagination-info"><spring:message code="conferenceplan.jsp.tol"/> {{pageModel.total}} <spring:message code="conferenceplan.jsp.list"/>,</span>
            <span class="page-list"><spring:message code="conferenceplan.jsp.eachpage.1"/>
                <span class="btn-group dropdown">
                    <button style="padding: 0px 12px;position:relative;top: -2px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <span class="page-size">{{pageModel.pageSize}}</span> <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li class="active">
                            <a href="javascript:void(0)"
                               onclick="conferenceplan.searchConferenceByPage(1,10,'{{redirect}}','{{temp}}')"
                                    >10</a>
                        </li>
                        <li>
                            <a href="javascript:void(0)"
                               onclick="conferenceplan.searchConferenceByPage(1,20,'{{redirect}}','{{temp}}')"
                                    >20</a>
                        </li>
                        <li>
                            <a href="javascript:void(0)"
                               onclick="conferenceplan.searchConferenceByPage(1,50,'{{redirect}}','{{temp}}')"
                                    >50</a>
                        </li>
                        <li><a href="javascript:void(0)"
                               onclick="conferenceplan.searchConferenceByPage(1,100,'{{redirect}}','{{temp}}')"
                                >100</a>
                        </li>
                    </ul>
                </span><spring:message code="conferenceplan.jsp.eachpage.2"/>
            </span>
            <span class="page-select" style="margin-left: 15px;">
                    <spring:message code="conferenceplan.jsp.the"/> <span class="btn-group dropdown">
                    <button style="padding: 0px 12px;position:relative;top: -2px;" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <span class="page-size">{{pageModel.pageNo}}</span> <span class="caret"></span></button>
                    <ul class="dropdown-menu" role="menu" style="max-height: 200px;overflow-y: auto">
                        {{each pageArray as page index}}
                        <li {{if pageModel.pageNo ===page}}class="active" {{/if}}>
                            <a href="javascript:void(0)"
                               onclick="conferenceplan.searchConferenceByPage({{page}},{{pageModel.pageSize}},'{{redirect}}','{{temp}}')">{{page}}
                            </a>
                        </li>
                        {{/each}}
                    </ul>
            </span><spring:message code="conferenceplan.jsp.page"/>
        </span>
    </div>
</div>
{{else}}
    {{if state == 0}}
        <spring:message code="conferenceplan.jsp.list.incoming.data.empty"/>
    {{else if state == 1}}
        <spring:message code="conferenceplan.jsp.list.going.data.empty"/>
    {{else if state == 2}}
        <spring:message code="conferenceplan.jsp.list.completed.data.empty"/>
    {{/if}}
{{/if}}
{{ "" | createJob}}
