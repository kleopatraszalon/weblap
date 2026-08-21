import React from "react";

const CSS = String.raw`
:root{
  --kleo-gold:#b69861;
  --kleo-gold-2:#c8b187;
  --kleo-gold-3:#e3d8c3;
  --kleo-ink:#120c08;
  --kleo-ink-2:#5d5a55;
  --kleo-magenta:#ec008c;
  --kleo-pink:#f9c1d9;
  --kleo-paper:#fbfaf7;
  --kleo-line:rgba(18,12,8,.11);
  --kleo-shadow:0 24px 70px rgba(18,12,8,.10);
  --kleo-radius:26px;
}

html{scroll-behavior:smooth}
body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;background:#fff!important;color:var(--kleo-ink)!important}
a,button{transition:color .22s ease,background-color .22s ease,border-color .22s ease,transform .22s ease,box-shadow .22s ease}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid var(--kleo-magenta)!important;outline-offset:3px!important}
::selection{background:var(--kleo-pink);color:var(--kleo-ink)}

.kleo-modern-container,.container{width:min(1320px,calc(100% - 56px))!important;max-width:1320px!important;margin-inline:auto!important}

/* Header */
.kleo-modern-header{position:sticky!important;top:0!important;z-index:1000!important;background:rgba(255,255,255,.88)!important;border-bottom:1px solid rgba(18,12,8,.08)!important;box-shadow:none!important;backdrop-filter:blur(20px) saturate(160%)!important;-webkit-backdrop-filter:blur(20px) saturate(160%)!important}
.kleo-modern-header__inner{min-height:80px!important;grid-template-columns:190px minmax(0,1fr)!important;gap:28px!important}
.kleo-modern-header__brand{width:182px!important}
.kleo-modern-header__brand img{height:58px!important;object-fit:contain!important}
.kleo-modern-header__nav-wrap{gap:18px!important}
.kleo-modern-nav{gap:clamp(12px,1.6vw,26px)!important}
.kleo-modern-nav__link{position:relative!important;min-height:46px!important;color:var(--kleo-ink)!important;font-size:11px!important;font-weight:700!important;letter-spacing:.095em!important;text-decoration:none!important}
.kleo-modern-nav__link:after{content:"";position:absolute;left:0;right:100%;bottom:6px;height:1px;background:var(--kleo-magenta);transition:right .22s ease}
.kleo-modern-nav__link:hover:after,.kleo-modern-nav__link.is-active:after{right:0}
.kleo-modern-nav__link:hover,.kleo-modern-nav__link.is-active{color:var(--kleo-ink)!important}
.kleo-modern-header__cta{min-height:46px!important;padding:0 21px!important;border-radius:999px!important;background:var(--kleo-ink)!important;border-color:var(--kleo-ink)!important;font-size:10px!important;letter-spacing:.11em!important;box-shadow:0 8px 20px rgba(18,12,8,.12)!important}
.kleo-modern-header__cta:hover{transform:translateY(-1px)!important;background:var(--kleo-magenta)!important;border-color:var(--kleo-magenta)!important;box-shadow:0 12px 26px rgba(236,0,140,.20)!important}
.kleo-modern-lang{border:0!important;background:#f4f1ed!important;padding:3px!important}
.kleo-modern-lang button{min-width:28px!important;height:28px!important}
.kleo-modern-lang button.is-active{background:#fff!important;color:var(--kleo-ink)!important;box-shadow:0 2px 8px rgba(18,12,8,.08)!important}

/* Buttons and public pages */
.btn,.kleo-modern-btn{min-height:48px!important;padding:0 23px!important;border-radius:999px!important;font-size:10px!important;font-weight:800!important;letter-spacing:.09em!important;text-transform:uppercase!important;text-decoration:none!important}
.btn-primary,.kleo-modern-btn--primary{background:var(--kleo-ink)!important;border-color:var(--kleo-ink)!important;color:#fff!important}
.btn-primary:hover,.kleo-modern-btn--primary:hover{background:var(--kleo-magenta)!important;border-color:var(--kleo-magenta)!important;transform:translateY(-2px)!important;box-shadow:0 12px 30px rgba(236,0,140,.18)!important}
.btn-outline,.kleo-modern-btn--outline{background:transparent!important;border-color:rgba(18,12,8,.28)!important;color:var(--kleo-ink)!important}
.btn-outline:hover,.kleo-modern-btn--outline:hover{border-color:var(--kleo-gold)!important;background:#fff!important;transform:translateY(-2px)!important}

.public-page-hero{position:relative!important;overflow:hidden!important;padding:78px 0!important;background:linear-gradient(135deg,#fff 0%,#fff 52%,#f7f2eb 100%)!important;border-bottom:1px solid rgba(182,152,97,.22)!important}
.public-page-hero:before{content:"";position:absolute;width:420px;height:420px;border:1px solid rgba(182,152,97,.24);border-radius:50%;top:-260px;left:-160px}
.public-page-hero__grid{display:grid!important;grid-template-columns:minmax(0,.9fr) minmax(420px,1.1fr)!important;gap:68px!important;align-items:center!important}
.public-page-hero__content{max-width:690px!important}
.section-eyebrow,.kleo-modern-eyebrow,.kleo-v3-eyebrow{margin:0 0 14px!important;color:var(--kleo-gold)!important;font-size:10px!important;font-weight:800!important;letter-spacing:.22em!important;text-transform:uppercase!important}
.public-page-hero h1{margin:0!important;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif!important;font-size:clamp(44px,5.6vw,82px)!important;font-weight:540!important;letter-spacing:-.055em!important;line-height:.98!important;color:var(--kleo-ink)!important}
.public-page-hero h1 .highlight{color:var(--kleo-magenta)!important}
.public-page-hero__lead{max-width:620px!important;margin-top:24px!important;color:#645d57!important;font-size:16px!important;line-height:1.75!important}
.public-page-hero__actions{display:flex!important;flex-wrap:wrap!important;gap:10px!important;margin-top:28px!important}
.public-page-hero__media{position:relative!important;overflow:hidden!important;aspect-ratio:4/3!important;border-radius:34px 34px 120px 34px!important;background:#efe8df!important;box-shadow:var(--kleo-shadow)!important}
.public-page-hero__media:after{content:"";position:absolute;inset:auto -18% -36% 36%;height:52%;border-radius:50% 50% 0 0;background:rgba(236,0,140,.92);transform:rotate(-7deg);mix-blend-mode:multiply;pointer-events:none}
.public-page-hero__media img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}

.public-section{padding:84px 0!important;background:#fff!important}
.public-section--soft{background:var(--kleo-paper)!important}
.public-section__header{max-width:780px!important;margin-bottom:34px!important}
.public-section__header h2,.public-cta h2{margin:0!important;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif!important;font-size:clamp(30px,3.7vw,52px)!important;font-weight:560!important;letter-spacing:-.04em!important;line-height:1.05!important}
.public-section__header>p:not(.section-eyebrow){color:#6b645e!important;line-height:1.75!important}
.feature-grid{gap:18px!important}
.feature-card,.media-card{position:relative!important;overflow:hidden!important;border:1px solid rgba(18,12,8,.09)!important;border-radius:24px!important;background:#fff!important;box-shadow:none!important;text-decoration:none!important;transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease!important}
.feature-card{padding:30px!important;min-height:245px!important}
.feature-card:hover,.media-card:hover{transform:translateY(-5px)!important;border-color:rgba(182,152,97,.5)!important;box-shadow:0 20px 50px rgba(18,12,8,.08)!important}
.feature-card__kicker{color:var(--kleo-gold)!important;font-size:9px!important;font-weight:800!important;letter-spacing:.16em!important;text-transform:uppercase!important}
.feature-card h2,.feature-card h3,.media-card h3{font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif!important;letter-spacing:-.025em!important;color:var(--kleo-ink)!important}
.feature-card p,.media-card p{color:#6e6760!important;line-height:1.7!important}
.link-btn{color:var(--kleo-magenta)!important;font-size:10px!important;font-weight:800!important;letter-spacing:.08em!important;text-transform:uppercase!important}
.media-card img{width:100%!important;object-fit:cover!important}
.public-cta{padding:42px!important;border:1px solid rgba(182,152,97,.34)!important;border-radius:30px!important;background:linear-gradient(120deg,#fff,#f9f4ed)!important}

/* Home 2026 */
.kleo-v3-home{overflow:hidden;background:#fff}
.kleo-v3-hero{position:relative;min-height:calc(100svh - 80px);display:flex;align-items:center;background:linear-gradient(115deg,#fff 0%,#fff 50%,#f6f0e8 100%);border-bottom:1px solid rgba(182,152,97,.18)}
.kleo-v3-hero:before{content:"";position:absolute;left:-200px;top:-250px;width:520px;height:520px;border:1px solid rgba(182,152,97,.2);border-radius:50%}
.kleo-v3-hero:after{content:"";position:absolute;right:-140px;bottom:-250px;width:620px;height:500px;border-radius:55% 0 0 0;background:linear-gradient(145deg,rgba(236,0,140,.96),rgba(236,0,140,.75));transform:rotate(-7deg);z-index:1}
.kleo-v3-hero__grid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,.92fr) minmax(480px,1.08fr);gap:64px;align-items:center;padding:58px 0}
.kleo-v3-hero__copy{max-width:700px}
.kleo-v3-hero h1{margin:0;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;font-size:clamp(54px,6.4vw,96px);font-weight:520;letter-spacing:-.065em;line-height:.93;color:var(--kleo-ink)}
.kleo-v3-hero h1 em{display:block;color:var(--kleo-magenta);font-style:normal}
.kleo-v3-hero__lead{max-width:620px;margin:26px 0 0;color:#625b55;font-size:clamp(16px,1.4vw,19px);line-height:1.7}
.kleo-v3-hero__actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.kleo-v3-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 25px;border:1px solid var(--kleo-ink);border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;text-decoration:none}
.kleo-v3-btn--dark{background:var(--kleo-ink);color:#fff}
.kleo-v3-btn--dark:hover{background:var(--kleo-magenta);border-color:var(--kleo-magenta);transform:translateY(-2px);box-shadow:0 14px 32px rgba(236,0,140,.18)}
.kleo-v3-btn--ghost{background:rgba(255,255,255,.64);color:var(--kleo-ink);border-color:rgba(18,12,8,.24);backdrop-filter:blur(10px)}
.kleo-v3-btn--ghost:hover{background:#fff;border-color:var(--kleo-gold);transform:translateY(-2px)}
.kleo-v3-hero__meta{display:flex;flex-wrap:wrap;gap:18px 28px;margin-top:36px;padding-top:26px;border-top:1px solid rgba(18,12,8,.10)}
.kleo-v3-hero__meta span{display:flex;align-items:center;gap:9px;color:#5f5852;font-size:12px}
.kleo-v3-hero__meta i{width:8px;height:8px;border-radius:50%;background:var(--kleo-gold);box-shadow:0 0 0 5px rgba(182,152,97,.12)}
.kleo-v3-hero__visual{position:relative;min-height:620px}
.kleo-v3-hero__image{position:absolute;inset:0 -84px 0 0;overflow:hidden;border-radius:42% 0 0 8%;background:#eee6dc;box-shadow:0 30px 80px rgba(18,12,8,.14)}
.kleo-v3-hero__image img{width:100%;height:100%;object-fit:cover;display:block}
.kleo-v3-hero__badge{position:absolute;left:-44px;bottom:34px;z-index:3;width:min(330px,80%);padding:20px 22px;border:1px solid rgba(255,255,255,.7);border-radius:22px;background:rgba(255,255,255,.88);box-shadow:0 22px 60px rgba(18,12,8,.14);backdrop-filter:blur(18px)}
.kleo-v3-hero__badge small,.kleo-v3-hero__badge strong,.kleo-v3-hero__badge span{display:block}
.kleo-v3-hero__badge small{color:var(--kleo-gold);font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
.kleo-v3-hero__badge strong{margin-top:7px;font-size:18px}
.kleo-v3-hero__badge span{margin-top:5px;color:#6d655e;font-size:12px;line-height:1.5}

.kleo-v3-quick{position:relative;z-index:4;background:#fff;border-bottom:1px solid rgba(18,12,8,.08)}
.kleo-v3-quick__inner{display:flex;align-items:center;gap:0;overflow:auto;scrollbar-width:none}
.kleo-v3-quick__inner::-webkit-scrollbar{display:none}
.kleo-v3-quick a{position:relative;flex:0 0 auto;padding:21px 25px;color:var(--kleo-ink);font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;text-decoration:none;border-right:1px solid rgba(18,12,8,.08)}
.kleo-v3-quick a:hover{color:var(--kleo-magenta);background:var(--kleo-paper)}

.kleo-v3-section{padding:96px 0}
.kleo-v3-section--paper{background:var(--kleo-paper)}
.kleo-v3-section--ink{background:var(--kleo-ink);color:#fff}
.kleo-v3-head{display:flex;align-items:end;justify-content:space-between;gap:32px;margin-bottom:40px}
.kleo-v3-head__copy{max-width:780px}
.kleo-v3-head h2,.kleo-v3-split h2,.kleo-v3-bento h2,.kleo-v3-why h2,.kleo-v3-final h2{margin:0;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;font-size:clamp(36px,4.7vw,68px);font-weight:540;letter-spacing:-.055em;line-height:1}
.kleo-v3-head p:not(.kleo-v3-eyebrow){margin:17px 0 0;color:#6b645e;font-size:15px;line-height:1.7}
.kleo-v3-text-link{display:inline-flex;align-items:center;gap:10px;flex:0 0 auto;color:var(--kleo-ink);font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;text-decoration:none}
.kleo-v3-text-link span{font-size:18px;color:var(--kleo-magenta)}

.kleo-v3-services{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
.kleo-v3-service{position:relative;min-height:270px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;padding:28px;border:1px solid rgba(18,12,8,.09);border-radius:var(--kleo-radius);background:#fff;color:var(--kleo-ink);text-decoration:none;isolation:isolate}
.kleo-v3-service:nth-child(1),.kleo-v3-service:nth-child(4){grid-column:span 5;min-height:360px}
.kleo-v3-service:nth-child(2),.kleo-v3-service:nth-child(3),.kleo-v3-service:nth-child(5),.kleo-v3-service:nth-child(6){grid-column:span 3.5}
.kleo-v3-service:before{content:"";position:absolute;inset:auto -80px -110px auto;width:220px;height:220px;border:1px solid rgba(182,152,97,.24);border-radius:50%;z-index:-1;transition:transform .35s ease}
.kleo-v3-service:nth-child(even):before{background:linear-gradient(145deg,rgba(249,193,217,.38),transparent);border:0}
.kleo-v3-service:hover{transform:translateY(-5px);border-color:rgba(182,152,97,.5);box-shadow:0 24px 60px rgba(18,12,8,.08)}
.kleo-v3-service:hover:before{transform:scale(1.18)}
.kleo-v3-service__index{position:absolute;top:25px;left:28px;color:var(--kleo-gold);font-size:10px;font-weight:800;letter-spacing:.16em}
.kleo-v3-service__arrow{position:absolute;top:20px;right:20px;width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(18,12,8,.13);border-radius:50%;font-size:18px}
.kleo-v3-service h3{margin:0;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;font-size:clamp(22px,2vw,31px);font-weight:580;letter-spacing:-.035em}
.kleo-v3-service p{max-width:460px;margin:12px 0 0;color:#6c655f;font-size:13px;line-height:1.65}

.kleo-v3-salon-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.kleo-v3-salon{position:relative;overflow:hidden;min-height:460px;border-radius:var(--kleo-radius);background:#e9e1d8;color:#fff;text-decoration:none;box-shadow:0 14px 35px rgba(18,12,8,.08)}
.kleo-v3-salon img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .55s cubic-bezier(.2,.7,.2,1)}
.kleo-v3-salon:after{content:"";position:absolute;inset:35% 0 0;background:linear-gradient(transparent,rgba(18,12,8,.84))}
.kleo-v3-salon__body{position:absolute;z-index:2;left:24px;right:24px;bottom:24px}
.kleo-v3-salon__body small{font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#e7d5b4}
.kleo-v3-salon__body h3{margin:8px 0 3px;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;font-size:24px;letter-spacing:-.035em}
.kleo-v3-salon__body p{margin:0;color:rgba(255,255,255,.82);font-size:12px}
.kleo-v3-salon__body span{display:inline-block;margin-top:14px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.kleo-v3-salon:hover img{transform:scale(1.045)}

.kleo-v3-booking-choice{display:grid;grid-template-columns:1fr 1fr;gap:1px;overflow:hidden;border:1px solid rgba(255,255,255,.13);border-radius:32px;background:rgba(255,255,255,.13)}
.kleo-v3-booking-choice>div{padding:54px;background:var(--kleo-ink)}
.kleo-v3-booking-choice span{color:#d6bd90;font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase}
.kleo-v3-booking-choice h2{margin:12px 0 0;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;font-size:clamp(32px,3.8vw,56px);font-weight:520;letter-spacing:-.05em;line-height:1}
.kleo-v3-booking-choice p{max-width:540px;margin:17px 0 0;color:#c9c3bd;line-height:1.75}
.kleo-v3-booking-choice a{display:inline-flex;margin-top:26px;color:#fff;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.kleo-v3-booking-choice>div:last-child{background:linear-gradient(135deg,#251b15,#120c08)}
.kleo-v3-booking-choice>div:last-child a{color:#f3cde3}

.kleo-v3-split{display:grid;grid-template-columns:minmax(0,.9fr) minmax(420px,1.1fr);gap:72px;align-items:center}
.kleo-v3-split--reverse{grid-template-columns:minmax(420px,1.1fr) minmax(0,.9fr)}
.kleo-v3-split__media{position:relative;overflow:hidden;aspect-ratio:5/4;border-radius:34px;background:#eee6de;box-shadow:var(--kleo-shadow)}
.kleo-v3-split__media img{width:100%;height:100%;object-fit:cover;display:block}
.kleo-v3-split__copy>p:not(.kleo-v3-eyebrow){margin:20px 0 0;color:#69625c;line-height:1.75}
.kleo-v3-feature-list{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:28px;border-top:1px solid var(--kleo-line);border-left:1px solid var(--kleo-line)}
.kleo-v3-feature-list span{min-height:84px;display:flex;align-items:center;padding:16px 18px;border-right:1px solid var(--kleo-line);border-bottom:1px solid var(--kleo-line);font-size:12px;font-weight:650;line-height:1.45}
.kleo-v3-store-buttons{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.kleo-v3-store-buttons a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border:1px solid rgba(18,12,8,.16);border-radius:12px;color:var(--kleo-ink);font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;text-decoration:none;background:#fff}
.kleo-v3-store-buttons a:hover{border-color:var(--kleo-gold);transform:translateY(-2px)}

.kleo-v3-bento{display:grid;grid-template-columns:1.2fr .8fr;gap:16px}
.kleo-v3-bento__card{position:relative;overflow:hidden;min-height:430px;border-radius:30px;border:1px solid rgba(18,12,8,.09);background:#fff}
.kleo-v3-bento__card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kleo-v3-bento__card:after{content:"";position:absolute;inset:28% 0 0;background:linear-gradient(transparent,rgba(18,12,8,.84))}
.kleo-v3-bento__content{position:absolute;z-index:2;left:32px;right:32px;bottom:30px;color:#fff}
.kleo-v3-bento__content .kleo-v3-eyebrow{color:#e4cda6!important}
.kleo-v3-bento__content h2{font-size:clamp(30px,3.4vw,50px)}
.kleo-v3-bento__content p{max-width:590px;margin:14px 0 0;color:rgba(255,255,255,.82);font-size:13px;line-height:1.65}
.kleo-v3-bento__content a{display:inline-flex;margin-top:20px;color:#fff;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}
.kleo-v3-bento__card--magenta{background:linear-gradient(145deg,#ec008c,#c60076);border:0}
.kleo-v3-bento__card--magenta:after{display:none}
.kleo-v3-bento__card--magenta .kleo-v3-bento__content{position:relative;left:auto;right:auto;bottom:auto;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:36px}
.kleo-v3-bento__card--magenta .kleo-v3-eyebrow{color:#fff!important;opacity:.72}

.kleo-v3-shop{display:grid;grid-template-columns:minmax(0,.86fr) minmax(440px,1.14fr);gap:70px;align-items:center}
.kleo-v3-shop__visual{position:relative;overflow:hidden;aspect-ratio:4/3;border-radius:32px;background:#f1ece6;box-shadow:var(--kleo-shadow)}
.kleo-v3-shop__visual img{width:100%;height:100%;object-fit:cover}
.kleo-v3-shop__copy p:not(.kleo-v3-eyebrow){color:#6c655e;line-height:1.75}

.kleo-v3-why{display:grid;grid-template-columns:minmax(280px,.7fr) minmax(0,1.3fr);gap:70px;align-items:start}
.kleo-v3-why__items{border-top:1px solid var(--kleo-line)}
.kleo-v3-why__item{display:grid;grid-template-columns:54px 1fr;gap:18px;padding:24px 0;border-bottom:1px solid var(--kleo-line)}
.kleo-v3-why__item span{color:var(--kleo-gold);font-size:10px;font-weight:800;letter-spacing:.12em;padding-top:4px}
.kleo-v3-why__item p{margin:0;color:#5f5852;font-size:15px;line-height:1.65}

.kleo-v3-franchise{position:relative;overflow:hidden;min-height:520px;display:grid;grid-template-columns:1fr 1fr;border-radius:34px;background:#120c08;color:#fff}
.kleo-v3-franchise__media{position:relative;min-height:520px}
.kleo-v3-franchise__media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.kleo-v3-franchise__copy{display:flex;flex-direction:column;justify-content:center;padding:56px}
.kleo-v3-franchise__copy h2{margin:0;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;font-size:clamp(34px,4vw,58px);font-weight:520;letter-spacing:-.05em;line-height:1}
.kleo-v3-franchise__copy p{color:#c7c0b9;line-height:1.7}
.kleo-v3-franchise__copy ul{margin:16px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:10px 20px}
.kleo-v3-franchise__copy li{font-size:12px;color:#e9e3dc}
.kleo-v3-franchise__copy li:before{content:"✦";color:var(--kleo-gold);margin-right:8px}

.kleo-v3-final{position:relative;overflow:hidden;padding:100px 0;background:linear-gradient(130deg,#f7f1e9,#fff 52%,#f8e0ed)}
.kleo-v3-final:after{content:"";position:absolute;right:-180px;bottom:-300px;width:620px;height:620px;border-radius:50%;border:100px solid rgba(236,0,140,.09)}
.kleo-v3-final__inner{position:relative;z-index:2;display:flex;align-items:end;justify-content:space-between;gap:48px}
.kleo-v3-final__copy{max-width:800px}
.kleo-v3-final__copy p:not(.kleo-v3-eyebrow){max-width:650px;color:#68615a;line-height:1.7}

/* Footer and cart */
.kleo-modern-footer{background:#120c08!important;color:#fff!important;border-top:0!important}
.kleo-modern-footer__grid{padding-top:70px!important;padding-bottom:60px!important}
.kleo-modern-footer__brand img{filter:none!important;background:#fff;border-radius:14px;padding:8px!important}
.kleo-modern-footer h3{color:#d9c198!important;font-size:9px!important;letter-spacing:.16em!important;text-transform:uppercase!important}
.kleo-modern-footer a,.kleo-modern-footer p{color:#cfc8c1!important}
.kleo-modern-footer a:hover{color:#fff!important}
.kleo-modern-footer__bottom{border-top:1px solid rgba(255,255,255,.10)!important;background:#120c08!important}
.kleo-cart-fab{border-radius:999px!important;background:#120c08!important;color:#fff!important;border:1px solid rgba(255,255,255,.14)!important;box-shadow:0 16px 40px rgba(18,12,8,.22)!important}
.kleo-cart-fab:hover{background:#ec008c!important;transform:translateY(-2px)!important}

@media(max-width:1180px){
  .kleo-modern-header__inner{grid-template-columns:164px minmax(0,1fr)!important;gap:15px!important}.kleo-modern-header__brand{width:160px!important}.kleo-modern-nav{gap:12px!important}.kleo-modern-nav__link{font-size:9.5px!important}.kleo-modern-header__cta{padding:0 14px!important}
  .kleo-v3-hero__grid{grid-template-columns:minmax(0,.9fr) minmax(420px,1.1fr);gap:40px}.kleo-v3-hero__visual{min-height:560px}
  .kleo-v3-salon-grid{grid-template-columns:repeat(2,1fr)}
}

@media(max-width:980px){
  .kleo-modern-container,.container{width:min(100% - 36px,1320px)!important}
  .kleo-modern-header__inner{display:flex!important;justify-content:space-between!important;min-height:72px!important}.kleo-modern-header__brand{width:166px!important}.kleo-modern-header__brand img{height:52px!important}
  .kleo-modern-header__menu-btn{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:5px!important;width:46px!important;height:46px!important;border:1px solid rgba(18,12,8,.12)!important;border-radius:50%!important;background:#fff!important}.kleo-modern-header__menu-btn span{width:18px!important;margin:0 auto!important;height:1px!important;background:#120c08!important}
  .kleo-modern-header__nav-wrap{display:none!important;position:absolute!important;top:72px!important;left:0!important;right:0!important;max-height:calc(100svh - 72px)!important;overflow:auto!important;padding:24px 18px 30px!important;background:rgba(255,255,255,.98)!important;border-bottom:1px solid var(--kleo-line)!important;box-shadow:0 30px 60px rgba(18,12,8,.12)!important;backdrop-filter:blur(18px)!important}.kleo-modern-header__nav-wrap.is-open{display:flex!important;flex-direction:column!important;align-items:stretch!important}.kleo-modern-nav{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important}.kleo-modern-nav__link{justify-content:space-between!important;min-height:56px!important;border-bottom:1px solid var(--kleo-line)!important;font-size:12px!important}.kleo-modern-nav__link:after{display:none!important}.kleo-modern-header__tools{justify-content:space-between!important;margin-top:16px!important}.kleo-modern-header__cta{min-height:50px!important;flex:1!important}
  .public-page-hero{padding:58px 0!important}.public-page-hero__grid{grid-template-columns:1fr!important;gap:36px!important}.public-page-hero__media{max-width:780px!important;width:100%!important}
  .kleo-v3-hero{min-height:auto}.kleo-v3-hero__grid{grid-template-columns:1fr;padding:64px 0 0}.kleo-v3-hero__copy{padding-bottom:12px}.kleo-v3-hero__visual{min-height:560px;margin-left:8vw}.kleo-v3-hero__image{inset:0 -18px 0 0;border-radius:40% 0 0 0}.kleo-v3-hero__badge{left:-8vw}.kleo-v3-hero:after{width:500px;height:380px;bottom:-200px}
  .kleo-v3-section{padding:76px 0}.kleo-v3-services{grid-template-columns:repeat(2,1fr)}.kleo-v3-service,.kleo-v3-service:nth-child(1),.kleo-v3-service:nth-child(2),.kleo-v3-service:nth-child(3),.kleo-v3-service:nth-child(4),.kleo-v3-service:nth-child(5),.kleo-v3-service:nth-child(6){grid-column:auto;min-height:290px}
  .kleo-v3-booking-choice{grid-template-columns:1fr}.kleo-v3-split,.kleo-v3-split--reverse,.kleo-v3-shop{grid-template-columns:1fr;gap:42px}.kleo-v3-split--reverse .kleo-v3-split__media{order:2}.kleo-v3-bento{grid-template-columns:1fr}.kleo-v3-why{grid-template-columns:1fr;gap:36px}.kleo-v3-franchise{grid-template-columns:1fr}.kleo-v3-franchise__media{min-height:400px}
}

@media(max-width:680px){
  .kleo-modern-container,.container{width:calc(100% - 28px)!important}
  .public-section{padding:62px 0!important}.public-page-hero{padding:48px 0!important}.public-page-hero h1{font-size:clamp(40px,13vw,60px)!important}.public-page-hero__media{border-radius:24px 24px 70px 24px!important}.public-cta{padding:28px!important}
  .kleo-v3-hero__grid{padding-top:48px}.kleo-v3-hero h1{font-size:clamp(48px,16vw,72px)}.kleo-v3-hero__lead{font-size:15px}.kleo-v3-hero__actions{display:grid;grid-template-columns:1fr}.kleo-v3-btn{width:100%}.kleo-v3-hero__meta{display:grid;grid-template-columns:1fr 1fr;gap:16px}.kleo-v3-hero__visual{min-height:430px;margin-left:7vw}.kleo-v3-hero__badge{left:-7vw;right:14px;width:auto;bottom:18px}.kleo-v3-quick a{padding:18px 19px}.kleo-v3-section{padding:62px 0}.kleo-v3-head{align-items:start;flex-direction:column;margin-bottom:30px}.kleo-v3-head h2,.kleo-v3-split h2,.kleo-v3-bento h2,.kleo-v3-why h2,.kleo-v3-final h2{font-size:clamp(34px,12vw,50px)}.kleo-v3-services{grid-template-columns:1fr}.kleo-v3-service,.kleo-v3-service:nth-child(n){min-height:250px}.kleo-v3-salon-grid{grid-template-columns:1fr}.kleo-v3-salon{min-height:420px}.kleo-v3-booking-choice>div{padding:34px 26px}.kleo-v3-feature-list{grid-template-columns:1fr}.kleo-v3-bento__card{min-height:390px}.kleo-v3-bento__content{left:24px;right:24px;bottom:24px}.kleo-v3-bento__card--magenta .kleo-v3-bento__content{padding:28px}.kleo-v3-franchise__media{min-height:330px}.kleo-v3-franchise__copy{padding:34px 26px}.kleo-v3-franchise__copy ul{grid-template-columns:1fr}.kleo-v3-final{padding:72px 0}.kleo-v3-final__inner{align-items:start;flex-direction:column}.kleo-modern-footer__grid{padding-top:52px!important;padding-bottom:40px!important}
}

@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`;

export function BrandRefreshStyles(){
  return <style data-kleo-brand-refresh>{CSS}</style>;
}

export default BrandRefreshStyles;
