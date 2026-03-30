
const API_KEY = "AIzaSyCGh11mVrfvEYEY--H8D4THUxPC2axbjeM"; 
const SPREADSHEET_ID = "11mestl91E6M6gFYVKHqBTtW6R-jzMWajS0qpzalra4w"; 
const SHEET_NAME = "Sheet1!A1:F64";

// Selectors - Event Modal
const fabButton = document.getElementById('openEventModal');
const eventModal = document.getElementById('eventModal');
const closeEventModal = document.getElementById('closeEventModal');
const submitBtn = document.getElementById('submitEvent');
const titleInput = document.getElementById('eventTitle');
const timeInput = document.getElementById('eventTime');
const uploadBox = document.getElementById('uploadBox');
const uploadText = document.getElementById('uploadText');
const fileInput = document.getElementById('fileInput');

// Selectors - Report Modal
const reportModal = document.getElementById('reportModal');
const openReportBtn = document.getElementById('openReportModal');
const closeReportBtn = document.getElementById('closeReportModal');
const submitReportBtn = document.getElementById('submitReport');

// --- EVENT MODAL LOGIC ---
fabButton.addEventListener('click', () => eventModal.classList.add('active'));
closeEventModal.addEventListener('click', () => eventModal.classList.remove('active'));

uploadBox.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
    uploadText.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'Upload file here';
});

submitBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const time = timeInput.value.trim();
    if (!title || !time) {
        alert('Please provide both a title and time.');
        return;
    }

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <p class="card-title">${title} | ${time}</p>
        <div class="flyer-box"></div>
    `;

    const flyer = card.querySelector('.flyer-box');
    if (fileInput.files.length > 0 && fileInput.files[0].type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(fileInput.files[0]);
        img.style.maxWidth = '100%';
        flyer.appendChild(img);
    } else {
        flyer.innerHTML = '<em>[Flyer]</em>';
    }

    document.querySelector('#yourEvents .card-grid').appendChild(card);
    
    // Reset
    titleInput.value = ''; timeInput.value = ''; fileInput.value = '';
    uploadText.textContent = 'Upload file here';
    eventModal.classList.remove('active');
});

// --- REPORT MODAL LOGIC ---
openReportBtn.addEventListener('click', () => reportModal.classList.add('active'));
closeReportBtn.addEventListener('click', () => reportModal.classList.remove('active'));

if (submitReportBtn) {
    submitReportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // If there is an inline report form (legacy), we keep this as fallback.
        const name = document.getElementById('reportName')?.value.trim();
        const error = document.getElementById('reportError')?.value.trim();
        if (!name || !error) {
            alert('Please enter your name and the error description.');
            return;
        }
        alert('Report submitted locally. Thanks for your feedback!');
        reportModal.classList.remove('active');
    });
}

// Universal close for clicking outside modals
window.addEventListener('click', (e) => {
    if (e.target === eventModal) eventModal.classList.remove('active');
    if (e.target === reportModal) reportModal.classList.remove('active');
});

// --- GOOGLE SHEETS LOGIC ---
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
        item.innerHTML = `
            <p><strong>${row[0] || ""}</strong></p>
            <p>${row[1] || ""}</p>
            <p>${row[2] || ""}</p>
            <a href="${row[3] || ""}">More Info</a>
            <p>${row[4] || ""}</p>
            <img src="https://drive.google.com/file/d/${row[5] || ""}/preview" style="width:100px;">
        `;
        container.appendChild(item);
    });
}

async function init() {
    const sheetData = await fetchSheetData();
    displayData("opportunities", sheetData);
}

init();