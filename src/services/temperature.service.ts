import { ItemData } from "../types";
import http from "../axios";

class TemperatureService {
  getAll = () => {
    return http.get<any>("/weather-service-archive/temperature");
  }

  getOne = (id: string) => {
    return http.get<any>(`/weather-service-archive/temperature/${id}`);
  }

  create = (data: ItemData[]) => {
    return http.post<any>("/weather-service-archive/temperature", data);
  }

  update = (id: string, data: ItemData) => {
    return http.put<any>(`/weather-service-archive/temperature/${id}`, data);
  }

  deleteT = (id: string) => {
    return http.delete<any>(`/weather-service-archive/temperature/${id}`);
  }

  deleteAll = () => {
    return http.delete<any>(`/weather-service-archive/temperature`);
  }

  filter = (filters:any) => {
    const filtersStrArr: any = [];
    if (filters?.fromDate) {
      filtersStrArr.push(`fromDate=${filters?.fromDate}`);
    }
    if (filters?.toDate) {
      filtersStrArr.push(`toDate=${filters?.fromDate}`);
    }
    if (filters?.fromTemperature) {
      filtersStrArr.push(`fromTemperature=${filters?.fromTemperature}`);
    }
    if (filters?.toTemperature) {
      filtersStrArr.push(`toTemperature=${filters?.toTemperature}`);
    }
    const url = `/weather-service-archive/temperature${filtersStrArr.length > 0 ? `?${filtersStrArr.join("&")}` : ""}`;
    return http.get<any>(url);
  }
}

export default new TemperatureService();