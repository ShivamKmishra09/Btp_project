export interface CPU {
  model: string;
  manufacturer: string;
  tdp: number;
  cores: number;
  releaseYear?: number;
}

export interface GPU {
  model: string;
  tdp: number;
  cores?: number;
  releaseYear?: number;
  memory?: number;
}

export interface Location {
  location: string;
  continentName: string;
  countryName: string;
  regionName: string;
  carbonIntensity: number;
  type: string;
}

export interface PUE {
  provider: string;
  pue: number;
}

export interface CalculatorInputs {
  runtime: number; // in hours
  coreType: 'CPU' | 'GPU';
  
  // CPU fields
  numCores?: number;
  cpuModel?: string;
  customCpuTDP?: number;
  
  // GPU fields
  numGPUs?: number;
  gpuModel?: string;
  customGpuTDP?: number;
  
  // Common fields
  memoryGB: number;
  platform: string;
  location: string;
  
  // Optional factors
  cpuUsageFactor: number; // 0-1
  gpuUsageFactor: number; // 0-1
  customPUE?: number;
  multiplicativeFactor: number;
}

export interface CalculationResults {
  energyNeeded: number; // kWh
  carbonFootprint: number; // gCO2e
  treeMonths: number;
  carKm: number;
  flightPercent: number;
  coresPowerDraw: number;
  memoryPowerDraw: number;
}
