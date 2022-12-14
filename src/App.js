import logo from './assets/BudgetBoyLogo.png';
import './App.css';
import React from 'react';
import { BrowserRouter as Router,
  Route,
  Routes,
  Switch,
  Link,
  Redirect 
 } from 'react-router-dom';
import Main from './pages/Main';
import CurrentBudget from './pages/CurrentBudget';
import MyBudgets from './pages/MyBudgets';
import Error404 from './pages/Error404';
import DefaultBudget from './pages/DefaultBudget';
import EditBudget from './pages/EditBudget';
import CreateBudget from './pages/CreateBudget';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path='/DefaultBudget' element={<DefaultBudget/>} />
          <Route path='/EditBudget' element={<EditBudget/>} />
          <Route path='/CreateBudget' element={<CreateBudget/>} />
          {/* <Route path='/CurrentBudget' element={<CurrentBudget/>} />
          <Route path='/MyBudgets' element={<MyBudgets/>} />
           */}
          <Route path='*' element={<Error404/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
