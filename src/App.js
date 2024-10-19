import Login from './components/Login';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProposalDetail from './components/ProposalsDetail';
import ProposalDetailCm from './components/ProposalsDetailCm';
import ProposalsList from './components/ProposalsList';
import ProposalsListCm from './components/ProposalsListCm';
import IdeasArchive from './components/IdeasArchive';
import Brainstorming from './components/BrainStorming';
import ProposalsForms from './components/ProposalsForm';
import EditProposal from './components/EditProposal';
import Home from './components/home';
import BrainStormingCM from './components/BrainStormingCM';
import LinkAccount from './components/LinkAccount';
import GoogleCallback from './components/GoogleCalback';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            {/* Rutas protegidas */}
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth/google/oauth2callback/?" element={<GoogleCallback />} />
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
              path="/content_proposal_Cm/:id" 
              element={
                <ProtectedRoute>
                  <ProposalDetailCm />
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
              path="/brainstormingCm" 
              element={
                <ProtectedRoute>
                  <BrainStormingCM />
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
            <Route 
              path="/editproposal/:id" 
              element={
                <ProtectedRoute>
                  <EditProposal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/proposals_cm" 
              element={
                <ProtectedRoute>
                  <ProposalsListCm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/link_account" 
              element={
                <ProtectedRoute>
                  <LinkAccount />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
