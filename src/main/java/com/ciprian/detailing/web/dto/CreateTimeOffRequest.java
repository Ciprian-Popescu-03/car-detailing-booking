package com.ciprian.detailing.web.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateTimeOffRequest(
        @NotNull LocalDateTime startDatetime,
        @NotNull LocalDateTime endDatetime,
        String reason
) {
}
