<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="modal fade add-person-modal" id="add_participant_modal" tabindex="-1" role="dialog" >
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title"><spring:message code="conferenceplan.jsp.book.addstaff.btn.add.staff"/></h4>
            </div>
            <div class="modal-body clearfix">
                <div class="panel panel-body panel-person-list" id="search_staff_div">
                    <div style="width:100%" class="search-box">
                        <input class="form-control" maxlength="256" id="search_staff" title="<spring:message code="conferenceplan.jsp.book.common.search"/>" placeholder="<spring:message code="conferenceplan.jsp.book.common.search"/>" type="text">
                        <span class="searchbox-icon"><i class="glyphicon glyphicon-search"></i></span>
                    </div>
                    <div class="select_content" id="result_div" style="width:95%;overflow: auto;">
                        <ul id="result_ul"></ul>
                    </div>
                    <div class="tree-container" id="staff_list_container">
                        <ul id="participant_staff_list_ul" class="ztree"></ul>
                    </div>
                    <div class="validate" id="external_email">
                        <div  style="width: 260px;float: left;position: relative">
                            <input class="form-control conf-external-eamil" name="email" autocomplete="off" maxlength="128"
                                   style="padding-right: 22px;"
                                   onkeyup="conplan_participantselect.externalEmailIptChanged(this)" placeholder="<spring:message code="conferenceplan.jsp.book.addstaff.placeholder.external.email"/>">
                            <button class="close btn-phone-close" style="position: absolute;top: 1px;right: 10px;" hidden
                                    onclick="conplan_participantselect.clearExternalEmailIpt(this)">×</button>
                            <label class="control-label m-error-message"></label>
                        </div>
                        <div class="" style="float: right;">
                            <button type="button" id="password_edit_reset" class="btn btn-success dropdown-toggle" onclick="conplan_participantselect.addExternalStaff('add_participant_modal')">
                                <spring:message code="conferenceplan.jsp.common.btn.add"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="panel-center"><img src="img/conference/right.png" ></div>
                <div class="panel panel-body panel-person-added">
                    <div id="select_count" content="<spring:message code="conferenceplan.jsp.book.addstaff.selected.participants.arg"/>"><spring:message code="conferenceplan.jsp.book.addstaff.selected.participants"/></div>
                    <div class="list-container">
                        <ul id="selected_staff" class="ztree">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer  custom-modal-footer">
                <div class="col-xs-8 col-xs-offset-2">
                    <div class="col-xs-5 row pull-left">
                        <button type="button" class="btn btn-block btn-success" id="confirmSelectStaff"
                                data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.confirm"/>
                        </button>
                    </div>
                    <div class="col-xs-5 row pull-right">
                        <button type="button" class="btn btn-default btn-block"
                                data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade add-presenter-modal" id="add_presenter_modal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title"><spring:message code="conferenceplan.jsp.book.addstaff.btn.choose.moderators"/></h4>
            </div>
            <div class="modal-body clearfix">
                <div class="panel panel-body panel-person-list"  id="search_staff_div">
                    <div style="width:100%" class="search-box">
                        <input class="form-control" maxlength="256" id="search_staff" title="<spring:message code="conferenceplan.jsp.book.common.search"/>" placeholder="<spring:message code="conferenceplan.jsp.book.common.search"/>" type="text">
                        <span class="searchbox-icon"><i class="glyphicon glyphicon-search"></i></span>
                    </div>
                    <div class="select_content" id="result_div" style="width:95%;overflow: auto;">
                        <ul id="result_ul">

                        </ul>
                    </div>
                    <div class="tree-container" id="staff_list_container">
                        <ul id="presenter_staff_list_ul" class="ztree"></ul>
                    </div>
                </div>
                <div class="panel-center"><img src="img/conference/right.png" ></div>
                <div class="panel panel-body panel-person-added">
                    <div id="select_count" content="<spring:message code="conferenceplan.jsp.book.addstaff.label.selected.moderators.args"/>"><spring:message code="conferenceplan.jsp.book.addstaff.label.selected.moderators"/></div>
                    <div class="list-container" >
                        <ul id="selected_staff" class="ztree">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="modal-footer  custom-modal-footer">
                <div class="col-xs-8 col-xs-offset-2">
                    <div class="col-xs-5 row pull-left">
                        <button type="button" class="btn  btn-block btn-success" id="confirmSelectStaff"
                                data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.confirm"/>
                        </button>
                    </div>
                    <div class="col-xs-5 row pull-right">
                        <button type="button" class="btn btn-default btn-block"
                                data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade recurrence-modal" id="add_recurrence_pattern" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true">
</div>

<div class="modal fade recurrence-modal" id="edit_recurrence_pattern" tabindex="-1" role="dialog"
     aria-labelledby="myModalLabel" aria-hidden="true">
</div>

