export type VoiceLocation = { id: string; name: string };
export type VoiceService = { id: string; name: string };
export type VoiceEmployee = { id: string; full_name: string };

export type VoiceTimePreference = {
  exactMinutes?: number;
  fromMinutes?: number;
  toMinutes?: number;
  label?: string;
};

export type VoiceBookingIntent = {
  locationId?: string;
  serviceIds: string[];
  employeeId?: string;
  date?: string;
  timePreference?: VoiceTimePreference;
  transcript: string;
  understood: string[];
};

export type VoiceContact = {
  name?: string;
  phone?: string;
  email?: string;
};

export type VoiceSlotCommand =
  | { type: "index"; index: number }
  | { type: "later" }
  | { type: "earlier" }
  | { type: "other_employee" }
  | { type: "other_day" }
  | { type: "none" };

export const stripVoiceText = (value: string) =>
  String(value || "")
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+@. ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ymd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

const weekdays: Array<[string[], number]> = [
  [["vasarnap", "vasarnapra"], 0],
  [["hetfo", "hetfon", "hetfore"], 1],
  [["kedd", "kedden", "keddre"], 2],
  [["szerda", "szerdan", "szerdara"], 3],
  [["csutortok", "csutortokon", "csutortokre"], 4],
  [["pentek", "penteken", "pentekre"], 5],
  [["szombat", "szombaton", "szombatra"], 6],
];

function parseDate(text: string, now = new Date()): string | undefined {
  const t = stripVoiceText(text);
  if (t.includes("holnaputan")) return ymd(addDays(now, 2));
  if (t.includes("holnap")) return ymd(addDays(now, 1));
  if (/\bma\b/.test(t)) return ymd(now);

  const iso = t.match(/\b(20\d{2})[ .-](\d{1,2})[ .-](\d{1,2})\b/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    if (!Number.isNaN(d.getTime())) return ymd(d);
  }

  const currentDay = now.getDay();
  for (const [names, targetDay] of weekdays) {
    if (!names.some((name) => t.includes(name))) continue;
    if (t.includes("jovo het")) {
      const daysToMonday = ((8 - currentDay) % 7) || 7;
      const monday = addDays(now, daysToMonday);
      return ymd(addDays(monday, targetDay === 0 ? 6 : targetDay - 1));
    }
    let delta = (targetDay - currentDay + 7) % 7;
    if (delta === 0) delta = 7;
    return ymd(addDays(now, delta));
  }
  return undefined;
}

const hourWords: Record<string, number> = {
  egy: 1, ketto: 2, ket: 2, harom: 3, negy: 4, ot: 5, hat: 6,
  het: 7, nyolc: 8, kilenc: 9, tiz: 10, tizenegy: 11, tizenkettő: 12,
  tizenketto: 12, tizenharom: 13, tizennegy: 14, tizenot: 15, tizenhat: 16,
  tizenhet: 17, tizennyolc: 18, tizenkilenc: 19, husz: 20,
};

function normalizeHourByPeriod(hour: number, text: string) {
  const t = stripVoiceText(text);
  if ((t.includes("delutan") || t.includes("este")) && hour < 12) return hour + 12;
  return hour;
}

