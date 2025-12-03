import re
from pathlib import Path

# Itt add meg a bemeneti és kimeneti fájl nevét / útvonalát
INPUT_FILE = Path("kleo-theme v5.css")
OUTPUT_FILE = Path("kleo-theme v5.css")


def remove_comments(css: str) -> str:
    """
    Minden /* ... */ típusú komment eltávolítása, hogy egyszerűbb legyen a feldolgozás.
    """
    return re.sub(r"/\*[\s\S]*?\*/", "", css)


def split_base_and_atrules(css_no_comments: str):
    """
    Szétválasztja:
      - alap (nem @-szabály) CSS részeket
      - @-szabály blokkokat (@media, @keyframes, @import, stb.)

    Visszatér:
      base_css (string): az összefűzött "sima" CSS
      at_rules (list[str]): a teljes @-szabály blokkok listája
    """
    n = len(css_no_comments)
    i = 0
    last_base_index = 0
    base_chunks = []
    at_rules = []

    while i < n:
        ch = css_no_comments[i]
        if ch == "@":
            # ami eddig nem @-szabály volt, az megy a base_chunks-ba
            if i > last_base_index:
                base_chunks.append(css_no_comments[last_base_index:i])

            start = i
            j = i

            # keressük a { vagy ; jelet – ezzel zárul az at-rule fejléce
            while j < n and css_no_comments[j] not in "{;":
                j += 1

            if j == n:
                # a fájl vége is at-rule
                at_rules.append(css_no_comments[start:])
                i = n
                last_base_index = n
                break

            if css_no_comments[j] == ";":
                # pl. @import url("..."); – nincs blokktörzs
                k = j + 1
                at_rules.append(css_no_comments[start:k])
                i = k
                last_base_index = i
                continue

            # ha { jött, akkor blokkos at-rule (pl. @media, @keyframes)
            depth = 0
            k = j
            while k < n:
                if css_no_comments[k] == "{":
                    depth += 1
                elif css_no_comments[k] == "}":
                    depth -= 1
                    if depth == 0:
                        k += 1
                        break
                k += 1

            at_rules.append(css_no_comments[start:k])
            i = k
            last_base_index = i
        else:
            i += 1

    # a maradék „simacs” rész a végén
    if last_base_index < n:
        base_chunks.append(css_no_comments[last_base_index:])

    base_css = "".join(base_chunks)
    return base_css, at_rules


def dedup_keep_last_block(css_text: str) -> str:
    """
    Duplikált selector blokkok kiszűrése úgy, hogy mindig a LEGUTOLSÓ blokk maradjon.

    Logika:
    - Kommentek törlése
    - @-szabályok kiemelése (ezek változatlanul maradnak)
    - Alap CSS-ben:
        * minden selector utolsó előfordulását keressük meg
        * ugyanarra a selectorra a legutolsó blokk teljes törzsét tartjuk meg
        * a selectorok sorrendjét az alapján rendezzük, hol volt az utolsó előfordulásuk
    """
    # 1) Kommentek eltávolítása
    css_no_comments = remove_comments(css_text)

    # 2) @-szabályok külön kezelése
    base_css, at_rules = split_base_and_atrules(css_no_comments)

    # 3) Sima szabályok: selector { ... } blokkok feldolgozása
    rule_pattern = re.compile(r"([^{]+)\{([^}]*)\}")

    # Minden selectorhoz eltároljuk:
    # - utolsó előfordulásának pozícióját (hogy rendezzük)
    # - utolsó blokkjának törzsét (body-t)
    selector_lastpos = {}
    selector_body = {}

    for m in rule_pattern.finditer(base_css):
        selector_raw = m.group(1).strip()
        body_raw = m.group(2)

        if not selector_raw:
            continue

        # felesleges whitespace-ek kiszűrése
        selector = re.sub(r"\s+", " ", selector_raw)

        # pozíció az alap CSS-ben – minél nagyobb, annál későbbi
        start_pos = m.start()

        # mindig felülírjuk: így a legutolsó blokk marad
        selector_lastpos[selector] = start_pos
        selector_body[selector] = body_raw.strip()

    # 4) Selectorok rendezése az utolsó előfordulásuk helye szerint
    ordered_selectors = sorted(selector_lastpos.keys(), key=lambda s: selector_lastpos[s])

    # 5) Új CSS-állomány összerakása
    lines = []
    lines.append("/*")
    lines.append(" * De-duplicated CSS – automatikusan generált fájl.")
    lines.append(" * Minden selector csak egyszer szerepel; ha többször is előfordult,")
    lines.append(" * mindig a LEGUTOLSÓ blokk maradt meg (a legfrissebb beírás).")
    lines.append(" */")
    lines.append("")

    for sel in ordered_selectors:
        body = selector_body[sel]
        lines.append(f"{sel} {{")
        # A body-t soronként újraformázzuk
        for decl in body.split(";"):
            decl = decl.strip()
            if not decl:
                continue
            lines.append(f"  {decl};")
        lines.append("}")
        lines.append("")

    # 6) Eredeti @-szabály blokkok hozzáfűzése (media query-k, keyframes, stb.)
    if at_rules:
        lines.append("")
        lines.append("/*")
        lines.append(" * Eredeti @-szabály blokkok (media query-k, keyframes, importok, stb.)")
        lines.append(" * Ezek tartalma változatlanul maradt.")
        lines.append(" */")
        lines.append("")
        lines.append("".join(at_rules).strip())
        lines.append("")

    return "\n".join(lines)


def main() -> None:
    if not INPUT_FILE.exists():
        raise SystemExit(f"Nem találom a bemeneti fájlt: {INPUT_FILE}")

    css_text = INPUT_FILE.read_text(encoding="utf-8")
    cleaned = dedup_keep_last_block(css_text)
    OUTPUT_FILE.write_text(cleaned, encoding="utf-8")

    print()
    print("Kész vagyunk.")
    print(f"  Bemenet : {INPUT_FILE}")
    print(f"  Kimenet : {OUTPUT_FILE}")
    print("A kimeneti fájlban minden selectorból csak a legutolsó blokk maradt meg.")


if __name__ == "__main__":
    main()
