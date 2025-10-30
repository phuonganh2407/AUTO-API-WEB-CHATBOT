import { basePublicEndpoints } from '../../../config/api/urls.config';
import axiosClient from '../../../core/api/axiosClient';

export async function getCitiesCodes(){
    return axiosClient.get(basePublicEndpoints.urlGetCitiesCodes);
}