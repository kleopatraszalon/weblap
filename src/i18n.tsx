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
    "services.page.heroAlt":
      "Kleopátra Szépségszalon – fodrászat, kozmetika és wellness egy helyen",
    "services.page.eyebrow": "Szolgáltatások",
    "services.page.titlePrefix": "Szolgáltatásaink",
    "services.page.titleSuffix": "– mindent egy helyen",
    "services.page.lead":
      "Prémium fodrászati, kozmetikai, kéz- és lábápolási, szolárium és masszázs szolgáltatások – egységes Kleopátra-minőségben, minden szalonunkban.",

    "services.detail.hair.eyebrow": "Fodrászat",
    "services.detail.hair.title":
      "Szalonfodrászat, amely kihozza a maximumot a hajadból",
    "services.detail.hair.lead":
      "Fodrászaink a klasszikus technikákat a legújabb trendekkel ötvözik – a konzultáció során figyelembe vesszük arcvonalad, hajtípusod és életmódod, hogy a frizura hosszú távon is hordható legyen.",
    "services.detail.hair.bullet1":
      "Női, férfi és gyermek hajvágás, formázás és teljes megújulás.",
    "services.detail.hair.bullet2":
      "Festés, melír, balayage és színkorrekció professzionális termékekkel.",
    "services.detail.hair.bullet3":
      "Hajápoló kezelések, hajregeneráló kúrák és személyre szabott otthoni ápolási tanácsadás.",
    "services.detail.hair.cta": "Fodrász árlista megnyitása",

    "services.detail.beauty.eyebrow": "Kozmetika",
    "services.detail.beauty.title":
      "Kozmetikai kezelések a ragyogó, egészséges bőrért",
    "services.detail.beauty.lead":
      "Kezeléseink a bőr állapotfelmérésével indulnak, így minden alkalommal olyan protokollt állítunk össze, amely illeszkedik bőrtípusodhoz és céljaidhoz – legyen az hidratálás, anti-aging vagy tisztítás.",
    "services.detail.beauty.bullet1":
      "Klasszikus és gépi arckezelések, anti-aging és problémamegoldó kúrák.",
    "services.detail.beauty.bullet2":
      "Szemöldök- és szempillaformázás, festés, tartósbögre- és lifting technikák.",
    "services.detail.beauty.bullet3":
      "Alkalmi és nappali smink, menyasszonyi smink professzionális termékekkel.",
    "services.detail.beauty.cta": "Kozmetikai árlista megnyitása",

    "services.detail.handsfeet.eyebrow": "Kéz- és lábápolás",
    "services.detail.handsfeet.title":
      "Ápolt kezek és lábak – kompromisszumok nélkül",
    "services.detail.handsfeet.lead":
      "Manikűröseink és pedikűröseink higiénikus, gondos munkával tesznek az esztétikus megjelenésért és a komfortérzetedért – a gyors frissítéstől a teljes lábápolásig.",
    "services.detail.handsfeet.bullet1":
      "Manikűr, gél lakk, műköröm építés és megerősítő kezelések.",
    "services.detail.handsfeet.bullet2":
      "Esztétikai és wellness pedikűr, bőrkeményedés- és sarokápolás.",
    "services.detail.handsfeet.bullet3":
      "Higiéniai protokollok, professzionális fertőtlenítés és gondosan válogatott ápoló termékek.",
    "services.detail.handsfeet.cta": "Kéz- és lábápolás árlista megnyitása",

    "services.detail.solarium.eyebrow": "Szolárium",
    "services.detail.solarium.title":
      "Egyenletes, napbarnított bőr modern szoláriumgépekkel",
    "services.detail.solarium.lead":
      "Szoláriumainkban a bőrtípusodhoz igazított időbeállítással, szakértői útmutatással segítünk elérni az egészséges, egyenletes barnaságot.",
    "services.detail.solarium.bullet1":
      "Rendszeresen karbantartott, korszerű fekvő és álló gépek.",
    "services.detail.solarium.bullet2":
      "Személyre szabott barnulási terv és fényvédelmi tanácsadás.",
    "services.detail.solarium.bullet3":
      "Minőségi szoláriumkozmetikumok a tartósabb, szebb színért.",
    "services.detail.solarium.cta": "Szolárium árlista megnyitása",

    "services.detail.massage.eyebrow": "Masszázs",
    "services.detail.massage.title":
      "Masszázs a teljes testi-lelki feltöltődésért",
    "services.detail.massage.lead":
      "Masszőreink különböző technikákból építik fel a kezelést – figyelembe véve az izomfeszültségeket, terhelést és stressz-szintet, hogy valódi regenerációt kapj.",
    "services.detail.massage.bullet1":
      "Relaxáló, frissítő és sportmasszázs a feszes, fáradt izmok fellazítására.",
    "services.detail.massage.bullet2":
      "Célzott hát-, nyak- és vállövi kezelések a mindennapi ülőmunka kompenzálására.",
    "services.detail.massage.bullet3":
      "Aromaterápiás és wellness masszázsok a teljes kikapcsolódásért.",
    "services.detail.massage.cta": "Masszázs árlista megnyitása",

    "services.detail.fitness.eyebrow": "Fitness & wellness",
    "services.detail.fitness.title":
      "Kiegészítő wellness- és testkezelések a hosszú távú eredményért",
    "services.detail.fitness.lead":
      "A szépség és a jó közérzet összetartozik: testkezeléseink és wellness szolgáltatásaink támogatják az alakformálást, a regenerációt és az energiaszint növelését.",
    "services.detail.fitness.bullet1":
      "Alakformáló és feszesítő testkezelések, amelyek kiegészítik az életmódbeli változtatásokat.",
    "services.detail.fitness.bullet2":
      "Wellness-jellegű programok a regeneráció és stresszoldás támogatására.",
    "services.detail.fitness.bullet3":
      "Személyre szabott javaslatok a kezelés utáni otthoni ápolásra és életmódra.",
    "services.detail.fitness.cta": "További információk és árak",




    "salons.list.eyebrow": "Szalonjaink",
    "salons.list.titlePrefix": "Bejelentkezés nélkül is várunk már",
    "salons.list.titleSuffix": "helyszínen!",
    "salons.list.lead":
      "Válaszd ki a hozzád legközelebb eső Kleopátra Szépségszalont, és lépj be a több mint 30 éves szakértelem világába.",
    "salons.list.heroAlt": "Kleopátra Szalonok",
    "salons.list.mapTitle": "Szalonjaink térképen",
    "salons.list.mapText":
      "Itt egy pillantással áttekintheted, hol találhatók Kleopátra Szépségszalonjaink.",
    "salons.list.facebookTitle": "Kövess minket a Facebookon",
    "salons.list.facebookText":
      "Akciók, újdonságok, kulisszatitkok – csatlakozz közösségünkhöz a közösségi médiában.",
    "salons.list.bookingTitle": "Online időpontfoglalás",
    "salons.list.bookingText":
      "Használd központi foglalási rendszerünket, válaszd ki a szalont, a szolgáltatást és az időpontot néhány kattintással.",

    "salon.detail.eyebrow": "Szalonjaink",
    "salon.detail.lead":
      "Ebben a Kleopátra Szépségszalonban is komplett szépségápolási szolgáltatásokat kínálunk – fodrászat, kozmetika, kéz- és lábápolás, masszázs és további kezelések várnak modern, egységes környezetben.",
    "salon.detail.basicTitle": "Alapadatok",
    "salon.detail.basicLabel.name": "Szalon neve:",
    "salon.detail.basicLabel.address": "Cím:",
    "salon.detail.basicLabel.services": "Szolgáltatások:",
    "salon.detail.basicLabel.payments": "Fizetési módok:",
    "salon.detail.basicServices":
      "fodrászat, kozmetika, kéz- és lábápolás, masszázs, szolárium (helyszínenként eltérhet).",
    "salon.detail.basicPayments":
      "készpénz, bankkártya, SZÉP-kártya.",
    "salon.detail.bookingTitle": "Időpontfoglalás",
    "salon.detail.bookingText":
      "Időpontot foglalhatsz online a foglalási widgeten keresztül, mobilalkalmazásunkból vagy telefonon. Akár bejelentkezés nélkül is betérhetsz, kollégáink a lehető legrövidebb időn belül fogadnak.",
    "salon.detail.bookingBack": "Vissza a szalonlistához",
    "salon.detail.mapTitle": "Térkép és megközelítés",
    "salon.detail.mapOpen": "Megnyitás a térképen",
    "salon.detail.infoTitle": "Hasznos tudnivalók",
    "salon.detail.infoText1":
      "Szalonjaink könnyen megközelíthetők tömegközlekedéssel és gépkocsival is. A pontos parkolási lehetőségeket és aktuális nyitvatartást a foglalási widgetben, illetve a visszaigazoló e-mailben is megtalálod.",
    "salon.detail.infoText2":
      "Ha speciális kérésed van (pl. kedvenc fodrász, kozmetikus vagy időpontegyeztetés), kérjük, jelezd a megjegyzésben vagy telefonon.",
    "salon.detail.loading": "Szalonadatok betöltése...",
    "salon.detail.error":
      "Nem sikerült betölteni a szalonadatokat. Kérjük, próbáld meg később.",


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
        "services.page.heroAlt":
      "Kleopatra Beauty Salons – hair, beauty and wellness in one place",
    "services.page.eyebrow": "Services",
    "services.page.titlePrefix": "Our services",
    "services.page.titleSuffix": "– everything in one place",
    "services.page.lead":
      "Premium hairdressing, beauty, hands & feet care, solarium and massage services – in unified Kleopátra quality across all our salons.",

    "services.detail.hair.eyebrow": "Hairdressing",
    "services.detail.hair.title":
      "Salon hairdressing that brings out the best in your hair",
    "services.detail.hair.lead":
      "Our stylists combine classic techniques with the latest trends. During the consultation we look at your face shape, hair type and lifestyle to create a look that stays wearable day after day.",
    "services.detail.hair.bullet1":
      "Women’s, men’s and children’s cuts, restyling and complete makeovers.",
    "services.detail.hair.bullet2":
      "Colouring, highlights, balayage and colour corrections with professional products.",
    "services.detail.hair.bullet3":
      "Deep conditioning rituals, repairing treatments and tailored home-care recommendations.",
    "services.detail.hair.cta": "Open hairdressing price list",

    "services.detail.beauty.eyebrow": "Beauty",
    "services.detail.beauty.title":
      "Professional facials for healthy, glowing skin",
    "services.detail.beauty.lead":
      "Every treatment starts with a skin analysis, so we can build a protocol that matches your skin type and goals – from hydration and anti-ageing to deep cleansing.",
    "services.detail.beauty.bullet1":
      "Classic and device-based facials, anti-ageing and problem-solving treatments.",
    "services.detail.beauty.bullet2":
      "Brow and lash styling, tinting and modern lifting techniques.",
    "services.detail.beauty.bullet3":
      "Day, evening and bridal make-up with professional products.",
    "services.detail.beauty.cta": "Open beauty price list",

    "services.detail.handsfeet.eyebrow": "Hands & feet care",
    "services.detail.handsfeet.title":
      "Perfectly groomed hands and feet – without compromise",
    "services.detail.handsfeet.lead":
      "Our nail technicians and pedicurists work to high hygiene standards to deliver both aesthetics and comfort – from quick tidy-ups to complete foot care.",
    "services.detail.handsfeet.bullet1":
      "Manicure, gel polish, nail extensions and strengthening treatments.",
    "services.detail.handsfeet.bullet2":
      "Aesthetic and wellness pedicure, callus and heel care.",
    "services.detail.handsfeet.bullet3":
      "Strict hygiene protocols, disinfection and carefully selected care products.",
    "services.detail.handsfeet.cta": "Open hands & feet price list",

    "services.detail.solarium.eyebrow": "Solarium",
    "services.detail.solarium.title":
      "Even, sun-kissed skin with modern solarium machines",
    "services.detail.solarium.lead":
      "We tailor session length to your skin type and provide expert guidance so you can enjoy a healthy-looking, even tan.",
    "services.detail.solarium.bullet1":
      "Regularly maintained, modern lay-down and stand-up units.",
    "services.detail.solarium.bullet2":
      "Personalised tanning plans and advice on skin protection.",
    "services.detail.solarium.bullet3":
      "Quality solarium cosmetics for longer-lasting, more beautiful colour.",
    "services.detail.solarium.cta": "Open solarium price list",

    "services.detail.massage.eyebrow": "Massage",
    "services.detail.massage.title":
      "Massage treatments for deep physical and mental relaxation",
    "services.detail.massage.lead":
      "Our therapists combine different techniques based on muscle tension, workload and stress level to provide real regeneration.",
    "services.detail.massage.bullet1":
      "Relaxing, refreshing and sports massages to release tight, overworked muscles.",
    "services.detail.massage.bullet2":
      "Targeted back, neck and shoulder treatments to balance out desk work.",
    "services.detail.massage.bullet3":
      "Aromatherapy and wellness massages for complete switch-off moments.",
    "services.detail.massage.cta": "Open massage price list",

    "services.detail.fitness.eyebrow": "Fitness & wellness",
    "services.detail.fitness.title":
      "Complementary wellness and body treatments for long-term results",
    "services.detail.fitness.lead":
      "Beauty and wellbeing belong together: our body and wellness programs support shaping, regeneration and energy levels.",
    "services.detail.fitness.bullet1":
      "Body-shaping and firming treatments that complement lifestyle changes.",
    "services.detail.fitness.bullet2":
      "Wellness-style sessions to support recovery and stress relief.",
    "services.detail.fitness.bullet3":
      "Tailored suggestions for post-treatment home care and daily habits.",
    "services.detail.fitness.cta": "More information and prices",

    "salons.list.eyebrow": "Our salons",
    "salons.list.titlePrefix": "We welcome you in",
    "salons.list.titleSuffix": "locations, even without appointment.",
    "salons.list.lead":
      "Choose the Kleopátra Beauty Salon closest to you and step into a world of more than 30 years of expertise.",
    "salons.list.heroAlt": "Kleopatra salons",
    "salons.list.mapTitle": "Our salons on the map",
    "salons.list.mapText":
      "See at a glance where our Kleopátra Beauty Salons are located across the country.",
    "salons.list.facebookTitle": "Follow us on Facebook",
    "salons.list.facebookText":
      "Promotions, news and behind-the-scenes moments – join our community on social media.",
    "salons.list.bookingTitle": "Online booking",
    "salons.list.bookingText":
      "Use our central booking system to choose your salon, service and time in just a few clicks.",

    "salon.detail.eyebrow": "Our salons",
    "salon.detail.lead":
      "In this Kleopátra Beauty Salon you will also find a full range of beauty services – hairdressing, beauty, hands & feet care, massage and further treatments in a modern, unified environment.",
    "salon.detail.basicTitle": "Basic information",
    "salon.detail.basicLabel.name": "Salon name:",
    "salon.detail.basicLabel.address": "Address:",
    "salon.detail.basicLabel.services": "Services:",
    "salon.detail.basicLabel.payments": "Payment options:",
    "salon.detail.basicServices":
      "hairdressing, beauty, hands & feet care, massage, solarium (services may differ by location).",
    "salon.detail.basicPayments":
      "cash, bank card, SZÉP card (Hungarian leisure card).",
    "salon.detail.bookingTitle": "Booking",
    "salon.detail.bookingText":
      "You can book an appointment online via the booking widget, through our mobile app or by phone. You are also welcome to walk in without appointment – our colleagues will serve you as soon as possible.",
    "salon.detail.bookingBack": "Back to salon list",
    "salon.detail.mapTitle": "Map and access",
    "salon.detail.mapOpen": "Open in Maps",
    "salon.detail.infoTitle": "Good to know",
    "salon.detail.infoText1":
      "Our salons are easy to reach both by public transport and by car. You can find exact parking options and current opening hours in the booking widget and in the confirmation e-mail.",
    "salon.detail.infoText2":
      "If you have any special requests (for example preferred stylist or therapist, or timing questions), please let us know in the comment field or by phone.",
    "salon.detail.loading": "Loading salon data...",
    "salon.detail.error":
      "We could not load the salon data. Please try again later.",


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
        "services.page.heroAlt":
      "Салоны Kleopátra – парикмахерские, косметология и wellness в одном месте",
    "services.page.eyebrow": "Услуги",
    "services.page.titlePrefix": "Наши услуги",
    "services.page.titleSuffix": "– всё в одном салоне",
    "services.page.lead":
      "Парикмахерские, косметологические услуги, уход за руками и ногами, солярий и массаж – во всех наших салонах в едином качестве Kleopátra.",

    "services.detail.hair.eyebrow": "Парикмахерские услуги",
    "services.detail.hair.title":
      "Салонный уход за волосами, который раскрывает их потенциал",
    "services.detail.hair.lead":
      "Наши мастера совмещают классические техники с актуальными трендами. На консультации мы учитываем форму лица, тип и состояние волос, а также образ жизни, чтобы стрижка была удобной каждый день.",
    "services.detail.hair.bullet1":
      "Женские, мужские и детские стрижки, укладки и полное обновление образа.",
    "services.detail.hair.bullet2":
      "Окрашивание, мелирование, балаяж и коррекция цвета с профессиональными средствами.",
    "services.detail.hair.bullet3":
      "Восстанавливающие и ухаживающие процедуры, рекомендации по домашнему уходу.",
    "services.detail.hair.cta": "Открыть прайс-лист на парикмахерские услуги",

    "services.detail.beauty.eyebrow": "Косметология",
    "services.detail.beauty.title":
      "Косметологические процедуры для здоровой и сияющей кожи",
    "services.detail.beauty.lead":
      "Каждая процедура начинается с диагностики кожи, чтобы подобрать протокол под ваш тип и задачи: увлажнение, омоложение или глубокое очищение.",
    "services.detail.beauty.bullet1":
      "Классические и аппаратные уходы, anti-age программы и курсы лечения проблемной кожи.",
    "services.detail.beauty.bullet2":
      "Оформление и окрашивание бровей и ресниц, современные техники лифтинга.",
    "services.detail.beauty.bullet3":
      "Дневной, вечерний и свадебный макияж с профессиональной косметикой.",
    "services.detail.beauty.cta": "Открыть прайс-лист на косметологию",

    "services.detail.handsfeet.eyebrow": "Уход за руками и ногами",
    "services.detail.handsfeet.title":
      "Идеально ухоженные руки и ноги – без компромиссов",
    "services.detail.handsfeet.lead":
      "Наши мастера маникюра и педикюра работают по строгим гигиеническим стандартам, обеспечивая и эстетику, и комфорт – от экспресс-ухода до полного педикюра.",
    "services.detail.handsfeet.bullet1":
      "Маникюр, гель-лак, наращивание и укрепление ногтей.",
    "services.detail.handsfeet.bullet2":
      "Эстетический и wellness-педикюр, уход за мозолями и пятками.",
    "services.detail.handsfeet.bullet3":
      "Строгие протоколы дезинфекции и тщательно подобранные уходовые средства.",
    "services.detail.handsfeet.cta": "Открыть прайс-лист на маникюр и педикюр",

    "services.detail.solarium.eyebrow": "Солярий",
    "services.detail.solarium.title":
      "Ровный загар с современными соляриями",
    "services.detail.solarium.lead":
      "Мы подбираем длительность сеанса под тип вашей кожи и даём рекомендации по безопасному загару, чтобы вы получили красивый, ровный цвет.",
    "services.detail.solarium.bullet1":
      "Современные горизонтальные и вертикальные аппараты, регулярно обслуживаемые.",
    "services.detail.solarium.bullet2":
      "Индивидуальные программы загара и советы по защите кожи.",
    "services.detail.solarium.bullet3":
      "Косметика для солярия для более стойкого и красивого оттенка.",
    "services.detail.solarium.cta": "Открыть прайс-лист на солярий",

    "services.detail.massage.eyebrow": "Массаж",
    "services.detail.massage.title":
      "Массаж для полноценного восстановления тела и души",
    "services.detail.massage.lead":
      "Наши массажисты подбирают техники в зависимости от мышечного напряжения, нагрузки и уровня стресса, чтобы обеспечить глубокое расслабление и восстановление.",
    "services.detail.massage.bullet1":
      "Расслабляющий, освежающий и спортивный массаж для снятия мышечных зажимов.",
    "services.detail.massage.bullet2":
      "Целевые программы для спины, шеи и плечевого пояса при сидячей работе.",
    "services.detail.massage.bullet3":
      "Ароматерапевтические и wellness-массажи для полного отключения от повседневных забот.",
    "services.detail.massage.cta": "Открыть прайс-лист на массаж",

    "services.detail.fitness.eyebrow": "Fitness & wellness",
    "services.detail.fitness.title":
      "Дополнительные wellness- и body-процедуры для устойчивого результата",
    "services.detail.fitness.lead":
      "Красота и самочувствие неразделимы: наши программы для тела и wellness-услуги поддерживают коррекцию фигуры, восстановление и уровень энергии.",
    "services.detail.fitness.bullet1":
      "Корректирующие и подтягивающие процедуры, дополняющие изменения образа жизни.",
    "services.detail.fitness.bullet2":
      "Wellness-программы для релаксации и снятия стресса.",
    "services.detail.fitness.bullet3":
      "Индивидуальные рекомендации по домашнему уходу и ежедневным привычкам после процедур.",
    "services.detail.fitness.cta": "Подробнее об услугах и ценах",

    "salons.list.eyebrow": "Наши салоны",
    "salons.list.titlePrefix": "Мы ждём тебя уже в",
    "salons.list.titleSuffix": "локациях – даже без предварительной записи.",
    "salons.list.lead":
      "Выбери салон Kleopátra рядом с тобой и окунись в атмосферу более чем 30-летнего опыта и профессионализма.",
    "salons.list.heroAlt": "Салоны Kleopátra",
    "salons.list.mapTitle": "Наши салоны на карте",
    "salons.list.mapText":
      "Одним взглядом увидь, где находятся салоны Kleopátra по всей стране.",
    "salons.list.facebookTitle": "Подписывайся на нас в Facebook",
    "salons.list.facebookText":
      "Акции, новости и закулисные моменты – присоединяйся к нашему сообществу в соцсетях.",
    "salons.list.bookingTitle": "Онлайн-запись",
    "salons.list.bookingText":
      "Используй нашу центральную систему онлайн-записи – выбери салон, услугу и время в несколько кликов.",

    "salon.detail.eyebrow": "Наши салоны",
    "salon.detail.lead":
      "В этом салоне Kleopátra тебя также ждёт полный спектр бьюти-услуг – парикмахерские услуги, косметология, уход за руками и ногами, массаж и другие процедуры в современном, стильном окружении.",
    "salon.detail.basicTitle": "Основная информация",
    "salon.detail.basicLabel.name": "Название салона:",
    "salon.detail.basicLabel.address": "Адрес:",
    "salon.detail.basicLabel.services": "Услуги:",
    "salon.detail.basicLabel.payments": "Способы оплаты:",
    "salon.detail.basicServices":
      "парикмахерские услуги, косметология, уход за руками и ногами, массаж, солярий (набор услуг зависит от конкретного салона).",
    "salon.detail.basicPayments":
      "наличные, банковская карта, карта SZÉP.",
    "salon.detail.bookingTitle": "Запись на приём",
    "salon.detail.bookingText":
      "Записаться можно онлайн через виджет записи, из мобильного приложения или по телефону. Можно прийти и без предварительной записи – мы постараемся принять тебя как можно скорее.",
    "salon.detail.bookingBack": "Назад к списку салонов",
    "salon.detail.mapTitle": "Карта и как добраться",
    "salon.detail.mapOpen": "Открыть на карте",
    "salon.detail.infoTitle": "Полезная информация",
    "salon.detail.infoText1":
      "До наших салонов удобно добираться как на общественном транспорте, так и на автомобиле. Точную информацию о парковке и актуальном графике работы можно найти в виджете записи и в письме-подтверждении.",
    "salon.detail.infoText2":
      "Если у тебя есть особые пожелания (например любимый мастер или вопросы по времени визита), пожалуйста, напиши об этом в комментарии или сообщи по телефону.",
    "salon.detail.loading": "Загрузка данных салона...",
    "salon.detail.error":
      "Не удалось загрузить данные салона. Пожалуйста, попробуй позже.",


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
