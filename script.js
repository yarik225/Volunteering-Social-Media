const API_KEY = "AIzaSyCGh11mVrfvEYEY--H8D4THUxPC2axbjeM";
const SPREADSHEET_ID = "11mestl91E6M6gFYVKHqBTtW6R-jzMWajS0qpzalra4w";
const SHEET_NAME = "Sheet1!A1:F64";

const fabButton = document.querySelector('.fab-button');
const modal = document.getElementById('eventModal');
const closeModal = document.getElementById('closeModal');
const submitBtn = document.getElementById('submitEvent');
const titleInput = document.getElementById('eventTitle');
const timeInput = document.getElementById('eventTime');
const uploadBox = document.getElementById('uploadBox');
const uploadText = document.getElementById('uploadText');
const fileInput = document.getElementById('fileInput');

// MODAL LOGIC (Only runs if the modal exists on the current page)
if (modal) {
    fabButton.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    uploadBox?.addEventListener('click', () => fileInput.click());

    fileInput?.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            uploadText.textContent = fileInput.files[0].name;
        } else {
            uploadText.textContent = 'Upload file here';
        }
    });

    submitBtn?.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const time = timeInput.value.trim();
        if (!title || !time) {
            alert('Please provide both a title and time.');
            return;
        }

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
                flyer.textContent = file.name;
            }
        } else {
            flyer.innerHTML = '<em>[Flyer]</em>';
        }
        card.appendChild(flyer);

        const yourGrid = document.querySelector('#yourEvents .card-grid');
        yourGrid.appendChild(card);

        titleInput.value = '';
        timeInput.value = '';
        fileInput.value = '';
        uploadText.textContent = 'Upload file here';
        modal.classList.remove('active');
    });
} else {
    // If we are NOT on index.html, clicking "+" sends us back home to add an event
    fabButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// SHEETS API LOGIC (Runs only on pages with the #opportunities div)
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
    if (!container) return;
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
            <img src="https://drive.google.com/file/d/${row[5] || ""}/preview" style="width:100px;"></img>
        `;
        container.appendChild(item);
    });
}

async function init() {
    if (document.getElementById("opportunities")) {
        const sheetData = await fetchSheetData();
        displayData("opportunities", sheetData);
    }
}

init();
