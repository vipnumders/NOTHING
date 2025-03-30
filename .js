// NEW FUNCTION: Filter numbers by specific digits
function filterByDigits(includeDigits) {
    if (!includeDigits || includeDigits.length === 0) return [];

    // Create a regex pattern that only allows the specified digits
    const allowedDigitsStr = includeDigits.join('');
    const disallowedDigitsStr = '0123456789'.split('').filter(d => !includeDigits.includes(d)).join('');
    
    return cellData.filter(row => {
        // Check the first two columns (Serial ID and Cell Number) for matching the pattern
        const cellNumber = row[0] ? row[0].toString() : '';
        const formattedNumber = row[1] ? row[1].toString().replace(/[^0-9]/g, '') : '';
        
        // Check if the number contains ONLY the allowed digits
        const containsOnlyAllowedDigits = 
            (cellNumber && !new RegExp(`[${disallowedDigitsStr}]`).test(cellNumber)) ||
            (formattedNumber && !new RegExp(`[${disallowedDigitsStr}]`).test(formattedNumber));
        
        // Also check if it contains at least one of the allowed digits
        const containsAllowedDigit = 
            (cellNumber && new RegExp(`[${allowedDigitsStr}]`).test(cellNumber)) ||
            (formattedNumber && new RegExp(`[${allowedDigitsStr}]`).test(formattedNumber));
        
        return containsOnlyAllowedDigits && containsAllowedDigit;
    });
}

// NEW FUNCTION: Calculate sum of digits in a number
function calculateDigitSum(number) {
    if (!number) return 0;
    
    // Remove non-digit characters
    const digitsOnly = number.toString().replace(/[^0-9]/g, '');
    
    // Sum the digits using the formula similar to SUM(ABS(MID(J3129,{1,2,3,4,5,6,7,8,9,10},1)))
    let sum = 0;
    for (let i = 0; i < digitsOnly.length; i++) {
        sum += parseInt(digitsOnly.charAt(i), 10);
    }
    
    return sum;
}

// Add these event listeners at the end of your script
// Event listener for the digit filter button
document.getElementById('apply-digit-filter').addEventListener('click', function() {
    const checkedDigits = Array.from(document.querySelectorAll('.digit-checkbox:checked'))
        .map(checkbox => checkbox.value);
    
    if (checkedDigits.length > 0) {
        const results = filterByDigits(checkedDigits);
        document.getElementById('results-container').style.display = 'block';
        populateTable(results, '');
        
        // Update the search input to show what we're filtering for
        document.getElementById('search-input').value = `Filter: Only digits ${checkedDigits.join(',')}`;
    } else {
        alert('Please select at least one digit to filter by.');
    }
});

// Event listener for the calculate sum button
document.getElementById('calculate-sum').addEventListener('click', function() {
    const number = document.getElementById('sum-digits-input').value.trim();
    
    if (number) {
        const sum = calculateDigitSum(number);
        document.getElementById('sum-result').innerHTML = `
            <div class="sum-result-content">
                <div><strong>Number:</strong> ${number}</div>
                <div><strong>Sum of Digits:</strong> ${sum}</div>
                <div><strong>Formula:</strong> SUM(ABS(MID(${number},{1,2,3,4,5,6,7,8,9,10},1)))</div>
            </div>
        `;
        
        // Also search for numbers with this sum
        const results = cellData.filter(row => {
            return row.some(cell => {
                if (cell && cell.toString().match(/^\d+$/)) {
                    return calculateDigitSum(cell) === sum;
                }
                return false;
            });
        });
        
        if (results.length > 0) {
            document.getElementById('results-container').style.display = 'block';
            populateTable(results, '');
            document.getElementById('search-input').value = `Numbers with digit sum = ${sum}`;
        }
    } else {
        alert('Please enter a number to calculate the sum of its digits.');
    }
});
// Auto Sum functionality
document.addEventListener('DOMContentLoaded', function() {
    const autoSumInput = document.getElementById('auto-sum-input');
    const autoSumResult = document.getElementById('auto-sum-result');

    // Enhanced function to calculate sum of digits in a number
    function calculateDigitSum(number) {
        if (!number) return 0;
        
        // Remove non-digit characters
        const digitsOnly = number.toString().replace(/[^0-9]/g, '');
        
        // Sum the digits
        let sum = 0;
        for (let i = 0; i < digitsOnly.length; i++) {
            sum += parseInt(digitsOnly.charAt(i), 10);
        }
        
        return sum;
    }

    // Function to display the digit sum with visual breakdown
    function displayDigitSum(number) {
        if (!number) return;
        
        // Remove non-digit characters
        const digitsOnly = number.toString().replace(/[^0-9]/g, '');
        
        if (digitsOnly.length === 0) {
            autoSumResult.style.display = 'none';
            return;
        }
        
        // Calculate sum
        const sum = calculateDigitSum(digitsOnly);
        
        // Create visual breakdown
        let breakdownHTML = '<div class="digit-sum-breakdown">';
        
        for (let i = 0; i < digitsOnly.length; i++) {
            const digit = digitsOnly.charAt(i);
            breakdownHTML += `<span class="digit-box">${digit}</span>`;
            
            if (i < digitsOnly.length - 1) {
                breakdownHTML += '<span class="digit-plus">+</span>';
            }
        }
        
        breakdownHTML += '<span class="digit-equals">=</span>';
        breakdownHTML += `<span class="digit-sum">${sum}</span>`;
        breakdownHTML += '</div>';
        
        // Display the result
        autoSumResult.style.display = 'block';
        autoSumResult.innerHTML = `
            <div><strong>Number:</strong> ${number}</div>
            <div><strong>Sum of Digits:</strong> ${sum}</div>
            ${breakdownHTML}
        `;
        
        // Also update the search input to show the result
        document.getElementById('search-input').value = `Sum: ${sum}`;
        
        // Trigger a search for this sum
        const searchEvent = new Event('input', { bubbles: true });
        document.getElementById('search-input').dispatchEvent(searchEvent);
    }

    // Add event listener for input changes
    autoSumInput.addEventListener('input', function() {
        const input = this.value.trim();
        displayDigitSum(input);
    });
    
    // Add event listener for Enter key
    autoSumInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const input = this.value.trim();
            displayDigitSum(input);
        }
        
    });
});
.filters-container {
    margin: 20px 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
}

