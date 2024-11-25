<script>
  import { geoPath, geoNaturalEarth1, scaleSequential, interpolatePurples } from "d3";
  import { onMount } from "svelte";

  export let dataset = [];
  export let isTotalScore = false; // Bepaalt of totalScore of scorePerPop wordt gebruikt
  let countryData = {};
  let svgWidth, svgHeight;
  let tooltip = { visible: false, text: '', x: 0, y: 0 };

  const projection = geoNaturalEarth1();
  const path = geoPath(projection);

  const topColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  let topCountries = [];
  let colorScale;
  let sortedCountries = [];

  // Dynamische import
  let fetchLeaderboardData;

  async function loadLeaderboardModule(type) {
    if (type === "daily") {
      const module = await import("../utils/fetchDailyLeaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    } else if (type === "daily960") {
      const module = await import("../utils/fetchDaily960Leaderboard");
      fetchLeaderboardData = module.fetchLeaderboardData;
    }
  }

  async function fetchAndUpdateData() {
    if (!fetchLeaderboardData) return;

    const data = await fetchLeaderboardData();
    countryData = data.countryData;

    // Sorteer landen afhankelijk van de toggle status
    sortedCountries = Object.entries(countryData)
      .sort((a, b) => isTotalScore
        ? b[1].totalScore - a[1].totalScore
        : b[1].scorePerPop - a[1].scorePerPop
      )
      .map(([countryName]) => countryName);

    // Bepaal de top 3 landen
    topCountries = sortedCountries.slice(0, 3);

    // Maak een kleurenschaal voor landen vanaf plek 4
    colorScale = scaleSequential(interpolatePurples)
      .domain([sortedCountries.length, 4]); // De schaal loopt van laagste rank naar plek 4
  }

  onMount(async () => {
    svgWidth = window.innerWidth;
    svgHeight = window.innerHeight;

    const scaleFactor = Math.min(svgWidth, svgHeight) / 3;
    projection
      .scale(scaleFactor)
      .translate([svgWidth / 2, svgHeight / 2]);

    await loadLeaderboardModule("daily"); // Laad standaard de dagelijkse leaderboard-module
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
  }
</script>

<div>
  <!-- Toggle buttons -->
  <button on:click={() => switchLeaderboardType("daily")}>Daily Leaderboard</button>
  <button on:click={() => switchLeaderboardType("daily960")}>Daily 960 Leaderboard</button>
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
