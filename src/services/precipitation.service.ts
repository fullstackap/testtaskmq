import { ItemData } from "../types";
import http from "../axios";

class PrecipitationService {
  constructor() {}

  getAll = () => {
    return http.get<any>("/weather-service-archive/precipitation");
  }

  getOne = (id: string) => {
    return http.get<any>(`/weather-service-archive/precipitation/${id}`);
  }

  create = (data: ItemData[]) => {
    return http.post<any>("/weather-service-archive/precipitation", data);
  }

  update = (id: string, data: ItemData) => {
    return http.put<any>(`/weather-service-archive/precipitation/${id}`, data);
  }

  deleteP = (id: string) => {
    return http.delete<any>(`/weather-service-archive/precipitation/${id}`);
  }

  deleteAll = () => {
    return http.delete<any>(`/weather-service-archive/precipitation`);
  }

  filter = (filters:any) => {
    const filtersStrArr: any = [];
    if (filters?.fromDate) {
      filtersStrArr.push(`fromDate=${filters?.fromDate}`);
    }
    if (filters?.toDate) {
      filtersStrArr.push(`toDate=${filters?.fromDate}`);
    }
    if (filters?.fromPrecipitation) {
      filtersStrArr.push(`fromPrecipitation=${filters?.fromPrecipitation}`);
    }
    if (filters?.toPrecipitation) {
      filtersStrArr.push(`toPrecipitation=${filters?.toPrecipitation}`);
    }
    const url = `/weather-service-archive/precipitation${filtersStrArr.length > 0 ? `?${filtersStrArr.join("&")}` : ""}`;
    return http.get<any>(url);
  }
}

export default PrecipitationService;