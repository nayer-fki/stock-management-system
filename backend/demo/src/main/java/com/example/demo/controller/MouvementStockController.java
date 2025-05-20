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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.MouvementStock;
import com.example.demo.repository.MouvementStockRepository;

  @RestController
  @RequestMapping("/api/mouvements")
  public class MouvementStockController {
      @Autowired
      private MouvementStockRepository repository;

      @GetMapping
      public ResponseEntity<List<MouvementStock>> getAll() {
          List<MouvementStock> mouvements = repository.findAll();
          return ResponseEntity.ok(mouvements);
      }

      @PostMapping
      public ResponseEntity<MouvementStock> create(@RequestBody MouvementStock mouvement) {
          MouvementStock savedMouvement = repository.save(mouvement);
          return ResponseEntity.status(201).body(savedMouvement);
      }

      @PutMapping("/{id}")
      public ResponseEntity<MouvementStock> update(@PathVariable String id, @RequestBody MouvementStock mouvement) {
          mouvement.setId(id);
          MouvementStock updatedMouvement = repository.save(mouvement);
          return ResponseEntity.ok(updatedMouvement);
      }

      @DeleteMapping("/{id}")
      public ResponseEntity<Void> delete(@PathVariable String id) {
          repository.deleteById(id);
          return ResponseEntity.noContent().build();
      }
  }