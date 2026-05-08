import { Container, Row, Col, Button, Badge } from 'react-bootstrap'

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './screens/HomePage';
import AutorizedPage from './screens/AutorizedPage';

function App() {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path='/' element={<AutorizedPage />} exact />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
