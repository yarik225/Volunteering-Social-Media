// ── Google Sheets Config ──
const API_KEY = "AIzaSyCGh11mVrfvEYEY--H8D4THUxPC2axbjeM";
const SPREADSHEET_ID = "11mestl91E6M6gFYVKHqBTtW6R-jzMWajS0qpzalra4w";
const SHEET_NAME = "Sheet1!A1:F64";

// ── Data Store ──
const yourEvents = [];

// ── Sort State ──
let currentSort = "datetime";

// ── DOM References ──
const modal      = document.getElementById("eventModal");
const fabButton  = document.getElementById("fabButton");
const closeModal = document.getElementById("closeModal");
const submitBtn  = document.getElementById("submitEvent");
const uploadBox  = document.getElementById("uploadBox");
const fileInput  = document.getElementById("fileInput");
const uploadText = document.getElementById("uploadText");

// ── Helpers ──

/**
 * Returns a Date object combining an event's date + time fields.
 * Falls back to far-future values if fields are missing so undated
 * events sort to the end.
 */
function parseDatetime(ev) {
    const d = ev.date || "9999-12-31";
    const t = ev.time || "23:59";
    return new Date(`${d}T${t}`);
}

/**
 * Returns a sorted copy of an array of event objects according to
 * the currently selected sort mode.
 */
function sortEvents(arr) {
    return [...arr].sort((a, b) => {
        if (currentSort === "datetime") return parseDatetime(a) - parseDatetime(b);
        if (currentSort === "date")     return (a.date || "").localeCompare(b.date || "");
        if (currentSort === "hour")     return (a.time || "").localeCompare(b.time || "");
        if (currentSort === "distance") return (a.distance || 0) - (b.distance || 0);
        return 0;
    });
}

// ── Render: Your Events ──

function renderYourEvents() {
    const grid = document.getElementById("yourEventsGrid");
    grid.innerHTML = "";
    const sorted = sortEvents(yourEvents);

    if (sorted.length === 0) {
        grid.innerHTML = '<div class="empty-state">No events yet — tap <strong>+</strong> to add one.</div>';
        return;
    }

    sorted.forEach(ev => {
        const card = document.createElement("div");
        card.className = "card";

        // Title
        const title = document.createElement("p");
        title.className = "card-title";
        title.textContent = ev.title;
        card.appendChild(title);

        // Date / time meta
        const meta = document.createElement("p");
        meta.className = "card-meta";
        const datePart = ev.date
            ? new Date(ev.date + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "";
        const timePart = ev.time
            ? `${ev.time}${ev.endTime ? "–" + ev.endTime : ""}`
            : "";
        meta.textContent = [datePart, timePart].filter(Boolean).join(" · ");
        card.appendChild(meta);

        // Flyer box
        const flyer = document.createElement("div");
        flyer.className = "flyer-box";
        if (ev.imageURL) {
            const img = document.createElement("img");
            img.src = ev.imageURL;
            flyer.appendChild(img);
        } else {
            flyer.innerHTML = '<em style="font-size:0.9rem;color:#b0a060">[Flyer]</em>';
        }
        card.appendChild(flyer);

        grid.appendChild(card);
    });
}

// ── Render: Sheet Opportunities ──

function renderOpportunities(data) {
    const grid = document.getElementById("opportunitiesGrid");
    grid.innerHTML = "";

    // Map sheet rows to event objects
    // Column layout: A=title, B=date (YYYY-MM-DD), C=time (HH:MM),
    //                D=link, E=hours, F=Google Drive image ID, G=distance (optional)
    const rows = data.slice(1).map(row => ({
        title:    row[0] || "Untitled",
        date:     row[1] || "",
        time:     row[2] || "",
        link:     row[3] || "#",
        hours:    row[4] || "",
        imageId:  row[5] || "",
        distance: parseFloat(row[6]) || 0
    }));

    const sorted = sortEvents(rows);

    if (sorted.length === 0) {
        grid.innerHTML = '<div class="empty-state">No opportunities found.</div>';
        return;
    }

    sorted.forEach(ev => {
        const card = document.createElement("div");
        card.className = "card";

        // Title
        const title = document.createElement("p");
        title.className = "card-title";
        title.textContent = ev.title;
        card.appendChild(title);

        // Date / time meta
        const meta = document.createElement("p");
        meta.className = "card-meta";
        meta.textContent = [ev.date, ev.time].filter(Boolean).join(" · ");
        card.appendChild(meta);

        // Flyer box
        const flyer = document.createElement("div");
        flyer.className = "flyer-box";
        if (ev.imageId) {
            const img = document.createElement("img");
            img.src = `https://drive.google.com/thumbnail?id=${ev.imageId}&sz=w300`;
            img.onerror = () => {
                flyer.innerHTML = '<em style="font-size:0.9rem;color:#b0a060">[Flyer]</em>';
            };
            flyer.appendChild(img);
        } else {
            flyer.innerHTML = '<em style="font-size:0.9rem;color:#b0a060">[Flyer]</em>';
        }
        card.appendChild(flyer);

        // Hours badge
        if (ev.hours) {
            const badge = document.createElement("span");
            badge.className = "card-badge";
            badge.textContent = `${ev.hours} hrs`;
            card.appendChild(badge);
        }

        // Click to open link
        if (ev.link && ev.link !== "#") {
            card.style.cursor = "pointer";
            card.addEventListener("click", () => window.open(ev.link, "_blank"));
        }

        grid.appendChild(card);
    });
}

// ── Fetch Sheet Data ──

async function fetchSheetData() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;
        const response = await fetch(url);
        const json = await response.json();
        return json.values || [];
    } catch (error) {
        console.error("Error fetching sheet:", error);
        return [];
    }
}

