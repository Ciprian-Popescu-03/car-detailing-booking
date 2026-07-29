package com.ciprian.detailing.web.dto;

import com.ciprian.detailing.entity.TimeOff;

import java.time.LocalDateTime;

public record TimeOffResponse(Long id, LocalDateTime startDatetime, LocalDateTime endDatetime, String reason) {
    public static TimeOffResponse from(TimeOff timeOff) {
        return new TimeOffResponse(timeOff.getId(), timeOff.getStartDatetime(), timeOff.getEndDatetime(), timeOff.getReason());
    }
}
