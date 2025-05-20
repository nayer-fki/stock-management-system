package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Stock;

public interface StockRepository extends MongoRepository<Stock, String> {
    Optional<Stock> findByProduitIdAndEntrepotId(String produitId, String entrepotId);
}