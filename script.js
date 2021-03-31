
// This should activate on hover or click of arrow for a given row
const showEstimates = (event) => {
	const boxes=event.target.id.split('-');
	let knownNumbers = [];
	// gets the numbers for the selected row
	boxes.forEach((x) => {
		let number = parseInt(document.getElementById("input" + x).value);
		knownNumbers.push(isNaN(number) ? 0 : number);
	})
	const possibleSums = calculateSums(knownNumbers);
	
	// Now that we know which sums to flag, hide and highlight some rows
	highlightRows(possibleSums);
}


// Need event listeners for the arrows for click/hover events
const arrowElements = document.getElementsByClassName('arrow');
for (let i=0; i<arrowElements.length; i++) {
	arrowElements[i].addEventListener('click', showEstimates);
	// disabled for now since it is spamming the console
	//arrowElements[i].addEventListener('mouseover', showEstimates);
}


// Takes an array of known numbers + array of potential numbers
// Eliminate duplicates and returns possible numbers
// This function is aware if there are more slots free to fill.
// Returns an array of possible sums of a specified row
function calculateSums(knownNumbers) {
	let subtotal = knownNumbers.reduce((accumulator, x) => accumulator += x);
	let slotsFree = 0;
	let total = [];

	// This should get the possible numbers for this row
	const unusedNumbers = getPotentialNumbers();
	knownNumbers.forEach((x) => {
		if (x === 0) {
			slotsFree++;
		}
	})

	switch(slotsFree) {
		case 0:
			// No slots free - all are known, return sum of row
			total.push(subtotal);
			break;
		case 1:
			// One slot free - iterate through once
			total = possibleSum(unusedNumbers, subtotal);
			break;
		case 2:
			total = iterateThroughTwoSlots(unusedNumbers, subtotal);
			break;
		case 3:
			// Three slots free - could be anything BUT some numbers may be known
			// in other rows.  So this serves to eliminate possibilities based on those numbers.
			total = iterateThroughThreeSlots();
			break;
	}
	// total is an array of possible sums of a row
	return total;
}


// Three unknown slots, which means eliminate options not in this row
// Requires no inputs and returns integers (potential sums) for this row.
function iterateThroughThreeSlots() {
	// first iteration: no real subtotal yet; anything other than knownNumbers is valid
	let unusedNumbers = getPotentialNumbers();
	let sums_with_duplicates = [];
	
	// now iterate through the known PLUS each one of the possible1 values
	for(let i=0; i<unusedNumbers.length; i++) {
		// If we say the known number is slot #1
		// num here is the potential value of slot #2
		let num = unusedNumbers.shift();
		// So we have one "known" number and two slots free - use existing function and save totals
		sums_with_duplicates = sums_with_duplicates.concat(iterateThroughTwoSlots(unusedNumbers, num));

		// return number to the array for the next iteration
		unusedNumbers.push(num);
	}

	// Filter out duplicates
	const setResults = new Set(sums_with_duplicates);
	// Convert back to an array
	const results = [...setResults];
	return results;
}


// Helper function for calculateSums that helps with the permutations
// Since iterateThroughThreeSlots uses this, it must be passed unusedNumbers
// because what iterate3 sees is an imaginary number to be passed here
function iterateThroughTwoSlots(unusedNumbers, subtotal) {
	let sums_with_duplicates = [];
	
	// now iterate through the known PLUS each one of the possible1 values
	for(let i=0; i<unusedNumbers.length; i++) {
		// if we say the known number is slot #1
		// num here is the potential value of slot #2
		let num = unusedNumbers.shift();

		// This produces an array of sums with one slot free still 
		// #3 is in "usedNumbers" so this should be the final result
		let sub1 = possibleSum(unusedNumbers, subtotal + num);
		sums_with_duplicates = sums_with_duplicates.concat(sub1);
		
		// return number to the array for the next iteration
		unusedNumbers.push(num);
	}

	// Filter out duplicates
	const setResults = new Set(sums_with_duplicates);
	// Convert back to an array
	const results = [...setResults];
	//console.log("Unique results: " + results);
	return results;
}

