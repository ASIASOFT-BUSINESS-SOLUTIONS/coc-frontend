import { API_USER, API_LOGIN } from "../constants/api.constant";
import { useUserStore } from "../stores/userStore.js";

export async function getUsers(params = {}) {
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
    const res = await fetch(`${API_USER}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch users list");
    return res.json();
}

export async function getUser(id) {
    const userStore = useUserStore();
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userStore.token}`);

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
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_USER}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ userKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function createUser(data) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_USER}/add`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function editUser(data) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_USER}/update`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
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
