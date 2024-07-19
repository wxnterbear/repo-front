
//import './App.css';
import Login from './components/GoogleLogin';
import Calendar from './components/Calendar';
import Proposal from './components/Proposals';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Login />
      <Calendar/>
      <Proposal />
      </header>
    </div>
  );
}

export default App;
