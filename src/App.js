import Login from './components/GoogleLogin';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProposalDetail from './components/ProposalsDetail';
import ProposalsList from './components/ProposalsList';

function App() {
  return (
    
    <div className="App">
      <header className="App-header">
        <Login />
        <Calendar />
        
          <Routes>
            <Route path="/" element={<ProposalsList />} />
            <Route path="/content_proposal/:id" element={<ProposalDetail />} />
          </Routes>
        
      </header>
    </div>
    
  );
}

export default App;
