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

    // ABOUT PAGE
    "about.eyebrow": "Rólunk",
    "about.title": "Miért válaszd a Kleopátra Szépségszalonokat?",
    "about.lead":
      "Célunk, hogy a lehető legrövidebb idő alatt, a legtöbb szépségápolási szolgáltatást egy helyen biztosítsuk számodra, egységes arculattal és magas szakmai színvonallal.",
    "about.card1.title": "Egységes arculat, magas színvonal",
    "about.card1.text":
      "Minden szalonunk ugyanazt a Kleopátra-élményt képviseli: képzett szakemberek, prémium termékek és következetes minőség várnak.",
    "about.card2.title": "Vendégközpontú gondolkodás",
    "about.card2.text":
      "Fontos számunkra az időd és az élmény, amit nálunk töltesz. Hosszú nyitvatartással, rugalmas bejelentkezéssel és kedves, felkészült kollégákkal várunk.",
 
    // CAREER PAGE
    "career.eyebrow": "Karrier",
    "career.title": "Építs karriert a Kleopátra Szépségszalonoknál",
    "career.lead":
      "Csatlakozz szakmai csapatunkhoz, dolgozz inspiráló környezetben, és építs hosszú távú, stabil karriert szépségipari hálózatunkban.",
    "career.card1.title": "Stabil háttér, fejlődési lehetőség",
    "career.card1.text":
      "Országos hálózatunkban folyamatos képzésekkel, szakmai támogatással és hosszú távú munkalehetőséggel várunk.",
    "career.card2.title": "Vendégközpontú szemlélet",
    "career.card2.text":
      "Hiszünk abban, hogy a jó csapat alapja a megbecsülés. Olyan kollégákat keresünk, akik számára fontos a profizmus és az empátia.",

    // LOYALTY PAGE
    "loyalty.eyebrow": "Hűségprogram",
    "loyalty.title": "Kleopátra Hűségprogram",
    "loyalty.lead":
      "Gyűjts pontokat, élvezd a személyre szabott kedvezményeket, és értesülj elsőként újdonságainkról, eseményeinkről.",
    "loyalty.card1.title": "Pontgyűjtés minden kezelés után",
    "loyalty.card1.text":
      "Minden igénybe vett szolgáltatásod után pontokat gyűjtesz, amelyeket később kedvezményekre, ajándékokra válthatsz.",
    "loyalty.card2.title": "Személyre szabott ajánlatok",
    "loyalty.card2.text":
      "Hűségprogramunk keretében olyan ajánlatokat kapsz, amelyek igazodnak kedvenc szolgáltatásaidhoz és igényeidhez.",

    // FRANCHISE PAGE
    "franchise.eyebrow": "Franchise",
    "franchise.title": "Építsd fel saját Kleopátra Szépségszalonod",
    "franchise.lead":
      "Bevált üzleti modell, ismert márkanév, központi támogatás – indítsd el saját Kleopátra szalonodat tapasztalatunkra építve.",
    "franchise.card1.title": "Bejáratott márka és arculat",
    "franchise.card1.text":
      "Nem kell a nulláról felépítened egy szépségszalont: kész arculatot, marketinget és szakmai hátteret adunk.",
    "franchise.card2.title": "Központi marketing és HR támogatás",
    "franchise.card2.text":
      "Központi rendszerünk segít a toborzásban, képzésekben és kampányokban, hogy a szalonod gyorsabban növekedhessen.",
    "franchise.card3.title": "Skálázható, hosszú távú üzlet",
    "franchise.card3.text":
      "Franchise-partnerként kiszámítható, skálázható üzleti modellt kapsz, amelyet valós piaci tapasztalatokra építettünk.",

    // SALONS PAGE
    "salons.eyebrow": "Szalonjaink",
    "salons.titlePrefix": "Jelenleg",
    "salons.titleSuffix": "Kleopátra Szépségszalonból választhatsz.",
    "salons.lead":
      "Válaszd ki a hozzád legközelebb eső szalont, és foglalj időpontot fodrászati, kozmetikai, kéz- és lábápolási, masszázs vagy szolárium szolgáltatásainkra.",
    "salons.heroAlt": "Kleopátra Szépségszalonok – országos hálózat",

    // SERVICES PAGE
    "services.eyebrow": "Szolgáltatásaink",
    "services.title": "Áraink és szolgáltatásaink",
    "services.lead":
      "Teljes szépségszolgáltatás-portfólió egy helyen: fodrászat, kozmetika, kéz- és lábápolás, szolárium, masszázs és fitness.",
    "services.heroAlt": "Kleopátra Szépségszalon – Szolgáltatások",
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

    // HOME – STRIPEK
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

    // HOME – APP BLOKK
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

    // HOME – VOUCHERS BLOKK
    "home.vouchers.kicker": "Ajándékutalványok",
    "home.vouchers.title": "Ajándékozz Kleopátra-élményt",
    "home.vouchers.lead1":
      "Ajándékutalványainkkal biztosan örömet szerzel – a megajándékozott maga választhatja ki a számára legkedvesebb szolgáltatást.",
    "home.vouchers.lead2":
      "Többféle értékben elérhető utalványainkat online is megvásárolhatod, akár azonnali e-mailes kézbesítéssel.",
    "home.vouchers.badge": "Ajándékba – születésnapra, évfordulóra, ünnepekre",
    "home.vouchers.cta": "Ajándékutalványok a webshopban",
    "home.vouchers.imageAlt": "Ajándékutalványok Kleopátra Szépségszalon",

    // HOME – NEWSLETTER / LOYALTY BLOKK
    "home.newsletter.kicker": "Hűségprogram és hírlevél",
    "home.newsletter.titlePrefix": "Csatlakozz hűségprogramunkhoz, és már az első alkalommal",
    "home.newsletter.titleSuffix": "kedvezményt kapsz a kezeléseidből.",
    "home.newsletter.lead":
      "Értesülj elsőként újdonságainkról, akcióinkról, eseményeinkről, és gyűjts extra kedvezményeket.",
    "home.newsletter.cta": "Tovább a hűségprogramhoz",

    // HOME – PRODUCTS BLOKK
    "home.products.kicker": "Kleos termékek",
    "home.products.title": "100% Kleopátrás megjelenés – vedd magadra az élményt!",
    "home.products.lead1":
      "Limitált kollekciós termékeinkkel a Kleopátra-élményt a mindennapjaidba is magaddal viheted.",
    "home.products.lead2":
      "Válaszd ki kedvenc darabjaid – stílusos, igényes kiegészítők és ajándéktárgyak várnak webshopunkban.",
    "home.products.cta": "Tovább a webshopba",
    "home.products.imageAlt": "Kleos termékek – ajándéktárgyak és kiegészítők",

    // HOME – SERVICES OVERVIEW BLOKK
    "home.services.kicker": "Szolgáltatásaink",
    "home.services.title": "Minden, amire a szépségednek szüksége lehet",
    "home.services.lead":
      "Nálunk egy helyen éred el a teljes szépségszolgáltatás-palettát – a frizurától a bőrápoláson át a teljes megújulásig.",

    // PRICELIST PAGE
    "pricelist.eyebrow": "Áraink és szolgáltatásaink",
    "pricelist.title": "Árlista és szolgáltatások",
    "pricelist.lead":
      "Válaszd ki a hozzád legközelebb eső Kleopátra Szépségszalont, és nézd meg az ott elérhető szolgáltatásokat és árakat.",
    "pricelist.location.label": "Telephely kiválasztása:",
    "pricelist.loading": "Szolgáltatások betöltése…",
    "pricelist.error": "Nem sikerült betölteni a szolgáltatásokat.",
    "pricelist.noServicesForLocation":
      "A kiválasztott telephelyen jelenleg nincs megjeleníthető szolgáltatás.",

    "pricelist.table.header.service": "Szolgáltatás",
    "pricelist.table.header.duration": "Időtartam",
    "pricelist.table.header.price": "Ár",

    "pricelist.category.hair": "Fodrászat",
    "pricelist.category.cosmetics": "Kozmetika",
    "pricelist.category.manicure": "Manikűr / műköröm",
    "pricelist.category.pedicure": "Pedikűr",
    "pricelist.category.solarium": "Szolárium",
    "pricelist.category.massage": "Masszázs",
    "pricelist.category.other": "Egyéb / kiegészítők",
    "pricelist.category.fallback": "Egyéb szolgáltatások",
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

    // ABOUT PAGE
    "about.eyebrow": "About us",
    "about.title": "Why choose Kleopátra Beauty Salons?",
    "about.lead":
      "Our goal is to provide as many beauty services as possible in one place, with a unified brand identity and consistently high professional standards.",
    "about.card1.title": "Unified brand, high quality",
    "about.card1.text":
      "All of our salons represent the same Kleopátra experience: trained professionals, premium products and reliable quality.",
    "about.card2.title": "Guest-focused approach",
    "about.card2.text":
      "We value your time and the experience you have with us. We welcome you with long opening hours, flexible booking options and a kind, professional team.",
 
    // CAREER PAGE
    "career.eyebrow": "Career",
    "career.title": "Build your career at Kleopátra Beauty Salons",
    "career.lead":
      "Join our professional team, work in an inspiring environment and build a long-term, stable career in our beauty network.",
    "career.card1.title": "Stable background, growth opportunities",
    "career.card1.text":
      "In our nationwide network we support you with continuous training, professional mentoring and long-term opportunities.",
    "career.card2.title": "Guest-centric mindset",
    "career.card2.text":
      "We believe that appreciation is the basis of a strong team. We are looking for colleagues for whom professionalism and empathy are equally important.",

    // LOYALTY PAGE
    "loyalty.eyebrow": "Loyalty program",
    "loyalty.title": "Kleopátra Loyalty Program",
    "loyalty.lead":
      "Collect points, enjoy personalized discounts and be the first to hear about our news and events.",
    "loyalty.card1.title": "Collect points after every treatment",
    "loyalty.card1.text":
      "You collect points after every service you use, and you can redeem these for discounts and gifts later.",
    "loyalty.card2.title": "Personalized offers",
    "loyalty.card2.text":
      "Within our loyalty program you receive offers tailored to your favorite services and needs.",

    // FRANCHISE PAGE
    "franchise.eyebrow": "Franchise",
    "franchise.title": "Build your own Kleopátra Beauty Salon",
    "franchise.lead":
      "Proven business model, strong brand and central support – start your own Kleopátra salon based on our experience.",
    "franchise.card1.title": "Established brand and identity",
    "franchise.card1.text":
      "You don’t have to build a salon brand from scratch: we provide a complete visual identity, marketing support and professional background.",
    "franchise.card2.title": "Central marketing and HR support",
    "franchise.card2.text":
      "Our central team helps you with recruitment, training and campaigns so that your salon can grow faster.",
    "franchise.card3.title": "Scalable long-term business",
    "franchise.card3.text":
      "As a franchise partner you receive a predictable, scalable business model built on real market experience.",

    // SALONS PAGE
    "salons.eyebrow": "Our salons",
    "salons.titlePrefix": "You can choose from",
    "salons.titleSuffix": "Kleopátra Beauty Salons at the moment.",
    "salons.lead":
      "Choose the salon closest to you and book an appointment for hairdressing, beauty, hands & feet care, massage or solarium services.",
    "salons.heroAlt": "Kleopátra Beauty Salons – nationwide network",

    // SERVICES PAGE
    "services.eyebrow": "Services",
    "services.title": "Our prices and services",
    "services.lead":
      "A complete beauty service portfolio in one place: hairdressing, beauty, hand and foot care, solarium, massage and fitness.",
    "services.heroAlt": "Kleopátra Beauty Salon – Services",
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
    "home.products.title":
      "100% Kleopátra style – wear the experience!",
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

    // PRICELIST PAGE
    "pricelist.eyebrow": "Prices & services",
    "pricelist.title": "Price list and services",
    "pricelist.lead":
      "Choose the Kleopátra Beauty Salon closest to you and see all available services and prices there.",
    "pricelist.location.label": "Select location:",
    "pricelist.loading": "Loading services…",
    "pricelist.error": "Failed to load services.",
    "pricelist.noServicesForLocation":
      "There are no services to display for the selected location at the moment.",

    "pricelist.table.header.service": "Service",
    "pricelist.table.header.duration": "Duration",
    "pricelist.table.header.price": "Price",

    "pricelist.category.hair": "Hairdressing",
    "pricelist.category.cosmetics": "Beauty",
    "pricelist.category.manicure": "Manicure / nail",
    "pricelist.category.pedicure": "Pedicure",
    "pricelist.category.solarium": "Solarium",
    "pricelist.category.massage": "Massage",
    "pricelist.category.other": "Other / accessories",
    "pricelist.category.fallback": "Other services",
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

    // ABOUT PAGE
    "about.eyebrow": "О нас",
    "about.title": "Почему стоит выбрать салоны Kleopátra?",
    "about.lead":
      "Наша цель – предоставить максимально широкий спектр бьюти-услуг в одном месте с единой айдентикой и высоким профессиональным уровнем.",
    "about.card1.title": "Единый бренд и высокий уровень",
    "about.card1.text":
      "Во всех наших салонах тебя ждёт один и тот же опыт Kleopátra: обученные специалисты, премиальная косметика и стабильное качество.",
    "about.card2.title": "Клиентоориентированный подход",
    "about.card2.text":
      "Мы ценим твое время и впечатления от посещения. Удобный график работы, гибкая запись и дружелюбная команда – всё для твоего комфорта.",
 
    // CAREER PAGE
    "career.eyebrow": "Карьера",
    "career.title": "Построй карьеру в салонах Kleopátra",
    "career.lead":
      "Присоединяйся к нашей профессиональной команде, работай в вдохновляющей атмосфере и развивай устойчивую карьеру в сети салонов красоты.",
    "career.card1.title": "Стабильный фундамент и развитие",
    "career.card1.text":
      "В нашей общенациональной сети мы предлагаем постоянное обучение, профессиональную поддержку и долгосрочные возможности.",
    "career.card2.title": "Клиент в центре внимания",
    "career.card2.text":
      "Мы верим, что основа хорошей команды – признание и уважение. Нам нужны коллеги, для которых важны и профессионализм, и эмпатия.",

    // LOYALTY PAGE
    "loyalty.eyebrow": "Программа лояльности",
    "loyalty.title": "Программа лояльности Kleopátra",
    "loyalty.lead":
      "Копи баллы, пользуйся персональными скидками и узнавай первым о новостях и событиях.",
    "loyalty.card1.title": "Баллы за каждую услугу",
    "loyalty.card1.text":
      "За каждую оказанную услугу ты получаешь баллы, которые затем можно обменять на скидки и подарки.",
    "loyalty.card2.title": "Персональные предложения",
    "loyalty.card2.text":
      "В рамках программы лояльности ты получаешь предложения, которые соответствуют твоим любимым услугам и потребностям.",

    // FRANCHISE PAGE
    "franchise.eyebrow": "Франшиза",
    "franchise.title": "Открой собственный салон Kleopátra",
    "franchise.lead":
      "Проверенная бизнес-модель, узнаваемый бренд и центральная поддержка – начни свой салон Kleopátra на базе нашего опыта.",
    "franchise.card1.title": "Известный бренд и айдентика",
    "franchise.card1.text":
      "Тебе не нужно строить бренд салона с нуля: мы даем готовую визуальную айдентику, маркетинг и профессиональную базу.",
    "franchise.card2.title": "Маркетинг и HR-поддержка",
    "franchise.card2.text":
      "Наш центральный офис помогает в подборе персонала, обучении и маркетинговых кампаниях – чтобы твой салон рос быстрее.",
    "franchise.card3.title": "Масштабируемый и долгосрочный бизнес",
    "franchise.card3.text":
      "В качестве франчайзи ты получаешь предсказуемую и масштабируемую бизнес-модель, основанную на реальном рыночном опыте.",

    // SALONS PAGE
    "salons.eyebrow": "Наши салоны",
    "salons.titlePrefix": "Сейчас ты можешь выбрать из",
    "salons.titleSuffix": "салонов Kleopátra.",
    "salons.lead":
      "Выбери салон поближе к тебе и запишись на парикмахерские, косметические услуги, уход за руками и ногами, массаж или солярий.",
    "salons.heroAlt": "Сеть салонов Kleopátra по всей стране",

    // SERVICES PAGE
    "services.eyebrow": "Услуги",
    "services.title": "Наши цены и услуги",
    "services.lead":
      "Полный спектр бьюти-услуг в одном месте: парикмахерская, косметология, уход за руками и ногами, солярий, массаж и фитнес.",
    "services.heroAlt": "Салоны Kleopátra – услуги",
    "services.cards.hair.title": "Парикмахерская",
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

    // PRICELIST PAGE
    "pricelist.eyebrow": "Цены и услуги",
    "pricelist.title": "Прайс-лист и услуги",
    "pricelist.lead":
      "Выбери салон Kleopátra, который находится ближе всего к тебе, и посмотри цены и услуги именно там.",
    "pricelist.location.label": "Выбор салона:",
    "pricelist.loading": "Загрузка услуг…",
    "pricelist.error": "Не удалось загрузить список услуг.",
    "pricelist.noServicesForLocation":
      "Для выбранного салона пока нет услуг для отображения.",

    "pricelist.table.header.service": "Услуга",
    "pricelist.table.header.duration": "Длительность",
    "pricelist.table.header.price": "Цена",

    "pricelist.category.hair": "Парикмахерские услуги",
    "pricelist.category.cosmetics": "Косметология",
    "pricelist.category.manicure": "Маникюр / ногти",
    "pricelist.category.pedicure": "Педикюр",
    "pricelist.category.solarium": "Солярий",
    "pricelist.category.massage": "Массаж",
    "pricelist.category.other": "Другое / аксессуары",
    "pricelist.category.fallback": "Другие услуги",
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
