package com.example.demo.controller;

import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Produit;
import com.example.demo.repository.ProduitRepository;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {
    @Autowired
    private ProduitRepository repository;

    @GetMapping
    public ResponseEntity<List<Produit>> getAll() {
        List<Produit> produits = repository.findAll();
        return ResponseEntity.ok(produits);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> create(
            @RequestParam("nom") String nom,
            @RequestParam("categorie") String categorie,
            @RequestParam("prix") Double prix,
            @RequestParam("fournisseur") String fournisseur,
            @RequestParam("seuilMin") Integer seuilMin,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        // Manual validation
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Product name must not be null or empty");
        }
        if (categorie == null || categorie.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category must not be null or empty");
        }
        if (prix == null || prix < 0) {
            return ResponseEntity.badRequest().body("Price must not be null and cannot be negative");
        }
        if (fournisseur == null || fournisseur.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Supplier must not be null or empty");
        }
        if (seuilMin == null || seuilMin < 0) {
            return ResponseEntity.badRequest().body("Minimum threshold must not be null and cannot be negative");
        }

        // Image size validation (e.g., max 5MB)
        if (image != null && !image.isEmpty() && image.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Image size must not exceed 5MB");
        }

        Produit produit = new Produit();
        produit.setNom(nom);
        produit.setCategorie(categorie);
        produit.setPrix(prix);
        produit.setFournisseur(fournisseur);
        produit.setSeuilMin(seuilMin);

        // Handle image
        if (image != null && !image.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                produit.setImage(base64Image);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
            }
        }

        Produit savedProduit = repository.save(produit);
        return ResponseEntity.status(201).body(savedProduit);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestParam("nom") String nom,
            @RequestParam("categorie") String categorie,
            @RequestParam("prix") Double prix,
            @RequestParam("fournisseur") String fournisseur,
            @RequestParam("seuilMin") Integer seuilMin,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        if (!repository.existsById(id)) {
            return ResponseEntity.badRequest().body("Product with ID " + id + " not found");
        }

        // Manual validation
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Product name must not be null or empty");
        }
        if (categorie == null || categorie.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category must not be null or empty");
        }
        if (prix == null || prix < 0) {
            return ResponseEntity.badRequest().body("Price must not be null and cannot be negative");
        }
        if (fournisseur == null || fournisseur.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Supplier must not be null or empty");
        }
        if (seuilMin == null || seuilMin < 0) {
            return ResponseEntity.badRequest().body("Minimum threshold must not be null and cannot be negative");
        }

        // Image size validation (e.g., max 5MB)
        if (image != null && !image.isEmpty() && image.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Image size must not exceed 5MB");
        }

        Produit produit = new Produit();
        produit.setId(id);
        produit.setNom(nom);
        produit.setCategorie(categorie);
        produit.setPrix(prix);
        produit.setFournisseur(fournisseur);
        produit.setSeuilMin(seuilMin);

        // Handle image
        if (image != null && !image.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                produit.setImage(base64Image);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
            }
        } else {
            // Retain existing image if no new image is provided
            Produit existingProduit = repository.findById(id).get(); // Safe because existsById was checked
            produit.setImage(existingProduit.getImage());
        }

        Produit updatedProduit = repository.save(produit);
        return ResponseEntity.ok(updatedProduit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.badRequest().body("Product with ID " + id + " not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<Produit>> getByName(@RequestParam String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        List<Produit> produits = repository.findByNomContainingIgnoreCase(nom);
        return ResponseEntity.ok(produits);
    }
}