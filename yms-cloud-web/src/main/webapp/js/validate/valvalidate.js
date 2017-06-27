var valvalidate = {
    //其中val是值
    method: {
        require: function (val) {
            if (!val) {
                return false;
            }
            return true;
        },
        number: function (val) {
            if (val) {
                var pattern = /^[0-9]*$/;
                return pattern.test(val);
            }
            return true;
        },
        gt: function (val,threshold) {
            if (val) {
                return val > threshold;
            }
            return true;
        },
        lt: function (val,threshold) {
            if (val) {
                return val < threshold;
            }
            return true;
        }
    }
}
