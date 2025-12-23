
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import "../styles/franchiseLanding.css";

type Lang = "hu" | "en" | "ru";

type Copy = {
  heroTitle: string;
  heroSub: string;
  videoTitle: string;
  videoSub: string;

  introTitle: string;
  introLead: string;
  introBullets: string[];

  targetTitle: string;
  targetLeftTitle: string;
  targetLeftLead: string;
  targetLeftBullets: string[];
  targetRightTitle: string;
  targetRightLead: string;
  targetRightBullets: string[];

  brandTitle: string;
  brandLead: string;

  supportTitle: string;
  supportLead: string;

  flexibleTitle: string;
  flexibleLead: string;

  existingTitle: string;
  existingLead: string;
  existingBullets: string[];

  whyTitle: string;
  whyLead: string;
  whyBullets: string[];

  quoteText: string;
  quoteBy: string;

  locationsTitle: string;
  locationsLead: string;
  locationsList: string;

  investmentTitle: string;
  investmentLead: string;

  formTitle: string;
  formLead: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  consentText: string;
  cta: string;
  microcopy: string;
};

function getCopy(lang: Lang): Copy {
  const hu: Copy = {
    heroTitle: "Így indíts vagy fejlessz nyereséges szépségszalont <em>biztos háttérrel</em> – nulláról vagy működő üzletből.",
    heroSub: "Ismerd meg a Kleopátra Szépségszalonok franchise rendszerét, amivel befektetőként, karrierváltóként vagy jelenlegi szalontulajdonosként is komoly, de tervezhető befektetéssel építhetsz stabilan működő szépségszalont.",
    videoTitle: "Videó hamarosan",
    videoSub: "Ismerd meg a Kleopátra franchise rendszerét",

    introTitle: "Szeretnél egy olyan szépségszalont, ami nem csak szép, hanem profitábilis is?",
    introLead: "A Kleopátra franchise-ban egy kipróbált működési rendszert kapsz – nem magadtól kell mindent kitalálnod.",
    introBullets: [
      "Bevezetett márkanév és egységes arculat",
      "Kész folyamatok, protokollok, képzés és minőségbiztosítás",
      "Marketing és online jelenlét – központi támogatással",
    ],

    targetTitle: "Kinek szól a Kleopátra franchise?",
    targetLeftTitle: "Akik új szalont indítanának",
    targetLeftLead: "Ha most vágnál bele szépségszalon nyitásába, és kipróbált rendszerrel szeretnél indulni.",
    targetLeftBullets: [
      "Bevezetett márkanév és kész arculati csomag",
      "Kidolgozott nyitási folyamatok és szakmai háttér",
      "Segítség a lokáció, szolgáltatás-portfólió és árképzés kialakításában",
    ],
    targetRightTitle: "Már működő szalon tulajdonosainak",
    targetRightLead: "Ha meglévő szalonodat erős márkával és szervezett háttérrel fejlesztenéd tovább.",
    targetRightBullets: [
      "Rebranding Kleopátra arculatra",
      "Egységes működési és minőségbiztosítási rendszer",
      "Központi marketing és online jelenlét",
      "Folyamatos szakmai és üzleti támogatás",
    ],

    brandTitle: "Ismert márka",
    brandLead: "A Kleopátra Szépségszalonok több évtizede van jelen a piacon, vendégkörrel és hiteles szakmai múlttal. A csatlakozó szalon azonnal egy bevezetett márkanévhez kapcsolódik.",

    supportTitle: "Teljes szakmai támogatás",
    supportLead: "Rendszeres képzéseket, egységes szakmai protokollokat, marketing- és üzletfejlesztési támogatást biztosítunk, hogy a mindennapi működésed kiszámítható legyen.",

    flexibleTitle: "Rugalmas konstrukció",
    flexibleLead: "A franchise-modellt a helyi sajátosságokhoz igazítjuk: a szolgáltatás-portfóliót, a nyitvatartást és a csapatméretet közösen alakítjuk ki, a Kleopátra-minőség megtartása mellett.",

    existingTitle: "Ha már van szalonod",
    existingLead: "A leggyakoribb kihívások, amikre rendszerszinten adunk megoldást:",
    existingBullets: [
      "Ingadozó vendégforgalom és kihasználtság",
      "Szétcsúszó folyamatok, változó minőség",
      "Marketing idő- és tudáshiány",
      "Árképzés és kapacitás menedzsment nehézségek",
    ],

    whyTitle: "Miért pont Kleopátra?",
    whyLead: "A franchise nem csak logó – komplett működési és támogatási rendszer.",
    whyBullets: [
      "Arculati kézikönyv és egységes brand",
      "Képzési és betanítási rendszer",
      "Központi kampányok + lokális marketing támogatás",
      "Operációs know-how és minőségbiztosítás",
    ],

    quoteText: "„A célunk, hogy olyan partnerekkel dolgozzunk, akik hosszú távon, kiszámíthatóan szeretnének fejlődni – és ehhez stabil rendszert keresnek.”",
    quoteBy: "— Kleopátra franchise csapat",

    locationsTitle: "Hol keresünk partnereket?",
    locationsLead: "Elsősorban olyan városokban, ahol van fizetőképes kereslet és hely a prémium szolgáltatásoknak. Ha a te városod nincs a listában, akkor is érdemes jelentkezned.",
    locationsList: "Eger • Gyöngyös • Hatvan • Budapest • Debrecen • Szeged • Pécs • Miskolc (és további városok)",

    investmentTitle: "Mekkora befektetés?",
    investmentLead: "A belépés tervezhető, a részleteket és a megtérülési számokat az első egyeztetésen mutatjuk meg – a cél egy stabilan működő, profitábilis szalon.",

    formTitle: "Kérj részleteket – és egyeztessünk",
    formLead: "Add meg az elérhetőségeidet, és felvesszük veled a kapcsolatot.",
    nameLabel: "Név",
    emailLabel: "E-mail",
    phoneLabel: "Telefonszám",
    consentText: "Hozzájárulok, hogy a Kleopátra Szépségszalonok a megadott adataimat kapcsolatfelvétel és franchise tájékoztatás céljából kezelje.",
    cta: "Kérem a részleteket",
    microcopy: "A küldés után egy köszönő oldalra irányítunk. Az adatok a kampányokhoz szegmentálhatók (forrás/variáns/nyelv).",
  };

  const en: Copy = {
    ...hu,
    heroTitle: "Start or scale a profitable beauty salon with <em>solid backing</em> – from zero or from an existing business.",
    heroSub: "Discover the Kleopátra Beauty Salons franchise system. As an investor, career-changer or current salon owner, you can build a stable, profitable salon with a serious but planned investment.",
    videoTitle: "Video coming soon",
    videoSub: "Learn how the Kleopátra franchise works",
    introTitle: "Want a beauty salon that is not only beautiful, but profitable?",
    introLead: "With Kleopátra franchise you get a proven operating system – you don’t have to invent everything yourself.",
    introBullets: [
      "Established brand and consistent identity",
      "Ready processes, protocols, training and QA",
      "Marketing and online presence with central support",
    ],
    targetTitle: "Who is the Kleopátra franchise for?",
    targetLeftTitle: "Those starting a new salon",
    targetLeftLead: "If you are opening a salon now and want to start with a proven system.",
    targetRightTitle: "Owners of existing salons",
    targetRightLead: "If you want to upgrade your current salon with a strong brand and organized support.",
    brandTitle: "Recognized brand",
    brandLead: "Kleopátra has been present on the market for decades with an established clientele and credible professional track record.",
    supportTitle: "Full professional support",
    supportLead: "We provide training, protocols, marketing and business development support to keep your daily operations predictable.",
    flexibleTitle: "Flexible model",
    flexibleLead: "We adapt the model to local specifics while keeping Kleopátra quality standards.",
    existingTitle: "If you already have a salon",
    existingLead: "Common challenges we solve at system level:",
    whyTitle: "Why Kleopátra?",
    whyLead: "This is not just a logo – it’s a complete operating and support system.",
    quoteBy: "— Kleopátra franchise team",
    locationsTitle: "Where are we looking for partners?",
    locationsLead: "We prioritize cities with strong demand for premium services. If your city is not listed, you can still apply.",
    investmentTitle: "How much investment is needed?",
    investmentLead: "Entry is planned; we share details and payback scenarios in the first call – the goal is a stable, profitable salon.",
    formTitle: "Request details – let’s talk",
    formLead: "Leave your contact details and we will reach out.",
    nameLabel: "Name",
    phoneLabel: "Phone",
    consentText: "I agree that Kleopátra Beauty Salons may process my data to contact me and provide franchise information.",
    cta: "Send",
  };

  const ru: Copy = {
    ...hu,
    heroTitle: "Откройте или развивайте прибыльный салон красоты с <em>надёжной поддержкой</em> — с нуля или на базе действующего бизнеса.",
    heroSub: "Познакомьтесь с франчайзинговой системой Kleopátra. Как инвестор, сменивший профессию или владелец салона, вы сможете построить стабильный и прибыльный бизнес при серьёзных, но планируемых вложениях.",
    videoTitle: "Видео скоро",
    videoSub: "Узнайте, как работает франшиза Kleopátra",
    introTitle: "Хотите салон красоты, который не только красивый, но и прибыльный?",
    introLead: "Во франшизе Kleopátra вы получаете проверенную операционную систему — вам не нужно всё придумывать с нуля.",
    introBullets: [
      "Известный бренд и единый стиль",
      "Готовые процессы, протоколы, обучение и контроль качества",
      "Маркетинг и онлайн‑присутствие при поддержке центра",
    ],
    targetTitle: "Кому подходит франшиза Kleopátra?",
    targetLeftTitle: "Тем, кто открывает новый салон",
    targetLeftLead: "Если вы запускаете салон и хотите стартовать на проверенной системе.",
    targetRightTitle: "Владельцам действующих салонов",
    targetRightLead: "Если вы хотите усилить текущий салон сильным брендом и системной поддержкой.",
    brandTitle: "Известный бренд",
    brandLead: "Kleopátra работает на рынке десятилетиями, имеет стабильную клиентскую базу и профессиональную репутацию.",
    supportTitle: "Полная профессиональная поддержка",
    supportLead: "Обучение, единые протоколы, маркетинг и бизнес‑поддержка для предсказуемой ежедневной работы.",
    flexibleTitle: "Гибкая модель",
    flexibleLead: "Мы адаптируем модель под местные особенности, сохраняя стандарты качества Kleopátra.",
    existingTitle: "Если у вас уже есть салон",
    existingLead: "Частые проблемы, которые мы решаем системно:",
    whyTitle: "Почему Kleopátra?",
    whyLead: "Это не просто логотип — это полноценная операционная и поддерживающая система.",
    quoteBy: "— Команда франшизы Kleopátra",
    locationsTitle: "Где мы ищем партнёров?",
    locationsLead: "Мы ориентируемся на города со спросом на премиальные услуги. Если вашего города нет в списке — всё равно оставьте заявку.",
    investmentTitle: "Какой объём инвестиций нужен?",
    investmentLead: "Вложения планируемые; детали и сценарии окупаемости показываем на первом созвоне — цель: стабильный прибыльный салон.",
    formTitle: "Запросить детали — свяжемся",
    formLead: "Оставьте контакты, и мы вам напишем/позвоним.",
    nameLabel: "Имя",
    emailLabel: "E-mail",
    phoneLabel: "Телефон",
    consentText: "Я согласен(на), что Kleopátra может обрабатывать мои данные для связи и предоставления информации о франшизе.",
    cta: "Отправить",
  };

  return lang === "en" ? en : lang === "ru" ? ru : hu;
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.3 5.1L18 9l-4.7 1.9L12 16l-1.3-5.1L6 9l4.7-1.9L12 2zm7.2 7.2l.7 2.6 2.6.7-2.6.7-.7 2.6-.7-2.6-2.6-.7 2.6-.7.7-2.6zM4.8 14.2l.7 2.6 2.6.7-2.6.7-.7 2.6-.7-2.6-2.6-.7 2.6-.7.7-2.6z" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7l10 5-10 5V7z" />
    </svg>
  );
}

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  source: string;
  variant: string;
  lang: Lang;
  extra?: Record<string, string>;
};

