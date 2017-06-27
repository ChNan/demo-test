// 数据提交不一定是在表单，所以，form-group 的样式不一定要使用
var validateutil = $.extend(true, {
    defaultOpt: {
        result: false,
        errormsg: []
    },//默认参数对象
    currentOpt: {},//一个空对象，用来存放临时参数
    valid: function (opt) {
        if (opt && opt.contextId) {
            var _this = this;
            var ckf = true;
            var nodes = opt.nodes;
            if (nodes) {
                for (var i in nodes) {
                    var nodeObj = $('#' + opt.contextId).find('[name="' + nodes[i].name + '"]');
                    var methods = nodes[i].method;
                    if (methods) {
                        var tt = methods.split(',');
                        $.each(tt, function (i, val) {
                            var tmp = validateutil.method.check(val, nodeObj);
                            //一个验证器没过，就可以进入下一个节点了
                            if (!tmp) {
                                ckf = false;
                                return false;
                            }
                        })
                    }
                }
            }
            return ckf;
        } else {
            return false;
        }
    },
    //公共的验证错误方法
    defaultFormErrorFmter: function (node, msg) {
        var parnode = node.parent();
        parnode.find('.m-error-message').text(validateutil.message.getMsg(msg));
        parnode.addClass('has-error');
    },
    defaultErrorFmter: function (node, msg) {
        var parnode = node.parents('.validate').eq(0);
        parnode.addClass('has-error');
        parnode.find('.m-error-message').text(validateutil.message.getMsg(msg));
    },
    showErrorFmter: function (node, msg) {
        var parnode = node.parent();
        var msgLab = parnode.parent(".form-group").prev(".m-error-message");
        parnode.addClass('has-error');
        msgLab.text(validateutil.message.getMsg(msg)).show();
    },
    //清除错误提示信息的方法
    clearFormNodeErrorMsg: function (node) {
        var parnode = node.parent();
        parnode.removeClass('has-error');
        parnode.find('.m-error-message').text('');
    },
    clearFormAllErrorMsg: function (form) {
        $(form).find('.has-error').removeClass('has-error')
        $(form).find('.m-error-message').text('');
    },
    hideFormAllErrorMsg: function (form) {
        $(form).find('.has-error').removeClass('has-error')
        $(form).find('.m-error-message').text('').hide();
    },
    clearCurrentNodeErrorMsg: function (contextId) {
        var cur = $('#' + contextId);
        $(cur).removeClass('has-error');
        $(cur).find('.m-error-message').text('');
    },
    clearErrorMsg: function (contextId) {
        var formObj = $('#' + contextId);
        formObj.find('.validate').each(function () {
            $(this).removeClass('has-error');
            $(this).find('.m-error-message').text('');
        })
    },
    //清除错误提示信息的方法
    clearText: function (formId) {
        validateutil.clearErrorMsg(formId);
        $('#' + formId).find('input[type="text"],textarea').val('');
    },

    //方法，与方法对应的提示信息，可以单独获取。
    method: {
        check: function (methodName, node) {

            if (methodName in validateutil.method) {
                var res = validateutil.method[methodName](node);
                if (!res) {
                    validateutil.defaultErrorFmter(node, methodName)
                }
                return res;
            } else {
                console.log('验证方法[' + methodName + ']不存在!');
                return false;
            }
        },
        checkForm: function (methodName, node) {

            if (methodName in validateutil.method) {
                var res = validateutil.method[methodName](node);
                if (!res) {
                    validateutil.defaultFormErrorFmter(node, methodName)
                }
                return res;
            } else {
                console.log('验证方法[' + methodName + ']不存在!');
                return false;
            }
        }
    },
    //提示信息
    message: {
        getMsg: function (msg) {
            if (msg in validateutil.message) {
                return validateutil.message[msg];
            } else {
                return msg;
            }
        }
    }
}, validate);