<script>
    export let showMenu = false; // Variabele om het menu te tonen of te verbergen
    export let toggleMenu; // Functie om het menu te toggelen
</script>

{#if showMenu}
    <div class="overlay" on:click={toggleMenu}></div>
    <div class="menu">
        <button class="menu-button" on:click={toggleMenu}>Close Menu</button>
        <div class="menu-items">
            <button>Button 1</button>
            <button>Button 2</button>
            <button>Button 3</button>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* Donkere overlay */
        z-index: 10;
    }

    .menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 250px;
        height: 100%;
        background-color: #0d1b2a;
        color: white;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        z-index: 20;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .menu-button {
        margin-bottom: 20px;
        padding: 10px;
        background-color: #f0a500;
        border: none;
        border-radius: 5px;
        color: #0d1b2a;
        cursor: pointer;
    }

    .menu-items button {
        padding: 10px;
        background-color: #f0a500;
        border: none;
        border-radius: 5px;
        color: #0d1b2a;
        cursor: pointer;
    }

    .menu-items button:hover {
        background-color: #d18d00;
    }
</style>
