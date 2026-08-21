import React from "react";

const CSS = String.raw`
.kleo-v3-shop__copy h2{
  margin:0;
  font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;
  font-size:clamp(36px,4.7vw,68px);
  font-weight:540;
  letter-spacing:-.055em;
  line-height:1;
}

@media(min-width:981px){
  .kleo-v3-service:nth-child(2),
  .kleo-v3-service:nth-child(5){grid-column:span 3}
  .kleo-v3-service:nth-child(3),
  .kleo-v3-service:nth-child(6){grid-column:span 4}
}

@media(max-width:680px){
  .kleo-v3-shop__copy h2{font-size:clamp(34px,12vw,50px)}
}
`;

export function BrandRefreshFixes(){
  return <style data-kleo-brand-refresh-fixes>{CSS}</style>;
}

export default BrandRefreshFixes;
