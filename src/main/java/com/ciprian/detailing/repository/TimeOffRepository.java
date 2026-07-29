package com.ciprian.detailing.repository;

import com.ciprian.detailing.entity.TimeOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {

    @Query("SELECT t FROM TimeOff t WHERE t.startDatetime < :end AND t.endDatetime > :start")
    List<TimeOff> findOverlapping(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
