import { ItemData } from "../types";
import PrecipitationService from "./precipitation.service";

class PrecipitationServiceCalls {
  service: PrecipitationService;

  constructor() {
    this.service = new PrecipitationService();
  }

  getAll = async (callback: any = null) => {
    try {
      const response = await this.service.getAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getAll", err });
    }
  };

  getOne = async (id: string, callback: any = null) => {
    try {
      const response = await this.service.getOne(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "getOne", err });
    }

  }

  create = async (data: ItemData[], callback: any = null) => {
    try {
      const response = await this.service.create(data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "create", err });
    }

  }

  update = async (id: string, data: ItemData, callback: any = null) => {
    try {
      const response = await this.service.update(id, data);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "update", err });
    }

  }

  deleteP = async (id: string, callback: any = null) => {
    try {
      const response = await this.service.deleteP(id);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "deleteP", err });
    }

  }

  deleteAll = async (callback: any = null) => {
    try {
      const response = await this.service.deleteAll();
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "deleteAll", err });
    }

  }

  filter = async (filters: any, callback: any = null) => {
    try {
      const response = await this.service.filter(filters);
      if (callback) {
        callback(response.data);
      }
    } catch (err) {
      console.error({ function: "filter", err });
    }
  }
}

export default PrecipitationServiceCalls;