async function submitLead(payload: LeadPayload) {
  const endpoint =
    (import.meta as any).env?.VITE_LEAD_ENDPOINT ||
    (import.meta as any).env?.VITE_MAILCHIMP_PROXY ||
    "/api/lead";

  // If you have Mailchimp form action URL you can set:
  // VITE_MAILCHIMP_FORM_URL=https://xxxx.list-manage.com/subscribe/post?u=...&id=...
  const mailchimpFormUrl = (import.meta as any).env?.VITE_MAILCHIMP_FORM_URL;

  if (mailchimpFormUrl) {
    // Mailchimp classic form POST expects URL-encoded fields.
    const form = new URLSearchParams();
    form.set("FNAME", payload.name);
    form.set("EMAIL", payload.email);
    form.set("PHONE", payload.phone);
    form.set("SOURCE", payload.source);
    form.set("VARIANT", payload.variant);
    form.set("LANG", payload.lang);
    Object.entries(payload.extra || {}).forEach(([k, v]) => form.set(k, v));
    await fetch(mailchimpFormUrl, {
      method: "POST",
      mode: "no-cors",
      body: form,
    });
    return;
  }

  // Generic JSON endpoint (recommended in production)
  await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function LandingForm({
  variant,
  extraFields,
}: {
  variant: string;
  extraFields?: { key: string; label: (c: Copy) => string; required?: boolean }[];
}) {
  const { lang } = useI18n();
  const c = useMemo(() => getCopy(lang as Lang), [lang]);
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [extra, setExtra] = useState<Record<string, string>>({});

  const canSend =
    name.trim().length > 1 &&
    email.trim().length > 3 &&
    phone.trim().length > 5 &&
    consent &&
    !(extraFields || []).some((f) => f.required && !String(extra[f.key] || "").trim());

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await submitLead({
        name,
        email,
        phone,
        consent,
        source: "franchise",
        variant,
        lang: lang as Lang,
        extra,
      });
      nav("/franchise-koszonjuk");
    } catch (err) {
      // still route to thanks to avoid ad-campaign drop-off
      nav("/franchise-koszonjuk");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="fr-form">
        <input className="fr-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={c.nameLabel} />
        <input className="fr-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={c.emailLabel} />
        <input className="fr-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={c.phoneLabel} />
      </div>

      {(extraFields || []).length > 0 && (
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {(extraFields || []).map((f) => (
            <input
              key={f.key}
              className="fr-input"
              value={extra[f.key] || ""}
              onChange={(e) => setExtra((p) => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.label(c)}
            />
          ))}
        </div>
      )}

      <label className="fr-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{c.consentText}</span>
      </label>

      <button className="fr-btn" disabled={!canSend || busy} type="submit">
        {busy ? "..." : c.cta}
      </button>
      <div className="fr-mini">{c.microcopy}</div>
    </form>
  );
}

export { getCopy, LandingForm, SparkleIcon, PlayIcon };
