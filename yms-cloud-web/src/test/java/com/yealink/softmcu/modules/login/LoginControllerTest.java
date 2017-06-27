package com.yealink.softmcu.modules.login;


import com.yealink.softmcu.modules.BaseControllerTest;
import com.yealink.softmcu.modules.staff.response.FindStaffDetailResponse;
import com.yealink.softmcu.utils.Result;
import com.yealink.softmcu.utils.SecurityUtil;
import com.yealink.uc.platform.crypto.DES;
import com.yealink.uc.platform.utils.JSONConverter;
import com.yealink.uc.platform.utils.StringUtil;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * User: CHNan
 */
public class LoginControllerTest extends BaseControllerTest {
    @Test
    public void loginPasswordErrorTest() throws Exception {
        FindStaffDetailResponse staffDetailResponse = mockStaff();
        Assert.assertNotNull(staffDetailResponse);
        String desKey = StringUtil.generateUUID();
        String response = mockMvc.perform(
            post("/login")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON)
                .param("username",staffDetailResponse.getSipAccount().getUsername())
                .param("password", SecurityUtil.encryptMd5("errorpwd"))
                .param("des3Key", desKey)
        ).andExpect(status().isOk()).andDo(print()).andReturn().getResponse().getContentAsString();

        Result loginErrorResult = JSONConverter.fromJSON(Result.class,response);
        Assert.assertEquals(-1, loginErrorResult.getRet());
        System.out.println(response);
    }

    @Test
    public void loginPasswordCorrectTest() throws Exception {
        FindStaffDetailResponse staffDetailResponse = mockStaff();
        String desKey = StringUtil.generateUUID();
        Assert.assertNotNull(staffDetailResponse);
        String response = mockMvc.perform(
            post("/login")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON)
                .param("username", staffDetailResponse.getSipAccount().getUsername())
                .param("password", DES.encryptBase64(staffDetailResponse.getSipAccount().getPassword(),desKey))
                .param("des3Key", desKey)
        ).andExpect(status().isOk()).andDo(print()).andReturn().getResponse().getContentAsString();

        Result loginErrorResult = JSONConverter.fromJSON(Result.class,response);
        Assert.assertEquals(1, loginErrorResult.getRet());
    }
}