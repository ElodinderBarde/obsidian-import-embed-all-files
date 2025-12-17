# IncludeALLFiles (QuickAdd Script)

Ein QuickAdd-JavaScript-Script für Obsidian, das **alle Dateien eines Ordners inklusive Unterordnern** automatisch in der aktuell geöffneten Markdown-Datei verlinkt.

Die Ausgabe erfolgt **hierarchisch nach Ordnerstruktur**, mit sauberen Wikilinks und Alias-Namen, ohne die aktuell geöffnete Datei selbst einzubeziehen.

---

## Zweck

Dieses Script dient der schnellen Erstellung von Übersichtsseiten, Inhaltsverzeichnissen oder Navigationsnoten innerhalb eines Obsidian-Vaults.

Typische Anwendungsfälle:

* Projektübersichten
* Dokumentations-Indizes
* Sammelnoten für Lernunterlagen
* Ordnerbasierte Inhaltsverzeichnisse

---

## Funktionsweise

* Ermittelt die aktuell aktive Markdown-Datei
* Bestimmt deren Ordner als Basis
* Durchsucht alle Dateien im Ordner und in allen Unterordnern
* Gruppiert Dateien nach relativen Unterordnern
* Erzeugt Überschriften entsprechend der Ordner-Tiefe
* Fügt Wikilinks mit Alias (Dateiname ohne Endung) ein
* Schließt die aktive Datei selbst aus
* Hängt die generierte Struktur **am Ende** der aktuellen Datei an

Die Logik ist vollständig in `IncludeALLFiles.js` implementiert .

---

## Voraussetzungen

* Obsidian (Desktop)
* QuickAdd Plugin
* Schreibrechte im Vault

Keine weiteren Plugins oder Abhängigkeiten erforderlich.

---

## Installation

1. Die Datei `IncludeALLFiles.js` in einen geeigneten Ordner im Vault kopieren
   (z. B. `Scripts/QuickAdd/`)
2. QuickAdd öffnen
3. Unter **Macros** ein neues Macro anlegen
4. Das Script `IncludeALLFiles.js` auswählen
5. Optional einen Shortcut vergeben

---

## Verwendung

1. Eine Markdown-Datei öffnen, die als Übersichtsseite dienen soll
2. Cursorposition ist irrelevant (Ausgabe wird am Ende angefügt)
3. QuickAdd-Macro ausführen

Nach der Ausführung enthält die Datei:

* Überschriften pro Ordner
* Darunter Wikilinks zu allen Dateien
* Saubere Alias-Namen ohne Dateiendungen

---

## Ausgabeformat (Beispiel)

```markdown
# Projektübersicht

## Unterordner A

[[Pfad/Datei1|Datei1]]
[[Pfad/Datei2|Datei2]]

## Unterordner B

[[Pfad/Datei3|Datei3]]
```

Die Heading-Tiefe richtet sich nach der Ordnerstruktur relativ zur aktuellen Datei.

---

## Technische Details

* Sprache: JavaScript (Node-kompatibel)
* API-Nutzung:

  * `app.vault`
  * `app.workspace`
* Fallbacks für unterschiedliche Obsidian-Versionen (`getAllLoadedFiles`, `getFiles`)
* Robuste Pfadbehandlung (Root-Ordner unterstützt)
* Sanitizing von Link-Zielen:

  * Entfernt problematische Zeichen (`|`, `[`, `]`)
  * Erhält Slashes im Pfad
* Sortierung:

  * Ordner alphabetisch (Root zuerst)
  * Dateien alphabetisch nach Basename

---

## Einschränkungen

* Funktioniert nur in der Desktop-Version von Obsidian
* Verlinkt alle Dateitypen, nicht nur Markdown
* Keine Konfigurationsoberfläche
* Keine Vorschau vor dem Einfügen





## Autor

Elodin


