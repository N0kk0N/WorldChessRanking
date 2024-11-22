<script>
    import DataFetch from "../components/dataFetch.svelte";
    export let showLeaderboard = false;
    export let toggleLeaderboard;
</script>

{#if showLeaderboard}
    <div class="overlay" on:click={toggleLeaderboard}></div>
    <div class="leaderboard">
        <div class="leaderboard-header">
            <h2>Leaderboard</h2>
            <button on:click={toggleLeaderboard}>Close</button>
        </div>
        <DataFetch />
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10;
    }

    .leaderboard {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        background: #0d1b2a;
        color: #ffffff;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
        z-index: 20;
        padding: 20px;
        overflow-y: auto;
    }

    .leaderboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px; /* Optioneel voor wat ruimte onder de header */
    }

    .leaderboard-header h2 {
        margin: 0; /* Zorg dat er geen extra marge rondom de titel is */
    }

    .leaderboard-header button {
        margin-left: 10px; /* Optioneel: ruimte tussen de knop en de titel */
        padding: 5px 10px;
        background: #f0a500;
        border: none;
        border-radius: 5px;
        color: #0d1b2a;
        cursor: pointer;
    }

    .leaderboard h2 {
        margin-top: 0;
    }

    button {
        display: block;
        margin: 10px 0;
        padding: 5px 10px;
        background: #f0a500;
        border: none;
        border-radius: 5px;
        color: #0d1b2a;
        cursor: pointer;
    }
</style>
