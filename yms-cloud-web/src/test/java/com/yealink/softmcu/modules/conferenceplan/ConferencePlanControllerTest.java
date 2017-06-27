package com.yealink.softmcu.modules.conferenceplan;

import java.util.Date;

import com.yealink.softmcu.modules.BaseControllerTest;
import com.yealink.softmcu.modules.account.vo.AccountView;
import com.yealink.softmcu.modules.common.constant.SessionConstant;
import com.yealink.softmcu.modules.conferenceplan.response.CreateConferencePlanResponse;
import com.yealink.softmcu.modules.conferenceplan.vo.ConferenceType;
import com.yealink.softmcu.modules.conferenceplan.vo.RecurrenceType;
import com.yealink.softmcu.utils.DateConvert;
import com.yealink.softmcu.utils.Result;
import com.yealink.uc.platform.utils.JSONConverter;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * User: CHNan
 */
public class ConferencePlanControllerTest extends BaseControllerTest {
    @Test
    public void createConferencePlanTest() throws Exception {
        Result roomResult = mockConferenceRoom();
        String conferenceRoomId = roomResult.getRows().toString();

        AccountView accountView = (AccountView) staffSession.getAttribute(SessionConstant.CURRENT_SESSION_ACCOUNT);
        Assert.assertNotNull(accountView);
        String response = mockMvc.perform(
            post("/conferencePlan/create")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON)
                .param("conferenceRoomIds",conferenceRoomId)
                .param("creatorId",accountView.getStaffId())
                .param("name","普通会议创建单元测试")
                .param("conferenceType", ConferenceType.NC.name())
                .param("conferenceDate", DateConvert.toString(new Date(),DateConvert.DATE_FORMAT_DATE))
                .param("conferenceEndDate",DateConvert.toString(new Date(),DateConvert.DATE_FORMAT_DATE))
                .param("conferenceStartTime", "23:00:00")
                .param("conferenceEndTime", "23:30:00")
                .param("timeZoneName","China_Standard_Time")
                .param("recurrenceType", RecurrenceType.RECURS_ONCE.name())
                .session(staffSession)
        ).andExpect(status().isOk()).andDo(print()).andReturn().getResponse().getContentAsString();

        Result bookResult = JSONConverter.fromJSON(Result.class,response);
        Assert.assertEquals(1, bookResult.getRet());
        System.out.println(response);
    }
    @Test
    public void createVCConferencePlanTest() throws Exception {
//        Result roomResult = mockConferenceRoom();
//        String conferenceRoomId = roomResult.getRows().toString();

        AccountView accountView = (AccountView) staffSession.getAttribute(SessionConstant.CURRENT_SESSION_ACCOUNT);
        String response = mockMvc.perform(
            post("/conferencePlan/create")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON)
                .param("creatorId",accountView.getStaffId())
                .param("name","视频会议创建单元测试")
                .param("conferenceType", ConferenceType.VC.name())
                .param("conferenceDate", DateConvert.toString(new Date(),DateConvert.DATE_FORMAT_DATE))
                .param("conferenceEndDate",DateConvert.toString(new Date(),DateConvert.DATE_FORMAT_DATE))
                .param("conferenceStartTime", "23:00:00")
                .param("conferenceEndTime", "23:50:00")
                .param("timeZoneName","China_Standard_Time")
                .param("recurrenceType", RecurrenceType.RECURS_ONCE.name())
                .session(staffSession)
        ).andExpect(status().isOk()).andDo(print()).andReturn().getResponse().getContentAsString();
        Result bookResult = JSONConverter.fromJSON(Result.class, response);
        CreateConferencePlanResponse conferencePlanResponse =
            JSONConverter.fromJSON(CreateConferencePlanResponse.class,JSONConverter.toJSON(bookResult.getRows()));
        Assert.assertEquals(1, bookResult.getRet());
        Assert.assertNotNull(conferencePlanResponse.getConferencePlan().getConferenceEntity());
        System.out.println(conferencePlanResponse.getConferencePlan().getConferenceEntity());
    }
    @Test
    public void deleteConferencePlanTest() throws Exception {
    }

}