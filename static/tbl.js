// Added.
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
    return `<code title="${out}">${out}</code>`;
};

// Column format definition for DataTables.
const columns= [
    {
        data: "name",
        render: function (data, type) {
            return type === "display" ? fmtName(data) : data;
        },
        title: "Name",
        type: "text"
    },
    {
        data: "state",
        render: function (data, type) {
            return type === "display" ? fmtState(data) : data;
        },
        searchable: false,
        title: "State",
        type: "text"
    },
    {
        data: "hash",
        searchable: false,
        sortable: false,
        title: "Hash",
        type: "text",
        visible: false
    },
    {
        data: "category",
        render: function (data, type) {
            return type === "display" ? fmtCategory(data) : data;
        },
        title: "Category",
        type: "text"
    },
    {
        data: "size",
        render: function (data, type) {
            return type === "display" ? fmtSize(data) : data;
        },
        title: "Size",
        type: "num"
    },
    {
        data: "ratio",
        render: function (data, type, row, meta) {
            return type === "display" ? fmtRatio(data) : data;
        },
        searchable: false,
        title: "Ratio",
        type: "num"
    },
    {
        data: "added_on",
        render: function (data, type) {
            return type === "display" || type === "filter" ? fmtAdded(data, type) : data;
        },
        title: "Added",
        type: "num"
    }
];

const torrents = [];
function buildTorrent(torrent) {
    torrents.push(torrent);
};
