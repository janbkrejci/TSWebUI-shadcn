Oprav všechny následující chyby a nedostatky:

1. pokud je ve filtr poli v column selectoru něco zadáno, první stisk Escape má jen vyprázdnit filtr pole a ne zavřít column selector dropdown. až když je filtr pole prázdné, escape smí zavřít column selector dropdown

2. minimální šířka sloupce by vždy měla být taková, aby se do záhlaví vešly všechny povolené ovládací prvky - když je povolen sorting, tak sort indicator, když je povolen column reordering, tak šipka nebo šipky pro reordering, jinak aspoň label
3. label left aligned sloupce má vlevo margin nebo padding, takže label je oproti hodnotám v řádcích posunut doprava, totéž platí o labelu u sloupce zarovnaného doprava, ten má zase padding nebo margin vpravo. vizuálně to sjednoť tak, aby se hodnoty v řádcách i label zarovnávaly stejně

4. první dva sloupce (select a menu) musí mít vždy fixní šířku, i když je sloupců v tabulce málo nebo hodně a tabulka se snaží roztáhnout nebo je v ní málo místa. tyhle dva sloupce, pokud jsou vidět, musí mít vždy stejnou šířku

5. clcear filters v column selectoru nemá zavřít column selector dropdown

6. sorting indicator v headeru sloupce má být vidět jen když se podle sloupce sortuje, anebo při hover (méně výrazný), teď je vidět vždy

7. uprav import přesně podle referenční implementace tak, aby bylo flow stejné - tabulka se postará o vybrání souboru a kontrolu sloupců, potom se volá externí handler a pak se čeká na volání zvenčí, které zobrazí výsledek importu. uprav podle toho i demo stránku (jako by se import částečně povedl, ale do tabulky nic nepřidávej)

8. aktualizuj LLM instrukce pro použítí TSWebUI-shadcn AI agentem
