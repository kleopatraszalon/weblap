import ServiceDetailLayout from "../../components/ServiceDetailLayout";

export default function SzempillaPage() {
  return (
    <ServiceDetailLayout
      titleKey="services.detail.muszempilla.title"
      leadKey="services.detail.muszempilla.lead"
      heroImageSrc="/images/services/muszempilla-hero.jpg"
      priceAnchor="/araink#category-2"
      sections={[
        {
          titleKey: "services.detail.muszempilla.section1.title",
          items: [
            "services.detail.muszempilla.section1.item1",
            "services.detail.muszempilla.section1.item2",
            "services.detail.muszempilla.section1.item3",
          ],
        },
        {
          titleKey: "services.detail.muszempilla.section2.title",
          items: [
            "services.detail.muszempilla.section2.item1",
            "services.detail.muszempilla.section2.item2",
          ],
        },
      ]}
    />
  );
}
