import { API_ENQUIRY } from "../constants/api.constant";
import { newHeader } from "../stores/userStore.js";

export async function getGuestEnquiries(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_ENQUIRY}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch guests enquiries list");
    return res.json();
}

export async function createGuestEnquiry(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_ENQUIRY}/followUp`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
        });

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
        } else {
            const data = await res.json();
            return { success: true, data: data.data };
        }
    } catch (error) {
        return { success: false, status: null, message: error.message || "Network error" };
    }
}

export async function editGuestEnquiry(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_ENQUIRY}/manage`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(data),
        });

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
        if (res.status === 204) {
            return { success: true };
        }
    } catch (error) {
        return { success: false, status: null, message: error.message || "Network error" };
    }
}
