import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ authState, setAuthState }) => {
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
    passwordCheck: ""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(20).required('Introduce el nombre de usuario (3-20 caracteres).'),
    password: Yup.string().min(5).max(20).required('Introduce la contraseña (5-20 caracteres).'),
    passwordCheck: Yup.string().oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden").required('Introduce la contraseña (5-20 caracteres).')
  });

  const onSubmit = (data) => {
    axios.post('http://localhost:3003/auth', data).then((response) => {
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
        navigate('/');
      }
    });
  };

  return (
    <div className='addTagPage'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='addPrintForm mt-5 mx-auto col-3'>
          <div className="row justify-content-center mx-auto">
            <div className='mb-3'>
              <label htmlFor='inputAddUsername' className='form-label'>
                Nombre de usuario:
              </label>
              <Field id='inputAddUsername' name='username' className='form-control col-8' />
              <ErrorMessage name='username' component='p' className='text-danger'></ErrorMessage>
            </div>
          </div>
          <div className="row justify-content-center mx-auto">
            <div className='mb-3'>
              <label htmlFor='inputAddPassword' className='form-label'>
                Contraseña:
              </label>
              <Field id='inputAddPassword' name='password' className='form-control col-8' type="password" />
              <ErrorMessage name='password' component='p' className='text-danger'></ErrorMessage>
            </div>
          </div>
          <div className="row justify-content-center mx-auto">
            <div className='mb-3'>
              <label htmlFor='inputAddPasswordCheck' className='form-label'>
                Contraseña:
              </label>
              <Field id='inputAddPasswordCheck' name='passwordCheck' className='form-control col-8' type="password" />
              <ErrorMessage name='passwordCheck' component='p' className='text-danger'></ErrorMessage>
            </div>
          </div>
          <div className='row justify-content-center'>
            <button type='submit' className='btn btn-primary col-6'>
              Registrarse
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Register