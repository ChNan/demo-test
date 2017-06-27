package com.yealink.softmcu.modules;

import javax.servlet.http.HttpSession;

import com.yealink.softmcu.SpringTestInitializer;
import com.yealink.softmcu.modules.conferenceroom.vo.ConferenceRoomType;
import com.yealink.softmcu.modules.staff.response.FindStaffDetailResponse;
import com.yealink.softmcu.modules.staff.service.DeleteStaffService;
import com.yealink.softmcu.utils.Result;
import com.yealink.uc.platform.crypto.DES;
import com.yealink.uc.platform.utils.JSONConverter;
import com.yealink.uc.platform.utils.StringUtil;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * @author ChNan
 */
public class BaseControllerTest extends SpringTestInitializer {
    public MockHttpSession adminSession;
    public MockHttpSession staffSession;

    @Autowired
    DeleteStaffService deleteStaffService;
    @Before
    public void init() {
        //fixme 企业创建也从用户中心走
        //删除企业下面的所有人员信息，保证账号名称不会重复
        deleteStaffService.deleteAll("73f22343617a455393e8a01a87636f44");

        this.adminSession = (MockHttpSession) mockAdminLogin();
        this.staffSession =(MockHttpSession) mockStaffLogin();
    }
    @Test
    public void empty(){

    }
    /**
     * 获取登入信息session
     * @return
     * @throws Exception
     */
    public HttpSession mockAdminLogin() {
        // mock request get login session
        // url = /xxx/xxx/{username}/{password}
        try {
            MvcResult result = this.mockMvc
                .perform((get("/loginTest")))
                .andExpect(status().isOk())
                .andReturn();
            return result.getRequest().getSession();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public HttpSession mockStaffLogin() {
        try {
            FindStaffDetailResponse staffDetailResponse = mockStaff();
            String desKey = StringUtil.generateUUID();
            Assert.assertNotNull(staffDetailResponse);
            MvcResult loginResult = mockMvc.perform(
                post("/login")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON)
                    .param("username", staffDetailResponse.getSipAccount().getUsername())
                    .param("password", DES.encryptBase64(staffDetailResponse.getSipAccount().getPassword(),desKey))
                    .param("des3Key", desKey)
            ).andExpect(status().isOk()).andDo(print()).andReturn();
            return loginResult.getRequest().getSession();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Result mockConferenceRoom() throws Exception {
        String response = mockMvc.perform(
            post("/conferenceRoom/create")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .param("name", "会议室创建单元测试"+System.currentTimeMillis())
                .param("type", ConferenceRoomType.NORMAL_ROOM.getCode())
                .session(adminSession)
        ).andExpect(status().isOk())
            .andDo(print())
            .andReturn()
            .getResponse()
            .getContentAsString();

        return JSONConverter.fromJSON(Result.class, response);
    }


    public FindStaffDetailResponse mockStaff() throws Exception {
        String response = mockMvc.perform(
            post("/staff/create")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON)
                .param("name", "用户创建测试"+System.currentTimeMillis())
                .param("username", StringUtil.getRandomNumberString("1000",4))
                .param("mail", "fangwq@yealink.com")
                .session(adminSession)
        ).andExpect(status().isOk()).andDo(print()).andReturn().getResponse().getContentAsString();

        return JSONConverter.fromJSON(FindStaffDetailResponse.class,JSONConverter.toJSON(JSONConverter.fromJSON(Result.class, response).getRows()));

    }

}
