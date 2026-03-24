import React from "react";

type Props = {
  open: boolean;
  title: string;
  items: { id: string; title: string; price: number; image?: string }[];
  onAdd: (id: string) => void;
  onClose: () => void;
};

export function UpsellModal({ open, title, items, onAdd, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="kioskModalBackdrop" onClick={onClose}>
      <div className="kioskModal" onClick={(e) => e.stopPropagation()}>
        <div className="kioskModalHeader">
          <div className="kioskModalTitle">{title}</div>
          <button className="kioskIconBtn" onClick={onClose} aria-label="Bezárás">✕</button>
        </div>

        <div className="kioskUpsellGrid">
          {items.map((it) => (
            <button
              key={it.id}
              className="kioskUpsellCard"
              onClick={() => onAdd(it.id)}
            >
              {it.image ? <img className="kioskUpsellImg" src={it.image} alt={it.title} /> : null}
              <div className="kioskUpsellName">{it.title}</div>
              <div className="kioskUpsellPrice">{it.price.toLocaleString("hu-HU")} Ft</div>
              <div className="kioskUpsellCta">Hozzáadom</div>
            </button>
          ))}
        </div>

        <div className="kioskModalFooter">
          <button className="kioskBtn" onClick={onClose}>Most nem</button>
        </div>
      </div>
    </div>
  );
}
