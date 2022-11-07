import { ItemData } from "../types";
import PrecipitationService from "./precipitations.service";

class PrecipitationServiceCalls {
  getAll = async (callback: any) => {
    try {
      const response = await PrecipitationService.getAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }
  };

  getOne = async (id: string, callback: any) => {
    try {
      const response = await PrecipitationService.getOne(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getOne", err });
    }

  }

  create = async (data: ItemData[], callback: any) => {
    try {
      const response = await PrecipitationService.create(data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "create", err });
    }

  }

  update = async (id: string, data: ItemData, callback: any) => {
    try {
      const response = await PrecipitationService.update(id, data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "update", err });
    }

  }

  deleteP = async (id: string, callback: any) => {
    try {
      const response = await PrecipitationService.deleteP(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "deleteP", err });
    }

  }

  deleteAll = async (callback: any) => {
    try {
      const response = await PrecipitationService.deleteAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "deleteAll", err });
    }

  }

  filter = async (filters: any, callback: any) => {
    try {
      const response = await PrecipitationService.filter(filters);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "filter", err });
    }
  }
}

export default new PrecipitationServiceCalls();