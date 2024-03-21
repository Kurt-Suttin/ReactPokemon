import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonModal from './PokemonModal'; // Import the modal component
import './index.css';

const PokemonList = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${(currentPage - 1) * 9}&limit=9`);
                const results = response.data.results;

                const pokemonWithImages = await Promise.all(
                    results.map(async pokemon => {
                        const pokemonDetailsResponse = await axios.get(pokemon.url);
                        return {
                            name: pokemon.name,
                            image: pokemonDetailsResponse.data.sprites.front_default,
                        };
                    })
                );

                setPokemonList(pokemonWithImages);
                setTotalPages(Math.ceil(response.data.count / 9));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage]);

    const openModal = (pokemon) => {
        setSelectedPokemon(pokemon);
    };

    const closeModal = () => {
        setSelectedPokemon(null);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <div className={"background"}>
                <div className={"pokemon-list"}>
                    <div className={"text-align-center"}>
                        <h1>Pokemon List</h1>
                    </div>
                    <div className="grid-container">
                        {pokemonList.map(pokemon => (
                            <div key={pokemon.name} className={"pokemon-card"} onClick={() => openModal(pokemon)}>
                                <img className={"pokemon-img"} src={pokemon.image} alt={pokemon.name}/>
                                <p className={"pokemon-name"}>{pokemon.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <p className={"page-number"}>{currentPage}</p>
                        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>
            </div>
            {selectedPokemon && (
                <PokemonModal pokemon={selectedPokemon} onClose={closeModal}/>
            )}
        </>
    );
};

export default PokemonList;
