Oprav všechny následující chyby a nedostatky:

1. pokud je ve filtr poli v column selectoru něco zadáno, první stisk Escape má jen vyprázdnit filtr pole a ne zavřít column selector dropdown. až když je filtr pole prázdné, escape smí zavřít column selector dropdown

2. minimální šířka sloupce by vždy měla být taková, aby se do záhlaví vešly všechny povolené ovládací prvky - když je povolen sorting, tak sort indicator, když je povolen column reordering, tak šipka nebo šipky pro reordering, jinak aspoň label
3. sorting button v headeru nemá mít při hover změnu barvy, má mít barvu jako pozadí headeru

4. když se resizuje sloupec, má se resizovat skutečně jen ten jeden sloupec. aktuálně se tabulka snaží být stejně široká jako viewport, takže pokud mám málo sloupců a jeden resizuji, ostatní se snaží přizpůsobit, aby celková šířka tabulky zůstala stejná, to nechci

5. veškeré statické texty v celé knihovně musí být lokalizovatelné, zaveď mechanismus pro snadnou lokalizaci textů i formátování a timezone a vyrob anglickou (default) a českou mutaci, locale se má nastavovat v komponentách
6. aktualizuj LLM instrukce pro použítí TSWebUI-shadcn AI agentem