<div class="modal fade add-room-modal" id="add_conference_rooms" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" style="width: 80%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title"><spring:message code="conferenceplan.jsp.common.title.add.room"/></h4>
            </div>
            <div class="modal-body">
                <div class="tab-content head-margin">
                    <div class="tab-pane fade in active">
                        <form class="form-horizontal" id="add_conference_rooms_form">
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <div class="clearfix">
                                        <span class="pull-left"><spring:message code="conferenceplan.jsp.common.label.room.resource"/></span>
                                        <div class="pull-right c-resource-datetimepicker">
                                            <span class="control-label"><spring:message code="conferenceplan.jsp.common.label.date"/>:</span>
                                            <input class="form-control ical-icon" name="queryDate" readonly/>
                                        </div>
                                    </div>
                                    <div class="calendar"></div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer  custom-modal-footer">
                <div class="col-xs-7 col-xs-offset-3">
                    <div class="col-xs-5 row pull-left">
                        <button type="button" class="btn  btn-success" id="confirmSaveRooms"
                                ><spring:message code="conferenceplan.jsp.common.btn.confirm"/>
                        </button>
                    </div>
                    <div class="col-xs-5 row pull-right">
                        <button type="button" class="btn btn-default btn-block"
                                data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- <spring:message code="conferenceplan.jsp.common.title.notice"/>框 -->

<div class="modal fade" id="promptModal" tabindex="-1" role="dialog" data-backdrop="static" style="top:20% !important;"
     hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-body  custom-confirm-modal-body" id="promptModalBody">

            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" data-backdrop="static" style="top:20% !important;"
     aria-hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-header custom-modal-header">
                <button type="button" style="margin-top: -6px;" class="close custom-close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title custom-modal-title " style="margin-top: -4px;" id="confirmModalTitle"></h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body" id="confirmModalBody">

            </div>
            <div class="modal-footer custom-modal-footer">
                <button type="button" class="btn   btn-success btn-lg" id="confirmModalOkBtn"
                        data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.confirm"/>
                </button>
                <button type="button" style="margin-left: 15px;" class="btn btn-block btn-lg"
                        data-dismiss="modal"><spring:message code="conferenceplan.jsp.common.btn.cancel"/>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" data-backdrop="static" data-keyboard="false"
     aria-hidden="true" id="modalProgressBar">
    <div class="modal-dialog div-progress-bar-dialog-location custom-modal-size">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title custom-modal-title custom-no-padding-left" id="progressBarTitle">
                    <%-- 此处的<spring:message code="conferenceplan.jsp.common.title.notice"/>语在common.js showProgress中填充 --%>
                </h4>
            </div>
            <div class="modal-body">
                <div class="progress progress-striped active">
                    <div class="progress-bar progress-bar-success div-progress-bar-dialog-body" role="progressbar">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="promptModalWithbtn" tabindex="-1" role="dialog" data-backdrop="static" style="top:20% !important;"
     hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-header custom-modal-header">
                <button type="button" class="close custom-close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title custom-modal-title">
                    <spring:message code="conferenceplan.jsp.common.title.notice"/>
                </h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body">

            </div>
            <div class="modal-footer  custom-modal-footer">
                <div class="col-sm-offset-4  col-sm-4 custom-button-col-no-padding">
                    <button type="button" class="btn btn-success btn-lg btn-block m-close" id="promptModalOkBtn"
                            data-dismiss="modal">
                        <spring:message code="conferenceplan.jsp.common.btn.confirm"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="editChooseModal" tabindex="-1" role="dialog" data-backdrop="static" style="top:20% !important;"
     aria-hidden="true">
    <div class="modal-dialog custom-modal-size">
        <div class="modal-content">
            <div class="modal-header custom-modal-header">
                <button type="button" style="margin-top: -6px;" class="close custom-close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title custom-modal-title " style="margin-top: -4px;" ><spring:message code="conferenceplan.jsp.edit.recordorplan"/></h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body">
                <spring:message code="conferenceplan.jsp.edit.info" text="Which type do you want to edit,occurence or series?"/>
            </div>
            <div class="modal-footer custom-modal-footer">
                <button type="button" class="btn   btn-success btn-lg" id="editConferenceRecord"
                        data-dismiss="modal"><spring:message code="conferenceplan.jsp.edit.record"/>
                </button>
                <button type="button" class="btn   btn-success btn-lg" id="editConferencePlan"
                        data-dismiss="modal"><spring:message code="conferenceplan.jsp.edit.plan"/>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="deleteChooseModal" tabindex="-1" role="dialog" data-backdrop="static" style="top:20% !important;"
     aria-hidden="true">
    <div class="modal-dialog custom-modal-size" >
        <div class="modal-content">
            <div class="modal-header custom-modal-header">
                <button type="button" style="margin-top: -6px;" class="close custom-close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title custom-modal-title " style="margin-top: -4px;" ><spring:message code="conferenceplan.jsp.delete.recordorplan"/></h4>
            </div>
            <div class="modal-body  custom-confirm-modal-body">
                <spring:message code="conferenceplan.jsp.delete.info" text="Which type do you want to delete,occurence or series?"/>
            </div>
            <div class="modal-footer custom-modal-footer">
                <button type="button" class="btn   btn-success btn-lg" id="deleteConferenceRecord"
                        data-dismiss="modal"><spring:message code="conferenceplan.jsp.delete.record"/>
                </button>
                <button type="button" class="btn   btn-success btn-lg" id="deleteConferencePlan"
                        data-dismiss="modal"><spring:message code="conferenceplan.jsp.delete.plan"/>
                </button>
            </div>
        </div>
    </div>
</div>