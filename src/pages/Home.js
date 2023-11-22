import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Home = ({ authState }) => {
    const defaultTags = ["Tengo", "Quiero", "Stock A4", "Stock A5", "Twitch"];

    const [ListOfPrints, setListOfPrints] = useState([]);
    const [ListOfTags, setListOfTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Alfabetico');
    const [showOwnedOnly, setShowOwnedOnly] = useState(false);
    const [showWantedOnly, setShowWantedOnly] = useState(false);
    const [printsOwned, setPrintsOwned] = useState([]);
    const [printsWanted, setPrintsWanted] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3003/prints').then((response) => {
            setListOfPrints(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3003/tags').then((response) => {
            setListOfTags(response.data);
        });
    }, []);

    useEffect(() => {
        if (authState && authState.id) {
            axios.get(`http://localhost:3003/userprints/owned/${authState.id}`)
                .then((response) => {
                    if (response.data !== "") {
                        const ids = response.data.map(print => print.id);
                        setPrintsOwned(ids);
                    }
                })
                .catch((error) => {
                    console.error('Error obteniendo prints:', error);
                });
        }
    }, [authState]);

    useEffect(() => {
        if (authState && authState.id) {
            axios.get(`http://localhost:3003/userprints/wanted/${authState.id}`)
                .then((response) => {
                    if (response.data !== "") {
                        const ids = response.data.map(print => print.id);
                        setPrintsWanted(ids);
                    }
                })
                .catch((error) => {
                    console.error('Error obteniendo prints:', error);
                });
        }
    }, [authState]);

    const handleTagClick = (tag) => {
        if (tag === 'Tengo') {
            setShowOwnedOnly(!showOwnedOnly);
        } else if (tag === 'Quiero') {
            setShowWantedOnly(!showWantedOnly);
        } else {
            if (selectedTags.includes(tag)) {
                setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
            } else {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const sortedPrints = () => {
        switch (sortOption) {
            case 'Alfabetico':
                return ListOfPrints.sort((a, b) => a.name.localeCompare(b.name));
            case 'AlfabeticoInverso':
                return ListOfPrints.sort((a, b) => b.name.localeCompare(a.name));
            case 'TagAlfabetico':
                return ListOfPrints.sort((a, b) => {
                    const tagA = a.tags.length > 0 ? a.tags[0] : '';
                    const tagB = b.tags.length > 0 ? b.tags[0] : '';
                    const tagComparison = tagA.localeCompare(tagB);
                    if (tagComparison !== 0) {
                        return tagComparison;
                    }
                    return a.name.localeCompare(b.name);
                });
            // case 'TagAlfabeticoInverso':
            //     return ListOfPrints.sort((a, b) => {
            //         const tagA = a.tags.length > 0 ? a.tags[0] : '';
            //         const tagB = b.tags.length > 0 ? b.tags[0] : '';
            //         const tagComparison = tagB.localeCompare(tagA);
            //         if (tagComparison !== 0) {
            //             return tagComparison;
            //         }
            //         return a.name.localeCompare(b.name);
            //     });
            default:
                return ListOfPrints;
        }
    };

    const filteredPrints = sortedPrints().filter((print) => {
        const tengoMatch = showOwnedOnly ? printsOwned.includes(print.id) : true;
        const quieroMatch = showWantedOnly ? printsWanted.includes(print.id) : true;
        const tagsMatch = selectedTags.length === 0 || selectedTags.every((selectedTag) => print.tags.includes(selectedTag));
        const nameMatch = print.name.toLowerCase().includes(searchTerm.toLowerCase());

        return tengoMatch && quieroMatch && tagsMatch && nameMatch;
    });

    const handlePrintOwnership = (printId) => {
        const updatedOwnedPrints = printsOwned.includes(printId)
            ? printsOwned.filter((id) => id !== printId)
            : [...printsOwned, printId];

        setPrintsOwned(updatedOwnedPrints);

        axios.put(`http://localhost:3003/userprints/updateOwned/${authState.id}`, {
            printsOwned: updatedOwnedPrints
        })
            .then((response) => {
                console.log('Base de datos actualizada correctamente');
            })
            .catch((error) => {
                console.error('Error al actualizar la base de datos:', error);
            });
    };

    const handlePrintWanted = (printId) => {
        const updatedWantedPrints = printsWanted.includes(printId)
            ? printsWanted.filter((id) => id !== printId)
            : [...printsWanted, printId];

        setPrintsWanted(updatedWantedPrints);

        axios.put(`http://localhost:3003/userprints/updateWanted/${authState.id}`, {
            printsWanted: updatedWantedPrints
        })
            .then((response) => {
                console.log('Base de datos actualizada correctamente');
            })
            .catch((error) => {
                console.error('Error al actualizar la base de datos:', error);
            });
    };

    return (
        <div className='container-fluid mainHome'>
            <div className='row'>
                <div className='col-md-2 sideBar text-light d-flex flex-column justify-content-top'>
                    <div className='sortDropdown my-3'>
                        <label htmlFor='sortSelect' className='form-label text-light me-2'>
                            Ordenar por:
                        </label>
                        <select
                            id='sortSelect'
                            className='form-select'
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value='Alfabetico'>Alfabético</option>
                            <option value='AlfabeticoInverso'>Alfabético Inverso</option>
                            <option value='TagAlfabetico'>Tag Alfabético</option>
                            {/* <option value='TagAlfabeticoInverso'>Tag Alfabético Inverso</option> */}
                        </select>
                    </div>
                    <div className='searchBar mt-3'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Buscar por nombre...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='defaultTagsList my-5'>
                        <ul className='list-group'>
                            {defaultTags.map((value, key) => (
                                <li key={key} className='list-group-item bg-dark text-light'>
                                    <label className='form-check-label'>
                                        <input
                                            type='checkbox'
                                            className='form-check-input me-2'
                                            value={value}
                                            checked={(value === 'Tengo' && showOwnedOnly)
                                                || (value === 'Quiero' && showWantedOnly)
                                                // || (value === 'Sin stock' && showNoStockOnly)
                                                || selectedTags.includes(value)}
                                            onChange={() => handleTagClick(value)}
                                        />
                                        {value}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='tagsList'>
                        <ul className='list-group'>
                            {ListOfTags.sort((a, b) => a.tag_name.localeCompare(b.tag_name)).map((value, key) => (
                                <li key={key} className='list-group-item bg-dark text-light'>
                                    <label className='form-check-label'>
                                        <input
                                            type='checkbox'
                                            className='form-check-input me-2'
                                            value={value.tag_name}
                                            checked={selectedTags.includes(value.tag_name)}
                                            onChange={() => handleTagClick(value.tag_name)}
                                        />
                                        {value.tag_name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='col-md-10 prints mt-3'>
                    <div className='row'>
                        {filteredPrints.map((value, key) => (
                            <div className='col-md-4 print mb-4 d-flex flex-column align-items-center' key={key}>
                                <a href={value.imageURL}>
                                    <img src={value.imageURL} alt='Descripción de la imagen' className='img-fluid' />
                                </a>
                                <div className='row'>
                                    <div className='col-3 mt-1 print'>
                                        {authState.status && (
                                            <>
                                                <div>
                                                    <label>
                                                        <div className="con-like">
                                                            <input className="like"
                                                                type="checkbox"
                                                                title="like"
                                                                checked={printsOwned.includes(value.id)}
                                                                onChange={() => handlePrintOwnership(value.id)}
                                                            />
                                                            <div className="checkmark">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="outline" viewBox="0 0 24 24">
                                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                                                                </svg>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="filled" viewBox="0 0 24 24">
                                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                                                </svg>
                                                                <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" className="celebrate">
                                                                    <polygon className="poly" points="10,10 20,20"></polygon>
                                                                    <polygon className="poly" points="10,50 20,50"></polygon>
                                                                    <polygon className="poly" points="20,80 30,70"></polygon>
                                                                    <polygon className="poly" points="90,10 80,20"></polygon>
                                                                    <polygon className="poly" points="90,50 80,50"></polygon>
                                                                    <polygon className="poly" points="80,80 70,70"></polygon>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className='col-6 print printName text-center align-items-center d-flex flex-column justify-content-center'>
                                        {value.name}
                                    </div>
                                    <div className='col-3 mt-1 print'>
                                        {authState.status && (
                                            <>
                                                <div>
                                                    <label className="ui-bookmark">
                                                        <input type="checkbox"
                                                            checked={printsWanted.includes(value.id)}
                                                            onChange={() => handlePrintWanted(value.id)} />
                                                        <div className="bookmark">
                                                            <svg viewBox="0 0 32 32">
                                                                <g>
                                                                    <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;