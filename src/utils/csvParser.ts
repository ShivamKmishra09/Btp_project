import { CPU, GPU, Location, PUE } from '@/types/calculator';

export async function loadCSV(filepath: string): Promise<string[][]> {
  const response = await fetch(filepath);
  const text = await response.text();
  
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map(line => {
    // Simple CSV parser
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
}

export async function loadCPUs(): Promise<CPU[]> {
  const data = await loadCSV('/data/CPUs-manual.csv');
  const cpus: CPU[] = [];
  
  // Skip header rows (first 2 rows) and Average row (row 3)
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (row.length < 5) continue;
    
    const model = row[0];
    const manufacturer = row[1];
    const tdpStr = row[2];
    const coresStr = row[3];
    
    if (!model || model === 'Average' || model === 'model') continue;
    
    const tdp = parseFloat(tdpStr);
    const cores = parseFloat(coresStr);
    
    if (!isNaN(tdp) && !isNaN(cores)) {
      cpus.push({
        model,
        manufacturer,
        tdp,
        cores,
        releaseYear: row[4] ? parseInt(row[4]) : undefined
      });
    }
  }
  
  return cpus;
}

export async function loadGPUs(): Promise<GPU[]> {
  const data = await loadCSV('/data/GPUs-manual.csv');
  const gpus: GPU[] = [];
  
  // Skip header rows (first 2 rows) and Average row (row 3)
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    if (row.length < 2) continue;
    
    const model = row[0];
    const tdpStr = row[1];
    
    if (!model || model === 'Average' || model === 'model') continue;
    
    const tdp = parseFloat(tdpStr);
    
    if (!isNaN(tdp)) {
      gpus.push({
        model,
        tdp,
        cores: row[2] ? parseFloat(row[2]) : undefined,
        releaseYear: row[3] ? parseInt(row[3]) : undefined,
        memory: row[6] ? parseFloat(row[6]) : undefined
      });
    }
  }
  
  return gpus;
}

export async function loadLocations(): Promise<Location[]> {
  const data = await loadCSV('/data/CI-carbonfootprint-yearly_2023.csv');
  const locations: Location[] = [];
  
  // Skip header rows (first 2 rows)
  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (row.length < 6) continue;
    
    const location = row[0];
    const continentName = row[1];
    const countryName = row[2];
    const regionName = row[3];
    const carbonIntensityStr = row[4];
    const type = row[5];
    
    if (!location) continue;
    
    const carbonIntensity = parseFloat(carbonIntensityStr);
    
    if (!isNaN(carbonIntensity)) {
      locations.push({
        location,
        continentName,
        countryName,
        regionName,
        carbonIntensity,
        type
      });
    }
  }
  
  return locations;
}

export async function loadPUEs(): Promise<PUE[]> {
  const data = await loadCSV('/data/default-PUE_2024.csv');
  const pues: PUE[] = [];
  
  // Skip header row (first row)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 2) continue;
    
    const provider = row[0];
    const pueStr = row[1];
    
    if (!provider) continue;
    
    const pue = parseFloat(pueStr);
    
    if (!isNaN(pue)) {
      pues.push({
        provider,
        pue
      });
    }
  }
  
  return pues;
}
