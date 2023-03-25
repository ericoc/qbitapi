/* Format different qBittorrent API table fields differently */


// Added
function fmtAdded (added) {
    const addedDate = new Date(added * 1000);
    const nowDate = new Date();
    const dateDiff = nowDate - addedDate;
    return '<span title="' + addedDate + ' (' +  added + ')">' + addedDate + '</span>';
};

// CSS emojis for categories
function fmtCategory (category) {
    return '<a class="category-'+  category +'" title="' + category + '" href="/category/' + category + '">' + category + '</a>';
};

// Name
function fmtName (name) {
    return '<span title="' + name + '">' + name + '</span>';
};

// CSS colors for ratio
function fmtRatio (ratio) {
    if (ratio >= 1) {
        var ratioClass = 'done';
    } else if (ratio >= 0.5) {
        var ratioClass = 'high';
    } else if (ratio >= 0.25) {
        var ratioClass = 'low';
    } else {
        var ratioClass = 'verylow';
    };
    return '<span title="' + ratio + '"class="ratio-' + ratioClass + '">' + Number(ratio.toFixed(3)) + '</span>';
};

// CSS emoji for state
function fmtState (state) {
    return '<span title="' + state + '" class="state-' + state.toLowerCase() + '">' + state + '</span>';
};

// Format bytes to human-readable size
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

    var out = bytes.toFixed(dp) + ' ' + units[u];
    return '<span title="' + out + '">' + out + '</span>';
};
