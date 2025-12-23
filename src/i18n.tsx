import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "hu" | "en" | "ru";

type TranslationDict = Record<string, string>;

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "kleo_lang";

const translations: Record<Language, TranslationDict> = {
  hu: {
    "lang.name": "Magyar",

    // MENÜK
    "menu.salons": "Szalonjaink",
    "menu.pricesServices": "Áraink és Szolgáltatásaink",
    "menu.webshop": "Webshop",
    "menu.contact": "Kapcsolat",
    "menu.about": "Rólunk",
    "menu.loyalty": "Hűségprogram",
    "menu.franchise": "Franchise",
    "menu.career": "Karrier",
    "menu.education": "Oktatás",

    // FEJLÉC
    "header.booking": "Időpontfoglalás",
    "header.followUs": "Kövess minket",
    "header.language.label": "Nyelvválasztó",

    // HERO BLOKK
    "home.hero.kicker": "KLEOPÁTRA SZÉPSÉGSZALONOK · TÖBB MINT 30 ÉVE",
    "home.hero.title.prefix": "Éld át a ",
    "home.hero.title.highlight": "Kleopátra-élményt",
    "home.hero.title.suffix":
      " – prémium szépségszolgáltatások, akár bejelentkezés nélkül.",
    "home.hero.lead":
      "Fodrászat, kozmetika, manikűr–pedikűr, szolárium és masszázs egy helyen. Tapasztalt szakembereinkkel és minőségi termékeinkkel várunk minden szalonunkban.",
    "home.hero.pill.hair": "Fodrászat",
    "home.hero.pill.beauty": "Kozmetika",
    "home.hero.pill.handsFeet": "Kéz- és lábápolás",
    "home.hero.pill.solarium": "Szolárium",
    "home.hero.pill.massage": "Masszázs",
    "home.hero.cta.book": "Időpontfoglalás / szalonok",
    "home.hero.cta.services": "Szolgáltatásaink",
    "home.hero.media.webshop": "Webshop",
    "home.hero.media.appChip": "Töltsd le mobilalkalmazásunkat",

    // HOME – LINKCSÍKOK
    "home.strips.franchise": "Franchise program",
    "home.strips.app": "Mobilalkalmazás",
    "home.strips.newsletter": "Hűségprogram / hírlevél",
    "home.strips.contact": "Kapcsolat",

    // HOME – FRANCHISE BLOKK
    "home.franchise.kicker": "Franchise program",
    "home.franchise.title": "Építsd fel saját Kleopátra Szépségszalonod!",
    "home.franchise.lead":
      "Csatlakozz országos hálózatunkhoz, és használd ki a több mint 30 év tapasztalatát, kész üzleti modellünket és marketingtámogatásunkat.",
    "home.franchise.bullet1": "Országosan ismert, bejáratott márkanév",
    "home.franchise.bullet2": "Marketing és grafikai támogatás központból",
    "home.franchise.bullet3": "HR-támogatás, folyamatos képzések és oktatás",
    "home.franchise.bullet4": "Kedvezményes eszköz- és anyagbeszerzés",
    "home.franchise.bullet5": "Központi ügyfélmenedzsment és foglalási rendszer",
    "home.franchise.cta": "Tovább a franchise programra",
    "home.franchise.imageAlt": "Kleopátra franchise hálózat",

    // HOME – MOBILAPP BLOKK
    "home.app.kicker": "Mobilalkalmazás",
    "home.app.title": "Kleopátra mobilapp – foglalj bárhonnan",
    "home.app.lead":
      "Időpontfoglalás, kezeléstörténet és személyre szabott ajánlatok – minden egyetlen alkalmazásban.",
    "home.app.bullet1": "Gyors időpontfoglalás pár kattintással",
    "home.app.bullet2": "Kezeléstörténet és kedvenc szolgáltatások",
    "home.app.bullet3": "Push értesítések akciókról, újdonságokról",
    "home.app.bullet4": "Digitális hűségkártya és kedvezmények",
    "home.app.cta.primary": "Letöltés – hamarosan",
    "home.app.cta.secondary": "További információ",
    "home.app.imageAlt": "Kleopátra mobilalkalmazás",

    // HOME – AJÁNDÉKUTALVÁNYOK BLOKK
    "home.vouchers.kicker": "Ajándékutalványok",
    "home.vouchers.title": "Ajándékozz Kleopátra-élményt",
    "home.vouchers.lead1":
      "Ajándékutalványainkkal biztosan örömet szerzel – a megajándékozott maga választhatja ki a számára legkedvesebb szolgáltatást.",
    "home.vouchers.lead2":
      "Többféle értékben elérhető utalványainkat online is megvásárolhatod, akár azonnali e-mailes kézbesítéssel.",
    "home.vouchers.badge": "Ajándékba – születésnapra, évfordulóra, ünnepekre",
    "home.vouchers.cta": "Ajándékutalványok a webshopban",
    "home.vouchers.imageAlt": "Ajándékutalványok Kleopátra Szépségszalon",

    // HOME – HŰSÉG / HÍRLEVÉL BLOKK
    "home.newsletter.kicker": "Hűségprogram és hírlevél",
    "home.newsletter.titlePrefix": "Csatlakozz hűségprogramunkhoz, és már az első alkalommal",
    "home.newsletter.titleSuffix": "kedvezményt kapsz a kezeléseidből.",
    "home.newsletter.lead":
      "Értesülj elsőként újdonságainkról, akcióinkról, eseményeinkről, és gyűjts extra kedvezményeket.",
    "home.newsletter.cta": "Tovább a hűségprogramhoz",

    // HOME – KLEOS TERMÉKEK BLOKK
    "home.products.kicker": "Kleos termékek",
    "home.products.title": "100% Kleopátrás megjelenés – vedd magadra az élményt!",
    "home.products.lead1":
      "Limitált kollekciós termékeinkkel a Kleopátra-élményt a mindennapjaidba is magaddal viheted.",
    "home.products.lead2":
      "Válaszd ki kedvenc darabjaid – stílusos, igényes kiegészítők és ajándéktárgyak várnak webshopunkban.",
    "home.products.cta": "Tovább a webshopba",
    "home.products.imageAlt": "Kleos termékek – ajándéktárgyak és kiegészítők",

    // HOME – SZOLGÁLTATÁS ÁTTEKINTÉS BLOKK
    "home.services.kicker": "Szolgáltatásaink",
    "home.services.title": "Minden, amire a szépségednek szüksége lehet",
    "home.services.lead":
      "Nálunk egy helyen éred el a teljes szépségszolgáltatás-palettát – a frizurától a bőrápoláson át a teljes megújulásig.",

    // SZOLGÁLTATÁSKÁRTYÁK SZÖVEGE (HOME + SZOLGÁLTATÁSOK OLDAL)
    "services.cards.hair.title": "Fodrászat",
    "services.cards.hair.text":
      "Női, férfi és gyermek hajvágás, festés, melír, balayage, hajkezelések és alkalmi frizurák – prémium termékekkel.",
    "services.cards.hair.cta": "Árak és fodrászati szolgáltatások",

    "services.cards.beauty.title": "Kozmetika",
    "services.cards.beauty.text":
      "Arckezelések, gépi kezelések, smink és szemöldökformázás – a klasszikus és modern szépségápolás találkozása.",
    "services.cards.beauty.cta": "Árak és kozmetikai szolgáltatások",

    "services.cards.handsFeet.title": "Kéz- és lábápolás",
    "services.cards.handsFeet.text":
      "Manikűr, gél lakk, műköröm, pedikűr – ápolt kezek és lábak a mindennapokra és különleges alkalmakra.",
    "services.cards.handsFeet.cta": "Kéz- és lábápolás árlista",

    "services.cards.solarium.title": "Szolárium",
    "services.cards.solarium.text":
      "Modern szoláriumgépek, átgondolt bérletes konstrukciók – barnulj biztonságosan, szakértői iránymutatással.",
    "services.cards.solarium.cta": "Szolárium árak és bérletek",

    "services.cards.massage.title": "Masszázs",
    "services.cards.massage.text":
      "Frissítő, relaxáló és célzott masszázsok, amelyek segítenek oldani a mindennapi feszültséget.",
    "services.cards.massage.cta": "Masszázs szolgáltatások",

    "services.cards.fitness.title": "Fitness / Wellness",
    "services.cards.fitness.text":
      "Gyöngyösi fitnesz- és wellness szolgáltatásainkkal a teljes testi-lelki megújulást célozzuk.",
    "services.cards.fitness.cta": "Fitness és wellness részletek",

  },

  en: {
    "lang.name": "English",

    "menu.salons": "Our salons",
    "menu.pricesServices": "Prices & Services",
    "menu.webshop": "Webshop",
    "menu.contact": "Contact",
    "menu.about": "About us",
    "menu.loyalty": "Loyalty program",
    "menu.franchise": "Franchise",
    "menu.career": "Career",
    "menu.education": "Education",

    "header.booking": "Book an appointment",
    "header.followUs": "Follow us",
    "header.language.label": "Language selector",

    "home.hero.kicker": "KLEOPATRA BEAUTY SALONS · OVER 30 YEARS",
    "home.hero.title.prefix": "Feel the ",
    "home.hero.title.highlight": "Cleopatra Experience",
    "home.hero.title.suffix":
      " – premium beauty services, even without appointment.",
    "home.hero.lead":
      "Hairdressing, beauty, manicure & pedicure, solarium and massage in one place. Our experienced professionals and high-quality products welcome you in all our salons.",
    "home.hero.pill.hair": "Hairdressing",
    "home.hero.pill.beauty": "Beauty",
    "home.hero.pill.handsFeet": "Hands & feet care",
    "home.hero.pill.solarium": "Solarium",
    "home.hero.pill.massage": "Massage",
    "home.hero.cta.book": "Book an appointment / salons",
    "home.hero.cta.services": "Our services",
    "home.hero.media.webshop": "Webshop",
    "home.hero.media.appChip": "Download our mobile app",

    // HOME – STRIPS
    "home.strips.franchise": "Franchise program",
    "home.strips.app": "Mobile app",
    "home.strips.newsletter": "Loyalty / newsletter",
    "home.strips.contact": "Contact",

    // HOME – FRANCHISE BLOCK
    "home.franchise.kicker": "Franchise program",
    "home.franchise.title": "Build your own Kleopátra Beauty Salon!",
    "home.franchise.lead":
      "Join our nationwide network and benefit from more than 30 years of experience, a proven business model and strong marketing support.",
    "home.franchise.bullet1": "Well-known, established brand",
    "home.franchise.bullet2": "Central marketing and design support",
    "home.franchise.bullet3": "HR support, continuous trainings and education",
    "home.franchise.bullet4": "Discounted equipment and material procurement",
    "home.franchise.bullet5": "Central customer management and booking system",
    "home.franchise.cta": "More about the franchise program",
    "home.franchise.imageAlt": "Kleopátra franchise network",

    // HOME – APP BLOCK
    "home.app.kicker": "Mobile app",
    "home.app.title": "Kleopátra mobile app – book from anywhere",
    "home.app.lead":
      "Appointment booking, treatment history and personalized offers – all in a single app.",
    "home.app.bullet1": "Fast booking in just a few taps",
    "home.app.bullet2": "Treatment history and favourite services",
    "home.app.bullet3": "Push notifications about news and offers",
    "home.app.bullet4": "Digital loyalty card and discounts",
    "home.app.cta.primary": "Download – coming soon",
    "home.app.cta.secondary": "More information",
    "home.app.imageAlt": "Kleopátra mobile application",

    // HOME – VOUCHERS BLOCK
    "home.vouchers.kicker": "Gift vouchers",
    "home.vouchers.title": "Give the Kleopátra experience as a gift",
    "home.vouchers.lead1":
      "With our gift vouchers you will surely make someone happy – the recipient can choose the service they like the most.",
    "home.vouchers.lead2":
      "Our vouchers are available in several values and can also be purchased online with instant e-mail delivery.",
    "home.vouchers.badge": "Perfect as a present – for birthdays, anniversaries and holidays",
    "home.vouchers.cta": "Gift vouchers in the webshop",
    "home.vouchers.imageAlt": "Gift vouchers – Kleopátra Beauty Salon",

    // HOME – NEWSLETTER / LOYALTY BLOCK
    "home.newsletter.kicker": "Loyalty program & newsletter",
    "home.newsletter.titlePrefix": "Join our loyalty program and already on your first visit",
    "home.newsletter.titleSuffix": "you receive a discount from your treatments.",
    "home.newsletter.lead":
      "Be the first to hear about our news, special offers and events, and collect extra discounts.",
    "home.newsletter.cta": "Go to the loyalty program",

    // HOME – PRODUCTS BLOCK
    "home.products.kicker": "Kleos products",
    "home.products.title": "100% Kleopátra style – wear the experience!",
    "home.products.lead1":
      "With our limited collection products you can take the Kleopátra experience with you into your everyday life.",
    "home.products.lead2":
      "Choose your favourites – stylish, high-quality accessories and gifts are waiting in our webshop.",
    "home.products.cta": "Go to the webshop",
    "home.products.imageAlt": "Kleos products – gifts and accessories",

    // HOME – SERVICES OVERVIEW BLOCK
    "home.services.kicker": "Services",
    "home.services.title": "Everything your beauty may need",
    "home.services.lead":
      "With us you can reach the full beauty service palette in one place – from your hairstyle and skincare to complete renewal.",

    // SERVICE CARDS (HOME + SERVICES PAGE)
    "services.cards.hair.title": "Hairdressing",
    "services.cards.hair.text":
      "Women’s, men’s and children’s cuts, colouring, highlights, balayage, treatments and special occasion hairstyles with premium products.",
    "services.cards.hair.cta": "Hairdressing prices & services",

    "services.cards.beauty.title": "Beauty",
    "services.cards.beauty.text":
      "Facial treatments, machine treatments, make-up and brow styling – where classic and modern beauty meet.",
    "services.cards.beauty.cta": "Beauty prices & services",

    "services.cards.handsFeet.title": "Hands & feet care",
    "services.cards.handsFeet.text":
      "Manicure, gel polish, artificial nails, pedicure – well-groomed hands and feet for everyday life and special occasions.",
    "services.cards.handsFeet.cta": "Hands & feet price list",

    "services.cards.solarium.title": "Solarium",
    "services.cards.solarium.text":
      "Modern solarium machines with thoughtful pass systems – tan safely with expert guidance.",
    "services.cards.solarium.cta": "Solarium prices & passes",

    "services.cards.massage.title": "Massage",
    "services.cards.massage.text":
      "Refreshing, relaxing and targeted massages to help you release everyday tension.",
    "services.cards.massage.cta": "Massage services",

    "services.cards.fitness.title": "Fitness / Wellness",
    "services.cards.fitness.text":
      "With our fitness and wellness services in Gyöngyös we aim for complete physical and mental renewal.",
    "services.cards.fitness.cta": "Fitness & wellness details",

  },

  ru: {
    "lang.name": "Русский",

    "menu.salons": "Наши салоны",
    "menu.pricesServices": "Цены и услуги",
    "menu.webshop": "Интернет-магазин",
    "menu.contact": "Контакты",
    "menu.about": "О нас",
    "menu.loyalty": "Программа лояльности",
    "menu.franchise": "Франшиза",
    "menu.career": "Карьера",
    "menu.education": "Обучение",

    "header.booking": "Записаться",
    "header.followUs": "Подписывайтесь на нас",
    "header.language.label": "Выбор языка",

    "home.hero.kicker": "САЛОНЫ КЛЕОПАТРА · БОЛЕЕ 30 ЛЕТ ОПЫТА",
    "home.hero.title.prefix": "Испытай ",
    "home.hero.title.highlight": "эффект Клеопатры",
    "home.hero.title.suffix":
      " – премиальные бьюти-услуги, даже без предварительной записи.",
    "home.hero.lead":
      "Парикмахерские услуги, косметология, маникюр и педикюр, солярий и массаж в одном месте. Опытные специалисты и качественная косметика ждут тебя во всех наших салонах.",
    "home.hero.pill.hair": "Парикмахерская",
    "home.hero.pill.beauty": "Косметология",
    "home.hero.pill.handsFeet": "Уход за руками и ногами",
    "home.hero.pill.solarium": "Солярий",
    "home.hero.pill.massage": "Массаж",
    "home.hero.cta.book": "Записаться / салоны",
    "home.hero.cta.services": "Наши услуги",
    "home.hero.media.webshop": "Интернет-магазин",
    "home.hero.media.appChip": "Скачай наше мобильное приложение",

    // HOME – STRIPS
    "home.strips.franchise": "Франшиза",
    "home.strips.app": "Мобильное приложение",
    "home.strips.newsletter": "Лояльность / рассылка",
    "home.strips.contact": "Контакты",

    // HOME – FRANCHISE BLOCK
    "home.franchise.kicker": "Франшиза",
    "home.franchise.title": "Открой свой салон Kleopátra!",
    "home.franchise.lead":
      "Присоединяйся к нашей сети и используй более чем 30-летний опыт, отработанную бизнес-модель и маркетинговую поддержку.",
    "home.franchise.bullet1": "Известный и сильный бренд",
    "home.franchise.bullet2": "Централизованная маркетинговая и дизайнерская поддержка",
    "home.franchise.bullet3": "HR-поддержка, постоянные тренинги и обучение",
    "home.franchise.bullet4": "Выгодные закупки оборудования и материалов",
    "home.franchise.bullet5": "Централизованная CRM и система записи",
    "home.franchise.cta": "Подробнее о франшизе",
    "home.franchise.imageAlt": "Франчайзинговая сеть Kleopátra",

    // HOME – APP BLOCK
    "home.app.kicker": "Мобильное приложение",
    "home.app.title": "Мобильное приложение Kleopátra – запись из любой точки",
    "home.app.lead":
      "Онлайн-запись, история процедур и персональные предложения – всё в одном приложении.",
    "home.app.bullet1": "Быстрая запись в несколько кликов",
    "home.app.bullet2": "История процедур и избранные услуги",
    "home.app.bullet3": "Push-уведомления об акциях и новостях",
    "home.app.bullet4": "Цифровая карта лояльности и скидки",
    "home.app.cta.primary": "Скачать – скоро",
    "home.app.cta.secondary": "Подробнее",
    "home.app.imageAlt": "Мобильное приложение Kleopátra",

    // HOME – VOUCHERS BLOCK
    "home.vouchers.kicker": "Подарочные сертификаты",
    "home.vouchers.title": "Подари опыт Kleopátra",
    "home.vouchers.lead1":
      "С нашими подарочными сертификатами ты точно порадуешь близких – получатель сам выбирает нужную услугу.",
    "home.vouchers.lead2":
      "Сертификаты доступны в нескольких номиналах и их можно приобрести онлайн с мгновенной e-mail доставкой.",
    "home.vouchers.badge":
      "Идеальный подарок – на день рождения, юбилей или праздники",
    "home.vouchers.cta": "Подарочные сертификаты в интернет-магазине",
    "home.vouchers.imageAlt": "Подарочные сертификаты салонов Kleopátra",

    // HOME – NEWSLETTER / LOYALTY BLOCK
    "home.newsletter.kicker": "Программа лояльности и рассылка",
    "home.newsletter.titlePrefix":
      "Присоединись к нашей программе лояльности и уже при первом визите",
    "home.newsletter.titleSuffix": "получи скидку на процедуры.",
    "home.newsletter.lead":
      "Узнавай первым о новостях, акциях и мероприятиях и получай дополнительные скидки.",
    "home.newsletter.cta": "Перейти к программе лояльности",

    // HOME – PRODUCTS BLOCK
    "home.products.kicker": "Продукция Kleos",
    "home.products.title":
      "Стиль Kleopátra на 100% – носи это ощущение каждый день!",
    "home.products.lead1":
      "С нашей лимитированной коллекцией ты можешь взять опыт Kleopátra с собой в повседневную жизнь.",
    "home.products.lead2":
      "Выбери любимые предметы – стильные аксессуары и подарки ждут тебя в интернет-магазине.",
    "home.products.cta": "Перейти в интернет-магазин",
    "home.products.imageAlt": "Продукты Kleos – аксессуары и подарки",

    // HOME – SERVICES OVERVIEW BLOCK
    "home.services.kicker": "Услуги",
    "home.services.title": "Всё, что нужно твоей красоте",
    "home.services.lead":
      "У нас ты найдешь полный спектр услуг красоты в одном месте – от причёски и ухода за кожей до полного обновления.",

    // SERVICE CARDS (HOME + SERVICES PAGE)
    "services.cards.hair.title": "Парикмахерские услуги",
    "services.cards.hair.text":
      "Женские, мужские и детские стрижки, окрашивание, мелирование, балаяж, уходы и праздничные прически с премиальной косметикой.",
    "services.cards.hair.cta": "Цены и парикмахерские услуги",

    "services.cards.beauty.title": "Косметология",
    "services.cards.beauty.text":
      "Уходы за лицом, аппаратные процедуры, макияж и оформление бровей – сочетание классики и современных решений.",
    "services.cards.beauty.cta": "Цены и косметологические услуги",

    "services.cards.handsFeet.title": "Уход за руками и ногами",
    "services.cards.handsFeet.text":
      "Маникюр, гель-лак, наращивание ногтей, педикюр – ухоженные руки и ноги на каждый день и для особых случаев.",
    "services.cards.handsFeet.cta": "Прайс на уход за руками и ногами",

    "services.cards.solarium.title": "Солярий",
    "services.cards.solarium.text":
      "Современные солярии с продуманной системой абонементов – безопасный загар под контролем специалистов.",
    "services.cards.solarium.cta": "Цены и абонементы солярия",

    "services.cards.massage.title": "Массаж",
    "services.cards.massage.text":
      "Освежающие, расслабляющие и целевые массажи, которые помогают снять напряжение повседневной жизни.",
    "services.cards.massage.cta": "Массажные услуги",

    "services.cards.fitness.title": "Фитнес / Wellness",
    "services.cards.fitness.text":
      "В нашем фитнес- и велнес-центре в Дьендьёше мы стремимся к полной физической и ментальной перезагрузке.",
    "services.cards.fitness.cta": "Подробнее о фитнесе и wellness",

  },
};

const I18nContext = createContext<I18nContextValue>({
  lang: "hu",
  setLang: () => undefined,
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>("hu");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "hu" || stored === "en" || stored === "ru") {
        setLangState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (value: Language) => {
    setLangState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const t = useMemo(
    () => (key: string) =>
      translations[lang]?.[key] ?? translations["hu"]?.[key] ?? key,
    [lang]
  );

  const ctxValue = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, t]
  );

  return (
    <I18nContext.Provider value={ctxValue}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
