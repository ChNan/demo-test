/**
 * 会议对象
 */
/*var AppointmentItem = {
	//会议主题
	Subject: "",
	//参与者
	RequiredAttendees: "",
	//会议位置
	Location: "",
	//开始时间
	Start: "",
	//结束时间
	End: "",
	//开始时间时区
	StartTimeZone: "",
	//结束时间时区
	EndTimeZone: "",
	//会议邮件内容
	Body: "",
	/!**
	 * 0无需参加的会议
	 * 1会议已安排
	 * 3会议已接收
	 * 5会议已删除
	 * 7会议接收但被删除
	 *!/
	MeetingStatus: "",
	//会议循环模式
	RecurrencePattern: RecurrencePattern
}*/

/**
 * 循环模式
 */
/*var RecurrencePattern = {
	/!**
	 * 循环类型
	 * 0 按天
	 * 1 按周
	 * 2 按月
	 * 3 按月第几周
	 * 5 按年
	 * 6 按年的第几周
	 *!/
	RecurrenceType: "",
	//开始时间，与AppointmentItem.Start一致
	StartTime: "",
	//结束时间，与AppointmentItem.End一致
	EndTime: "",
	//开始日期
	PatternStartDate: "",
	//结束日期
	PatternEndDate: "",
	//间隔
	Interval: "",
	//无结束日期，boolean
	NoEndDate: "",
	//循环次数
	Occurrences: "",
	/!**
	 * 周几
	 * 1	星期日
	 * 2	星期一
	 * 4	星期二
	 * 8	星期三
	 * 16	星期四
	 * 32	星期五
	 * 64	星期六
	 *!/
	DayOfWeekMask: "",
	//第几天（月）
	DayOfMonth: "",
	//第几月
	MonthOfYear: "",
	//第几周（周），循环类型3、5才有的属性
	Instance: ""
};*/

