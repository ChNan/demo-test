var systemstatus = {
	timeTask:null,
    onlineUserOffset: 0,
	formatDigital:function(num){
		var tmp=parseInt(num*100+0.5);
		return tmp/100;
	},
	formatMem:function(num){
		var tmp=num/1024/1024/1000;
		tmp=parseInt(tmp*100+0.5);
		return tmp/100;
	},
	reqLock:true,
	currentTab:'#tab1',
	euipDetail:"",
	MAIN_TABLE_COLUMNS:[
			{
				field:'number',
				title:' ',
				align:'left',
				width: 50,
				formatter: function(value,row,index){
					return systemstatus.onlineUserOffset + index + 1;
				}
			},
			{
		        field: 'name',
                class: 'g-text-ellipsis g-max-width-40p',
				title: $.i18n.prop('systemstatus.js.name'),
                formatter: function(value, row, index){
		        	value = (value)? value : "--";
                    return '<span title="' + value + '">' + value + '</span>';
                }
		    }, {
		        field: 'username',
		        title: $.i18n.prop('systemstatus.js.count')
		    }, {
		        field: 'userStatus',
		        title: $.i18n.prop('systemstatus.js.states')
		    }, {
		        field: '',
		        title: $.i18n.prop('systemstatus.js.Devicemodel'),
				events:{
					'mouseover .equipDetail': function(e, value, row, index){
						$("#table-equipDetail").bootstrapTable('load',row.equipDetail);
						//document.getElementById("Enter").click();
					},
					'click .equipDetail': function(e, value, row, index){
						var scrollX = document.body.scrollLeft;
						var scrollY = document.body.scrollTop;
						var tableW = 550;
						var tableH = 222;
						var x = e.clientX - tableW/2;
						var y = e.clientY + 12;

						$("#m-sys-equip .modal-dialog").css({top:y + 'px',left:x + 'px'});
						$('#m-sys-equip').modal('show');
						$('body').find('.modal-backdrop').css('opacity',0);
						systemstatus.reqLock = false;
					}
				},
				formatter: function(value,row,index){
					return '<a class="btn equipDetail" data-toggle="popover" style="padding: 0px">'+$.i18n.prop('systemstatus.js.check')+'<img src="/img/dowm-arrow.png"></a>';
				},
		    }],
	EQUIP_TABLE_COLUMNS:[
			{
				field: 'model',
				title: $.i18n.prop('systemstatus.js.Devicemodel'),
			},{
				field: 'version',
				title: $.i18n.prop('systemstatus.js.Softwareversionnumber'),
			},{
				field: 'ip',
				title: $.i18n.prop('systemstatus.js.IP'),
			},{
				field: 'equipStatus',
				title: $.i18n.prop('systemstatus.js.sts'),
			}],
	sysInfo:{
		version:{
			setValue:function(v){
				$("#version_softwareVersion").text(v.softwareVersion);
				$("#version_webVersion").text(v.webVersion);
				$("#version_sipVersion").text(v.sipVersion);
				$("#version_natVersion").text(v.natVersion);
				$("#version_mcuVersion").text(v.mcuVersion);
			}
		},
		cpu:{
			setValue:function(v){
				$("#cpu_type").text(v.type);
			}
		},
		mem:{
			setValue:function(v){
				$("#mem_total").text(systemstatus.formatMem(v.total));
			}
		},
		disk:{
			setValue:function(v){
				$("#disk_total").text(systemstatus.formatMem(v.total));
			}
		},
		network:{
			data:{
			},
			setValue:function(list){
				for(var i=0;i<list.length;i++){
					var net=list[i];
					if(!this.data[net.name]){
						if(net.status==1){
							$("#network_if_list").append('<option value="'+net.name+'">'+net.name+'</option>');
						}
						else{
							$("#network_if_list").append('<option value="'+net.name+'">'+net.name+'[offline]</option>');
						}
					}
					this.data[net.name]=net;
				}
				this.show();
			},
			show:function(){
				var key=$("#network_if_list").val();
				var info=this.data[key];
				if(info){
					for(var prop in info){
						if(prop!="name"){
							if(prop=="bootproto"){
								if(info[prop]=="dhcp"){
									$("#network_bootproto").text("DHCP");
								}
								else{
									$("#network_bootproto").text($.i18n.prop('systemstatus.js.static'));
								}
							}
							else{
								if(info[prop]){
									$("#network_"+prop).text(info[prop]);
								}
								else{
									$("#network_"+prop).text("");
								}
							}
						}
					}
				}
			}
		},
		licenseInfo:{
			formatDate:function(time){
				var date=new Date();
				date.setTime(time);
				var year=new Number(date.getFullYear()).toString();
				var month=new Number(date.getMonth() + 1).toString();
				var day=new Number(date.getDate()).toString();
				var str="";
				if(month.length<2){
					month="0"+month;
				}
				if(day.length<2){
					day="0"+day;
				}
				str=year+"/"+month+"/"+day;
				return str;
			},
			setValue:function(data){
				if(data.status=="ACTIVATED"){
					$("#license_permissionAmount").text(data.permissionAmount+$.i18n.prop('systemstatus.js.A'));
					$("#license_activeDate").text(this.formatDate(data.activationDate));
					$("#license_expirationDate").text(this.formatDate(data.expirationDate));
					var validDay=data.validDay;
					var year=parseInt(validDay/365);
					validDay=validDay%365;
					var month=parseInt(validDay/30);
					var day=validDay%30;
					var str="";
					if(year>0){
						str+=year + " " + $.i18n.prop('systemstatus.js.year');
					}
					if(month>0){
						str+=month + " " + $.i18n.prop('systemstatus.js.month');
					}
					if(day>0){
						str+=day + " " + $.i18n.prop('systemstatus.js.day');
					}
					if(validDay < 0) {
						str = $.i18n.prop('licensesetting.js.forever');
					}
					$("#license_validate").text(str);
					$('#license_active').show();
					$('#license_inactive').hide();
				}else{
					systemstatus.sysInfo.licenseInfo.recirectLicencePage();
					$('#license_active').hide();
					$('#license_inactive').show();
				}
			},
			recirectLicencePage:function(){
				$('#license_goto_active').off('click').on('click',function(){
					$('.g-main').show();
					$('.g-other').hide();
					var _this = ("li[name='item5']");
					var itemText = $(_this).find('span').text();;

					if(!$(_this).hasClass('active')){
						//选中样式
						$(_this).siblings().removeClass('active');
						$(_this).addClass('active');
					}
					$(main.MAIN_DATA).css("margin-left","280px");
					$(main.MAIN_MENU).show(0,function(){
						main.menuInit(main.MENU_TREE_ITEM,itemText,function(){
							menutree.selectNode(11);
						});
					})
				});
			}
		},
		show:function(){
			$.ajax({
				type: "GET",
				url: "softwareVersion/query",
				dataType: "json",
				success: function(result){
					if(result.ret>=0){
						systemstatus.sysInfo.version.setValue(result.data);
					}
				}
			});
			$.ajax({
				type: "GET",
				url: "systemStatus/query?config=true",
				dataType: "json",
				success: function(result){
					if(result.ret>=0){
						for(var key in result.data){
							if(systemstatus.sysInfo[key]){
								systemstatus.sysInfo[key].setValue(result.data[key]);
							}
						}
					}
				}
			});
			$.ajax({
				type: "GET",
				url: "license/query",
				dataType: "json",
				success: function(result){
					if(result.ret>0){
						systemstatus.sysInfo.licenseInfo.setValue(result.rows);
					}
					else{
						systemstatus.sysInfo.licenseInfo.recirectLicencePage();
						$('#license_active').hide();
						$('#license_inactive').show();
					}
				}
			});
		}
		
	},
	internalSeconds:10,
	secondJob:function(){
		$("#second_count").text((--this.internalSeconds)+"s");
		if(this.internalSeconds<=0){
			this.internalSeconds=10;
			if(systemstatus.reqLock){
				//systemstatus.reqLock = false;
				if(systemstatus.currentTab == '#tab1'){
					systemstatus.sysInfo.show();
				}else if(systemstatus.currentTab == '#tab2') {
					systemstatus.onlineStatusSearch();
				} else {
                    liveMeeting.search();
                }
			}

			$("#second_count").text((this.internalSeconds)+"s");
		}
	},
	init:function(){
		var _this = this;
		_this.sysInfo.show();
		systemstatus.timerTask=setInterval("systemstatus.secondJob()",1000);
		$("#network_if_list").unbind("change").bind("change",function(){
			systemstatus.sysInfo.network.show();
		});
		// $.i18n.prop('')
		$('#onlineUserSearchZone').keypress(function(e) {
			if (e.keyCode == 13) {
				_this.onlineStatusSearch();
				e.preventDefault();
			}
		});
		//$.i18n.prop('')
		$('#onlineUserSearchZone').change(function() {
			_this.onlineStatusSearch();
		});
		
		$('#table-onlineStatus').bootstrapTable({
			striped:true,
            classes: 'table table-hover g-table-fixed',
			columns: _this.MAIN_TABLE_COLUMNS,
			sortable: false,           //$.i18n.prop('')
			queryParams:_this.queryParams,
			pagination:true,
			sidePagination: "server",
			pageNumber:1,
		    pageSize:50,
			locale:getLan(),
			pageList: [10, 20, 50, 100],    //$.i18n.prop('')（*）
			url: 'onlineStatus/query',
			method: 'post',
		    onLoadSuccess:function(data){
		    	//console.log(data);
				systemstatus.reqLock = true;
		    },
		    onSearch:function(text){
		    }
		});

		$('#table-equipDetail').bootstrapTable({
			search:false,
			striped:true,
			sortable: false,
			pagination:false,
			columns: systemstatus.EQUIP_TABLE_COLUMNS,
		});


		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			systemstatus.currentTab =  $(this).attr('href');
			//$.i18n.prop('')tab$.i18n.prop('')
			systemstatus.reqLock = true;
		})

		$('#m-sys-equip').on('hide.bs.modal',function(e){
			systemstatus.reqLock = true;
		})

		//$.i18n.prop('')
		$('#onlineUserSearchZone').autocomplete({
			source:function(query,process){
				var matchCount = this.options.items;//$.i18n.prop('')
				$.get("/onlineStatus/autoComplete",{"search":encodeURI(query), "matchCount":matchCount},function(respData){
					respData = $.parseJSON(respData.rows);//$.i18n.prop('')
					return process(respData);
				});
			},
			formatItem:function(item){
				return item["key"];
			},
			setValue:function(item){
				return {'data-value':'','real-value':item["uid"]};
			}
		});
        liveMeeting.init();
	},

	//$.i18n.prop('')
	queryParams:function (params) {
		var temp = {
			offset : params.offset,
			limit : params.limit,
			search : $("#onlineUserSearchZone").val(),
			uid: $("#onlineUserSearchZone").attr("real-value")
		};
        systemstatus.onlineUserOffset = params.offset;
		return temp;
	},
	//$.i18n.prop('')
	onlineStatusSearch:function() {
		$('#table-onlineStatus').bootstrapTable("refresh");
		// $.i18n.prop('')
		$("#onlineUserSearchZone").attr("real-value","");
	},
	onDestory:function(){
		if(systemstatus.timerTask){
			console.log("destroy systemstatus timer");
			clearInterval(systemstatus.timerTask);
			systemstatus.timerTask=null;
		}
	}
}