// Takes a subtotal (may or may not be row total) and array of integers
// Runs through possible results and returns an array of integers (sums)
// This does not care about the total number of slots (will be called repeatedly instead)
function possibleSum(unusedNumbers, subtotal) {
	possibleSums = unusedNumbers.map(number => subtotal + number);
	return possibleSums;
}


// Helper function.  Numbers can only be used once, so this will help
// calculate / eliminate rows if it is impossible to attain a given sum.
// Returns an array with valid numbers (for a row)
// For consistency, though expects int array, will cast to ints and return an int array.
function getPotentialNumbers() {
	let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	//const usedNumbers = rowNumbers.map(x => parseInt(x)).concat(getUsedNumbers());
	const usedNumbers = getUsedNumbers();

	let remainingNumbers = []
	allNumbers.forEach(number => {
		if (!usedNumbers.includes(number)) {
			remainingNumbers.push(number);
		}
	})
	return remainingNumbers;
}

// Get the payout from a given row (key is the sum of a row)
function getPayout(sum) {

}


// Called if a single tile was updated - check to see if it is a legal value
// Clears value if it is not a legal value, else it leaves it and recalculates values
function isUpdated(inputBox) {
	// Check for value legality
	const lastValue = parseInt(inputBox.value);
	const usedNumbers = getUsedNumbers();
	if (didFindError(usedNumbers, lastValue)) {
		inputBox.value = "";
	}
	return;
}


// Update the estimates shown for each row
// Should only be called after a value was entered and check was done at isUpdated
// Returns the numbers used on the grid
function getUsedNumbers() {
	// note to self, grid is NOT an actual array
	const grid = document.getElementsByClassName('number');
	let numbers = [];
	for(let i=0; i<grid.length; i++) {
		let x = parseInt(grid[i].value);
		if (Number.isInteger(x)) {
			numbers.push(x);
		}
	}
	return numbers;
}


// Check for errors (duplicates, too many revealed, etc)
// Expects an array of numbers (probably from getNumbersFromBoard())
// Returns true (did find error) or false (no errors found)
// This function also updates the error box
function didFindError(numbers, lastValue) {
	// Clear all the old errors
	updateErrorBox("reset");
	console.log(numbers);
	let errorFound = false;

	// Check if newest value is an actual number
	if (!Number.isInteger(lastValue)) {
		updateErrorBox("Only numbers (integers) are allowed.");
		errorFound = true;
	}

	// Check if newest value is between 1-9
	if (lastValue < 1 || lastValue > 9) {
		updateErrorBox("Number must be between 1-9.");
		errorFound = true;
	}

	// Check if newest value is a duplicate value
	let seenCount = 0;
	for (i=0; i<numbers.length; i++) {
		if (numbers[i] === lastValue) {
			seenCount++;
		}
	}
	if (seenCount > 1) {
		updateErrorBox("Number " + lastValue + " should appear in the grid only once.");
		errorFound = true;
	}

	// See if there are too many revealed spaces
	if (numbers.length > 4) {
		updateErrorBox("Only 4 revealed numbers are allowed at a time.");
		errorFound = true;
	}

	return errorFound;
}


// Some error was detected, inform user with cumulative error messages
// Should be called after didFindError as a helper function
function updateErrorBox(content) {
	const errorBox = document.getElementById('error-box');
	if (content === "reset") {
		errorBox.innerHTML = "";
	}
	else {
		content += "<br />"
		errorBox.innerHTML += content;
	}
	return;
}



// Highlights specified rows (sums)
// Accepts an array of integers, returns nothing
function highlightRows(highlightedRows) {
	for(let rowNumber=6; rowNumber<25; rowNumber++) {
		const row = document.getElementById('row' + rowNumber);
		if (highlightedRows.includes(rowNumber)) {
			row.classList = "highlighted";
		}
		else {
			row.classList = "dimmed";
		}
	}
	return;
}

// Resets the board and replaces all the numbers with blank spaces.
function resetBoard() {
	// Clear all the inputs
	const grid = document.getElementsByClassName('number');
	for(let i=0; i<grid.length; i++) {
		grid[i].value = "";
	}
	// Clear the changes to the payout box
	for(let rowNumber=6; rowNumber<25; rowNumber++) {
		const row = document.getElementById('row' + rowNumber);
		row.classList = "";
	}
	// Clear the error box
	updateErrorBox("reset");
	return;
}