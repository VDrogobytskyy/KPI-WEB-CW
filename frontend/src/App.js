import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import AutorizedPage from './screens/AutorizedPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';

function App() {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/app' element={<AutorizedPage />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
