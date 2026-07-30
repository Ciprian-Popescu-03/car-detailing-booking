import { useEffect, useState } from "react";
import client from "../api/client";
import ServiceCard from "../components/ServiceCard";
import DateStrip from "../components/DateStrip";
import SlotGrid from "../components/SlotGrid";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";
import Header from "../components/Header";

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export default function BookingPage() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    client.get("/services").then((res) => setServices(res.data));
  }, []);

  useEffect(() => {
    if (!selectedService) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    client
      .get("/availability", { params: { serviceId: selectedService.id, date: selectedDate } })
      .then((res) => setSlots(res.data))
      .finally(() => setSlotsLoading(false));
  }, [selectedService, selectedDate]);

  function selectService(service) {
    setSelectedService(service);
    setBookingError(null);
  }

  async function handleSubmit(form) {
    setSubmitting(true);
    setBookingError(null);
    try {
      const res = await client.post("/bookings", {
        serviceId: selectedService.id,
        startTime: selectedSlot.startTime,
        ...form,
      });
      setConfirmedBooking(res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong - please try again.";
      setBookingError(message);
      if (err.response?.status === 409) {
        // slot was taken in the meantime - refresh availability
        client
          .get("/availability", { params: { serviceId: selectedService.id, date: selectedDate } })
          .then((res) => setSlots(res.data));
        setSelectedSlot(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedBooking) {
    return <ConfirmationScreen booking={confirmedBooking} />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pb-24">
        <section className="pt-14 pb-10">
          <p className="text-red-500 text-xs uppercase tracking-[0.2em] font-semibold">Book online in under a minute</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Your car, detailed <span className="text-red-500">right</span>.
          </h1>
          <p className="mt-4 text-zinc-400 max-w-lg leading-relaxed">
            Hand wash, interior detailing, paint correction and ceramic coating — pick a service and
            a time that works for you, no phone calls required.
          </p>
        </section>

        <section id="services" className="grid sm:grid-cols-2 gap-4 scroll-mt-20">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedService?.id === service.id}
              onSelect={selectService}
            />
          ))}
        </section>

        {selectedService && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-4">Pick a date &amp; time</h2>
            <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
            <div className="mt-4">
              <SlotGrid
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
                loading={slotsLoading}
              />
            </div>
          </section>
        )}

        {selectedSlot && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-4">Your details</h2>
            <BookingForm onSubmit={handleSubmit} submitting={submitting} error={bookingError} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ConfirmationScreen({ booking }) {
  const dt = new Date(booking.startTime);
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-600/15 border border-red-600/40 flex items-center justify-center text-red-500 text-2xl">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">You're booked in</h1>
        <p className="mt-2 text-zinc-400">
          {booking.service.name} on{" "}
          {dt.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })} at{" "}
          {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
        </p>
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left text-sm text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">Name:</span> {booking.customerName}</p>
          <p><span className="text-zinc-500">Phone:</span> {booking.customerPhone}</p>
          {booking.vehicleMake && (
            <p><span className="text-zinc-500">Vehicle:</span> {booking.vehicleMake} {booking.vehicleModel}</p>
          )}
          <p><span className="text-zinc-500">Price:</span> {Number(booking.service.price).toFixed(0)} RON</p>
        </div>
        <a
          href="/"
          className="mt-8 inline-block rounded-lg border border-zinc-700 px-5 py-2 text-sm text-zinc-300 hover:border-zinc-500"
        >
          Book another slot
        </a>
      </div>
    </div>
  );
}
