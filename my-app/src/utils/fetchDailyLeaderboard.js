export async function fetchLeaderboardData() {
    let leaderboards = [];  // Stores the leaderboard data
    let countryData = {};   // Stores country-related data (scores, population, etc.)

    // Fetches the country name from the World Bank API and handles exclusions
    async function fetchCountryName(countryUrl) {
        const response = await fetch(countryUrl);
        const countryData = await response.json();
        const excludedLabels = ['European Union', 'International', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica', 'Europe', 'United Kingdom', 'Seychelles', 'Taiwan', 'Maldives', 'Tuvalu', 'Eswatini', 'Serbia','American Samoa', 'Sao Tome/Principe', 'Malta'];

        if (excludedLabels.includes(countryData.name)) {
            return ''; // Return empty string for excluded labels
        }

        // Convert 'United States' to 'USA'
        if (countryData.name === 'United States') {
            return 'USA';
        }

        return countryData.name; // Return the country name
    }

    // Fetches the population data for a given country code from the World Bank API
    async function fetchPopulation(countryCode) {
        const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data[1] && data[1][0] && data[1][0].value) {
                return data[1][0].value; // Return the most recent population value
            }
        } catch (error) {
            console.error(`Error fetching population data for ${countryCode}:`, error);
        }
        return null; // Return null if the data is not available
    }

    // Fetches the leaderboard data from the Chess.com API
    const response = await fetch('https://api.chess.com/pub/leaderboards');
    const data = await response.json();

    if (data.daily) {
        // Process the top 50 leaderboard players
        leaderboards = await Promise.all(
            data.daily.slice(0, 50).map(async (player) => {
                const countryName = player.country
                    ? await fetchCountryName(player.country)  // Fetch the country name if available
                    : ''; // If country is unknown, set as empty string

                const countryCode = player.country ? player.country.split('/').pop().toUpperCase() : null;
                const population = countryCode ? await fetchPopulation(countryCode) : null;

                return { ...player, countryName, countryCode, population }; // Return the player data with additional country info
            })
        );

        // Calculate country data (average score per population)
        countryData = leaderboards.reduce((data, player) => {
            if (player.countryName) {
                // Initialize the country data if not already present
                data[player.countryName] = data[player.countryName] || { count: 0, totalScore: 0, countryCode: player.countryCode, population: player.population };
                data[player.countryName].count += 1;
                data[player.countryName].totalScore += player.score;
                data[player.countryName].population = player.population; // Save the population

                // Calculate the score per population (add this line)
                if (data[player.countryName].population && data[player.countryName].population > 0) {
                    data[player.countryName].scorePerPop = data[player.countryName].totalScore / data[player.countryName].population;
                } else {
                    data[player.countryName].scorePerPop = 0; // If no population data, set score per population to 0
                }
            }
            return data;
        }, {});
    }

    // Return an object with the leaderboard data and country data
    return { leaderboards, countryData };
}
