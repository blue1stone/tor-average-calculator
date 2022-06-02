let calculateButton = document.getElementById("calculateButton");

// Inject the script into the page when button is clicked
calculateButton.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: calculateTORAvg,
	});
});

// Parse the table and output the TOR average
function calculateTORAvg() {
	let tor_data = [];

	let table = document.getElementsByClassName("treeTableWithIcons")[0];
	for (let i_row = 0; i_row < table.rows.length; i_row++) {
		const ROW = table.rows[i_row];
		let title = "";
		let grade = 0.0;
		let cp = 0;
		for (let i_cell = 0; i_cell < ROW.cells.length; i_cell++) {
			const CELL = ROW.cells[i_cell];
			if (
				CELL.childNodes[1] != undefined &&
				typeof CELL.childNodes[1].id == "string" &&
				CELL.childNodes[1].id.includes("unDeftxt") &&
				typeof CELL.childNodes[0].title == "string" &&
				CELL.childNodes[0].title.includes("fung")
			) {
				title = CELL.innerText;
			}
			if (
				CELL.childNodes[0] != undefined &&
				typeof CELL.childNodes[0].id == "string"
			) {
				if (CELL.childNodes[0].id.includes("grade")) {
					grade = parseFloat(CELL.innerText);
				} else if (CELL.childNodes[0].id.includes("bonus")) {
					cp = parseInt(CELL.innerText);
				}
			}
		}
		if (title != "" && !title.includes("BK")) {
			tor_data.push({ title, grade, cp });
		}
	}
	
	let sum = 0;
	let count = 0;
	for (let i = 0; i < tor_data.length; i++) {
		sum += tor_data[i].grade * tor_data[i].cp;
		count += tor_data[i].cp;
	}
	const AVG = sum / count;
	alert("Your average grade is " + AVG.toFixed(2));
}
