document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('sudoku-grid-container');
    const myButton = document.getElementById('start');
    const srb = document.getElementById('srb');

    myButton.addEventListener('click', () => {
        myButton.style.display = 'none';
        gridContainer.style.display = 'grid';
        srb.style.display = 'flex';
    })

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('input');
        cell.classList.add('sudoku-cell');
        cell.type = 'text';
        cell.maxLength = 1;
        cell.pattern = "[1-9]";
        cell.title = "Enter a digit from 1 to 9";
        cell.addEventListener('input', (event) => {
            const value = event.target.value;
            if (value && !/^[1-9]$/.test(value)) {
                event.target.value = '';
            }
        });
        
        gridContainer.appendChild(cell);
    }

    const solveButton = document.getElementById('solve');
    const cells = document.querySelectorAll('.sudoku-cell');
    
    // Add a click event listener to the solve button
    solveButton.addEventListener('click', () => {
        // Read the current grid state from the HTML input fields
        const grid = readBoardFromHTML(cells);
        
        // Attempt to solve the puzzle
        if (backtrack(grid)) {
            // If a solution is found, write it back to the HTML input fields
            writeSolutionToHTML(grid, cells);
            console.log("Sudoku solved successfully!");
            // Use a custom message box instead of alert()
            displayMessage("Sudoku solved successfully!", "success");
        } else {
            console.log("No solution exists for this Sudoku.");
            // Use a custom message box
            displayMessage("No solution exists for this Sudoku.", "error");
        }
    });

    /**
     * Reads the values from the HTML input elements and converts them into a 2D array.
     * Empty cells are represented as an empty string "".
     * @param {NodeListOf<Element>} cells - The list of HTML input elements for the grid.
     * @returns {Array<Array<string|number>>} The Sudoku grid as a 2D array.
     */
    function readBoardFromHTML(cells) {
        const grid = [];
        let row = [];
        for (let i = 0; i < 81; i++) {
            const value = cells[i].value;
            // The logic now checks for an empty string instead of 0
            row.push(value === '' ? '' : parseInt(value, 10));
            if ((i + 1) % 9 === 0) {
                grid.push(row);
                row = [];
            }
        }
        return grid;
    }

    /**
     * Writes the solved grid from the 2D array back to the HTML input elements.
     * @param {Array<Array<number>>} grid - The solved Sudoku grid.
     * @param {NodeListOf<Element>} cells - The list of HTML input elements for the grid.
     */
    function writeSolutionToHTML(grid, cells) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                cells[i * 9 + j].value = grid[i][j];
            }
        }
    }
    
    /**
     * Displays a custom message box on the page.
     * @param {string} message - The message to display.
     * @param {string} type - The type of message (e.g., 'success', 'error').
     */
    function displayMessage(message, type) {
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box', type);
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        // Remove the message box after a few seconds
        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }

    /**
     * Backtracking algorithm to solve the Sudoku puzzle.
     * @param {Array<Array<string|number>>} grid - The Sudoku grid to solve.
     * @returns {boolean} True if the puzzle is solvable, otherwise false.
     */
    function backtrack(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                // The main change: check for an empty string instead of 0
                if (grid[i][j] === '') {
                    for (let k = 1; k <= 9; k++) {
                        if (isSafe(grid, k, i, j)) {
                            grid[i][j] = k;
                            if (backtrack(grid)) {
                                return true;
                            }
                            grid[i][j] = ''; // Backtrack step
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    /**
     * Checks if a number can be placed safely in a given cell.
     * @param {Array<Array<string|number>>} grid - The Sudoku grid.
     * @param {number} num - The number to place.
     * @param {number} row - The row index.
     * @param {number} col - The column index.
     * @returns {boolean} True if the number is safe to place, otherwise false.
     */
    function isSafe(grid, num, row, col) {
        return (
            !checkRow(grid, row, num) &&
            !checkCol(grid, col, num) &&
            !checkSquare(grid, row, col, num)
        );
    }

    /**
     * Checks if a number already exists in a given row.
     * @param {Array<Array<string|number>>} grid - The Sudoku grid.
     * @param {number} row - The row index.
     * @param {number} num - The number to check.
     * @returns {boolean} True if the number is found, otherwise false.
     */
    function checkRow(grid, row, num) {
        for (let j = 0; j < 9; j++) {
            if (grid[row][j] === num) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if a number already exists in a given column.
     * @param {Array<Array<string|number>>} grid - The Sudoku grid.
     * @param {number} col - The column index.
     * @param {number} num - The number to check.
     * @returns {boolean} True if the number is found, otherwise false.
     */
    function checkCol(grid, col, num) {
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if a number already exists in the 3x3 square.
     * @param {Array<Array<string|number>>} grid - The Sudoku grid.
     * @param {number} row - The row index of the cell.
     * @param {number} col - The column index of the cell.
     * @param {number} num - The number to check.
     * @returns {boolean} True if the number is found, otherwise false.
     */
    function checkSquare(grid, row, col, num) {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (grid[i][j] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
        cells.forEach(cell => {
            cell.value = '';
        });
    });



});