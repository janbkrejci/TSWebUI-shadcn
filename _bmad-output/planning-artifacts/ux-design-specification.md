---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
  - TODO.md
---

# UX Design Specification TSWebUI-shadcn

**Author:** jbk
**Date:** 2026-02-28

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Project Understanding

### Executive Summary

#### Project Vision

Modernizace a portace systému **TsForm** a **TsFormEditor** do prostředí Next.js 16, React 19 a Shadcn/UI (Tailwind v4). Cílem je vytvořit robustní, JSONem řízený systém pro formuláře, který je vizuálně přitažlivý, technicky čistý a snadno použitelný i pro business uživatele (ne-programátory) v rámci editoru.

#### Target Users

- **Business uživatelé / Ne-programátoři:** Hlavní uživatelé `TsFormEditoru`, kteří potřebují intuitivní "drag-and-drop" zážitek pro návrh formulářů bez nutnosti psát kód.
- **Koncoví uživatelé:** Lidé vyplňující formuláře. Očekávají jednoduchost, čistotu a funkčnost bez zbytečných animací nebo efektů.
- **Vývojáři:** Implementují TsForm jako prezentační komponentu a integrují ji s backendovou (nebo externí frontendovou) validací.

#### Key Design Challenges

- **Vizuální zarovnání v mřížce (Grid Alignment):** Zajištění perfektního horizontálního zarovnání vstupních polí v rámci jednoho řádku. Vršky inputů musí být v jedné lince bez ohledu na přítomnost labelů nad nimi, chybových hlášek pod nimi nebo různé výšky widgetů (např. textarea vs. klasický input).
- **Konzistence bez "živosti":** Udržení moderního a estetického vzhledu Shadcn/UI při zachování maximální jednoduchosti a přehlednosti. Žádné "obezličky", jen čistá data a inputy.
- **Editor usability:** Dodržení standardního patternu (Paleta -> Canvas -> Property Sheet) tak, aby byl editor okamžitě srozumitelný pro business uživatele.

#### Design Opportunities

- **Prediktabilní layout:** Vytvoření robustního systému CSS mřížky, který automaticky vyřeší zarovnání a odsazení, takže ani ne-programátor nemůže v editoru vytvořit "rozbitý" formulář.
- **Smart Fields:** Využití "Smart Date Parsing" a dalších drobných vylepšení pro zvýšení efektivity vyplňování bez narušení jednoduchosti UI.

## Core User Experience

### Defining Experience

Jádrem zážitku je **"Efektivní cyklus návrhu a precizní sběr dat"**. V editoru jde o rychlou transformaci logické struktury do JSONu (přes zástupné symboly), zatímco ve formuláři jde o nerušené vyplňování, kde i interakce s backendem (validace, změny props) probíhá plynule bez ztráty kontextu uživatele.

### Platform Strategy

- **Primární platforma:** Web (Next.js 16).
- **Prostředí:** Desktop-first, optimalizováno pro klávesnici a myš (intenzivní práce s daty).
- **Responzivita:** Základní podpora pro čitelnost na menších zařízeních, ale plná funkčnost editoru je cílena na velké monitory.

### Effortless Interactions

- **Inteligentní parsování:** Klávesnice jako hlavní nástroj pro rychlé zadávání (data, čísla).
- **Strukturální grid:** Automatické zarovnání "vršků" inputů v řádku, které schová komplexitu podkladového layoutu.
- **Transparentní synchronizace:** Změny vlastností formuláře (např. chyby) se "vpropisují" do UI, aniž by uživatel musel znovu hledat, kde skončil.

### Critical Success Moments

- **Kontextová kontinuita (Moment Úspěchu):** Uživatel odešle formulář, dostane chybu z backendu, ale jeho kurzor zůstane v poli, aktivní záložka se nezmění a data v ostatních polích jsou nedotčena. Pocit bezpečí a kontroly.
- **Strukturální shoda:** Moment, kdy preview přesně odpovídá logickému rozložení symbolů v editoru, což buduje důvěru v nástroj.

### Experience Principles

