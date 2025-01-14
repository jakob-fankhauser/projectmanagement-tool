INSERT INTO meetings (id, sections) VALUES (
'1',
JSON_ARRAY(
JSON_OBJECT(
'title', 'Projektziele',
'items', JSON_ARRAY(
'Entwicklung einer booking.com-ähnlichen Plattform für fewo-plan.de',
'Modernisierung des Buchungsprozesses',
'Verbesserung der Nutzererfahrung',
'Implementierung einer benutzerfreundlichen Buchungsplattform'
)
),
JSON_OBJECT(
'title', 'Kernfunktionen',
'items', JSON_ARRAY(
'Suchfunktion mit erweiterten Filtermöglichkeiten',
'Detaillierte und ansprechende Objektansichten',
'Nahtloses Online-Buchungssystem',
'Transparentes Bewertungssystem',
'Integration von Huetten.com über XML-Schnittstelle von HWS'
)
),
JSON_OBJECT(
'title', 'Technische Anforderungen',
'items', JSON_ARRAY(
'Responsive Design für alle Geräte',
'Performance-Optimierung für schnelle Ladezeiten',
'SEO-freundliche Seitenstruktur',
'Unterstützung für Subdomains und alternative Domains'
)
),
JSON_OBJECT(
'title', 'Zahlungs- und Buchungsstrategie',
'items', JSON_ARRAY(
'Integration von Kreditkartenzahlung über Stripe',
'Möglichkeit für Buchung ohne Benutzerkonto',
'Whitelabel-Lösung für Unterkünfte',
'Einfacher und intuitiver Buchungsprozess'
)
),
JSON_OBJECT(
'title', 'Design und Branding',
'items', JSON_ARRAY(
'Regionale Designanpassungen',
'Konsistente Benutzeroberfläche',
'Responsive und moderne Gestaltung',
'A/B-Testing für Designoptimierung'
)
)
)
);