import ServiceDetailLayout from "../../components/ServiceDetailLayout";

export default function ArcmasszazsPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.arcmasszazs.title"
      leadKey="services.detail.arcmasszazs.lead"
      heroImageSrc="/images/services/arcmasszazs-hero.jpg"
      priceAnchor="/araink#category-2"
      sections={[
        {
          titleKey: "services.detail.arcmasszazs.section1.title",
          items: [
            "services.detail.arcmasszazs.section1.item1",
            "services.detail.arcmasszazs.section1.item2",
          ],
        },
        {
          titleKey: "services.detail.arcmasszazs.section2.title",
          items: [
            "services.detail.arcmasszazs.section2.item1",
            "services.detail.arcmasszazs.section2.item2",
          ],
        },
      ]}
    />
  );
}
