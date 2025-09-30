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
        timeZone: "Asia/Kuala_Lumpur",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatDatetime(value) {
    if (!value) return "-";
    const clean = value.replace(/Z{2}$/, "Z");

    const d = new Date(clean);
    if (isNaN(d)) return "-";

    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(d);
}

export function convertDatetime(value) {
    const options = {
        timeZone: "Asia/Kuala_Lumpur",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    const malaysia = new Intl.DateTimeFormat("en-GB", options).format(new Date(value));
    return malaysia;
}

/** Format a date to DD MM YYYY (from ISO or Date object) */
export function convertDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
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

/**
 * Compress an image to WebP while keeping transparency.
 * @param {File} file           Original image file (PNG, etc.)
 * @param {number} targetKB     Target size in KB (default 35)
 * @param {number} maxWidth     Maximum width in pixels before downscaling
 * @returns {Promise<File>}     A new File object in WebP format
 */
export async function compressImageToWebP(file, targetKB = 35, maxWidth = 800) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Scale image if it's wider than maxWidth
            let scale = Math.min(1, maxWidth / img.width);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            function redraw() {
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            redraw();

            let quality = 0.8; // start quality
            const tryCompress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject("Compression failed");

                        const sizeKB = blob.size / 1024;
                        if (sizeKB <= targetKB || (quality <= 0.3 && scale <= 0.3)) {
                            // Done: return as File
                            resolve(
                                new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                                    type: "image/webp",
                                })
                            );
                        } else {
                            // If still too big, lower quality first, then scale
                            if (quality > 0.3) {
                                quality -= 0.1;
                            } else {
                                scale *= 0.8;
                                redraw();
                                quality = 0.8; // reset quality when resizing
                            }
                            tryCompress();
                        }
                    },
                    "image/webp",
                    quality
                );
            };

            tryCompress();
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Convert a local Date to an ISO string at midnight UTC
 * @param {Date} localDate - a Date in the user's local time zone
 * @returns {string} e.g. "2025-09-15T00:00:00.000Z"
 */
export function toMidnightUTC(localDate) {
    return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())).toISOString();
}
