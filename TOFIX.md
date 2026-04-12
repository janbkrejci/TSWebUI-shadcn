Oprav všechny následující chyby a nedostatky:

1. filtr pole v selectoru sloupců musí držet focus i p5i click outside, dokud je column selector rozbalený.

2. pokud je ve filtr poli v column selectoru něco zadáno, první stisk Escape má jen vyprázdnit filtr pole a ne zavřít column selector. až když je filtr pole prázdné, escape smí zavřít column selector menu

3. resize sloupců - po manuálním resize sloupce by se šířka sloupce měla automaticky nastavit tak, aby byl vidět label a všechny ovládací prvky v něm, pokud uživatel nastavil menší šířku

4. pokud je enabled resizing sloupců, tak by i když nejsou hovered měly být trošku vidět resizery, stačí jen tenká nevýrazná čára uprostřed

5. label left aligned sloupce má vlevo margin nebo padding, takže label je oproti hodnotám v řádcích posunut doprava, totéž platí o labelu u sloupce zarovnaného doprava, ten má zase padding nebo margin vpravo. vizuálně to sjednoť tak, aby se hodnoty v řádcách i label zarovnávaly stejně

6. první dva sloupce (select a menu) musí mít vždy fixní šířku, i když je sloupců v tabulce málo a tabulka se snaží roztáhnout

7. ikona filtru v column selectoru má být zarovnaná vpravo

8. pořadí sloupců v column selectoru - nevybrané sloupce se nemají zařazovat na konec, mají zůstat mezi vybranými

9. aktualizuj LLM instrukce pro ts-table v LLM/skills/tswebui/SKILL.md
