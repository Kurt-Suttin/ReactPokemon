// PokemonModal.js
import React from 'react';
import './index.css';
import './modal.css'

const PokemonModal = ({ pokemon, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2 className={"modal-name"}>{pokemon.name}</h2>
                    <img className={"modal-pokemon-image"} src={pokemon.image} alt={pokemon.name} />
                    {/* Add other details about the Pokémon */}
                </div>
            </div>
        </div>
    );
};

export default PokemonModal;