// ── Sort Buttons ──

document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSort = btn.dataset.sort;
        renderYourEvents();
        if (window._sheetData) renderOpportunities(window._sheetData);
    });
});

// ── Collapsible Sections ──

function setupToggle(btnId, wrapperId) {
    const btn     = document.getElementById(btnId);
    const wrapper = document.getElementById(wrapperId);

    // Start fully open
    wrapper.style.maxHeight = wrapper.scrollHeight + "px";

    btn.addEventListener("click", () => {
        const isOpen = wrapper.style.maxHeight !== "0px";
        if (isOpen) {
            wrapper.style.maxHeight = "0px";
            btn.classList.add("collapsed");
        } else {
            wrapper.style.maxHeight = wrapper.scrollHeight + "px";
            btn.classList.remove("collapsed");
        }
    });
}

// ── Modal: Open / Close ──

fabButton.addEventListener("click",  () => modal.classList.add("active"));
closeModal.addEventListener("click", () => modal.classList.remove("active"));
window.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
});

// ── Modal: File Upload Preview ──

uploadBox.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
    uploadText.textContent = fileInput.files.length > 0
        ? fileInput.files[0].name
        : "Upload file here";
});

// ── Modal: Create Event ──

submitBtn.addEventListener("click", () => {
    const title   = document.getElementById("eventTitle").value.trim();
    const date    = document.getElementById("eventDate").value;
    const time    = document.getElementById("eventTime").value;
    const endTime = document.getElementById("eventEndTime").value;

    if (!title) {
        alert("Please enter an event title.");
        return;
    }

    let imageURL = null;
    if (fileInput.files.length > 0 && fileInput.files[0].type.startsWith("image/")) {
        imageURL = URL.createObjectURL(fileInput.files[0]);
    }

    yourEvents.push({ title, date, time, endTime, imageURL, distance: 0 });
    renderYourEvents();

    // Reset form fields
    document.getElementById("eventTitle").value   = "";
    document.getElementById("eventDate").value    = "";
    document.getElementById("eventTime").value    = "";
    document.getElementById("eventEndTime").value = "";
    fileInput.value       = "";
    uploadText.textContent = "Upload file here";
    modal.classList.remove("active");

    // Expand the collapsible wrapper to fit new card
    const wrapper = document.getElementById("yourEventsWrapper");
    wrapper.style.maxHeight = wrapper.scrollHeight + 2000 + "px";
});

// ── Search ──

document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(query) ? "" : "none";
    });
});

// ── Init ──

async function init() {
    const sheetData = await fetchSheetData();
    window._sheetData = sheetData;
    renderOpportunities(sheetData);
    renderYourEvents();

    // Wait for DOM to settle before measuring heights for collapsibles
    setTimeout(() => {
        setupToggle("toggleYours", "yourEventsWrapper");
        setupToggle("toggleOpps",  "oppsWrapper");
    }, 100);
}

init();