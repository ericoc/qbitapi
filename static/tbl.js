/* Table setup and definition. */
const torrents = [];
function buildTorrent(torrent) { torrents.push(torrent); };
const torrentData = JSON.parse(document.getElementById("torrents").textContent);
torrentData.forEach(buildTorrent);
const pageTable = new DataTable(
    "#torrentsTable", {
        columns: columns,
        buttons: ["copy", "excel", "pdf"],
        data: torrents,
        // dom: 'Bfrtip',
        lengthMenu: [
            [5, 10, 15, 20, 25, 50, 75, 100, -1],
            [5, 10, 15, 20, 25, 50, 75, 100, "all"]
        ],
        order: [[6, "desc"],],
        pageLength: 15,
        responsive: { responsive: true }
    }
);
const searchKeyword = window.location.hash.substring(1);
if (searchKeyword) { doSearch(searchKeyword); };
