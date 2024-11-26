<script>
  export let overlayVisible; // Receive the overlayVisible prop
</script>

{#if $overlayVisible}  <!-- $overlayVisible automatically subscribes to the store -->
  <div class="overlay">
      <div class="overlay-content">
          <h1>How does it work?</h1>

          <!-- Dropdown for the text -->
          <details class="dropdown">
              <summary>Introduction</summary>
              <div class="dropdown-content">
                  <p>
                      This map ranks countries worldwide based on the<br />
                      performance of their chess players across various categories.
                  </p>
              </div>
          </details>

          <details class="dropdown">
              <summary>How are the scores calculated?</summary>
              <div class="dropdown-content">
                  <p>
                      First, the official leaderboards are retrieved from the
                      Chess.com API.<br />Next, the individual player scores are aggregated to
                      calculate each<br />country's total score.<br /><br />A country's rank is then determined based on this total
                      score.
                  </p>
              </div>
          </details>

          <details class="dropdown">
              <summary>What's the difference between the total score and the average score?</summary>
              <div class="dropdown-content">
                  <p>
                      The total score represents the sum of all individual
                      player scores from<br />a given country. Larger countries have an advantage due to<br />their higher
                      populations. To create a more balanced ranking, population data<br />is
                      retrieved from The World Bank API and applied to the
                      following formula:<br /><br />Total score / population * 1000 = average score.
                  </p>
              </div>
          </details>

          <details class="dropdown">
              <summary>How does the purple gradient work?</summary>
              <div class="dropdown-content">
                  <p>
                      The brighter the color, the higher a country's rank on the chess leaderboard.<br />Simple as that!
                  </p>
              </div>
          </details>

          <button on:click={() => overlayVisible.set(false)}>Got it!</button> <!-- Close the overlay -->
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
      background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000; /* Make sure overlay is on top */
  }

  .overlay-content {
      text-align: center;
      background-color: #0d1b2a; /* Dark background for content */
      padding: 20px;
      border-radius: 8px;
      color: #333;
      max-width: 80%;
      font-size: 1.2rem;
      border: 2px solid #f0a500; /* Orange border */
  }

  .dropdown {
      margin-top: 20px;
      text-align: left;
  }

  summary {
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      color: #f0a500; /* Orange color for dropdown summary */
  }

  .dropdown-content {
      margin-top: 10px;
      padding: 10px;
      background-color: #f9f9f9; /* Light background for content */
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
      color: #333;
  }

  p {
      margin: 5px 0;
      line-height: 1.5rem;
  }

  h1{
      color: white; /* White color for heading */
  }

  button {
      margin-top: 15px;
      padding: 10px 20px;
      font-size: 1rem;
      background-color: #f0a500; /* Orange button */
      border: none;
      border-radius: 5px;
      color: #ffffff;
      cursor: pointer;
      font-weight: 600;
  }

  button:hover {
      background-color: #d18d00; /* Darker shade on hover */
  }
</style>
