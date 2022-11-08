import { ItemData } from "../types";
import http from "../axios";
import { API_MAIN_PRECIPITATION_PATH } from "../constants";

class PrecipitationService {
  constructor() { }

  getAll = (offset: number, limit: number) => {
    return http.get<any>(`/${API_MAIN_PRECIPITATION_PATH}?offset=${offset}&limit=${limit}`);
  }

  getOne = (id: string) => {
    return http.get<any>(`/${API_MAIN_PRECIPITATION_PATH}/${id}`);
  }

  create = (data: ItemData[]) => {
    return http.post<any>(`/${API_MAIN_PRECIPITATION_PATH}`, data);
  }

  update = (id: string, data: ItemData) => {
    return http.put<any>(`/${API_MAIN_PRECIPITATION_PATH}/${id}`, data);
  }

  deleteP = (id: string) => {
    return http.delete<any>(`/${API_MAIN_PRECIPITATION_PATH}/${id}`);
  }

  deleteAll = () => {
    return http.delete<any>(`/${API_MAIN_PRECIPITATION_PATH}`);
  }

  filter = (filters: any) => {
    const filtersStrArr: any = [];
    
    let k: keyof typeof filters;
    for (k in filters) {
      const v = filters[k];
      filtersStrArr.push(`${k}=${v}`);
    }

    const url = `/${API_MAIN_PRECIPITATION_PATH}${filtersStrArr.length > 0 ? `?${filtersStrArr.join("&")}` : ""}`;
    return http.get<any>(url);
  }
}

export default PrecipitationService;