- **State Integrity (Integrita stavu):** Nikdy neztrácet uživatelova data, focus ani pozici při aktualizaci vlastností formuláře.
- **Vizuální rytmus (Alignment):** Horizontální zarovnání vstupních prvků je svaté – vizuální šum (labels, errors) nesmí rozbít linku inputů.
- **Logika nad vizualitou (v Editoru):** Prioritou editoru je správná struktura JSONu a logické vazby, ne pixel-perfect reprezentace (tu řeší preview).
- **Rychlost odeslání (No-friction):** Minimalizace kroků potřebných k opravě chyby a odeslání dat.

## Desired Emotional Response

### Primary Emotional Goals

Uživatelé by se měli při používání systému cítit **"nepřemožitelně efektivní a v naprostém bezpečí"**. V editoru by měli mít pocit **architekta**, který má nad strukturou plnou kontrolu, zatímco ve formuláři by měli pociťovat **klid a soustředění** díky čistému a předvídatelnému prostředí.

### Emotional Journey Mapping

- **První dojem:** Důvěra a profesionalita (čistý Shadcn design bez vizuálního šumu).
- **Průběh práce (Flow):** Soustředění na data, ne na ovládání nástroje. Žádné vytrhávání z kontextu.
- **Řešení chyb:** Místo frustrace konstruktivní pocit "vím přesně, co mám opravit a jak to udělat bleskově".

### Micro-Emotions

- **Důvěra vs. Nejistota:** Naprostá jistota, že kliknutí na jakékoli tlačítko nebo změna vlastností (errors, props) nepovede ke ztrátě rozdělané práce nebo focusu.
- **Úspěch vs. Frustrace:** Pocit zadostiučinění, když systém "pochopí" zkrácený zápis (např. u data) a uživatel nemusí bojovat s kalendářem.

### Design Implications

- **Důvěra a Bezpečí** → Implementace **State Integrity** (zachování stavu při každé aktualizaci).
- **Soustředění a Klid** → Dodržení **Vizuálního rytmu** (perfektní horizontální zarovnání vršků inputů).
- **Efektivita** → Nasazení **Smart Parsování** a intuitivních klávesových zkratek.

### Emotional Design Principles

- **Safety First (Integrita dat):** Nikdy neriskovat ztrátu uživatelova vstupu nebo pozice.
- **Professional Clarity (Vizuální klid):** Minimalismus a zarovnání, které eliminuje kognitivní zátěž.
- **Empowered Efficiency (Chytré nástroje):** Systém, který uživateli aktivně pomáhá být rychlejší, aniž by ho poučoval.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

Pro návrh systému **TsForm** a **TsFormEditor** čerpáme inspiraci z nástrojů, které excelují v kombinaci komplexity a srozumitelnosti:

- **Retool / Internal:** Vzor pro rozvržení editoru (Paleta-Canvas-Properties), který je standardem pro efektivní stavbu rozhraní.
- **Tally.so / Notion:** Inspirace pro vizuální čistotu, práci s bloky (widgety) a minimalistický přístup k UI.
- **Typeform / Google Forms:** Přístup k jednoduchosti a lineárnímu toku vyplňování formulářů.

### Transferable UX Patterns

- **Třípanelový Editor:** Jasné rozdělení na paletu komponent (vlevo), pracovní plochu (uprostřed) a nastavení vlastností (vpravo).
- **Klávesové zkratky a Smart Parsing:** Vzory z profesionálních IDE a moderních datových editorů pro bleskový vstup dat.
- **Indikátory kontextu:** Vizuální signály (např. tečky na tabech), které uživatele vedou k chybám bez nutnosti prohledávat celý formulář.

### Anti-Patterns to Avoid

- **Nadbytečné animace ("Liveness"):** Vyhýbáme se vizuálním efektům, které zdržují nebo působí rušivě při intenzivní práci.
- **Ztráta kontextu:** Žádná modální okna, která by zakrývala pracovní plochu při editaci vlastností.
- **Vizuální nekonzistence:** Zamezení "skákání" inputů v řádku kvůli různé délce labelů nebo přítomnosti chybových hlášek.

### Design Inspiration Strategy

- **Adoptovat:** Strukturu editoru z Retoolu, která je intuitivní i pro ne-programátory.
- **Adaptovat:** Čistotu Shadcn/UI pro specifické potřeby komplexních, JSONem řízených formulářů.
- **Vyhnout se:** Jakýmkoli prvkům, které by narušovaly integritu stavu (State Integrity) nebo vizuální rytmus zarovnání.

