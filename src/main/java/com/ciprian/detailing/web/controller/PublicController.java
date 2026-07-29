package com.ciprian.detailing.web.controller;

import com.ciprian.detailing.entity.Booking;
import com.ciprian.detailing.repository.DetailingServiceRepository;
import com.ciprian.detailing.service.AvailabilityService;
import com.ciprian.detailing.service.BookingService;
import com.ciprian.detailing.web.dto.AvailableSlotResponse;
import com.ciprian.detailing.web.dto.BookingResponse;
import com.ciprian.detailing.web.dto.CreateBookingRequest;
import com.ciprian.detailing.web.dto.ServiceResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class  PublicController {

    private final DetailingServiceRepository serviceRepository;
    private final AvailabilityService availabilityService;
    private final BookingService bookingService;

    public PublicController(
            DetailingServiceRepository serviceRepository,
            AvailabilityService availabilityService,
            BookingService bookingService) {
        this.serviceRepository = serviceRepository;
        this.availabilityService = availabilityService;
        this.bookingService = bookingService;
    }

    @GetMapping("/services")
    public List<ServiceResponse> listServices() {
        return serviceRepository.findByActiveTrueOrderByPriceAsc().stream()
                .map(ServiceResponse::from)
                .toList();
    }

    @GetMapping("/availability")
    public List<AvailableSlotResponse> getAvailability(
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return availabilityService.getAvailableSlots(serviceId, date);
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(BookingResponse.from(booking));
    }
}
