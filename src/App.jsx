import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

import Headers from './components/Headers';
import  Footer  from './components/Footer';
import { Route, Routes } from 'react-router-dom';

import Vote from './pages/Vote';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Members from './pages/Members';
import Communities from './pages/Communities';
import MyCommunity from './pages/MyCommunity';
import Join from './pages/Join';
// import Login from './pages/Login';
import ProposalTemplate from './pages/ProposalTemplate';
import CreateProposal from './pages/CreateProposal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
// Move to comments component
import './styles/Comments.css';

const App = () => {
  return (
    <div className="container">
      <Headers />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Vote" element={<Vote />} />
          <Route path="/Members" element={<Members />} />
          <Route path="/Communities" element={<Communities />} />
          <Route path="/MyCommunity" element={<MyCommunity />} />
          <Route path="/Join" element={<Join />} />
          <Route path="/ProposalTemplate" element={<ProposalTemplate />} />
          <Route path="/CreateProposal" element={<CreateProposal />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;