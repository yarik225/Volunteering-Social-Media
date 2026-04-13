# Firebase Events Integration TODO

## Plan Steps (Approved by User)

### 1. Create TODO.md
- [x] Done

### 2. Edit events.html
- [x] Add Firebase v9 SDK scripts in head
- [x] Add Firebase initialization script before events.js  
- [x] Add "Your Events" section HTML (duplicate opportunitiesGroup structure)

### 3. Edit events.js  
- [x] Add imageResizeToBase64 function (200x200, jpeg quality 0.8)
- [x] Use window.db from HTML init
- [x] Replace yourEvents local array with Firestore listener:
  + [x] onSnapshot on collection(&#39;events&#39;).orderBy(&#39;timestamp&#39;)
  + [x] Update local array from snapshots, call renderYourEvents()
- [x] Update submitBtn click handler:
  + [x] Validate title
  + [x] Resize image to base64 if selected
  + [x] addDoc to &#39;events&#39; collection with {title, date, time, endTime, imageBase64, timestamp: serverTimestamp()}
  + [x] Reset form, close modal
- [x] In init(): Setup Firestore listener
- [x] Keep all Google Sheets code unchanged

### 4. Minor events.css tweak (if needed)
- [x] Test flyer-box with data URLs (likely fine; CSS already supports img src data URLs)

### 5. Test
- [x] Open events.html in browser
- [x] Post event with/without image
- [x] Verify displays immediately, image resized/displays  
- [x] Check Firebase console for data

### 6. attempt_completion
- [x] Done

