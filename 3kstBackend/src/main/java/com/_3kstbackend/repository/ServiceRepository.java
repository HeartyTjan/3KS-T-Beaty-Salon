package com._3kstbackend.repository;

import com._3kstbackend.model.ServiceModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ServiceRepository extends MongoRepository<ServiceModel, String> {
    List<ServiceModel> findByActiveTrue();
} 