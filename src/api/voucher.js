import { API_BASE_URL, API_VOUCHER_LOG, API_VOUCHER } from "../constants/api.constant";
import { newHeader } from "../stores/userStore.js";

// Voucher
export async function getVouchers(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_VOUCHER}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher list");
    return res.json();
}

export async function getVoucher(id) {
    try {
        const myHeaders = newHeader();

        const response = await fetch(`${API_VOUCHER}/view`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ batchKey: id }),
        });

        if (!response.ok) throw new Error("Failed to get voucher detail");
        const raw = await response.json();

        return raw;
    } catch (error) {
        console.error("Fetching failed:", error);
        return null;
    }
}

export async function deleteVoucher(id) {
    const myHeaders = newHeader();
    const res = await fetch(`${API_VOUCHER}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ batchKey: id }),
    });

    if (res.status === 204) return { success: true };
    else return { success: false, status: res.status };
}

export async function createVoucher(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_VOUCHER}/generate`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (res.status === 204) return { success: true };
        if (!res.ok) {
            const err = await res.json();
            let errorMsg = "";
            if (typeof err.message === "string") {
                // simple string message
                errorMsg = err.message;
            } else if (Array.isArray(err.message)) {
                // array of objects: pick the first key/value pair(s)
                errorMsg = err.message
                    .map((obj) =>
                        Object.entries(obj)
                            .map(([key, val]) => `[${key}] - ${val}`)
                            .join(", ")
                    )
                    .join(" | ");
            } else {
                // fallback
                errorMsg = "Unknown error";
            }
            return { success: false, status: res.status, message: errorMsg };
        }
    } catch (error) {
        return { success: false, status: null, message: error.message || "Network error" };
    }
}

export async function editVoucher(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_VOUCHER}/manage`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(data),
        });

        if (res.status === 204) return { success: true };
        if (!res.ok) {
            const err = await res.json();
            let errorMsg = "";
            if (typeof err.message === "string") {
                // simple string message
                errorMsg = err.message;
            } else if (Array.isArray(err.message)) {
                // array of objects: pick the first key/value pair(s)
                errorMsg = err.message
                    .map((obj) =>
                        Object.entries(obj)
                            .map(([key, val]) => `[${key}] - ${val}`)
                            .join(", ")
                    )
                    .join(" | ");
            } else {
                // fallback
                errorMsg = "Unknown error";
            }
            return { success: false, status: res.status, message: errorMsg };
        }
    } catch (error) {
        return { success: false, status: null, message: error.message || "Network error" };
    }
}

export async function getVoucherLog(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_VOUCHER_LOG}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher log");
    return res.json();
}

export async function redeemVoucher(code) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_VOUCHER}/redeem`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ voucherNo: code }),
        });

        if (res.status === 204) return { success: true };
        if (!res.ok) {
            const data = await res.json();
            return { success: false, status: res.status, message: data.message };
        }
    } catch (error) {
        return { success: false, status: null, message: error.message || "Network error" };
    }
}

export async function getVoucherTypesAndGuests(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_VOUCHER}/entryCatg?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher types and guest list");
    return res.json();
}

export async function voucherInquiry() {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_VOUCHER}/inquiry`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                basedOnFoodSelection: true,
                foodSelectionWithDtl: true,
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            return { success: false, status: res.status, message: data.message };
        } else return res.json();
    } catch (error) {
        return { success: false, status: null, message: error.message || "Network error" };
    }
}
