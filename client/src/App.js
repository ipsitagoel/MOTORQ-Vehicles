import NavBar from './components/NavBar/NavBar'
import Main from './components/Main/Main'
import Vehicles from './components/Vehicles/Vehicles'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
function App() {
  return (
      <div>
      <Router>
        <NavBar />
        <Switch>
          <Route path='/'>
            <Main />
          </Route>
          <Route path='/vehicles'>
            <Vehicles />
          </Route>
        </Switch>
      </Router>
      </div>
  );
}

export default App;
