package com._3kstbackend.service;


import com._3kstbackend.model.ServiceModel;
import java.util.List;
import java.util.Optional;

public interface ServiceService{
    ServiceModel createService(ServiceModel ServiceModel);
    ServiceModel updateService(String id, ServiceModel ServiceModel);
    void deleteService(String id);
    Optional<ServiceModel> getServiceById(String id);

    List<ServiceModel> getAllServices();

    List<ServiceModel> getAvailableServices();
}