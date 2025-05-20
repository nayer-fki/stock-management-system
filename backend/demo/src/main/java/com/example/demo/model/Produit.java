package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "produits")
@Data
public class Produit {
    @Id
    private String id;
    private String nom;
    private String categorie;
    private Double prix;
    private String fournisseur;
    private Integer seuilMin;
    private String image; // Base64-encoded image string
}