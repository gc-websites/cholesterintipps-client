const Disclaimer = () => {
  return (
    <section className="section__padding bg-slate-50 dark:bg-additionalText">
      <div className="container flex flex-col gap-3">
        <h4 className="section__title text-base pb-2">
          Medizinischer Haftungsausschluss
        </h4>
        <p className="section__description text-sm">
          Die Inhalte auf cholesterintipps.de dienen ausschließlich allgemeinen
          Informations- und Bildungszwecken. Sie ersetzen{' '}
          <strong>
            keine professionelle medizinische Beratung, Diagnose oder Behandlung
          </strong>
          . Bitte konsultieren Sie bei gesundheitlichen Fragen, vor dem Beginn
          oder der Änderung einer Therapie sowie vor der Einnahme von
          Nahrungsergänzungsmitteln stets eine Ärztin, einen Arzt oder eine
          andere qualifizierte medizinische Fachperson.
        </p>
        <p className="section__description text-sm">
          Die hier veröffentlichten Artikel werden mit Sorgfalt recherchiert,
          können jedoch den aktuellen Stand der medizinischen Forschung nur
          eingeschränkt abbilden. Wir übernehmen keine Gewähr für die
          Aktualität, Richtigkeit oder Vollständigkeit der bereitgestellten
          Informationen. In medizinischen Notfällen wenden Sie sich bitte
          umgehend an den ärztlichen Notdienst (Tel. 116 117) oder an den
          Rettungsdienst (Tel. 112).
        </p>
        <p className="section__description text-sm opacity-80">
          Quellen für unsere Inhalte sind unter anderem die Deutsche
          Gesellschaft für Ernährung (DGE), das Robert Koch-Institut, die
          Deutsche Herzstiftung sowie peer-reviewte Fachliteratur. Einzelne
          Quellenangaben finden Sie am Ende der jeweiligen Artikel.
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
