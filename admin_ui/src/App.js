import logo from './logo.svg';
import './App.css';
import Component from './Components';
import Signin from './Signin';
import RegisterForm from './Register';

function App() {
  return (
    <div className="App">
      <Signin/>
      <RegisterForm/>
    </div>
  );
}

export default App;
