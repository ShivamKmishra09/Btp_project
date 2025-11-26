import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CPU, GPU, Location, PUE, CalculatorInputs } from '@/types/calculator';
import { InfoTooltip } from './InfoTooltip';

interface CalculatorFormProps {
  cpus: CPU[];
  gpus: GPU[];
  locations: Location[];
  pues: PUE[];
  inputs: CalculatorInputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onCalculate: () => void;
}

export function CalculatorForm({
  cpus,
  gpus,
  locations,
  pues,
  inputs,
  updateInput,
  onCalculate
}: CalculatorFormProps) {
  const [hours, setHours] = useState(Math.floor(inputs.runtime));
  const [minutes, setMinutes] = useState(Math.round((inputs.runtime % 1) * 60));
  
  const handleTimeChange = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
    updateInput('runtime', h + m / 60);
  };
  
  const countries = Array.from(new Set(locations.map(l => l.countryName))).filter(Boolean).sort();
  
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-2">Details about your algorithm</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Configure your computational task parameters to estimate carbon footprint
      </p>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center">
            Runtime (HH:MM)
            <InfoTooltip content="Enter the total runtime of your computation in hours and minutes" />
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => handleTimeChange(parseInt(e.target.value) || 0, minutes)}
              className="bg-gray-50"
            />
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => handleTimeChange(hours, parseInt(e.target.value) || 0)}
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center">
            Type of cores
            <InfoTooltip content="Select the type of hardware used" />
          </Label>
          <Select value={inputs.coreType} onValueChange={(v) => updateInput('coreType', v as 'CPU' | 'GPU')}>
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CPU">CPU</SelectItem>
              <SelectItem value="GPU">GPU</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {inputs.coreType === 'CPU' ? (
          <>
            <div className="space-y-2">
              <Label className="flex items-center">
                Number of cores
                <InfoTooltip content="Refers to the number of cores used (a single CPU contains several cores)" />
              </Label>
              <Input
                type="number"
                value={inputs.numCores}
                onChange={(e) => updateInput('numCores', parseInt(e.target.value) || 0)}
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                Model
                <InfoTooltip content="Select your CPU model or choose 'other' to fill in custom TDP" />
              </Label>
              <Select 
                value={inputs.cpuModel || ''} 
                onValueChange={(v) => updateInput('cpuModel', v)}
              >
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Select CPU model" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {cpus.map((cpu, index) => (
                    <SelectItem key={`cpu-${index}-${cpu.model}`} value={cpu.model}>
                      {cpu.model} ({cpu.tdp}W)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="flex items-center">
                Number of GPUs
                <InfoTooltip content="Refers to the number of GPUs used" />
              </Label>
              <Input
                type="number"
                value={inputs.numGPUs}
                onChange={(e) => updateInput('numGPUs', parseInt(e.target.value) || 0)}
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                Model
                <InfoTooltip content="Select your GPU model or choose 'other' to fill in custom TDP" />
              </Label>
              <Select 
                value={inputs.gpuModel || ''} 
                onValueChange={(v) => updateInput('gpuModel', v)}
              >
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="Select GPU model" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {gpus.map((gpu, index) => (
                    <SelectItem key={`gpu-${index}-${gpu.model}`} value={gpu.model}>
                      {gpu.model} ({gpu.tdp}W)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label className="flex items-center">
            Memory available (in GB)
            <InfoTooltip content="Refers to the total memory allocated to the task, not the memory actually used" />
          </Label>
          <Input
            type="number"
            value={inputs.memoryGB}
            onChange={(e) => updateInput('memoryGB', parseFloat(e.target.value) || 0)}
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center">
            Platform
            <InfoTooltip content="This field is used to retrieve specific data centre efficiency metrics (PUE)" />
          </Label>
          <Select value={inputs.platform} onValueChange={(v) => updateInput('platform', v)}>
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pues.map((pue) => (
                <SelectItem key={pue.provider} value={pue.provider}>
                  {pue.provider} (PUE: {pue.pue})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center">
            Location
            <InfoTooltip content="This is used to retrieve the energy mix in a location" />
          </Label>
          <Select value={inputs.location} onValueChange={(v) => updateInput('location', v)}>
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="WORLD">Any (475 gCO2/kWh)</SelectItem>
              {countries.map((country) => {
                const countryLocations = locations.filter(l => l.countryName === country);
                return countryLocations.map((loc, index) => (
                  <SelectItem key={`${loc.location}-${index}`} value={loc.location}>
                    {loc.countryName}{loc.regionName !== 'Any' ? ` - ${loc.regionName}` : ''} ({loc.carbonIntensity} gCO2/kWh)
                  </SelectItem>
                ));
              })}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={onCalculate} 
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          size="lg"
        >
          Calculate
        </Button>
      </div>
    </div>
  );
}
