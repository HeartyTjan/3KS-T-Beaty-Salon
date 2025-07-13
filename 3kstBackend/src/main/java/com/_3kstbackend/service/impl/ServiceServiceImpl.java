package com._3kstbackend.service.impl;

import com._3kstbackend.model.ServiceModel;
import com._3kstbackend.repository.ServiceRepository;
import com._3kstbackend.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceServiceImpl implements ServiceService {
    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public ServiceModel createService(ServiceModel service) {
        service.setId(null);
        service.setCreatedAt(LocalDateTime.now());
        service.setUpdatedAt(LocalDateTime.now());
        return serviceRepository.save(service);
    }

    @Override
    public ServiceModel updateService(String id, ServiceModel service) {
        Optional<ServiceModel> existing = serviceRepository.findById(id);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Service not found");
        }
        ServiceModel existingService = existing.get();
        service.setId(id);
        service.setCreatedAt(existingService.getCreatedAt());
        service.setUpdatedAt(LocalDateTime.now());
        // Only overwrite imageUrl if provided
        if (service.getImageUrl() == null || service.getImageUrl().trim().isEmpty()) {
            service.setImageUrl(existingService.getImageUrl());
        }
        return serviceRepository.save(service);
    }

    @Override
    public void deleteService(String id) {
        serviceRepository.deleteById(id);
    }

    @Override
    public Optional<ServiceModel> getServiceById(String id) {
        return serviceRepository.findById(id);
    }

    @Override
    public List<ServiceModel> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public List<ServiceModel> getAvailableServices() {
        return serviceRepository.findByActiveTrue();
    }
}