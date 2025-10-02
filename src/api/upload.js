const url = import.meta.env.VITE_R2_BUCKET_URL;
/**
 *
 * @param {*} params
 * @param {File} data
 * @returns
 */
export async function uploadFile(params = {}, data) {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", data.type);

    const query = new URLSearchParams(params).toString();
    try {
        const res = await fetch(`${url}?${query}`, {
            method: "PUT",
            headers: myHeaders,
            body: data,
        });

        if (res.ok) return { success: true, data: res.url };
        else return { success: false, status: res.status, message: errorMsg };
    } catch (error) {
        return { success: false, status: null, message: networkErr.message || "Network error" };
    }
}

export async function getFile(params = {}, fileType) {
    const userStore = useUserStore();

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${userStore.token}`);
    myHeaders.append("Content-Type", fileType);

    const query = new URLSearchParams(params).toString();
    try {
        const res = await fetch(`${url}?${query}`, {
            method: "GET",
            headers: myHeaders,
        });

        if (!res.ok) throw new Error("Failed to fetch uploaded file");
        return res.json();
    } catch (error) {
        return { success: false, status: null, message: networkErr.message || "Network error" };
    }
}

export async function deleteFile(params = {}) {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const query = new URLSearchParams(params).toString();
    try {
        const res = await fetch(`${url}?${query}`, {
            method: "DELETE",
            headers: myHeaders,
        });

        if (!res.ok) throw new Error("Failed to delete uploaded file");
        else return { success: true };
    } catch (error) {
        return { success: false, status: null, message: networkErr.message || "Network error" };
    }
}
