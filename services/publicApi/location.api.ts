import { basePublicEndpoints } from '../../config/urls.config';
import axiosClient from '../../core/axiosClient';

/**
 *  Lấy danh sách mã thành phố
 * @returns 
 */
export async function getCitiesCodes(){
    return axiosClient.get(basePublicEndpoints.urlGetCitiesCodes);
}

/**
 *  Lấy danh sách mã quận/huyện theo mã thành phố
 * @param params  Mã thành phố
 * @returns 
 */
export async function getDistrictsCityCode(params?: { cityCode?: string }){
    return axiosClient.get(basePublicEndpoints.urlGetDistrictsCodes, { params });
}

/**
 *  Lấy danh sách mã phường/xã theo mã quận/huyện
 * @param params Mã quận/huyện
 * @returns 
 */
export async function getWardsCode(params?: { districtCode?: string }){
    return axiosClient.get(basePublicEndpoints.urlGetWardsCodes, { params });
}