
// This should activate on hover or click of arrow for a given row
const showEstimates = (event) => {
	console.log(event.target.id);
	const boxes=event.target.id.split('-');
	console.log(boxes);
	let total=0;
	boxes.forEach((x) => {
		let number = parseInt(document.getElementById("input" + x).value);
		total += number ? number : 0;
	})
	console.log("Total: " + total);
}

// Need event listeners for the arrows for click/hover events
const arrowElements = document.getElementsByClassName('arrow');
for (let i=0; i<arrowElements.length; i++) {
	arrowElements[i].addEventListener('click', showEstimates);
	//arrowElements[i].addEventListener('mouseover', showEstimates);
}


// Called if a single tile was updated - check to see if it is a legal value
// Clears value if it is not a legal value, else it leaves it and recalculates values
function isUpdated(inputBox) {

	// temporary!!! DELETE THIS LATER!!!!
	return;

	// Check for value legality
	const number = parseInt(inputBox.value);

	// should probably check also how many tiles have already been revealed
	const numbers = getNumbersFromBoard();
	if (didFindError(numbers, number)) {
		inputBox.value = "";
	}
	else {
		updateEstimates();
	}
	return;
}




// Update the estimates shown for each row
// Should only be called after a value was entered and check was done at isUpdated
function updateEstimates() {
	// note to self, grid is NOT an actual array
	const grid = document.getElementsByClassName('number');
	let numbers = [];
	for(let i=0; i<grid.length; i++) {
		let x = parseInt(grid[i].value);
		numbers.push(Number.isInteger(x) ? x : "");
	}

	// Do the math
	// Display totals on sides (and/or on hover?)
}


// Gets the numbers from the board, leaving an empty string for null/invalid values.
// Should be probably be called after isUpdated.
// Returns an array of numbers and empty strings
function getNumbersFromBoard() {
	const grid = document.getElementsByClassName('number');
	let numbers = [];
	for(let i=0; i<grid.length; i++) {
		let x = parseInt(grid[i].value);
		numbers.push(Number.isInteger(x) ? x : "");
	}
	return numbers;
}



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

function dimRowsUnusued() {
	// dim the sums in the mgp listing that are unavailable for a particular row
}

function highlightBox() {
	
}

function highlightRows() {

}