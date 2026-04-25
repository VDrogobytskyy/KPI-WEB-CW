import { Container, Image, Row, Col } from 'react-bootstrap'

import Header from './components/Header'
import Footer from './components/Footer'
import MainHomePage from './components/MainHomePage';
import photo_for_h2 from './photos/photo_for_h2.png'
import HomePageCalories from './components/HomePageCalories'

function App() {
  return (
    <div>
      <Header />
      <main className="py-3">
        <Container>
          <h1 className="h1-background">
            <p style={{ textAlign: 'center', fontSize: '2rem'}}>Your personal dashboard for smart calorie tracking and nutritional insights.</p>
          </h1>

          <Row className="align-items-center py-3 my-3">
            <Col md={6}>
              <HomePageCalories />
            </Col>
            <Col md={6}>
              <div className="text-color">
                <p style={{ textAlign: 'center-left', fontSize: '1.8rem' }}>
                  Easily track your meals, monitor your daily intake, and stay fully aware of your nutrition habits throughout the day. 
                  With intuitive tools and interactive charts, you can visualize your progress, identify patterns, and make smarter decisions about what you eat.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </div >
  );
}

export default App;
