import { API_GUEST } from "../constants/api.constant";
import { useUserStore } from "../stores/userStore.js";

export async function getGuests(params = {}) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
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
    const userStore = useUserStore();
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userStore.token}`);

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
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_GUEST}/update`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function deleteGuest(id) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");

    const res = await fetch(`${API_GUEST}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ guestKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function deactivateOrActivateGuest(id) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");

    const res = await fetch(`${API_GUEST}/activation`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify({ guestKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}
