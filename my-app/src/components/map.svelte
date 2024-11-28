<script>
  import { geoPath, geoNaturalEarth1, scaleSequential, interpolatePurples } from "d3";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  // Props to pass in data and state for the leaderboard type
  export let dataset = [];
  export let isTotalScore = false;
  let countryData = {}; // Holds the country-related data
  let svgWidth, svgHeight; // Holds the SVG dimensions
  let tooltip = { visible: false, text: '', x: 0, y: 0 }; // Tooltip state
  let isMenuOpen = false; // State for the menu visibility
  let activeLeaderboard = "daily"; // Keeps track of the active leaderboard

  const projection = geoNaturalEarth1(); // Set up the map projection
  const path = geoPath(projection); // Path generator for map data

  const topColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Colors for top 3 countries
  let topCountries = []; // Holds top 3 countries by rank
  let colorScale; // Color scale for country shading
  let sortedCountries = []; // Sorted list of country names based on leaderboard data

  let fetchLeaderboardData; // Function for fetching leaderboard data

  // Dynamically load leaderboard module based on type (using if-else)
  async function loadLeaderboardModule(type) {
    if (type === "daily") {
      const module = await import("../utils/fetchDailyLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "daily960") {
      const module = await import("../utils/fetchDaily960Leaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveRapid") {
      const module = await import("../utils/fetchLiveRapidLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveBlitz") {
      const module = await import("../utils/fetchLiveBlitzLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveBullet") {
      const module = await import("../utils/fetchLiveBulletLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveBughouse") {
      const module = await import("../utils/fetchLiveBughouseLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveBlitz960") {
      const module = await import("../utils/fetchLiveBlitz960Leaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveThreecheck") {
      const module = await import("../utils/fetchLiveThreecheckLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "liveCrazyhouse") {
      const module = await import("../utils/fetchLiveCrazyhouseLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    }
  }

  // Fetch and update leaderboard data
  async function fetchAndUpdateData() {
    if (!fetchLeaderboardData) return;

    const data = await fetchLeaderboardData();
    countryData = data.countryData;

    sortedCountries = Object.entries(countryData)
      .sort((a, b) => isTotalScore
        ? b[1].totalScore - a[1].totalScore
        : b[1].scorePerPop - a[1].scorePerPop
      )
      .map(([countryName]) => countryName);

    topCountries = sortedCountries.slice(0, 3); // Extract top 3 countries
    colorScale = scaleSequential(interpolatePurples)
      .domain([sortedCountries.length, 4]); // Create color scale based on ranking
  }

  // On mount, set up projection and fetch initial leaderboard data
  onMount(async () => {
    svgWidth = window.innerWidth;
    svgHeight = window.innerHeight;

    const scaleFactor = Math.min(svgWidth, svgHeight) / 3;
    projection
      .scale(scaleFactor)
      .translate([svgWidth / 2, svgHeight / 2]);

    await loadLeaderboardModule("daily"); // Load default leaderboard module
    await fetchAndUpdateData(); // Fetch and update data
  });

  // Reactively fetch new data when leaderboard type changes
  $: if (isTotalScore !== undefined) {
    fetchAndUpdateData();
  }

  // Get the rank of a country based on the sorted list
  function getRank(countryName) {
    const rank = sortedCountries.indexOf(countryName) + 1;
    return rank;
  }

  // Show the tooltip with country data when hovering over a country
  function showTooltip(event, countryName) {
    if (sortedCountries.includes(countryName)) {
      const count = countryData[countryName]?.count || 0;
      const scorePerPop = (countryData[countryName]?.scorePerPop * 1000 || 0).toFixed(2);
      const totalScore = countryData[countryName]?.totalScore || 0;
      const rank = getRank(countryName);
      tooltip = {
        visible: true,
        text: `${countryName} (Rank: ${rank}): ${isTotalScore ? `Total score: ${totalScore}` : `Average score per 1000 inhabitants: ${scorePerPop}`}`,
        x: event.pageX,
        y: event.pageY
      };
    }
  }

  // Hide the tooltip when the mouse moves away
  function hideTooltip() {
    tooltip = { visible: false, text: '', x: 0, y: 0 };
  }

  // Switch the leaderboard type and update the data accordingly
  async function switchLeaderboardType(type) {
    await loadLeaderboardModule(type);
    await fetchAndUpdateData();
    activeLeaderboard = type; // Update the active leaderboard type
  }

  // Toggle the menu visibility
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<div class="menu-container">
  <button class="menu-button" on:click={toggleMenu}>Categories</button>

  {#if isMenuOpen}
    <div class="menu" transition:slide>
      <button 
        class="{activeLeaderboard === 'daily' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("daily")}>
        Daily
      </button>
      <button 
        class="{activeLeaderboard === 'daily960' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("daily960")}>
        Daily960
      </button>
      <button 
        class="{activeLeaderboard === 'liveRapid' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveRapid")}>
        Rapid
      </button>
      <button 
        class="{activeLeaderboard === 'liveBlitz' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBlitz")}>
        Blitz
      </button>
      <button 
        class="{activeLeaderboard === 'liveBullet' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBullet")}>
        Bullet
      </button>
      <button 
        class="{activeLeaderboard === 'liveBughouse' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBughouse")}>
        Bughouse
      </button>
      <button 
        class="{activeLeaderboard === 'liveBlitz960' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBlitz960")}>
       Blitz960
      </button>
      <button 
        class="{activeLeaderboard === 'liveThreecheck' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveThreecheck")}>
        Threecheck
      </button>
      <button 
        class="{activeLeaderboard === 'liveCrazyhouse' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveCrazyhouse")}>
        Crazyhouse
      </button>
    </div>
  {/if}