## Design System Foundation

### 1.1 Design System Choice

Pro projekt **TsForm** a **TsFormEditor** volíme **Shadcn/UI** postavený na **Radix UI** a **Tailwind CSS v4**.

### Rationale for Selection

- **Moderní Stack:** Plná kompatibilita s Next.js 16 a React 19 (Server Components, moderní hooks).
- **Vizuální čistota:** Odpovídá našemu cíli "jednoduchých formulářů bez obezliček" a minimalistické estetice.
- **Flexibilita a Kontrola:** Shadcn nám dává plný přístup ke zdrojovému kódu komponent, což je klíčové pro implementaci specifických UX požadavků (např. horizontální zarovnání vršků inputů).
- **Přístupnost (A11y):** Radix UI pod kapotou zaručuje, že naše formuláře budou přístupné i pro uživatele s asistivními technologiemi.

### Implementation Approach

- **Atomic Design:** Každý z 20+ widgetů bude postaven z atomických Shadcn komponent, což zajistí 100% vizuální konzistenci.
- **Shared Utilities:** Využití Tailwind v4 pro definici globálních designových tokenů (odsazení, barvy, typografie), které se propíšou do všech polí.
- **State-Safe Components:** Návrh widgetů tak, aby byly čistě prezentační a neztrácely vnitřní stav (focus, cursor position) při aktualizaci vlastností zvenčí.

### Customization Strategy

- **Grid Alignment System:** Vytvoření vlastních CSS pravidel/komponent pro automatické horizontální zarovnání vstupních prvků v řádku bez ohledu na labels nebo errors.
- **Themeable Look & Feel:** Snadná úprava globálního tématu přes CSS proměnné, aby systém odpovídal budoucím vizuálním požadavkům bez nutnosti měnit logiku widgetů.

## 2. Core User Experience

### 2.1 Defining Experience

Definující zkušeností pro **TsForm** a **TsFormEditor** je **"Složitost v JSONu, jednoduchost v akci"**. Uživatel by měl mít pocit, že může postavit libovolně komplexní formulář, který bude vždy působit profesionálně, předvídatelně a bezpečně. Klíčem je **kontextová kontinuita** (State Integrity) a **vizuální rytmus** (Grid Alignment).

### 2.2 User Mental Model

Uživatelé o systému přemýšlejí jako o logické skládačce (v editoru) a efektivním datovém vstupu (ve formuláři). Očekávají, že:

- **Struktura JSONu** přímo odpovídá vizuálnímu rozložení prvků.
- **Nastavení vlastností** v editoru okamžitě a logicky ovlivní chování widgetů.
- **Formulář je inteligentní**, ale ne vlezlý (Smart Parsing bez animací).

### 2.3 Success Criteria

- **Persistence stavu:** Žádná ztráta focusu nebo dat při aktualizaci vlastností formuláře (např. při chybě z backendu).
- **Vizuální preciznost:** Všechna vstupní pole v jednom řádku gridu jsou horizontálně zarovnaná na svůj horní okraj, bez ohledu na labels nebo errors.
- **Rychlost odeslání:** Uživateli trvá minimum času (v řádu sekund) identifikovat chybu, opravit ji a odeslat formulář znovu.
- **Srozumitelnost editoru:** Ne-programátor dokáže vytvořit funkční formulář s využitím standardního patternu (Paleta-Canvas-Properties).

### 2.4 Novel vs. Established Patterns

- **Zavedené:** Pattern třípanelového editoru a grid-based layoutu formuláře.
- **Novátorské:** Precizní horizontální zarovnání "vršků" inputů napříč 20+ různými widgety, které standardní UI knihovny často neřeší do takového detailu.

### 2.5 Experience Mechanics

- **Iniciace:** Výběr widgetu z palety a jeho umístění do slotu v gridu.
- **Interakce:** Nastavení vlastností (field key, label, options) v property sheetu s okamžitým promítnutím do preview.
- **Zpětná vazba:** Vizuální indikace chyb na konkrétních polích a záložkách, doplněná o smart parsing, který "napovídá" uživateli správný formát při psaní.
- **Dokončení:** Export validního JSONu nebo odeslání dat přes onSubmit callback bez vizuálních artefaktů nebo ztráty kontextu.

