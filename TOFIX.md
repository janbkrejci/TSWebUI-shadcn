Oprav všechny následující chyby a nedostatky:

1. escape v column selector dropdownu ho nemá zavřít, pokud je neprázdný search field, v takovém případě má jen vyčistit search field a stop propagation té eventy. teprve když search field v column selectoru je prázdný a stisknu escap, dropdown se má schovat. nyní i když mám v search poli něco zadáno, tak první escape zavře column selector

2. oprav výpočet minimální šířky sloupce, musí se do headeru vejít label a pokud jsou povolené tak sort indicator a reordering ovládací prvky, teď jde sloupec zmenšit tak, že se tam tohle všechno nevejde

3. veškeré statické texty v celé knihovně musí být lokalizovatelné, zaveď mechanismus pro snadnou lokalizaci textů i formátování a timezone a vyrob anglickou (default) a českou mutaci, locale se má nastavovat v komponentách

4. aktualizuj LLM instrukce pro použítí TSWebUI-shadcn AI agentem
