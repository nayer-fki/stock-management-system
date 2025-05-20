package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Produit;

public interface ProduitRepository extends MongoRepository<Produit, String> {
    List<Produit> findByNomContainingIgnoreCase(String nom);
}