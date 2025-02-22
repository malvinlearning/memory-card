import './assets/poster-image.jpg';
import { useState } from 'react';
export default function PokemonData({pokemons, handleClick, flipping}) {
      return (
        <div className="pokemon-container">
            {pokemons.map((pokemon, index) => (
                <div
                  key={pokemon.id}
                  onClick={() => handleClick(pokemon)}
                  className={`pokemon-card borderBox ${flipping ? 'flip' : ''}`}>
                <div className="card-inner">
                  <div className="card-front">
                    <h2 className="pokemon-name">{pokemon.name}</h2>
                    <img className="pokemon-image" src={pokemon.sprites.front_default} alt={pokemon.name} />
                  </div>
                  <div className="card-back">
                  </div>
                </div>
              </div>
            ))}
        </div>
    );
}