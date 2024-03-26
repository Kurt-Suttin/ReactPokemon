import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './modal.css';

const PokemonModal = ({ pokemon, onClose }) => {
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
                const data = response.data;
                setPokemonDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };

        fetchPokemonDetails();
    }, [pokemon.id]);

    const handleClose = () => {
        onClose(); // Call onClose function passed from parent component to close the modal
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            // If the click occurred on the overlay itself (not its children), close the modal
            handleClose();
        }
    };

    let moveNames = [];
    if (pokemonDetails) {
        moveNames = pokemonDetails.moves.slice(0, 8).map(move => move.move.name);
    }

    // Divide the move names into two separate arrays for left and right columns
    const midIndex = Math.ceil(moveNames.length / 2);
    const leftMoves = moveNames.slice(0, midIndex);
    const rightMoves = moveNames.slice(midIndex);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
                <span className="close" onClick={handleClose}>&times;</span>
                <div className="modal-content">
                    {loading ? (
                        <p>Loading Pokémon details...</p>
                    ) : (
                        <>
                            <h2 className={"modal-name"}>{pokemonDetails.name}</h2>
                            {/*<p>ID: {pokemon.id}</p>*/}
                            <img className={"modal-pokemon-image"} src={pokemon.image} alt={pokemon.name} />
                            <h4>Moves:</h4>
                            <div className="table-container">
                                <table>
                                    <tbody className={"movesList"}>
                                    {leftMoves.map((moveName, index) => (
                                        <tr key={index}>
                                            <td className={"leftMoves"}>{moveName}</td>
                                            <td className={"rightMoves"}>{rightMoves[index]}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <h4>Abilities:</h4>
                            <div className="table-container">
                                <table>
                                    <tbody>
                                    {pokemonDetails.abilities.map((ability, index) => (
                                        <tr key={index}>
                                            <td className={"movesList"}>{ability.ability.name}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Add other necessary details about the Pokémon */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PokemonModal;
