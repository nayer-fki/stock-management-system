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
import com.example.demo.model.Stock;
import com.example.demo.repository.StockRepository;
import com.example.demo.service.StockService;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    @Autowired
    private StockRepository repository;
    @Autowired
    private StockService stockService;

    @GetMapping
    public ResponseEntity<List<Stock>> getAll() {
        List<Stock> stocks = repository.findAll();
        return ResponseEntity.ok(stocks);
    }

    @PostMapping
    public ResponseEntity<Stock> create(@RequestBody Stock stock) {
        Stock savedStock = repository.save(stock);
        return ResponseEntity.status(201).body(savedStock);
    }

    @PostMapping("/movement")
    public ResponseEntity<Void> addMovement(@RequestBody MouvementStock mouvement) {
        stockService.addStockMovement(mouvement);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> update(@PathVariable String id, @RequestBody Stock stock) {
        stock.setId(id);
        Stock updatedStock = repository.save(stock);
        return ResponseEntity.ok(updatedStock);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}