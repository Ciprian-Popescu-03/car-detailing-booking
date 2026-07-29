package com.ciprian.detailing.web.dto;

import com.ciprian.detailing.entity.Booking;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        ServiceResponse service,
        String customerName,
        String customerPhone,
        String customerEmail,
        String vehicleMake,
        String vehicleModel,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String status,
        String notes,
        LocalDateTime createdAt
) {
    public static BookingResponse from(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                ServiceResponse.from(booking.getService()),
                booking.getCustomerName(),
                booking.getCustomerPhone(),
                booking.getCustomerEmail(),
                booking.getVehicleMake(),
                booking.getVehicleModel(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus().name(),
                booking.getNotes(),
                booking.getCreatedAt());
    }
}
