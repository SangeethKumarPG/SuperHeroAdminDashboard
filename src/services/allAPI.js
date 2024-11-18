import { baseURL } from "./baseURL";
import { commonAPI } from "./commonAPI";

export const loginAPI = async(data)=>{
    return await commonAPI("POST", baseURL+"/login", data, "");
}