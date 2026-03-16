const API_KEY = "AIzaSyCGh11mVrfvEYEY--H8D4THUxPC2axbjeM"; //Jungmin Lee's Google Sheets API key
const SPREADSHEET_ID = "11mestl91E6M6gFYVKHqBTtW6R-jzMWajS0qpzalra4w"; //CS Rooms spreadsheet
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

// Open modal when plus is clicked
fabButton.addEventListener('click', () => {
    modal.classList.add('active');
});

// Close modal when X is clicked
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Close modal if user clicks outside the yellow box
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
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


//Events page js
var hoveredEvent = null;
for (var i of document.querySelectorAll(".event")) {
    addTilt3D(i);
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function roundPlaces(value, places) {
    return Math.floor(value * places) / places
}
function addTilt3D(el, options = {}) {
    const { 
        maxTilt = 10,
        scale = 1.02,
        perspective = 10000,
        ease = 0.08,
        maxFloat = 10000
    } = options;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentShadowX = 0;
    let currentShadowY = 0;
    let targetShadowX = 0;
    let targetShadowY = 0;
    let targetShadowTrans = 0;
    let currentShadowTrans = 0;
    let hovering = false;

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform, box-shadow";
    function animate() {
        currentX += roundPlaces(((targetX - currentX) * ease), maxFloat);
        currentY += roundPlaces(((targetY - currentY) * ease), maxFloat);

        currentX = clamp(currentX, -maxTilt, maxTilt);
        currentY = clamp(currentY, -maxTilt, maxTilt);

        currentShadowX += roundPlaces(((targetShadowX - currentShadowX) * ease), maxFloat);
        currentShadowY += roundPlaces(((targetShadowY - currentShadowY) * ease), maxFloat);

        currentShadowTrans += roundPlaces(((targetShadowTrans - currentShadowTrans) * ease), maxFloat * 100)

        el.style.transform = `
    perspective(${perspective}px)
    rotateX(${currentX}deg)
    rotateY(${currentY}deg)
    scale(${hovering ? scale : 1})
  `;

        el.style.boxShadow = `
    ${currentShadowX}px
    ${currentShadowY}px
    30px rgba(0,0,0,${currentShadowTrans})
  `;

        el.style.scale = hovering ? scale : 1

        requestAnimationFrame(animate);
    }


    animate();

    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetX = ((y - centerY) / centerY) * -maxTilt;
        targetY = ((x - centerX) / centerX) * maxTilt;

        targetShadowX = -targetY * 2 * (8000/perspective);
        targetShadowY = currentX * 2 * (8000/perspective);

        hovering = true;
    });

    el.addEventListener("mouseenter", () => {
        targetShadowTrans = 0.35;
        hovering = true;
    });

    el.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;

        targetShadowX = 0;
        targetShadowY = 0;
        targetShadowTrans = 0;

        hovering = false;
    });
}
