//IE 789没有console。这里加进去空方法防止报错
if (!window["console"]){
    window.console = {
        log:function(){

        },
        info:function(){

        },
        debug:function(){

        },
        error: function () {

        }
    };
}
var conferenceplan = {
    addParticipant: function (mainPageId) {
        conplan_participantselect.showStaffListModal('add_participant_modal', conplan_participantselect.participantTreeId, 'selectParticipantIds', 'participant_content', mainPageId);
        var selectExternalParticipantIds = $('#selectExternalParticipantIds').val().split(';');
        for (i in selectExternalParticipantIds) {
            if (selectExternalParticipantIds.hasOwnProperty(i) && selectExternalParticipantIds[i]) {
                var ret = {"id": selectExternalParticipantIds[i], "nameWithEmail": selectExternalParticipantIds[i], "type": "email"};
                $('#add_participant_modal').find('#selected_staff').append(template("selected_staff_li", ret));
            }
        }
    }
}



