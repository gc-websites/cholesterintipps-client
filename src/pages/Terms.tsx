import { buildCanonical, useDocumentMeta } from '../utils/seo';

const Terms = () => {
  useDocumentMeta({
    title: 'Nutzungsbedingungen',
    description:
      'Nutzungsbedingungen von CholesterinTipps – Informationen zu Inhalten, Urheberrecht, Werbung, Affiliate-Links und Haftungsausschluss.',
    canonical: buildCanonical('/terms'),
  });

  return (
    <div className="container section__padding flex flex-col gap-8">
      <h1 className="section__title text-3xl text-center">
        Nutzungsbedingungen
      </h1>
      <p className="section__description">
        Willkommen auf <strong>cholesterintipps.de</strong> (im Folgenden
        „Website“ oder „CholesterinTipps“). Mit dem Aufruf und der Nutzung
        dieser Website erklären Sie sich mit den nachfolgenden
        Nutzungsbedingungen einverstanden. Bitte lesen Sie diese Bedingungen
        sorgfältig durch. Sofern Sie mit den Bedingungen nicht einverstanden
        sind, bitten wir Sie, die Website nicht weiter zu nutzen.
      </p>

      <h3 className="section__title">1. Inhalt der Website</h3>
      <p className="section__description">
        CholesterinTipps stellt redaktionelle Beiträge, Ratgeber und
        Informationen rund um die Themen Cholesterin, Ernährung, Bewegung und
        gesunden Lebensstil zur Verfügung. Alle Inhalte dienen ausschließlich
        allgemeinen Informationszwecken. Sie ersetzen weder eine ärztliche
        Beratung noch eine medizinische Diagnose oder Behandlung. Bei Fragen zu
        Ihrer Gesundheit wenden Sie sich bitte an eine Ärztin oder einen Arzt
        Ihres Vertrauens.
      </p>

      <h3 className="section__title">2. Verfügbarkeit der Website</h3>
      <p className="section__description">
        Wir bemühen uns, die Website rund um die Uhr verfügbar zu halten.
        Aufgrund von Wartungsarbeiten, technischen Störungen oder Ereignissen
        außerhalb unseres Einflussbereichs kann es jedoch zu vorübergehenden
        Unterbrechungen kommen. Ein Anspruch auf eine ununterbrochene
        Verfügbarkeit besteht nicht.
      </p>

      <h3 className="section__title">3. Urheberrecht</h3>
      <p className="section__description">
        Die auf dieser Website veröffentlichten Texte, Bilder, Grafiken und
        sonstigen Inhalte unterliegen dem Urheberrecht. Eine Vervielfältigung,
        Bearbeitung, Verbreitung oder anderweitige Verwertung außerhalb der
        Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung
        der Redaktion. Downloads und Kopien dieser Seite sind nur für den
        privaten, nicht kommerziellen Gebrauch gestattet. Soweit Inhalte auf
        dieser Website nicht von der Redaktion erstellt wurden, werden die
        Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als
        solche gekennzeichnet. Sollten Sie dennoch auf eine
        Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
        entsprechenden Hinweis.
      </p>

      <h3 className="section__title">4. Externe Links</h3>
      <p className="section__description">
        Unsere Website enthält Links zu externen Websites Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten
        ist stets der jeweilige Anbieter verantwortlich. Zum Zeitpunkt der
        Verlinkung wurden die fremden Inhalte auf mögliche Rechtsverstöße
        überprüft; rechtswidrige Inhalte waren nicht erkennbar. Eine permanente
        inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete
        Anhaltspunkte einer Rechtsverletzung jedoch nicht zumutbar.
      </p>

      <h3 className="section__title">5. Werbung und Affiliate-Links</h3>
      <p className="section__description">
        Diese Website finanziert sich teilweise durch Werbung und gegebenenfalls
        durch Affiliate-Programme. Werbeanzeigen werden als solche
        gekennzeichnet. Beim Klick auf einen Affiliate-Link kann
        CholesterinTipps eine Provision erhalten, ohne dass Ihnen dadurch
        zusätzliche Kosten entstehen. Die redaktionelle Auswahl der Inhalte
        bleibt davon unberührt.
      </p>

      <h3 className="section__title">6. Haftungsausschluss</h3>
      <p className="section__description">
        Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt.
        Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
        wir jedoch keine Gewähr übernehmen. Die Nutzung der Inhalte erfolgt auf
        eigenes Risiko. Eine Haftung für Schäden materieller oder ideeller Art,
        die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen
        verursacht werden, ist – soweit gesetzlich zulässig – ausgeschlossen.
      </p>

      <h3 className="section__title">7. Anwendbares Recht</h3>
      <p className="section__description">
        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
        UN-Kaufrechts.
      </p>

      <h3 className="section__title">8. Salvatorische Klausel</h3>
      <p className="section__description">
        Sollten einzelne Bestimmungen dieser Nutzungsbedingungen unwirksam sein
        oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon
        unberührt.
      </p>

      <p className="section__description text-sm opacity-70">
        Stand: Januar 2026
      </p>
    </div>
  );
};

export default Terms;
