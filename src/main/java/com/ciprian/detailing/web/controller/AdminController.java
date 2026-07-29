package com.ciprian.detailing.web.controller;

import com.ciprian.detailing.entity.Booking;
import com.ciprian.detailing.entity.DetailingService;
import com.ciprian.detailing.entity.TimeOff;
import com.ciprian.detailing.service.AdminCatalogService;
import com.ciprian.detailing.service.BookingService;
import com.ciprian.detailing.web.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingService bookingService;
    private final AdminCatalogService adminCatalogService;

    public AdminController(BookingService bookingService, AdminCatalogService adminCatalogService) {
        this.bookingService = bookingService;
        this.adminCatalogService = adminCatalogService;
    }

    @GetMapping("/bookings")
    public List<BookingResponse> listBookings() {
        return bookingService.listAll().stream().map(BookingResponse::from).toList();
    }

    @PatchMapping("/bookings/{id}/status")
    public BookingResponse updateBookingStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateBookingStatusRequest request) {
        Booking booking = bookingService.updateStatus(id, request.status());
        return BookingResponse.from(booking);
    }

    @GetMapping("/services")
    public List<ServiceResponse> listServices() {
        return adminCatalogService.listAllServices().stream().map(ServiceResponse::from).toList();
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceResponse> createService(@Valid @RequestBody UpsertServiceRequest request) {
        DetailingService service = adminCatalogService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ServiceResponse.from(service));
    }

    @PutMapping("/services/{id}")
    public ServiceResponse updateService(@PathVariable Long id, @Valid @RequestBody UpsertServiceRequest request) {
        return ServiceResponse.from(adminCatalogService.updateService(id, request));
    }

    @GetMapping("/time-off")
    public List<TimeOffResponse> listTimeOff() {
        return adminCatalogService.listTimeOff().stream().map(TimeOffResponse::from).toList();
    }

    @PostMapping("/time-off")
    public ResponseEntity<TimeOffResponse> createTimeOff(@Valid @RequestBody CreateTimeOffRequest request) {
        TimeOff timeOff = adminCatalogService.createTimeOff(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(TimeOffResponse.from(timeOff));
    }

    @DeleteMapping("/time-off/{id}")
    public ResponseEntity<Void> deleteTimeOff(@PathVariable Long id) {
        adminCatalogService.deleteTimeOff(id);
        return ResponseEntity.noContent().build();
    }
}