function parseTimePreference(text: string): VoiceTimePreference | undefined {
  const t = stripVoiceText(text);
  const numeric = t.match(/\b(\d{1,2})(?::|\.| ora | orakor)(\d{2})?\b/);
  if (numeric) {
    let hour = Number(numeric[1]);
    const minute = Number(numeric[2] || 0);
    hour = normalizeHourByPeriod(hour, t);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return { exactMinutes: hour * 60 + minute, label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` };
    }
  }

  for (const [word, rawHour] of Object.entries(hourWords)) {
    if (t.includes(`fel ${word}`)) {
      let hour = rawHour - 1;
      hour = normalizeHourByPeriod(hour, t);
      return { exactMinutes: hour * 60 + 30, label: `${String(hour).padStart(2, "0")}:30` };
    }
  }

  if (t.includes("reggel")) return { fromMinutes: 8 * 60, toMinutes: 11 * 60, label: "reggel" };
  if (t.includes("delelot")) return { fromMinutes: 8 * 60, toMinutes: 12 * 60, label: "délelőtt" };
  if (t.includes("delutan")) return { fromMinutes: 12 * 60, toMinutes: 18 * 60, label: "délután" };
  if (t.includes("este")) return { fromMinutes: 17 * 60, toMinutes: 21 * 60, label: "este" };
  return undefined;
}

function scoreEntity(text: string, candidate: string) {
  const t = stripVoiceText(text);
  const c = stripVoiceText(candidate);
  if (!c) return 0;
  if (t.includes(c)) return 1000 + c.length;
  const tokens = c.split(" ").filter((x) => x.length >= 3);
  const hits = tokens.filter((token) => t.includes(token)).length;
  return hits ? hits * 20 + tokens.join("").length : 0;
}

function bestMatch<T>(text: string, items: T[], label: (item: T) => string): T | undefined {
  let best: T | undefined;
  let bestScore = 0;
  for (const item of items) {
    const score = scoreEntity(text, label(item));
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return bestScore >= 20 ? best : undefined;
}

export function interpretVoiceBooking(
  transcript: string,
  catalog: { locations: VoiceLocation[]; services: VoiceService[]; employees: VoiceEmployee[] },
): VoiceBookingIntent {
  const understood: string[] = [];
  const location = bestMatch(transcript, catalog.locations, (x) => x.name);
  const employee = bestMatch(transcript, catalog.employees, (x) => x.full_name);
  const serviceScores = catalog.services
    .map((service) => ({ service, score: scoreEntity(transcript, service.name) }))
    .filter((x) => x.score >= 20)
    .sort((a, b) => b.score - a.score);
  const services = serviceScores.filter((x, index) => index < 4 && (index === 0 || x.score >= 30)).map((x) => x.service);
  const date = parseDate(transcript);
  const timePreference = parseTimePreference(transcript);

  if (location) understood.push(`szalon: ${location.name}`);
  if (services.length) understood.push(`szolgáltatás: ${services.map((x) => x.name).join(", ")}`);
  if (employee) understood.push(`szakember: ${employee.full_name}`);
  if (date) understood.push(`dátum: ${date}`);
  if (timePreference?.label) understood.push(`idő: ${timePreference.label}`);

  return {
    locationId: location?.id,
    serviceIds: services.map((x) => x.id),
    employeeId: employee?.id,
    date,
    timePreference,
    transcript,
    understood,
  };
}

export function slotMatchesPreference(startIso: string, preference?: VoiceTimePreference) {
  if (!preference) return true;
  const d = new Date(startIso);
  const minutes = d.getHours() * 60 + d.getMinutes();
  if (preference.exactMinutes != null) return Math.abs(minutes - preference.exactMinutes) <= 45;
  if (preference.fromMinutes != null && minutes < preference.fromMinutes) return false;
  if (preference.toMinutes != null && minutes >= preference.toMinutes) return false;
  return true;
}

const digitWords: Record<string, string> = {
  nulla: "0", zero: "0", egy: "1", ketto: "2", ket: "2", harom: "3", negy: "4",
  ot: "5", hat: "6", het: "7", nyolc: "8", kilenc: "9",
};

function spokenDigits(value: string) {
  const tokens = stripVoiceText(value).split(" ");
  let out = "";
  for (const token of tokens) {
    if (/^\d+$/.test(token)) out += token;
    else if (digitWords[token]) out += digitWords[token];
  }
  return out;
}

export function parseVoiceContact(text: string): VoiceContact {
  const raw = String(text || "").trim();
  const normalized = stripVoiceText(raw);
  const contact: VoiceContact = {};

  const emailish = raw
    .toLocaleLowerCase("hu-HU")
    .replace(/\s+kukac\s+/gi, "@")
    .replace(/\s+pont\s+/gi, ".")
    .replace(/\s+/g, "");
  const emailMatch = emailish.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (emailMatch) contact.email = emailMatch[0];

  const directPhone = raw.match(/\+?\d[\d\s()-]{7,}/);
  if (directPhone) {
    const cleaned = directPhone[0].replace(/[^0-9+]/g, "");
    if (cleaned.replace(/\D/g, "").length >= 8) contact.phone = cleaned;
  } else {
    const digits = spokenDigits(raw);
    if (digits.length >= 8) contact.phone = digits.startsWith("36") ? `+${digits}` : digits;
  }

  const namePatterns = [
    /(?:a nevem|nevem|en vagyok|nevem az hogy)\s+(.+)/i,
    /(?:foglalas neve|foglalasi nev)\s+(.+)/i,
  ];
  for (const pattern of namePatterns) {
    const match = raw.match(pattern);
    if (match?.[1]) {
      const candidate = match[1].replace(/\b(?:a telefonszamom|telefonszamom|az email cimem|email cimem).*$/i, "").trim();
      if (candidate.length >= 2 && candidate.length <= 80) contact.name = candidate;
      break;
    }
  }

  if (!contact.name && normalized && !contact.email && !contact.phone && normalized.split(" ").length >= 2 && normalized.split(" ").length <= 5) {
    if (!/(masik|elso|masodik|harmadik|kesobb|korabban|megerosit|foglal|szalon|szolgaltatas|holnap|pentek|kedd|szerda|csutortok|szombat|vasarnap)/.test(normalized)) {
      contact.name = raw;
    }
  }

  return contact;
}

export function parseSlotCommand(text: string): VoiceSlotCommand {
  const t = stripVoiceText(text);
  if (/\b(elso|az elso|elso jo)\b/.test(t)) return { type: "index", index: 0 };
  if (/\b(masodik|a masodik)\b/.test(t)) return { type: "index", index: 1 };
  if (/\b(harmadik|a harmadik)\b/.test(t)) return { type: "index", index: 2 };
  if (t.includes("kesobb") || t.includes("kesobbi")) return { type: "later" };
  if (t.includes("korabban") || t.includes("korabbi")) return { type: "earlier" };
  if (t.includes("masik szakember") || t.includes("mas szakember")) return { type: "other_employee" };
  if (t.includes("masik nap") || t.includes("mas nap")) return { type: "other_day" };
  return { type: "none" };
}

export function isVoiceConfirmation(text: string) {
  const t = stripVoiceText(text);
  return ["megerositem", "foglalom", "igen ezt", "jo lesz", "rendben foglalja", "igen foglalja"].some((x) => t.includes(x));
}

export function isVoiceReset(text: string) {
  const t = stripVoiceText(text);
  return ["kezdjuk ujra", "ujrakezdes", "toroljuk", "megsem", "uj foglalas"].some((x) => t.includes(x));
}
