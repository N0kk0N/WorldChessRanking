<!-- HAALT HET DAILY LEADERBOARD OP -->

<script>
  import { onMount } from 'svelte';

  let leaderboards = [];
  let countryData = {};

  async function fetchCountryName(countryUrl) {
      const response = await fetch(countryUrl);
      const countryData = await response.json();
      const excludedLabels = ['European Union', 'International', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica', 'Europe', 'United Kingdom', 'Seychelles', 'Taiwan'];

      if (excludedLabels.includes(countryData.name)) {
          return ''; // Laat het landveld leeg als het overeenkomt met een uitgesloten label
      }

      return countryData.name; // Anders, geef de landennaam terug
  }

  async function fetchPopulation(countryCode) {
      const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`;
      try {
          const response = await fetch(url);
          const data = await response.json();
          if (data && data[1] && data[1][0] && data[1][0].value) {
              return data[1][0].value; // Geeft de meest recente populatiewaarde terug
          }
      } catch (error) {
          console.error(`Fout bij het ophalen van populatiegegevens voor ${countryCode}:`, error);
      }
      return null; // Als de gegevens niet beschikbaar zijn
  }

  onMount(async () => {
      const response = await fetch('https://api.chess.com/pub/leaderboards');
      const data = await response.json();

      if (data.daily) {
          leaderboards = await Promise.all(
              data.daily.slice(0, 50).map(async (player) => {
                  const countryName = player.country
                      ? await fetchCountryName(player.country)
                      : ''; // Zet het op een lege string als onbekend

                  const countryCode = player.country ? player.country.split('/').pop().toUpperCase() : null;
                  const population = countryCode ? await fetchPopulation(countryCode) : null;

                  // Log de landcode en populatie naar de console
                  if (countryCode) {
                      console.log(`Landcode voor ${countryName}: ${countryCode}, Populatie: ${population || 'Niet beschikbaar'}`);
                  }

                  return { ...player, countryName, countryCode, population }; // Voeg 'population' toe aan het spelerobject
              })
          );

          // Bereken countryData met gemiddelde score per populatie
          countryData = leaderboards.reduce((data, player) => {
              if (player.countryName) {
                  data[player.countryName] = data[player.countryName] || { count: 0, totalScore: 0, countryCode: player.countryCode, population: player.population };
                  data[player.countryName].count += 1;
                  data[player.countryName].totalScore += player.score;
                  data[player.countryName].population = player.population; // Bewaar de populatie
              }
              return data;
          }, {});
      }
  });
</script>

{#if Object.keys(countryData).length === 0}
<p>Loading...</p>
{:else}
<p><strong>Country Data (Average Score per Population):</strong></p>
<ol>
  {#each Object.entries(countryData)
    .sort((a, b) => {
        const avgA = a[1].population ? a[1].totalScore / a[1].population : 0;
        const avgB = b[1].population ? b[1].totalScore / b[1].population : 0;
        return avgB - avgA;
    }) as [country, { count, totalScore, countryCode, population }]}
    <li>
      {country}: {count} players, Total Score: {totalScore}, Population: {population || 'N/A'}, 
      Average Score per Population: {population ? ((totalScore / population) * 1000).toFixed(2) : 'N/A'}
    </li>
  {/each}
</ol>
{/if}











<!-- HAALT HET DAILY960 LEADERBOARD OP -->

<!-- <script>
  import { onMount } from 'svelte';

  let leaderboards = [];
  let countryCounts = {};

  async function fetchCountryName(countryUrl) {
      const response = await fetch(countryUrl);
      const countryData = await response.json();
      const excludedLabels = ['European Union', 'International', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica', 'Europe', 'United Kingdom'];

      if (excludedLabels.includes(countryData.name)) {
          return ''; // Laat het landveld leeg als het overeenkomt met een uitgesloten label
      }

      return countryData.name; // Anders, geef de landennaam terug
  }

  onMount(async () => {
      const response = await fetch('https://api.chess.com/pub/leaderboards');
      const data = await response.json();
      console.log(data);

      if (data.daily960) { // Haal het daily960 leaderboard op
          // Haal de top 50 van het daily960 leaderboard en voeg landennamen toe
          leaderboards = await Promise.all(
              data.daily960.slice(0, 50).map(async (player) => {
                  const countryName = player.country
                      ? await fetchCountryName(player.country)
                      : ''; // Zet het op een lege string als onbekend
                  return { ...player, countryName }; // Voeg 'countryName' toe aan het spelerobject
              })
          );

          // Tel hoe vaak elk land voorkomt, maar sluit lege landen uit
          countryCounts = leaderboards.reduce((counts, player) => {
              if (player.countryName) {
                  counts[player.countryName] = (counts[player.countryName] || 0) + 1;
              }
              return counts;
          }, {});
      }
  });
</script>

{#if leaderboards.length === 0}
<p>Loading...</p>
{:else}
<ul>
  {#each leaderboards as leaderboard}
    <li>
      <strong>{leaderboard.username}</strong> - Rank: {leaderboard.rank} - Score: {leaderboard.score}
      - Country: {leaderboard.countryName}
    </li>
  {/each}
</ul>

<p><strong>Country Counts (Sorted):</strong></p>
<ol>
  {#each Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1]) as [country, count]}
    <li>{country}: {count}</li>
  {/each}
</ol>
{/if} -->