## Visual Design Foundation

### Color System

Využíváme stávající barevné schéma projektu postavené na **Shadcn/UI** (standardní CSS proměnné):

- **Primární:** Akce a interaktivní prvky.
- **Destructive:** Jasná vizuální indikace chyb z backendu (propojení s chybovými hláškami z props).
- **Muted/Foreground:** Pro labely a nápovědy, aby vizuálně nekonkurovaly obsahu inputů.
- **Contrast:** Přísné dodržení kontrastních poměrů pro maximální čitelnost dat.

### Typography System

Držíme se standardní typografie projektu (**Geist/Inter**):

- **Čitelnost:** Optimalizace velikostí písma pro kompaktní zobrazení (hustší text, menší proklady).
- **Hierarchie:** Využití tloušťky písma (Medium/Bold) pro labely, aby byly jasně odlišeny od vyplněných dat i v hustém layoutu.

### Spacing & Layout Foundation

- **Kompaktní hustota (Compact Density):** Minimalizace vertikálních marginů a paddingů (využití 4px gridu), aby bylo možné zobrazit až 20 widgetů na jednu záložku při zachování přehlednosti.
- **Top-Aligned Grid Rule:** Striktní pravidlo pro horizontální zarovnání: **"Všechna vstupní pole v jednom řádku gridu musí mít horní hranu (border-top) na stejné horizontální linii."**
- **Zpracování doplňků:** Labely nad inputy a chybové hlášky pod nimi nesmí narušit tuto základní linku (využijeme absolutní pozicování nebo fixní výšky slotů pro doplňky).

### Accessibility Considerations

- **Keyboard Focus:** Jasně viditelné focus stavy (klíčové pro integritu stavu a navigaci klávesnicí).
- **Error Clarity:** Chyby nejsou indikovány pouze barvou, ale i textem a pozicí, což pomáhá uživatelům s poruchami barvocitu.
- **Screen Readers:** Zachování správné sémantiky i v našem upraveném gridu pro zarovnání.

## 3. Design Direction Decision

### 3.1 Design Directions Explored

Prozkoumali jsme tři hlavní vizuální směry:

- **Ultra-Compact Grid:** Maximální hustota s labely po stranách.
- **Modern Functional:** Shadcn styl s minimalizovanými vertikálními prostory a labely nahoře.
- **Semantic Blocks:** Rozdělení formuláře do logických celků pro lepší orientaci v komplexních datech.

### 3.2 Chosen Direction

Zvoleným směrem je **kombinace Modern Functional a Semantic Blocks**. Tento přístup zachovává moderní estetiku projektu při dodržení striktních požadavků na kompaktnost a vizuální řád.

### 3.3 Design Rationale

- **Efektivita prostoru:** Umožňuje zobrazení 20+ widgetů na jedné záložce bez vizuálního chaosu.
- **Vizuální rytmus:** Implementace fixních slotů pro labely a chybové hlášky zaručuje, že vršky všech inputů v řádku gridu budou vždy v jedné rovině.
- **Srozumitelnost:** Logické bloky pomáhají uživateli (zejména ne-programátorům v editoru) rychle dekódovat strukturu formuláře.

### 3.4 Implementation Approach

- **Grid Slots:** Využití Tailwind v4 pro definici mřížky s pevně danými výškami pro doprovodné texty (labels/errors), aby samotná vstupní pole nikdy neposkakovala.
- **Sectional Design:** Vizuální oddělení skupin polí pomocí jemných borderů nebo stínování, což podpoří mentální model "skládačky" v editoru.
- **Consistent Hierarchy:** Jednotná velikost a váha písma pro všechny typy widgetů, zajišťující klidné a profesionální rozhraní.

## 4. User Journey Flows

### 4.1 Journey: Návrh nového formuláře (TsFormEditor)

**Cíl:** Business uživatel bez technických znalostí vytvoří strukturu formuláře pro sběr dat.

