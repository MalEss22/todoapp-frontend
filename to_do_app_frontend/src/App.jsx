import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup'
import Login from './pages/Login';  
import TodoList from './pages/Todo';
import WelcomePage from './pages/welcome';
export const MyFunction = arg =>  {}
const App = () => {
  return(
    <Router>
    <div>
      {/* Routes */}
      <Routes>
      <Route path="/" element={<WelcomePage/>}/>
        <Route path="/signup" element={<Signup/>} />
        {/* Fallback route for undefined paths */}
        {<Route path="*" element={<div>404 Page Not Found</div>} />}
        <Route path="/login" element={<Login/>}/>
        <Route path="/todos" element={<TodoList/>}/>
        
      </Routes>

    </div>
  </Router>)
  
}


export default App