</div>

<svg width="100%" height="100%" viewBox="0 0 {svgWidth} {svgHeight}">
  {#each dataset as data}
    {#if data.properties.name !== 'Antarctica'}
      <path
        d={path(data)}
        fill={
          topCountries.includes(data.properties.name)
            ? topColors[topCountries.indexOf(data.properties.name)]
            : countryData[data.properties.name]
            ? colorScale(
                Object.keys(countryData)
                  .sort((a, b) =>
                    isTotalScore
                      ? countryData[b].totalScore - countryData[a].totalScore
                      : countryData[b].scorePerPop - countryData[a].scorePerPop
                  )
                  .indexOf(data.properties.name) + 1
              )
            : 'rgba(255, 255, 255, .1)'
        }
        stroke="black"
        stroke-width="0.5"
        on:mouseover={(event) => showTooltip(event, data.properties.name)}
        on:mouseout={hideTooltip}
      />
    {/if}
  {/each}
</svg>

{#if tooltip.visible}
  <div 
    class="tooltip" 
    style="position: absolute; top: {tooltip.y}px; left: {tooltip.x}px; pointer-events: none; background-color: rgba(0,0,0,0.7); color: white; padding: 5px; border-radius: 5px;">
    {tooltip.text}
  </div>
{/if}

<div class="legend" style="position: absolute; bottom: 40px; left: 20px; background-color: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; font-family: 'Poppins', sans-serif;">
  <h4 style="color: white;">Top 3 countries</h4>
  {#each topCountries as country, index}
    <div style="display: flex; align-items: center; color: white;">
      <div style="width: 20px; height: 20px; background-color: {topColors[index]}; margin-right: 5px;"></div>
      <span>{country}</span>
    </div>
  {/each}
</div>


<style>
  .menu-container {
    position: absolute;
    top: 105px;
    left: 20px;
    z-index: 10;
  }

  .menu-button {
    padding: 7px 10px;
    background-color: #f0a500;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }

  .menu-button:hover {
    background-color: #d18d00;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
  }

  .menu button {
    background-color: #333;
    color: white;
    border: none;
    padding: 7px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .menu button:hover {
    background-color: #555;
  }

  .menu button.active {
    background-color: #f0a500;
  }
</style>
