package com.ciprian.detailing.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateBookingRequest(
        @NotNull Long serviceId,
        @NotNull @FutureOrPresent LocalDateTime startTime,
        @NotBlank String customerName,
        @NotBlank String customerPhone,
        @Email String customerEmail,
        String vehicleMake,
        String vehicleModel,
        String notes
) {
}
