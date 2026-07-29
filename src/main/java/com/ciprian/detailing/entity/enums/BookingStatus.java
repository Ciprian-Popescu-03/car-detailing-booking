package com.ciprian.detailing.entity.enums;

import java.util.List;

public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW;

    /** Statuses that occupy a slot and must be considered by the conflict check. */
    public static final List<BookingStatus> ACTIVE = List.of(PENDING, CONFIRMED);
}
