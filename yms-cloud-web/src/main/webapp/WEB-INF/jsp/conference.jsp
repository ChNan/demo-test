<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 不缓存 -->
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
    <META HTTP-EQUIV="Expires" CONTENT="0">

    <title><spring:message code="system.html.title" text="YMS"/></title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/bootstrap-table.css" rel="stylesheet">
    <link href="css/daterangepicker.css" rel="stylesheet">
    <!-- Custom styles for this template -->
    <link href="css/dashboard.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/common.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/global.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/font-awesome.css" rel="stylesheet"> <!-- 旧版本 ! -->
    <link href="css/font-awesome.min.css" rel="stylesheet"> <!--  新版本，实现富文本编辑框! -->
    <link href="css/zTreeStyle/zTreeStyle.css" rel="stylesheet">
    <link href="css/staff.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/conference.css?${sessionScope.cacheTime}" rel="stylesheet">
    <link href="css/chosen.min.css" rel="stylesheet">
    <%--<link href="3rdLibrary/selectBoxIt/jquery.selectBoxIt.css" rel="stylesheet">--%>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<%@include file="common/conference_common_nav.jsp" %>

<div id="con-content">
    <div id="account_manage_content" style="display:none;position: absolute;background: #ffffff;width: 100%;height:100%; z-index: 100;margin-top: 30px">
    </div>
    <div class="col-xs-12 m-cp-main" id="c_plan_index"
         style="margin-top: 25px;height: 200px;background-image: url('${pageContext.request.contextPath}/img/conference/background.jpg');background-repeat: no-repeat;background-position: top center;">
        <div class="tab-content">
            <div class="row" style="height: 200px;">
                <div class="col-xs-offset-2 col-xs-4">
                    <div class="book_n_c m-conf-icon1 center-block" onclick="conferenceplan.switchAddPage('m-cp-main','nc_plan_add')"></div>
                    <span class="m-conf-title">
                        <spring:message code="conferenceplan.jsp.main.title.book.nc"/>
                    </span>
                </div>
                <div class="col-xs-4">
                    <div class="book_v_c m-conf-icon2 center-block" onclick="conferenceplan.switchAddPage('m-cp-main','vc_plan_add')"></div>
                    <span class="m-conf-title">
                        <spring:message code="conferenceplan.jsp.main.title.book.vc"/>
                    </span>
                </div>
            </div>
            <div class="panel panel-body" style="margin-top: 10px;border-radius: 0px;border-color: #ddd;padding-bottom: 0;padding-right: 0;">
                <div class="col-xs-12">
                    <div class="row">
                        <button type="button" class="btn  btn-lg conf-btn <c:if test="${searchType eq -1}">conf-selected</c:if>" redirect="conf_all" searchType="-1"
                                template="conference_plan_list_temp">
                            <spring:message code="conferenceplan.jsp.main.title.my.conference"/>
                        </button>
                        <button type="button" class="btn  btn-lg conf-btn <c:if test="${searchType eq 1}">conf-selected</c:if>" redirect="conf_living" searchType="1"
                                content="<spring:message code="conferenceplan.jsp.main.title.ongoing.conference"/>"
                                template="conference_plan_list_temp"><spring:message code="conferenceplan.jsp.main.title.ongoing.conference"/>(${confLivingCount}<spring:message code="conferenceplan.jsp.main.title.unit"/>)
                        </button>
                        <button type="button" class="btn  btn-lg conf-btn <c:if test="${searchType eq 0}">conf-selected</c:if>" redirect="conf_future" searchType="0"
                                content="<spring:message code="conferenceplan.jsp.main.title.upcoming.conference"/>"
                                template="conference_plan_list_temp"><spring:message code="conferenceplan.jsp.main.title.upcoming.conference"/>(${confFutureCount}<spring:message code="conferenceplan.jsp.main.title.unit"/>)
                        </button>
                        <button type="button" class="btn  btn-lg conf-btn <c:if test="${searchType eq 2}">conf-selected</c:if>" redirect="conf_ending" searchType="2"
                                content="<spring:message code="conferenceplan.jsp.main.title.completed.conference"/>"
                                template="conference_plan_list_temp"><spring:message code="conferenceplan.jsp.main.title.completed.conference"/>
                        </button>
                    </div>
                    <div class="row" style="height: 45px;padding-top: 10px;;">
                        <input class="m-c-checkbox" id="check_role" name="role" value="presenter" type="checkbox"> <spring:message code="conferenceplan.jsp.main.checkbox.moderator.only"/>
                        <input class="m-c-checkbox" id="check_conf_type" name="confType" value="1" type="checkbox" style="margin-left: 10px"> <spring:message code="conferenceplan.jsp.main.checkbox.video.only"/>
                    </div>
                    <div class="row m-cp-main-sub"  id="conf_all">
                        <div class="pull-left">
                            <input class="form-control" name="queryDate" readonly/>
                        </div>
                        <div class="calendar pull-right" ></div>
                    </div>
                    <div class="row m-cp-main-sub"  id="conf_living"></div>
                    <div class="row m-cp-main-sub"  id="conf_future"></div>
                    <div class="row m-cp-main-sub"  id="conf_ending"></div>
                    <div class="row m-cp-main-sub"  id="conf_search"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xs-12 m-cp-main"  id="nc_plan_add" hidden="true">

    </div>

    <div class="col-xs-12 m-cp-main" id="nc_plan_edit" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="nc_record_edit" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="vc_record_edit" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="vc_plan_add" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="vc_plan_edit" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="vc_detail_end" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="nc_detail_end" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="vc_detail_ready" hidden="true">

    </div>
    <div class="col-xs-12 m-cp-main" id="nc_detail_ready" hidden="true">

    </div>
    <input type="hidden" id="selectExternalParticipantIds"/>
    <input type="hidden" id="selectExternalParticipantMails"/>
    <input type="hidden" id="selectParticipantIds"/>
    <input type="hidden" id="selectParticipantMails"/>
    <input type="hidden" id="selectPresenterIds"/>
    <input type="hidden" id="selectPresenterMails"/>
    <input type="hidden" id="selectRoomIds"/>
    <input type="hidden" id="selectRoomNames"/>
    <%@include file="conference/conference_modal.jsp" %>
    <script id="nc_plan_add_temp" type="text/html">
        <%@include file="conference/add/conference_ncp_add.jsp" %>
    </script>
    <script id="nc_plan_edit_temp" type="text/html">
        <%@include file="conference/edit/conference_ncp_edit.jsp" %>
    </script>
    <script id="nc_record_edit_temp" type="text/html">
        <%@include file="conference/edit/conference_ncr_edit.jsp" %>
    </script>

    <script id="vc_plan_add_temp" type="text/html">
        <%@include file="conference/add/conference_vcp_add.jsp" %>
    </script>

    <script id="vc_plan_edit_temp" type="text/html">
        <%@include file="conference/edit/conference_vcp_edit.jsp" %>
    </script>
    <script id="vc_record_edit_temp" type="text/html">
        <%@include file="conference/edit/conference_vcr_edit.jsp" %>
    </script>
    <script id="nc_detail_end_living_temp" type="text/html">
        <%@include file="conference/detail/conference_nc_end_living_detail.jsp" %>
    </script>
    <script id="vc_detail_end_living_temp" type="text/html">
        <%@include file="conference/detail/conference_vc_end_living_detail.jsp" %>
    </script>
    <script id="nc_detail_ready_temp" type="text/html">
        <%@include file="conference/detail/conference_nc_ready_detail.jsp" %>
    </script>
    <script id="vc_detail_ready_temp" type="text/html">
        <%@include file="conference/detail/conference_vc_ready_detail.jsp" %>
    </script>
    <script id="add_recurrence_pattern_temp" type="text/html">
        <%@include file="conference/add/conference_add_recurrence.jsp" %>
    </script>
    <script id="edit_recurrence_pattern_temp" type="text/html">
        <%@include file="conference/edit/conference_edit_recurrence.jsp" %>
    </script>

    <script id="conference_plan_list_temp" type="text/html">
        <%@include file="conference/search/conference_plan_list.jsp" %>
    </script>
    <script id="selected_staff_li" type="text/html">
        <%@include file="conference/conference_staff.jsp" %>
    </script>
    <script id="popUpContentSummary" type="text/html">
        <%@include file="conference/conference_popup_summary.jsp" %>
    </script>
    <script id="popUpContentOperate" type="text/html">
        <%@include file="conference/conference_popup_operate.jsp" %>
    </script>

    <script id="attendee_temp" type="text/html">
        <div class="content-block-removeable" >
            {{if type=='internal'}}
                <img src="img/conference/internal_staff.png">
            {{else if type=='external'}}
                <img src="img/conference/external_staff.png">
            {{/if}}
            {{if creatorId!=id }}
            <button class="close btn-phone-close" btnid="attendee_{{id}}"
                    onclick="conplan_participantselect.removeItem(this,'{{id}}','{{selectInput}}','{{otherContent}}','{{otherSelectInput}}')">×</button>
            {{/if}}
            {{if type==='external'}}
                <span title="{{name}}">{{ name }}</span>
            {{else}}
                <span title="{{ name | showStaffName:email}}">{{ name | showStaffName:email}}</span>
            {{/if}}

        </div>
    </script>
    <script id="rooms_temp" type="text/html">
        <div class="content-block-removeable">
            {{if type=='normal_room'}}
            <img src="img/conference/green_nr.png">
            {{else if type=='vc_room'}}
            <img src="img/conference/green_vr.png">
            {{/if}}
            <button class="close btn-phone-close" onclick="conplan_participantselect.removeRoom(this,'{{id}}','{{selectInput}}')">×</button>
            <span>{{name}}</span>
        </div>
    </script>

    <script id="check_room_temp" type="text/html">
        <div class="fc-widget-content" style="display: inline-block;padding-left: 15px;">
            <input class="regular-checkbox" type="checkbox" id="checkRoom_{{id}}" resource_id="{{id}}"
                   resource_title="{{title}}"
                   room_type="{{type}}" name="checkRoom" {{if checked===true}}checked{{/if}}>
            <label for="checkRoom_{{id}}"></label>
            {{if type=='normal_room'}}
            <img src="img/conference/green_nr.png">
            {{else if type=='vc_room'}}
            <img src="img/conference/green_vr.png">
            {{/if}}
        </div>
    </script>
    <script id="show_room_temp" type="text/html">
        <div class="fc-widget-content" style="display: inline-block;margin-left: 8px;">
            {{if type=='normal_room'}}
            <img src="img/conference/green_nr.png">
            {{else if type=='vc_room'}}
            <img src="img/conference/green_vr.png">
            {{/if}}
        </div>
    </script>

    <script id="show_event_temp" type="text/html">
        <div>
            {{elementHtml}}
        </div>
    </script>
</div>
<%@include file="common/conference_footer.jsp" %>

<script type="text/javascript">
    conferenceplan.init();
</script>
</body>
</html>
