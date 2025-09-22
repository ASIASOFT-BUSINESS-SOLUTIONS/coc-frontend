import { API_ATTENDANCE } from "../constants/api.constant";
import { useUserStore } from "../stores/userStore.js";

// Attendance
export async function submitAttendance(code) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch(`${API_ATTENDANCE}/attend`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ guestCode: code }),
    });

    // if (!res.ok) return { success: false, status: res.status, message: res.message };
    if (res.status === 204) return { success: true };
    else return { success: false, status: res.status };
}

export async function getAttendance(params = {}) {
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
    const res = await fetch(`${API_ATTENDANCE}/list?${query}`, requestOptions);
    if (!res.ok) throw new Error("Failed to fetch attendance list");
    return res.json();
}
