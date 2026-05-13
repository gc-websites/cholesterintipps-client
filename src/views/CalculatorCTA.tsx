import { Link } from 'react-router-dom';

const CalculatorCTA = () => {
  return (
    <section className="container py-8 sm:py-12 md:py-16">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-main3 via-main2 to-main p-5 sm:p-8 md:p-12 shadow-xl">
        <div className="absolute -top-20 -right-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-8 items-center">
          <div className="min-w-0">
            <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-white/20 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full mb-3 sm:mb-4">
              Neu · Kostenlos
            </span>
            <h2 className="font-merriweather text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Cholesterin-Rechner: Ihre Werte sofort verstehen
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 max-w-xl leading-relaxed">
              Geben Sie Ihre Blutwerte ein und erhalten Sie eine sofortige
              Auswertung: LDL nach Friedewald, Non-HDL, Risiko-Quotienten und
              persönliche Empfehlungen. Inkl. Umrechner mg/dL ↔ mmol/L.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3">
              <Link
                to="/rechner"
                className="inline-flex items-center justify-center gap-2 bg-white text-main3 hover:bg-light px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Jetzt berechnen
                <span className="text-base sm:text-lg">→</span>
              </Link>
              <Link
                to="/rechner"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base"
              >
                Was bedeuten meine Werte?
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-3">
            {[
              { label: 'LDL', value: '< 100', note: 'optimal' },
              { label: 'HDL', value: '> 60', note: 'schützend' },
              { label: 'TC/HDL', value: '< 3,5', note: 'günstig' },
              { label: 'Trig', value: '< 150', note: 'normal' },
            ].map(item => (
              <div
                key={item.label}
                className="bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20"
              >
                <p className="text-white/80 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="font-merriweather text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">
                  {item.value}
                </p>
                <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorCTA;
