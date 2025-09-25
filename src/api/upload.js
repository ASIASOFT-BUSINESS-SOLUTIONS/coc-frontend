import { useUserStore } from "../stores/userStore";

const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
const region = import.meta.env.VITE_CF_REGIONCODE;
const host = `${accountId}.r2.cloudflarestorage.com`;
const endpoint = `https://${host}`;
const service = "s3";

//Utility: Getting ISO Timestamping
function getISOTimeStamping(now = new Date()) {
    const iso = now.toISOString().replace(/[:\-]|\.\d{3}/g, ""); // e.g. "20250924T124530Z"
    const date = iso.slice(0, 8);
    return { amzDate: iso, date };
}

//Utility Function: HMAC encryption to Uint8Array digestible by SHA256
async function GetHMACSign(key, message) {
    const crypto = globalThis.crypto;
    const importKey = await crypto.subtle.importKey(
        "raw", //algorithm
        Uint8Array.from(key), //Reconvert to comply with Uint8ArrayLike ambiguity
        { name: "HMAC", hash: "SHA-256" }, //Key algorithm
        false, //whether the key will be extractable for AES encryption
        ["sign"] //decrypt, sign, deriveBits, Encrypt, unwrapKey, wrapKey, verify, use sign here to sign hmac key
    );
    var buffer = typeof message == "string" ? new TextEncoder().encode(message) : message;
    const signature = await crypto.subtle.sign("HMAC", importKey, Uint8Array.from(buffer));
    return new Uint8Array(signature);
}

//Utility Function: SHA256 encryption to Hexadecimal output
async function SHA256ToHex(message) {
    const crypto = globalThis.crypto;
    var buffer = typeof message == "string" ? new TextEncoder().encode(message) : message;
    var digestedbuffer = await crypto.subtle.digest("SHA-256", Uint8Array.from(buffer));
    return Array.from(new Uint8Array(digestedbuffer))
        .map((data) => data.toString(16).padStart(2, "0"))
        .join("");
}

async function GetSignKey(secret, timeStamp, regionName, service = "s3") {
    const encoded = (str) => new TextEncoder().encode(str);
    const keyedDate = await GetHMACSign(encoded("AWS4" + secret), timeStamp);
    const keyedRegion = await GetHMACSign(keyedDate, regionName);
    const keyedService = await GetHMACSign(keyedRegion, service);
    const keyedSignage = await GetHMACSign(keyedService, "aws4_request");
    return keyedSignage;
}

//Main route:
async function Cloudflare_BuildCanonicalHeader(payload) {
    const { amzDate, date } = getISOTimeStamping();
    const canonicalHeaders = `host:${host}\n` + `x-amz-content-sha256:${payload}\n` + `x-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    return { canonicalHeaders, signedHeaders };
}

export async function Cloudflare_UploadToR2({ bucket, filepath, body }) {
    var contentType = "application/octet-stream";
    const uri = `/${bucket}/${encodeURIComponent(filepath)}`;

    const payloadUint8 = typeof body === "string" ? new TextEncoder().encode(body) : body;
    const hashedPayload = await SHA256ToHex(payloadUint8);

    const { amzDate, date } = getISOTimeStamping();
    const credentialScope = `${date}/${region}/${service}/aws4_request`;
    const method = "PUT";
    const queryString = ""; //empty query string
    const canon = await Cloudflare_BuildCanonicalHeader(hashedPayload);
    const canonicalHeader = canon.canonicalHeaders;
    const signedHeader = canon.signedHeaders;
    const payload = hashedPayload;
    const CanonicalRequest = [method, uri, queryString, canonicalHeader, signedHeader, payload].join("\n");
    const hashedCanonicalRequest = await SHA256ToHex(CanonicalRequest);

    const algorithm = "AWS4-HMAC-SHA256";
    const SignString = [algorithm, amzDate, credentialScope, hashedCanonicalRequest].join("/n");

    const SignatureKey = await GetSignKey(secretAccessKey, date, region, service);

    const SignatureByte = await GetHMACSign(SignatureKey, new TextEncoder().encode(SignString));
    const Signature = Array.from(SignatureByte)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const Authorizationheader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeader}, Signature=${Signature}`;

    const url = endpoint + uri;
    const response = await fetch(url, {
        method: method,
        headers: {
            Host: host,
            "x-amz-date": amzDate,
            "x-amz-content-sha256": payload,
            Authorization: Authorizationheader,
            "Content-Type": contentType,
            "access-control-allow-origin": "localhost:5173",
        },
        body: Uint8Array.from(payloadUint8),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed with code ${response.status}: ${response.statusText}, ${text}`);
    }

    return { status: response.status, statusText: response.statusText };
}

async function Cloudflare_GetR2({ bucket, key, body }) {
    var contentType = "application/octet-stream";
    const uri = `/${bucket}/${encodeURIComponent(key)}`;

    const payloadUint8 = typeof body === "string" ? new TextEncoder().encode(body) : body;
    const hashedPayload = await SHA256ToHex(payloadUint8);

    const { amzDate, date } = getISOTimeStamping();
    const credentialScope = `${date}/${region}/${service}/aws4_request`;
    const method = "GET";
    const queryString = ""; //empty query string
    const canon = await Cloudflare_BuildCanonicalHeader(hashedPayload);
    const canonicalHeader = canon.canonicalHeaders;
    const signedHeader = canon.signedHeaders;
    const payload = hashedPayload;
    const CanonicalRequest = [method, uri, queryString, canonicalHeader, signedHeader, payload].join("\n");
    const hashedCanonicalRequest = await SHA256ToHex(CanonicalRequest);

    const algorithm = "AWS4-HMAC-SHA256";
    const SignString = [algorithm, amzDate, credentialScope, hashedCanonicalRequest].join("/n");

    const SignatureKey = await GetSignKey(secretAccessKey, date, region, service);
    const SignatureByte = await GetHMACSign(SignatureKey, new TextEncoder().encode(SignString));
    const Signature = Array.from(SignatureByte)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const Authorizationheader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeader}, Signature=${Signature}`;

    const url = endpoint + uri;
    const response = await fetch(url, {
        method: method,
        headers: {
            Host: host,
            "x-amz-date": amzDate,
            "x-amz-content-sha256": payload,
            Authorization: Authorizationheader,
            "Content-Type": contentType,
        },
        body: Uint8Array.from(payloadUint8),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed with code ${response.status}: ${response.statusText}, ${text}`);
    }

    console.log("%c Response: ", "background: #222; color: #bada55", response);
    return response.arrayBuffer();
}

const url = `https://asiasoft-rewards-production.developer-63f.workers.dev/uploads`;
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
