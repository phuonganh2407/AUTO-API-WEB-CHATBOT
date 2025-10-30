import { basePublicEndpoints } from '../../../config/api/urls.config';
import axiosClient from '../../../core/api/axiosClient';

export async function getCitiesCodes(){
    return axiosClient.get(basePublicEndpoints.urlGetCitiesCodes);
}

export async function getDistrictsCityCode(params: { cityCode: string }) {
    return axiosClient.get(basePublicEndpoints.urlGetDistrictsCodes, { params });
}

export async function getWardsCode(params: { districtCode: string }) {
    return axiosClient.get(basePublicEndpoints.urlGetWardsCodes, { params });
}
