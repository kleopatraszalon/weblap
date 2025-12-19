export function IplPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.ipl.title"
      leadKey="services.detail.ipl.lead"
      heroImageSrc="/images/services/ipl-hero.jpg"
      priceAnchor="/araink#category-2"
      sections={[
        {
          titleKey: "services.detail.ipl.section1.title",
          items: [
            "services.detail.ipl.section1.item1",
            "services.detail.ipl.section1.item2",
          ],
        },
        {
          titleKey: "services.detail.ipl.section2.title",
          items: [
            "services.detail.ipl.section2.item1",
            "services.detail.ipl.section2.item2",
          ],
        },
      ]}
    />
  );
}


export default IplPage;