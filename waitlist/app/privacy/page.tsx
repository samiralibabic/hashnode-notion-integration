import Header from "@/components/Header";
import Link from "next/link";

export default function Privacy() {
  return (
    <>
      <Header />
      <Link href="/">Back</Link>

      <section>
        <h1>Datenschutzerklärung für die Online-Warteliste</h1>
        <p>
          Diese Datenschutzerklärung beschreibt, wie wir personenbezogene Daten
          gemäß den Anforderungen der Datenschutz-Grundverordnung (DSGVO) der
          Europäischen Union sammeln, verwenden und offenlegen, wenn Sie unsere
          Online-Warteliste nutzen.
        </p>

        <h2>1. Verantwortliche Stelle</h2>

        <p>
          Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:
        </p>

        <p>
          [Name/Firma des Verantwortlichen]<br />
          [Adresse]<br />
          [Email-Adresse]<br />
          [Telefonnummer]
        </p>

        <h2>2. Welche Daten wir sammeln</h2>

        <p>
          Wir sammeln und verarbeiten möglicherweise folgende Arten von
          personenbezogenen Daten für die Verwendung auf unserer Warteliste:
        </p>

        <ul>
          <li>
            Persönliche Identifikationsinformationen (z. B. Name,
            E-Mail-Adresse, Telefonnummer)
          </li>
          <li>
            Demografische Informationen (z. B. Alter, Geschlecht, Standort)
          </li>
          <li>
            Andere Informationen, die Sie uns freiwillig zur Verfügung stellen
          </li>
        </ul>

        <h2>3. Zwecke und Rechtsgrundlagen der Datenverarbeitung</h2>

        <p>
          Wir verarbeiten Ihre Daten für folgende Zwecke und auf der Grundlage
          entsprechender Rechtsgrundlagen:
        </p>

        <ul>
          <li>
            Zur Erfüllung eines Vertrags mit Ihnen oder zur Durchführung
            vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO)
          </li>
          <li>
            Zur Erfüllung rechtlicher Verpflichtungen (Art. 6 Abs. 1 lit. c
            DSGVO)
          </li>
          <li>Aufgrund Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
          <li>
            Zur Wahrung unserer berechtigten Interessen, sofern Ihre Interessen
            oder Grundrechte und Grundfreiheiten nicht überwiegen (Art. 6 Abs. 1
            lit. f DSGVO)
          </li>
        </ul>

        <h2>4. Datenweitergabe an Dritte</h2>

        <p>
          Wir geben Ihre Daten nur an Dritte weiter, wenn dies gesetzlich
          vorgeschrieben ist oder wenn wir Ihre ausdrückliche Einwilligung dazu
          erhalten haben.
        </p>

        <h2>5. Speicherdauer</h2>

        <p>
          Wir speichern Ihre Daten nur solange, wie es für die Erreichung der
          Zwecke, für die sie erhoben wurden, erforderlich ist, es sei denn, es
          liegen gesetzliche Aufbewahrungspflichten vor.
        </p>

        <h2>6. Ihre Rechte</h2>

        <p>
          Sie haben gemäß der DSGVO bestimmte Rechte in Bezug auf Ihre
          personenbezogenen Daten, einschließlich:
        </p>

        <ul>
          <li>
            Recht auf Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)
          </li>
          <li>Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        </ul>

        <p>
          Um Ihre Rechte auszuüben oder Fragen zur Datenverarbeitung zu stellen,
          kontaktieren Sie uns bitte unter den unten angegebenen Kontaktdaten.
        </p>

        <h2>7. Beschwerderecht bei der Aufsichtsbehörde</h2>

        <p>
          Sie haben das Recht, eine Beschwerde bei der zuständigen
          Datenschutzbehörde einzureichen, wenn Sie der Ansicht sind, dass die
          Verarbeitung Ihrer personenbezogenen Daten gegen Datenschutzgesetze
          verstößt.
        </p>

        <h2>8. Kontaktieren Sie uns</h2>

        <p>
          Wenn Sie Fragen oder Bedenken bezüglich unserer Datenschutzerklärung
          haben oder Ihre Datenschutzrechte ausüben möchten, kontaktieren Sie
          uns bitte unter:
        </p>

        <p>
          [Name/Firma des Verantwortlichen]<br />
          [Adresse]<br />
          [Email-Adresse]<br />
          [Telefonnummer]
        </p>
      </section>
    </>
  );
}
