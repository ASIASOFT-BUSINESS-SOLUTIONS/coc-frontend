import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import VoucherRedemptionLog from "../modules/+voucher-log/VoucherRedemptionLog.vue";
import Guest from "../modules/+guest/Guest.vue";
import Attendance from "../modules/+attendance/Attendance.vue";
import User from "../modules/+user/User.vue";
import UserForm from "../modules/+user/UserForm.vue";
import GuestDetail from "../modules/+guest/GuestDetail.vue";
import GuestForm from "../modules/+guest/GuestForm.vue";
import UserDetail from "../modules/+user/UserDetail.vue";
import VoucherType from "../modules/+voucher-type/VoucherType.vue";
import VoucherTypeForm from "../modules/+voucher-type/VoucherTypeForm.vue";
import VoucherTypeDetail from "../modules/+voucher-type/VoucherTypeDetail.vue";
import VoucherBatchList from "../modules/+voucher/VoucherBatchList.vue";
import VoucherBatchDetail from "../modules/+voucher/VoucherBatchDetail.vue";
import VoucherBatchForm from "../modules/+voucher/VoucherBatchForm.vue";
import NotFound from "../views/NotFound.vue";
import { useUserStore } from "../stores/userStore";
import { API_BACKOFFICE } from "../constants/api.constant";

const routes = [
    {
        path: "/",
        redirect: () => {
            return !!localStorage.getItem("authToken") ? "/dashboard" : "/login";
        },
    },
    { path: "/login", name: "Login", component: Login, meta: { hideLayout: true } },
    { path: "/dashboard", name: "Dashboard", component: Dashboard, meta: { requiresAuth: true } },
    {
        path: "/voucher-type",
        meta: { requiresAuth: true },
        children: [
            { path: "", component: VoucherType },
            { path: ":id/detail", component: VoucherTypeDetail },
            { path: ":id/edit", component: VoucherTypeForm },
            { path: "create", component: VoucherTypeForm },
        ],
    },
    {
        path: "/voucher-batch-list",
        meta: { requiresAuth: true },
        children: [
            { path: "", component: VoucherBatchList },
            { path: ":id/detail", component: VoucherBatchDetail },
            { path: ":id/edit", component: VoucherBatchDetail },
            { path: "batch-generate", name: "Voucher Batch Generate", component: VoucherBatchForm },
        ],
    },
    { path: "/voucher-redemption-log", component: VoucherRedemptionLog, meta: { requiresAuth: true } },
    {
        path: "/guest",
        meta: { requiresAuth: true },
        children: [
            { path: "", component: Guest },
            { path: ":id/detail", component: GuestDetail },
            { path: ":id/edit", component: GuestForm },
        ],
    },
    { path: "/attendance-log", component: Attendance, meta: { requiresAuth: true } },
    {
        path: "/user",
        meta: { requiresAuth: true },
        children: [
            { path: "", component: User },
            { path: ":id/edit", component: UserForm },
            { path: ":id/detail", component: UserDetail },
            { path: "create", component: UserForm },
        ],
    },
    {
        path: "/:catchAll(.*)*",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth) {
        if (!userStore.token) {
            next({ path: "/login" });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
