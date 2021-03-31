
// This should activate on hover or click of arrow for a given row
const showEstimates = (event) => {
	//console.log(event.target.id);
	const boxes=event.target.id.split('-');
	//console.log(boxes);
	//let total=0;
	let knownNumbers = [];
	// gets the numbers for the selected row
	boxes.forEach((x) => {
		let number = parseInt(document.getElementById("input" + x).value);
		knownNumbers.push(isNaN(number) ? 0 : number);
		//total += number.isNaN ? 0 : number;
	})
	const possibleSums = calculateSums(knownNumbers);
	console.log("possibleSums: " + possibleSums);

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
// expects two arrays of integers.
// This function is aware if there are more slots free to fill.
// returns total, an array of possible sums of a row
function calculateSums(knownNumbers) {
	let subtotal = knownNumbers.reduce((accumulator, x) => accumulator += x);
	let slotsFree = 0;
	let total = [];

	// This should get the possible numbers for this row
	const unusedNumbers = getPotentialNumbers();
	//console.log("knownNumbers @ calculate: " + knownNumbers);
	knownNumbers.forEach((x) => {
		//subtotal += x;
		if (x === 0) {
			slotsFree++;
		}
	})
	if (slotsFree == 0) {
		// There will only be one result (the sum of the row)
	}
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
	//console.log("total: " + total);
	return total;
}


// Helper function for calculateSums that helps with the permutations
// uses possibleSum as well
// Duplicated code, but much easier to conceptualize
function iterateThroughThreeSlots() {
	// first iteration: no real subtotal yet; anything other than knownNumbers is valid
	let unusedNumbers = getPotentialNumbers();
	let sums_with_duplicates = [];
	
	// now iterate through the known PLUS each one of the possible1 values
	for(let i=0; i<unusedNumbers.length; i++) {
		// if we say the known number is slot #1
		// num here is the potential value of slot #2
		let num = unusedNumbers.shift();
		// So we have one "known" number and two slots free - use existing function and save totals
		sums_with_duplicates = sums_with_duplicates.concat(iterateThroughTwoSlots(unusedNumbers, num));

		// return number to the array for the next iteration
		unusedNumbers.push(num);
	}
	//console.log("Unmodified results: " + sums_with_duplicates);
	// Filter out duplicates
	const setResults = new Set(sums_with_duplicates);
	// Convert back to an array
	const results = [...setResults];
	return results;
}


// Helper function for calculateSums that helps with the permutations
// uses possibleSum as well
// Since iterateThroughThreeSlots uses this, it must be passed getPotentialNumbers/poss1
// because what iterate3 sees is an imaginary number to be passed here
function iterateThroughTwoSlots(unusedNumbers, subtotal) {
	//console.log("unusedNumbers: " + unusedNumbers);
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
// returns an array with valid numbers (for a row)
// For consistency, though expects int array, will cast to ints and return an int array.
function getPotentialNumbers() {
	let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	//const usedNumbers = rowNumbers.map(x => parseInt(x)).concat(getUsedNumbers());
	const usedNumbers = getUsedNumbers();
	//console.log("usedNumbers: " + usedNumbers);
	
	// fr every number in used Numbers
	let remainingNumbers = []
	allNumbers.forEach(number => {
		if (!usedNumbers.includes(number)) {
			remainingNumbers.push(number);
		}
	})
	//console.log("remaining numbers: " + remainingNumbers);
	return remainingNumbers;
}

// Get the payout from a given row (key is the sum of a row)
function getPayout(sum) {

}


// Called if a single tile was updated - check to see if it is a legal value
// Clears value if it is not a legal value, else it leaves it and recalculates values
function isUpdated(inputBox) {

	// temporary!!! DELETE THIS LATER!!!!
	return;

	// Check for value legality
	const number = parseInt(inputBox.value);

	// should probably check also how many tiles have already been revealed
	const usedNumbers = getUsedNumbers();
	//const numbers = getNumbersFromBoard();
	if (didFindError(numbers, number)) {
		inputBox.value = "";
	}
	else {
		// I don't think this is needed?
		//getUsedNumbers();
	}
	return;
}




// Update the estimates shown for each row
// Should only be called after a value was entered and check was done at isUpdated
// this function might be antiquated - co-opted for new stuff but might break isUpdated
// returns the numbers used on the grid?
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

// This might be old and is really not needed anymore?
// Gets the numbers from the board, leaving an empty string for null/invalid values.
// Should be probably be called after isUpdated.
// Returns an array of numbers and empty strings
/*
function getNumbersFromBoard() {
	const grid = document.getElementsByClassName('number');
	let numbers = [];
	for(let i=0; i<grid.length; i++) {
		let x = parseInt(grid[i].value);
		numbers.push(Number.isInteger(x) ? x : "");
	}
	return numbers;
} */



// Check for errors (duplicates, too many revealed, etc)
// Expects an array of numbers (probably from getNumbersFromBoard())
// returns true (did find error) or false (no errors found)
function didFindError(numbers, lastValue) {
	// Clear all the old errors
	updateErrorBox("reset");
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
	let blankCount = 0;
	for (i=0; i<numbers.length; i++) {
		if (i === lastValue) {
			seenCount++;
		}
		else {
			if (i === "") {
				blankCount++;
			}
		}
	}
	if (seenCount > 1) {
		updateErrorBox("Number " + lastValue + " should appear in the grid only once.");
		errorFound = true;
	}

	// See if there are too many revealed spaces
	if (blankCount > 4) {
		updateErrorBox("Too many revealed spaces for the count to be realistic. (More than 4)");
		errorFound = true;
	}

	// no errors - clear error box?
	updateErrorBox("");
	return errorFound;
}

// Some error was detected, inform user with cumulative error messages
// should be called after didFindError as a helper function
// Maybe this should call highlight as well?
function updateErrorBox(content) {
	const errorBox = document.getElementById('errorBox');
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
	//resetDisplay();
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

function dimRowsUnusued() {
	// dim the sums in the mgp listing that are unavailable for a particular row
}

// Removes the modifications from highlighting/dimming rows
function resetDisplay() {
	for(let i=6; i<25; i++) {
		const row = document.getElementById('row' + i);
		row.classList = "";
	}
}