// Inject this script into all pages and call showEventPopup when necessary
// Styles and html are automatically injected
// Use id newEventPopupStyles if manually adding stylesheet

var eventPopup = document.querySelector("#newEventPopup");

function showEventPopup() {
    eventPopup.setAttribute("style", "");
    fixdatesize();
}
function hideEventPopup() {
    eventPopup.setAttribute("style", "display: none");
}

if(!document.querySelector("#newEventPopupStyles")) {
    var styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("href", "newEventPopup.css");
    styles.setAttribute("id", "newEventPopupStyles");
    document.head.appendChild(styles);
}
if(!eventPopup) {
    eventPopup = document.createElement("div");
    eventPopup.setAttribute("id", "newEventPopup");
    hideEventPopup();
    eventPopup.innerHTML = `
    <div id="newEventPopupInner">
        <div class="newEventPopupHeader">New Event</div>
        <div class="newEventPopupInputGroup">
            <div class="newEventPopupText">Title:</div>
            <div class="newEventPopupInputContainer">
                <div id="newEventPopupForumTitle" class="newEventPopupInput" data-placeholder="What's happening?" contenteditable="true"></div>
            </div>
            <div class="newEventPopupText">Description:</div>
            <div class="newEventPopupInputContainer">
                <div id="newEventPopupForumDescription" class="newEventPopupInput" data-placeholder="What's really happening?" contenteditable="true"></div>
            </div>   
            <div class="newEventPopupText">Time:</div>
            <div class="newEventPopupInputContainer">
                <input id="newEventPopupForumTime" class="newEventPopupInput" type="datetime-local">
            </div>     
            <div class="newEventPopupText">Place:</div>
            <div class="newEventPopupInputContainer">
                <div id="newEventPopupForumPlace" class="newEventPopupInput" data-placeholder="Where's it happening?" contenteditable="true"></div>
            </div>     
        </div>
    </div>
    
    `
    document.body.prepend(eventPopup);
}
for(var i of document.querySelectorAll(".newEventPopupInput")) {
    i.addEventListener("input", function(e) {
        var replaceInner = e.target.innerHTML == "<div><br></div>" || e.target.innerHTML == "<br>"
        e.target.classList.toggle("hideBefore", e.target.innerText.length > 0 && !replaceInner);
        if(replaceInner) e.target.innerHTML = "";
    })
}
function fixdatesize() {
    document.getElementById("newEventPopupForumTime").style.setProperty("height",  `calc(${document.getElementById("newEventPopupForumPlace").getBoundingClientRect().height}px - calc(2 * max(0.5vh, 0.5vw)))`);
}
function onresizee() {
    fixdatesize();
}
document.addEventListener("resize", onresizee);
onresizee();
//showEventPopup()