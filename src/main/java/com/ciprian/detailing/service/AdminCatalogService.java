package com.ciprian.detailing.service;

import com.ciprian.detailing.entity.DetailingService;
import com.ciprian.detailing.entity.TimeOff;
import com.ciprian.detailing.exception.ResourceNotFoundException;
import com.ciprian.detailing.repository.DetailingServiceRepository;
import com.ciprian.detailing.repository.TimeOffRepository;
import com.ciprian.detailing.web.dto.CreateTimeOffRequest;
import com.ciprian.detailing.web.dto.UpsertServiceRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminCatalogService {

    private final DetailingServiceRepository serviceRepository;
    private final TimeOffRepository timeOffRepository;

    public AdminCatalogService(DetailingServiceRepository serviceRepository, TimeOffRepository timeOffRepository) {
        this.serviceRepository = serviceRepository;
        this.timeOffRepository = timeOffRepository;
    }

    @Transactional(readOnly = true)
    public List<DetailingService> listAllServices() {
        return serviceRepository.findAll();
    }

    @Transactional
    public DetailingService createService(UpsertServiceRequest request) {
        DetailingService service = DetailingService.builder()
                .name(request.name())
                .description(request.description())
                .durationMinutes(request.durationMinutes())
                .price(request.price())
                .category(request.category())
                .active(request.active() == null || request.active())
                .createdAt(LocalDateTime.now())
                .build();
        return serviceRepository.save(service);
    }

    @Transactional
    public DetailingService updateService(Long id, UpsertServiceRequest request) {
        DetailingService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No service with id " + id));

        service.setName(request.name());
        service.setDescription(request.description());
        service.setDurationMinutes(request.durationMinutes());
        service.setPrice(request.price());
        service.setCategory(request.category());
        if (request.active() != null) {
            service.setActive(request.active());
        }
        return serviceRepository.save(service);
    }

    @Transactional(readOnly = true)
    public List<TimeOff> listTimeOff() {
        return timeOffRepository.findAll();
    }

    @Transactional
    public TimeOff createTimeOff(CreateTimeOffRequest request) {
        if (!request.endDatetime().isAfter(request.startDatetime())) {
            throw new IllegalArgumentException("endDatetime must be after startDatetime");
        }
        TimeOff timeOff = TimeOff.builder()
                .startDatetime(request.startDatetime())
                .endDatetime(request.endDatetime())
                .reason(request.reason())
                .build();
        return timeOffRepository.save(timeOff);
    }

    @Transactional
    public void deleteTimeOff(Long id) {
        if (!timeOffRepository.existsById(id)) {
            throw new ResourceNotFoundException("No time-off entry with id " + id);
        }
        timeOffRepository.deleteById(id);
    }
}
