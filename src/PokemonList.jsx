import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonList = () => {
    const [pokemonList, setPokemonList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
                const results = response.data.results;

                // Fetch additional details including image URL for each Pokemon
                const pokemonWithImages = await Promise.all(
                    results.map(async pokemon => {
                        const pokemonDetailsResponse = await axios.get(pokemon.url);
                        return {
                            name: pokemon.name,
                            image: pokemonDetailsResponse.data.sprites.front_default
                        };
                    })
                );

                setPokemonList(pokemonWithImages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <div>
            <h1>Pokemon List</h1>
            <ul>
                {pokemonList.map(pokemon => (
                    <li key={pokemon.name}>
                        <img src={pokemon.image} alt={pokemon.name} />
                        {pokemon.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PokemonList;
