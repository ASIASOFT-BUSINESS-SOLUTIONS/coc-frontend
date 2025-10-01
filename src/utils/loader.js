export async function loadDatatable({
    fetchFn, // async () => { data: [...] }
    searchTerm = "",
    page = 1,
    itemsPerPage = 10,
    sortBy = [],
    searchKeys = null,
}) {
    // Fetch raw data
    const response = await fetchFn();
    let data = response?.data || [];

    // Search filter
    const term = searchTerm.trim().toLowerCase();
    if (term) {
        data = data.filter((row) => {
            const values = searchKeys ? searchKeys.map((k) => row[k]) : Object.values(row);
            return values.some((val) =>
                String(val ?? "")
                    .toLowerCase()
                    .includes(term)
            );
        });
    }

    // Sorting
    const effectiveSort = sortBy?.length
        ? [...sortBy, { key: "createdAt", order: "desc" }]
        : [{ key: "createdAt", order: "desc" }];

    data.sort((a, b) => {
        for (const { key, order } of effectiveSort) {
            let aVal = a[key];
            let bVal = b[key];

            if (key.toLowerCase().includes("date")) {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (aVal > bVal) return order === "asc" ? 1 : -1;
            if (aVal < bVal) return order === "asc" ? -1 : 1;
            // if equal → go to next key
        }
        return 0;
    });

    // Pagination (support -1 to show all)
    const total = data.length;
    const items = itemsPerPage === -1 ? data : data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { items, total };
}
