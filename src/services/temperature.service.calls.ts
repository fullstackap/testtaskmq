import { ItemData } from "../types";
import TemperatureService from "./temperature.service";

class TemperatureServiceCalls {
  getAll = async (callback: any) => {
    try {
      const response = await TemperatureService.getAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }
  };

  getOne = async (id: string, callback: any) => {
    try {
      const response = await TemperatureService.getOne(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }

  }

  create = async (data: ItemData[], callback: any) => {
    try {
      const response = await TemperatureService.create(data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }

  }

  update = async (id: string, data: ItemData, callback: any) => {
    try {
      const response = await TemperatureService.update(id, data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }

  }

  deleteT = async (id: string, callback: any) => {
    try {
      const response = await TemperatureService.deleteT(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }

  }

  deleteAll = async (callback: any) => {
    try {
      const response = await TemperatureService.deleteAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }

  }

  filter = async (filters: any, callback: any) => {
    try {
      const response = await TemperatureService.filter(filters);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }
  }
}

export default new TemperatureServiceCalls();