const API_KEY = "AIzaSyCGh11mVrfvEYEY--H8D4THUxPC2axbjeM"; //Jungmin Lee's Google Sheets API key
const SPREADSHEET_ID = "11mestl91E6M6gFYVKHqBTtW6R-jzMWajS0qpzalra4w"; //CS Rooms spreadsheet
const SHEET_NAME = "Sheet1!A1:F64";

const fabButton = document.querySelector('.fab-button');
const modal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const openEventModal = document.getElementById('openEventModal');
const closeEventModal = document.getElementById('closeEventModal') || closeModal;
const reportModal = document.getElementById('reportModal');
const openReportModal = document.getElementById('openReportModal');
const closeReportModal = document.getElementById('closeReportModal');
const submitBtn = document.getElementById('submitEvent');
const titleInput = document.getElementById('eventTitle');
const timeInput = document.getElementById('eventTime');
const uploadBox = document.getElementById('uploadBox');
const uploadText = document.getElementById('uploadText');
const fileInput = document.getElementById('fileInput');

const showModal = (element) => element?.classList.add('active');
const hideModal = (element) => element?.classList.remove('active');

// Open event modal when plus is clicked
(openEventModal || fabButton)?.addEventListener('click', () => {
    showModal(modal);
});

// Close event modal when X is clicked
closeEventModal?.addEventListener('click', () => {
    hideModal(modal);
});

// Open report modal when report icon is clicked
openReportModal?.addEventListener('click', () => {
    showModal(reportModal);
});

// Close report modal when X is clicked
closeReportModal?.addEventListener('click', () => {
    hideModal(reportModal);
});

// Close modal if user clicks outside the yellow box
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal(modal);
    }
    if (e.target === reportModal) {
        hideModal(reportModal);
    }
});

// Clicking upload box should open file chooser
uploadBox.addEventListener('click', () => {
    fileInput.click();
});

// Show selected file name
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        uploadText.textContent = fileInput.files[0].name;
    } else {
        uploadText.textContent = 'Upload file here';
    }
});

// Handle event creation
submitBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const time = timeInput.value.trim();
    if (!title || !time) {
        alert('Please provide both a title and time.');
        return;
    }

    // build card HTML
    const card = document.createElement('div');
    card.className = 'card';

    const p = document.createElement('p');
    p.className = 'card-title';
    p.textContent = `${title} | ${time}`;
    card.appendChild(p);

    const flyer = document.createElement('div');
    flyer.className = 'flyer-box';
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            flyer.appendChild(img);
        } else {
            const span = document.createElement('span');
            span.textContent = file.name;
            flyer.appendChild(span);
        }
    } else {
        flyer.innerHTML = '<em>[Flyer]</em>';
    }
    card.appendChild(flyer);

    // append to your events grid
    const yourGrid = document.querySelector('#yourEvents .card-grid');
    yourGrid.appendChild(card);

    // reset form and close modal
    titleInput.value = '';
    timeInput.value = '';
    fileInput.value = '';
    uploadText.textContent = 'Upload file here';
    modal.classList.remove('active');
});

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