<script>
  import Overlay from "../components/overlay.svelte"; // Zorg ervoor dat het pad klopt
  import Map from "../components/map.svelte";
  import { writable } from 'svelte/store'; // Import writable voor store

  let dataset = []; // Variabele voor de map data
  let isTotalScore = true; // Variabele om tussen totale score en gemiddelde score per 1000 inwoners te schakelen

  // Maak een writable store voor overlay zichtbaarheid
  let overlayVisible = writable(true);

  // Functie om het scorecriterium om te schakelen
  function toggleScore() {
    isTotalScore = !isTotalScore; // Wissel tussen totale score en gemiddelde score
  }

  // Functie om de overlay weer te openen
  function openOverlay() {
    overlayVisible.set(true); // Zet overlay zichtbaarheid naar true
  }

  // Haal de GeoJSON data op
  async function fetchGeoData() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
      const data = await response.json();
      dataset = data.features; // Vul de dataset met GeoJSON features
    } catch (error) {
      console.error("Error loading data:", error); // Log eventuele fouten tijdens het ophalen van data
    }
  }

  // Haal de GeoJSON data op wanneer de component geladen wordt
  import { onMount } from 'svelte';
  onMount(() => {
    fetchGeoData(); // Laad de GeoJSON data bij het monteren van de component
  });
</script>

<svelte:head>
  <!-- Link naar externe fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</svelte:head>

<h1 class="title">World Chess Ranking</h1>

<!-- Overlay Component -->
<Overlay {overlayVisible} />

<!-- Toggle Button voor Score Criteria -->
<div class="button-container">
  <button 
    on:click={toggleScore} 
    aria-label={isTotalScore ? "Switch to average score per 1000 inhabitants" : "Switch to total score"}>
    {isTotalScore ? "Total score" : "Average score per 1000 inhabitants"}
  </button>
</div>

<!-- Map Component -->
<Map {dataset} {isTotalScore} />

<!-- Info Button om Overlay te heropenen -->
<button class="infoButton" 
  on:click={openOverlay}
  aria-label="Reopen overlay">
  &#x24D8;
</button>

<style>
  :global(body) {
    background-color: #0d1b2a; /* Donkere achtergrondkleur */
    color: white;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Voorkom horizontaal scrollen */
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
    margin-top: 20px;
  }

  .button-container button {
    padding: 5px 10px;
    font-size: 1rem;
    cursor: pointer;
    background-color: #f0a500; /* Oranje knop kleur */
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    transition: background-color 0.3s ease; /* Vervagen op hover */
  }

  .button-container button:hover {
    background-color: #d18d00; /* Donkere schaduw bij hover */
  }

  .infoButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f0a500; /* Oranje cirkel voor info-knop */
    border: none;
    width: 40px;
    height: 40px;
    font-size: 2rem;
    color: #ffffff;
    border-radius: 50%; /* Maak het cirkelvormig */
    cursor: pointer;
    transition: background-color 0.3s ease;
    z-index: 10; /* Zorg ervoor dat de knop bovenop ligt */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .infoButton:hover {
    background-color: #d18d00; /* Donkere schaduw bij hover */
  }
</style>
