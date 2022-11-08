// graph
export const GRAPH_TOP = 0;
export const GRAPH_BOTTOM = 540;

export const GRAPH_LEFT = 0;
export const GRAPH_RIGHT = 600;

export const GRAPH_WIDTH = 768;
export const GRAPH_HEIGHT = 540;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// database
export const DB = "weather_service_archive";
export const TEMPERATURE_TABLE = "temperature";
export const PRECIPITATION_TABLE = "precipitation";

// mix
export const TEMPERATURE = "Температура";
export const PRECIPITATION = "Осадки";

// server
export const API_URL = "http://localhost:8080/api"
export const API_MAIN_PATH = "weather-archive-service";
export const API_MAIN_TEMPERATURE_PATH = `${API_MAIN_PATH}/temperature`;
export const API_MAIN_PRECIPITATION_PATH = `${API_MAIN_PATH}/precipitation`;
export const LIMIT_RECORDS = 50000;