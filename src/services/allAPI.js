import { baseURL } from "./baseURL";
import { commonAPI } from "./commonAPI";

export const loginAPI = async (data) => {
  return await commonAPI("POST", baseURL + "/login", data, "");
};

export const getUniqueComplaintCountByType = async (headers) => {
  return await commonAPI(
    "GET",
    `${baseURL}/get-complaint-count-by-type`,
    {},
    headers
  );
};

export const getComplaintCountByDangerLevel = async (headers) => {
    return await commonAPI("GET", `${baseURL}/get-complaint-count-by-danger-level`, {}, headers);
}

export const getTokenHeader = () => {
    let headers = {};
  sessionStorage.getItem("token")
    ? (headers = {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      })
    : (headers = { "Content-Type": "application/json" });
    return headers;
};

export const getComplaintLocations = async (headers) => {
    return await commonAPI("GET", `${baseURL}/get-latest-complaint-locations`, {}, headers);
}
