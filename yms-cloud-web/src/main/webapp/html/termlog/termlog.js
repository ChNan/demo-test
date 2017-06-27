var termlog = {
	MAIN_TABLE_COLUMNS:[{
		field: 'dataSeq',
		title: '',
		width: '30px'
	}, {
		field: 'terminalUserName',
        class: 'g-text-ellipsis g-max-width-30p',
		title: $.i18n.prop('termlog.js.name'),
        formatter: function(value, row, index) {
			return '<span title="'+value+'">' + value + '</span>';
        }
	}, {
		field: 'sip_username',
		visible : false
	}, {
		field: 'sip_user',
		title: $.i18n.prop('termlog.js.count')
	}, {
		field: 'model',
		title: $.i18n.prop('termlog.js.Devicemodel')
	}, {
		field: 'network_ip',
		title: $.i18n.prop('termlog.js.adress')
	}, {
		field: 'status',
		title: $.i18n.prop('termlog.js.stats'),
		formatter:function(value,row,index){
			var statusLabel = "";
			if (value=='offline') {
				statusLabel = $.i18n.prop('termlog.html.offline');
			} else if (value=='online') {
				statusLabel = $.i18n.prop('termlog.html.inline');
			}
			return statusLabel;
		}
	}, {
		field: '',
		title: $.i18n.prop('termlog.js.operation'),
		width: '120px',
		formatter:function(value,row,index){
			return '<a onmouseup="termlog.openDlMoadl(\''+row.network_ip+'\')" class="term-export" title="'+$.i18n.prop('termlog.html.Exporttheterminallog')+'"></a>';
		}
	}],
	tableRefreshFlag : false,
	termLogSaveMaxDays : 60, //$.i18n.prop('')
	locale : {
		"format": 'YYYY-MM-DD',
		"separator":  $.i18n.prop('termlog.js.to') ,
		"applyLabel": $.i18n.prop('termlog.js.sure'),
		"cancelLabel": $.i18n.prop('termlog.js.cancle'),
		"fromLabel": $.i18n.prop('termlog.js.begintime'),
		"toLabel": $.i18n.prop('termlog.js.endtime'),
		"customRangeLabel": $.i18n.prop('termlog.js.audio'),
		"weekLabel": "W",
		"daysOfWeek":[$.i18n.prop('timesetting.js.day'), $.i18n.prop('timesetting.js.one'), $.i18n.prop('timesetting.js.two'), $.i18n.prop('timesetting.js.three'), $.i18n.prop('timesetting.js.four'), $.i18n.prop('timesetting.js.five'), $.i18n.prop('timesetting.js.six')],
		"monthNames": [$.i18n.prop('timesetting.js.January'), $.i18n.prop('timesetting.js.February'), $.i18n.prop('timesetting.js.March'), $.i18n.prop('timesetting.js.April'), $.i18n.prop('timesetting.js.May'), $.i18n.prop('timesetting.js.June'), $.i18n.prop('timesetting.js.July'), $.i18n.prop('timesetting.js.August'), $.i18n.prop('timesetting.js.September'), $.i18n.prop('timesetting.js.October'), $.i18n.prop('timesetting.js.November'), $.i18n.prop('timesetting.js.December')],
		"firstDay": 1,
	},

	init:function(){
		var _this = this;

		// 获取当前使用天数
		_this.termLogSaveMaxDays = serverlog.getSysUsedTimes();

		// $.i18n.prop('')
		$.ajax({
			type: "get",
			url: 'terminallog/getModelList',
			success: function (data) {
				var modelObjList = data.rows;
				var modelSelObje = $("#termModelType");
				for (var i=0; i<modelObjList.length; i++) {
					modelSelObje.append('<option value="'+modelObjList[i]+'">' +modelObjList[i]+ '</option>');
				}
			}
		});

		$('#termLogTimeSelectZone').daterangepicker({
			//---$.i18n.prop('') 1.3.7 $.i18n.prop('')
			"format": _this.locale.format,
			"separator": _this.locale.separator,
			//---$.i18n.prop('') 1.3.7 $.i18n.prop('')

			locale : _this.locale,
			"minDate": moment().subtract(_this.termLogSaveMaxDays,'days'),
			"maxDate" : moment(),
			"applyClass" : "btn-yealink"
		}, function(start, end, label) {
		}).on('apply.daterangepicker',function(ev, picker){
			//$.i18n.prop('')
			//$.i18n.prop('') $.i18n.prop('')
			var selectedStartDate = picker.startDate.format('YYYY-MM-DD');
			var selectedEndDate = picker.endDate.format('YYYY-MM-DD');
			var daysArr = [1,3,7,0];
			$('#termLogTimeSelectZone').parent().parent().find('a').each(function(index, element){
				if (_this.getEndDate4RecentDays() == selectedEndDate
					&& _this.getStartDate4RecentDays(daysArr[index]) == selectedStartDate) {
					$('#termlog'+(daysArr[index])+'Sel').addClass('sys-log-a');
					$('#termlog'+(daysArr[index])+'Sel').removeClass('sys-log-a-notselected');
				} else {
					$('#termlog'+(daysArr[index])+'Sel').addClass('sys-log-a-notselected');
					$('#termlog'+(daysArr[index])+'Sel').removeClass('sys-log-a');
				}
			});

		});

		var selpageSize = getTablePageSizeForBS('m-tl-table');
		$('#m-tl-table').bootstrapTable({
			striped:true,
            classes: 'table table-hover g-table-fixed',
			columns: _this.MAIN_TABLE_COLUMNS,
			url: 'terminallog/query',
			method: 'post',
			pagination: true,
			sortable: false,           //$.i18n.prop('')
			sortOrder: "desc",          //$.i18n.prop('')
			queryParams: _this.queryParams, //$.i18n.prop('')（*）
			sidePagination: "server",      //$.i18n.prop('')client$.i18n.prop('')，server$.i18n.prop('')（*）
			pageNumber:1,            //$.i18n.prop('')，$.i18n.prop('')
			pageSize: selpageSize,            //$.i18n.prop('')（*）
			pageList: [10, 20, 50, 100],    //$.i18n.prop('')（*）
			strictSearch: false,
			clickToSelect: true,        //$.i18n.prop('')
			cardView: false,          //$.i18n.prop('')
			detailView: false,          //$.i18n.prop('')
			locale:getLan(),
			onLoadSuccess:function(data){
				if (!_this.tableRefreshFlag) {
					// $.i18n.prop('')，$.i18n.prop('')，$.i18n.prop('')
					//setTimeout(function(){_this.terminalSearch();},80);
				}
			},
			onRefresh:function(params){
				_this.tableRefreshFlag = true;
			}
		});
		// $.i18n.prop('')
		$('#termUserName').keypress(function(e) {
			if (e.keyCode == 13) {
				_this.terminalSearch();
				e.preventDefault();
			}
		});
		$('#termUserName').change(function() {
			_this.terminalSearch();
		});
		// $.i18n.prop('')
		$('#termStatus').change(function(){
			// $.i18n.prop('')
			_this.terminalSearch();
		});
		$('#termModelType').change(function(){
			// $.i18n.prop('')
			_this.terminalSearch();
		});
		// $.i18n.prop('')checkbox
		$("#isStartTerminalLog").click(function(){
			var useFlag = "";
			if(this.checked) {
				useFlag="1";
			} else {
				useFlag="0";
			}

			// $.i18n.prop('')
			$("#isStartTerminalLog").attr('disabled', 'disabled');

			// $.i18n.prop('')
			$('#termlogAllDivId').showLoading();

			// $.i18n.prop('')
			$.ajax({
				type: "get",
				url: 'terminallog/updateTerminalUseFlag?useFlag='+useFlag,
				success: function (data) {
					// $.i18n.prop('')
					$('#termlogAllDivId').hideLoading();

					var ret =data.ret;
					$("#isStartTerminalLog").removeAttr("disabled");
					// $.i18n.prop('')
					if (ret ==0 ) {
						if(useFlag=='1') {
							$('.cover-div').hide();
						} else {
							$('.cover-div').show();
						}
					} else {
						alertPromptMsgDlg(data.message,3,function(){
							// $.i18n.prop('') $.i18n.prop('')
							if(useFlag=='1') {
								$("#isStartTerminalLog").prop("checked", false);
							} else {
								$("#isStartTerminalLog").prop("checked", true);
							}
						});
					}
				},
				error: function(e) {
					// $.i18n.prop('')
					$('#termlogAllDivId').hideLoading();
					alertPromptMsgDlg(e,3,function(){
						$("#isStartTerminalLog").removeAttr("disabled");
					});
				}
			});
		});
		// $.i18n.prop('')
		$.ajax({
			type: "get",
			url: 'terminallog/getTerminalUseFlag',
			success: function (data) {
				var userFlag = data.rows;
				if (userFlag) {
					$("#isStartTerminalLog").prop("checked",true);
					$('.cover-div').hide();
				} else {
					$("#isStartTerminalLog").prop("checked",false);
					$('.cover-div').show();
				}
			}
		});

		// $.i18n.prop('') $.i18n.prop('') $.i18n.prop('')
		$('#termLogDownloadA').click(function(){
			window.location.href = this.href;
		});

		// $.i18n.prop('') $.i18n.prop('')
		$('#termUserName').autocomplete({
			source:function(query,process){
				var matchCount = this.options.items;//$.i18n.prop('')
				$.get("terminallog/autoComplete",{"username":encodeURI(query), "matchCount":matchCount},function(respData){
					respData = $.parseJSON(respData.rows);//$.i18n.prop('')
					return process(respData);
				});
			},
			formatItem:function(item){
				return item["terminalUserName"]+"("+item["sip_user"]+")";
			},
			setValue:function(item){
				return {'data-value':'','real-value':item["sip_user"]};
			}
		});

	},
	//$.i18n.prop('')
	queryParams:function (params) {
		var temp = {
			offset: params.offset,
			limit: params.limit,
			order: params.order,
			modelType: $("#termModelType").val(),
			status: $("#termStatus").val(),
			userName: $("#termUserName").val(),
			//id: $("#termUserName").attr("real-value")
			allUserName: $("#termUserName").attr("real-value")
		};
		return temp;
	},
	//$.i18n.prop('')
	terminalSearch:function() {
		$('#m-tl-table').bootstrapTable("refresh", {url: 'terminallog/query'});
		// $.i18n.prop('')
		$("#termUserName").attr("real-value","");
	},
	openDlMoadl:function(ii){
		$('#m-tl-dl').modal({
			show:true
		});
		$("#selectedTermForDown").val(ii);
	},
	download:function(){
		$('#m-tl-dl').modal('hide');

		var queryDate = $("#termLogTimeSelectZone").val();
		var queryDateArr = queryDate.split(termlog.locale.separator);
		var startDate = $.trim(queryDateArr[0]);
		var endDate = $.trim(queryDateArr[1]);
		var selectedTermUsername = $("#selectedTermForDown").val();
		var paramString = "startDate="+startDate+"&endDate="+endDate+"&selectedTerm="+selectedTermUsername;
		var url = "terminallog/download" + "?" + paramString;
		$('#termLogDownloadA').attr('href', url).trigger('click');
	},
	//$.i18n.prop('')
	getStartDate4RecentDays:function(days) {
		if (days != 0) {
			startDate = moment().subtract(days-1, 'days').format('YYYY-MM-DD');
		} else {
			startDate = moment().subtract(this.termLogSaveMaxDays,'days').format('YYYY-MM-DD');
		}
		return startDate;
	},
	//$.i18n.prop('')
	getEndDate4RecentDays:function() {
		return moment().format('YYYY-MM-DD');
	},
	// $.i18n.prop('')
	exportTimeSel:function(aname, days, timeFieldName) {
		// $.i18n.prop('')
		$('#'+aname).parent().find('a').each(function(index, element){
			if ($(element).attr('id') == aname) {
				$(element).removeClass('sys-log-a-notselected');
				$(element).addClass('sys-log-a');
			} else {
				$(element).removeClass('sys-log-a');
				$(element).addClass('sys-log-a-notselected');
			}
		});
		// $.i18n.prop('')
		var startDate=this.getStartDate4RecentDays(days);
		var endDate=this.getEndDate4RecentDays();
		$('#'+timeFieldName).data('daterangepicker').setStartDate(startDate);
		$('#'+timeFieldName).data('daterangepicker').setEndDate(endDate);
	}
}