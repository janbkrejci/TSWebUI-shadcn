Proveď následující úpravy a pomocí screenshotů nebo videa mi prokaž, že je vše hotovo. Video nebo screenshoty dej do pěkné přehledné HTML stránky se zprávou

1. po několika iterácích stále není opraveno - escape v column selector dropdownu ho nemá zavřít, pokud je neprázdný search field, v takovém případě má jen vyčistit search field a stop propagation té eventy. teprve když search field v column selectoru je prázdný a stisknu escap, dropdown se má schovat. nyní i když mám v search poli něco zadáno, tak první escape zavře column selector

2. oprav výpočet minimální šířky sloupce, musí se do headeru vejít label a pokud jsou povolené tak sort indicator a reordering ovládací prvky, teď jde sloupec zmenšit tak, že se tam tohle všechno nevejde. už je to skoro dobře, ale jednak je málo prostoru kolem column reordering controls, ale hlavně pokud sloupec změní pořadí a změní se počet zobrazených controls pro posun sloupce, tak se minimální šířka musí přepočítat

3. Export button - když není nic filtrováno ani vybráno, tak rovnou stáhne exportní excel, to je OK. Když je něco vybráno, ale není filtrováno, tak má zobrazit dropdown jak to teď dělá, ale nemá v něm být nabídka exportovat filtrované (0), stejně tak pokud je jen filtrováno a není selection, nemá v dropdownu být nabídka exportovat vybrné (0).

4. veškeré statické texty v celé knihovně musí být lokalizovatelné, zaveď mechanismus pro snadnou lokalizaci textů i formátování a timezone a vyrob anglickou (default) a českou mutaci, locale se má nastavovat v komponentách

5. pokud je to potřeba, aktualizuj LLM instrukce pro použítí TSWebUI-shadcn AI agentem

6. konzultuj context7 a nahraď v projektu eslint a prettier pomocí biome, zatím je to jen částečně, biome umožňuje použít příkaz migrate a chtěl bych se eslintu a prettieru úplně zbavit i z pre-commit hooku a z CI pipeline, nechci souběžný provoz biome a eslintu a prettieru

7. ujisti se, že v běžící aplikaci nextjs na adrese http://localhost:3000/components/ts-table nejsou chyby, že pre-commit hook a CI pipeline procházejí bez chyb a warningů, jinak to sprav

