/** Return a dash if value is null/undefined/empty */
export function formatEmpty(value, dash = "-") {
    return value === null || value === undefined || value === "" ? dash : value;
}

/** Format a date to DD/MM/YYYY (from ISO or Date object) */
export function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatDatetime(value) {
    if (!value) return "-";
    const clean = value.replace(/Z$/, "");
    const d = new Date(clean);
    if (isNaN(d)) return "-";
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(d);
}

/** Format a date to DD MM YYYY (from ISO or Date object) */
export function convertDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return formatter.format(date);
}

export function statusColor(status) {
    switch (status) {
        case "Active":
            return "green";
        case "Upcoming":
            return "yellow";
        case "Redeemed":
            return "blue";
        case "Expired":
            return "red";
        default:
            return "grey";
    }
}
