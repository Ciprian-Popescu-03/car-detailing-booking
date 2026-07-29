package com.ciprian.detailing.repository;

import com.ciprian.detailing.entity.DetailingService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailingServiceRepository extends JpaRepository<DetailingService, Long> {

    List<DetailingService> findByActiveTrueOrderByPriceAsc();
}
