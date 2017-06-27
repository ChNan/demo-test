var validate = {
    //在这里进行方法及提示的拓展。method存放方法。message存放提示，是按照[name]进行查找的，请确保一致
    //其中node是对象，不是值
    method: {
        require: function (node) {
            if (node.length > 0 && !node.val() || node.val() == '') {
                return false;
            }
            return true;
        },
        number: function (node) {
            if (node.length > 0 && node.val()) {
                var pattern = /^[0-9]*$/;
                return pattern.test(node.val());
            }
            return true;
        },
        gt0: function (node) {
            if (node.length > 0 && node.val()) {
                return node.val() > 0;
            }
            return true;
        },
        email: function (node) {
            if (node.length > 0 && node.val()) {
                return (new RegExp(
                    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(node.val()));
            }
            return true;
        }
    },
    message: {
        require: function(){
            return $.i18n.prop('global.js.tips.notNull');
        },
        number: function(){
            return $.i18n.prop('global.js.tips.mustNumber');
        },
        email: function(){
            return $.i18n.prop('global.js.tips.mail.invalidate');
        },
        "gt0": function(){
            return $.i18n.prop('global.js.tips.gt0');
        }
    }
}
