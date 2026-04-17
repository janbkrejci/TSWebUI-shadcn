Proveď následující úpravy:

1. reviduj svg ikony v public folderu, pokud se nepoužívají, smaž je

2. tlačítko pro výběr jazyka - default má být čeština, na tlačítku zobrazovat jen vlaječku, vlaječky nahradit SVG verzí, v dropdownu jen labely jazyků. tlačítko přidat do component registry a na demo stránky

3. lokalizovatelné mají být i texty na demo stránkách, labely v tabulce a formuláři, placeholdery v inputech, hinty, chybové hlášky, tooltipy, prostě všechno, co uživatel vidí

4. ujisti se, že nové komponenty (volba jazyka, ale pokud jsou i jiné, tak i ty) jsou správně zahrnuty na demo stránkách a v component registry, že jsou vyřešeny závislosti, aby se komponenty z registry správně instalovaly

5. pokud je to potřeba, aktualizuj LLM instrukce pro použítí TSWebUI-shadcn AI agentem

6. až bude vše hotovo, pushni to na github a ujisti se, že CI pipeline projde bez warningů a chyb, pokud ne, oprav to

7: pomocí screenshotů nebo videa mi prokaž, že je vše hotovo. Video nebo screenshoty dej do pěkné přehledné HTML stránky se zprávou do adresáře proof, který vyloučíš v .gitignore z repository.
