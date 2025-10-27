import { basePublicEndpoints } from '../../config/urls.config';
import axiosClient from '../../core/axiosClient';

export async function getCitiesCodes(){
    return axiosClient.get(basePublicEndpoints.urlGetCitiesCodes);
}