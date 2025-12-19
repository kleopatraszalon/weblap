export function ActisztitasPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.arctisztitas.title"
      leadKey="services.detail.arctisztitas.lead"
      heroImageSrc="/images/services/arctisztitas-hero.jpg"
      priceAnchor="/araink#category-2"
      sections={[
        {
          titleKey: "services.detail.arctisztitas.section1.title",
          items: [
            "services.detail.arctisztitas.section1.item1",
            "services.detail.arctisztitas.section1.item2",
            "services.detail.arctisztitas.section1.item3",
          ],
        },
        {
          titleKey: "services.detail.arctisztitas.section2.title",
          items: ["services.detail.arctisztitas.section2.item1"],
        },
      ]}
    />
  );
}


export default ActisztitasPage;