var liveMeeting = {
    tableID: 'liveMeetingTab',
    offset: 0,
    MEETING_TABLE_COLUMNS: [
        {
            align:'left',
            width: '50px',
            formatter: function(value, row, index){
                return liveMeeting.offset + index + 1;
            }
        }, {
            field: 'subject',
			width: '28%',
            class: 'g-text-ellipsis',
            title: $.i18n.prop("systemstatus.js.meet.subject"),
            formatter: function(value, row, index){
            	var subject = value;
                if(row.confType == 2) {
                    subject = $.i18n.prop("calldetail.js.meetnow.subject", row.organizerName);
                }
                return '<span title="' + subject + '">' + subject + '</span>';
            }
        }, {
            field: 'dateTime',
            width: '180px',
            title: $.i18n.prop("systemstatus.js.meet.time"),
            formatter: function (value, row, index) {
				return moment(row.startTime).format("YYYY/MM/DD HH:mm:ss");
            }
        }, {
            field: 'organizerName',
            width: '17%',
            class: 'g-text-ellipsis',
            title: $.i18n.prop("systemstatus.js.meet.organizer"),
            formatter: function(value, row, index){
                return '<span title="' + value + '">' + value + '</span>';
            }
        }, {
            field: 'confType',
            title: $.i18n.prop("systemstatus.js.meet.type"),
            formatter: function (value, row, index) {
                switch (value){
                    case 0:
                        return $.i18n.prop("systemstatus.js.meet.type.meeting");
                    case 1:
                        return $.i18n.prop("systemstatus.js.meet.type.video");
                    case 2:
                        return $.i18n.prop("systemstatus.js.meet.type.meetnow");
                    default:
                        return "Unknow";
                }
            }
        }, {
            field: 'conferenceNumber',
            title: $.i18n.prop("systemstatus.js.meet.id")
        }, {
            field: 'startTime',
            title: $.i18n.prop("systemstatus.js.meet.duration"),
            formatter: function (value) {
                return durationFormat((moment().valueOf() - value) / 1000);
            }
        }
    ],
    init: function () {
        $('#' + liveMeeting.tableID).bootstrapTable({
            striped: true,
            classes: 'table table-hover g-table-fixed',
            columns: liveMeeting.MEETING_TABLE_COLUMNS,
            url: '/conference/live',
            queryParams: liveMeeting.queryParams,
            method: 'post',
            pagination: true,
            sortable: false,
            sortOrder: "desc",
            sidePagination: "server",
            pageNumber: 1,
            pageSize: getTablePageSizeForBS('liveMeetingTab'),
            pageList: [10, 20, 50, 100],
            strictSearch: false,
            locale: getLan(),
            clickToSelect: true,
            cardView: false,
            detailView: false,
            cache: false
        });
        $('#meetingSearchIpt').off('keypress').on('keypress', function (event) {
            var keycode = event.keyCode ? event.keyCode : event.which;
            if (keycode == 13) {
                liveMeeting.search();
                return false;
            }
        });
    },
    search: function () {
        $('#' + liveMeeting.tableID).bootstrapTable("refresh");
    },
    queryParams: function (params) {
        liveMeeting.offset = params.offset;
        var key = $.trim($("#meetingSearchIpt").val());
        var queryParams = $.extend( params, {
            search: key
        });
        return queryParams;
    }
}