import { useState, useEffect } from "react";
import "./styles/index.css";
import PokemonData from "./PokemonData";
import Modal from "./Modal"; // Import the modal component

export default function Pokemon() {
  const [allPokemons, setAllPokemons] = useState([]); // Stores 8 unique Pokémon
  const [displayedPokemons, setDisplayedPokemons] = useState([]); // Stores 5 Pokémon shown in a round
  const [selectedPokemons, setSelectedPokemons] = useState(new Set()); // Tracks selected Pokémon
  const [loading, setLoading] = useState(true);
  const [flipping, setFlipping] = useState(false);
  const [gameStatus, setGameStatus] = useState(null); // "win" or "lose" (controls modal)

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setFlipping(true);
    setTimeout(async () => {
      try {
        setLoading(true);
        
        // Fetch 8 unique Pokémon
        const uniquePokemonIds = new Set();
        while (uniquePokemonIds.size < 8) {
          uniquePokemonIds.add(randomPokemon());
        }

        const promises = [...uniquePokemonIds].map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
        );
        const results = await Promise.all(promises);

        setAllPokemons(results);
        setDisplayedPokemons(getRandomSubset(results, 5, selectedPokemons));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
      setTimeout(() => setFlipping(false), 500);
    }, 500);
  }

  function handleCardClick(pokemon) {
    setFlipping(true);
    setTimeout(async () => {
        if (selectedPokemons.has(pokemon.id)) {
            setGameStatus("lose"); // Show "You Lost" modal
            return;
        }

        const newSelectedPokemons = new Set(selectedPokemons);
        newSelectedPokemons.add(pokemon.id);
        setSelectedPokemons(newSelectedPokemons);

        if (newSelectedPokemons.size === 8) {
            setGameStatus("win"); // Show "You Won" modal
            return;
        }

        // Ensure at least one new Pokémon appears
        let newDisplayedPokemons = getRandomSubset(allPokemons, 5, newSelectedPokemons);
        setDisplayedPokemons(newDisplayedPokemons);
        setTimeout(() => setFlipping(false), 500);
    }, 500);
  }

  function resetGame() {
    setSelectedPokemons(new Set());
    setGameStatus(null); // Close modal
    fetchData();
  }

  return (
    <div className="pokemon-app">
      <h1 className="score">Selected: {selectedPokemons.size} / 8</h1>
      {loading ? (
        <h1 className="loading">Loading...</h1>
      ) : (
        <PokemonData
          pokemons={displayedPokemons}
          handleClick={handleCardClick}
          flipping={flipping}
        />
      )}

      {/* Show modal if gameStatus is "win" or "lose" */}
      {gameStatus && <Modal status={gameStatus} onPlayAgain={resetGame} />}
    </div>
  );
}

// Function to generate a random Pokémon ID (1 - 1017)
function randomPokemon() {
  return Math.floor(Math.random() * 1017) + 1;
}

// Function to get a random subset ensuring at least 1 new Pokémon is included after selecting 5
function getRandomSubset(array, size, excludeSet = new Set()) {
  let availablePokemons = array.filter((poke) => !excludeSet.has(poke.id));
  
  // If fewer than 5 new options exist, allow some selected Pokémon to appear
  if (availablePokemons.length < size) {
    availablePokemons = [...availablePokemons, ...array.filter((poke) => excludeSet.has(poke.id))];
  }

  return availablePokemons.sort(() => 0.5 - Math.random()).slice(0, size);
}
