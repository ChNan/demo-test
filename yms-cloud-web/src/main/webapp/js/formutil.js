// 一个简单的验证提交表单工具类
var formutil = $.extend(true,{
	defaultOpt:{
		result:false,
		autoCommit:false,
		formdata:{},
		errormsg:[]
	},//默认参数对象
	currentOpt:{},//一个空对象，用来存放临时参数
	//main方法
	// {
	// 	formId:formId,
	// 	autoCommit:false,
	// 	nodes:[{
	// 		name:'mn',
	// 		method:'require,number'
	// 	},{
	// 		name:'valid',
	// 		method:'number'
	// 	}],
	// 	succ:function(){
	// 		$('#m-mm-add').modal('hide');
	// 	}
	// }
	submitForm:function(opt){
		if(opt && opt.formId){
			//参数的初始化
			this.currentOpt = $.extend({},this.defaultOpt,opt);
			//先清空错误提示信息
			this.clearErrorMsg(this.currentOpt.formId);
			//然后进行验证
			this.currentOpt.result =  this.valid(this.currentOpt);
			//获取数据
			this.currentOpt.formdata =  this.getFormData(this.currentOpt.formId);
			//如果验证通过 && 需要自动提交
			if(this.currentOpt.result 
				&& this.currentOpt.autoCommit){
				// 提交结果
				// 异步的结果无法返回，就调用succ方法
				this.commit(this.currentOpt);
			}else{
				// 不需要自动提交的时候返回数据
				return this.currentOpt;
			}
		}else{
			return {
				result:false,
				msg:'参数为空!'
			};
		}
	},
	//验证，可以单独调用，返回true or false
	//	{
	// 		formId:formId,
	// 		nodes:[{
	// 			name:'mn',
	// 			method:'require,number'
	// 		},{
	// 			name:'valid',
	// 			method:'number'
	// 		}]
	// 	}
	valid:function(opt){
		if(opt && opt.formId){
			var _this = this;
			var ckf = true;
			var nodes = opt.nodes;
			if(nodes){
				for(var i in nodes){
					var nodeObj = $('#' + opt.formId).find('[name="'+nodes[i].name+'"]');
					var methods = nodes[i].method;
					if(methods){
						var tt =  methods.split(',');
						$.each(tt,function(i,val){
							var tmp = formutil.method.check(val,nodeObj);
							//一个验证器没过，就可以进入下一个节点了
							if(!tmp){
								ckf = false;
								return false;
							}
						})
					}
				}
			}
			return ckf;
		}else{
			return false;
		}
	},
	//获取form表单里头的数据
	getFormData:function(formId){
		var oo = {}
		$.each($('#' + formId).serializeArray(),function(idx, item){
			oo[item.name] = item.value;
		})
		return oo;
	},
	commit:function(opt){
		opt.succ();
	},
	//公共的验证错误方法
	defaultErrorFmter:function(node,msg){
		var parnode = node.parents('.form-group').eq(0);
		parnode.addClass('has-error');
		parnode.find('.m-error-message').text(formutil.message.getMsg(msg));
	},
	//清除错误提示信息的方法
	clearErrorMsg:function(formId){
		var formObj = $('#' + formId);
		formObj.find('.form-group').each(function(){
			$(this).removeClass('has-error');
			$(this).find('.m-error-message').text('');
		})
	},
	//清除错误提示信息的方法
	clearText:function(formId){
		formutil.clearErrorMsg(formId);
		$('#' + formId).find('input[type="text"],textarea').val('');
	},
	//清除表单数据，错误提示信息
	clearForm:function(formIds){
		var forms = formIds.split(',');
		$.each(forms,function(idx,val){
			formutil.clearErrorMsg(val)
			$('#' + val).find('input,textarea').val('');
		})
	},

	//方法，与方法对应的提示信息，可以单独获取。
	method:{
		check:function(methodName,node){
			if(methodName in formutil.method){
				var res = formutil.method[methodName](node);
				if(!res){
					formutil.defaultErrorFmter(node,methodName)
				}
				return res;
			}else{
				console.log('验证方法['+methodName+']不存在!');
				return false;
			}
		}
	},
	//提示信息
	message:{
		getMsg:function(msg){
			if(msg in formutil.message){
				return formutil.message[msg];
			}else{
				return '提示信息['+msg+']不存在'
			}
		}
	}
},validate);