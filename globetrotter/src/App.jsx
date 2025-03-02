import { useState, useEffect } from "react";
import RegisterForm from "./pages/RegisterForm.jsx";
import GamePage from "./pages/GamePage.jsx";
// import GameingPage from "./pages/GameingPage.jsx";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return <>{user ? <GamePage user={user} /> : <RegisterForm setUser={setUser} />}</>;
};

export default App;
