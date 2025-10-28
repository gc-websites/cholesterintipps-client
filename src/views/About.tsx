import { goals, vision, values } from '../utils/Icons';

const About = () => {
  return (
    <section className="container section__padding">
      <h2 className="section__title mb-6">Über uns</h2>
      <p className="section__description mb-4">
        Willkommen auf unserem Informationsportal! Unsere Mission ist es, den
        Lesern die interessantesten und aktuellsten Artikel zu verschiedenen
        Themen bereitzustellen. Unser Team erfahrener Autoren recherchiert und
        beleuchtet Themen, die in der modernen Gesellschaft von Bedeutung sind.
      </p>
      <p className="section__description mb-4">
        Wir glauben, dass Wissen Macht ist. Unsere Inhalte sollen informieren,
        inspirieren und den Horizont unserer Leser erweitern. Ob Sie nach
        Ratschlägen zu einem gesunden Lebensstil, technologischen Neuigkeiten
        oder kulturellen Rezensionen suchen – bei uns ist für jeden etwas dabei.
      </p>

      <div className="flex flex-wrap justify-center items-start mt-8">
        <div className="w-full md:w-1/3 p-4">
          <svg
            className="w-16 h-16 mx-auto mb-4 fill-main2"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {goals}
          </svg>
          <h3 className="section__title mb-2 text-center">Unsere Mission</h3>
          <p className="section__description">
            Hochwertige, verlässliche und vielfältige Inhalte bereitzustellen,
            die den Interessen und Bedürfnissen unserer Leser entsprechen und
            eine Gemeinschaft informierter Menschen fördern.
          </p>
        </div>

        <div className="w-full md:w-1/3 p-4">
          <svg
            className="w-16 h-16 mx-auto mb-4 fill-main2"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {vision}
          </svg>
          <h3 className="section__title mb-2 text-center">Unsere Vision</h3>
          <p className="section__description">
            Eine führende Plattform für aufschlussreiche Artikel zu werden, auf
            der Leser Inspiration, Wissen und ein tieferes Verständnis für die
            Welt um sie herum finden können.
          </p>
        </div>

        <div className="w-full md:w-1/3 p-4">
          <svg
            className="w-16 h-16 mx-auto mb-4 fill-main2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {values}
          </svg>
          <h3 className="section__title mb-2 text-center">Unsere Werte</h3>
          <p className="section__description">
            Integrität, Neugier und Inklusivität stehen im Mittelpunkt all
            unseres Handelns. Wir bemühen uns, diese Prinzipien in all unseren
            Inhalten und Interaktionen aufrechtzuerhalten.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
