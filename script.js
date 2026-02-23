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