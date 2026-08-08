import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiClient";
import "./BookingPageV2.css";

type Location = { id: string; name: string };
type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number | string;
  category_name?: string;
};
type Employee = { id: string; full_name: string; photo_url?: string | null };
type Slot = { employee_id: string; employee_name: string; start: string; end: string };

const api = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.message || `API hiba: ${response.status}`);
    return data;
  });

const ymd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });

const prettyDate = (iso: string) =>
  new Date(iso).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

export function BookingPageV2() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [servicePickerId, setServicePickerId] = useState("");
  const [date, setDate] = useState(ymd(new Date()));
  const [allSlots, setAllSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [waitDone, setWaitDone] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);

  useEffect(() => {
    api("/api/public/booking/catalog")
      .then((data) => setLocations(data.locations || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    setServices([]);
    setEmployees([]);
    setServiceIds([]);
    setServicePickerId("");
    setSelectedTime("");
    setEmployeeId("");
    setAllSlots([]);
    setAvailabilityLoaded(false);
    setWaitDone(false);
    if (!locationId) return;

    setCatalogLoading(true);
    setError("");
    api(`/api/public/booking/catalog?location_id=${encodeURIComponent(locationId)}`)
      .then((data) => {
        setServices(data.services || []);
        setEmployees(data.employees || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCatalogLoading(false));
  }, [locationId]);

  const selectedServices = useMemo(
    () => services.filter((service) => serviceIds.includes(service.id)),
    [services, serviceIds]
  );

  const groupedServices = useMemo(() => {
    const groups = new Map<string, Service[]>();
    for (const service of services) {
      const group = service.category_name || "Egyéb szolgáltatások";
      const values = groups.get(group) || [];
      values.push(service);
      groups.set(group, values);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, "hu"));
  }, [services]);

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, service) => sum + Number(service.price || 0), 0),
    [selectedServices]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, service) => sum + Number(service.duration_minutes || 30), 0),
    [selectedServices]
  );

  const serviceKey = serviceIds.join(",");
  const employeeKey = employees.map((employee) => employee.id).join(",");

  useEffect(() => {
    setSelectedTime("");
    setEmployeeId("");
    setAllSlots([]);
    setAvailabilityLoaded(false);
    setWaitDone(false);

    if (!locationId || !serviceIds.length || !employees.length || !date) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setAvailabilityLoading(true);
      setError("");
      try {
        // Munkatársonként kérjük le a szabad időpontokat. Így a backend 200-as
        // válaszlimitje nem tudja levágni a később sorra kerülő munkatársakat.
        const responses = await Promise.all(
          employees.map(async (employee) => {
            const query = new URLSearchParams({
              location_id: locationId,
              date,
              service_ids: serviceIds.join(","),
              employee_id: employee.id,
            });
            const data = await api(`/api/public/booking/availability?${query}`);
            return (data.slots || []) as Slot[];
          })
        );
        if (cancelled) return;
        const merged = responses
          .flat()
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime() || a.employee_name.localeCompare(b.employee_name, "hu"));
        setAllSlots(merged);
        setAvailabilityLoaded(true);
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message);
          setAvailabilityLoaded(true);
        }
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    }, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locationId, serviceKey, employeeKey, date]);

  const availableTimes = useMemo(() => {
    const source = employeeId ? allSlots.filter((slot) => slot.employee_id === employeeId) : allSlots;
    const byStart = new Map<string, Slot>();
    for (const slot of source) if (!byStart.has(slot.start)) byStart.set(slot.start, slot);
    return Array.from(byStart.values()).sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [allSlots, employeeId]);

  const availableEmployees = useMemo(() => {
    const source = selectedTime ? allSlots.filter((slot) => slot.start === selectedTime) : allSlots;
    const ids = new Set(source.map((slot) => slot.employee_id));
    return employees.filter((employee) => ids.has(employee.id));
  }, [allSlots, employees, selectedTime]);

  const selectedSlot = useMemo(() => {
    if (!selectedTime || !employeeId) return null;
    return allSlots.find(
      (candidate) => candidate.start === selectedTime && candidate.employee_id === employeeId
    ) || null;
  }, [allSlots, selectedTime, employeeId]);

  const locationName = locations.find((location) => location.id === locationId)?.name || "";
  const employeeName = employees.find((employee) => employee.id === employeeId)?.full_name || "";

  function addSelectedService() {
    if (!servicePickerId) return;
    setServiceIds((current) => current.includes(servicePickerId) ? current : [...current, servicePickerId]);
    setServicePickerId("");
  }

  function removeService(id: string) {
    setServiceIds((current) => current.filter((serviceId) => serviceId !== id));
  }

  function chooseTime(value: string) {
    setSelectedTime(value);
    if (!value) return;
    if (employeeId && !allSlots.some((slot) => slot.start === value && slot.employee_id === employeeId)) {
      setEmployeeId("");
      return;
    }
    if (!employeeId) {
      const freeIds = Array.from(new Set(allSlots.filter((slot) => slot.start === value).map((slot) => slot.employee_id)));
      if (freeIds.length === 1) setEmployeeId(freeIds[0]);
    }
  }

  function chooseEmployee(value: string) {
    setEmployeeId(value);
    if (!value) return;
    if (selectedTime && !allSlots.some((slot) => slot.start === selectedTime && slot.employee_id === value)) {
      setSelectedTime("");
      return;
    }
    if (!selectedTime) {
      const free = allSlots.filter((slot) => slot.employee_id === value);
      if (free.length === 1) setSelectedTime(free[0].start);
    }
  }

  async function submit() {
    if (!selectedSlot) return setError("Válasszon szabad időpontot és munkatársat.");
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      return setError("A foglaláshoz név és telefonszám vagy e-mail cím szükséges.");
    }

    setSaving(true);
    setError("");
    try {
      const result = await api("/api/public/booking/book", {
        method: "POST",
        body: JSON.stringify({
          location_id: locationId,
          employee_id: selectedSlot.employee_id,
          service_ids: serviceIds,
          client_name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          start_time: selectedSlot.start,
          note: note.trim(),
          marketing_consent: marketing,
          booking_source: "online",
        }),
      });
      setDone(result);
    } catch (e: any) {
      setError(e.message);
      // Ha közben lefoglalták az időpontot, azonnal frissítsük a választást.
      if (/foglalt|időközben/i.test(e.message || "")) {
        setSelectedTime("");
        setEmployeeId("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function joinWaitlist() {
    if (!locationId || !serviceIds.length) return;
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      return setError("A várólistához név és telefonszám vagy e-mail cím szükséges.");
    }
    setSaving(true);
    setError("");
    try {
      await api("/api/public/booking/waitlist", {
        method: "POST",
        body: JSON.stringify({
          location_id: locationId,
          employee_id: employeeId || null,
          service_ids: serviceIds,
          client_name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          preferred_from: `${date}T00:00:00`,
          preferred_to: `${date}T23:59:59`,
          note: note.trim(),
          booking_source: "online",
        }),
      });
      setWaitDone(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <main className="booking-v2-page">
        <section className="booking-v2-success">
          <div className="booking-v2-success__mark">✓</div>
          <span className="booking-v2-kicker">KLEOPÁTRA ONLINE FOGLALÁS</span>
          <h1>Foglalási igény rögzítve</h1>
          <p>{done.confirmation_required
            ? "A szalon munkatársa ellenőrzi az időpontot, majd visszaigazolást küld."
            : "Az időpont sikeresen visszaigazolva."}</p>
          <div className="booking-v2-success__id">Foglalási azonosító: <b>{done.id}</b></div>
          <Link to="/" className="booking-v2-secondary-button">Vissza a főoldalra</Link>
        </section>
      </main>
    );
  }

  const step1Ready = Boolean(locationId && serviceIds.length);
  const step2Ready = Boolean(selectedSlot);
  const step3Ready = Boolean(name.trim() && (phone.trim() || email.trim()));

  return (
    <main className="booking-v2-page">
      <section className="booking-v2-hero">
        <div className="booking-v2-hero__glow booking-v2-hero__glow--gold" />
        <div className="booking-v2-hero__glow booking-v2-hero__glow--pink" />
        <div className="booking-v2-hero__content">
          <span className="booking-v2-kicker">ONLINE IDŐPONTFOGLALÁS</span>
          <h1>Az Ön ideje. <em>Az Ön szépsége.</em></h1>
          <p>Válasszon szalont és szolgáltatást, majd a rendszer csak a valóban szabad időpontokat és munkatársakat mutatja.</p>
          <div className="booking-v2-hero__actions">
            <span><b>01</b> Szalon és szolgáltatás</span>
            <span><b>02</b> Időpont és munkatárs</span>
            <span><b>03</b> Adatok és véglegesítés</span>
          </div>
        </div>
      </section>

      <section className="booking-v2-shell">
        <div className="booking-v2-progress" aria-label="Foglalás lépései">
          <div className={step1Ready ? "is-ready" : "is-active"}><b>1</b><span>Választás</span></div>
          <i />
          <div className={step2Ready ? "is-ready" : step1Ready ? "is-active" : ""}><b>2</b><span>Időpont</span></div>
          <i />
          <div className={step3Ready ? "is-ready" : step2Ready ? "is-active" : ""}><b>3</b><span>Adatok</span></div>
        </div>

        {error && <div className="booking-v2-error"><b>!</b><span>{error}</span></div>}

        <section className="booking-v2-card">
          <div className="booking-v2-card__head">
            <div className="booking-v2-step-number">01</div>
            <div>
              <span>KEZDJÜK AZ ALAPOKKAL</span>
              <h2>Szalon és szolgáltatás</h2>
              <p>A szolgáltatások kategóriák szerint, egyetlen áttekinthető legördülő menüben jelennek meg.</p>
            </div>
          </div>

          <div className="booking-v2-fields booking-v2-fields--two">
            <label>
              <span>Szalon</span>
              <div className="booking-v2-select-wrap">
                <select value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                  <option value="">Válasszon szalont</option>
                  {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
              </div>
            </label>

            <label>
              <span>Szolgáltatás hozzáadása</span>
              <div className="booking-v2-service-picker">
                <div className="booking-v2-select-wrap">
                  <select
                    value={servicePickerId}
                    disabled={!locationId || catalogLoading}
                    onChange={(e) => setServicePickerId(e.target.value)}
                  >
                    <option value="">{catalogLoading ? "Betöltés…" : "Válasszon szolgáltatást"}</option>
                    {groupedServices.map(([group, values]) => (
                      <optgroup label={group} key={group}>
                        {values.map((service) => (
                          <option key={service.id} value={service.id} disabled={serviceIds.includes(service.id)}>
                            {service.name} — {service.duration_minutes || 30} perc — {Number(service.price || 0).toLocaleString("hu-HU")} Ft
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={addSelectedService} disabled={!servicePickerId}>Hozzáadás</button>
              </div>
            </label>
          </div>

          {selectedServices.length > 0 && (
            <div className="booking-v2-selected-services">
              {selectedServices.map((service) => (
                <div className="booking-v2-service-chip" key={service.id}>
                  <span><b>{service.name}</b><small>{service.duration_minutes || 30} perc · {Number(service.price || 0).toLocaleString("hu-HU")} Ft</small></span>
                  <button type="button" aria-label={`${service.name} eltávolítása`} onClick={() => removeService(service.id)}>×</button>
                </div>
              ))}
              <div className="booking-v2-service-total">
                <span>{selectedServices.length} szolgáltatás · {totalDuration} perc</span>
                <strong>{totalPrice.toLocaleString("hu-HU")} Ft</strong>
              </div>
            </div>
          )}
        </section>

        <section className={`booking-v2-card ${!step1Ready ? "is-disabled" : ""}`}>
          <div className="booking-v2-card__head">
            <div className="booking-v2-step-number">02</div>
            <div>
              <span>VALÓS IDEJŰ SZABAD KAPACITÁS</span>
              <h2>Időpont és munkatárs</h2>
              <p>Az időpont és a munkatárs egymást szűri: választott időponthoz csak szabad munkatárs, választott munkatárshoz csak szabad időpont jelenik meg.</p>
            </div>
          </div>

          <div className="booking-v2-live-status">
            <span className={availabilityLoading ? "is-loading" : availabilityLoaded ? "is-live" : ""} />
            {availabilityLoading
              ? "Szabad kapacitások ellenőrzése az adatbázisban…"
              : availabilityLoaded
                ? `${allSlots.length} szabad munkatárs–időpont kombináció betöltve`
                : "A szabad kapacitás a szolgáltatás kiválasztása után automatikusan betöltődik"}
          </div>

          <div className="booking-v2-fields booking-v2-fields--three">
            <label>
              <span>Dátum</span>
              <input type="date" min={ymd(new Date())} value={date} disabled={!step1Ready} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label>
              <span>Szabad időpont</span>
              <div className="booking-v2-select-wrap">
                <select
                  value={selectedTime}
                  disabled={!step1Ready || availabilityLoading || !availableTimes.length}
                  onChange={(e) => chooseTime(e.target.value)}
                >
                  <option value="">Válasszon időpontot</option>
                  {availableTimes.map((candidate) => (
                    <option value={candidate.start} key={candidate.start}>{hhmm(candidate.start)}</option>
                  ))}
                </select>
              </div>
              <small>{employeeId ? `${employeeName} csak valóban szabad időpontjai` : "Az összes szabad időpont"}</small>
            </label>

            <label>
              <span>Szabad munkatárs</span>
              <div className="booking-v2-select-wrap">
                <select
                  value={employeeId}
                  disabled={!step1Ready || availabilityLoading || !availableEmployees.length}
                  onChange={(e) => chooseEmployee(e.target.value)}
                >
                  <option value="">Válasszon munkatársat</option>
                  {availableEmployees.map((employee) => (
                    <option value={employee.id} key={employee.id}>{employee.full_name}</option>
                  ))}
                </select>
              </div>
              <small>{selectedTime ? `${hhmm(selectedTime)} időpontban szabad munkatársak` : "Az adott napon elérhető munkatársak"}</small>
            </label>
          </div>

          {availabilityLoaded && !availabilityLoading && allSlots.length === 0 && (
            <div className="booking-v2-empty">
              <div>⌛</div>
              <h3>Ezen a napon nincs szabad időpont</h3>
              <p>Próbáljon másik napot, vagy adja meg adatait és kérjen várólistás értesítést.</p>
            </div>
          )}

          {selectedSlot && (
            <div className="booking-v2-choice">
              <div><span>Kiválasztott időpont</span><strong>{prettyDate(selectedSlot.start)} · {hhmm(selectedSlot.start)}</strong></div>
              <div><span>Munkatárs</span><strong>{selectedSlot.employee_name}</strong></div>
              <div><span>Időtartam</span><strong>{totalDuration} perc</strong></div>
            </div>
          )}
        </section>

        <section className={`booking-v2-card ${!step1Ready ? "is-disabled" : ""}`}>
          <div className="booking-v2-card__head">
            <div className="booking-v2-step-number">03</div>
            <div>
              <span>MÁR CSAK EGY LÉPÉS</span>
              <h2>Vendégadatok és véglegesítés</h2>
              <p>Az adatokat közvetlenül a VIR ügyfél- és foglalási adatbázisába mentjük.</p>
            </div>
          </div>

          <div className="booking-v2-fields booking-v2-fields--two">
            <label><span>Név *</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Teljes név" /></label>
            <label><span>Telefonszám</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+36 30 123 4567" /></label>
            <label><span>E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@pelda.hu" /></label>
            <label className="booking-v2-note"><span>Megjegyzés</span><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcionális megjegyzés" /></label>
          </div>

          <label className="booking-v2-consent">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>Hozzájárulok marketing célú kapcsolattartáshoz.</span>
          </label>

          <div className="booking-v2-checkout">
            <div className="booking-v2-checkout__summary">
              <span>FOGLALÁSI ÖSSZEFOGLALÓ</span>
              <h3>{locationName || "Válasszon szalont"}</h3>
              <p>{selectedServices.map((service) => service.name).join(" · ") || "Még nincs kiválasztott szolgáltatás"}</p>
              <div className="booking-v2-checkout__facts">
                <b>{selectedSlot ? `${prettyDate(selectedSlot.start)} · ${hhmm(selectedSlot.start)}` : "Időpont nincs kiválasztva"}</b>
                <b>{employeeName || "Munkatárs nincs kiválasztva"}</b>
              </div>
            </div>
            <div className="booking-v2-checkout__price">
              <span>Összesen</span>
              <strong>{totalPrice.toLocaleString("hu-HU")} Ft</strong>
              <small>{totalDuration || 0} perc</small>
            </div>
          </div>

          <div className="booking-v2-actions">
            {availabilityLoaded && allSlots.length === 0 && (
              <button type="button" className="booking-v2-waitlist" disabled={saving || waitDone} onClick={joinWaitlist}>
                {waitDone ? "Várólista-igény rögzítve ✓" : "Kérek várólistás értesítést"}
              </button>
            )}
            <button type="button" className="booking-v2-submit" disabled={!selectedSlot || !step3Ready || saving} onClick={submit}>
              {saving ? "Foglalás mentése…" : "Időpontfoglalás véglegesítése"}
            </button>
          </div>

          <div className="booking-v2-voice-link">
            <span>Inkább szóban intézné?</span>
            <Link to="/hangos-idopontfoglalas">Foglalás hangasszisztenssel →</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
