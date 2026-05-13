import { FC } from 'react';

import Hero from '../views/Hero';
import Categories from '../views/Categories';
import About from '../views/About';
import Disclaimer from '../views/Disclaimer';
import SearchBar from '../views/SearchBar';
import Newsletter from '../views/Newsletter';
import CalculatorCTA from '../views/CalculatorCTA';
import { SITE_URL, useDocumentMeta } from '../utils/seo';

interface Category {
  documentId: number | string;
  name: string;
}

interface HomeProps {
  categories: Category[];
}

const Home: FC<HomeProps> = ({ categories }) => {
  useDocumentMeta({
    title: 'Praktische Tipps zu Cholesterin, Ernährung & Gesundheit',
    description:
      'CholesterinTipps – verständliche Artikel und Ratgeber rund um Cholesterin, Ernährung, Bewegung und einen gesunden Lebensstil. Praktische Tipps für den Alltag.',
    canonical: `${SITE_URL}/`,
    type: 'website',
  });

  return (
    <div>
      <Hero />
      <CalculatorCTA />
      <SearchBar />
      <Categories categories={categories} />
      <About />
      <Newsletter />
      <Disclaimer />
    </div>
  );
};

export default Home;
