package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Utilisateur;

public interface UtilisateurRepository extends MongoRepository<Utilisateur, String> {
}