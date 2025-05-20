package com.example.demo.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "mouvements")
@Data
public class MouvementStock {
    @Id
    private String id;

    private String produitId;
    private String type; // ENTREE or SORTIE
    private Integer quantite;
    private LocalDateTime date;
    private String entrepotId;
}