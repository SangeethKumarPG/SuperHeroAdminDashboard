import axios from 'axios';

export const commonAPI = async (httpRequest, url, requestBody, requestHeader)=>{
    const requestConfig = {
        method:httpRequest,
        url:url,
        data:requestBody,
        headers:requestHeader?requestHeader:{"Content-Type":"application/json"}
    }
    return await axios(requestConfig).then((result)=>{
        return result;
    }).catch((err)=>{
        return err;
    })
}