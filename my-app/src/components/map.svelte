<script>
  import { geoPath, geoNaturalEarth1, scaleSequential, interpolatePurples } from "d3";
  import { onMount } from "svelte";

  export let dataset = [];
  export let isTotalScore = false;
  let countryData = {};
  let svgWidth, svgHeight;
  let tooltip = { visible: false, text: '', x: 0, y: 0 };
  let isMenuOpen = false;
  let activeLeaderboard = "daily"; // Houdt bij welk leaderboard actief is

  const projection = geoNaturalEarth1();
  const path = geoPath(projection);

  const topColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  let topCountries = [];
  let colorScale;
  let sortedCountries = [];

  let fetchLeaderboardData;

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

    topCountries = sortedCountries.slice(0, 3);
    colorScale = scaleSequential(interpolatePurples)
      .domain([sortedCountries.length, 4]);
  }

  onMount(async () => {
    svgWidth = window.innerWidth;
    svgHeight = window.innerHeight;

    const scaleFactor = Math.min(svgWidth, svgHeight) / 3;
    projection
      .scale(scaleFactor)
      .translate([svgWidth / 2, svgHeight / 2]);

    await loadLeaderboardModule("daily");
    await fetchAndUpdateData();
  });

  $: if (isTotalScore !== undefined) {
    fetchAndUpdateData();
  }

  function getRank(countryName) {
    const rank = sortedCountries.indexOf(countryName) + 1;
    return rank;
  }

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

  function hideTooltip() {
    tooltip = { visible: false, text: '', x: 0, y: 0 };
  }

  async function switchLeaderboardType(type) {
    await loadLeaderboardModule(type);
    await fetchAndUpdateData();
    activeLeaderboard = type; // Zet de actieve leaderboard bij wijziging
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<div class="menu-container">
  <button class="menu-button" on:click={toggleMenu}>Categories</button>

  {#if isMenuOpen}
    <div class="menu">
      <button 
        class="{activeLeaderboard === 'daily' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("daily")}>
        Daily
      </button>
      <button 
        class="{activeLeaderboard === 'daily960' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("daily960")}>
        Daily 960
      </button>
      <button 
        class="{activeLeaderboard === 'liveRapid' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveRapid")}>
        Live Rapid
      </button>
      <button 
        class="{activeLeaderboard === 'liveBlitz' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBlitz")}>
        Live Blitz
      </button>
      <button 
        class="{activeLeaderboard === 'liveBullet' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBullet")}>
        Live Bullet
      </button>
      <button 
        class="{activeLeaderboard === 'liveBughouse' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBughouse")}>
        Live Bughouse
      </button>
      <button 
        class="{activeLeaderboard === 'liveBlitz960' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveBlitz960")}>
        Live Blitz960
      </button>
      <button 
        class="{activeLeaderboard === 'liveThreecheck' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveThreecheck")}>
        Live Threecheck
      </button>
      <button 
        class="{activeLeaderboard === 'liveCrazyhouse' ? 'active' : ''}" 
        on:click={() => switchLeaderboardType("liveCrazyhouse")}>
        Live Crazyhouse
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

<div class="legend" style="position: absolute; bottom: 40px; left: 20px; background-color: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px;">
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
    left: 10px;
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
    padding: 8px 12px;
    background-color: #f0a500;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }

  .menu button:hover {
    background-color: #d18d00;
  }

  .menu button.active {
    background-color: #ff7f00; /* Kleurt de actieve knop oranje */
  }

  .tooltip {
    position: absolute;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    z-index: 10;
  }

  .legend {
    font-size: 14px;
  }

  .legend div {
    margin-bottom: 5px;
  }
</style>
