import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <AppRouter />
      <Footer />
    </Router>
  );
};

export default App;
