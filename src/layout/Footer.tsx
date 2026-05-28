import { FC, useState } from 'react';
import Logo from '../components/Logo';
import Socials from '../components/Socials';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import EmailForm from '../components/EmailForm';

interface Category {
  documentId: number | string;
  name: string;
}

interface FooterProps {
  categories: Category[];
}

const Footer: FC<FooterProps> = ({ categories }) => {
  const [openForm, setOpenForm] = useState(false);

  const handleFormOpen = () => setOpenForm(true);
  const handleFormClose = () => setOpenForm(false);

  return (
    <footer className="bg-main2">
      <div className="container pt-14 flex flex-col gap-16 text-white">
        <Logo
          className="lg:text-5xl md:text-4xl text-3xl text-white w-fit"
          spanClassName="text-white"
          isLink
        />
        <div className="flex flex-col md:flex-row gap-x-48 gap-y-8">
          <div className="flex flex-col gap-8">
            <h4 className="section__description text-white font-merriweather font-semibold">
              Kategorien
            </h4>
            <NavBar
              categories={categories}
              className="flex flex-col gap-y-5"
              textClassName="lg:text-2xl md:text-2xl text-xl break-words text-white font-light"
            />
          </div>
          <div className="flex flex-col gap-8">
            <h4 className="section__description text-white font-merriweather font-semibold">
              Über
            </h4>
            <div className="flex flex-col gap-5">
              <Link
                to="/about"
                className="section__description text-white font-light"
              >
                Über uns
              </Link>
              <Link
                to="/forum"
                className="section__description text-white font-light"
              >
                Community-Forum
              </Link>
              <Link
                to="/rechner"
                className="section__description text-white font-light"
              >
                Cholesterin-Rechner
              </Link>
              <Link
                to="/impressum"
                className="section__description text-white font-light"
              >
                Impressum
              </Link>
              <Link
                to="/privacy"
                className="section__description text-white font-light"
              >
                Datenschutzerklärung
              </Link>
              <Link
                to="/terms"
                className="section__description text-white font-light"
              >
                Bedingungen
              </Link>
            </div>
            <button
              type="button"
              onClick={handleFormOpen}
              className="group inline-flex items-center justify-center gap-2 bg-white text-main3 hover:bg-main hover:text-white px-5 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg w-full md:w-auto"
            >
              <span aria-hidden="true">✉️</span>
              Kontaktieren Sie uns
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>
          <div className="flex flex-col gap-8">
            <h4 className="section__description text-white font-merriweather font-semibold">
              Folge uns:
            </h4>
            <Socials
              textClassName="text-white font-light"
              IconsClassName="fill-white"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <hr className="w-full border-t-2 border-white m-0 opacity-50" />
          <p className="section__description text-skin text-white py-12 font-light">
            @2025 Cholesterin Tipps. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
      {openForm && <EmailForm handleFormClose={handleFormClose} />}
    </footer>
  );
};

export default Footer;
