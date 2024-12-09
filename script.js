document.addEventListener("DOMContentLoaded", () => {
  const player1Store = document.querySelector(".player1-store");
  const player2Store = document.querySelector(".player2-store");
  const boardContainer = document.querySelector(".board");

  // Initialize pits (2 storage pits + 14 normal pits, with kashi pit for each player)
  const pits = Array(16).fill(7);  // All pits start with 7 seeds
  pits[6] = 0;  // Player 1's storage (left)
  pits[13] = 0; // Player 2's storage (right)
  pits[3] = 0;  // Player 1's kashi pit (middle)
  pits[10] = 0; // Player 2's kashi pit (middle)

  let currentPlayer = 1;

  function drawBoard() {
    boardContainer.innerHTML = "";
    player1Store.textContent = pits[6]; // Update Player 1's storage
    player2Store.textContent = pits[13]; // Update Player 2's storage

    // Draw the main board (including kashi pits and storage)
    pits.forEach((seeds, index) => {
      if (index === 6 || index === 13) return; // Skip storage pits
      const hole = document.createElement("div");
      hole.className = (index === 3 || index === 10) ? "kashi" : "hole"; // Apply kashi style for kashi pits
      hole.textContent = seeds;
      hole.dataset.index = index;

      // Highlight pits based on the current player
      if (isPitPlayable(index)) {
        hole.style.border = "2px solid green";
        hole.addEventListener("click", () => sowSeeds(index));
      } else {
        hole.style.border = "2px solid gray";
      }

      boardContainer.appendChild(hole);
    });

    const turnIndicator = document.querySelector(".turn-indicator");
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
  }

  function isPitPlayable(index) {
    if (currentPlayer === 1) {
      return (index >= 0 && index <= 2) || index === 3 || (index >= 4 && index <= 5); // Player 1's pits and kashi pit
    } else {
      return (index >= 7 && index <= 9) || index === 10 || (index >= 11 && index <= 12); // Player 2's pits and kashi pit
    }
  }

  function sowSeeds(startIndex) {
      // Ensure the selected pit belongs to the current player and is not empty
      if (!isPitPlayable(startIndex) || pits[startIndex] === 0) return;

      let seeds = pits[startIndex];
      pits[startIndex] = 0; // Empty the selected pit
      let currentIndex = startIndex;

      // Sow seeds counter-clockwise
      while (seeds > 0) {
        currentIndex = (currentIndex + 1) % pits.length;
        
        // Drop a seed in the next pit
        pits[currentIndex] += 1;
        seeds -= 1;
      }

      // Check for capturing or other rules (to be implemented next)
      handlePostSowing(currentIndex);

      // Switch turns
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      drawBoard();
  }
  
  function handlePostSowing(lastPitIndex) {
      // If the last seed lands in the current player's empty pit on their side, capture seeds
      if (
        (currentPlayer === 1 && lastPitIndex >= 0 && lastPitIndex <= 2 && pits[lastPitIndex] === 1) ||
        (currentPlayer === 2 && lastPitIndex >= 7 && lastPitIndex <= 9 && pits[lastPitIndex] === 1)
      ) {
        const oppositePitIndex = 12 - lastPitIndex;
        const capturedSeeds = pits[oppositePitIndex];
        pits[oppositePitIndex] = 0;
        pits[lastPitIndex] = 0;
    
        // Add captured seeds to the current player's storage
        if (currentPlayer === 1) {
          pits[6] += capturedSeeds + 1;
        } else {
          pits[13] += capturedSeeds + 1;
        }
      }
  }

  function resetGame() {
    for (let i = 0; i < pits.length; i++) {
      pits[i] = 7;
    }
    pits[6] = 0;
    pits[13] = 0;
    pits[3] = 0;  // Reset the kashi pit for Player 1
    pits[10] = 0; // Reset the kashi pit for Player 2
    currentPlayer = 1;
    drawBoard();
  }

  document.getElementById("restart").addEventListener("click", resetGame);

  drawBoard(); // Initialize the game board
});
