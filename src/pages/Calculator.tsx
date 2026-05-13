import { FC, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  buildCanonical,
  useDocumentMeta,
  useStructuredData,
} from '../utils/seo';

type Unit = 'mg' | 'mmol';
type Gender = 'm' | 'f';

interface FormState {
  totalCholesterol: string;
  hdl: string;
  ldl: string;
  triglycerides: string;
  age: string;
  gender: Gender;
  smoker: boolean;
  diabetes: boolean;
  systolic: string;
}

type Level = 'optimal' | 'border' | 'high' | 'veryHigh' | 'low';

interface Classification {
  level: Level;
  label: string;
  description: string;
}

const initialState: FormState = {
  totalCholesterol: '',
  hdl: '',
  ldl: '',
  triglycerides: '',
  age: '',
  gender: 'm',
  smoker: false,
  diabetes: false,
  systolic: '',
};

const CHOL_FACTOR = 38.67; // mg/dL per mmol/L for cholesterol
const TG_FACTOR = 88.57; // mg/dL per mmol/L for triglycerides

interface Range {
  minMg: number;
  maxMg: number;
  step: number; // step in mg/dL
}

const RANGES = {
  tc: { minMg: 50, maxMg: 500, step: 1 },
  hdl: { minMg: 10, maxMg: 150, step: 1 },
  ldl: { minMg: 10, maxMg: 400, step: 1 },
  tg: { minMg: 20, maxMg: 2000, step: 1 },
  age: { min: 1, max: 120 },
  systolic: { min: 60, max: 260 },
} as const;

const mgToDisplay = (mg: number, unit: Unit, isTg = false): number => {
  if (unit === 'mg') return mg;
  return isTg ? mg / TG_FACTOR : mg / CHOL_FACTOR;
};

const rangeFor = (
  range: Range,
  unit: Unit,
  isTg = false,
): { min: number; max: number; step: number } => {
  const min = mgToDisplay(range.minMg, unit, isTg);
  const max = mgToDisplay(range.maxMg, unit, isTg);
  const step = unit === 'mg' ? range.step : 0.01;
  return {
    min: unit === 'mg' ? Math.round(min) : Math.round(min * 10) / 10,
    max: unit === 'mg' ? Math.round(max) : Math.round(max * 10) / 10,
    step,
  };
};

const formatBound = (v: number, unit: Unit): string => {
  return unit === 'mg' ? v.toFixed(0) : v.toFixed(1);
};

const toMg = (value: string, unit: Unit, isTg = false): number | null => {
  if (value === '' || value === null || value === undefined) return null;
  const n = parseFloat(value.replace(',', '.'));
  if (Number.isNaN(n) || n <= 0) return null;
  if (unit === 'mg') return n;
  return isTg ? n * TG_FACTOR : n * CHOL_FACTOR;
};

const validateRange = (
  value: string,
  unit: Unit,
  range: Range,
  isTg = false,
): string | null => {
  if (value === '') return null;
  const n = parseFloat(value.replace(',', '.'));
  if (Number.isNaN(n)) return 'Bitte eine Zahl eingeben.';
  if (n <= 0) return 'Wert muss größer als 0 sein.';
  const mg = unit === 'mg' ? n : isTg ? n * TG_FACTOR : n * CHOL_FACTOR;
  if (mg < range.minMg) {
    const lo = mgToDisplay(range.minMg, unit, isTg);
    return `Zu niedrig. Mindestens ${formatBound(lo, unit)} ${unit === 'mg' ? 'mg/dL' : 'mmol/L'}.`;
  }
  if (mg > range.maxMg) {
    const hi = mgToDisplay(range.maxMg, unit, isTg);
    return `Zu hoch. Höchstens ${formatBound(hi, unit)} ${unit === 'mg' ? 'mg/dL' : 'mmol/L'}.`;
  }
  return null;
};

const validateInt = (
  value: string,
  min: number,
  max: number,
): string | null => {
  if (value === '') return null;
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return 'Bitte eine ganze Zahl eingeben.';
  if (n < min) return `Mindestens ${min}.`;
  if (n > max) return `Höchstens ${max}.`;
  return null;
};

const fromMg = (mg: number | null, unit: Unit, isTg = false): string => {
  if (mg === null) return '–';
  if (unit === 'mg') return `${mg.toFixed(0)} mg/dL`;
  const v = isTg ? mg / TG_FACTOR : mg / CHOL_FACTOR;
  return `${v.toFixed(2)} mmol/L`;
};

