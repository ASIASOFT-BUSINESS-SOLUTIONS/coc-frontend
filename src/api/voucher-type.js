import { API_VOUCHER_TYPE } from "../constants/api.constant.js";
import { useUserStore } from "../stores/userStore.js";

// Voucher Type
export async function getVoucherTypes(params = {}) {
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
    const res = await fetch(`${API_VOUCHER_TYPE}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch voucher type list");
    return res.json();
}

export async function getVoucherType(id) {
    const userStore = useUserStore();
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${userStore.token}`);

        const response = await fetch(`${API_VOUCHER_TYPE}/view`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ voucherTypeKey: id }),
        });

        if (!response.ok) throw new Error("Failed to get voucher type detail");
        const raw = await response.json();

        return raw;
    } catch (error) {
        console.error("Fetching failed:", error);
        return null;
    }
}

export async function createVoucherType(data) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER_TYPE}/add`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function editVoucherType(data) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER_TYPE}/update`, {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify(data),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}

export async function deleteVoucherType(id) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_VOUCHER_TYPE}/delete`, {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ voucherTypeKey: id }),
    });

    if (!res.ok) return { success: false, status: res.status };
    if (res.status === 204) return { success: true };
}
