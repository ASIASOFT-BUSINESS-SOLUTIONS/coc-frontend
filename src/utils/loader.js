import { convertDatetime } from "./formatter";

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

export function exportCsv({ fileTitle, items = [], headers = [] }) {
    if (!items.length) {
        alert("No data to export");
        return;
    }

    // 1. Pick the keys/columns you want
    const activeHeaders = headers.filter((h) => h.key && h.key !== "action");
    const headerRow = activeHeaders.map((h) => `"${h.title}"`).join(",");

    // 2. Build CSV rows
    const rows = items.map((item) =>
        activeHeaders
            .map((h) => {
                let cell = item[h.key] ?? "";

                // 🕓 Format datetime fields (Malaysia timezone)
                if (h.key.toLowerCase().includes("createdat")) {
                    if (cell) {
                        cell = convertDatetime(cell);
                    }
                }

                const escaped = String(cell).replace(/"/g, '""');
                return `"${escaped}"`;
            })
            .join(",")
    );

    const csv = [headerRow, ...rows].join("\r\n");

    // 3. Create a Blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileTitle}(${Date.now()}).csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
