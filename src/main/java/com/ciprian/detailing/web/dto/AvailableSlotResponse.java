package com.ciprian.detailing.web.dto;

import java.time.LocalDateTime;

public record AvailableSlotResponse(LocalDateTime startTime, LocalDateTime endTime) {
}
