export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_BACKOFFICE = `${API_BASE_URL}/backoffice`;

// Guest
export const API_GUEST = `${API_BACKOFFICE}/guest`;

// User
export const API_USER = `${API_BACKOFFICE}/user`;

// Voucher Type
export const API_VOUCHER_TYPE = `${API_BACKOFFICE}/voucherType`;

// Voucher
export const API_VOUCHER = `${API_BACKOFFICE}/voucher`;

// Log
export const API_VOUCHER_LOG = `${API_BACKOFFICE}/voucherLog`;

// Login
export const API_LOGIN = `${API_BACKOFFICE}/auth/login`;

// Attendance
export const API_ATTENDANCE = `${API_BACKOFFICE}/guestAttendance`;

// Enquiry
export const API_ENQUIRY = `${API_BACKOFFICE}/guestFollowUp`;
