import { CalculatorInputs, CalculationResults, CPU, GPU, Location, PUE } from '@/types/calculator';

// Constants from Green Algorithms methodology
const MEMORY_POWER_PER_GB = 0.3725; // W per GB
const TREE_CO2_PER_YEAR = 11000; // FIXED: Changed to grams (11kg = 11000g)
const TREE_CO2_PER_MONTH = TREE_CO2_PER_YEAR / 12; // in gCO2e (approx 916g)
const CAR_EMISSIONS_PER_KM = 175; // gCO2e per km
const PARIS_DUBLIN_FLIGHT = 107300; // gCO2e

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
      coresPowerDraw = inputs.customCpuTDP * (inputs.numCores || 1);
    } else if (inputs.cpuModel) {
      const cpu = cpus.find(c => c.model === inputs.cpuModel);
      if (cpu) {
        // Green Algos Methodology: Scale TDP linearly by number of cores used
        // Assumes cpu.tdp in database is the Total Package TDP
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
  
  // Apply usage factor (Methodology: P_actual = P_tdp * usage_factor)
  // UPDATED: Usage factor is set to 1 for all cases (100% utilization assumption)
  const usageFactor = 1;
  coresPowerDraw = coresPowerDraw * usageFactor;
  
  // Calculate memory power draw
  const memoryPowerDraw = inputs.memoryGB * MEMORY_POWER_PER_GB;
  
  // Get PUE
  let pue = 1.0; // Ideal baseline if unknown
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
  
  // FIXED: Ensure runtime is treated as Hours. 
  // If your input is already in hours, this is fine. 
  // If unsure, you might want to rename the input to 'runtimeHours' for clarity.
  const energyWh = inputs.runtime * totalPowerDraw * pue * inputs.multiplicativeFactor;
  const energyNeeded = energyWh / 1000; // Convert to kWh
  
  // Get carbon intensity
  let carbonIntensity = 475; // Default world average (gCO2e/kWh)
  const location = locations.find(l => l.location === inputs.location);
  if (location) {
    carbonIntensity = location.carbonIntensity;
  }
  
  // Calculate carbon footprint (gCO2e)
  const carbonFootprint = energyNeeded * carbonIntensity; 
  
  // Calculate equivalents
  // FIXED: Removed the incorrect *1000 division/multiplication logic
  const treeMonths = carbonFootprint / TREE_CO2_PER_MONTH; 
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
