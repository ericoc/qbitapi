/* Column format definitions. */
const columns= [
    {
        data: "name",
        render: function (data, type) {
            return type === "display" ? fmtName(data) : data;
        },
        responsivePriority: 1,
        title: "Name",
        type: "text"
    },
    {
        data: "state",
        render: function (data, type) {
            return type === "display" ? fmtState(data) : data;
        },
        responsivePriority: 2,
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
        responsivePriority: 3,
        title: "Category",
        type: "text"
    },
    {
        data: "size",
        render: function (data, type) {
            return type === "display" ? fmtSize(data) : data;
        },
        responsivePriority: 4,
        title: "Size",
        type: "num"
    },
    {
        data: "ratio",
        render: function (data, type, row, meta) {
            return type === "display" ? fmtRatio(data) : data;
        },
        responsivePriority: 5,
        searchable: false,
        title: "Ratio",
        type: "num"
    },
    {
        data: "added_on",
        render: function (data, type) {
            return type === "display" || type === "filter" ? fmtAdded(data, type) : data;
        },
        responsivePriority: 6,
        title: "Added",
        type: "num"
    },
    {
        data: "content_path",
        render: function (data, type) {
            return type === "display" || type === "filter" ? fmtCode(data) : data;
        },
        responsivePriority: 7,
        title: "Path",
        type: "path"
    }
];
