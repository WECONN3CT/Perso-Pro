# akPersonal Website 1:1 Nachbau - Cursor Dokumentation

## Überblick
Diese Dokumentation ermöglicht den exakten Nachbau der akPersonal GmbH Website (https://akp-personal.de/fuer-arbeitgeber/) für Personaldienstleistungen.

## Technische Basis
- **Framework**: WordPress/HTML5
- **Styling**: CSS3 mit responsivem Design
- **Schriftarten**: Standard-Webfonts (Arial/Helvetica)
- **Layout**: Flexbox/Grid-basiert
- **Farbschema**: Blau/Weiß/Grau-Töne

## Seitenstruktur

### Header-Bereich
```html
<header>
  <nav class="main-navigation">
    <div class="logo">
      <img src="logo.png" alt="Firmenlogo">
    </div>
    <ul class="nav-menu">
      <li><a href="#home">Startseite</a></li>
      <li><a href="#fuer-arbeitgeber">Für Arbeitgeber</a></li>
      <li><a href="#fuer-arbeitnehmer">Für Arbeitnehmer</a></li>
      <li><a href="#ueber-uns">Über uns</a></li>
      <li><a href="#kontakt">Kontakt</a></li>
    </ul>
  </nav>
</header>
```

### Hero-Section (Arbeitgeber-Seite)
```html
<section class="hero-section">
  <div class="container">
    <h1>Für Arbeitgeber</h1>
    <p class="hero-text">
      Welches nächste Projekt auch immer bei Ihnen ansteht, gerne stärken wir Ihnen als Personalberatung den Rücken! 
      Mit unserer über 20-jährigen Expertise wissen wir, dass die Mitarbeiter:innen das Wichtigste für jedes Unternehmen sind. 
      Wir unterstützen Sie bei der Personalsuche sowie in den Bereichen Personalberatung, Zeitarbeit und Arbeitnehmerüberlassung. 
      Damit ersparen wir Ihnen das sonst so kosten- und zeitaufwendige Personalrecruiting und verschaffen Ihnen einen klaren Vorsprung.
    </p>
  </div>
</section>
```

### Service & Leistungen Section
```html
<section id="service" class="services-section">
  <div class="container">
    <h2>Service & Leistungen</h2>
    <p class="services-intro">
      Sie möchten Spitzenzeiten abdecken, Personalengpässe kompensieren, offene Stellen besetzen oder Personallücken schließen?
    </p>
    
    <div class="services-grid">
      <div class="service-item">
        <h3>Personalüberlassung</h3>
        <p>
          Exklusiver Service: Für alle Fragen in Sachen Zeitarbeit steht Ihnen Ihr persönlicher Ansprechpartner unseres Unternehmens stets zur Seite: 
          Ihr persönlicher Personalscout, der Sie und die bei Ihnen eingesetzten Mitarbeiter direkt betreut!
        </p>
      </div>
      
      <div class="service-item">
        <h3>Personalvermittlung</h3>
        <p>
          Wir übernehmen gerne die professionelle Suche nach geeignetem Personal zur Festanstellung für Sie – 
          entweder mit vorheriger Überlassung oder per Direktvermittlung.
        </p>
      </div>
    </div>
  </div>
</section>
```

### Vorteile Section
```html
<section class="advantages-section">
  <div class="container">
    <h2>Vorteile auf einen Blick</h2>
    <h3>Das bieten wir Ihnen</h3>
    
    <div class="advantage-content">
      <h4>Augenhöhe macht den Unterschied</h4>
      <p>
        Wir stellen die Wünsche und Ziele unserer Mitarbeiter und Kunden täglich in den Mittelpunkt unseres Handelns. 
        Dank unseres persönlichen Drahts und unserem weit verzweigten Netzwerk können wir den Mitarbeiter mit dem passgenauen Unternehmen zusammenbringen. 
        Und erst wenn es zu einem perfekten Match kommt, geben wir uns zufrieden.
      </p>
    </div>
  </div>
</section>
```

### Branchen Section
```html
<section class="industries-section">
  <div class="container">
    <h2>Branchenüberblick</h2>
    <p>In diesen Branchen sind wir tätig</p>
    <!-- Hier würden die Branchen-Icons/Cards eingefügt -->
  </div>
</section>
```

### Ablauf Section
```html
<section class="process-section">
  <div class="container">
    <h2>SO FUNKTIONIERT'S</h2>
    <h3>Der Ablauf Ihrer Besetzung</h3>
    
    <div class="process-steps">
      <div class="step">
        <div class="step-number">1</div>
        <h4>Anforderungsprofil</h4>
        <p>
          Um Ihre Stelle besetzen zu können, nehmen Sie gerne telefonisch oder über unser Anfrageformular Kontakt mit uns auf. 
          In diesem Zuge klären wir alle relevanten Details und werden für Sie aktiv!
        </p>
      </div>
      
      <div class="step">
        <div class="step-number">2</div>
        <h4>Prüfung</h4>
        <p>
          Wir gleichen Ihre Anforderungen mit den Vorstellungen und Fähigkeiten unseres Personals ab.
        </p>
      </div>
      
      <div class="step">
        <div class="step-number">3</div>
        <h4>Feedback</h4>
        <p>
          Nachdem wir uns ausführlich Gedanken zu Ihrer Anfrage gemacht und eine Vorauswahl möglicher Mitarbeiter getroffen haben, 
          geben wir Ihnen nun Rückmeldung zur Besetzung Ihrer Stelle.
        </p>
      </div>
      
      <div class="step">
        <div class="step-number">4</div>
        <h4>Matching</h4>
        <p>
          Nachdem wir bereits ein Matching vorgenommen haben, dürfen Sie aus unserer Vorauswahl Ihren Kandidaten auswählen.
        </p>
      </div>
      
      <div class="step">
        <div class="step-number">5</div>
        <h4>Zusage</h4>
        <p>
          Nachdem wir Ihre Rückmeldung zu unseren Kandidatenvorschläge erhalten haben, 
          kann Ihr Wunsch-Kandidat zum nächstmöglichen Zeitpunkt anfangen und Ihren Betrieb bereichern.
        </p>
      </div>
    </div>
  </div>
</section>
```

### CTA Section
```html
<section class="cta-section">
  <div class="container">
    <h2>JETZT STARTEN</h2>
    <h3>Personal anfragen</h3>
    <p>Wir freuen uns auf Ihre Kontaktaufnahme</p>
    
    <div class="cta-content">
      <div class="cta-image">
        <img src="fuehrung-operativ.jpg" alt="Führung operativ">
      </div>
      <div class="cta-form">
        <h4>Ausfüllen und Rückruf erhalten:</h4>
        <!-- Kontaktformular hier einfügen -->
      </div>
    </div>
  </div>
</section>
```

### Standorte Section
```html
<section class="locations-section">
  <div class="container">
    <h2>HIER FINDEN SIE UNS</h2>
    <h3>Unsere Standorte</h3>
    
    <div class="locations-grid">
      <div class="location-item">
        <img src="euskirchen-stadt.jpg" alt="Euskirchen">
        <h4>Euskirchen</h4>
        <p>Mittelstr. 8 (Berliner Platz)<br>53879 Euskirchen</p>
      </div>
      
      <div class="location-item">
        <img src="meckenheim-koblenz.jpg" alt="Meckenheim / Koblenz">
        <h4>Meckenheim / Koblenz</h4>
        <p>Neuer Markt 37<br>53340 Meckenheim</p>
      </div>
      
      <div class="location-item">
        <img src="siegburg.jpg" alt="Siegburg">
        <h4>Siegburg</h4>
        <p>Kaiserstr. 133<br>53721 Siegburg</p>
      </div>
      
      <div class="location-item">
        <img src="dueren.jpg" alt="Düren">
        <h4>Düren</h4>
        <p>Wilhelmstr. 17<br>52349 Düren</p>
      </div>
    </div>
  </div>
</section>
```

### Footer
```html
<footer class="footer">
  <div class="container">
    <div class="footer-contact">
      <h3>KONTAKT</h3>
      <h4>Haben Sie noch Fragen?</h4>
      <p>Wir freuen uns darauf, von Ihnen zu hören!</p>
    </div>
  </div>
</footer>
```

## CSS-Styling

### Grundlegendes Styling
```css
/* Reset und Basis */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
header {
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.main-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #0066cc;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 120px 0 80px;
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero-text {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  color: #666;
}

/* Services Section */
.services-section {
  padding: 80px 0;
  background: #fff;
}

.services-section h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.services-intro {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  color: #666;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.service-item {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.service-item h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #0066cc;
}

/* Advantages Section */
.advantages-section {
  background: #f8f9fa;
  padding: 80px 0;
}

.advantages-section h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.advantages-section h3 {
  text-align: center;
  margin-bottom: 3rem;
  color: #666;
}

.advantage-content h4 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #0066cc;
}

/* Process Section */
.process-section {
  padding: 80px 0;
  background: #fff;
}

.process-section h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.process-section h3 {
  text-align: center;
  margin-bottom: 3rem;
  color: #666;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 2rem;
}

.step-number {
  display: inline-block;
  width: 50px;
  height: 50px;
  background: #0066cc;
  color: white;
  border-radius: 50%;
  line-height: 50px;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.step h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

/* CTA Section */
.cta-section {
  background: #f8f9fa;
  padding: 80px 0;
}

.cta-section h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.cta-section h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #0066cc;
}

.cta-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-top: 3rem;
}

.cta-image img {
  width: 100%;
  border-radius: 8px;
}

/* Locations Section */
.locations-section {
  padding: 80px 0;
  background: #fff;
}

.locations-section h2 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.locations-section h3 {
  text-align: center;
  margin-bottom: 3rem;
  color: #666;
}

.locations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.location-item {
  text-align: center;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.location-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.location-item h4 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #0066cc;
}

/* Footer */
.footer {
  background: #333;
  color: white;
  padding: 40px 0;
  text-align: center;
}

.footer h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.footer h4 {
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .hero-text {
    font-size: 1rem;
  }
  
  .cta-content {
    grid-template-columns: 1fr;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-navigation {
    flex-direction: column;
  }
}
```

## Farbschema
- **Primärblau**: #0066cc
- **Hintergrund**: #f8f9fa
- **Text**: #333
- **Sekundärtext**: #666
- **Weiß**: #fff

## Bilder/Assets benötigt
1. **Logo** (Firmenlogo)
2. **Führung operativ** (fuehrung-operativ.jpg)
3. **Euskirchen Stadt** (euskirchen-stadt.jpg)
4. **Meckenheim/Koblenz** (meckenheim-koblenz.jpg)
5. **Siegburg** (siegburg.jpg)
6. **Düren** (dueren.jpg)

## Zusätzliche Features
- **Kontaktformular** mit Validierung
- **Responsive Navigation** für mobile Geräte
- **Smooth Scrolling** zu Anchor-Links
- **Hover-Effekte** auf interaktiven Elementen

## JavaScript (Optional)
```javascript
// Smooth Scrolling für Anchor-Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});
```

## Cursor-spezifische Anweisungen
1. **Struktur zuerst**: Beginne mit der HTML-Struktur gemäß obiger Vorlage
2. **CSS schrittweise**: Implementiere das Styling abschnittsweise
3. **Responsive Design**: Teste regelmäßig auf verschiedenen Bildschirmgrößen
4. **Bilder-Platzhalter**: Verwende temporäre Platzhalter-Bilder während der Entwicklung
5. **Texte anpassen**: Ersetze die akPersonal-spezifischen Inhalte durch eigene Texte
6. **Farben anpassen**: Passe das Farbschema an deine Marke an

Diese Dokumentation ermöglicht eine exakte 1:1-Umsetzung der akPersonal-Website-Struktur und des Designs.