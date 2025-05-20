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

import com.example.demo.model.Utilisateur;
import com.example.demo.repository.UtilisateurRepository;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
    @Autowired
    private UtilisateurRepository repository;

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAll() {
        List<Utilisateur> utilisateurs = repository.findAll();
        return ResponseEntity.ok(utilisateurs);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> create(
            @RequestParam("nom") String nom,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        // Manual validation
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name must not be null or empty");
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email must not be null or empty");
        }
        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role must not be null or empty");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(nom);
        utilisateur.setEmail(email);
        utilisateur.setRole(role);

        // Handle image
        if (image != null && !image.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                utilisateur.setImage(base64Image);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
            }
        }

        Utilisateur savedUtilisateur = repository.save(utilisateur);
        return ResponseEntity.status(201).body(savedUtilisateur);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> update(
            @PathVariable String id,
            @RequestParam("nom") String nom,
            @RequestParam("email") String email,
            @RequestParam("role") String role,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        if (!repository.existsById(id)) {
            return ResponseEntity.badRequest().body("Utilisateur with ID " + id + " not found");
        }

        // Manual validation
        if (nom == null || nom.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name must not be null or empty");
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email must not be null or empty");
        }
        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role must not be null or empty");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(id);
        utilisateur.setNom(nom);
        utilisateur.setEmail(email);
        utilisateur.setRole(role);

        // Handle image
        if (image != null && !image.isEmpty()) {
            try {
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                utilisateur.setImage(base64Image);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
            }
        } else {
            // Retain existing image if no new image is provided
            Utilisateur existingUtilisateur = repository.findById(id).orElseThrow();
            utilisateur.setImage(existingUtilisateur.getImage());
        }

        Utilisateur updatedUtilisateur = repository.save(utilisateur);
        return ResponseEntity.ok(updatedUtilisateur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.badRequest().body("Utilisateur with ID " + id + " not found");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}