- **Vstup:** Inicializace editoru s prázdným nebo existujícím JSONem.
- **Interakce:** Výběr widgetu z palety, přetažení do slotu v gridu na canvasu, konfigurace v property sheetu (field key, label, required).
- **Organizace:** Dynamická tvorba layoutu (přidávání řádků/sloupců), rozdělení polí do logických tabů (záložek).
- **Validace:** Okamžitý náhled (Preview) a validace unikátnosti klíčů polí (Úkol 12).
- **Výstup:** Export validního JSON definice pro TsForm.

### 4.2 Journey: Vyplnění a odeslání dat (TsForm)

**Cíl:** Koncový uživatel bezchybně a rychle odešle data.

- **Vstup:** Načtení formuláře se vstupními daty (nebo prázdného).
- **Práce s daty:** Vyplňování polí s podporou **Smart Parsingu** (např. automatické doplňování data/čísla).
- **Kritický moment (Submit):** Odeslání dat a příjem chyb z backendu přes props.
- **Oprava chyb:** Vizuální navigace k chybám (indikátory na tabech - Úkol 6b) při zachování **integrity stavu** (žádná ztráta focusu nebo vyplněných dat).
- **Výstup:** Úspěšné odeslání dat přes onSubmit callback.

### Journey Patterns

- **Drag-Drop-Configure:** Standardní pattern pro editor (Paleta -> Canvas -> Properties).
- **Focus-Submit-Recover:** Cyklus ve formuláři zaměřený na rychlou opravu chyb bez narušení kontextu.
- **Tabbed Discovery:** Navigace mezi komplexními datovými celky s jasnou signalizací stavu (validní/nevalidní).

### Flow Optimization Principles

- **Zero Friction Correction:** Umožnit uživateli opravit chybu s minimem kliknutí (automatický skok na první chybu, zachování cursoru).
- **Structural Predictability:** Každá akce v editoru má jasně předvídatelný dopad na strukturu JSONu a vizuální preview.
- **Keyboard First:** Optimalizace všech flow pro ovládání klávesnicí (tab-navigace, enter-submit, zkratky).

## 5. Component Strategy

### 5.1 Design System Components (Shadcn/UI)

Využíváme standardní atomické komponenty ze **Shadcn/UI** (Input, Button, Tabs, Select, Checkbox, atd.) jako základní stavební kameny. Tyto komponenty jsou čistě prezentační a jejich vzhled je řízen globálními Tailwind v4 tokeny.

### 5.2 Refactoring: Widget-per-file Strategy

Hlavním architektonickým cílem je rozdělení monolitického `ts-form-field.tsx` na izolované moduly v adresáři `widgets/` (ÚKOL 2). Každý widget (např. `text-widget.tsx`, `number-widget.tsx`) bude mít:

- **Narrowed Props:** Explicitní TypeScript interface bez použití `any` (ÚKOL 1).
- **Isolace logiky:** Vlastní handlery pro focus, click a klávesové zkratky (ÚKOL 3).
- **State-Safe Design:** Implementace, která zaručuje, že re-render zvenčí (např. při příjmu nových chyb z props) nezpůsobí ztrátu rozepsaných dat nebo pozice kurzoru.

### 5.3 Custom & Enhanced Components

- **TsFormField Dispatcher:** Zredukovaný na switch logiku a label/error wrapper, který zajišťuje striktní horizontální zarovnání vršků inputů.
- **Smart Widgets:** Rozšíření standardních inputů o logiku **Smart Date Parsing** (ÚKOL 8) a **Number Locale/Rounding** (ÚKOL 7).
- **Relationship Picker:** Implementace multi-column zobrazení v dialogu pro lepší orientaci v komplexních datech (ÚKOL 11).
- **Tab Indicators:** Vizuální signalizace chyb na záložkách (červená tečka), která uživatele vede k opravě bez nutnosti prohledávat celý formulář (ÚKOL 6b).

### 5.4 Implementation Roadmap (Priority Focus)

- **Phase 1 (Core):** Odstranění Zod validace (ÚKOL 0) a rozdělení widgetů do samostatných souborů s využitím sdílených utilit.
- **Phase 2 (Typing & API):** Kompletní revize typování a zavedení callbacků `onFieldChange` a `onAction`.
- **Phase 3 (Features):** Implementace chybějících atributů (autofocus, hideLabel, readOnly) a vylepšení editoru (rename field, insert column).

## 5. UX Consistency Patterns

### 5.1 Button Hierarchy

