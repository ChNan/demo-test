package com.yealink.softmcu.modules.staff;


import com.yealink.softmcu.modules.BaseControllerTest;
import com.yealink.softmcu.modules.staff.response.FindStaffDetailResponse;

import org.junit.Assert;
import org.junit.Test;

/**
 * User: CHNan
 */
public class StaffControllerTest extends BaseControllerTest {
    @Test
    public void createStaffTest() throws Exception {
        FindStaffDetailResponse staffDetailResponse = mockStaff();
        Assert.assertNotNull(staffDetailResponse);
        Assert.assertNotNull(staffDetailResponse.getStaff());
        Assert.assertNotNull(staffDetailResponse.getStaff().get_id());
    }
}