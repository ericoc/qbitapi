/* Category navigation. */
const categoryData = JSON.parse(document.getElementById("categoryJSON").textContent);
function buildCategoryNav (categoryList= document.getElementById("categoryList")){
    for (const [category, count] of Object.entries(categoryData)) {
        const liElement = document.createElement("li");
        liElement.className = "nav-item";
        const aElement = fmtCategory(category, true);
        aElement.classList.add("dropdown-item");
        aElement.classList.add("nav-link");
        aElement.innerText += ` (${count})`;
        liElement.appendChild(aElement);
        // aElement.onClick = liElement.onClick = () => { pageTable.search(category); pageTable.draw(); };
        aElement.title = liElement.title = `${category} (${count})`;
        categoryList.appendChild(liElement);
    };
};
