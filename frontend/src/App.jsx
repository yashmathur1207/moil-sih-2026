import { useState } from 'react'
import axios from 'axios'
import { Activity, AlertTriangle, CheckCircle, Settings, CloudRain } from 'lucide-react'
import MineMap from './components/MineMap'

function App() {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  
  const [formData, setFormData] = useState({
    Rainfall_mm: 5.0,
    Excavator_Uptime: 95.0,
    LHD_Uptime: 92.0,
    Dumper_Uptime: 90.0,
    Blasting_Delay_Hours: 0.5
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    })
  }

  const handlePredict = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://127.0.0.1:5001/api/predict-shortfall', formData)
      setPrediction(response.data)
    } catch (error) {
      console.error("API Error:", error)
      alert("Failed to connect to the backend API. Is Flask running on port 5001?")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto font-sans">
      <header className="mb-8 flex items-center justify-between border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            MOIL Operations & Exploration Dashboard
          </h1>
          <p className="text-slate-400 mt-1">SIH 2026 MVP - Real-time AI Predictor & Geospatial Analysis</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input Sliders */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl col-span-1 h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Live Telemetry Input
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-300"/> Rainfall (mm)</span>
                <span className="text-blue-300">{formData.Rainfall_mm} mm</span>
              </label>
              <input type="range" name="Rainfall_mm" min="0" max="150" step="1" value={formData.Rainfall_mm} onChange={handleChange} className="w-full accent-blue-500" />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Excavator Uptime (%)</span>
                <span className="text-emerald-400">{formData.Excavator_Uptime}%</span>
              </label>
              <input type="range" name="Excavator_Uptime" min="30" max="100" step="1" value={formData.Excavator_Uptime} onChange={handleChange} className="w-full accent-emerald-500" />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>LHD Loader Uptime (%)</span>
                <span className="text-emerald-400">{formData.LHD_Uptime}%</span>
              </label>
              <input type="range" name="LHD_Uptime" min="30" max="100" step="1" value={formData.LHD_Uptime} onChange={handleChange} className="w-full accent-emerald-500" />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Dumper Uptime (%)</span>
                <span className="text-emerald-400">{formData.Dumper_Uptime}%</span>
              </label>
              <input type="range" name="Dumper_Uptime" min="30" max="100" step="1" value={formData.Dumper_Uptime} onChange={handleChange} className="w-full accent-emerald-500" />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium mb-2">
                <span>Blasting Delay (Hours)</span>
                <span className="text-orange-400">{formData.Blasting_Delay_Hours} hrs</span>
              </label>
              <input type="range" name="Blasting_Delay_Hours" min="0" max="8" step="0.5" value={formData.Blasting_Delay_Hours} onChange={handleChange} className="w-full accent-orange-500" />
            </div>

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg font-bold shadow-lg"
            >
              {loading ? "Analyzing..." : "Run AI Prediction"}
            </button>
          </div>
        </div>

        {/* Right Column: AI Output & Map */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Geospatial Map Component */}
          <MineMap />

          {prediction ? (
            <>
              <div className={`p-6 rounded-xl border flex items-center justify-between ${prediction.is_shortfall ? 'bg-red-900/20 border-red-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                <div>
                  <h3 className={`text-2xl font-bold flex items-center gap-2 ${prediction.is_shortfall ? 'text-red-400' : 'text-emerald-400'}`}>
                    {prediction.is_shortfall ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle className="w-7 h-7" />}
                    {prediction.is_shortfall ? "Production Shortfall Predicted" : "Operations Nominal"}
                  </h3>
                  <p className="text-slate-300 mt-1">AI Confidence Score: {prediction.confidence_percentage}%</p>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 text-slate-200">Recommended Corrective Actions</h3>
                <div className="space-y-3">
                  {prediction.corrective_actions.map((action, index) => (
                    <div key={index} className="p-4 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-300">
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
              Adjust telemetry and run prediction to view operational insights.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App