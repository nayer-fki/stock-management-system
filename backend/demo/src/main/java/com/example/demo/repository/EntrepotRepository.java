package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Entrepot;

public interface EntrepotRepository extends MongoRepository<Entrepot, String> {
    List<Entrepot> findByNomContainingIgnoreCase(String nom);
}