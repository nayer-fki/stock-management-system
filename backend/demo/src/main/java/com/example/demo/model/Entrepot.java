package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "entrepots")
@Data
public class Entrepot {
    @Id
    private String id;

    private String nom;
    private String adresse;
    private Integer capacite;
}