.filter-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 150px;
}

.filter-button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.filter-button:hover {
    background-color: #45a049;
}

// Add these functions to your existing JavaScript

// Function to apply all filters
function applyFilters(results) {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    return results.filter(row => {
        const status = row[2] || '';
        const category = row[4] || '';
        const price = parseFloat(row[5]) || 0;

        const statusMatch = !statusFilter || status === statusFilter;
        const categoryMatch = !categoryFilter || category === categoryFilter;
        const priceMatch = (!minPrice || price >= parseFloat(minPrice)) && 
                          (!maxPrice || price <= parseFloat(maxPrice));

        return statusMatch && categoryMatch && priceMatch;
    });
}

// Event listeners for filters
document.getElementById('statusFilter').addEventListener('change', function() {
    const searchTerm = document.getElementById('search-input').value.trim();
    let results = searchTerm ? searchCellData(searchTerm) : cellData;
    results = applyFilters(results);
    populateTable(results, searchTerm);
});

document.getElementById('categoryFilter').addEventListener('change', function() {
    const searchTerm = document.getElementById('search-input').value.trim();
    let results = searchTerm ? searchCellData(searchTerm) : cellData;
    results = applyFilters(results);
    populateTable(results, searchTerm);
});

// Event listener for price filters
function handlePriceFilter() {
    const searchTerm = document.getElementById('search-input').value.trim();
    let results = searchTerm ? searchCellData(searchTerm) : cellData;
    results = applyFilters(results);
    populateTable(results, searchTerm);
}

document.getElementById('minPrice').addEventListener('input', handlePriceFilter);
document.getElementById('maxPrice').addEventListener('input', handlePriceFilter);

// Modify your existing searchCellData function to include filters
const originalSearchCellData = searchCellData;
searchCellData = function(searchTerm) {
    let results = originalSearchCellData(searchTerm);
    return applyFilters(results);
};
// Function to apply all filters
function applyFilters(results) {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceRangeFilter = document.getElementById('priceRangeFilter').value;
    const sumFilter = document.getElementById('sumFilter').value.trim();

    return results.filter(row => {
        const status = row[2] || '';
        const category = row[4] || '';
        const price = parseFloat(row[5]) || 0;
        const cellNumber = row[0] || ''; // Use the first column for sum calculation
        const digitSum = calculateDigitSum(cellNumber);

        // Status filter
        const statusMatch = !statusFilter || status === statusFilter;
        
        // Category filter
        const categoryMatch = !categoryFilter || category === categoryFilter;
        
        // Price range filter
        let priceMatch = true;
        if (priceRangeFilter) {
            const [minPrice, maxPrice] = priceRangeFilter.split('-').map(Number);
            priceMatch = price >= minPrice && price <= maxPrice;
        }
        
        // Sum filter
        let sumMatch = true;
        if (sumFilter) {
            const filterValue = sumFilter.trim();
            if (filterValue.startsWith('>')) {
                const targetSum = parseInt(filterValue.substring(1));
                sumMatch = !isNaN(targetSum) && digitSum > targetSum;
            } else if (filterValue.startsWith('<')) {
                const targetSum = parseInt(filterValue.substring(1));
                sumMatch = !isNaN(targetSum) && digitSum < targetSum;
            } else if (filterValue.startsWith('=')) {
                const targetSum = parseInt(filterValue.substring(1));
                sumMatch = !isNaN(targetSum) && digitSum === targetSum;
            } else {
                const targetSum = parseInt(filterValue);
                sumMatch = !isNaN(targetSum) && digitSum === targetSum;
            }
        }

        return statusMatch && categoryMatch && priceMatch && sumMatch;
    });
}
// Event listener for sum filter button
document.getElementById('apply-sum-filter').addEventListener('click', function() {
    document.getElementById('results-container').style.display = 'block';
    const results = [...cellData]; // Start with all data
    const filteredResults = applyFilters(results);
    populateTable(filteredResults, '');
});

// Add Enter key support for sum filter
document.getElementById('sumFilter').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('apply-sum-filter').click();
    }
});
// Pagination variables
let currentPage = 1;
let resultsPerPage = 20;
let currentResults = [];
// Function to get paginated results
function getPaginatedResults() { ... }

// Function to update pagination controls
function updatePaginationControls() { ... }
function populateTable(results, searchTerm) {
    // Store the full results for pagination
    currentResults = results;
    // Reset to first page when new search is performed
    currentPage = 1;
    // ...
    // Get only the results for the current page
    const paginatedResults = getPaginatedResults();
    // ...
}
function refreshTable(searchTerm) { ... }
// Event listeners for pagination buttons
document.getElementById('prev-page').addEventListener('click', function() { ... });
document.getElementById('next-page').addEventListener('click', function() { ... });
