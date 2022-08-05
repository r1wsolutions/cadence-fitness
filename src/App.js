import { Switch, Route } from "react-router";
import RegisterSignIn from "./pages/RegisterSignIn";
import LogWorkout from "./pages/LogWorkout";
import DateSelection from "./pages/DateSelection";
import Dashboard from "./pages/MonthView";
import DayDetails from "./pages/DayDetails";
import Stats from "./pages/Stats";
import NavBar from "./components/nav-bar/NavBar";
import LandingPage from "./pages/LandingPage";
import ErrorModal from "./components/ErrorModal/ErrorModal";
import styles from './App.module.css'
import Footer from "./components/Footer/Footer";


function App() {

  return (
    <>
      <NavBar />
      <ErrorModal />
      <div className={styles['main-wrapper']}>
        <Switch>
          <Route exact path='/' component={LandingPage}/>
          <Route path='/auth' component={RegisterSignIn}/>
          <Route path='/log' component={LogWorkout} />
          <Route path='/date-selection' component={DateSelection} />
          <Route path='/dashboard/:year/:month' component={Dashboard} />
          <Route path='/details/:dayId' component={DayDetails} />
          <Route path='/stats' component={Stats} />
        </Switch>
      </div>
      <Footer />
    </>
  );
}

export default App;
