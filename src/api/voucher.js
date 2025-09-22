import { API_BASE_URL, API_LOG, API_VOUCHER } from "../constants/api.constant";
import { useUserStore } from "../stores/userStore.js";

// Voucher
export async function getVouchers(params = {}) {
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
    const res = await fetch(`${API_VOUCHER}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher list");
    return res.json();
}

export async function getVoucher(id) {
    const userStore = useUserStore();
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userStore.token}`);

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
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ batchKey: id }),
    });

    if (res.status === 204) return { success: true };
    else return { success: false, status: res.status };
}

export async function createVoucher(data) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER}/generate`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function editVoucher(data) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER}/manage`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function getVoucherLog(params = {}) {
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
    const res = await fetch(`${API_LOG}/inquiry?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher log");
    return res.json();
}

export async function redeemVoucher(code) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER}/redeem`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ voucherNo: code }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function getVoucherTypesAndGuests(params = {}) {
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
    const res = await fetch(`${API_VOUCHER}/entryCatg?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher log");
    return res.json();
}
