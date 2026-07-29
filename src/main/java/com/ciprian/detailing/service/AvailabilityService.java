package com.ciprian.detailing.service;

import com.ciprian.detailing.entity.Booking;
import com.ciprian.detailing.entity.BusinessHours;
import com.ciprian.detailing.entity.DetailingService;
import com.ciprian.detailing.entity.TimeOff;
import com.ciprian.detailing.entity.enums.BookingStatus;
import com.ciprian.detailing.exception.ResourceNotFoundException;
import com.ciprian.detailing.repository.BookingRepository;
import com.ciprian.detailing.repository.BusinessHoursRepository;
import com.ciprian.detailing.repository.DetailingServiceRepository;
import com.ciprian.detailing.repository.TimeOffRepository;
import com.ciprian.detailing.web.dto.AvailableSlotResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {

    /** Candidate slots start on this cadence; each candidate is then checked against the service duration. */
    private static final int SLOT_GRANULARITY_MINUTES = 30;

    private final DetailingServiceRepository serviceRepository;
    private final BusinessHoursRepository businessHoursRepository;
    private final BookingRepository bookingRepository;
    private final TimeOffRepository timeOffRepository;

    public AvailabilityService(
            DetailingServiceRepository serviceRepository,
            BusinessHoursRepository businessHoursRepository,
            BookingRepository bookingRepository,
            TimeOffRepository timeOffRepository) {
        this.serviceRepository = serviceRepository;
        this.businessHoursRepository = businessHoursRepository;
        this.bookingRepository = bookingRepository;
        this.timeOffRepository = timeOffRepository;
    }

    @Transactional(readOnly = true)
    public List<AvailableSlotResponse> getAvailableSlots(Long serviceId, LocalDate date) {
        DetailingService service = serviceRepository.findById(serviceId)
                .filter(DetailingService::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("No active service with id " + serviceId));

        BusinessHours hours = businessHoursRepository.findByDayOfWeek(date.getDayOfWeek().getValue()).orElse(null);
        if (hours == null || hours.isClosed() || hours.getOpenTime() == null || hours.getCloseTime() == null) {
            return List.of();
        }

        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);
        List<Booking> activeBookings = bookingRepository.findActiveOnDay(dayStart, dayEnd, BookingStatus.ACTIVE);
        List<TimeOff> timeOffs = timeOffRepository.findOverlapping(dayStart, dayEnd);

        LocalDateTime openAt = date.atTime(hours.getOpenTime());
        LocalDateTime closeAt = date.atTime(hours.getCloseTime());
        int durationMinutes = service.getDurationMinutes();
        LocalDateTime now = LocalDateTime.now();

        List<AvailableSlotResponse> slots = new ArrayList<>();
        LocalDateTime candidateStart = openAt;
        while (!candidateStart.plusMinutes(durationMinutes).isAfter(closeAt)) {
            final LocalDateTime slotStart = candidateStart;
            final LocalDateTime slotEnd = candidateStart.plusMinutes(durationMinutes);

            boolean alreadyPast = slotStart.isBefore(now);
            boolean overlapsBooking = activeBookings.stream()
                    .anyMatch(b -> slotStart.isBefore(b.getEndTime()) && slotEnd.isAfter(b.getStartTime()));
            boolean overlapsTimeOff = timeOffs.stream()
                    .anyMatch(t -> slotStart.isBefore(t.getEndDatetime()) && slotEnd.isAfter(t.getStartDatetime()));

            if (!alreadyPast && !overlapsBooking && !overlapsTimeOff) {
                slots.add(new AvailableSlotResponse(slotStart, slotEnd));
            }
            candidateStart = candidateStart.plusMinutes(SLOT_GRANULARITY_MINUTES);
        }

        return slots;
    }
}
