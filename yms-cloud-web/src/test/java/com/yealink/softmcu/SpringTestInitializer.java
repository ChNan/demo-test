//package com.yealink.softmcu;
//
//import javax.inject.Inject;
//
//import com.yealink.softmcu.platform.TrackLogFilter;
//
//import org.junit.Before;
//import org.junit.runner.RunWith;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.web.WebAppConfiguration;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.context.WebApplicationContext;
//
//@RunWith(SpringJUnit4ClassRunner.class)
//@SpringBootTest(classes = TestEnvironmentConfig.class)
//@WebAppConfiguration
//public abstract class SpringTestInitializer {
//    protected MockMvc mockMvc;
//
//    @Inject
//    private WebApplicationContext webApplicationContext;
//
//    @Before
//    public void createMockMVC() {
//        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).addFilter(new TrackLogFilter()).build();
//    }
//
//}
