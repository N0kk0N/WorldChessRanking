export async function fetchLeaderboardData() {
    let leaderboards = [];
    let countryData = {};

    // Fetch country name based on the provided country URL
    async function fetchCountryName(countryUrl) {
        const response = await fetch(countryUrl);
        const countryData = await response.json();
        const excludedLabels = ['European Union', 'International', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica', 'Europe', 'United Kingdom', 'Seychelles', 'Taiwan', 'Maldives', 'Tuvalu', 'Eswatini', 'Serbia', 'American Samoa', 'Sao Tome/Principe', 'Malta'];

        if (excludedLabels.includes(countryData.name)) {
            return ''; // Leave the country field empty if it matches an excluded label
        }

        // Convert 'United States' to 'USA'
        if (countryData.name === 'United States') {
            return 'USA';
        }

        return countryData.name; // Otherwise, return the country name
    }

    // Fetch population data based on country code
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
        return null; // Return null if data is unavailable
    }

    const response = await fetch('https://api.chess.com/pub/leaderboards');
    const data = await response.json();

    // Use 'daily960' instead of 'daily'
    if (data.daily960) {
        leaderboards = await Promise.all(
            data.daily960.slice(0, 50).map(async (player) => {
                const countryName = player.country
                    ? await fetchCountryName(player.country)
                    : ''; // Set to an empty string if unknown

                const countryCode = player.country ? player.country.split('/').pop().toUpperCase() : null;
                const population = countryCode ? await fetchPopulation(countryCode) : null;

                return { ...player, countryName, countryCode, population }; // Add 'population' to the player object
            })
        );

        // Calculate countryData with average score per population
        countryData = leaderboards.reduce((data, player) => {
            if (player.countryName) {
                data[player.countryName] = data[player.countryName] || { count: 0, totalScore: 0, countryCode: player.countryCode, population: player.population };
                data[player.countryName].count += 1;
                data[player.countryName].totalScore += player.score;
                data[player.countryName].population = player.population; // Store population

                // Calculate score per population
                if (data[player.countryName].population && data[player.countryName].population > 0) {
                    data[player.countryName].scorePerPop = data[player.countryName].totalScore / data[player.countryName].population;
                } else {
                    data[player.countryName].scorePerPop = 0; // Set to 0 if no population
                }
            }
            return data;
        }, {});
    }

    // Return an object with leaderboard data and country data
    return { leaderboards, countryData };
}
