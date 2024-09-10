import Login from './components/GoogleLogin';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProposalDetail from './components/ProposalsDetail';
import ProposalsList from './components/ProposalsList';
import IdeasArchive from './components/IdeasArchive';
import Brainstorming from './components/BrainStorming';
import ProposalsForms from './components/ProposalsForm';
import Home from './components/home';
import Register from './components/GoogleRegister';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    
    <AuthContext>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/proposals" 
                element={
                  <ProtectedRoute>
                    <ProposalsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/content_proposal/:id" 
                element={
                  <ProtectedRoute>
                    <ProposalDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brainstorming" 
                element={
                  <ProtectedRoute>
                    <Brainstorming />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ideas-archive" 
                element={
                  <ProtectedRoute>
                    <IdeasArchive />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/proposals_form" 
                element={
                  <ProtectedRoute>
                    <ProposalsForms />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </header>
        </div>
      </AuthContext>

  );
}

export default App;
