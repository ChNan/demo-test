var serverlog = {
	MAIN_TABLE_COLUMNS:[{
				field: 'dataSeq',
				title: '',
				width: '20px'
			},{
		        field: 'userName',
		        title: $.i18n.prop('serverlog.js.username')
		    },{
				field: 'operationIP',
				title: $.i18n.prop('serverlog.js.optIp')
			},{
		        field: 'moduleMenu',
		        title: $.i18n.prop('serverlog.js.oprate.module')
		    }, {
		        field: 'operationTime',
		        title: $.i18n.prop('serverlog.js.oprate.time')
		    }, {
		        field: 'remark',
		        title: $.i18n.prop('serverlog.js.oprate.description')
		    }],
	 locale : {
		"format": 'YYYY-MM-DD',
		"separator": " "+$.i18n.prop('serverlog.js.to')+" ",
		"applyLabel": $.i18n.prop('serverlog.js.ok'),
		"cancelLabel": $.i18n.prop('serverlog.js.cancel'),
		"fromLabel": $.i18n.prop('serverlog.js.startTime'),
		"toLabel": $.i18n.prop('serverlog.js.enfTime'),
		"customRangeLabel": $.i18n.prop('serverlog.js.diy'),
		"weekLabel": "W",
		"daysOfWeek": [$.i18n.prop('serverlog.js.Sunday'), $.i18n.prop('serverlog.js.Monday'),
			$.i18n.prop('serverlog.js.Tuesday'), $.i18n.prop('serverlog.js.Wednesday'), $.i18n.prop('serverlog.js.Thursday'),
			$.i18n.prop('serverlog.js.Friday'), $.i18n.prop('serverlog.js.Saturday')],
		"monthNames": [$.i18n.prop('serverlog.js.jan'), $.i18n.prop('serverlog.js.feb'), $.i18n.prop('serverlog.js.mar'),
			$.i18n.prop('serverlog.js.apr'), $.i18n.prop('serverlog.js.may'), $.i18n.prop('serverlog.js.jun'),
			$.i18n.prop('serverlog.js.jul'), $.i18n.prop('serverlog.js.aug'), $.i18n.prop('serverlog.js.sep'),
			$.i18n.prop('serverlog.js.oct'), $.i18n.prop('serverlog.js.nov'), $.i18n.prop('serverlog.js.dec')],
		"firstDay": 1,
	},
	tableRefreshFlag : false,
	sysLogSaveMaxDays : 60, //系统日志最大存储时间
	DATERANGEPICKER_BUSI : 0,
	DATERANGEPICKER_SYS : 1,

	init:function(){
		var _this = this;

		// 获取当前使用天数
		_this.sysLogSaveMaxDays = _this.getSysUsedTimes();

		// =============== 以下是操作日志==============================
		$('#busiLogTimeSelectZone').change(function(){
			// 触发查询
			_this.busiSearch();
		});
		// 触发回车查询
		$('#busiLogUserSearch').keypress(function(e) {
			if (e.keyCode == 13) {
				_this.busiSearch();
				e.preventDefault();
			}
		});
		// 业务日志 查询 时间选择
		$('#busiLogTimeSelectZone').daterangepicker({
			//---以下 1.3.7 兼容
			"format": _this.locale.format,
			"separator": _this.locale.separator,
			//---以上 1.3.7 兼容

			"singleDatePicker": false,
			locale : _this.locale,
			"minDate": moment().subtract(_this.sysLogSaveMaxDays,'days'),
			"maxDate" : moment(),
			"applyClass" : "btn-yealink"
		}, function(start, end, label) {
		}).on('apply.daterangepicker',function(ev, picker){
			//选择时间后触发重新加载的方法
			//修改快速选择时间区域 选中处理
			var selectedStartDate = picker.startDate.format('YYYY-MM-DD');
			var selectedEndDate = picker.endDate.format('YYYY-MM-DD');
			var daysArr = [1,3,7,0];
			$('#busiLogTimeSelectZone').parent().parent().find('a').each(function(index, element){
				if (_this.getEndDate4RecentDays() == selectedEndDate
					&& _this.getStartDate4RecentDays(daysArr[index], _this.DATERANGEPICKER_BUSI) == selectedStartDate) {
					$('#busilog'+(daysArr[index])+'Sel').addClass('sys-log-a');
					$('#busilog'+(daysArr[index])+'Sel').removeClass('sys-log-a-notselected');
				} else {
					$('#busilog'+(daysArr[index])+'Sel').addClass('sys-log-a-notselected');
					$('#busilog'+(daysArr[index])+'Sel').removeClass('sys-log-a');
				}
			});
		});
		// 列表
		var selpageSize = getTablePageSizeForBS('m-sl-table');
		$('#m-sl-table').bootstrapTable({
			striped:true,
		    columns: _this.MAIN_TABLE_COLUMNS,
			url: 'busilog/query',
			method: 'post',
			pagination: true,
			sortable: false,           //是否启用排序
			sortOrder: "desc",          //排序方式
			queryParams: _this.queryParams, //传递参数（*）
			sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
			pageNumber:1,            //初始化加载第一页，默认第一页
			pageSize: selpageSize,            //每页的记录行数（*）
			pageList: [10, 20, 50, 100],    //可供选择的每页的行数（*）
			strictSearch: false,
			locale:getLan(),
			clickToSelect: true,        //是否启用点击选中行
			cardView: false,          //是否显示详细视图
			detailView: false,          //是否显示父子表
			onLoadSuccess:function(data){
				if (!_this.tableRefreshFlag) {
					// 解决异步的问题，先这么搞吧，后续等插件解决再去掉
					//setTimeout(function(){_this.busiSearch();},80);
				}
			},
			onRefresh:function(params){
				_this.tableRefreshFlag = true;
			}
		});

		// 导出按钮
		$('#busiLogDownloadA').click(function(){
			window.location.href = this.href;
		});
		$("#exportBusiLogBtn").click(function(){
			var queryDate = $("#busiLogTimeSelectZone").val();
			var queryDateArr = queryDate.split(serverlog.locale.separator);
			var startDate = $.trim(queryDateArr[0]);
			var endDate = $.trim(queryDateArr[1]);
			var order = "desc";
			var userName = $("#busiLogUserSearch").val();
			var paramString = 'userName='+userName+'&order='+order+"&startDate="+startDate+"&endDate="+endDate;
			var url = "busilog/export" + "?" + paramString;
			$('#busiLogDownloadA').attr('href', url).trigger('click');
		});
		// =============== 以上是操作日志==============================

		// =============== 以下是系统日志==============================
		//这个是系统日志导出 时间选择
		$('#sysLogTimeSelectZone').daterangepicker({
			//---以下 1.3.7 兼容
			"format": _this.locale.format,
			"separator": _this.locale.separator,
			//---以上 1.3.7 兼容

			"singleDatePicker": false,
			locale : _this.locale,
			"minDate": moment().subtract(_this.sysLogSaveMaxDays,'days'),
			"maxDate" : moment(),
			"applyClass" : "btn-yealink"
		}, function(start, end, label) {

		}).on('apply.daterangepicker',function(ev, picker){
			//选择时间后触发重新加载的方法
			//修改快速选择时间区域 选中处理
			var selectedStartDate = picker.startDate.format('YYYY-MM-DD');
			var selectedEndDate = picker.endDate.format('YYYY-MM-DD');
			var daysArr = [1,3,7,0];
			$('#sysLogTimeSelectZone').parent().parent().find('a').each(function(index, element){
				if (_this.getEndDate4RecentDays() == selectedEndDate
					&& _this.getStartDate4RecentDays(daysArr[index], _this.DATERANGEPICKER_SYS) == selectedStartDate) {
					$('#syslog'+(daysArr[index])+'Sel').addClass('sys-log-a');
					$('#syslog'+(daysArr[index])+'Sel').removeClass('sys-log-a-notselected');
				} else {
					$('#syslog'+(daysArr[index])+'Sel').addClass('sys-log-a-notselected');
					$('#syslog'+(daysArr[index])+'Sel').removeClass('sys-log-a');
				}
			});

		});

		// 导出系统日志按钮
		$('#sysLogDownloadA').click(function(){
			window.location.href = this.href;
		});
		$("#exportSyslogBtn").click(function(){
			var queryDate = $("#sysLogTimeSelectZone").val();
			var queryDateArr = queryDate.split(serverlog.locale.separator);
			var startDate = $.trim(queryDateArr[0]);
			var endDate = $.trim(queryDateArr[1]);
			var modules = '';
			$("span[id^='syslogModuleSel_']").each(function(){
				if ($(this).hasClass('syslog-sm-div-span-sel')) {
					if (modules != '') {
						modules += ',';
					}
					modules += $(this).attr('id').replace('syslogModuleSel_','');
				}
			});
			var paramString = "startDate="+startDate+"&endDate="+endDate+'&modules='+modules;
			var url = "syslog/download" + "?" + paramString;
			$('#sysLogDownloadA').attr('href', url).trigger('click');
		});
		// =============== 以上是系统日志==============================

		// =============== 以下是日志服务器配置=========================
		//日志服务器配置按钮
		$("#logServerBtn").click(function(){
			$("#serverLogDiv").hide();
			$("#logServerConfigDiv").show();
			// 获取日志服务器配置信息
			$.ajax({
				type: "get",
				url: 'logserver/init',
				success: function (data) {
					var logObj = data.rows;
					$("#logUid").val(logObj._id);
					$("#logHost").val(logObj.host);
					$("#logPort").val(logObj.port);
					$("#logProtocol").val(logObj.protocol);
					$("#logHost").trigger("blur");
				}
			});
		});
		// 返回按钮
		$("#logserverRetBtn").click(function(){
			$("#serverLogDiv").show();
			$("#logServerConfigDiv").hide();
			//刷新列表
			_this.busiSearch();
		});
		// 增加ip和域名 校验
		$.validator.addMethod("checkIpAndDn",function(value,element,params){
			if ($.trim(value) == '') {
				return true;
			}
			var checkDs = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/;
			var checkIp = /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/;
			return checkIp.test(value) || checkDs.test(value);
		},$.i18n.prop('serverlog.js.logserver.ip.invalidate'));

		// 保存按钮
		$("#logserverSaveBtn").click(function(){
			// 验证
			var validate = $("#logServerSettingForm").validate({
				errorElement : 'span',
				errorClass : 'help-block',
				focusInvalid : false,
				rules: {
					logHost : {
						maxlength : 255,
						checkIpAndDn : true
					},
					logPort : {
						required : true,
						digits : true,
						range:[1,65535]
					}
				},
				messages:{
					logHost : {
						maxlength : $.i18n.prop('serverlog.js.addr.range')
					},
					logPort : {
						required :$.i18n.prop('serverlog.js.port.require'),
						digits : $.i18n.prop('serverlog.js.port.int'),
						range: $.i18n.prop('serverlog.js.port.range')
					}
				},
				highlight : function(element) {
					$(element).closest('.form-group').addClass('has-error');
				},
				success : function(label) {
					label.parent().next().removeClass('has-error');
					label.parent().html("");
					label.parent().hide();
				},
				errorPlacement : function(error, element) {
					$("#"+element.attr("id")+"-error-span").append(error);
					error.css('margin-bottom', '0px');
					$("#"+element.attr("id")+"-error-span").show();
				}
			}).form();
			if (validate) {
				var logserverData = {
					uid : $("#logUid").val(),
					host : $("#logHost").val(),
					port : $("#logPort").val(),
					protocol : $("#logProtocol").val()
				};
				// 提交保存
				$.ajax({
					type: "post",
					data: JSON.stringify(logserverData),
					contentType: 'application/json',
					url: 'logserver/save',
					success: function (data) {
						$("#logUid").val(data.rows);
						alertPromptMsgDlg(data.message,1);
					}
				});
			}
		});
	},
	//业务操作日志查询得到查询的参数
	queryParams:function (params) {
		var queryDate = $("#busiLogTimeSelectZone").val();
		var queryDateArr = queryDate.split(serverlog.locale.separator);
		var startDate = $.trim(queryDateArr[0]);
		var endDate = $.trim(queryDateArr[1]);
		var temp = {
			offset : params.offset,
			limit : params.limit,
			order : params.order,
			startDate : startDate,
			endDate : endDate,
			userName : $("#busiLogUserSearch").val()
		};
		return temp;
	},
	//获取最近几天范围的起始时间
	getStartDate4RecentDays:function(days, type) {
		if (days != 0) {
			startDate = moment().subtract(days-1, 'days').format('YYYY-MM-DD');
		} else {
			startDate = moment().subtract(this.sysLogSaveMaxDays,'days').format('YYYY-MM-DD');
		}
		return startDate;
	},
	//获取当前时间
	getEndDate4RecentDays:function() {
		return moment().format('YYYY-MM-DD');
	},
	tableEvent:function(ii){
		$('#m-sl-table').bootstrapTable('remove', {field: '_id', values: [ii]});
	},
	// 点击具体最近几天选择的链接
	exportTimeSel:function(aname, days, timeFieldName, type) {
		// 修改超链接样式
		$('#'+aname).parent().find('a').each(function(index, element){
			if ($(element).attr('id') == aname) {
				$(element).removeClass('sys-log-a-notselected');
				$(element).addClass('sys-log-a');
			} else {
				$(element).removeClass('sys-log-a');
				$(element).addClass('sys-log-a-notselected');
			}
		});
		// 修改时间
		var startDate=this.getStartDate4RecentDays(days, type);
		var endDate=this.getEndDate4RecentDays();
		$('#'+timeFieldName).data('daterangepicker').setStartDate(startDate);
		$('#'+timeFieldName).data('daterangepicker').setEndDate(endDate);
	},
	//业务操作日志查询
	busiSearch:function() {
		$('#m-sl-table').bootstrapTable("refresh", {url: 'busilog/query'});
	},
	//系统日志 日志子类选择
	syslogSubModuleSel:function(aname){
		var _aCurobj = $('#syslogModuleSel_'+aname);
		var selectedCss = 'syslog-sm-div-span-sel';
		var notSelectedCss = 'syslog-sm-div-span-not-sel';

		if(_aCurobj.hasClass(selectedCss)){
			_aCurobj.removeClass(selectedCss);
			_aCurobj.addClass(notSelectedCss);
		} else {
			_aCurobj.removeClass(notSelectedCss);
			_aCurobj.addClass(selectedCss);
		}
		var count = 0;
		$("span[id^='syslogModuleSel_']").each(function(){
			if ($(this).hasClass(selectedCss)) {
				count++;
			}
		});
		if (count == 0) {
			$('#exportSyslogBtn').attr('disabled','true');
		} else {
			$('#exportSyslogBtn').removeAttr('disabled');
		}
	},
	getSysUsedTimes : function() {
		// 返回系统使用了多久 单位天
		var timestamp;
		$.ajax({
			type: 'GET',
			url: 'busilog/usedtime',
			data: null,
			dataType: "json",
			contentType: 'application/json',
			async : false,
			success: function (result) {
				if( result.ret >= 0 ) {
					timestamp = result.rows;
				}
			}
		});
		return timestamp;
	}
}