package com._3kstbackend.controller;

import com._3kstbackend.model.ServiceModel;
import com._3kstbackend.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    // GET /api/services/available
    @GetMapping("/available")
    public ResponseEntity<List<ServiceModel>> getAvailableServices() {
        List<ServiceModel> availableServices = serviceService.getAvailableServices();
        return ResponseEntity.ok(availableServices);
    }

    // GET /api/services
    @GetMapping
    public ResponseEntity<List<ServiceModel>> getAllServices() {
        List<ServiceModel> allServices = serviceService.getAllServices();
        return ResponseEntity.ok(allServices);
    }

    // POST /api/services
    @PostMapping
    public ResponseEntity<ServiceModel> createService(@RequestBody @Valid ServiceModel serviceModel) {
        ServiceModel created = serviceService.createService(serviceModel);
        return ResponseEntity.status(201).body(created);
    }

    // PUT /api/services/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ServiceModel> updateService(@PathVariable String id, @RequestBody @Valid ServiceModel serviceModel) {
        ServiceModel updated = serviceService.updateService(id, serviceModel);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/services/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable String id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully");
    }
} 