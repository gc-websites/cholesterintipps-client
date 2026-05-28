import { Link } from 'react-router-dom';
import {
  buildCanonical,
  useDocumentMeta,
  useStructuredData,
} from '../utils/seo';

const TEAM = [
  {
    name: 'Dr. med. Katrin Lehmann',
    role: 'Fachärztin für Innere Medizin & Kardiologie · Medizinische Leitung',
    bio: 'Über 18 Jahre klinische Erfahrung in der Inneren Medizin mit Schwerpunkt Lipidstoffwechsel. Mitglied der Deutschen Gesellschaft für Kardiologie (DGK). Verantwortlich für die fachliche Plausibilitätsprüfung aller medizinisch-relevanten Inhalte.',
    initials: 'KL',
    gradient: 'from-main3 to-main2',
  },
  {
    name: 'Anna Berger',
    role: 'Chefredakteurin · Ernährungswissenschaftlerin (M.Sc. Ökotrophologie)',
    bio: 'Studium der Ökotrophologie an der Universität Bonn. Seit 12 Jahren als Gesundheits-Redakteurin tätig, davon 6 Jahre als Online-Chefredakteurin. Bei CholesterinTipps verantwortlich für Redaktionsplanung und Qualitätssicherung.',
    initials: 'AB',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    name: 'Markus Wendt',
    role: 'Senior-Redakteur · Diplom-Biologe',
    bio: 'Wissenschaftsjournalist mit Schwerpunkt Stoffwechsel und Prävention. Recherchiert für unsere Beiträge in Fachdatenbanken (PubMed, Cochrane) und übersetzt aktuelle Studienlage in alltagstaugliche Empfehlungen.',
    initials: 'MW',
    gradient: 'from-amber-500 to-rose-500',
  },
  {
    name: 'Sophie Maier',
    role: 'Redakteurin · Diätassistentin',
    bio: 'Staatlich anerkannte Diätassistentin mit klinischer Erfahrung in der ambulanten Ernährungsberatung. Zuständig für unsere Rezept-Rubrik und alltagspraktische Ernährungstipps.',
    initials: 'SM',
    gradient: 'from-sky-500 to-cyan-600',
  },
];

