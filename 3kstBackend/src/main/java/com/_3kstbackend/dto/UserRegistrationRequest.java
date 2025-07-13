package com._3kstbackend.dto;

import lombok.Data;

@Data
public class UserRegistrationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private String country;
    private String city;
    private String avatarId;
}

