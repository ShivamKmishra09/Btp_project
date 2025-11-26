import { CalculatorInputs, CalculationResults, CPU, GPU, Location, PUE } from '@/types/calculator';

// Constants from Green Algorithms methodology
const MEMORY_POWER_PER_GB = 0.3725; // W per GB
const TREE_CO2_PER_YEAR = 11; // kg CO2 per year
const TREE_CO2_PER_MONTH = TREE_CO2_PER_YEAR / 12 / 1000; // in gCO2e
const CAR_EMISSIONS_PER_KM = 175; // gCO2e per km (average passenger car)
const PARIS_DUBLIN_FLIGHT = 107300; // gCO2e for a Paris-Dublin flight

export function calculateCarbonFootprint(
  inputs: CalculatorInputs,
  cpus: CPU[],
  gpus: GPU[],
  locations: Location[],
  pues: PUE[]
): CalculationResults {
  // Get power draw from cores (CPU or GPU)
  let coresPowerDraw = 0;
  
  if (inputs.coreType === 'CPU') {
    if (inputs.customCpuTDP) {
      // Custom TDP
      coresPowerDraw = inputs.customCpuTDP * (inputs.numCores || 1);
    } else if (inputs.cpuModel) {
      // Find CPU model
      const cpu = cpus.find(c => c.model === inputs.cpuModel);
      if (cpu) {
        // TDP is total, divide by cores to get per core, then multiply by number used
        const tdpPerCore = cpu.tdp / cpu.cores;
        coresPowerDraw = tdpPerCore * (inputs.numCores || 1);
      }
    }
  } else {
    // GPU
    if (inputs.customGpuTDP) {
      coresPowerDraw = inputs.customGpuTDP * (inputs.numGPUs || 1);
    } else if (inputs.gpuModel) {
      const gpu = gpus.find(g => g.model === inputs.gpuModel);
      if (gpu) {
        coresPowerDraw = gpu.tdp * (inputs.numGPUs || 1);
      }
    }
  }
  
  // Apply usage factor
  const usageFactor = inputs.coreType === 'CPU' ? inputs.cpuUsageFactor : inputs.gpuUsageFactor;
  coresPowerDraw = coresPowerDraw * usageFactor;
  
  // Calculate memory power draw
  const memoryPowerDraw = inputs.memoryGB * MEMORY_POWER_PER_GB;
  
  // Get PUE
  let pue = 1.0;
  if (inputs.customPUE) {
    pue = inputs.customPUE;
  } else {
    const pueData = pues.find(p => p.provider.toLowerCase() === inputs.platform.toLowerCase());
    if (pueData) {
      pue = pueData.pue;
    }
  }
  
  // Calculate energy needed (in Wh)
  const totalPowerDraw = coresPowerDraw + memoryPowerDraw; // W
  const energyWh = inputs.runtime * totalPowerDraw * pue * inputs.multiplicativeFactor;
  const energyNeeded = energyWh / 1000; // Convert to kWh
  
  // Get carbon intensity
  let carbonIntensity = 475; // Default world average
  const location = locations.find(l => l.location === inputs.location);
  if (location) {
    carbonIntensity = location.carbonIntensity;
  }
  
  // Calculate carbon footprint
  const carbonFootprint = energyNeeded * carbonIntensity; // gCO2e
  
  // Calculate equivalents
  const treeMonths = carbonFootprint / (TREE_CO2_PER_MONTH * 1000);
  const carKm = carbonFootprint / CAR_EMISSIONS_PER_KM;
  const flightPercent = (carbonFootprint / PARIS_DUBLIN_FLIGHT) * 100;
  
  return {
    energyNeeded,
    carbonFootprint,
    treeMonths,
    carKm,
    flightPercent,
    coresPowerDraw,
    memoryPowerDraw
  };
}