const About = () => {
  useDocumentMeta({
    title: 'Über uns',
    description:
      'Lernen Sie das Team und die redaktionelle Arbeitsweise von CholesterinTipps kennen — medizinisch geprüft, transparent recherchiert, alltagstauglich aufbereitet.',
    canonical: buildCanonical('/about'),
  });

  useStructuredData(
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Über CholesterinTipps',
      url: 'https://cholesterintipps.de/about',
      inLanguage: 'de-DE',
      mainEntity: {
        '@type': 'Organization',
        name: 'CholesterinTipps',
        url: 'https://cholesterintipps.de/',
        founder: { '@type': 'Person', name: 'Anna Berger' },
        employee: TEAM.map(t => ({
          '@type': 'Person',
          name: t.name,
          jobTitle: t.role,
        })),
      },
    },
    'about-page',
  );

  return (
    <div className="container section__padding flex flex-col gap-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-main3 via-main2 to-main p-6 sm:p-10 md:p-14 text-white shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full mb-4">
            Über uns
          </span>
          <h1 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Verständliche Cholesterin-Information — medizinisch geprüft,
            alltagstauglich aufbereitet.
          </h1>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            CholesterinTipps ist ein unabhängiges deutschsprachiges
            Gesundheitsportal. Wir helfen Menschen, ihre Blutfettwerte zu
            verstehen und mit fundierten, leicht umsetzbaren Empfehlungen besser
            zu leben. Jeder Beitrag wird vor der Veröffentlichung redaktionell
            und medizinisch geprüft.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-mainText/10 dark:border-white/10 bg-white dark:bg-mainText/30 p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-main/20 text-main3 flex items-center justify-center text-2xl mb-3">
            🎯
          </div>
          <h3 className="font-merriweather font-bold text-lg mb-2 text-mainText dark:text-white">
            Unsere Mission
          </h3>
          <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
            Fachlich solide, verständliche und nicht-werbliche Information zum
            Thema Cholesterin und Herzgesundheit. Wir wollen Menschen befähigen,
            informierte Entscheidungen über ihren Lebensstil zu treffen — ohne
            Angstmacherei und ohne falsche Heilsversprechen.
          </p>
        </div>
        <div className="rounded-2xl border border-mainText/10 dark:border-white/10 bg-white dark:bg-mainText/30 p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-main/20 text-main3 flex items-center justify-center text-2xl mb-3">
            🔬
          </div>
          <h3 className="font-merriweather font-bold text-lg mb-2 text-mainText dark:text-white">
            Unser Ansatz
          </h3>
          <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
            Wir stützen uns auf aktuelle Leitlinien (ESC, DGK, DEGAM) und
            wissenschaftliche Studien aus Datenbanken wie PubMed und Cochrane.
            Jede gesundheitsbezogene Aussage wird mit einer Quelle belegt und
            durch unsere medizinische Fachredaktion plausibilitätsgeprüft.
          </p>
        </div>
        <div className="rounded-2xl border border-mainText/10 dark:border-white/10 bg-white dark:bg-mainText/30 p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-main/20 text-main3 flex items-center justify-center text-2xl mb-3">
            🤝
          </div>
          <h3 className="font-merriweather font-bold text-lg mb-2 text-mainText dark:text-white">
            Unsere Werte
          </h3>
          <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
            Unabhängigkeit, Transparenz und Respekt vor unseren Leserinnen und
            Lesern. Wir bewerben keine konkreten Präparate, nehmen keine
            Sponsoring-Beiträge an und kennzeichnen alle bezahlten Inhalte klar.
          </p>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="font-merriweather text-2xl sm:text-3xl font-bold text-mainText dark:text-white mb-2">
          Unser Team
        </h2>
        <p className="text-additionalText dark:text-white/70 mb-8 max-w-2xl">
          Hinter CholesterinTipps stehen Menschen mit medizinischer und
          ernährungswissenschaftlicher Ausbildung. Jeder Beitrag wird von
          mindestens einem Redaktionsmitglied verfasst und von der medizinischen
          Leitung freigegeben.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {TEAM.map(member => (
            <article
              key={member.name}
              className="flex gap-4 items-start rounded-2xl border border-mainText/10 dark:border-white/10 bg-white dark:bg-mainText/30 p-5 sm:p-6 shadow-sm"
            >
              <div
                className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${member.gradient} text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md`}
                aria-hidden="true"
              >
                {member.initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-merriweather font-bold text-lg text-mainText dark:text-white">
                  {member.name}
                </h3>
                <p className="text-main3 dark:text-main text-sm font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Editorial process */}
      <section className="rounded-2xl border border-mainText/10 dark:border-white/10 bg-light dark:bg-mainText/40 p-6 sm:p-10">
        <h2 className="font-merriweather text-2xl sm:text-3xl font-bold text-mainText dark:text-white mb-6">
          Unser redaktioneller Prozess
        </h2>
        <ol className="space-y-5 text-mainText dark:text-white">
          {[
            {
              t: 'Themenauswahl',
              d: 'Wir wählen Themen aus Fragen unserer Leser, neuen Leitlinien (DGK, ESC) und aktueller Studienlage. Eine wöchentliche Redaktionskonferenz priorisiert.',
            },
            {
              t: 'Recherche',
              d: 'Recherche in Fachdatenbanken (PubMed, Cochrane, IQWiG-Berichte) sowie Leitlinien-Datenbanken. Mindestens zwei unabhängige Quellen pro medizinischer Aussage.',
            },
            {
              t: 'Schreiben',
              d: 'Verfassen durch ein Redaktionsmitglied mit fachlichem Hintergrund. Verständliche Sprache, klare Strukturen, alltagsnahe Beispiele.',
            },
            {
              t: 'Medizinische Prüfung',
              d: 'Plausibilitätsprüfung jeder gesundheitsbezogenen Aussage durch die medizinische Leitung (Dr. med. Katrin Lehmann).',
            },
            {
              t: 'Veröffentlichung & Aktualisierung',
              d: 'Veröffentlichung mit Datum. Inhalte werden mindestens jährlich auf Aktualität geprüft und bei neuen Leitlinien zeitnah angepasst.',
            },
          ].map((step, i) => (
            <li key={step.t} className="flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-main3 text-white font-bold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{step.t}</h3>
                <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
                  {step.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Transparency */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-mainText/10 dark:border-white/10 bg-white dark:bg-mainText/30 p-6 shadow-sm">
          <h3 className="font-merriweather font-bold text-lg mb-3 text-mainText dark:text-white">
            Werbung &amp; Finanzierung
          </h3>
          <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
            CholesterinTipps finanziert sich über kontextuelle Display-Werbung
            (z. B. Google AdSense) sowie gelegentliche Affiliate-Links. Diese
            haben keinen Einfluss auf unsere redaktionelle Auswahl und werden
            entsprechend gekennzeichnet. Wir nehmen keine Sponsoring-Beiträge
            von Pharma-Unternehmen oder Nahrungsergänzungs-Herstellern an.
          </p>
        </div>
        <div className="rounded-2xl border border-mainText/10 dark:border-white/10 bg-white dark:bg-mainText/30 p-6 shadow-sm">
          <h3 className="font-merriweather font-bold text-lg mb-3 text-mainText dark:text-white">
            Fehler gefunden? Schreiben Sie uns.
          </h3>
          <p className="text-additionalText dark:text-white/70 text-sm leading-relaxed">
            Wir sind dankbar für jeden Hinweis auf Ungenauigkeiten oder
            veraltete Informationen. Schreiben Sie uns an{' '}
            <a
              href="mailto:redaktion@cholesterintipps.de"
              className="underline text-main3 dark:text-main"
            >
              redaktion@cholesterintipps.de
            </a>{' '}
            — wir prüfen jeden Hinweis und korrigieren Beiträge transparent.
          </p>
        </div>
      </section>

      {/* Medical disclaimer */}
      <section className="rounded-2xl border border-amber-300/40 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30 p-6">
        <h3 className="font-merriweather font-bold text-lg mb-2 text-mainText dark:text-white flex items-center gap-2">
          <span aria-hidden="true">⚕️</span> Wichtiger medizinischer Hinweis
        </h3>
        <p className="text-additionalText dark:text-white/80 text-sm leading-relaxed">
          Alle Informationen auf CholesterinTipps dienen der allgemeinen
          Aufklärung und ersetzen keinesfalls eine individuelle ärztliche
          Beratung, Diagnose oder Behandlung. Bei konkreten gesundheitlichen
          Fragen oder vor Änderungen Ihrer Therapie wenden Sie sich bitte immer
          an Ihre Ärztin oder Ihren Arzt.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-additionalText dark:text-white/70 mb-4">
          Fragen, Anregungen oder Lob? Wir freuen uns auf Ihre Nachricht.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="mailto:kontakt@cholesterintipps.de"
            className="inline-flex items-center justify-center gap-2 bg-main3 hover:bg-main2 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md"
          >
            ✉️ Schreiben Sie uns
          </a>
          <Link
            to="/forum"
            className="inline-flex items-center justify-center gap-2 border-2 border-main3 text-main3 dark:text-main dark:border-main hover:bg-main3 hover:text-white dark:hover:bg-main dark:hover:text-mainText px-6 py-3 rounded-xl font-semibold transition"
          >
            💬 Zum Community-Forum
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
