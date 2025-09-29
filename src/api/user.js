import { API_USER, API_LOGIN } from "../constants/api.constant";
import { newHeader } from "../stores/userStore.js";

export async function getUsers(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_USER}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch users list");
    return res.json();
}

export async function getUser(id) {
    try {
        const myHeaders = newHeader();

        const response = await fetch(`${API_USER}/view`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ userKey: id }),
        });

        if (!response.ok) throw new Error("Failed to get user detail");
        const raw = await response.json();

        return raw;
    } catch (error) {
        console.error("Fetching failed:", error);
        return null;
    }
}

export async function deleteUser(id) {
    const myHeaders = newHeader();
    const res = await fetch(`${API_USER}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ userKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function createUser(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_USER}/add`, {
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
        return { success: false, status: null, message: networkErr.message || "Network error" };
    }
}

export async function editUser(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_USER}/update`, {
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

export async function getRolesAndVoucherTypes(params = {}) {
    const myHeaders = newHeader();
    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_USER}/entryCatg?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher types and guest list");
    return res.json();
}

// Login
export async function authLogin(data) {
    const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    else return res.json();
}

export async function changeUserPassword(data) {
    const myHeaders = newHeader();
    try {
        const res = await fetch(`${API_USER}Profile/update`, {
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
