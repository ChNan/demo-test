var talksetting = {
    init: function () {
        var language = window['getLan'] ? getLan() : 'en-US';
        if (language == 'en-US' || language == 'en') {
            $('#numberofPicForOneplusNModeSpan').hide();
            $('.m-tc [name="forwardMeetingTime"] option').each(function() {
                var op = $(this).text();
                $(this).text(op.replace('minutes',' minutes'));
            });
        } else {
            $('#numberofPicForOneplusNModeSpan').show();
        }
        $.post('netsetting/query', {type: 'talkConfig'}, function (result) {
            if (result && result.ret >= 0) {
                $('.m-tc [name="maxDownstreamBandwidth"]').val(result.rows.data.maxDownstreamBandwidth);
                $('.m-tc [name="maxSecondaryFlowResolution"]').val(result.rows.data.maxSecondaryFlowResolution);
                $('.m-tc [name="maxUpstreamBandwidth"]').val(result.rows.data.maxUpstreamBandwidth);
                $('.m-tc [name="maxVideoResolution"]').val(result.rows.data.maxVideoResolution);

                $('.m-tc [name="brandWidthStrategy"][value="'+result.rows.data.brandWidthStrategy+'"]').attr('checked',true);

                $('.m-tc [name="videoDividedMode"]').val(result.rows.data.dividedMode.videoDividedMode);
                $('.m-tc [name="intervalForDividedMode"]').val(result.rows.data.dividedMode.intervalForDividedMode);
                $('.m-tc [name="tourRoundForDividedMode"][value="'+result.rows.data.dividedMode.tourRoundForDividedMode+'"]').attr('checked',true);

                var numOfOneplusN = result.rows.data.oneplusNMode.videoOneplusNMode;
                $('.m-tc [name="videoOneplusNMode"]').val(numOfOneplusN);
                // 通过模式值更新视图轮巡下拉框
                talksetting.generateOneplusNModeNumSelOption(numOfOneplusN);
                $('.m-tc [name="intervalForOneplusNMode"]').val(result.rows.data.oneplusNMode.intervalForOneplusNMode);
                $('.m-tc [name="tourRoundForOneplusNMode"][value="'+result.rows.data.oneplusNMode.tourRoundForOneplusNMode+'"]').attr('checked',true);

                if (result.rows.data.oneplusNMode.tourRoundForOneplusNMode == '1') {
                    $('.m-tc [name="numberofPicForOneplusNMode"]').val(result.rows.data.oneplusNMode.numberofPicForOneplusNMode);
                }
                $('.m-tc [name="numberofPicForOneplusNMode"]').trigger('change');

                $('.m-tc [name="forwardMeetingTime"]').val(result.rows.data.forwardMeetingTime);
                $('.m-tc [name="ivrLanguage"]').val(result.rows.data.ivrLanguage);

            } else {
                alertPromptMsgDlg($.i18n.prop('termautoupdate.js.loadfailto'),3);

            }
        });

        $('.m-tc [name="videoOneplusNMode"]').off('change').on('change',function(){
            var n = $(this).val();
            var number = parseInt(n);
            talksetting.generateOneplusNModeNumSelOption(number);
            $('#numberofPicForOneplusNModeSpan').text('');
        });
        $('.m-tc [name="numberofPicForOneplusNMode"]').off('change').on('change',function(){
            var n = $(this).val();
            $('#numberofPicForOneplusNModeSpan').text(n);
        });

    },
    generateOneplusNModeNumSelOption:function(n){
        $('.m-tc [name="numberofPicForOneplusNMode"]').empty();
        for (var i=1; i<=n; i++) {
            $('.m-tc [name="numberofPicForOneplusNMode"]').append('<option value="'+i+'">'+i+'</option>');
        }
    },
    save: function () {
        var dataObj = {};

        dataObj.maxVideoResolution = $('.m-tc [name="maxVideoResolution"]').val();
        dataObj.maxUpstreamBandwidth = $('.m-tc [name="maxUpstreamBandwidth"]').val();
        dataObj.maxSecondaryFlowResolution = $('.m-tc [name="maxSecondaryFlowResolution"]').val();
        dataObj.maxDownstreamBandwidth = $('.m-tc [name="maxDownstreamBandwidth"]').val();

        dataObj.brandWidthStrategy = $('.m-tc [name="brandWidthStrategy"]:checked').val();
        dataObj.forwardMeetingTime = $('.m-tc [name="forwardMeetingTime"]').val();
        dataObj.videoDividedMode = $('.m-tc [name="videoDividedMode"]').val();
        dataObj.intervalForDividedMode = $('.m-tc [name="intervalForDividedMode"]').val();
        dataObj.tourRoundForDividedMode = $('.m-tc [name="tourRoundForDividedMode"]:checked').val();
        dataObj.videoOneplusNMode = $('.m-tc [name="videoOneplusNMode"]').val();
        dataObj.intervalForOneplusNMode = $('.m-tc [name="intervalForOneplusNMode"]').val();
        dataObj.numberofPicForOneplusNMode = $('.m-tc [name="numberofPicForOneplusNMode"]').val();
        dataObj.tourRoundForOneplusNMode = $('.m-tc [name="tourRoundForOneplusNMode"]:checked').val();
        dataObj.ivrLanguage = $('.m-tc [name="ivrLanguage"]').val();

        $.ajax({
            type: 'POST',
            url: 'talksetting/talkconfig',
            data: JSON.stringify(dataObj),
            dataType: "json",
            contentType: 'application/json',
            success: function () {
                alertPromptMsgDlg($.i18n.prop('talksetting.js.changesucess'),1);
            },
            error: function () {
                alertPromptMsgDlg('error',1);
            }

        });
    }
}