- **Kontrola integrátora:** Viditelnost a dostupnost tlačítek (i v `readOnly` režimu) je plně řízena konfigurací v `buttons` prop (ÚKOL 5).
- **Vizuální varianty:** Využití standardních Shadcn variant (`default` pro primární akce, `outline/ghost` pro sekundární) pro zachování profesionálního vzhledu.
- **Stav Disabled:** Jasná vizuální indikace pro uživatele, že akce není dostupná (např. při probíhajícím odesílání).

### 5.2 Feedback Patterns

- **Reaktivní Errors:** Chybové hlášky se zobrazují **výhradně** na základě změn v `errors` property formuláře. Žádná interní validační logika v TsForm (ÚKOL 0).
- **Navigace k chybám (Tab Indicators):** Vizuální signalizace chyb na záložkách (červená tečka), která uživatele navádí k opravě v neaktivních částech formuláře (ÚKOL 6b).
- **Layout Integrity:** Využití fixních slotů pro chybové texty v gridu, aby zobrazení chyby nezpůsobilo nechtěné "poskočení" nebo překreslení celého layoutu.

### 5.3 Form Patterns

- **Sémantika Read-only vs. Disabled:** Rozlišení stavů podle tvého pravidla – `readOnly` (ÚKOL 14) nemění barvu pozadí (nepoužívá disabled šedou), zatímco `disabled` pole jsou vizuálně utlumena.
- **Grid Alignment:** Striktní horizontální zarovnání všech vstupních polí v řádku na jejich horní hranu (border-top) přes sdílenou utilitu `getFieldClasses` (ÚKOL 3.2).
- **Smart Parsing Feedback:** Okamžitá vizuální aktualizace hodnoty (např. u data) po rozostření pole (onBlur) pomocí `smartParseDate` (ÚKOL 8).

### 5.4 Navigation Patterns

- **Programové přepínání (activeTab):** Podpora pro dálkové ovládání aktivní záložky přes `activeTab` prop (ÚKOL 6a), což umožňuje integrátorovi reagovat na události mimo formulář.
- **Konzistence Tabů:** Jednotné zobrazení záložek napříč všemi formuláři, podporující rychlou orientaci v komplexních datech.

### 5.5 Additional Patterns

- **Focus Persistence:** Zajištění, aby aktualizace vlastností (nové chyby z backendu) nezpůsobila ztrátu focusu nebo cursor position, což je klíčové pro plynulý uživatelský zážitek (ÚKOL 3.4).

## 6. Responsive Design & Accessibility

### 6.1 Responsive Strategy

- **Desktop (Primární):** Využití plné šířky pro multi-column layouty (řádky s více widgety) při zachování vysoké hustoty (compact density).
- **Tablet:** Layout zůstává věrný desktopu, ale s optimalizovanými paddingy pro dotykové ovládání (zejména u selectů a kalendářů).
- **Mobile:** Automatický přechod na jednosloupcový stack (všechny widgety 100% šířka). Adaptace tabů na horizontálně skrolovatelný pás nebo vertikální seznam.

### 6.2 Breakpoint Strategy

Využíváme standardní breakpointy **Tailwind CSS v4** pro konzistenci s celým projektem:

- **sm (640px):** Přechod na základní grid.
- **md (768px):** Tabletová optimalizace.
- **lg (1024px):** Plný desktopový zážitek.

### 6.3 Accessibility Strategy (WCAG 2.1 AA)

- **Klávesnice:** Naprostá priorita. Plná podpora navigace (Tab, Enter, šipky) bez ztráty focusu díky integraci s **Radix UI**.
- **Kontrast a Čitelnost:** Dodržení standardních Shadcn barevných schémat s vysokým kontrastem pro texty i interaktivní prvky.
- **Sémantika:** Použití správných HTML5 tagů a ARIA atributů pro zajištění kompatibility se čtečkami obrazovky.

### 6.4 Implementation Guidelines

- **Relativní jednotky:** Výhradní použití procent, `fr` jednotek gridu a `rem` pro texty (žádné pevné pixely).
- **Vizuální Focus:** Zachování výrazných focus indikátorů (rings) pro všechny interaktivní prvky.
- **Touch Targets:** Minimální velikost dotykových ploch 44x44px pro tabletovou a mobilní verzi.
