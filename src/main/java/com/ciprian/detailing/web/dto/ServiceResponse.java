package com.ciprian.detailing.web.dto;

import com.ciprian.detailing.entity.DetailingService;

import java.math.BigDecimal;

public record ServiceResponse(
        Long id,
        String name,
        String description,
        Integer durationMinutes,
        BigDecimal price,
        String category,
        boolean active
) {
    public static ServiceResponse from(DetailingService service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getDurationMinutes(),
                service.getPrice(),
                service.getCategory(),
                service.isActive());
    }
}
