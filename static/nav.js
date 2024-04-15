/* Category navigation. */
const categoryData = JSON.parse(document.getElementById("categoryJSON").textContent);

async function buildCategoryNav(listId = "categoryList") {
    for (const [category, count] of Object.entries(categoryData)) {
        const liElement = document.createElement("li");
        liElement.className = "nav-item";
        const aElement = fmtCategory(category, true);
        aElement.classList.add("dropdown-item");
        aElement.classList.add("nav-link");
        aElement.innerText += ` (${count})`;
        liElement.appendChild(aElement);
        aElement.title = liElement.title = `${category} (${count})`;
        document.getElementById(listId).appendChild(liElement);
    };
};

/* External navigation links. */
async function buildNavLinks(listId = "navList") {
    for (const [item, icon] of Object.entries(categoryIcons)) {
        const liElement = document.createElement("li");
        liElement.className = "nav-item";
        liElement.title = `${item.charAt(0).toUpperCase()}${item.slice(1)}`;
        const aElement = document.createElement("a");
        aElement.classList.add("nav-link");
        aElement.classList.add("bi");
        aElement.classList.add(`bi-${icon}`);
        const hostname = `${item}.home.ericoc.com`;
        aElement.href = `https://${hostname}/`;

        const response = await fetch(`https://dns.google/resolve?name=${hostname}`);
        const json = await response.json();
        if ((json) && (json["Status"] == 0)) {
            aElement.innerText = ` ${liElement.title}`;
            aElement.target = "_blank";
            liElement.appendChild(aElement);
            document.getElementById(listId).appendChild(liElement);
        };
    };
};

/* Build navigation. */
async function buildNavigation() {
    await buildCategoryNav();
    await buildNavLinks();
};
