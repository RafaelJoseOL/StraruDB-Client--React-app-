import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from "axios";
import Home from './pages/Home';
import NewPrint from './pages/NewPrint';
import NewTag from './pages/NewTag';
import Register from './pages/Register';
import EditPrint from './pages/EditPrint';
import PageNotFound from './pages/PageNotFound';
import { useEffect, useState } from 'react';
import { AuthContext } from "./helpers/AuthContext";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    admin: false,
    status: false
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3003/auth/authToken", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            admin: response.data.admin,
            status: true
          });
        }
      })
  }, [authState && authState.id]);

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3003/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          admin: response.data.admin,
          status: true
        });
      }
    });
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      admin: false,
      status: false
    });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand navbarItem ms-4">Inicio</Link>
              <button className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse bg-dark" id="navbarSupportedContent">
                {authState.admin && (
                  <>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item active my-auto mx-3">
                        <Link to="/newprint" className="navbarItem">
                          Añadir print
                        </Link>
                      </li>
                      <li className="nav-item active my-auto mx-3">
                        <Link to="/newtag" className="navbarItem">
                          Añadir etiqueta
                        </Link>
                      </li>
                      <li className="nav-item active my-auto mx-3">
                        <Link to="/editprint" className="navbarItem">
                          Editar prints
                        </Link>
                      </li>
                    </ul>
                  </>
                )}
                {authState.status ? (
                  <div className="d-flex">
                    <p className="my-auto mx-3">¡Hola, {authState.username}!</p>
                    <button type="button" className="btn btn-outline-primary me-4" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <form className="d-flex ms-auto me-4 navBarForm">
                    <div className='row'>
                      <input
                        type="text"
                        className="col-8 col-md-3 ms-auto ms-md-2 my-2"
                        placeholder="Usuario"
                        aria-label="Usuario"
                        onChange={(event) => {
                          setUsername(event.target.value);
                        }}
                      />
                      <input
                        type="password"
                        className="col-8 col-md-3 ms-auto my-2 ms-md-2 my-2"
                        placeholder="Contraseña"
                        aria-label="Contraseña"
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary col-8 col-md-3 ms-auto ms-md-2 my-2"
                        onClick={login}
                      >
                        Iniciar sesión
                      </button>
                      <Link
                        to="/register"
                        className="btn btn-outline-primary col-8 col-md-2 ms-auto ms-md-2 my-2"
                      >
                        Registrarse
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home authState={authState} setAuthState={setAuthState} />} />
            <Route path="/newprint" element={<NewPrint authState={authState} setAuthState={setAuthState} />} />
            <Route path="/newtag" element={<NewTag authState={authState} setAuthState={setAuthState} />} />
            <Route path="/register" element={<Register authState={authState} setAuthState={setAuthState} />} />
            <Route path="/editprint" element={<EditPrint authState={authState} setAuthState={setAuthState} />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
