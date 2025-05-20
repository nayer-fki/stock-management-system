package com.example.demo.service;

  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.stereotype.Service;

  import com.example.demo.model.MouvementStock;
  import com.example.demo.model.Stock;
  import com.example.demo.repository.MouvementStockRepository;
  import com.example.demo.repository.StockRepository;

  import java.util.Optional;

  @Service
  public class StockService {
      @Autowired
      private StockRepository stockRepository;
      @Autowired
      private MouvementStockRepository mouvementRepository;

      public void addStockMovement(MouvementStock mouvement) {
          // Retrieve or create stock based on produitId and entrepotId
          Stock stock = stockRepository.findByProduitIdAndEntrepotId(mouvement.getProduitId(), mouvement.getEntrepotId())
              .orElseGet(() -> {
                  Stock newStock = new Stock();
                  newStock.setProduitId(mouvement.getProduitId());
                  newStock.setEntrepotId(mouvement.getEntrepotId());
                  newStock.setQuantite(0); // Default to 0 if new
                  newStock.setSeuilAlerte(0); // Default to 0 if new
                  return newStock;
              });

          // Handle movement type
          Integer currentQuantity = stock.getQuantite() != null ? stock.getQuantite() : 0;
          Integer movementQuantity = mouvement.getQuantite() != null ? mouvement.getQuantite() : 0;
          Integer threshold = stock.getSeuilAlerte() != null ? stock.getSeuilAlerte() : 0;

          if ("ENTREE".equalsIgnoreCase(mouvement.getType())) {
              stock.setQuantite(currentQuantity + movementQuantity);
          } else if ("SORTIE".equalsIgnoreCase(mouvement.getType())) {
              if (currentQuantity - movementQuantity < 0) {
                  throw new IllegalStateException("Insufficient stock for product ID: " + mouvement.getProduitId());
              }
              stock.setQuantite(currentQuantity - movementQuantity);
          }

          // Check for low stock alert
          if (stock.getQuantite() != null && threshold > 0 && stock.getQuantite() < threshold) {
              System.out.println("Alert: Low stock for product ID: " + stock.getProduitId());
          }

          // Save changes
          stockRepository.save(stock);
          mouvementRepository.save(mouvement);
      }
  }