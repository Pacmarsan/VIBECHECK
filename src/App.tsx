/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { MostVibey } from './components/MostVibey';
import { Records } from './components/Records';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');

  return (
    <Layout currentTab={currentTab} setTab={setCurrentTab}>
      <AnimatePresence mode="wait">
        {currentTab === 'home' && <Home key="home" setTab={setCurrentTab} />}
        {currentTab === 'most-vibey' && <MostVibey key="most-vibey" />}
        {currentTab === 'records' && <Records key="records" />}
      </AnimatePresence>
    </Layout>
  );
}

