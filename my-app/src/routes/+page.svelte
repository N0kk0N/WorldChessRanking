<script>
  import Overlay from "../components/overlay.svelte"; // Ensure the path is correct
  import Map from "../components/map.svelte";
  import { writable } from 'svelte/store'; // Import writable for store

  let dataset = []; // Variable for the map data
  let isTotalScore = true; // Variable to toggle between total score and average score per 1000 inhabitants

  // Create a writable store for overlay visibility
  let overlayVisible = writable(true);

  // Function to toggle the score criteria
  function toggleScore() {
    isTotalScore = !isTotalScore; // Toggle between total score and average score
  }

  // Function to reopen the overlay
  function openOverlay() {
    overlayVisible.set(true); // Set overlay visibility to true
  }

  // Fetch the GeoJSON data
  async function fetchGeoData() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
      const data = await response.json();
      dataset = data.features; // Populate the dataset with GeoJSON features
    } catch (error) {
      console.error("Error loading data:", error); // Log any errors when fetching data
    }
  }

  // Fetch the GeoJSON data when the component is mounted
  import { onMount } from 'svelte';
  onMount(() => {
    fetchGeoData(); // Load the GeoJSON data when the component mounts
  });
</script>

<svelte:head>
  <!-- Link to external fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</svelte:head>

<h1 class="title">World Chess Ranking</h1>

<!-- Overlay Component -->
<Overlay {overlayVisible} />

<!-- Toggle Button for Score Criteria -->
<div class="button-container">
  <button 
    on:click={toggleScore} 
    aria-label={isTotalScore ? "Switch to average score per 1000 inhabitants" : "Switch to total score"}>
    {isTotalScore ? "Total score" : "Average score per 1000 inhabitants"}
  </button>
</div>

<!-- Map Component -->
<Map {dataset} {isTotalScore} />

<!-- Info Button to Reopen Overlay -->
<button class="infoButton" 
  on:click={openOverlay}
  aria-label="Reopen overlay">
  &#x24D8;
</button>

<style>
  :global(body) {
    background-color: #0d1b2a; /* Dark background color */
    color: white;
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Prevent horizontal scrolling */
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
    background-color: #f0a500; /* Orange button color */
    border: none;
    border-radius: 5px;
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    transition: background-color 0.3s ease; /* Fade effect on hover */
  }

  .button-container button:hover {
    background-color: #d18d00; /* Darker shade on hover */
  }

  .infoButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #f0a500; /* Orange circle for info button */
    border: none;
    width: 40px;
    height: 40px;
    font-size: 2rem;
    color: #ffffff;
    border-radius: 50%; /* Make it circular */
    cursor: pointer;
    transition: background-color 0.3s ease;
    z-index: 10; /* Ensure the button is on top */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .infoButton:hover {
    background-color: #d18d00; /* Darker shade on hover */
  }
</style>
