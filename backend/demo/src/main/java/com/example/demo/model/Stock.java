package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "stocks")
@Data
public class Stock {
    @Id
    private String id;

    private Integer quantite;
    private Integer seuilAlerte;
    private String produitId; // Reference to Produit
    private String entrepotId; // Reference to Entrepot
}