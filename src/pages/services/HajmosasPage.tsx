import ServiceDetailLayout from "../../components/ServiceDetailLayout";

export default function HajmosasPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.hajmosas.title"
      leadKey="services.detail.hajmosas.lead"
      heroImageSrc="/images/services/hajmosas-hero.jpg"
      priceAnchor="/araink#category-1"
      sections={[
        {
          titleKey: "services.detail.hajmosas.section1.title",
          items: [
            "services.detail.hajmosas.section1.item1",
            "services.detail.hajmosas.section1.item2",
          ],
        },
        {
          titleKey: "services.detail.hajmosas.section2.title",
          items: [
            "services.detail.hajmosas.section2.item1",
            "services.detail.hajmosas.section2.item2",
          ],
        },
      ]}
    />
  );
}
