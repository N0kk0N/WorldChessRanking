<script>
  import Overlay from "../components/overlay.svelte"; // Zorg ervoor dat de path klopt
  import Map from "../components/map.svelte";
  import { json } from "d3";
  import ToggleLeaderboard from "../components/toggleLeaderboard.svelte";
  import { writable } from 'svelte/store'; // Importeer writable

  let dataset = [];
  let isTotalScore = false; // Variabele om tussen criteria te wisselen
  let showLeaderboard = false; // Variabele om het leaderboard te tonen/verbergen
  let showMenu = false; // Variabele om het menu te tonen/verbergen

  // Maak de overlay store
  let overlayVisible = writable(true);

  // Functie om de scorecriteria te wisselen
  function toggleScore() {
    isTotalScore = !isTotalScore;
  }

  // Functie om het leaderboard te toggelen
  function toggleLeaderboard() {
    showLeaderboard = !showLeaderboard;
  }

  // Functie om de overlay opnieuw te openen
  function openOverlay() {
    overlayVisible.set(true); // Zet de overlay zichtbaar
  }

  // Data ophalen voor de kaart
  json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then((data) => {
      dataset = data.features;
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</svelte:head>

<h1 class="title">World Chess Ranking</h1>

<!-- Overlay -->
<Overlay {overlayVisible} />

<!-- Toggle Buttons -->
<div class="button-container">
  <button 
    on:click={toggleScore} 
    aria-label={isTotalScore ? "Switch to average score per 1000 inhabitants" : "Switch to total score"}>
    {isTotalScore ? "Total score" : "Average score per 1000 inhabitants"}
  </button>
  <button 
    on:click={toggleLeaderboard} 
    aria-label="Toggle leaderboard visibility">
    {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
  </button>
</div>

<!-- Kaart -->
<Map {dataset} {isTotalScore} />

<!-- Leaderboard -->
<ToggleLeaderboard {showLeaderboard} {toggleLeaderboard} />

<!-- Info Button -->
<button class="infoButton" 
  on:click={openOverlay}
  aria-label="Reopen overlay">
  &#x24D8;
</button>

<style>
  :global(body) {
    background-color: #0d1b2a;
    color: white;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Voorkomt horizontaal scrollen */
    overflow-y: hidden;
  }

  .title {
    text-align: center;
    font-size: 2.5rem;
    margin-top: 20px;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  .button-container button {
    padding: 5px 10px;
    font-size: 1rem;
    cursor: pointer;
    background-color: #f0a500;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }

  .button-container button:hover {
    background-color: #d18d00;
  }

  .infoButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f0a500;
    border: none;
    width: 40px;
    height: 40px;
    font-size: 2rem;
    color: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .infoButton:hover {
    background-color: #d18d00;
  }
</style>
