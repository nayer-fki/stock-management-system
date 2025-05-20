package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "utilisateurs")
@Data
public class Utilisateur {
    @Id
    private String id;
    private String nom;
    private String email;
    private String role;
    private String image; // Base64-encoded image string
}