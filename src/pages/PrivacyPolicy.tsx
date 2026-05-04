import { buildCanonical, useDocumentMeta } from '../utils/seo';

const PrivacyPolicy = () => {
  useDocumentMeta({
    title: 'Datenschutzerklärung',
    description:
      'Datenschutzerklärung von CholesterinTipps – Informationen zu Datenverarbeitung, Cookies, Newsletter, Webanalyse und Ihren Rechten gemäß DSGVO.',
    canonical: buildCanonical('/privacy'),
  });

  return (
    <div className="container section__padding flex flex-col gap-8">
      <h1 className="section__title text-3xl text-center">
        Datenschutzerklärung
      </h1>
      <p className="section__description">
        Diese Datenschutzerklärung gilt für die Website{' '}
        <strong>cholesterintipps.de</strong> (im Folgenden „Website“,
        „CholesterinTipps“, „wir“ oder „uns“). Wir nehmen den Schutz Ihrer
        personenbezogenen Daten ernst und behandeln Ihre personenbezogenen Daten
        vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften
        (DSGVO, BDSG) sowie dieser Datenschutzerklärung.
      </p>

      <h3 className="section__title">1. Verantwortlicher</h3>
      <p className="section__description">
        Verantwortlich für die Datenverarbeitung auf dieser Website ist die
        Redaktion von CholesterinTipps. Sie erreichen uns per E-Mail unter{' '}
        <a
          href="mailto:kontakt@cholesterintipps.de"
          className="underline text-main"
        >
          kontakt@cholesterintipps.de
        </a>
        . Die vollständigen Anbieterangaben finden Sie im Impressum.
      </p>

      <h3 className="section__title">2. Welche Daten wir erheben</h3>
      <p className="section__description">
        Beim Besuch unserer Website werden automatisch Informationen erhoben,
        die Ihr Browser an unseren Server übermittelt (sog. Server-Logfiles):
      </p>
      <ul className="section__description list-disc pl-6 flex flex-col gap-2">
        <li>IP-Adresse (gekürzt/anonymisiert, soweit technisch möglich)</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Browsertyp und -version, Betriebssystem</li>
        <li>Referrer-URL (die zuvor besuchte Seite)</li>
        <li>Aufgerufene Seite bzw. Datei</li>
      </ul>
      <p className="section__description">
        Diese Daten verarbeiten wir auf Grundlage unseres berechtigten
        Interesses an einer technisch fehlerfreien und sicheren Bereitstellung
        der Website (Art. 6 Abs. 1 lit. f DSGVO). Eine Zusammenführung mit
        anderen Datenquellen findet nicht statt.
      </p>

      <h3 className="section__title">3. Cookies</h3>
      <p className="section__description">
        Wir verwenden Cookies. Cookies sind kleine Textdateien, die auf Ihrem
        Endgerät gespeichert werden. Technisch notwendige Cookies werden auf
        Grundlage von Art. 6 Abs. 1 lit. f DSGVO eingesetzt. Alle weiteren
        Cookies (insbesondere für Analyse und Werbung) setzen wir nur mit Ihrer
        ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO und § 25
        Abs. 1 TTDSG ein. Sie können Ihre Cookie-Einstellungen jederzeit über
        unseren Cookie-Banner anpassen oder Cookies in Ihrem Browser
        deaktivieren.
      </p>

      <h3 className="section__title">4. Newsletter</h3>
      <p className="section__description">
        Sofern Sie sich für unseren Newsletter anmelden, verarbeiten wir Ihre
        E-Mail-Adresse, um Ihnen die im Newsletter angekündigten Informationen
        zuzusenden. Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1
        lit. a DSGVO. Sie können den Newsletter jederzeit über den Abmelde-Link
        in jeder E-Mail oder per Nachricht an{' '}
        <a
          href="mailto:kontakt@cholesterintipps.de"
          className="underline text-main"
        >
          kontakt@cholesterintipps.de
        </a>{' '}
        wieder abbestellen.
      </p>

      <h3 className="section__title">5. Webanalyse (Google Analytics)</h3>
      <p className="section__description">
        Wir nutzen Google Analytics 4 (Anbieter: Google Ireland Limited, Gordon
        House, Barrow Street, Dublin 4, Irland), um die Nutzung unserer Website
        statistisch auszuwerten und unser Angebot zu verbessern. Die
        Verarbeitung erfolgt ausschließlich auf Grundlage Ihrer Einwilligung
        (Art. 6 Abs. 1 lit. a DSGVO). Es werden Cookies gesetzt, die eine
        Analyse der Benutzung ermöglichen. IP-Adressen werden vor einer weiteren
        Verarbeitung gekürzt.
      </p>

      <h3 className="section__title">6. Werbung (Google AdSense)</h3>
      <p className="section__description">
        Diese Website nutzt – sofern Sie eingewilligt haben – Google AdSense,
        einen Dienst zum Einbinden von Werbeanzeigen der Google Ireland Limited.
        Google AdSense verwendet Cookies und vergleichbare Technologien, um
        Anzeigen zu schalten, die für Sie relevant sind, und um die Effektivität
        der Anzeigen zu messen. Rechtsgrundlage ist Ihre Einwilligung gemäß Art.
        6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TTDSG. Weitere Informationen
        finden Sie in der Datenschutzerklärung von Google unter{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
          className="underline text-main"
        >
          policies.google.com/privacy
        </a>
        .
      </p>

      <h3 className="section__title">7. Empfänger und Drittlandtransfer</h3>
      <p className="section__description">
        Eine Übermittlung Ihrer personenbezogenen Daten an Dritte erfolgt nur an
        die in dieser Erklärung genannten Auftragsverarbeiter (z. B.
        Hosting-Anbieter, Newsletter-Dienst, Webanalyse, Werbedienste). Sofern
        eine Übermittlung in Drittländer (außerhalb der EU/des EWR) erforderlich
        ist, stützen wir diese auf Standardvertragsklauseln der EU-Kommission
        gemäß Art. 46 Abs. 2 lit. c DSGVO.
      </p>

      <h3 className="section__title">8. Speicherdauer</h3>
      <p className="section__description">
        Wir speichern personenbezogene Daten nur so lange, wie es für die
        jeweiligen Zwecke erforderlich ist oder wir gesetzlich zur Aufbewahrung
        verpflichtet sind. Anschließend werden die Daten gelöscht oder
        anonymisiert.
      </p>

      <h3 className="section__title">9. Ihre Rechte</h3>
      <p className="section__description">
        Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16
        DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art.
        18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen
        die Verarbeitung (Art. 21 DSGVO). Erteilte Einwilligungen können Sie
        jederzeit mit Wirkung für die Zukunft widerrufen. Zur Wahrnehmung Ihrer
        Rechte genügt eine formlose Mitteilung an{' '}
        <a
          href="mailto:kontakt@cholesterintipps.de"
          className="underline text-main"
        >
          kontakt@cholesterintipps.de
        </a>
        . Außerdem haben Sie das Recht, sich bei einer
        Datenschutz-Aufsichtsbehörde zu beschweren.
      </p>

      <h3 className="section__title">10. Änderungen dieser Erklärung</h3>
      <p className="section__description">
        Wir passen diese Datenschutzerklärung an, sobald Änderungen der von uns
        durchgeführten Datenverarbeitungen dies erforderlich machen. Die jeweils
        aktuelle Fassung ist stets auf dieser Seite abrufbar.
      </p>

      <p className="section__description text-sm opacity-70">
        Stand: Januar 2026
      </p>
    </div>
  );
};

export default PrivacyPolicy;
