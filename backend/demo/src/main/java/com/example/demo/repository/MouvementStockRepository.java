package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.MouvementStock;

public interface MouvementStockRepository extends MongoRepository<MouvementStock, String> {
}