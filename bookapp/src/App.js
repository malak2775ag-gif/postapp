import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import Home from './components/home';
import Header from './components/header';
import Footer from './components/footer';
import Profile from './components/profile';
import UpdateProfile from './components/UpdateProfile';
import AddBook from './components/addbook';
import BookDetails from './components/BookDetails';




function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Router>
        <Header />
        <main className="flex-grow-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          
          <Route path="/" element={<Home />} /> 
          <Route path="/addbook" element={<AddBook />} />

          <Route path="/book/:id" element={<BookDetails />} />


        </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
