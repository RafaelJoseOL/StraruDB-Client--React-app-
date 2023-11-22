import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from "react-router-dom";

const EditPrint = ({ authState }) => {
    let navigate = useNavigate();
    const [prints, setPrints] = useState([]);
    const [tags, setListOfTags] = useState([]);
    const [selectedPrint, setSelectedPrint] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3003/prints');
                setPrints(response.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3003/tags').then((response) => {
            setListOfTags(response.data);
        });
    }, []);

    const updateSelectedPrint = (printData) => {
        const selectedId = printData.target.value;
        const selectedPrint = prints.find((print) => print.id === Number(selectedId));

        setSelectedPrint(selectedPrint);

        if (selectedPrint) {
            initialValues.name = selectedPrint.name;
            initialValues.imageURL = selectedPrint.imageURL;
            initialValues.tags = selectedPrint.tags || [];
        } else {
            initialValues.name = '';
            initialValues.imageURL = '';
            initialValues.tags = [];
        }
    };

    const handleSaveClick = async (values) => {
        try {
            if (selectedPrint) {
                await axios.put(`http://localhost:3003/prints/${selectedPrint.id}`, values);
                setSelectedPrint(null);
                alert("Cambios guardados.");
                navigate("/");
            }
        } catch (error) {
            console.error('Error al guardar cambios:', error);
        }
    };

    const initialValues = {
        name: selectedPrint ? selectedPrint.name : '',
        imageURL: selectedPrint ? selectedPrint.imageURL : '',
        tags: selectedPrint ? selectedPrint.tags || [] : [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Introduce el nombre de la impresión.'),
        imageURL: Yup.string().required('Introduce la URL de la imagen.'),
    });

    return (
        <div className='editPrintPage'>
            {authState.admin ? (
                <>
                    <div className='printsSelect d-flex justify-content-center mt-4'>
                        <label htmlFor="printSelect" className='mx-3'>Selecciona una lámina:</label>
                        <select id="printSelect" onChange={(e) => updateSelectedPrint(e)}>
                            <option value="">Elige una</option>
                            {prints.map((print) => (
                                <option key={print.id} value={print.id}>
                                    {`${print.id} - ${print.name}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedPrint && (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => handleSaveClick(values)}
                            enableReinitialize
                        >
                            <Form className='form-container printDetails d-flex flex-column justify-content-center mt-4 mx-auto'>
                                <div className='row mt-3 mx-auto'>
                                    <label htmlFor="nameInput" className='form-label text-center'>Nombre</label>
                                    <Field type="text" id="nameInput" name="name" className="form-control" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>
                                <div className='row mt-3 mx-auto'>
                                    <label htmlFor="imageURLInput" className='form-label text-center'>URL de la imagen</label>
                                    <Field type="text" id="imageURLInput" name="imageURL" className="form-control" />
                                    <ErrorMessage name="imageURL" component="div" className="error" />
                                </div>
                                <div className='row mt-3 mx-auto'>
                                    <label className='form-label'>Tags de la lámina:</label>
                                    <div id='checkbox-group' className='d-flex flex-wrap mt-3'>
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
                                        {tags.sort((a, b) => a.tag_name.localeCompare(b.tag_name)).map((tag) => (
                                            <div key={tag.id} className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={tag.tag_name} className='form-check-input' />
                                                <label className='form-check-label'>{tag.tag_name}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name='tags' component='p' className='text-danger'></ErrorMessage>
                                </div>
                                <div className='mt-3 mx-auto'>
                                    <button type="submit">Guardar</button>
                                </div>
                            </Form>
                        </Formik>
                    )}
                </>
            ) : (
                <div className='d-flex flex-column'>
                    <h1 className='mx-auto mt-4'>Page Not Found</h1>
                    <h3 className='mx-auto mt-4'><Link to="/">Inicio</Link></h3>
                </div>
            )}
        </div>
    );
};

export default EditPrint;
