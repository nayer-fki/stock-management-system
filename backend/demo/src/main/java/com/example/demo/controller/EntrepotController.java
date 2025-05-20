package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Entrepot;
import com.example.demo.repository.EntrepotRepository;

@RestController
@RequestMapping("/api/entrepots")
public class EntrepotController {
    @Autowired
    private EntrepotRepository repository;

    @GetMapping
    public ResponseEntity<List<Entrepot>> getAll() {
        List<Entrepot> entrepots = repository.findAll();
        return ResponseEntity.ok(entrepots);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Entrepot entrepot) {
        // Manual validation
        if (entrepot.getNom() == null || entrepot.getNom().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Warehouse name must not be null or empty");
        }
        if (entrepot.getAdresse() == null || entrepot.getAdresse().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Address must not be null or empty");
        }
        if (entrepot.getCapacite() == null || entrepot.getCapacite() < 0) {
            return ResponseEntity.badRequest().body("Capacity must not be null and cannot be negative");
        }

        Entrepot savedEntrepot = repository.save(entrepot);
        return ResponseEntity.status(201).body(savedEntrepot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Entrepot entrepot) {
        if (!repository.existsById(id)) {
            return ResponseEntity.badRequest().body("Warehouse with ID " + id + " not found");
        }

        // Manual validation
        if (entrepot.getNom() == null || entrepot.getNom().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Warehouse name must not be null or empty");
        }
        if (entrepot.getAdresse() == null || entrepot.getAdresse().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Address must not be null or empty");
        }
        if (entrepot.getCapacite() == null || entrepot.getCapacite() < 0) {
            return ResponseEntity.badRequest().body("Capacity must not be null and cannot be negative");
        }

        entrepot.setId(id);
        Entrepot updatedEntrepot = repository.save(entrepot);
        return ResponseEntity.ok(updatedEntrepot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.badRequest().body("Warehouse with ID " + id + " not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<Entrepot>> getByName(@RequestParam String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        List<Entrepot> entrepots = repository.findByNomContainingIgnoreCase(nom);
        return ResponseEntity.ok(entrepots);
    }
}