var outlook = {
	OUTLOOK_APP: null,
	/**
	 *
	 * @param appointmentPlan
	 * @param appId
	 * @returns {*}
	 * @constructor
	 */
	 createAppointment: function(appointmentPlan) {
		var createResult = {appointmentId: null, message: ""};
		//没有参与人
		if(!appointmentPlan.RequiredAttendees) {
			createResult.message = "没有参与者，无法创建会议邮件";
			return createResult;
		}
		try {
			outlook.OUTLOOK_APP = outlook.getOutlookApp();
			if (!outlook.OUTLOOK_APP) {
				createResult.message = "无法从浏览器调用outlook程序";
				return createResult;
			}
			var tempAppoint = outlook.OUTLOOK_APP.CreateItem(0);
			tempAppoint.display();
			var appointmentItem = outlook.OUTLOOK_APP.CreateItem(1);
			outlook.setAppointItemProperties(appointmentItem, appointmentPlan);
			appointmentItem.Save();
			appointmentItem.display();
			tempAppoint.close(1);
			createResult.appointmentId = appointmentItem.EntryID;
			return createResult;
		}
		catch(e){
			createResult.message = "创建outlook会议失败";
			console.log(e.message);
			return createResult;
		}
	},
	/**
	 *
	 * @param appointmentPlan
	 * @param appId
	 * @returns {*}
	 * @constructor
	 */
	updateAppointment: function(appointmentPlan, appId) {
		var updateRet = {success: false, message: ""};
		if(!appId) {
			updateRet.message = "没有创建outlook会议，无法编辑outlook会议";
			return updateRet;
		}
		try {
			outlook.OUTLOOK_APP = outlook.getOutlookApp();
			if (!outlook.OUTLOOK_APP) {
				updateRet.message = "无法从浏览器调用outlook程序"
				return updateRet;
			}
			var ns = outlook.OUTLOOK_APP.GetNamespace("MAPI");
			var appointmentItem = ns.GetItemFromID(appId);
			if(!appointmentItem) {
				updateRet.message = "此计算机未找到对应的outlook会议";
				return updateRet;
			}
			outlook.setAppointItemProperties(appointmentItem, appointmentPlan);
			appointmentItem.display();
			updateRet.success = true;
			return updateRet;
		}
		catch(e){
			console.log(e.message);
			updateRet.message = "编辑outlook会议失败";
			return updateRet;
		}
	},
	/**
	 * 删除outlook会议
	 * @param appId 会议id
	 * @returns {boolean} 是否删除成功
	 */
	deleteAppointment: function(appId) {
		var delRet = {success:false, message:""};
		if(!appId) {
			delRet.message = "没有创建outlook会议，无法删除outlook会议";
			return delRet;
		}
		outlook.OUTLOOK_APP = outlook.getOutlookApp();
		if (outlook.OUTLOOK_APP == null) {
			delRet.message = "无法从浏览器调用outlook程序"
			return delRet;
		}
		var ns = outlook.OUTLOOK_APP.GetNamespace("MAPI");
		var appointmentItem = ns.GetItemFromID(appId);
		if(!appointmentItem) {
			delRet.message = "此计算机未找到对应的outlook会议"
			return delRet;
		}
		appointmentItem.RequiredAttendees = "";
		appointmentItem.Body = outlook.deleteAppointmentBody(appointmentItem);
		appointmentItem.display();
		delRet.success = true;
		return delRet;
	},
	getOutlookApp: function() {
		var theApp;
		try {
			if (!!window.ActiveXObject || "ActiveXObject" in window) {
				theApp = new ActiveXObject("Outlook.Application");
			}
			else if (navigator.appName == "Netscape") {
				var olHelper = document.createElement("object");
				olHelper.setAttribute("type", "application/x-itst-activex");
				//outlook class id
				olHelper.setAttribute("clsid", "{3E4BB54C-1159-41A8-B7AE-E8F4F00635EF}");
				document.body.appendChild(olHelper);
				theApp = olHelper.OutlookApp;
			}
			else {
				console.log("对不起，您使用的浏览器暂时不能支持播放控件，请使用IE, FireFox或者Chrome。");
				return null;
			}
		}
		catch (e) {
			console.log(e.message);
			return null;
		}
		if (!theApp) {
			console.log("无法调用Outlook插件");
			return null;
		}
		return theApp;
	},
	setAppointItemProperties: function(appointmentItem, appointmentPlan) {
		if(appointmentPlan.RecurrencePatternChanged) {
			//清除循环模式
			appointmentItem.ClearRecurrencePattern();
		}
		appointmentItem.Subject = appointmentPlan.Subject;
		appointmentItem.RequiredAttendees = appointmentPlan.RequiredAttendees;
		appointmentItem.Location = appointmentPlan.Location;
        appointmentItem.Start = appointmentPlan.Start;
        appointmentItem.End = appointmentPlan.End;
		appointmentItem.StartUTC = appointmentPlan.StartUTC.Format("yyyy-MM-dd hh:mm:ss");
		appointmentItem.EndUTC = appointmentPlan.EndUTC.Format("yyyy-MM-dd hh:mm:ss");
		//根据字符串获取对应的TimeZone, ie有效
		if(appointmentPlan.StartTimeZone && (!!window.ActiveXObject || "ActiveXObject" in window )) {
			var appTimeZones = appointmentItem.Application.TimeZones;
			for(var i=1; i <= appTimeZones.Count; i++) {
				var timeZone = appTimeZones.Item(i);
				if(timeZone.ID == appointmentPlan.StartTimeZone) {
					appointmentItem.StartTimeZone = timeZone;
					appointmentItem.EndTimeZone = timeZone;
					break;
				}
			}
		}
		appointmentItem.Body = appointmentPlan.Body;
		appointmentItem.MeetingStatus = appointmentPlan.MeetingStatus;
		if(appointmentPlan.RecurrencePattern) {
			//循环模式
			var recTm = appointmentItem.GetRecurrencePattern();
			var recurrencePattern = appointmentPlan.RecurrencePattern;
			recTm.RecurrenceType = recurrencePattern.RecurrenceType;
			recTm.StartTime = recurrencePattern.StartTime;
			recTm.EndTime = recurrencePattern.EndTime;
			recTm.PatternStartDate = recurrencePattern.PatternStartDate;
			recTm.NoEndDate = recurrencePattern.NoEndDate;
			recTm.Interval = recurrencePattern.Interval;
			//有结束日期
			if (!recurrencePattern.NoEndDate) {
				if (recurrencePattern.PatternEndDate) {
					recTm.PatternEndDate = recurrencePattern.PatternEndDate;
				} else {
					recTm.Occurrences = recurrencePattern.Occurrences;
				}
			}
			if (recurrencePattern.DayOfWeekMask &&
				(recTm.RecurrenceType == 1 || recTm.RecurrenceType == 3 || recTm.RecurrenceType == 6)) {
				recTm.DayOfWeekMask = recurrencePattern.DayOfWeekMask;
			}
			if (recurrencePattern.DayOfMonth && (recTm.RecurrenceType == 2 || recTm.RecurrenceType == 5)) {
				recTm.DayOfMonth = recurrencePattern.DayOfMonth;
			}
			if (recurrencePattern.MonthOfYear && (recTm.RecurrenceType == 5 || recTm.RecurrenceType == 6)) {
				recTm.MonthOfYear = recurrencePattern.MonthOfYear;
			}
			if (recTm.Instance && recurrencePattern.RecurrenceType == 3 || recurrencePattern.RecurrenceType == 6) {
				recTm.Instance = recurrencePattern.Instance;
			}
		}
	},
	deleteAppointmentBody: function(appointmentItem) {
		var username = $("#loginStaffName").val();
		var template = "您好，真是抱歉！" +
		"\r\n\r\n    " + username + "取消了会议，请知悉！" +
		"\r\n    主题：" + appointmentItem.Subject + " 会议取消" +
		"\r\n    时间：" + new Date(appointmentItem.Start).Format("yyyy/MM/dd hh:mm") +
		"-" + new Date(appointmentItem.End).Format("hh:mm");
		return template;
	}
}