import { buildCanonical, useDocumentMeta } from '../utils/seo';

const Impressum = () => {
  useDocumentMeta({
    title: 'Impressum',
    description:
      'Impressum von CholesterinTipps gemäß § 5 TMG – Anbieter, Kontakt, Verantwortlich für den Inhalt sowie Hinweise zur Online-Streitbeilegung.',
    canonical: buildCanonical('/impressum'),
  });

  return (
    <div className="container section__padding flex flex-col gap-8">
      <h1 className="section__title text-3xl text-center">Impressum</h1>

      <p className="section__description">
        Angaben gemäß § 5 TMG (Telemediengesetz) sowie § 18 Abs. 2 MStV
        (Medienstaatsvertrag).
      </p>

      <section>
        <h2 className="section__title">Anbieter und Kontakt</h2>
        <p className="section__description">
          <strong>CholesterinTipps Redaktion</strong>
          <br />
          Inhaberin: Anna Berger
          <br />
          Greifswalder Straße 212
          <br />
          10405 Berlin
          <br />
          Deutschland
        </p>
        <p className="section__description">
          E-Mail:{' '}
          <a
            href="mailto:kontakt@cholesterintipps.de"
            className="underline text-main"
          >
            kontakt@cholesterintipps.de
          </a>
          <br />
          Telefon: +49 30 5557 6420 (Mo.–Fr. 10:00–16:00 Uhr)
        </p>
      </section>

      <section>
        <h2 className="section__title">Rechtsform</h2>
        <p className="section__description">
          Einzelunternehmen nach deutschem Recht. Die Tätigkeit ist nach § 19
          UStG umsatzsteuerbefreit (Kleinunternehmerregelung), eine
          Umsatzsteuer-Identifikationsnummer wird daher nicht ausgewiesen.
        </p>
      </section>

      <section>
        <h2 className="section__title">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className="section__description">
          Anna Berger
          <br />
          Greifswalder Straße 212
          <br />
          10405 Berlin
          <br />
          E-Mail:{' '}
          <a
            href="mailto:redaktion@cholesterintipps.de"
            className="underline text-main"
          >
            redaktion@cholesterintipps.de
          </a>
        </p>
      </section>

      <section>
        <h2 className="section__title">
          Medizinische Fachredaktion (V.i.S.d.P. für medizinische Inhalte)
        </h2>
        <p className="section__description">
          Die medizinische Plausibilitätsprüfung unserer Beiträge erfolgt durch:
          <br />
          <strong>Dr. med. Katrin Lehmann</strong>, Fachärztin für Innere
          Medizin und Kardiologie
          <br />
          E-Mail:{' '}
          <a
            href="mailto:fachredaktion@cholesterintipps.de"
            className="underline text-main"
          >
            fachredaktion@cholesterintipps.de
          </a>
        </p>
      </section>

      <section>
        <h2 className="section__title">
          Online-Streitbeilegung (OS-Plattform)
        </h2>
        <p className="section__description">
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-main"
          >
            https://ec.europa.eu/consumers/odr
          </a>{' '}
          finden. Unsere E-Mail-Adresse für Kontaktaufnahmen lautet{' '}
          <a
            href="mailto:kontakt@cholesterintipps.de"
            className="underline text-main"
          >
            kontakt@cholesterintipps.de
          </a>
          .
        </p>
        <p className="section__description">
          Wir sind weder verpflichtet noch bereit, an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </section>

      <section>
        <h2 className="section__title">Haftungshinweis für eigene Inhalte</h2>
        <p className="section__description">
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
          jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7
          Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
          forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
      </section>

      <section>
        <h2 className="section__title">Haftung für Links</h2>
        <p className="section__description">
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte können
          wir keine Gewähr übernehmen. Eine permanente inhaltliche Kontrolle
          verlinkter Seiten ist ohne konkrete Anhaltspunkte einer
          Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen entfernen wir derartige Links umgehend.
        </p>
      </section>

      <section>
        <h2 className="section__title">Urheberrecht</h2>
        <p className="section__description">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors. Soweit die Inhalte nicht vom Betreiber erstellt
          wurden, werden die Urheberrechte Dritter beachtet.
        </p>
      </section>

      <section>
        <h2 className="section__title">Medizinischer Hinweis</h2>
        <p className="section__description">
          Die auf CholesterinTipps bereitgestellten Informationen ersetzen
          keinesfalls eine professionelle medizinische Beratung, Diagnose oder
          Behandlung durch eine Ärztin oder einen Arzt. Bei gesundheitlichen
          Fragen wenden Sie sich bitte an eine medizinische Fachperson.
        </p>
      </section>

      <p className="section__description text-sm opacity-70">
        Stand: Januar 2026
      </p>
    </div>
  );
};

export default Impressum;
