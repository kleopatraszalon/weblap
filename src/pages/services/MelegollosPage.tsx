import ServiceDetailLayout from "../../components/ServiceDetailLayout";

export default function MelegollosPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.mollos.title"
      leadKey="services.detail.mollos.lead"
      heroImageSrc="/images/services/melegollos-hero.jpg"
      priceAnchor="/araink#category-1"
      sections={[
        {
          titleKey: "services.detail.mollos.section1.title",
          items: [
            "services.detail.mollos.section1.item1",
            "services.detail.mollos.section1.item2",
          ],
        },
        {
          titleKey: "services.detail.mollos.section2.title",
          items: [
            "services.detail.mollos.section2.item1",
            "services.detail.mollos.section2.item2",
          ],
        },
      ]}
    />
  );
}
