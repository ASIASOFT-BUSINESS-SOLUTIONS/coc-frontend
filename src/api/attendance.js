import { API_ATTENDANCE } from "../constants/api.constant";
import { newHeader } from "../stores/userStore.js";

// Attendance
export async function submitAttendance(code) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_ATTENDANCE}/attend`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ guestCode: code }),
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

export async function getAttendance(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_ATTENDANCE}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch attendance list");
    return res.json();
}
