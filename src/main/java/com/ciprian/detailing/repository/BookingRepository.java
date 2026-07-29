package com.ciprian.detailing.repository;

import com.ciprian.detailing.entity.Booking;
import com.ciprian.detailing.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT b FROM Booking b
            WHERE b.status IN :activeStatuses
              AND b.startTime < :end
              AND b.endTime > :start
            """)
    List<Booking> findOverlapping(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("activeStatuses") List<BookingStatus> activeStatuses);

    @Query("""
            SELECT b FROM Booking b
            WHERE b.status IN :activeStatuses
              AND b.startTime >= :dayStart
              AND b.startTime < :dayEnd
            ORDER BY b.startTime
            """)
    List<Booking> findActiveOnDay(
            @Param("dayStart") LocalDateTime dayStart,
            @Param("dayEnd") LocalDateTime dayEnd,
            @Param("activeStatuses") List<BookingStatus> activeStatuses);

    /**
     * DTO mapping (BookingResponse.from) happens in the controller, after this method's transaction has
     * closed - JOIN FETCH pulls the lazy `service` relation in eagerly here so it doesn't throw
     * LazyInitializationException when accessed later outside the Hibernate session.
     */
    @Query("SELECT b FROM Booking b JOIN FETCH b.service ORDER BY b.startTime DESC")
    List<Booking> findAllByOrderByStartTimeDesc();

    @Query("SELECT b FROM Booking b JOIN FETCH b.service WHERE b.id = :id")
    Optional<Booking> findByIdWithService(@Param("id") Long id);
}
