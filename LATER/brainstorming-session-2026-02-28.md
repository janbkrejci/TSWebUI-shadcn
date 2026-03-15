---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: "Refactoring a zobecnění webové aplikace sloužící jako dokumentace a interaktivní hřiště pro ts-webui komponenty"
session_goals: "Zjednodušení a zobecnění aplikace pro snadnější rozšiřování, konzistentní úpravy a globální propisování změn bez nutnosti manuální kontroly každé stránky"
selected_approach: "ai-recommended"
techniques_used: ["First Principles Thinking", "SCAMPER Method"]
ideas_generated: [8]
technique_execution_complete: true
facilitation_notes: "User demonstrated strong architectural vision, pivoting from simple documentation refactoring to a build-time metadata generator, leading towards a low-code ERP platform vision."
context_file: ""
session_active: false
workflow_completed: true
---

# Výsledky Brainstormingové Sekce

**Moderátor:** jbk
**Datum:** 2026-02-28

## Přehled Sekce

**Téma:** Refactoring a zobecnění webové aplikace sloužící jako dokumentace a interaktivní hřiště pro ts-webui komponenty
**Cíle:** Zjednodušení a zobecnění aplikace pro snadnější rozšiřování, konzistentní úpravy a globální propisování změn bez nutnosti manuální kontroly každé stránky

### Příprava Sekce

Zaměření na **zobecnění a refaktorování stávající dokumentační/hřiště aplikace** pro `ts-webui` s cílem **usnadnit její údržbu a zajistit globální konzistenci**. Architektonické úpravy, znovupoužitelnost komponent na úrovni aplikace, sdílení stavu a uspořádání obsahu dokumentace tak, aby bylo snadné přidávat a upravovat ukázky. Hlavní cíle: Vytvoření robustního, snadno škálovatelného základu, který minimalizuje duplicitní kód a automatizuje propagaci změn napříč aplikací.

## Výběr Technik

**Přístup:** Techniky doporučené AI
**Doporučené techniky:** First Principles Thinking, SCAMPER Method.

## Výsledky Provádění Technik

### First Principles Thinking

- **Interaktivní konfigurátory jako standard:** Všechny komplexní komponenty (formuláře, tabulky) mají svůj interaktivní vizuální builder.
- **Architektura řízená metadaty:** Aplikace se stává univerzálním plátnem vykreslujícím JSON metadata, bez natvrdo kódovaných stránek.
- **Kód jako jediný zdroj pravdy:** Využití TypeScript typů jako zdroje pro generování metadat (zero-maintenance docs).
- **Explicitní sémantické typy:** Zavedení specifických typů (např. typu AvatarUrl), které jednoznačně určují, jaký UI widget se v dokumentaci použije pro editaci property.
- **Zero-Backend URL Stav:** Veškerý stav složitých komponent a hřiště žije v URL adrese.
- **Komprimovaný URL stav (LZString):** Řešení problému s délkou URL pomocí komprese, která funguje i jako přirozená obfuskace.

### Metoda SCAMPER

- **[Eliminate] Smazání manuálního routování:** Úplné odstranění ručně spravovaného adresáře `src/app` s ukázkami komponent.
- **[Substitute & Magnify] Build-Time CLI Generátor:** Nahrazení běhového prostředí jednorázovým generátorem (podobně jako RedwoodJS), který z metadat vygeneruje statický, výkonný Next.js web.
- **[Combine] Automatizované testování a Release Notes:** CLI generátor rovnou vytváří kombinační Playwright testy a s pomocí AI generuje srozumitelný changelog.
- **[Put to other uses] ERP Stavební Bloky:** Komponenty a jejich univerzální editory nejsou jen pro vývojáře, ale jsou fundamentálními "šrouby a cihlami" pro budoucí no-code/low-code podnikovou ERP platformu pro business uživatele.

## Organizace a Prioritizace Nápadů

**Tematická Organizace:**

1. Zero-Maintenance Architektura
2. Univerzální Editory a State Management
3. Extrémní Automatizace

**Výsledky Prioritizace:**

- **Nejvyšší Priorita:** Uživatel požaduje systematickou realizaci všech tří témat současně v sekvenčním celku, vzhledem k dostatku času a prostředků.
- **Průlomový Koncept pro Dlouhodobý Cíl:** Budování stavebních bloků pro Universal ERP ("šrouby a cihly").

**Akční Plán pro Implementaci:**

**Fáze 1: Zero-Maintenance Architektura (Základní vrstva)**

1. Vytvořit parser přes TypeScript Compiler API, který dokáže extrahovat sémantické typy a property.
2. Vytvořit základní CLI skript `generate:docs` pro tvorbu metadatových definic ze složky komponent.
3. Radikálně pročistit manuální `src/app` strukturu.

**Fáze 2: Univerzální Editory & Zpráva Stavu**

1. Na základní metadatovou vrstvu napojit globální "Type-to-Widget" registr.
2. Naprogramovat univerzální `UniversalEditor` komponentu pro renderování editoru na základě metadat.
3. Přidat synchronizaci se stavovým URL s využitím komprese `LZString`.

**Fáze 3: Extrémní Automatizace**

1. Rozšířit náš CLI generátor tak, aby z extrahovaných metadat chrlil `spec.ts` Playwright smoke testy (kombinatorické).
2. Integrovat AI SDK pro diffování AST stromů mezi verzemi, z čehož vzejdou automaticky tvořené srozumitelné Release Notes a dokumentace pro konkrétní komponentu.

## Shrnutí a Reflexe Sekce

**Klíčové úspěchy:**
Podařilo se překonat limitované zkoumání "zlepšování form-editoru a dokumentace" a objevit zcela novou architekturu "metadata-driven build-time platform", s obrovským přesahem do tvorby no-code backend/frontend ERP stavebních bloků.

**Reflexe sekce:**
Kombinace postupných technik "First Principles" (ořezání na kost) a "SCAMPER" (rozboření současného stavu) zafungovala bezvadně. Uživatel ukázal obrovskou odvahu měnit status quo a jít cestou maximální automatizace a systematičnosti.
