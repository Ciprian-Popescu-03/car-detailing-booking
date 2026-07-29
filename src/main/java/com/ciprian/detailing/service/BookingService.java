package com.ciprian.detailing.service;

import com.ciprian.detailing.entity.Booking;
import com.ciprian.detailing.entity.DetailingService;
import com.ciprian.detailing.entity.TimeOff;
import com.ciprian.detailing.entity.enums.BookingStatus;
import com.ciprian.detailing.exception.BookingConflictException;
import com.ciprian.detailing.exception.ResourceNotFoundException;
import com.ciprian.detailing.repository.BookingRepository;
import com.ciprian.detailing.repository.DetailingServiceRepository;
import com.ciprian.detailing.repository.TimeOffRepository;
import com.ciprian.detailing.web.dto.CreateBookingRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final DetailingServiceRepository serviceRepository;
    private final TimeOffRepository timeOffRepository;

    public BookingService(
            BookingRepository bookingRepository,
            DetailingServiceRepository serviceRepository,
            TimeOffRepository timeOffRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.timeOffRepository = timeOffRepository;
    }

    /**
     * Re-validates the slot server-side (not just trusting the client's earlier availability call) so a
     * race between two customers booking the same slot at once still gets caught by the overlap check
     * below rather than silently double-booking the shop's single bay.
     */
    @Transactional
    public Booking createBooking(CreateBookingRequest request) {
        DetailingService service = serviceRepository.findById(request.serviceId())
                .filter(DetailingService::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("No active service with id " + request.serviceId()));

        LocalDateTime start = request.startTime();
        LocalDateTime end = start.plusMinutes(service.getDurationMinutes());

        if (!bookingRepository.findOverlapping(start, end, BookingStatus.ACTIVE).isEmpty()) {
            throw new BookingConflictException("That slot was just taken - please pick another one.");
        }
        List<TimeOff> blockedRanges = timeOffRepository.findOverlapping(start, end);
        if (!blockedRanges.isEmpty()) {
            throw new BookingConflictException("That slot isn't available.");
        }

        Booking booking = Booking.builder()
                .service(service)
                .customerName(request.customerName())
                .customerPhone(request.customerPhone())
                .customerEmail(request.customerEmail())
                .vehicleMake(request.vehicleMake())
                .vehicleModel(request.vehicleModel())
                .startTime(start)
                .endTime(end)
                .status(BookingStatus.CONFIRMED)
                .notes(request.notes())
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> listAll() {
        return bookingRepository.findAllByOrderByStartTimeDesc();
    }

    @Transactional
    public Booking updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findByIdWithService(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No booking with id " + bookingId));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
