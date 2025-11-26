import { useState, useEffect } from 'react';
import { CPU, GPU, Location, PUE, CalculatorInputs } from '@/types/calculator';
import { loadCPUs, loadGPUs, loadLocations, loadPUEs } from '@/utils/csvParser';
import { calculateCarbonFootprint } from '@/utils/carbonCalculator';
import { CalculatorForm } from './CalculatorForm';
import { ResultsPanel } from './ResultsPanel';
import { Loader2 } from 'lucide-react';
import iitLogo from '@/assets/iit-logo.png';

export function Calculator() {
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [gpus, setGpus] = useState<GPU[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [pues, setPues] = useState<PUE[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [inputs, setInputs] = useState<CalculatorInputs>({
    runtime: 12,
    coreType: 'CPU',
    numCores: 12,
    cpuModel: '',
    gpuModel: '',
    numGPUs: 1,
    memoryGB: 64,
    platform: 'Unknown',
    location: 'WORLD',
    cpuUsageFactor: 1.0,
    gpuUsageFactor: 1.0,
    multiplicativeFactor: 1
  });
  
  const [results, setResults] = useState<ReturnType<typeof calculateCarbonFootprint> | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [cpuData, gpuData, locationData, pueData] = await Promise.all([
          loadCPUs(),
          loadGPUs(),
          loadLocations(),
          loadPUEs()
        ]);
        
        setCpus(cpuData);
        setGpus(gpuData);
        setLocations(locationData);
        setPues(pueData);
        
        // Set default CPU and GPU if available
        if (cpuData.length > 0) {
          const defaultCpu = cpuData.find(c => c.model.includes('Core i7-4790'));
          if (defaultCpu) {
            setInputs(prev => ({ ...prev, cpuModel: defaultCpu.model }));
          }
        }
        
        if (gpuData.length > 0) {
          const teslaGpu = gpuData.find(g => g.model.includes('Tesla V100'));
          if (teslaGpu) {
            setInputs(prev => ({ ...prev, gpuModel: teslaGpu.model }));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  const handleCalculate = () => {
    const result = calculateCarbonFootprint(inputs, cpus, gpus, locations, pues);
    setResults(result);
  };
  
  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="text-green-600">Green</span>{' '}
              <span className="text-teal-600">Computing Calculator</span>
            </h1>
            <p className="text-gray-600 mt-1">What's the carbon footprint of your computations?</p>
          </div>
          <div className="hidden md:block">
            <img src={iitLogo} alt="IIT Kharagpur Logo" className="h-20 w-20 object-contain" />
          </div>
        </div>
      </header>
      
      <div className="grid lg:grid-cols-2 h-[calc(100vh-140px)]">
        <CalculatorForm
          cpus={cpus}
          gpus={gpus}
          locations={locations}
          pues={pues}
          inputs={inputs}
          updateInput={updateInput}
          onCalculate={handleCalculate}
        />
        
        <ResultsPanel results={results} />
      </div>
    </div>
  );
}
