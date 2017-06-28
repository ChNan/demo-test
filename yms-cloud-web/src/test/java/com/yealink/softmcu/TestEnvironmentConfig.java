//package com.yealink.softmcu;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
//import org.springframework.core.io.ClassPathResource;
//
///**
// * @author neo
// */
//public class TestEnvironmentConfig extends Application {
//    @Bean
//    public static PropertySourcesPlaceholderConfigurer propertyLoaderTest() {
//        PropertySourcesPlaceholderConfigurer placeholderConfigurer = new PropertySourcesPlaceholderConfigurer();
//        placeholderConfigurer.setLocations(
//            new ClassPathResource("/config/test/client.properties"),
//            new ClassPathResource("/config/test/logger.properties"),
//            new ClassPathResource("/config/application.properties"),
//            new ClassPathResource("/config/service.properties"),
//            new ClassPathResource("/config/test/system.properties"));
//        return placeholderConfigurer;
//    }
//}