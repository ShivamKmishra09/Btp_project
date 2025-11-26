import { CalculationResults } from '@/types/calculator';
import leafIcon from '@/assets/leaf-icon.png';
import plantBg from '@/assets/plant-background.jpg';

interface ResultsPanelProps {
  results: CalculationResults | null;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  if (!results) {
    return (
      <div 
        className="h-full flex flex-col items-center justify-center p-12 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #d4f1e8 0%, #e8f5e9 50%, #f1f8e9 100%)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${plantBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
        />
        <div className="relative z-10">
          <img src={leafIcon} alt="Leaf" className="w-24 h-24 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Configure Your Computation</h2>
          <p className="text-gray-600 text-lg">
            Fill in the details on the left to calculate the carbon footprint
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="h-full overflow-y-auto p-8 relative"
      style={{
        background: 'linear-gradient(135deg, #d4f1e8 0%, #e8f5e9 50%, #f1f8e9 100%)'
      }}
    >
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${plantBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)'
        }}
      />
      
      <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-full">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 4v6H4a6 6 0 015-6zm2 0a6 6 0 015 6h-5V4z"/>
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {results.carbonFootprint.toFixed(2)} gCO2e
              </div>
              <div className="text-sm text-gray-600">Carbon footprint</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-full">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {results.energyNeeded.toFixed(2)} kWh
              </div>
              <div className="text-sm text-gray-600">Energy needed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Carbon equivalents</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{results.treeMonths.toFixed(2)} tree-months</div>
                <div className="text-xs text-gray-600">Carbon sequestration</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{results.carKm.toFixed(2)} km</div>
                <div className="text-xs text-gray-600">in a passenger car</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
              <svg className="w-6 h-6 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{results.flightPercent.toFixed(2)}%</div>
                <div className="text-xs text-gray-600">of a flight Paris-Dublin</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
