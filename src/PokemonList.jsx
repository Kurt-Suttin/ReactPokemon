import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonModal from './PokemonModal'; // Import the modal component
import './index.css';

const PokemonList = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=999`);
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
                setTotalPages(Math.ceil(pokemonWithImages.length / 9));
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(pokemonList.length / 9));
    }, [pokemonList]);

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

    const firstPage = () => {
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page when a new search query is entered
    };

    const filteredPokemonList = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedPokemonList = filteredPokemonList.slice((currentPage - 1) * 9, currentPage * 9);

    return (
        <>
            <div className={"background"}>
                <div className={"pokemon-list"}>
                    <div className={"text-align-center"}>
                        <h1>Pokemon List</h1>
                        <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search Pokémon by name" className={"search-bar"}/>
                    </div>
                    {loading ? ( // Check loading state
                        <div className="loading-message">Loading Pokémon data...</div>
                    ) : (
                        <div className="grid-container">
                            {paginatedPokemonList.map(pokemon => (
                                <div key={pokemon.name} className={"pokemon-card"} onClick={() => openModal(pokemon)}>
                                    <img className={"pokemon-img"} src={pokemon.image} alt={pokemon.name}/>
                                    <p className={"pokemon-name"}>{pokemon.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {searchQuery === '' && (
                        <div className="pagination">
                            <p className={"page-number"}>{currentPage}</p>
                            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                            <button onClick={firstPage} disabled={currentPage === 1}>First Page</button>
                            <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    )}
                </div>
            </div>
            {selectedPokemon && (
                <PokemonModal pokemon={selectedPokemon} onClose={closeModal}/>
            )}
        </>
    );
};

export default PokemonList;
