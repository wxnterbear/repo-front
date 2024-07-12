
//import './App.css';
import Login from './components/GoogleLogin';
import Calendar from './components/Calendar';
import {Inject, ScheduleComponent, Day, Month, Week, WorkWeek, Agenda} from '@syncfusion/ej2-react-schedule';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login/>
        <Calendar />
      </header>
    </div>
  );
}

export default App;
