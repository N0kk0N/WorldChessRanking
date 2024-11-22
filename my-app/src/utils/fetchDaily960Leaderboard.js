export async function fetchLeaderboardData() {
    let leaderboards = [];
    let countryCounts = {};

    async function fetchCountryName(countryUrl) {
        const response = await fetch(countryUrl);
        const countryData = await response.json();
        const excludedLabels = [
            'European Union', 'International', 'Asia', 'Africa', 
            'North America', 'South America', 'Oceania', 'Antarctica', 
            'Europe', 'United Kingdom'
        ];

        if (excludedLabels.includes(countryData.name)) {
            return ''; // Laat het landveld leeg als het overeenkomt met een uitgesloten label
        }

        return countryData.name; // Anders, geef de landennaam terug
    }

    const response = await fetch('https://api.chess.com/pub/leaderboards');
    const data = await response.json();

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

    return { leaderboards, countryCounts };
}
