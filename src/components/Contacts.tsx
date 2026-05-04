const Contacts = () => {
  return (
    <div className="flex flex-col gap-y-10" id="contacts">
      <div className="flex flex-col gap-y-4">
        <p className="font-inter text-lg opacity-60">E-Mail:</p>
        <a
          href="mailto:kontakt@cholesterintipps.de"
          className="font-inter md:text-2xl text-xl break-words"
        >
          kontakt@cholesterintipps.de
        </a>
      </div>
      <div className="flex flex-col gap-y-4">
        <p className="font-inter text-lg opacity-60">Redaktion:</p>
        <a
          href="mailto:redaktion@cholesterintipps.de"
          className="font-inter md:text-2xl text-xl break-words"
        >
          redaktion@cholesterintipps.de
        </a>
      </div>
      <div className="flex flex-col gap-y-4">
        <p className="font-inter text-lg opacity-60">Antwortzeit:</p>
        <p className="font-inter md:text-2xl text-xl">
          In der Regel innerhalb von 1–3 Werktagen
        </p>
      </div>
    </div>
  );
};

export default Contacts;
