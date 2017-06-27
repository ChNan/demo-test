$(function() {
    $.i18n.properties({
        name: ['message'],
        path: '/i18n/',
        mode: 'map',
        language: window['getLan'] ? getLan() : 'en-US'
    });

    var language = window['getLan'] ? getLan() : 'en-US';
    $.post('/system/locale/change',{language:language},function(result){
        if(result.success){
            setLan(language);
            var imgurl = $('#projectContext').val()+'/img/main/menu/logo_ch.png';
            if (language == 'en-US') {
                imgurl = $('#projectContext').val()+'/img/main/menu/logo_en.png';
            }
            $('.m-logo img').attr('src',imgurl);
        }
    });

    $('.c-lan li').on('click',function(){
        if($(this).hasClass('active')){
            return;
        }
        var val = $(this).data('val');
        var text = $(this).text();

        $.post('/system/locale/change',{language:val},function(result){
            if(result.success){
                setLan(val)
                window.location.reload();
            }
        });
    });

    netsettingwizard.init();
});

// 下一步骤 样式 页面修改
function wizardConfirmNextStep(curid, nextid, arrowIndex) {

    var curSpanID = curid + 'SpanID';
    var nextSpanId = nextid + 'SpanID';

    //修改向导样式
    $('#'+curSpanID).removeClass('y-current');
    $('#'+curSpanID+' div').removeClass('i1-a').addClass('i1');
    $('#'+curSpanID+' span').removeClass('wi-wizard-tab-font-a').addClass('wi-wizard-tab-font');
    $('#arrowSpanId'+arrowIndex).removeClass('y-current-unit').addClass('y-complete-current-mcu');

    $('#'+nextSpanId).addClass('y-current');
    $('#'+nextSpanId+' div').removeClass('i1').addClass('i1-a');
    $('#'+nextSpanId+' span').removeClass('wi-wizard-tab-font').addClass('wi-wizard-tab-font-a');
    $('#arrowSpanId' + (arrowIndex+1)).addClass('y-current-unit');

    if (arrowIndex > 1) {
        $('#arrowSpanId'+(arrowIndex-1)).removeClass('y-complete-current-mcu');
    }

    // 修改主页显示
    $('#'+curid).removeClass('wi-wizard-display').addClass('wi-wizard-display-none');
    $('#'+nextid).removeClass('wi-wizard-display-none').addClass('wi-wizard-display');

}

// 上一步 样式及页面修改
function wizardLastStep(curid, lastId, arrowIndex) {
    var curSpanID = curid + 'SpanID';
    var lastSpanId = lastId + 'SpanID';

    //修改向导样式
    $('#'+curSpanID).removeClass('y-current');
    $('#'+curSpanID+' div').removeClass('i1-a').addClass('i1');
    $('#'+curSpanID+' span').removeClass('wi-wizard-tab-font-a').addClass('wi-wizard-tab-font');
    $('#arrowSpanId'+(arrowIndex+1)).removeClass('y-current-unit');


    $('#'+lastSpanId).addClass('y-current');
    $('#'+lastSpanId+' div').removeClass('i1').addClass('i1-a');
    $('#'+lastSpanId+' span').removeClass('wi-wizard-tab-font').addClass('wi-wizard-tab-font-a');
    $('#arrowSpanId' + arrowIndex).addClass('y-current-unit').removeClass('y-complete-current-mcu');
    if (arrowIndex > 1) {
        $('#arrowSpanId' + (arrowIndex-1)).addClass('y-complete-current-mcu');
    }

    // 修改主页显示
    $('#'+curid).removeClass('wi-wizard-display').addClass('wi-wizard-display-none');
    $('#'+lastId).removeClass('wi-wizard-display-none').addClass('wi-wizard-display');
}

