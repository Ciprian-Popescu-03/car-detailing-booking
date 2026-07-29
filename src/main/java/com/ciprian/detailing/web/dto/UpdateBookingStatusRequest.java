package com.ciprian.detailing.web.dto;

import jakarta.validation.constraints.NotNull;

import com.ciprian.detailing.entity.enums.BookingStatus;

public record UpdateBookingStatusRequest(@NotNull BookingStatus status) {
}
