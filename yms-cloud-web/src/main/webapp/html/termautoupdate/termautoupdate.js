var termautoupdate = {
	MAIN_TABLE_COLUMNS:[{
				checkbox:true
			},{
		        field: 'fileName',
		        title: $.i18n.prop('termautoupdate.js.filename')
		    }, {
		        field: 'version',
		        title: $.i18n.prop('termautoupdate.js.Firmwareversionnumber')
		    }, {
		        field: 'model',
		        title: $.i18n.prop('termautoupdate.js.Devicemodel')
		    },{
		        field: 'uploadTime',
		        title: $.i18n.prop('termautoupdate.js.uploadtime'),
		        formatter:function(value,row,index){
					if (value) {
						return value.replace(/-/g, '/');
					}
				}
		    },{
		        field: '1',
		        title: $.i18n.prop('termautoupdate.js.latestversion'),
		        formatter:function(value,row,index){
					return '<input type="checkbox" data-rid="'+row._id+'" '+(row.latest?'checked':'')+' class="checkbox-switch"/>';
		        }
		    }, {
		        field: '2',
		        title: $.i18n.prop('termautoupdate.js.op'),
		        formatter:function(value,row,index){
		        	return (row.latest?'<button class="m-tau-table-update m-btn-upd" title="'+$.i18n.prop('termautoupdate.js.up')+'" ></button>':'<button class="m-tau-table-edit m-btn-edit" title="'+$.i18n.prop('termautoupdate.js.ed')+'" ></button>&nbsp;<button class="m-tau-table-del m-btn-sgdel margin-left15" title="'+$.i18n.prop('termautoupdate.js.del')+'" ></button>');
		        },
				events:{
					'click button':function(e, value, row, index){
						if($(this).hasClass('m-tau-table-edit')){
							termautoupdate.openEditModal(row);
						}else if($(this).hasClass('m-tau-table-update')){
							termautoupdate.update(row._id);
						}else if($(this).hasClass('m-tau-table-del')){
							termautoupdate.remove(row._id);
						}
					}
				}
		    }],
	queryParam:function(params){
		//$.i18n.prop('')
		//$.i18n.prop('')params$.i18n.prop('')，$.i18n.prop('')
		return params;
	},
	init:function(){
		termautoupdate.initTable();

		$('.m-tau [name="autoUpdate"]').off('change').on('change',function(){
			var _this = this;
			if($(_this).prop('checked')){
				$('.m-tau .m-tau-addbtn').off('click').on('click',function(){
					termautoupdate.openAddModal();
				})
				$('.m-tau .m-tau-delbtn').off('click').on('click',function(){
					termautoupdate.remove();
				})
				$('.m-tau .cover-div').hide()
			}else{
				$('.m-tau .cover-div').show();
				$('.m-tau .m-tau-delbtn').off('click');
				$('.m-tau .m-tau-addbtn').off('click');
			}
			$(_this).prop('disabled',true);
			$.post('termautoupdate/setauto', {auto: $(this).prop('checked')}, function (result) {
				$(_this).prop('disabled',false);
				if(result.ret >= 0){
					//if($(_this).prop('checked')==true)
						//alertPromptMsgDlg($.i18n.prop('termautoupdate.js.Enabledeviceupgrades'),1);
					//else
						//alertPromptMsgDlg($.i18n.prop('termautoupdate.js.unabledeviceupgrades'),1);
				}
			});

		})


		$.post('termautoupdate/pre', {type: 'tt'}, function (result) {
			if (result && result.ret >= 0) {
				if(result.rows.data.autoUpdate){
					$('.m-tau [name="autoUpdate"]').prop('checked',true);
					$('.m-tau .m-tau-addbtn').off('click').on('click',function(){
						termautoupdate.openAddModal();
					})
					$('.m-tau .m-tau-delbtn').off('click').on('click',function(){
						termautoupdate.remove();
					})
					$('.m-tau .cover-div').hide()
				}else{
					$('.m-tau .cover-div').show();
					$('.m-tau .m-tau-delbtn').off('click');
					$('.m-tau .m-tau-addbtn').off('click');
				}
			} else {
				alertPromptMsgDlg($.i18n.prop('termautoupdate.js.loadfailto'),3);
			}
		});

	},
	initTable:function(){
		var _this = this;
		var selpageSize = getTablePageSizeForBS('m-tau-table');
		$('#m-tau-table').bootstrapTable({
			striped:true,
			pagination:true,
			url: 'termautoupdate/query',
			method: 'post',
			sidePagination: "server",      //$.i18n.prop('')client$.i18n.prop('')，server$.i18n.prop('')（*）
			pageNumber:1,            //$.i18n.prop('')，$.i18n.prop('')
			pageSize: selpageSize,            //$.i18n.prop('')（*）
			pageList: [10, 20, 50, 100],    //$.i18n.prop('')（*）
			columns: _this.MAIN_TABLE_COLUMNS,
			locale:getLan(),
			onLoadSuccess:function(data){
				//$.i18n.prop('')
				$('.checkbox-switch').each(function(){
					var rowId = $(this).data('rid');
					new Switch(this, {size: 'small',onChange:function(){
						termautoupdate.setLatestVer(rowId);
					}})
				})
			}
		});
	},
	openAddModal:function(){
		$('#m-tau-add .m-commit').off('click').on('click',function(){
			termautoupdate.submit('m-tau-add')
		})

		$('#importFileName').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
		$('#addFile').off('change').on('change',function(){
			if($(this).val()){
				$('#importFileName').text($(this).val())
			}else{
				$('#importFileName').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
			}
		});
		$('#browseBtn').off('click').on('click', function () {
			$('#addFile').trigger('click');
		});

		formutil.clearForm('m-tau-addform');
		$('#m-tau-add').modal({
			show:true
		});
		termautoupdate.clearCheckInfo('m-tau-add');
	},
	setLatestVer:function(id){
		$.post('termautoupdate/setlatest',{id:id},function(result){
			if(result.ret >= 0 ){
				$('#m-tau-table').bootstrapTable('refresh');
			}else{
				alertPromptMsgDlg($.i18n.prop('termautoupdate.js.setfail'),3);
			}
		},'json')
	},
	openEditModal:function(row){
		formutil.clearForm('m-tau-updateform');
		$('#m-tau-update .m-commit').off('click').on('click',function(){
			termautoupdate.submit('m-tau-update',row._id)
		})

		$('#m-tau-update [name="_id"]').val(row._id);

		$('#m-tau-update').modal({
			show:true
		});

		$('#importFileNameUpd').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))


		$('#updateFile').off('change').on('change',function(){
			if($(this).val()){
				$('#importFileNameUpd').text($(this).val())
			}else{
				$('#importFileNameUpd').text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
			}
		});
		$('#browseBtnUpd').off('click').on('click', function () {
			$('#updateFile').trigger('click');
		});


		termautoupdate.clearCheckInfo('m-tau-update');
	},
	update:function(id){

		alertConfirmationMsgDlgDetail($.i18n.prop('termautoupdate.js.hint'),$.i18n.prop('termautoupdate.js.makesureupdate'),$.i18n.prop('termautoupdate.js.sure'), function () {
			$.post('termautoupdate/update',{id:id},function(result){
				if(result.ret >= 0 ){
					alertPromptMsgDlg(result.message,1);
				}else{
					alertPromptMsgDlg($.i18n.prop('termautoupdate.js.deletefail'),3);
				}
			},'json')
		})
	},
	remove:function(ids){
		if(!ids || ids == ''){
			var rows = $('#m-tau-table').bootstrapTable('getAllSelections');
			if(rows.length == 0 ){
				alertPromptMsgDlg($.i18n.prop('termautoupdate.js.theinformationtobedeleted'),2);
				return;
			}
			//$.i18n.prop('')
			var ids = '';
			var flag = false;
			$.each(rows,function(){
				ids += ',' + this._id;
				if(this.latest){
					flag = true;
				}
			})
			ids = ids.substring(1);
			if(flag){
				alertPromptMsgDlg($.i18n.prop('termautoupdate.js.latestnotdelete'),2);
				return;
			}
		}

		alertConfirmationMsgDlgDetail($.i18n.prop('termautoupdate.js.hint'),$.i18n.prop('termautoupdate.js.suretodelete'),$.i18n.prop('termautoupdate.js.sure'), function () {
			$.post('termautoupdate/delete',{ids:ids},function(result){
				if(result.ret >= 0 ){
					alertPromptMsgDlg(result.message,1,function(){
						$('#m-tau-table').bootstrapTable('refresh');
					});
				}else{
					alertPromptMsgDlg($.i18n.prop('termautoupdate.js.deletefail'),3);
				}
			},'json')
		})

	},
	submit:function(modalId,_id){
		termautoupdate.clearCheckInfo(modalId);

		var url;
		var fileName = $("#"+modalId+" [name='firmwareFile']").val()
		if(fileName == ''){
			$("#"+modalId+" .error-msg").html('<span class="help-block" style="color:#FF0000;position: absolute;top: -30px;">'+$.i18n.prop("termautoupdate.js.notempty")+'</span>');
			return ;
		}else{
			var suf = fileName.substr(fileName.lastIndexOf(".")+1);
			if(suf != "rom"){
				$("#"+modalId+" .error-msg").html('<span class="help-block" style="color:#FF0000;position: absolute;top: -30px;">'+$.i18n.prop("termautoupdate.js.onlyromfile")+'</span>');
				return;
			}
		}
		//$.i18n.prop('')ID$.i18n.prop('')，$.i18n.prop('')
		if(_id){
			url = 'termautoupdate/'+_id+'/edit'
		}else{
			url = 'termautoupdate/add'
		}
		var fileId = $("#"+modalId+" [name='firmwareFile']").attr('id');
		this.ajaxFileUpload(modalId,url,fileId);
	},
	ajaxFileUpload:function(modalId,url,id){
		$.ajaxFileUpload({
			url: url,
			type: 'post',
			secureuri: false, //$.i18n.prop('')false
			fileElementId: id, // $.i18n.prop('')id、name$.i18n.prop('')
			dataType: 'application/json', //$.i18n.prop('')，$.i18n.prop('')json、application/json
			success: function(data, status){
				var res =  JSON.parse($(data).text());
				if(res.ret >= 0){
					$('#m-tau-table').bootstrapTable('refresh');

					// 设置最新
					var id = res.rows;
					termautoupdate.setLatestVer(id);

					$('#' + modalId ).modal('hide');
				}else{
					alertPromptMsgDlg(res.message,3,function(){

						//重新绑定change
						var importFileNameId = "importFileName";
						var importFileId = "addFile";
						if (modalId == 'm-tau-update') {
							importFileNameId = 'importFileNameUpd';
							importFileId = 'updateFile';
						}
						$('#'+importFileId).off('change').on('change',function(){
							if($(this).val()){
								$('#'+importFileNameId).text($(this).val())
							}else{
								$('#'+importFileNameId).text($.i18n.prop("staffaccountmanage.js.upload.select.file"))
							}
						});
						$('#'+importFileNameId).text($.i18n.prop("staffaccountmanage.js.upload.select.file"));

						// 清空
						termautoupdate.clearCheckInfo(modalId);
					});
				}
			}
		});
	},
	checkUpFile:function(upObj){
		// $.i18n.prop('')
		$(upObj).closest('div').removeClass('has-error');
		$(upObj).closest('div').find('span').remove();
	},
	clearCheckInfo:function(modalId) {
		//$("#"+modalId+" [name='firmwareFile']").closest('div').find('span').remove();
		$("#"+modalId+" .error-msg").html('')
	}
}