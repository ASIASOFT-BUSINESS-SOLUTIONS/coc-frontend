import { API_GUEST } from "../constants/api.constant";
import { newHeader } from "../stores/userStore.js";

export async function getGuests(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_GUEST}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch guests list");
    return res.json();
}

export async function getGuest(id) {
    try {
        const myHeaders = newHeader();

        const response = await fetch(`${API_GUEST}/view`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ guestKey: id }),
        });

        if (!response.ok) throw new Error("Failed to get guest detail");
        const raw = await response.json();

        return raw;
    } catch (error) {
        console.error("Fetching failed:", error);
        return null;
    }
}

export async function editGuest(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_GUEST}/update`, {
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
        return { success: false, status: null, message: networkErr.message || "Network error" };
    }
}

export async function deleteGuest(id) {
    const myHeaders = newHeader();

    const res = await fetch(`${API_GUEST}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ guestKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function deactivateOrActivateGuest(id) {
    const myHeaders = newHeader();

    const res = await fetch(`${API_GUEST}/activation`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify({ guestKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function guestInquiry() {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_GUEST}/inquiry`, {
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
        return { success: false, status: null, message: networkErr.message || "Network error" };
    }
}
