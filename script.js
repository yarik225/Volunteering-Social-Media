const API_KEY = "AIzaSyCGh11mVrfvEYEY--H8D4THUxPC2axbjeM"; //Jungmin Lee's Google Sheets API key
const SPREADSHEET_ID = "11mestl91E6M6gFYVKHqBTtW6R-jzMWajS0qpzalra4w"; //CS Rooms spreadsheet
const SHEET_NAME = "Sheet1!A1:F64";

async function fetchSheetData() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;


        const response = await fetch(url);
        const json = await response.json();


        return json.values || [];
    } catch (error) {
        console.error("Error fetching sheet:", error);
        return [];
    }
}

function displayData(targetDivId, data) {
    const container = document.getElementById(targetDivId);
    container.innerHTML = "";


    const rows = data.slice(1);


    rows.forEach(row => {
        const item = document.createElement("div");
        item.className = "row";


        // row[#] is getting the column # at a selected row
        // So like, row[0] for example means that at the selected row we are getting the 0th column (Column A)
        //Adjust this based on the structure you decide, this is just an example
        item.innerHTML = `
            <p><strong>${row[0] || ""}</strong></p>
            <p>${row[1] || ""}</p>
            <p>${row[2] || ""}</p>
            <a href="${row[3] || ""}">More Info</a>
            <p>${row[4] || ""}</p>
            <img src="https://drive.google.com/file/d/${row[5] || ""}/preview"></img>
        `;


        container.appendChild(item);
    });
}

async function init() {
    const sheetData = await fetchSheetData();
    displayData("opportunities", sheetData);
}

init();