const levelStyles: Record<Level, { bar: string; chip: string; text: string }> =
  {
    optimal: {
      bar: 'bg-emerald-500',
      chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    low: {
      bar: 'bg-amber-500',
      chip: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
      text: 'text-amber-700 dark:text-amber-300',
    },
    border: {
      bar: 'bg-yellow-500',
      chip: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
      text: 'text-yellow-700 dark:text-yellow-300',
    },
    high: {
      bar: 'bg-orange-500',
      chip: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
      text: 'text-orange-700 dark:text-orange-300',
    },
    veryHigh: {
      bar: 'bg-red-600',
      chip: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
      text: 'text-red-700 dark:text-red-300',
    },
  };

const classifyTC = (mg: number): Classification => {
  if (mg < 200)
    return {
      level: 'optimal',
      label: 'Wünschenswert',
      description: 'Unter 200 mg/dL (5,2 mmol/L)',
    };
  if (mg < 240)
    return {
      level: 'border',
      label: 'Grenzwertig erhöht',
      description: '200–239 mg/dL (5,2–6,2 mmol/L)',
    };
  return {
    level: 'high',
    label: 'Hoch',
    description: 'Ab 240 mg/dL (6,2 mmol/L)',
  };
};

const classifyLDL = (mg: number): Classification => {
  if (mg < 100)
    return {
      level: 'optimal',
      label: 'Optimal',
      description: 'Unter 100 mg/dL (2,6 mmol/L)',
    };
  if (mg < 130)
    return {
      level: 'optimal',
      label: 'Nahe optimal',
      description: '100–129 mg/dL (2,6–3,3 mmol/L)',
    };
  if (mg < 160)
    return {
      level: 'border',
      label: 'Grenzwertig erhöht',
      description: '130–159 mg/dL (3,4–4,1 mmol/L)',
    };
  if (mg < 190)
    return {
      level: 'high',
      label: 'Hoch',
      description: '160–189 mg/dL (4,1–4,9 mmol/L)',
    };
  return {
    level: 'veryHigh',
    label: 'Sehr hoch',
    description: 'Ab 190 mg/dL (4,9 mmol/L)',
  };
};

const classifyHDL = (mg: number, gender: Gender): Classification => {
  const threshold = gender === 'm' ? 40 : 50;
  if (mg < threshold)
    return {
      level: 'low',
      label: 'Niedrig (Risikofaktor)',
      description: `Männer < 40, Frauen < 50 mg/dL`,
    };
  if (mg >= 60)
    return {
      level: 'optimal',
      label: 'Schützend',
      description: 'Ab 60 mg/dL (1,55 mmol/L)',
    };
  return { level: 'border', label: 'Normal', description: '40/50 – 59 mg/dL' };
};

const classifyTG = (mg: number): Classification => {
  if (mg < 150)
    return {
      level: 'optimal',
      label: 'Normal',
      description: 'Unter 150 mg/dL (1,7 mmol/L)',
    };
  if (mg < 200)
    return {
      level: 'border',
      label: 'Grenzwertig erhöht',
      description: '150–199 mg/dL (1,7–2,2 mmol/L)',
    };
  if (mg < 500)
    return {
      level: 'high',
      label: 'Hoch',
      description: '200–499 mg/dL (2,3–5,6 mmol/L)',
    };
  return {
    level: 'veryHigh',
    label: 'Sehr hoch',
    description: 'Ab 500 mg/dL (5,6 mmol/L)',
  };
};

const classifyNonHDL = (mg: number): Classification => {
  if (mg < 130)
    return {
      level: 'optimal',
      label: 'Optimal',
      description: 'Unter 130 mg/dL',
    };
  if (mg < 160)
    return {
      level: 'border',
      label: 'Grenzwertig erhöht',
      description: '130–159 mg/dL',
    };
  if (mg < 190)
    return { level: 'high', label: 'Hoch', description: '160–189 mg/dL' };
  return { level: 'veryHigh', label: 'Sehr hoch', description: 'Ab 190 mg/dL' };
};

const classifyRatioTcHdl = (r: number): Classification => {
  if (r < 3.5)
    return {
      level: 'optimal',
      label: 'Niedriges Risiko',
      description: 'Verhältnis < 3,5',
    };
  if (r < 5)
    return {
      level: 'border',
      label: 'Durchschnittliches Risiko',
      description: 'Verhältnis 3,5 – 5,0',
    };
  return {
    level: 'high',
    label: 'Erhöhtes Risiko',
    description: 'Verhältnis > 5,0',
  };
};

const classifyRatioLdlHdl = (r: number): Classification => {
  if (r < 2)
    return {
      level: 'optimal',
      label: 'Niedriges Risiko',
      description: 'Verhältnis < 2,0',
    };
  if (r < 3.5)
    return {
      level: 'border',
      label: 'Durchschnittliches Risiko',
      description: 'Verhältnis 2,0 – 3,5',
    };
  return {
    level: 'high',
    label: 'Erhöhtes Risiko',
    description: 'Verhältnis > 3,5',
  };
};

const classifyRatioTgHdl = (r: number): Classification => {
  if (r < 2)
    return {
      level: 'optimal',
      label: 'Günstig',
      description: 'Verhältnis < 2,0',
    };
  if (r < 4)
    return {
      level: 'border',
      label: 'Grenzwertig',
      description: 'Verhältnis 2,0 – 4,0',
    };
  return { level: 'high', label: 'Ungünstig', description: 'Verhältnis > 4,0' };
};

const barPosition = (mg: number, stops: number[]): number => {
  const max = stops[stops.length - 1] * 1.2;
  return Math.min(100, Math.max(2, (mg / max) * 100));
};

interface ValueCardProps {
  title: string;
  subtitle?: string;
  valueMg: number | null;
  unit: Unit;
  isTg?: boolean;
  classification: Classification | null;
  scaleStops: number[];
  scaleLabels: string[];
  computed?: boolean;
}

const ValueCard: FC<ValueCardProps> = ({
  title,
  subtitle,
  valueMg,
  unit,
  isTg = false,
  classification,
  scaleStops,
  scaleLabels,
  computed,
}) => {
  const empty = valueMg === null || classification === null;
  const styles = classification ? levelStyles[classification.level] : null;

  return (
    <div className="rounded-xl bg-white dark:bg-additionalText/40 p-5 border border-light dark:border-additionalText/30 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-merriweather text-lg font-bold text-mainText dark:text-white">
            {title}
            {computed && (
              <span className="ml-2 text-xs font-normal text-additionalText dark:text-white/70">
                (berechnet)
              </span>
            )}
          </h3>
          {subtitle && (
            <p className="text-xs text-additionalText dark:text-white/70 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {classification && styles && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles.chip}`}
          >
            {classification.label}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-merriweather text-3xl font-bold text-mainText dark:text-white">
          {empty ? '–' : fromMg(valueMg, unit, isTg)}
        </span>
      </div>

      <div className="relative h-2 rounded-full bg-light dark:bg-mainText/60 overflow-hidden">
        {!empty && styles && (
          <div
            className={`absolute top-0 left-0 h-full ${styles.bar} transition-all duration-500`}
            style={{ width: `${barPosition(valueMg!, scaleStops)}%` }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-additionalText dark:text-white/60">
        {scaleLabels.map(l => (
          <span key={l}>{l}</span>
        ))}
      </div>
      {classification && (
        <p className="mt-3 text-xs text-additionalText dark:text-white/80">
          {classification.description}
        </p>
      )}
    </div>
  );
};

interface RatioCardProps {
  title: string;
  subtitle: string;
  value: number | null;
  classification: Classification | null;
  scaleLabels: string[];
}

const RatioCard: FC<RatioCardProps> = ({
  title,
  subtitle,
  value,
  classification,
  scaleLabels,
}) => {
  const empty = value === null || classification === null;
  const styles = classification ? levelStyles[classification.level] : null;
  return (
    <div className="rounded-xl bg-white dark:bg-additionalText/40 p-5 border border-light dark:border-additionalText/30 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-merriweather text-lg font-bold text-mainText dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-additionalText dark:text-white/70 mt-0.5">
            {subtitle}
          </p>
        </div>
        {classification && styles && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${styles.chip}`}
          >
            {classification.label}
          </span>
        )}
      </div>
      <div className="font-merriweather text-3xl font-bold text-mainText dark:text-white mb-3">
        {empty ? '–' : value!.toFixed(2)}
      </div>
      <div className="relative h-2 rounded-full bg-light dark:bg-mainText/60 overflow-hidden">
        {!empty && styles && (
          <div
            className={`absolute top-0 left-0 h-full ${styles.bar} transition-all duration-500`}
            style={{
              width: `${Math.min(100, Math.max(4, (value! / 8) * 100))}%`,
            }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-additionalText dark:text-white/60">
        {scaleLabels.map(l => (
          <span key={l}>{l}</span>
        ))}
      </div>
      {classification && (
        <p className="mt-3 text-xs text-additionalText dark:text-white/80">
          {classification.description}
        </p>
      )}
    </div>
  );
};

const Calculator = () => {
  useDocumentMeta({
    title: 'Cholesterin-Rechner – LDL, HDL, Triglyceride & Risiko-Quotienten',
    description:
      'Kostenloser Cholesterin-Rechner: LDL nach Friedewald, Non-HDL, TC/HDL- und LDL/HDL-Quotient. Mit Einheitenumrechner (mg/dL ↔ mmol/L), Klassifizierung und Empfehlungen.',
    canonical: buildCanonical('/rechner'),
  });

  useStructuredData(
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Cholesterin-Rechner',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: buildCanonical('/rechner'),
      description:
        'Cholesterin-Rechner zur Auswertung von LDL, HDL, Triglyceriden, Non-HDL und Quotienten nach den Leitlinien der DGFF und ESC.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    },
    'calculator',
  );

  const [unit, setUnit] = useState<Unit>('mg');
  const [form, setForm] = useState<FormState>(initialState);

  const sanitizeDecimal = (raw: string): string => {
    let v = raw.replace(/[^0-9.,]/g, '');
    const firstSep = v.search(/[.,]/);
    if (firstSep !== -1) {
      v = v.slice(0, firstSep + 1) + v.slice(firstSep + 1).replace(/[.,]/g, '');
    }
    const [intPart, decPart] = v.split(/[.,]/);
    const trimmedInt = intPart.slice(0, 4);
    if (decPart !== undefined) {
      return `${trimmedInt}${v.includes(',') ? ',' : '.'}${decPart.slice(0, 2)}`;
    }
    return trimmedInt;
  };

  const sanitizeInt = (raw: string, maxLen = 3): string => {
    return raw.replace(/\D/g, '').slice(0, maxLen);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const errors = useMemo(
    () => ({
      totalCholesterol: validateRange(form.totalCholesterol, unit, RANGES.tc),
      hdl: validateRange(form.hdl, unit, RANGES.hdl),
      ldl: validateRange(form.ldl, unit, RANGES.ldl),
      triglycerides: validateRange(form.triglycerides, unit, RANGES.tg, true),
      age: validateInt(form.age, RANGES.age.min, RANGES.age.max),
      systolic: validateInt(
        form.systolic,
        RANGES.systolic.min,
        RANGES.systolic.max,
      ),
    }),
    [form, unit],
  );

  const safe = (raw: number | null, hasError: boolean) =>
    hasError ? null : raw;

  const tcMg = useMemo(
    () => safe(toMg(form.totalCholesterol, unit), !!errors.totalCholesterol),
    [form.totalCholesterol, unit, errors.totalCholesterol],
  );
  const hdlMg = useMemo(
    () => safe(toMg(form.hdl, unit), !!errors.hdl),
    [form.hdl, unit, errors.hdl],
  );
  const tgMg = useMemo(
    () => safe(toMg(form.triglycerides, unit, true), !!errors.triglycerides),
    [form.triglycerides, unit, errors.triglycerides],
  );
  const ldlInput = useMemo(
    () => safe(toMg(form.ldl, unit), !!errors.ldl),
    [form.ldl, unit, errors.ldl],
  );

  const ldlMg = useMemo(() => {
    if (ldlInput !== null) return ldlInput;
    if (tcMg === null || hdlMg === null || tgMg === null) return null;
    if (tgMg >= 400) return null;
    return tcMg - hdlMg - tgMg / 5;
  }, [ldlInput, tcMg, hdlMg, tgMg]);

  const ldlComputed = ldlInput === null && ldlMg !== null;

  const nonHdlMg = useMemo(() => {
    if (tcMg === null || hdlMg === null) return null;
    return tcMg - hdlMg;
  }, [tcMg, hdlMg]);

  const ratioTcHdl = useMemo(() => {
    if (tcMg === null || hdlMg === null || hdlMg === 0) return null;
    return tcMg / hdlMg;
  }, [tcMg, hdlMg]);

  const ratioLdlHdl = useMemo(() => {
    if (ldlMg === null || hdlMg === null || hdlMg === 0) return null;
    return ldlMg / hdlMg;
  }, [ldlMg, hdlMg]);

  const ratioTgHdl = useMemo(() => {
    if (tgMg === null || hdlMg === null || hdlMg === 0) return null;
    return tgMg / hdlMg;
  }, [tgMg, hdlMg]);

  const tcClass = tcMg !== null ? classifyTC(tcMg) : null;
  const ldlClass = ldlMg !== null ? classifyLDL(ldlMg) : null;
  const hdlClass = hdlMg !== null ? classifyHDL(hdlMg, form.gender) : null;
  const tgClass = tgMg !== null ? classifyTG(tgMg) : null;
  const nonHdlClass = nonHdlMg !== null ? classifyNonHDL(nonHdlMg) : null;
  const tcHdlClass =
    ratioTcHdl !== null ? classifyRatioTcHdl(ratioTcHdl) : null;
  const ldlHdlClass =
    ratioLdlHdl !== null ? classifyRatioLdlHdl(ratioLdlHdl) : null;
  const tgHdlClass =
    ratioTgHdl !== null ? classifyRatioTgHdl(ratioTgHdl) : null;

  const filledClasses = [
    tcClass,
    ldlClass,
    hdlClass,
    tgClass,
    nonHdlClass,
    tcHdlClass,
    ldlHdlClass,
    tgHdlClass,
  ].filter((c): c is Classification => c !== null);

  const overall = useMemo(() => {
    if (filledClasses.length === 0) return null;
    const severity: Record<Level, number> = {
      optimal: 0,
      low: 2,
      border: 1,
      high: 2,
      veryHigh: 3,
    };
    const max = Math.max(...filledClasses.map(c => severity[c.level]));
    const ageNum = errors.age ? NaN : parseInt(form.age, 10);
    const ageRisk =
      !Number.isNaN(ageNum) &&
      ((form.gender === 'm' && ageNum >= 45) ||
        (form.gender === 'f' && ageNum >= 55));
    let score = max;
    if (form.smoker) score += 1;
    if (form.diabetes) score += 1;
    if (ageRisk) score += 0.5;
    if (score >= 3)
      return { label: 'Hohes Risikoprofil', level: 'veryHigh' as Level };
    if (score >= 2)
      return { label: 'Erhöhtes Risikoprofil', level: 'high' as Level };
    if (score >= 1)
      return { label: 'Leicht erhöhtes Profil', level: 'border' as Level };
    return { label: 'Günstiges Profil', level: 'optimal' as Level };
  }, [
    filledClasses,
    form.smoker,
    form.diabetes,
    form.age,
    form.gender,
    errors.age,
  ]);

  const recommendations = useMemo(() => {
    const list: string[] = [];
    if (
      ldlClass &&
      (ldlClass.level === 'high' ||
        ldlClass.level === 'veryHigh' ||
        ldlClass.level === 'border')
    ) {
      list.push(
        'LDL senken: gesättigte Fette reduzieren (Butter, Wurst, Käse), durch Olivenöl, Nüsse und Hafer (Beta-Glucan) ersetzen.',
      );
    }
    if (hdlClass && hdlClass.level === 'low') {
      list.push(
        'HDL anheben: mindestens 150 Minuten Ausdauerbewegung pro Woche, Rauchen einstellen, mediterrane Ernährung.',
      );
    }
    if (
      tgClass &&
      (tgClass.level === 'high' ||
        tgClass.level === 'veryHigh' ||
        tgClass.level === 'border')
    ) {
      list.push(
        'Triglyceride senken: Zucker und Alkohol stark reduzieren, raffinierte Kohlenhydrate meiden, fetter Seefisch 1–2× pro Woche.',
      );
    }
    if (
      nonHdlClass &&
      (nonHdlClass.level === 'high' || nonHdlClass.level === 'veryHigh')
    ) {
      list.push(
        'Non-HDL ist ein zuverlässiger Risikomarker – sprechen Sie über eine individuelle Zielwert-Vereinbarung mit Ihrer Ärztin/Ihrem Arzt.',
      );
    }
    if (form.smoker) {
      list.push(
        'Rauchstopp: senkt das kardiovaskuläre Risiko bereits nach 1 Jahr deutlich – kassenfinanzierte Programme nutzen.',
      );
    }
    if (form.diabetes) {
      list.push(
        'Bei Diabetes gelten strengere LDL-Zielwerte (häufig < 70 mg/dL). Therapie mit Ihrer Ärztin/Ihrem Arzt abstimmen.',
      );
    }
    const sys = errors.systolic ? NaN : parseInt(form.systolic, 10);
    if (!Number.isNaN(sys) && sys >= 140) {
      list.push(
        'Blutdruck ist erhöht (≥ 140 mmHg systolisch). Regelmäßig messen und ärztlich abklären.',
      );
    }
    if (list.length === 0 && overall && overall.level === 'optimal') {
      list.push(
        'Ihre Werte sind günstig. Mediterrane Ernährung, regelmäßige Bewegung und Nichtrauchen beibehalten.',
      );
    }
    return list;
  }, [
    ldlClass,
    hdlClass,
    tgClass,
    nonHdlClass,
    form.smoker,
    form.diabetes,
    form.systolic,
    overall,
    errors.systolic,
  ]);

  const handleReset = () => setForm(initialState);
  const handlePrint = () => window.print();

  const inputCls = (hasError: boolean) =>
    `w-full rounded-lg border bg-white dark:bg-mainText/60 px-3 py-2.5 text-mainText dark:text-white placeholder:text-additionalText/60 focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
        : 'border-light dark:border-additionalText/40 focus:border-main focus:ring-main/30'
    }`;

  const errorText = (msg: string | null) =>
    msg ? (
      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
        {msg}
      </p>
    ) : null;

  const unitLabel = unit === 'mg' ? 'mg/dL' : 'mmol/L';
  const tgUnitLabel = unit === 'mg' ? 'mg/dL' : 'mmol/L';
  const tcBounds = rangeFor(RANGES.tc, unit);
  const hdlBounds = rangeFor(RANGES.hdl, unit);
  const ldlBounds = rangeFor(RANGES.ldl, unit);
  const tgBounds = rangeFor(RANGES.tg, unit, true);

  return (
    <div className="container section__padding">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="section__subtitle mb-4">Cholesterin-Rechner</h1>
          <p className="section__description max-w-3xl mx-auto">
            Werten Sie Ihre Blutwerte sofort aus: LDL nach Friedewald, Non-HDL,
            sowie die wichtigsten Risiko-Quotienten (TC/HDL, LDL/HDL, Trig/HDL).
            Mit Klassifizierung nach gängigen kardiologischen Leitlinien und
            verständlichen Empfehlungen.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <section className="bg-white dark:bg-additionalText/30 rounded-2xl p-6 shadow-sm border border-light dark:border-additionalText/30 h-fit sticky top-4 print:static print:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-merriweather text-xl font-bold text-mainText dark:text-white">
                Ihre Werte
              </h2>
              <div className="inline-flex rounded-full bg-light dark:bg-mainText/60 p-1 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setUnit('mg')}
                  className={`px-3 py-1.5 rounded-full transition ${
                    unit === 'mg'
                      ? 'bg-main text-white shadow'
                      : 'text-additionalText dark:text-white/80'
                  }`}
                >
                  mg/dL
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('mmol')}
                  className={`px-3 py-1.5 rounded-full transition ${
                    unit === 'mmol'
                      ? 'bg-main text-white shadow'
                      : 'text-additionalText dark:text-white/80'
                  }`}
                >
                  mmol/L
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block sm:col-span-2">
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  Gesamtcholesterin{' '}
                  <span className="text-additionalText font-normal">
                    ({unitLabel})
                  </span>
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={
                    unit === 'mg'
                      ? `z. B. 210 (${tcBounds.min}–${tcBounds.max})`
                      : `z. B. 5.4 (${tcBounds.min}–${tcBounds.max})`
                  }
                  className={inputCls(!!errors.totalCholesterol)}
                  value={form.totalCholesterol}
                  onChange={e =>
                    update('totalCholesterol', sanitizeDecimal(e.target.value))
                  }
                  aria-invalid={!!errors.totalCholesterol}
                />
                {errorText(errors.totalCholesterol)}
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  HDL{' '}
                  <span className="text-additionalText font-normal">
                    ({unitLabel})
                  </span>
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={
                    unit === 'mg'
                      ? `z. B. 55 (${hdlBounds.min}–${hdlBounds.max})`
                      : `z. B. 1.4 (${hdlBounds.min}–${hdlBounds.max})`
                  }
                  className={inputCls(!!errors.hdl)}
                  value={form.hdl}
                  onChange={e => update('hdl', sanitizeDecimal(e.target.value))}
                  aria-invalid={!!errors.hdl}
                />
                {errorText(errors.hdl)}
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  Triglyceride{' '}
                  <span className="text-additionalText font-normal">
                    ({tgUnitLabel})
                  </span>
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={
                    unit === 'mg'
                      ? `z. B. 130 (${tgBounds.min}–${tgBounds.max})`
                      : `z. B. 1.5 (${tgBounds.min}–${tgBounds.max})`
                  }
                  className={inputCls(!!errors.triglycerides)}
                  value={form.triglycerides}
                  onChange={e =>
                    update('triglycerides', sanitizeDecimal(e.target.value))
                  }
                  aria-invalid={!!errors.triglycerides}
                />
                {errorText(errors.triglycerides)}
              </label>

              <label className="block sm:col-span-2">
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  LDL{' '}
                  <span className="text-additionalText font-normal">
                    ({unitLabel}, optional – sonst nach Friedewald berechnet)
                  </span>
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={`optional (${ldlBounds.min}–${ldlBounds.max})`}
                  className={inputCls(!!errors.ldl)}
                  value={form.ldl}
                  onChange={e => update('ldl', sanitizeDecimal(e.target.value))}
                  aria-invalid={!!errors.ldl}
                />
                {errorText(errors.ldl)}
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  Alter
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`Jahre (${RANGES.age.min}–${RANGES.age.max})`}
                  className={inputCls(!!errors.age)}
                  value={form.age}
                  onChange={e => update('age', sanitizeInt(e.target.value))}
                  aria-invalid={!!errors.age}
                />
                {errorText(errors.age)}
              </label>

              <div>
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  Geschlecht
                </span>
                <div className="inline-flex rounded-lg bg-light dark:bg-mainText/60 p-1 w-full">
                  <button
                    type="button"
                    onClick={() => update('gender', 'm')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                      form.gender === 'm'
                        ? 'bg-main text-white shadow'
                        : 'text-additionalText dark:text-white/80'
                    }`}
                  >
                    Männlich
                  </button>
                  <button
                    type="button"
                    onClick={() => update('gender', 'f')}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                      form.gender === 'f'
                        ? 'bg-main text-white shadow'
                        : 'text-additionalText dark:text-white/80'
                    }`}
                  >
                    Weiblich
                  </button>
                </div>
              </div>

              <label className="block sm:col-span-2">
                <span className="block text-sm font-medium text-mainText dark:text-white mb-1.5">
                  Blutdruck systolisch{' '}
                  <span className="text-additionalText font-normal">
                    (mmHg, optional)
                  </span>
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`z. B. 125 (${RANGES.systolic.min}–${RANGES.systolic.max})`}
                  className={inputCls(!!errors.systolic)}
                  value={form.systolic}
                  onChange={e =>
                    update('systolic', sanitizeInt(e.target.value))
                  }
                  aria-invalid={!!errors.systolic}
                />
                {errorText(errors.systolic)}
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded text-main focus:ring-main accent-main"
                  checked={form.smoker}
                  onChange={e => update('smoker', e.target.checked)}
                />
                <span className="text-sm text-mainText dark:text-white">
                  Raucher:in
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded text-main focus:ring-main accent-main"
                  checked={form.diabetes}
                  onChange={e => update('diabetes', e.target.checked)}
                />
                <span className="text-sm text-mainText dark:text-white">
                  Diabetes mellitus
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-lg border border-additionalText/30 text-additionalText dark:text-white hover:bg-light dark:hover:bg-mainText/60 transition font-medium"
              >
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-lg bg-main3 text-white hover:bg-main2 transition font-medium ml-auto"
              >
                Ergebnis drucken / PDF
              </button>
            </div>
          </section>

          <section>
            {overall && (
              <div
                className={`rounded-2xl p-6 mb-6 border ${levelStyles[overall.level].chip} border-current/10`}
              >
                <p className="text-sm uppercase tracking-wider opacity-70 mb-1">
                  Gesamteinschätzung
                </p>
                <p className="font-merriweather text-2xl font-bold">
                  {overall.label}
                </p>
                <p className="text-sm mt-2 opacity-90">
                  Basierend auf {filledClasses.length} eingegebenen Werten und
                  Ihren Risikofaktoren. Ersetzt keine ärztliche Diagnose.
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <ValueCard
                title="Gesamtcholesterin"
                subtitle="Summe aller Cholesterinfraktionen"
                valueMg={tcMg}
                unit={unit}
                classification={tcClass}
                scaleStops={[200, 240, 300]}
                scaleLabels={['< 200', '240', 'hoch']}
              />
              <ValueCard
                title="LDL-Cholesterin"
                subtitle={
                  ldlComputed
                    ? 'Friedewald: TC − HDL − TG/5'
                    : 'Das „schlechte" Cholesterin'
                }
                valueMg={ldlMg}
                unit={unit}
                classification={ldlClass}
                scaleStops={[100, 130, 160, 190, 230]}
                scaleLabels={['100', '130', '160', '190+']}
                computed={ldlComputed}
              />
              <ValueCard
                title="HDL-Cholesterin"
                subtitle={`Schützend, Zielwert ${form.gender === 'm' ? '> 40' : '> 50'} mg/dL`}
                valueMg={hdlMg}
                unit={unit}
                classification={hdlClass}
                scaleStops={[40, 60, 80, 100]}
                scaleLabels={['< 40', '60', '80+']}
              />
              <ValueCard
                title="Triglyceride"
                subtitle="Blutfette aus Nahrung & Leber"
                valueMg={tgMg}
                unit={unit}
                isTg
                classification={tgClass}
                scaleStops={[150, 200, 500, 600]}
                scaleLabels={['< 150', '200', '500+']}
              />
              <ValueCard
                title="Non-HDL-Cholesterin"
                subtitle="TC − HDL · zuverlässiger Risikomarker"
                valueMg={nonHdlMg}
                unit={unit}
                classification={nonHdlClass}
                scaleStops={[130, 160, 190, 230]}
                scaleLabels={['< 130', '160', '190+']}
                computed
              />
              <RatioCard
                title="TC / HDL"
                subtitle="Atherogener Index"
                value={ratioTcHdl}
                classification={tcHdlClass}
                scaleLabels={['< 3,5', '5,0', '> 5']}
              />
              <RatioCard
                title="LDL / HDL"
                subtitle="Risiko-Quotient"
                value={ratioLdlHdl}
                classification={ldlHdlClass}
                scaleLabels={['< 2', '3,5', '> 3,5']}
              />
              <RatioCard
                title="Trig / HDL"
                subtitle="Marker für Insulinresistenz"
                value={ratioTgHdl}
                classification={tgHdlClass}
                scaleLabels={['< 2', '4', '> 4']}
              />
            </div>

            {recommendations.length > 0 && (
              <div className="rounded-2xl bg-white dark:bg-additionalText/30 p-6 border border-light dark:border-additionalText/30 shadow-sm">
                <h2 className="font-merriweather text-xl font-bold text-mainText dark:text-white mb-4">
                  Persönliche Empfehlungen
                </h2>
                <ul className="space-y-3">
                  {recommendations.map(r => (
                    <li
                      key={r}
                      className="flex gap-3 text-mainText dark:text-white/90 text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-main3 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <section className="mt-12 grid md:grid-cols-3 gap-4 print:hidden">
          <div className="rounded-xl p-5 bg-white dark:bg-additionalText/30 border border-light dark:border-additionalText/30">
            <h3 className="font-merriweather font-bold text-mainText dark:text-white mb-2">
              Was bedeutet LDL?
            </h3>
            <p className="text-sm text-additionalText dark:text-white/80 leading-relaxed">
              LDL transportiert Cholesterin in die Gefäße. Hohe Werte lagern
              sich in den Arterienwänden ab und erhöhen das Risiko für
              Herzinfarkt und Schlaganfall.
            </p>
          </div>
          <div className="rounded-xl p-5 bg-white dark:bg-additionalText/30 border border-light dark:border-additionalText/30">
            <h3 className="font-merriweather font-bold text-mainText dark:text-white mb-2">
              Friedewald-Formel
            </h3>
            <p className="text-sm text-additionalText dark:text-white/80 leading-relaxed">
              LDL = Gesamtcholesterin − HDL − (Triglyceride / 5). Gültig bei
              Triglyceriden unter 400 mg/dL. Andernfalls direkte Messung nötig.
            </p>
          </div>
          <div className="rounded-xl p-5 bg-white dark:bg-additionalText/30 border border-light dark:border-additionalText/30">
            <h3 className="font-merriweather font-bold text-mainText dark:text-white mb-2">
              Warum Non-HDL?
            </h3>
            <p className="text-sm text-additionalText dark:text-white/80 leading-relaxed">
              Non-HDL umfasst alle „schlechten" Lipoproteine und gilt heute als
              robuster Risikomarker – besonders bei erhöhten Triglyceriden.
            </p>
          </div>
        </section>

        <p className="mt-10 text-xs text-additionalText dark:text-white/70 leading-relaxed border-t border-light dark:border-additionalText/30 pt-6">
          <strong>Wichtiger Hinweis:</strong> Dieser Rechner dient
          ausschließlich Informationszwecken und ersetzt keine ärztliche
          Beratung, Diagnose oder Therapie. Die Klassifizierungen orientieren
          sich an gängigen Empfehlungen (u. a. ESC, DGFF, NCEP ATP III).
          Individuelle Zielwerte können – etwa bei Diabetes oder bestehender
          Herzerkrankung – deutlich niedriger liegen. Besprechen Sie Ihre Werte
          stets mit Ihrer Ärztin oder Ihrem Arzt.
        </p>

        <div className="mt-8 text-center print:hidden">
          <Link
            to="/"
            className="inline-block text-main3 hover:text-main2 font-medium transition"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
