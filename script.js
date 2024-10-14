const grid = [
    [0, 0, 0, 0, 2],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0]
  ];
  
  const gamma = 0.9;
  let values = [
    [0, 0, 0, 0, 100],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  
  const actions = {
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→'
  };
  
  let policy = [
    ['right', 'right', 'right', 'right', null],
    ['up', null, 'up', null, 'left'],
    ['right', 'right', 'right', 'right', 'left'],
    ['up', null, 'up', null, 'left'],
    ['right', 'right', 'right', 'right', 'left']
  ];
  
  function createGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = ''; // Clear existing grid
  
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
  
        if (grid[i][j] === 1) {
          cell.classList.add('obstacle');
        } else if (grid[i][j] === 2) {
          cell.classList.add('goal');
        } else {
          cell.innerHTML = `<span class="arrows">${actions[policy[i][j]]}</span>
                            <span class="value">${values[i][j].toFixed(2)}</span>`;
        }
  
        container.appendChild(cell);
      }
    }
  }
  
  function runGPI() {
    // Perform one iteration of policy evaluation and policy improvement
    policyEvaluation();
    policyImprovement();
    createGrid(); // Re-render the grid
  }
  
  function policyEvaluation() {
    const newValues = JSON.parse(JSON.stringify(values)); // Deep copy
  
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== 1 && grid[i][j] !== 2) { // Skip obstacles and goal
          const action = policy[i][j];
          const [nextI, nextJ] = getNextState(i, j, action);
          if (nextI !== null && nextJ !== null) {
            newValues[i][j] = reward(i, j) + gamma * values[nextI][nextJ];
          }
        }
      }
    }
    values = newValues; // Update values with the new estimates
  }
  
  function policyImprovement() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] !== 1 && grid[i][j] !== 2) {
          let bestAction = null;
          let bestValue = -Infinity;
  
          for (const action in actions) {
            const [nextI, nextJ] = getNextState(i, j, action);
            if (nextI !== null && nextJ !== null && values[nextI][nextJ] > bestValue) {
              bestValue = values[nextI][nextJ];
              bestAction = action;
            }
          }
          policy[i][j] = bestAction;
        }
      }
    }
  }
  
  function getNextState(i, j, action) {
    switch (action) {
      case 'up': return [i - 1 >= 0 ? i - 1 : null, j];
      case 'down': return [i + 1 < grid.length ? i + 1 : null, j];
      case 'left': return [i, j - 1 >= 0 ? j - 1 : null];
      case 'right': return [i, j + 1 < grid[i].length ? j + 1 : null];
      default: return [null, null];
    }
  }
  
  function reward(i, j) {
    if (grid[i][j] === 2) return 100; // Goal state
    return -1; // Small negative reward for each step to encourage efficiency
  }
  
  document.getElementById('run-btn').addEventListener('click', runGPI);
  document.getElementById('reset-btn').addEventListener('click', () => {
    values = [
      [0, 0, 0, 0, 100],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    createGrid();
  });
  
  createGrid(); // Initial rendering of the grid
  