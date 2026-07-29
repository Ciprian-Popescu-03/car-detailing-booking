package com.ciprian.detailing.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpsertServiceRequest(
        @NotBlank String name,
        String description,
        @NotNull @Min(1) Integer durationMinutes,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        String category,
        Boolean active
) {
}
