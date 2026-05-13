import { Link } from 'react-router-dom';

const CalculatorCTA = () => {
  return (
    <section className="container section__padding">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-main3 via-main2 to-main p-8 md:p-12 shadow-xl">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider uppercase bg-white/20 text-white px-3 py-1 rounded-full mb-4">
              Neu · Kostenlos
            </span>
            <h2 className="font-merriweather text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Cholesterin-Rechner: Ihre Werte sofort verstehen
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-xl leading-relaxed">
              Geben Sie Ihre Blutwerte ein und erhalten Sie eine sofortige
              Auswertung: LDL nach Friedewald, Non-HDL, Risiko-Quotienten und
              persönliche Empfehlungen. Inkl. Umrechner mg/dL ↔ mmol/L.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/rechner"
                className="inline-flex items-center gap-2 bg-white text-main3 hover:bg-light px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
              >
                Jetzt berechnen
                <span className="text-lg">→</span>
              </Link>
              <Link
                to="/rechner"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-6 py-3 rounded-xl font-medium transition"
              >
                Was bedeuten meine Werte?
              </Link>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-3">
            {[
              { label: 'LDL', value: '< 100', note: 'optimal' },
              { label: 'HDL', value: '> 60', note: 'schützend' },
              { label: 'TC/HDL', value: '< 3,5', note: 'günstig' },
              { label: 'Trig', value: '< 150', note: 'normal' },
            ].map(item => (
              <div
                key={item.label}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="font-merriweather text-2xl font-bold text-white mt-1">
                  {item.value}
                </p>
                <p className="text-white/70 text-xs mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorCTA;
