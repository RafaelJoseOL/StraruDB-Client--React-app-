import React from 'react'
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className='d-flex flex-column'>
      <h1 className='mx-auto mt-4'>Página no encontrada</h1>
      <h3 className='mx-auto mt-4'><Link to="/">Inicio</Link></h3>


      <form className="d-flex">
        <div className='row'>
          <input
            type="text"
            className="col-6 col-md-3"
            placeholder="Usuario"
            aria-label="Usuario"
          />
          <input
            type="password"
            className="col-6 col-md-3"
            placeholder="Contraseña"
            aria-label="Contraseña"
          />
          <button
            type="button"
            className="col-6 col-md-3"
          >
            Iniciar sesión
          </button>
          <Link
            to="/register"
            className="col-6 col-md-3"
          >
            Registrarse
          </Link>
        </div>
      </form>
    </div>
  )
}

export default PageNotFound