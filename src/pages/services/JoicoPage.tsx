export function JoicoPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.joicohajkezeles.title"
      leadKey="services.detail.joicohajkezeles.lead"
      heroImageSrc="/images/services/joico-hero.jpg"
      priceAnchor="/araink#category-1"
      sections={[
        {
          titleKey: "services.detail.joicohajkezeles.section1.title",
          items: [
            "services.detail.joicohajkezeles.section1.item1",
            "services.detail.joicohajkezeles.section1.item2",
            "services.detail.joicohajkezeles.section1.item3",
            "services.detail.joicohajkezeles.section1.item4",
          ],
        },
        {
          titleKey: "services.detail.joicohajkezeles.section2.title",
          items: ["services.detail.joicohajkezeles.section2.item1"],
        },
      ]}
    />
  );
}


export default JoicoPage;