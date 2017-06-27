var conf_ctrl = {
	confInfo:{
		onChooseLayout:false,
		setValue:function(vo){
			this.state=vo.state;
			this.confId=vo.confId;
			this.subject=vo.subject;
			//$("#add_participant_title").text("$.i18n.prop('')");
			this.organizerId=vo.organizerId;
			this.profile=vo.profile;
			if(this.profile=="default"){
				$("#profile_display").text($.i18n.prop('conference.html.Discussionmode'));
			}
			else{
				$("#profile_display").text($.i18n.prop('conference.html.Trainingmode'));
			}
			this.confEntity=vo.confEntity;
			this.isOrganizer=(this.organizerId==vo.currentOperator.uid);
			if(this.state==2){
				errorMsgDlg($.i18n.prop('conference.js.coend'), 3, function(){
					window.location="/main?searchType=1&_="+(new Date().getTime());
				});
				if(conf_ctrl.timer){
					clearInterval(conf_ctrl.timer);
					conf_ctrl.timer=null;
				}
				return;
			}
			if(vo.currentOperator.role=="attendee"){
				var msg=$.i18n.prop('conference.js.coyet',vo.subject);
				if(conf_ctrl.confInfo.currentOperator){
					if(conf_ctrl.confInfo.currentOperator.role=="presenter"){
						/*msg="$.i18n.prop('')"+vo.subject+" $.i18n.prop('')！";*/
                        msg=$.i18n.prop('conference.js.colimit');
					}
				}
				errorMsgDlg(msg, 3,function(){
					window.location="/main?searchType=1&_="+(new Date().getTime());
				});
				if(conf_ctrl.timer){
					clearInterval(conf_ctrl.timer);
					conf_ctrl.timer=null;
				}
				return;
			}
			this.currentOperator=vo.currentOperator;
			this.muteAll=vo.muteAll;
			this.startTime=vo.beginTime;
			this.layout=vo.layout;
			this.freeSwitchIp=vo.freeSwitchIp;
			this.conferenceNumber=vo.conferenceNumber;
			$("#conference_number").text(this.conferenceNumber);
			this.pinCode=vo.pinCode;
			if(this.pinCode==null){
				this.pinCode=$.i18n.prop('conference.js.none');
			}
			$("#conference_pinCode").text(this.pinCode);
			this.realm=vo.realm;
			if(!this.onChooseLayout){
				$("#choose_layout .chs_layout").removeClass("layout_selected");
				if(this.layout){
					if(this.layout.indexOf("Equality")>=0){
						$("#choose_layout .layout2").addClass("layout_selected");
					}
					else if(this.layout.indexOf("SpeechExcitation")>=0){
						$("#choose_layout .layout3").addClass("layout_selected");
					}
					else if(this.layout.indexOf("Exclusive")>=0){
						$("#choose_layout .layout1").addClass("layout_selected");
					}
					
				}
			}
			$("#conference_subject").text(vo.subject);
            $("#conference_subject").attr("title", vo.subject);
			$("#conference_timeBucket").text(vo.timeBucket);
			this.lock=vo.lock;
			if(this.lock){
				$("#btn_lock").hide();
				$("#btn_unlock").show();
				$(".lock_tag").show();
			}
			else{
				$("#btn_lock").show();
				$("#btn_unlock").hide();
				$(".lock_tag").hide();
			}
			if(this.muteAll){
				$("#btn_unmute_all").show();
				$("#btn_mute_all").hide();
			}
			else{
				$("#btn_unmute_all").hide();
				$("#btn_mute_all").show();
			}
			if(this.profile=="default"){
				$("#btn_layout").show();
			}
			else{
				$("#btn_layout").hide();
			}
			var curr=new Date().getTime();
			var second=parseInt((curr-vo.beginTime)/1000);
			var minute=parseInt(second/60);
			second=second%60;
			if(second>=0){
				var hour=parseInt(minute/60);
				minute=minute%60;
				var day=parseInt(hour/24);
				hour=hour%24;
				var str="";
				if(day>0){
					str+=day+$.i18n.prop('conference.js.day') 
				}
				if(hour<10){
					str+='0';
				}
				str+=hour+":";
				if(minute<10){
					str+='0'
				}
				str+=minute+":";
				if(second<10){
					str+='0';
				}
				str+=second;
				$("#conference_time_use").text(str);
			}
			else{
				var text=$.i18n.prop('conference.js.countdown')+" "+(-minute)+" "+$.i18n.prop('conference.js.minutes');
				if(minute<-1 && text.substring(text.length-3,text.length)=="min"){
					text+="s";
				}
				$("#conference_time_use").text(text);
			}

			var para = $.extend(this, {
                timeBucket: vo.timeBucket
			});
			/*template id: inviteMailBody_en 或 inviteMailBody_cn*/
            template.config("escape", false);
            this.mailBody = template($.i18n.prop("conference.js.invite.mail.body.id"), para);
            template.config("escape", true);
            var mailTo='mailto:?subject=' + encodeURIComponent(conf_ctrl.confInfo.subject)+
                '&body='+ encodeURIComponent(this.mailBody);
			$("#invite_a").attr("href",mailTo);
		}
	},
	participantModel:{
		data:{},
		init:function(list){
			if(list && list.length){
				var num=0;
				for(var i=0;i<list.length;i++){
					if(list[i].online){
						this.data[list[i]._id]=new Participant(list[i]);
						num++;
					}
				}
				$("#conference_participant_num").text(num);
			}
			this.render();
			/**
			 * $.i18n.prop('')
			 */
			
			this.bindEvent();
		},
		bindEvent:function(){
			$(".btn_mute").off("click").on("click",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					var currBtn=$(this);
		    		currBtn.attr("disabled",true);
					sendCmd("/conferencectrl/user/mute", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity,"mute":true},function(){setTimeout(function(){currBtn.attr("disabled",false)},300);});
				}
			});
			$(".btn_talk").off("click").on("click",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					var currBtn=$(this);
		    		currBtn.attr("disabled",true);
					sendCmd("/conferencectrl/user/mute", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity,"mute":false},function(){setTimeout(function(){currBtn.attr("disabled",false)},300);});
				}
			});
			$(".btn_demon").off("mouseup").on("mouseup",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					alertConfirmationMsgDlgDetail($.i18n.prop('conference.js.makesure'),$.i18n.prop('conference.js.makespeach',participant.name),$.i18n.prop('conference.html.sure'),function(){
						sendCmd("/conferencectrl/user/demon", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity,"demon":true});
					});
				}
			});
			$(".btn_listener").off("mouseup").on("mouseup",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					alertConfirmationMsgDlgDetail($.i18n.prop('conference.js.makesure'),$.i18n.prop('conference.js.makeautience',participant.name),$.i18n.prop('conference.html.sure'),function(){
						sendCmd("/conferencectrl/user/demon", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity,"demon":false});
					});
				}
			});
			$(".btn_presenter").off("mouseup").on("mouseup",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					alertConfirmationMsgDlgDetail($.i18n.prop('conference.js.hint'),$.i18n.prop('conference.js.makehost',participant.name),$.i18n.prop('conference.html.sure'),function(){
						sendCmd("/conferencectrl/user/role", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity,"role":"presenter"});
	    			});
				}
			});
			$(".btn_attendee").off("mouseup").on("mouseup",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					alertConfirmationMsgDlgDetail($.i18n.prop('conference.js.hint'),$.i18n.prop('conference.js.makevisitor',participant.name),$.i18n.prop('conference.html.sure'),function(){
						sendCmd("/conferencectrl/user/role", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity,"role":"attendee"});
					});
				}
			});
			$(".btn_remove").off("mouseup").on("mouseup",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				if(participant){
					alertConfirmationMsgDlgDetail($.i18n.prop('conference.js.hint'),$.i18n.prop('conference.js.makemove',participant.name),$.i18n.prop('conference.html.sure'),function(){
						sendCmd("/conferencectrl/user/remove", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity});
					});
				}
			});
			$(".hand").off("mouseup").on("mouseup",function(){
				var id=$(this).parent().parent().attr("id").substring(2);
				var participant=conf_ctrl.participantModel.data[id];
				$("#hand_requester_name").text(participant.name);
				$('#hand_confirm').modal('show');
				var param={"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":participant.entity};
				$("#hand_confirm #handOkBtn").off("mouseup").on("mouseup",function(){
					param.mute=false;
					sendCmd("/conferencectrl/user/mute",param);
				});
				$("#hand_confirm #handCancelBtn").off("mouseup").on("mouseup",function(){
					param.mute=true;
					sendCmd("/conferencectrl/user/mute",param);
				});
			});
			
		},
		render:function(){
			for(var p in this.data){
				if(this.data[p].permission == "presenter"||this.data[p].permission=="organizer"){
					$(this.data[p].getHtml()).appendTo("#presenter_list");
				}
				else{
					$(this.data[p].getHtml()).appendTo("#attendee_list");
				}
			}
			conf_ctrl.participantModel.sort("presenter_list");
			conf_ctrl.participantModel.sort("attendee_list");
		},
		onData:function(usr){
			var old=conf_ctrl.participantModel.data[usr._id];
			if(old){
				if(usr.online){
					old.setValue(usr);
				}
				else{
					var pline=$("#p_"+old._id);
					var parentId=pline.parent().attr("id");
					$("#p_"+old._id).remove();
					delete conf_ctrl.participantModel.data[usr._id];
					conf_ctrl.participantModel.sort(parentId);
				}
			}
			else if(usr.online){
				var newOne=new Participant(usr);;
				conf_ctrl.participantModel.data[usr._id]=newOne;
				if(newOne.permission=="presenter"||newOne.permission=="organizer"){
					$("#presenter_list").append(newOne.getHtml());
					conf_ctrl.participantModel.sort("presenter_list");
				}
				else{
					$("#attendee_list").append(this.data[usr._id].getHtml());
					conf_ctrl.participantModel.sort("attendee_list");
				}
				this.bindEvent();
			}
			
		},
	    sort:function(listId){
	    	var array=new Array();
	    	var lines=new Object();
	    	$("#"+listId+" tr").each(function(idx,item){
	    		var id=$(this).attr("id").substring(2);
	    		array.push(id);
	    		lines[id]=$(this);
	    	});
	    	array.sort(function(a,b){
	    		var objA=conf_ctrl.participantModel.data[a];
	    		var objB=conf_ctrl.participantModel.data[b];
	    		var strA="",strB="";
	    		strA+=(objA.permission=="organizer"?"0":"1")+(objA.mediaIngressFilter=="unblocking"?'0':'1')
	    			+("demonstrator"==objA.demonstate?'0':'1')+(objA.mute?'1':'0')
	    			+(objA._id.substring(0,4)=="out_"?'1':'0')+objA.fullPinyin;
	    		strB+=(objB.permission=="organizer"?"0":"1")+(objB.mediaIngressFilter=="unblocking"?'0':'1')
	    			+("demonstrator"==objB.demonstate?'0':'1')+(objB.mute?'1':'0')
	    			+(objB._id.substring(0,4)=="out_"?'1':'0')+objB.fullPinyin;
	    		if(strA==strB){
	    			return 0;
	    		}
	    		else if(strA<strB){
	    			return -1;
	    		}
	    		else{
	    			return 1;
	    		}
	    		
	    	});
	    	var listBody=$("#"+listId);
	    	for(var i=0;i<array.length;i++){
	    		listBody.append(lines[array[i]]);
	    	}
	    	var num=0;
	    	$("#"+listId+" tr").each(function(idx,item){
	    		num++;
	    		if(idx%2==0){
	    			$(this).removeClass("tr_light").addClass("tr_dark");
	    		}
	    		else{
	    			$(this).removeClass("tr_dark").addClass("tr_light");
	    		}
	    	});
	    	$("#"+listId+"_num").text("("+num+")");
	    },
	    getParticipantIds:function(){
	    	var pIds=",";
	    	for(var prop in this.data){
	    		pIds+=prop+",";
	    	}
	    	return pIds;
	    }
	},
	timeTask:function(){
		$.ajax({
			type: "GET",
			url: "/conferencectrl/query?confId="+conf_ctrl.confInfo.confId+"&_="+new Date().getTime(),
			dataType: "json",
			success: function(result){
				if(result.ret>0){
					var conference=result.rows;
					conf_ctrl.confInfo.setValue(conference);
					if(conference.participants){
						for(var i=0;i<conference.participants.length;i++){
							conf_ctrl.participantModel.onData(conference.participants[i]);
						}
					}
					var num=0;
					for(var prop in conf_ctrl.participantModel.data){
						num++;
					}
					$("#conference_participant_num").text(num);
				}
				else{
					alertPromptMsgDlg(result.message,3);
				}
		    },
		    error:function(req, textStatus){
		    	if(req.status==401){
		    		window.location="/";
		    	}
		    	else{
		    		//alertPromptMsgDlg(textStatus,3);
		    	}
		    }
		 });
	},
    init: function () {

    	var queryStr = window.location.search;
    	$.ajax({
			type: "GET",
			url: getContextPath()+"/conferencectrl/query"+queryStr,
			dataType: "json",
			success: function(result){
				if(result.ret>0){
					var conference=result.rows;
					conf_ctrl.confInfo.setValue(conference);
					conf_ctrl.participantModel.init(conference.participants);
					conf_ctrl.timer=setInterval(conf_ctrl.timeTask,1000);
				}
				else if(result.ret==0){//$.i18n.prop(''),$.i18n.prop('')
					alertPromptMsgDlg("Conference no found",3);
				}
				else{
					if(result.returnUrl){
						alertPromptMsgDlg(result.message,3,function(){window.location=result.returnUrl;});
					}
				}
		    },
		    error:function(req, textStatus){
		    	if(req.status==401){
		    		window.location="/";
		    	}
		    	else{
		    		//alertPromptMsgDlg(textStatus,3);
		    	}
		    }
		 });
    	$("#search_input_box #search_input").autocomplete({
            source:function(query,process){
                this.options.items = 1000;//$.i18n.prop('')
                var validDatas=new Array();
                var keyword=query.toLowerCase();
                if(keyword!=""){
	                $("#presenter_list tr").each(function(idx,element){
	    				var id=$(this).attr("id").substring(2);
	    				var part=conf_ctrl.participantModel.data[id];
	    				if(part.name.toLowerCase().indexOf(keyword)>=0
	    						||part.pinyin.toLowerCase().indexOf(keyword)>=0
	    						||part.fullPinyin.toLowerCase().indexOf(keyword)>=0
	    						||(part.username && part.username.toLowerCase().indexOf(keyword)>=0)
	    						||(part.phone && part.phone.toLowerCase().indexOf(keyword)>=0)){
	    					validDatas.push({"id":id,"name":part.name,"pinyin":part.pinyin});
	    				}
	    			});
	    			$("#attendee_list tr").each(function(idx,element){
	    				var id=$(this).attr("id").substring(2);
	    				var part=conf_ctrl.participantModel.data[id];
	    				if(part.name.toLowerCase().indexOf(keyword)>=0
	    						||part.pinyin.toLowerCase().indexOf(keyword)>=0
	    						||part.fullPinyin.toLowerCase().indexOf(keyword)>=0
	    						||(part.username && part.username.toLowerCase().indexOf(keyword)>=0)
	    						||(part.phone && part.phone.toLowerCase().indexOf(keyword)>=0)){
	    					validDatas.push({"id":id,"name":part.name,"pinyin":part.pinyin});
	    				}
	    			});
	                process(validDatas);
	            }
                else{
                	$("#presenter_list tr").show();
                	$("#attendee_list tr").show();
                }
            },
            formatItem:function(item){
                return item["name"];
            },
            setValue:function(item){
                return {"data-value":item["name"], "real-value":item["id"]};
            },
            updater: function (item) {
                var selectedId = $("#search_input_box .typeahead.dropdown-menu").find(".active").attr("real-value");
                $("#presenter_list tr").hide();
    			$("#attendee_list tr").hide();
    			$("#p_"+selectedId).show();
            }
        });
        $("#search_mail_input").off("keyup").on("keyup", function () {
        	if(!$("#search_mail_input").val()) {
            	$("#staffMailList li").show();
			}
        });
    	$("#search_mail_input").autocomplete({
            source:function(query,process){
                this.options.items = 1000;//$.i18n.prop('')
                var validDatas=new Array();
                var keyword=query.toLowerCase();
                if(keyword!=""){
	                $("#staffMailList li").each(function(idx,element){
	                	var item=$(this);
	    				var mail=item.attr("mail").toLowerCase();
	    				var text=item.html().toLowerCase();
	    				var pinyin=item.attr("namePinyin").toLowerCase();
	    				if(mail.indexOf(keyword)>=0 
	    						||text.indexOf(keyword)>=0
	    						||pinyin.indexOf(keyword)>=0){
	    					validDatas.push({"name":text,"mail":mail});
	    				}
	    			});
	                process(validDatas);
	            }
                else{
                	$("#staffMailList li").show();
                }
            },
            formatItem:function(item){
                return item["name"];
            },
            setValue:function(item){
                return {"data-value":item["name"], "real-value":item["mail"]};
            },
            updater: function (item) {
            	var selectedItem=$("#search_email_div .typeahead.dropdown-menu").find(".active");
                var selectedMail =selectedItem.attr("real-value");
                var selectedText =selectedItem.find("a").text();
                addNewMail(selectedText, selectedMail)
                $("#staffMailList li").show();
            }
        });
    	$("#search_email_div .searchbox-icon").off("mouseup").on("mouseup",function(){
    		var keyword=$("#search_mail_input").val();
    		if(keyword!=""){
                $("#staffMailList li").each(function(idx,element){
                	var item=$(this);
    				var mail=item.attr("mail");
    				var text=item.html();
    				var pinyin=item.attr("namePinyin");
    				if(mail.indexOf(keyword)>=0 
    						||text.indexOf(keyword)>=0
    						||pinyin.indexOf(keyword)>=0){
    					item.show();
    				}
    				else{
    					item.hide();
    				}
    			});
                
            }
            else{
            	$("#staffMailList li").show();
            }
    	});
    	/*$("#search_input_box #search_input").dblclick(function(){
    		$("#presenter_list tr").show();
        	$("#attendee_list tr").show();
    	});*/
    	$("#search_input_box .searchbox-icon").click(function(){
            var keyword = $("#search_input_box #search_input").val();
            if(keyword == ""){
                $("#presenter_list tr").show();
                $("#attendee_list tr").show();
                return;
            }
			keyword = keyword.toLowerCase();
            $("#presenter_list tr").each(function(idx,element){
                var id=$(this).attr("id").substring(2);
                var part=conf_ctrl.participantModel.data[id];
                if(part.name.indexOf(keyword)>=0
                    ||part.pinyin.toLowerCase().indexOf(keyword)>=0
                    ||part.fullPinyin.toLowerCase().indexOf(keyword)>=0
                    ||(part.username && part.username.toLowerCase().indexOf(keyword)>=0)
                    ||(part.phone && part.phone.toLowerCase().indexOf(keyword)>=0)){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            $("#attendee_list tr").each(function(idx,element){
                var id=$(this).attr("id").substring(2);
                var part=conf_ctrl.participantModel.data[id];
                if(part.name.indexOf(keyword)>=0
                    ||part.pinyin.indexOf(keyword)>=0
                    ||part.fullPinyin.indexOf(keyword)>=0
                    ||(part.username && part.username.indexOf(keyword)>=0)
                    ||(part.phone && part.phone.indexOf(keyword)>=0)){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
        })
    	/*$("#search_input").bind('input propertychange',function(){
    		var keyword=$(this).val();
    		if(keyword != ""){
    			$("#search_input_clear").show();
    			$("#presenter_list tr").each(function(idx,element){
    				var id=$(this).attr("id").substring(2);
    				var part=conf_ctrl.participantModel.data[id];
    				if(part.name.indexOf(keyword)>=0 
    						||part.pinyin.indexOf(keyword)>=0
    						||part.fullPinyin.indexOf(keyword)>=0){
    					$(this).show();
    				}
    				else{
    					$(this).hide();
    				}
    			});
    			$("#attendee_list tr").each(function(idx,element){
    				var id=$(this).attr("id").substring(2);
    				var part=conf_ctrl.participantModel.data[id];
    				if(part.name.indexOf(keyword)>=0 
    						||part.pinyin.indexOf(keyword)>=0
    						||part.fullPinyin.indexOf(keyword)>=0){
    					$(this).show();
    				}
    				else{
    					$(this).hide();
    				}
    			});
    		}
    		else{
    			$("#search_input_clear").hide();
    			$("#presenter_list tr").show();
    			$("#attendee_list tr").show();
    		}
    	});
    	$("#search_input_clear").click(function(){
    		$(this).hide();
    		$("#search_input").val("");
    		$("#presenter_list tr").show();
			$("#attendee_list tr").show();
    	});*/
    	/**
    	 *  $.i18n.prop('')
    	 */
    	$("#btn_invite").off("mouseup").on("mouseup",function(){
    		/*$.i18n.prop('')，$.i18n.prop('') 2016-12-12 modify by sean
    		 if(conf_ctrl.confInfo.lock){
    			alertPromptMsgDlg("$.i18n.prop('')，$.i18n.prop('')，$.i18n.prop('')！",3);
    		}
    		else{
    			conferenceplan.addParticipant('invite_participant');
    		}*/
    		conferenceplan.addParticipant('invite_participant');
		});
    	
    	$("#btn_lock").off("click").on("click",function(){
    		var currBtn=$(this);
    		currBtn.attr("disabled",true);
			sendCmd("/conferencectrl/lock", {"confEntity":conf_ctrl.confInfo.confEntity,"lock":true},function(){setTimeout(function(){currBtn.attr("disabled",false)},300);});
		});
    	$("#btn_unlock").off("click").on("click",function(){
    		var currBtn=$(this);
    		currBtn.attr("disabled",true);
			sendCmd("/conferencectrl/lock", {"confEntity":conf_ctrl.confInfo.confEntity,"lock":false},function(){setTimeout(function(){currBtn.attr("disabled",false)},300);});
			
		});
    	$("#btn_mute_all").off("click").on("click",function(){
    		var currBtn=$(this);
    		currBtn.attr("disabled",true);
			sendCmd("/conferencectrl/muteAll", {"confEntity":conf_ctrl.confInfo.confEntity,"mute":true},function(){setTimeout(function(){currBtn.attr("disabled",false)},300);});
			
		});
    	$("#btn_unmute_all").off("click").on("click",function(){
    		var currBtn=$(this);
    		currBtn.attr("disabled",true);
			sendCmd("/conferencectrl/muteAll", {"confEntity":conf_ctrl.confInfo.confEntity,"mute":false},function(){setTimeout(function(){currBtn.attr("disabled",false)},300);});
			
		});
    	$("#btn_layout").off("mouseup").on("mouseup",function(){
    		conf_ctrl.confInfo.onChooseLayout=true;
    	    $('#choose_layout').modal('show');
		});
    	$("#btn_exit").off("mouseup").on("mouseup",function(){
    		$("#presenter_exit_confirm").modal("show");
		});
    	$("#presenterFinishBtn").off("mouseup").on("mouseup",function(){
    		sendCmd("/conferencectrl/finish", {"confEntity":conf_ctrl.confInfo.confEntity},function(){
    			window.location="/main?searchType=1&_="+(new Date().getTime());
    		});
    		//conf_ctrl.confInfo.setValue({"state":2});
    		//window.location="/main";
    	});
    	$("#presenterExitBtn").off("mouseup").on("mouseup",function(){
    		sendCmd("/conferencectrl/user/remove", {"confEntity":conf_ctrl.confInfo.confEntity,"userEntity":""},
    				function(){window.location="/main?searchType=1&_="+(new Date().getTime());});
    		
    	});
    	$("#choose_layout .chs_layout").off("mouseup").on("mouseup",function(){
	    	$("#choose_layout .chs_layout").removeClass("layout_selected");
			$(this).addClass("layout_selected");
	    });
    	$("#choose_layout #chooseLayoutOkBtn").click(function(){
			var node=$("#choose_layout .layout_selected");
    		var layout=node.attr("layout");
    		var viewNum=node.attr("viewNum");
    		if(layout && layout !=""){
	    		var param={"confEntity":conf_ctrl.confInfo.confEntity,"layout":layout,"viewNum":viewNum};
				sendCmd("/conferencectrl/layout", param);
				
    		}
    	});
    	$('#choose_layout').on('hidden.bs.modal', function (e) {
    		conf_ctrl.confInfo.onChooseLayout=false;
    	}).on("show.bs.modal",function(e){
    		conf_ctrl.confInfo.onChooseLayout=true;
    	});
    	$("#layout_exclusive").off("mouseup").on("mouseup",function(){
    		$('#choose_layout').modal('hide');
    		$("#choose_demonstrator_list").html("");
			var enable=false;
    		for(var prop in conf_ctrl.participantModel.data){
    			var p=conf_ctrl.participantModel.data[prop];
    			var line='<div entity="'+p.entity+'" class="demonstrator';
    			if(p.demonstate=="demonstrator"){
    				line+=' actived';
					enable=true;
    			}
    			else{
    				line+=' noactive';
    			}
    			line+='"><div class="avatar';
    			if(p.permission=="attendee"){
    				line+=' attendee';
    			}
    			else{
    				line+=' presenter';
    			}
    			line+='"></div><div class="demon_p_name">'+p.name+'</div></div>';
    			$(line).appendTo("#choose_demonstrator_list");
    		}
			if(enable==true){
				$("#chooseDemonOkBtn").removeAttr("disabled");
				$("#chooseDemonOkBtn").removeAttr("title");
			}else {
				$("#chooseDemonOkBtn").attr("disabled","true");
				$("#chooseDemonOkBtn").attr("title",$.i18n.prop('conference.js.leastone'));
			}
    		$("#choose_demonstrator_list .demonstrator").off("mouseup").on('mouseup',function(){
    			$("#choose_demonstrator_list .actived").removeClass("actived").addClass("noactive");
    			$(this).removeClass("noactive").addClass("actived");
				$("#chooseDemonOkBtn").removeAttr("disabled");
				$("#chooseDemonOkBtn").removeAttr("title");
    		});
    		$("#choose_demonstrator #chooseDemonOkBtn").off("mouseup").on("mouseup",function(){
    			var entity=$("#choose_demonstrator_list .actived").attr("entity");
    	    	var param={"confEntity":conf_ctrl.confInfo.confEntity,"layout":"Exclusive","demon":entity};
    			sendCmd("/conferencectrl/layout", param);
    		});
    		$("#choose_demonstrator").modal("show");
    	});
    	var timeoutJob;
    	$("#invite_a").off("mouseup").on("mouseup",function(){
    		$("#add_participant_modal").modal("hide");
    	}).hover(function(){
    		timeoutJob=setTimeout(function(){$("#invite_a_remind").slideDown(300);},500);
    	},function(){
    		if(timeoutJob){
    			clearTimeout(timeoutJob);
    			timeoutJob=null;
    		}
    		$("#invite_a_remind").slideUp(300);
    	});
    	$("#invite_b").off("mouseup").on("mouseup",function(){
    		$("#add_participant_modal").modal("hide");
    		initMailList();
    		$("#mail_targets").children().remove();
    		$('<div class="mail_targets_margin_last"></div>').click(function(event){
    			event.stopPropagation();
    			event.preventDefault();
    			clearSelected();
    			$(this).addClass("mail_input");
    			addMailInput($(this));
    		}).appendTo("#mail_targets");
    		var mailBody=conf_ctrl.confInfo.mailBody;
    		mailBody=mailBody.replace(new RegExp("\n","gm"),"<br/>").replace(new RegExp(" ","gm"),"&nbsp;");
    		CKEDITOR.instances.editor_mail_content.setData(mailBody);
    		$("#server_mail").show();
    	});

    },
	resize:function(){
		var height=$(window).height()-190;
		$("#main_panel").height(height);
		$("#participants").height((height-100));
		setTimeout(function(){
			resizeMailDivHeight();
		},0);

	}
}
function resizeMailDivHeight(){
	var h=$(window).height()-190;
	var h1=$("#mail_targets").outerHeight(true);
	var h2=$("#cke_1_top").outerHeight(true);
	$("#cke_1_contents").height(h-121-h1-h2);
	//$(".mail_table td>div").height(h-80);
	$("#staffMailListDiv").height(h-150);
}
function initMailList(){
	var data = conplan_participantselect.staffModel;
	var staffMailList=$("#staffMailList");
	staffMailList.children().remove();
    jQuery.each(data, function (i, item) {
    	if(item.staff.email){
	    	var email = item.staff.email;
	    	var name=item.staff.name;
	    	if(name.length>10){
	    		name=name.substring(0,7)+"...";
	    	}
	    	var li='<li class="mail_list_item g-text-ellipsis" mail="'+email+'" title="' +name+'('+email+')" namePinyin="'+item.staff.namePinyin+';'+item.staff.namePinyinAlia+'">'+name+'('+email+')</li>';
	    	staffMailList.append(li);
    	}
    });
    staffMailList.find("li").click(function(){
    	clearSelected();
    	var li=$(this);
    	var mail=li.attr("mail");
    	var name=li.text();
    	addNewMail(name,mail)
    });
    $(document).unbind("keydown").bind("keydown",function(event){
    	if(event.keyCode==46||event.keyCode==8){
    		var found=false;
    		$("#mail_targets div").each(function(){
    			var d=$(this);
    			if(d.hasClass("mail_selected")){
    				d.prev().remove();
    				if(event.keyCode==8){
    					d.prev().addClass("mail_selected");
    					var next=d.next();
    					addMailInput(next);
    					next.click();
    				}
    				d.remove();
    				found=true;
    			}
    		});
    		if(found){
	    		event.stopPropagation();
	    		event.preventDefault();
    		}
    	}
    });
    $("#mail_targets").unbind("click").bind("click",function(){
    	var input=$("#mail_targets input");
    	if(input.length>0){
    		input.focus();
    	}
    	else{
    		addMailInput($("#mail_targets .mail_targets_margin_last"));
    	}
    });
}
function clearSelected(){
	$("#mail_targets>div").removeClass("mail_selected");
}
function addMailInput(toDiv,initTxt){
	var targetDiv=toDiv;
	var input=targetDiv.find("input");
	if(input.length>0){
		targetDiv.addClass("mail_input");
		if(initTxt){
			input.val(initTxt);
		}
		input.focus();
		
		return;
	}
	var inputStr=$('<input class="mail_inputer" type="text" maxlength="128"/>');
	if(initTxt){
		inputStr.val(initTxt);
	}
	inputStr.autocomplete({
        source:function(query,process){
            this.options.items = 1000;//$.i18n.prop('')
            var validDatas=new Array();
            var keyword=query;
            if(keyword!=""){
                $("#staffMailList li").each(function(idx,element){
                	var item=$(this);
    				var mail=item.attr("mail");
    				var text=item.html();
    				var pinyin=item.attr("namePinyin");
    				if(mail.indexOf(keyword)>=0 
    						||text.indexOf(keyword)>=0
    						||pinyin.indexOf(keyword)>=0){
    					validDatas.push({"name":text,"mail":mail});
    				}
    			});
                process(validDatas);
            }
        },
        blur: function (e) {
            this.focused = false
            if (!this.mousedover){
            	if(this.shown) 	this.hide();
            	var input=$("#mail_targets input");
            	var parent=input.parent();
        		var text=input.val().trim();
        		parent.children().remove();
        		if(text.length>0){
        			addNewMail(text,text,parent);
        		}
        		parent.removeClass("mail_input");
            }
        },
        keyup:function (e) {
            switch(e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
              break

            case 9: // tab
            case 13: // enter
            case 59:
              if (!this.shown){
            	var input=$("#mail_targets input");
              	var parent=input.parent();
              	var text=input.val().trim();
          		parent.children().remove();
          		if(text.length>0){
          			if(text.charAt(text.length-1)==';'){
          				text=text.substring(0,text.length-1).trim();
          			}
          			if(text.length>0){
          				addNewMail(text,text,parent);
          			}
          		}
          		parent.removeClass("mail_input");
          		parent.click();
            	break;
              }
              this.select();
              break;

            case 27: // escape
              if (!this.shown) return;
              this.hide();
              break;
            case 8:
            	var that = this;
            	if(that.processObj){
            		clearTimeout(that.processObj);
            		that.processObj = 0;
            	}
            	var input=$("#mail_targets input");
            	var text=input.val().trim();
            	if(text.length==0){
            		var parent=input.parent();
            		if(parent.prev().length>0){
	            		parent.children().remove();
	            		parent.removeClass("mail_input");
	            		parent.prev().addClass("mail_selected").focus();
            		}
            	}
            	else{
	            	that.processObj = setTimeout(function(){
	            		that.lookup();
	            	},that.options.delay);
	            }
            	break;
            default:
    		  var that = this;
    		  if(that.processObj){
    		    clearTimeout(that.processObj);
    			that.processObj = 0;
    		  }
    		  that.processObj = setTimeout(function(){
    			that.lookup();
    		  },that.options.delay);
          }
          e.stopPropagation();
          e.preventDefault();
        },
        formatItem:function(item){
            return item["name"];
        },
        setValue:function(item){
            return {"data-value":item["name"], "real-value":item["mail"], "title" : item["mail"]};
        },
        updater: function (item) {
        	var parent=targetDiv;
        	var selectedItem=parent.find(".typeahead.dropdown-menu").find(".active");
        	var selectedMail =selectedItem.attr("real-value");
        	var selectedText =selectedItem.find("a").text();
        	parent.children().remove();
        	addNewMail(selectedText,selectedMail,parent);
        	parent.removeClass("mail_input");
        	parent.click();
        }
    }).appendTo(targetDiv).focus();
	/*$('<input type="text" size="20"/>').blur(function(){
		var parent=$(this).parent();
		var text=$(this).val().trim();
		parent.children().remove();
		if(text.length>0){
			addNewMail(text,text,parent);
		}
		parent.removeClass("mail_input");
	}).bind('keydown',function(event){  
		if(event.keyCode == "13"){  
			var parent=$(this).parent();
			var text=$(this).val().trim();
			parent.children().remove();
			if(text.length>0){
				addNewMail(text,text,parent);
			}
			parent.removeClass("mail_input");
		}  
	}).appendTo(toDiv).focus();*/
}
function addOneNewMail(name,mail,target){
	var strDiv;
	if(target){
		strDiv='<div class="mail_targets_item" mail="'+mail+'" title="'+mail+'">'+name+';</div>';
	}
	else{
		var found=false;
		$("#mail_targets .mail_targets_item").each(function(idx,item){
			var existsMail=$(this).attr("mail");
			if(existsMail==mail){
				found=true;
			}
		});
		if(found){
			return;
		}
		strDiv='<div class="mail_targets_item from_list" mail="'+mail+'">'+name+';</div>';
	}
	var marginDiv=$('<div class="mail_targets_margin"></div>').click(function(event){
		event.stopPropagation();
		event.preventDefault();
		clearSelected();
		$(this).addClass("mail_input");
		addMailInput($(this));
		
	});
	
	var mailItem=$(strDiv);
	if(!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(mail)){
		mailItem.addClass("mail_error").attr("title",$.i18n.prop('conference.js.eadresswrong'));
	}
	mailItem.click(function(e){
		e.stopPropagation();
		e.preventDefault();
		var d=$(this);
		if(d.hasClass("mail_selected")){
			var txt=d.attr("mail");
			d.prev().remove();
			var next=d.next();
			d.remove();
			next.addClass("mail_input");
			addMailInput(next,txt);
		}
		else{
			clearSelected();
			d.addClass("mail_selected");
		}
	});	
	if(target){
		target.before(marginDiv);
		target.before(mailItem);
	}
	else{
		$("#mail_targets .mail_targets_margin_last").before(marginDiv).before(mailItem);
	}
}
function addNewMail(name,mail,target){
	if(mail.indexOf(";")>=0){
		var list=mail.split(";");
		for(var i=0;i<list.length;i++){
			var item=list[i].trim();
			if(item.length>0){
				addOneNewMail(item,item,target);
			}
		}
	}
	else{
		addOneNewMail(name,mail,target)
	}
	resizeMailDivHeight();
}
function Participant(info){
	this._id=info._id;
	this.name=info.name;
	this.username=info.username;
	this.entity=info.entity;
	this.agent=info.agent;
	this.pinyin=info.pinyin;
	this.fullPinyin=info.fullPinyin;
	this.phone=info.phone;
	this.permission=info.permission;
	this.demonstate=info.demonstate;
	this.mute=(info.mediaIngressFilter=="block");
	this.mediaIngressFilter=info.mediaIngressFilter;
	this.online=info.online;
	this.isOrganizer=this._id==conf_ctrl.confInfo.organizerId;
	this.getHtml=function(){
		var line='<tr id="p_'+this._id+'"><td width="30"><div class="avatar';
		if(this.permission=="presenter"){
			line+=' presenter';
		}
		else if(this.permission=="organizer"){
			line+=' organizer';
		}else{
			if(this._id.substring(0,4)=="out_"){
				line+=' outsider';
			}
			else{
				line+=' attendee';
			}
		}
		line+='"><img class="mute" src="../../img/conference/mute.png"';
		if(!this.mute){
			line+=' style="display:none;"';
		}
		line+='/></div></td>\n<td width="230"><div class="span-group"><span class="p_name">'+this.name+'</span><span class="p_phone">'+this.phone+'</span></div></td><td><div class="hand"';
		if(this.mediaIngressFilter!="unblocking"){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.html.AA')+'</div></td>\n<td><button class="butn btn_mute"';
		if(this.mute){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.nosound')+'</button><button class="butn btn_talk"';
		if(!this.mute){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.resound')+'</button><button class="butn btn_demon"';
		if(conf_ctrl.confInfo.profile=="default" || this.demonstate=="demonstrator"){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.setspeach')+'</button><button class="butn btn_listener"';
		if(conf_ctrl.confInfo.profile=="default" || this.demonstate !="demonstrator"){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.canclespeach')+'</button><button class="butn btn_remove"';
		if(this.isOrganizer && !conf_ctrl.confInfo.isOrganizer){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.remove')+'</button><button class="butn btn_presenter"';
		if(this.permission!="attendee" || this._id.substring(0,4)=="out_"){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.makehostpeople')+'</button><button class="butn btn_attendee"';
		if(this.permission=="attendee" || this.isOrganizer){
			line+=' style="display:none;"';
		}
		line+='>'+$.i18n.prop('conference.js.makepartition')+'</button></td><td style="vertical-align:middle;"><span class="p_agent">';
		if(this.agent){
			line+=this.agent;
		}
		line+='</span></td></tr>';
		
		return line;
	}
	this.setValue=function(input){
		var needSort=false;
		var needGroup=false;
		for(var key in input){
			if(key=="_id") continue;
			var value=input[key];
			if(this[key]!=value){
				this[key]=value;
				switch(key){
					case "name":
						$("#p_"+this._id+" .p_name").text(value);
						needSort=true;
						break;
					case "agent":
						$("#p_"+this._id+" .p_agent").text(value);
						break;
					case "pinyin":
						needSort=true;
						break;
					case "fullPinyin":
						needSort=true;
						break;
					case "phone":
						$("#p_"+this._id+" .p_phone").text(value);
						break;
					case "permission":
						needGroup=true;
						needSort=true;
						if(!this.isOrganizer&&this._id.substring(0,4)!="out_"){
							if(value!="attendee"){
								$("#p_"+this._id+" .avatar").removeClass("attendee").addClass("presenter");
								$("#p_"+this._id+" .btn_presenter").hide();
								$("#p_"+this._id+" .btn_attendee").show();
							}
							else{
								$("#p_"+this._id+" .avatar").removeClass("presenter").addClass("attendee");
								$("#p_"+this._id+" .btn_presenter").show();
								$("#p_"+this._id+" .btn_attendee").hide();
							}
						}
						break;
					case "demonstate":
						needGroup=true;
						needSort=true;
						if(conf_ctrl.confInfo.profile!="default"){
							if(value!="audience"){
								$("#p_"+this._id+" .btn_demon").hide();
								$("#p_"+this._id+" .btn_listener").show();
							}
							else{
								$("#p_"+this._id+" .btn_demon").show();
								$("#p_"+this._id+" .btn_listener").hide();
							}
						}
						else{
							$("#p_"+this._id+" .btn_demon").hide();
							$("#p_"+this._id+" .btn_listener").hide();
						}
						break;
					case "mute":
						needSort=true;
						if(value){
							$("#p_"+this._id+" .btn_mute").show();
							$("#p_"+this._id+" .btn_talk").hide();
							$("#p_"+this._id+" .mute").hide();
							//$("#p_"+this._id+" .talk").show();
						}
						else{
							$("#p_"+this._id+" .btn_mute").hide();
							$("#p_"+this._id+" .btn_talk").show();
							$("#p_"+this._id+" .mute").show();
							//$("#p_"+this._id+" .talk").hide();
						}
						break;
					case "mediaIngressFilter":
						needSort=true;
						if(value=="unblocking"){
							$("#p_"+this._id+" .hand").show();
						}
						else{
							$("#p_"+this._id+" .hand").hide();
							this.mute=(value=="block");
							if(!this.mute){
								$("#p_"+this._id+" .btn_mute").show();
								$("#p_"+this._id+" .btn_talk").hide();
								$("#p_"+this._id+" .mute").hide();
								//$("#p_"+this._id+" .talk").show();
							}
							else{
								$("#p_"+this._id+" .btn_mute").hide();
								$("#p_"+this._id+" .btn_talk").show();
								$("#p_"+this._id+" .mute").show();
								//$("#p_"+this._id+" .talk").hide();
							}
						}
						break;
					case "online":
						break;
					
				}
			}
		}
		if(needGroup || needSort){
			var targetList;
			if(this.permission!="attendee"){
				targetList="presenter_list";
			}
			else{
				targetList="attendee_list"
			}
			if(needGroup){
				$("#p_"+this._id).appendTo("#"+targetList);
			}
			if(needSort){
				conf_ctrl.participantModel.sort("presenter_list");
				conf_ctrl.participantModel.sort("attendee_list");
			}
		}
	}
}
function sendCmd(uri,param,callback){
	$.ajax({
		type: "POST",
		data:param,
		url: getContextPath()+uri,
		dataType: "json",
		success: function(result){
			if(callback){
				callback.call(this,result);
			}
			
			if(result.ret<=0){
				alertPromptMsgDlg(result.error.msg,3);
			}
			else{
				//alertPromptMsgDlg("$.i18n.prop('')！",1);
			}
			
	    },
	    error:function(req, textStatus){
	    	if(callback){
				callback.call(this,result);
			}
	    	if(req.status==401){
	    		window.location="/";
	    	}
	    	/*else{
	    		alertPromptMsgDlg(textStatus,3);
	    	}*/
	    }
	 });
}
function sendInviteMail(){
	var receiver=new Array();
	var hasErrorEmail = false;
	$("#mail_targets .mail_targets_item").each(function(idx,item){
		var email = $(item).attr("mail");
		if(!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
			hasErrorEmail = true;
			return false; //each$.i18n.prop('')return false$.i18n.prop('')
		}
		receiver.push(email);
	});
	if(hasErrorEmail) {
		alertPromptMsgDlg($.i18n.prop('conference.js.checkemailadress'), 3);
		return;
	}
	if(receiver.length==0){
		alertPromptMsgDlg($.i18n.prop('conference.js.fillreciver'), 3);
		return;
	}
	showProgress($.i18n.prop('conference.js.sending'));
	var content=CKEDITOR.instances.editor_mail_content.getData();
	var params={"receiver":receiver,"subject":conf_ctrl.confInfo.subject,"content":content};
	$.ajax({
        url: "/conferencectrl/sendInviteMail",
        type: "post",
        data: params,
        dataType: "json",
        traditional: true,
        success: function (result) {
            hideProgressBar();
            if (result.ret == 1) {
                alertPromptMsgDlg(result.message, 1);
            } else {
                alertPromptMsgDlg(result.message, 3);
            }
        },
        error:function(req, textStatus){
	    	if(req.status==401){
	    		window.location="/";
	    	}
	    }
    });
	close_mail_ui();
}