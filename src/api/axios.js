import axios from "axios";
import { clearUser } from "../redux/UserReducer";
import { store } from "../redux/Store";
// UI loading actions (inline names to avoid circular imports if refactored)
const uiStartLoading = () => ({ type: 'ui/startLoading' });
const uiStopLoading = () => ({ type: 'ui/stopLoading' });

let baseURL = "";

try {
  const envBase = import.meta.env?.VITE_API_URL;
  if (envBase) {
    baseURL = envBase;
  } else if (typeof window !== 'undefined' && window.location.origin.includes("localhost")) {
    baseURL = "http://localhost:8080";
  } else {
    baseURL = "https://marcus-be.onrender.com";
  }
} catch (_) {
  baseURL = "https://marcus-be.onrender.com";
}


const instance = axios.create({
  baseURL,
});

// Function to set up interceptors
let interceptorsSet = false;
export const setupAxiosInterceptors = (dispatch, navigate) => {
  if (interceptorsSet) return;
  // Attach Authorization header from Redux token
  instance.interceptors.request.use((config) => {
    try {
      const state = store.getState();
      const token = state?.user?.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      dispatch(uiStartLoading());
    } catch (_) {}
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      try { dispatch(uiStopLoading()); } catch(_){}
      return response;
    },
    (error) => {
      try { dispatch(uiStopLoading()); } catch(_){}
      // Only force logout on 401 Unauthorized. 403 can occur for other reasons (e.g., missing header on a single call).
      if (error.response && error.response.status === 401) {
        dispatch(clearUser());
        navigate("/login");
      }
      return Promise.reject(error); // Forward the error
    }
  );
  interceptorsSet = true;
};

// Function to construct full image URLs
export const getImageUrl = (imagePath) => {
  return `${baseURL}/images/${imagePath}`;
};

export default instance;
