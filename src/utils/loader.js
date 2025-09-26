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
    if (sortBy?.length) {
        const { key, order } = sortBy[0];
        data.sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];
            if (key.toLowerCase().includes("date")) {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            return order === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
        });
    }

    // Pagination (support -1 to show all)
    const total = data.length;
    const items = itemsPerPage === -1 ? data : data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { items, total };
}
