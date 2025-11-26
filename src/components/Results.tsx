import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResults, CalculatorInputs } from '@/types/calculator';
import { Cloud, Zap, TreePine, Car, Plane } from 'lucide-react';

interface ResultsProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
}

export function Results({ results }: ResultsProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Cloud className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-3xl font-bold">{results.carbonFootprint.toFixed(2)} gCO2e</div>
              <div className="text-sm text-muted-foreground">Carbon footprint</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Zap className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            <div>
              <div className="text-3xl font-bold">{results.energyNeeded.toFixed(2)} kWh</div>
              <div className="text-sm text-muted-foreground">Energy needed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Equivalents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <TreePine className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">{results.treeMonths.toFixed(2)} tree-months</div>
              <div className="text-xs text-muted-foreground">Carbon sequestration</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <Car className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">{results.carKm.toFixed(2)} km</div>
              <div className="text-xs text-muted-foreground">in a passenger car</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-sky-50 dark:bg-sky-950 rounded-lg">
            <Plane className="h-8 w-8 text-sky-600 dark:text-sky-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">{results.flightPercent.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">of a flight Paris-Dublin</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Power Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cores power draw:</span>
              <span className="font-semibold">{results.coresPowerDraw.toFixed(2)} W</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Memory power draw:</span>
              <span className="font-semibold">{results.memoryPowerDraw.toFixed(2)} W</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span>Total:</span>
              <span className="font-semibold">
                {(results.coresPowerDraw + results.memoryPowerDraw).toFixed(2)} W
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Computing cores vs Memory</div>
            <div className="h-6 bg-muted rounded-full overflow-hidden flex">
              <div
                className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                style={{
                  width: `${(results.coresPowerDraw / (results.coresPowerDraw + results.memoryPowerDraw)) * 100}%`
                }}
              >
                {((results.coresPowerDraw / (results.coresPowerDraw + results.memoryPowerDraw)) * 100).toFixed(1)}%
              </div>
              <div
                className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                style={{
                  width: `${(results.memoryPowerDraw / (results.coresPowerDraw + results.memoryPowerDraw)) * 100}%`
                }}
              >
                {((results.memoryPowerDraw / (results.coresPowerDraw + results.memoryPowerDraw)) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Cores</span>
              <span>Memory</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
