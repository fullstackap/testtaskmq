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
      console.error({ function: "getOne", err });
    }

  }

  create = async (data: ItemData[], callback: any) => {
    try {
      const response = await TemperatureService.create(data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "create", err });
    }

  }

  update = async (id: string, data: ItemData, callback: any) => {
    try {
      const response = await TemperatureService.update(id, data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "update", err });
    }

  }

  deleteT = async (id: string, callback: any) => {
    try {
      const response = await TemperatureService.deleteT(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "deleteT", err });
    }

  }

  deleteAll = async (callback: any) => {
    try {
      const response = await TemperatureService.deleteAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "deleteAll", err });
    }

  }

  filter = async (filters: any, callback: any) => {
    try {
      const response = await TemperatureService.filter(filters);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "filter", err });
    }
  }
}

export default new TemperatureServiceCalls();