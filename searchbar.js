const searchDiv = document.getElementsByClassName("search-bar")[0];
const searchIcon = document.createElement("i");
const searchbar = document.createElement("input");
searchbar.type="text";
searchbar.placeholder="Search...";
searchIcon.className = "fa fa-search";
searchIcon.id = "search";
searchDiv.appendChild(searchIcon);
searchDiv.appendChild(searchbar);

const searchModal = document.body.appendChild(document.createElement("div"));
const searchClose = document.body.appendChild(document.createElement("span"));
searchClose.id = "searchClose";
searchClose.innerHTML = "&times;";
searchModal.appendChild(searchClose);
searchModal.id = "searchModal";
searchModal.className = "modal";
searchModal.style.position = "fixed";
searchModal.style.top = "20%";
searchModal.style.left = "0";
searchModal.style.width = "100%";
searchModal.style.height = "80%";
searchModal.style.margin = "10px";
searchModal.style.backgroundColor = "rgb(255, 255, 255)";


const searchContent = document.createElement("div");
searchContent.className = "search-modal-content";
searchContent.style.display = "none";
searchModal.appendChild(searchContent);

searchClose.addEventListener("click", function() {
    searchModal.style.display = "none";
});
searchbar.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const query = searchbar.value.toLowerCase();
        const posts = document.getElementsByClassName("row");
        searchModal.style.display = "block";
        displaySearchResults(posts, query);
    }
});
function displaySearchResults(posts, query) {
    searchContent.innerHTML = "";
    Array.from(posts).forEach(post => {
        if(post.querySelector('p').textContent.toLowerCase().includes(query.toLowerCase())) {
            const result = document.createElement("div");
            result.className = "search-result";
            result.innerHTML = post.innerHTML;
            searchContent.appendChild(result);
        }
    });
}