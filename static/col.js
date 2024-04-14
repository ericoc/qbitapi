/* Column format definitions. */
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
