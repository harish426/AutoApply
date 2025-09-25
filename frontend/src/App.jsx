import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import { useState } from "react";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({});

function App() {
  const [user, setUser] = useState(null);

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
          <Route
            path="/home/*"
            element={user ? <Home user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login onLogin={(u) => setUser(u)} />}
          />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
