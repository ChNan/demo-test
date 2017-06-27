package com.yealink.softmcu.modules.conferenceroom;


import com.yealink.softmcu.modules.BaseControllerTest;
import com.yealink.softmcu.modules.conferenceroom.vo.ConferenceRoomType;
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
public class ConferenceRoomControllerTest extends BaseControllerTest {
    @Test
    public void createConferenceRoomTest() throws Exception {
        Result result = mockConferenceRoom();
        Assert.assertEquals(1, result.getRet());
    }

    @Test
    public void editConferenceRoomTest() throws Exception {
        Result result = mockConferenceRoom();
        String conferenceRoomId = result.getRows().toString();
        String response = mockMvc.perform(
            post("/conferenceRoom/edit")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .param("conferenceRoomId", conferenceRoomId)
                .param("name", "会议室编辑单元测试"+System.currentTimeMillis())
                .param("type", ConferenceRoomType.NORMAL_ROOM.getCode())
                .session(adminSession)
        ).andExpect(status().isOk())
            .andDo(print())
            .andReturn()
            .getResponse()
            .getContentAsString();

        Result editResult =  JSONConverter.fromJSON(Result.class, response);
        Assert.assertEquals(1, editResult.getRet());
    }

    @Test
    public void deleteConferenceRoomTest() throws Exception {

        Result result = mockConferenceRoom();
        String conferenceRoomId = result.getRows().toString();
        String response = mockMvc.perform(
            post("/conferenceRoom/delete")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .param("conferenceRoomIds", conferenceRoomId)
                .session(adminSession)
        ).andExpect(status().isOk())
            .andDo(print())
            .andReturn()
            .getResponse()
            .getContentAsString();

        Result deleteResult =  JSONConverter.fromJSON(Result.class, response);
        Assert.assertEquals(1, deleteResult.getRet());
    }

    //fixme 1:测试普通会议没有关联账号
    //fixme 2:测试视频会议有关联账号
}