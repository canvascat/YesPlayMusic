import router from "@/router";
import { doLogout, getCookie } from "@/utils/auth";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const baseURL = "/api";

const service = axios.create({
	baseURL,
	withCredentials: true,
	timeout: 15000,
});

service.interceptors.request.use(function (config) {
	if (!config.params) config.params = {};
	if (baseURL.length) {
		if (baseURL[0] !== "/" && !window.IS_ELECTRON && getCookie("MUSIC_U") !== null) {
			config.params.cookie = `MUSIC_U=${getCookie("MUSIC_U")};`;
		}
	} else {
		console.error("You must set up the baseURL in the service's config");
	}

	if (!window.IS_ELECTRON && config.url && !config.url.includes("/login")) {
		config.params.realIP = "211.161.244.70";
	}

	// Force real_ip
	const enableRealIP = JSON.parse(localStorage.getItem("settings") ?? "{}").enableRealIP;
	const realIP = JSON.parse(localStorage.getItem("settings") ?? "{}").realIP;
	if (import.meta.env.VUE_APP_REAL_IP) {
		config.params.realIP = import.meta.env.VUE_APP_REAL_IP;
	} else if (enableRealIP) {
		config.params.realIP = realIP;
	}

	const proxy = JSON.parse(localStorage.getItem("settings") ?? "{}").proxyConfig;
	if (["HTTP", "HTTPS"].includes(proxy.protocol)) {
		config.params.proxy = `${proxy.protocol}://${proxy.server}:${proxy.port}`;
	}

	return config;
});

service.interceptors.response.use(
	(response) => {
		const res = response.data;
		return res;
	},
	async (error) => {
		/** @type {import('axios').AxiosResponse | null} */
		let response: AxiosResponse | null = null;
		let data: any;
		if (error === "TypeError: baseURL is undefined") {
			response = error;
			data = error;
			console.error("You must set up the baseURL in the service's config");
		} else if (error.response) {
			response = error.response;
			data = response?.data;
		}

		if (response && typeof data === "object" && data.code === 301 && data.msg === "需要登录") {
			console.warn("Token has expired. Logout now!");

			// 登出帳戶
			doLogout();

			router.push({ name: "login" });
		}
	},
);

const request = <T = any>(config: AxiosRequestConfig) => service(config) as Promise<T>;

export const noCacheParams = <T>(params: T, noCache = true) => {
	return { ...params, timestamp: noCache ? Date.now() : undefined };
};

export default request;
