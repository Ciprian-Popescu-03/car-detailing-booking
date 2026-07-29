package com.ciprian.detailing.repository;

import com.ciprian.detailing.entity.BusinessHours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessHoursRepository extends JpaRepository<BusinessHours, Long> {

    Optional<BusinessHours> findByDayOfWeek(Integer dayOfWeek);
}
