# PersoPro - Statische Website Entwicklung

## Projektübersicht
Erstelle eine statische HTML-Website für den Personaldienstleister "PersoPro" (Gastronomie & Events), die auf GitHub Pages gehostet werden kann.

## Design System
Das komplette Design System ist in der beigefügten `design.json` Datei definiert. Verwende EXAKT diese Spezifikationen:
- Farbpalette: Navy (#1E3A5F) als Primary, Orange (#E67E22) als Secondary
- Typography: System Fonts mit definierten Größen und Gewichtungen
- Komponenten: Cards, Buttons, Forms wie spezifiziert
- Animationen und Transitions wie definiert

## Seitenstruktur

### 1. index.html (Homepage)
- Hero Section mit Hintergrundvideo und CTA
- Über uns Preview
- Leistungen/Rollen Übersicht (Küche, Service, Theke, Event)
- Kontakt CTA

### 2. unsere-leistungen.html
- Leistungen-Header mit CTA
- Grid mit Leistungs-/Rollen-Cards
- Optional: Tabs/Toggle (Kurzfristiger Einsatz vs. Langfristige Planung)

### 3. ueber-uns.html
- Firmengeschichte
- Team-Sektion mit Mitarbeiter-Cards
- Werte und Mission
- Büro-Fotos

### 4. kontakt.html
- Kontaktformular (Name, Email, Telefon, Nachricht)
- Büro-Informationen
- Google Maps Einbettung
- Öffnungszeiten

### 5. impressum.html & datenschutz.html
- Rechtliche Seiten (DSGVO-konform)

## Technische Anforderungen
- Pure HTML5, CSS3, Vanilla JavaScript
- Responsive Design (Mobile First)
- GitHub Pages kompatibel (keine Build-Prozesse)
- SEO-optimiert mit Meta-Tags
- Accessibility (WCAG AA)

## Datenstruktur
Optional: `data/roles.json` für Rollen/Leistungen (z. B. Küche, Service, Theke, Event) inkl. Beschreibung und Icon.

## JavaScript Funktionalitäten
- Responsive Navigation (Mobile Menu)
- Formular-Validierung
- Smooth Scrolling

## Ordnerstruktur
```
/
├── index.html
├── unsere-leistungen.html
├── ueber-uns.html
├── kontakt.html
├── impressum.html
├── datenschutz.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── properties.js
├── data/
│   └── properties.json
├── images/
│   ├── hero-bg.jpg
│   ├── properties/
│   └── team/
└── README.md
```

## Wichtige Hinweise
1. Verwende das Design System aus design.json EXAKT
2. Alle Farben, Schriftarten, Abstände wie spezifiziert
3. Deutsche Inhalte und Lokalisierung
4. Performance-optimiert (komprimierte Bilder)
5. Cross-browser kompatibel

## Content-Richtlinien
- Professioneller Ton
- Deutsche Sprache
- Terminologie: Personalvermittlung, Zeitarbeit, Disposition, Einsätze, Solingen
- Vertrauensbildende Elemente
- Call-to-Actions strategisch platziert

Beginne mit der Homepage (index.html) und arbeite dich durch alle Seiten. Achte besonders auf die Einhaltung des Design Systems!