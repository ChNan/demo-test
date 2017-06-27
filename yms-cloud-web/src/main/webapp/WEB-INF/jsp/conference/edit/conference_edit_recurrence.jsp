<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="modal-dialog">
    <div class="modal-content conf-recur-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title"><spring:message code="conferenceplan.jsp.book.recur.title.config"/></h4>
        </div>
        <div class="modal-body">
            <div class="tab-content head-margin">
                <div class="tab-pane fade in active">
                    <form class="form-horizontal" id="recurrence_pattern_form">
                        <div class="row" >
                            <span  class="recurrence-block-title"><spring:message code="conferenceplan.jsp.common.label.appointmenttime"/></span>
                        </div>
                        <div class="row recurrence-block-content">
                            <div class="col-xs-12">
                                <div class="row">
                                    <span class="col-xs-3"><spring:message code="conferenceplan.jsp.book.recur.label.start"/></span>
                                    <div class="col-xs-6 row form-group">
                                        <input  name="patternConferenceStartDate" readonly style="width: 240px;max-width: 240px"/>
                                    </div>
                                    <div class="col-xs-2 row form-group">
                                        <input type="text" name="patternStartTime" readonly id="pattern_start_time">
                                    </div>
                                </div>
                                <div class="row">
                                    <span class="col-xs-3"><spring:message code="conferenceplan.jsp.book.recur.label.end"/></span>
                                    <div class="col-xs-6 row form-group">
                                        <input  name="patternConferenceEndDate" readonly style="width: 240px;max-width: 240px"/>
                                    </div>
                                    <div class="col-xs-2 row">
                                        <input type="text" name="patternEndTime" readonly id="pattern_end_time">
                                    </div>
                                </div>
                                <div class="row">
                                    <span class="col-xs-3"><spring:message code="conferenceplan.jsp.book.recur.label.duration" text="YMS"/></span>
                                    <span id="duration"></span>
                                </div>
                            </div>
                        </div>
                        <div class="row validate" >
                            <span id="recurrence_type_choose" class="recurrence-block-title"><spring:message code="conferenceplan.jsp.book.recur.label.config"/></span>
                            <label class="control-label m-error-message"></label>
                        </div>
                        <div class="row recurrence-block-content">
                            <div class="col-xs-2 recurrence-type">
                                <div class="radio">
                                    <label onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_DAILY',this)">
                                        <input type="radio" value="RECURS_DAILY" placeholder="" name="recurrenceType"
                                               onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_DAILY',this)"
                                               {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_DAILY'
                                               || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_ONCE'}}checked{{/if}}
                                                ><spring:message code="conferenceplan.jsp.book.recur.label.daily"/>
                                    </label>
                                </div>
                                <div class="radio">
                                    <label onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_WEEKLY',this)">
                                        <input type="radio" value="RECURS_WEEKLY" placeholder="" name="recurrenceType"
                                               onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_WEEKLY',this)"
                                               {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_WEEKLY'}}checked{{/if}}
                                                ><spring:message code="conferenceplan.jsp.book.recur.label.weekly"/>
                                    </label>
                                </div>
                                <div class="radio">
                                    <label onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_MONTH',this)">
                                        <input type="radio" value="RECURS_MONTH" placeholder="" name="recurrenceType"
                                               onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_MONTH',this)"
                                               {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTH_NTH' || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTHLY'}}checked{{/if}}
                                                > <spring:message code="conferenceplan.jsp.book.recur.label.monthly"/>
                                    </label>
                                </div>
                                <div class="radio">
                                            <label onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_YEAR',this)">
                                                <input type="radio" value="RECURS_YEAR" placeholder="" name="recurrenceType"
                                                       onclick="conplan_recurrencepattern.switchRecurrencePattern('RECURS_YEAR',this)"
                                                       {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_YEARLY' || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_YEAR_NTH'}}checked{{/if}}
                                                        ><spring:message code="conferenceplan.jsp.book.recur.label.yearly"/>
                                            </label>
                                        </div>
                            </div>
                            <div class="col-xs-9 col-xs-offset-1 recurrence-recurs">
                                <div id="RECURS_DAILY" class="recurs"
                                     {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_DAILY' || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_ONCE'}}
                                     style="display:block"
                                     {{else}}
                                     style="display:none"
                                     {{/if}}>
                                    <div class="form-group validate">
                                        <div class="validate form-group" id="RECURS_DAILY_1">
                                            <input type="radio" name="dailyType" checked value="1"
                                                   {{if conferencePlan.recurrencePattern.dailyType ===1}}checked{{/if}}
                                                    >
                                            <spring:message code="conferenceplan.jsp.book.recur.label.each"/>
                                            <input type="text" style="width:40px" maxlength="2" name="interval"
                                                   {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_DAILY'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                            ><spring:message code="conferenceplan.jsp.book.recur.label.days"/>
                                            <label class="control-label m-error-message"></label>
                                        </div>
                                        <div class="row validate" id="RECURS_DAILY_-1">
                                            <input type="radio" name="dailyType" value="-1"
                                                   {{if conferencePlan.recurrencePattern.dailyType ===-1}}checked{{/if}}
                                                    > <spring:message code="conferenceplan.jsp.book.recur.label.everyweekday"/>
                                        </div>
                                    </div>
                                </div>
                                <div id="RECURS_WEEKLY" class="recurs"
                                     {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_WEEKLY'}}
                                     style="display:block"
                                     {{else}}
                                     style="display:none"
                                     {{/if}}>
                                    <div class="form-group validate">
                                        <div class="form-group">
                                            <spring:message code="conferenceplan.jsp.book.recur.label.recur.every"/>
                                            <input type="text" name="interval" style="width: 40px" maxlength="2"
                                                        {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_WEEKLY'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                                > <spring:message code="conferenceplan.jsp.book.recur.label.recur.every.weeks"/>
                                            <label class="control-label m-error-message"></label>
                                        </div>
                                        <div class="form-group">
                                            {{each dayOfWeeksChecked as prop index}}
                                                {{if index < 4}}
                                                    <input type="checkbox" value="{{prop.label}}" name="daysOfWeeks"{{if prop.checked===true}}checked{{/if}}> {{prop.zhLcoalName}}
                                                {{/if}}
                                            {{/each}}
                                        </div>

                                        <div class="form-group" >
                                            {{each dayOfWeeksChecked as prop index}}
                                            {{if index >= 4}}
                                            <input type="checkbox" value="{{prop.label}}" name="daysOfWeeks"{{if prop.checked===true}}checked{{/if}}> {{prop.zhLcoalName}}
                                            {{/if}}
                                            {{/each}}
                                        </div>
                                    </div>
                                </div>
                                <div id="RECURS_MONTH" class="recurs"
                                     {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTHLY' || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTH_NTH'}}
                                     style="display:block"
                                     {{else}}
                                     style="display:none"
                                     {{/if}}>
                                    <c:choose>
                                        <c:when test="${sessionScope.language=='zh_CN'}">
                                            <div id="RECURS_MONTHLY" class="form-group">
                                                <div class="validate row" style="float:left">
                                                    <input type="radio" name="monthRecurrenceType" value="RECURS_MONTHLY" checked>
                                                    每
                                                    <input type="text" name="interval" style="width: 40px" maxlength="2"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTHLY'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                                            >
                                                    <label class="control-label m-error-message"></label>
                                                    个月的第
                                                    <input type="text" name="dayOfMonth" maxlength="2" style="width: 40px"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTHLY'}}value="{{conferencePlan.recurrencePattern.dayOfMonth}}"{{/if}}
                                                            >天
                                                    <label class="control-label m-error-message"></label>
                                                </div>
                                            </div>
                                            <div id="RECURS_MONTH_NTH" class="form-group">
                                                <div class="validate row">
                                                    <input type="radio" name="monthRecurrenceType" value="RECURS_MONTH_NTH"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTH_NTH'}}checked{{/if}}>
                                                    每
                                                    <input type="text" name="interval" style="width: 40px" maxlength="2"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTH_NTH'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                                            >
                                                    <label class="control-label m-error-message"></label>
                                                    个月的
                                                    <select name="dayOfWeekIndex">
                                                        <option value="1" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===1}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.first"/></option>
                                                        <option value="2" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===2}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.second"/></option>
                                                        <option value="3" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===3}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.third"/></option>
                                                        <option value="4" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===4}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.forth"/></option>
                                                        <option value="-1" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===-1}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.last"/></option>
                                                    </select>
                                                    <select name="dayOfWeek">
                                                        {{each dayOfWeeks as prop index}}
                                                        <option value="{{prop.label}}" {{if prop.label===conferencePlan.recurrencePattern.dayOfWeek}}selected{{/if}}>{{prop.zhLcoalName}}</option>
                                                        {{/each}}
                                                    </select>
                                                </div>
                                            </div>
                                        </c:when>
                                        <c:when test="${sessionScope.language=='en'}">
                                            <div id="RECURS_MONTHLY" class="form-group">
                                                <div class="validate row" style="float:left">
                                                    <input type="radio" name="monthRecurrenceType" value="RECURS_MONTHLY" checked>
                                                    Day
                                                    <input type="text" name="dayOfMonth" maxlength="2" style="width: 40px"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTHLY'}}value="{{conferencePlan.recurrencePattern.dayOfMonth}}"{{/if}}
                                                            >
                                                    <label class="control-label m-error-message"></label>
                                                    of every
                                                    <input type="text" name="interval" style="width: 40px" maxlength="2"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTHLY'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                                            >
                                                    <label class="control-label m-error-message"></label>
                                                    month(s)
                                                </div>
                                            </div>
                                            <div id="RECURS_MONTH_NTH" class="form-group">
                                                <div class="validate row">
                                                    <input type="radio" name="monthRecurrenceType" value="RECURS_MONTH_NTH"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTH_NTH'}}checked{{/if}}>
                                                    The
                                                    <select name="dayOfWeekIndex">
                                                        <option value="1" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===1}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.first"/></option>
                                                        <option value="2" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===2}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.second"/></option>
                                                        <option value="3" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===3}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.third"/></option>
                                                        <option value="4" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===4}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.forth"/></option>
                                                        <option value="-1" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===-1}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.last"/></option>
                                                    </select>
                                                    <select name="dayOfWeek">
                                                        {{each dayOfWeeks as prop index}}
                                                        <option value="{{prop.label}}" {{if prop.label===conferencePlan.recurrencePattern.dayOfWeek}}selected{{/if}}>{{prop.zhLcoalName}}</option>
                                                        {{/each}}
                                                    </select>
                                                    of every
                                                    <input type="text" name="interval" style="width: 40px" maxlength="2"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_MONTH_NTH'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                                            >
                                                    <label class="control-label m-error-message"></label>
                                                    month(s)
                                                </div>
                                            </div>
                                        </c:when>
                                        <c:otherwise></c:otherwise>
                                    </c:choose>
                                </div>
                                <div id="RECURS_YEAR" class="row recurs validate"
                                     {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_YEARLY' || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_YEAR_NTH'}}
                                     style="display:block"
                                     {{else}}
                                     style="display:none"
                                     {{/if}}>
                                    <div>
                                        <div class="form-group">
                                            <spring:message code="conferenceplan.jsp.book.recur.label.recur.every"/>
                                            <input type="text" name="interval" style="width: 40px" maxlength="1" value="1" readonly
                                                   {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_YEARLY' || conferencePlan.recurrencePattern.recurrenceType ==='RECURS_YEAR_NTH'}}value="{{conferencePlan.recurrencePattern.interval}}"{{/if}}
                                                    >  <spring:message code="conferenceplan.jsp.book.recur.label.recur.every.year"/>
                                            <label class="control-label m-error-message"></label>
                                        </div>
                                        <div class="row">
                                            <div class="row" style="margin-left: 15px">
                                                <div class="form-group validate" id="RECURS_YEARLY">
                                                    <input type="radio" name="yearRecurrenceType" value="RECURS_YEARLY" checked>
                                                    <spring:message code="conferenceplan.jsp.book.recur.label.recurs.yearly.1"/>
                                                    <select name="monthOfYear">
                                                        {{each monthOfYear as prop index}}
                                                        <option value="{{prop.monthCode}}" {{if prop.monthCode===conferencePlan.recurrencePattern.monthOfYear}}selected{{/if}}>{{prop.name}}</option>
                                                        {{/each}}
                                                    </select><spring:message code="conferenceplan.jsp.book.recur.label.recurs.yearly.2"/>
                                                    <input type="text" name="dayOfMonth" style="width: 40px"
                                                           {{if conferencePlan.recurrencePattern.recurrenceType==='RECURS_YEARLY'}}value="{{conferencePlan.recurrencePattern.dayOfMonth}}"{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.recurs.yearly.3"/>
                                                    <label class="control-label m-error-message"></label>
                                                </div>
                                            </div>
                                            <div class="row" style="margin-left: 15px">
                                                <div class="form-group validate" id="RECURS_YEAR_NTH">
                                                    <input type="radio" name="yearRecurrenceType" value="RECURS_YEAR_NTH"  {{if conferencePlan.recurrencePattern.recurrenceType==='RECURS_YEAR_NTH'}}checked{{/if}}>
                                                    <spring:message code="conferenceplan.jsp.book.recur.label.recurs.year.nth.1"/>
                                                    <select name="monthOfYear">
                                                        {{each monthOfYear as prop index}}
                                                        <option value="{{prop.monthCode}}" {{if prop.monthCode===conferencePlan.recurrencePattern.monthOfYear}}selected{{/if}}>{{prop.name}}</option>
                                                        {{/each}}
                                                    </select><spring:message code="conferenceplan.jsp.book.recur.label.recurs.year.nth.2"/>
                                                    <select name="dayOfWeekIndex">
                                                        <option value="1" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===1}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.first"/></option>
                                                        <option value="2" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===2}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.second"/></option>
                                                        <option value="3" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===3}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.third"/></option>
                                                        <option value="4" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===4}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.forth"/></option>
                                                        <option value="-1" {{if conferencePlan.recurrencePattern.dayOfWeekIndex===-1}}selected{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.last"/></option>
                                                    </select>
                                                    <select name="dayOfWeek">
                                                        {{each dayOfWeeks as prop index}}
                                                        <option value="{{prop.label}}" {{if prop.label===conferencePlan.recurrencePattern.dayOfWeek}}selected{{/if}}>{{prop.zhLcoalName}}</option>
                                                        {{/each}}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="row">
                        <span  class="recurrence-block-title"><spring:message code="conferenceplan.jsp.book.recur.label.range"/></span>
                    </div>
                    <div class="row recurrence-block-content">
                        <div class="col-xs-6">
                            <div class="form-group validate recurrence-content-starttime">
                                <span class="col-xs-3"><spring:message code="conferenceplan.jsp.book.recur.label.start"/></span>
                                <div class="col-xs-9 row">
                                    <input type="text" name="patternStartDate" readonly id="pattern_start_date" value="{{conferencePlan.recurrencePattern.patternStartDate}}">
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="validate form-group" id="recurrence_range_1">
                                <input type="radio" name="recurrenceRange" value="1" {{if conferencePlan.recurrencePattern.recurrenceRange===1}}checked{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.no.end.date"/>
                            </div>
                            <div class="validate form-group" id="recurrence_range_2">
                                <input type="radio" name="recurrenceRange" value="2" {{if conferencePlan.recurrencePattern.recurrenceRange===2}}checked{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.end.after1"/>
                                <input type="text" name="occurrences" style="width: 40px" maxlength="2" value="{{conferencePlan.recurrencePattern.occurrences}}">
                                <spring:message code="conferenceplan.jsp.book.recur.label.end.after2"/>
                                <label class="control-label m-error-message"></label>
                            </div>
                            <div class="validate form-group" id="recurrence_range_3">
                                <input type="radio" name="recurrenceRange" value="3" {{if conferencePlan.recurrencePattern.recurrenceRange===3}}checked{{/if}}><spring:message code="conferenceplan.jsp.book.recur.label.end.by"/>
                                <input type="text" name="patternEndDate" readonly id="pattern_end_date" value="{{conferencePlan.recurrencePattern.patternEndDate}}">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
        <div class="modal-footer custom-modal-footer">
            <div class="conf-recur-btn-block" style="">
                <button type="button" class="btn btn-yealink btn-default-size pull-left" id="recurrence_pattern_btn">
                    <spring:message code="conferenceplan.jsp.common.btn.confirm"/>
                </button>
                <button type="button" class="btn btn-yealink-cancel btn-default-size" data-dismiss="modal">
                    <spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                </button>
                <button type="button" class="btn btn-yealink-danger btn-default-size pull-right" id="clearRecursBtn"
                    {{if conferencePlan.recurrencePattern.recurrenceType ==='RECURS_ONCE'}} disclick {{/if}}><spring:message code="conferenceplan.jsp.book.btn.recur.remove"/>
                </button>
            </div>
        </div>
    </div>
</div>
