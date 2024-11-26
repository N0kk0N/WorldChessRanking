export async function fetchLeaderboardData() {
    let leaderboards = [];
    let countryData = {};

    async function fetchCountryName(countryUrl) {
        const response = await fetch(countryUrl);
        const countryData = await response.json();
        const excludedLabels = ['European Union', 'International', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica', 'Europe', 'United Kingdom', 'Seychelles', 'Taiwan', 'Maldives', 'Tuvalu', 'Eswatini', 'Serbia','American Samoa', 'Sao Tome/Principe', 'Malta'];

        if (excludedLabels.includes(countryData.name)) {
            return ''; // Laat het landveld leeg als het overeenkomt met een uitgesloten label
        }

        // Converteer 'United States' naar 'USA'
        if (countryData.name === 'United States') {
            return 'USA';
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

    const response = await fetch('https://api.chess.com/pub/leaderboards');
    const data = await response.json();

    // Gebruik 'daily960' in plaats van 'daily'
    if (data.daily960) {
        leaderboards = await Promise.all(
            data.daily960.slice(0, 50).map(async (player) => {
                const countryName = player.country
                    ? await fetchCountryName(player.country)
                    : ''; // Zet het op een lege string als onbekend

                const countryCode = player.country ? player.country.split('/').pop().toUpperCase() : null;
                const population = countryCode ? await fetchPopulation(countryCode) : null;

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

                // Bereken de score per populatie
                if (data[player.countryName].population && data[player.countryName].population > 0) {
                    data[player.countryName].scorePerPop = data[player.countryName].totalScore / data[player.countryName].population;
                } else {
                    data[player.countryName].scorePerPop = 0; // Als er geen populatie is, zet op 0
                }
            }
            return data;
        }, {});
    }

    // Geeft een object terug met de leaderboard gegevens en landgegevens
    return { leaderboards, countryData };
}
