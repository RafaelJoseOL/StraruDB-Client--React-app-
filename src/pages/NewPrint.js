import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewPrint = ({ authState }) => {
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3003/tags').then((response) => {
            setAvailableTags(response.data);
        });
    }, []);

    const initialValues = {
        name: '',
        imageURL: '',
        tags: [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3).max(50).required('Introduce el nombre de la lámina.'),
        imageURL: Yup.string().required('Introduce una URL correcta.'),
        tags: Yup.array().min(1, 'Selecciona al menos una etiqueta.').of(Yup.string().required()).required(),
    });

    const onSubmit = (data) => {
        axios.post('http://localhost:3003/prints', data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                alert("Print añadida");
            }
        });
    };

    return (
        <div className='addPrintPage'>
            {authState.admin ? (
                <>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form className='form-container addPrintForm mt-5 mx-auto col-3'>
                            <div className="row justify-content-center mx-auto">
                                <div className='mb-3'>
                                    <label htmlFor='inputAddPrintName' className='form-label'>
                                        Nombre:
                                    </label>
                                    <Field id='inputAddPrintName' name='name' className='form-control col-8' placeholder='Ex. Mikasa...' />
                                    <ErrorMessage name='name' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center mx-auto'>
                                <div className='mb-3'>
                                    <label htmlFor='inputAddPrintURL' className='form-label'>
                                        URL de la imagen:
                                    </label>
                                    <Field id='inputAddPrintURL' name='imageURL' className='form-control' />
                                    <ErrorMessage name='imageURL' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center mx-auto'>
                                <div className='mb-3'>
                                    <label className='form-label d-flex justify-content-center'>Tags de la lámina:</label>
                                    <div id='checkbox-group' className='d-flex flex-wrap'>
                                        <div className='mx-auto defaultTags'>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Stock A4"} className='form-check-input' />
                                                <label className='form-check-label'>{"Stock A4"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Stock A5"} className='form-check-input' />
                                                <label className='form-check-label'>{"Stock A5"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Twitch"} className='form-check-input' />
                                                <label className='form-check-label'>{"Twitch"}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='checkbox-group' className='d-flex flex-wrap mt-3'>
                                        {availableTags.sort((a, b) => a.tag_name.localeCompare(b.tag_name)).map((tag) => (
                                            <div key={tag.id} className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={tag.tag_name} className='form-check-input' />
                                                <label className='form-check-label'>{tag.tag_name}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name='tags' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <button type='submit' className='btn btn-primary col-6'>
                                    Añadir print
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </>
            ) : (
                <div className='d-flex flex-column'>
                    <h1 className='mx-auto mt-4'>Page Not Found</h1>
                    <h3 className='mx-auto mt-4'><Link to="/">Inicio</Link></h3>
                </div>
            )}
        </div>
    );
}

export default NewPrint;
