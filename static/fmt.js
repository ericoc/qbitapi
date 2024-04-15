/* Column formatting. */

// Category names to Bootstrap icons.
const categoryIcons = {
    "prowlarr": "search",
    "radarr": "film",
    "software": "code-slash",
    "sonarr": "tv"
};

// Perform search.
async function doSearch (keyword=null) {
    if (keyword) {
        pageTable.search(keyword);
        pageTable.draw();
        return true;
    };
    return false;
};

// Format category names.
function fmtCategory (category="unknown", text=false, icons=categoryIcons) {
    let categoryIcon = "question";
    if (category) {
        for (const [itemName, itemIcon] of Object.entries(icons)) {
            if (category.startsWith(itemName)) {
                categoryIcon = itemIcon;
            };
        };
    };
    const link = document.createElement("a");
    link.className = `bi bi-${categoryIcon}`;
    link.href = `#${category}`;
    link.onclick = () => { return doSearch(category); };
    link.title = category;
    // Text inclusive HTML objects for navigation.
    if (text === true) {
        link.appendChild(document.createTextNode(` ${category}`));
        return link;
    };
    // Alternatively, string for table display.
    return `<a class="${link.className}" href="${link.href}" onClick="doSearch('${category}');" title="${link.title}"></a>`;
};

// Added date and time.
function fmtAdded (added, type) {
    const date = new Date(added*1000);
    const when = date.toLocaleDateString(
        "en-us", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
    if (type === "display") {
        return `<time class="small" datetime="${date.toISOString()}" title="${date.toString()}">${when}</time>`;
    };
    return when;
};

// Name.
function fmtName (name) {
    return `<small title="${name}">${name}</small>`;
};

// Code (path).
function fmtCode (data) {
    return `<code title="${data}">${data}</code>`;
};

// Ratio.
function fmtRatio (ratio) {
    let ratioClass = "verylow";
    if (ratio >= 1) {
        ratioClass = "done";
    } else if (ratio >= 0.5) {
        ratioClass = "high";
    } else if (ratio >= 0.25) {
        ratioClass = "low";
    };
    return `<b class="ratio-${ratioClass}" title="${ratio}">${Number(ratio.toFixed(3)).toString()}</b>`;
};

// State.
function fmtState (state){
    let stateClass = "error";
    let stateIcon = "question";
    if (state.startsWith("stalled")) {
        stateIcon = "pause";
    } else if (state.endsWith("UP")) {
        stateClass = "success";
        stateIcon = "arrow-up";
    } else if (state.endsWith("DOWN") || state.endsWith("DL")) {
        stateClass = "info"
        stateIcon = "arrow-down";
    };
    return `<b class="bi bi-${stateIcon}-circle flash-${stateClass}" title="${state}"></b>`;
};

// Format bytes to human-readable size.
function fmtSize (bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    const out = bytes.toFixed(dp) + ' ' + units[u];
    return fmtCode(out);
};
