import { useState } from 'react'
import axios from 'axios'
import { Activity, AlertTriangle, CheckCircle, Settings, CloudRain, ShieldCheck, MapPin } from 'lucide-react'
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black p-8 font-sans text-slate-100 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Upgraded Header */}
        <header className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                MOIL Operations Command
              </h1>
              <p className="text-slate-400 mt-1 text-sm font-medium tracking-wide">SIH 2026 • AI Predictor & Geospatial Engine</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-300">System Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input Sliders (Glassmorphism styling) */}
          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-2xl col-span-1 h-fit">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-200">
              <Settings className="w-5 h-5 text-indigo-400" />
              Live Telemetry Input
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-400"/> Rainfall</span>
                  <span className="text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded text-xs">{formData.Rainfall_mm} mm</span>
                </label>
                <input type="range" name="Rainfall_mm" min="0" max="150" step="1" value={formData.Rainfall_mm} onChange={handleChange} className="w-full accent-blue-500 hover:accent-blue-400 transition-all" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>Excavator Uptime</span>
                  <span className="text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded text-xs">{formData.Excavator_Uptime}%</span>
                </label>
                <input type="range" name="Excavator_Uptime" min="30" max="100" step="1" value={formData.Excavator_Uptime} onChange={handleChange} className="w-full accent-emerald-500 hover:accent-emerald-400 transition-all" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>LHD Loader Uptime</span>
                  <span className="text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded text-xs">{formData.LHD_Uptime}%</span>
                </label>
                <input type="range" name="LHD_Uptime" min="30" max="100" step="1" value={formData.LHD_Uptime} onChange={handleChange} className="w-full accent-emerald-500 hover:accent-emerald-400 transition-all" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>Dumper Uptime</span>
                  <span className="text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded text-xs">{formData.Dumper_Uptime}%</span>
                </label>
                <input type="range" name="Dumper_Uptime" min="30" max="100" step="1" value={formData.Dumper_Uptime} onChange={handleChange} className="w-full accent-emerald-500 hover:accent-emerald-400 transition-all" />
              </div>

              <div>
                <label className="flex justify-between text-sm font-semibold mb-2">
                  <span>Blasting Delay</span>
                  <span className="text-orange-400 bg-orange-900/30 px-2 py-0.5 rounded text-xs">{formData.Blasting_Delay_Hours} hrs</span>
                </label>
                <input type="range" name="Blasting_Delay_Hours" min="0" max="8" step="0.5" value={formData.Blasting_Delay_Hours} onChange={handleChange} className="w-full accent-orange-500 hover:accent-orange-400 transition-all" />
              </div>

              <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex justify-center items-center gap-2"
              >
                {loading ? "Processing Telemetry..." : "Run AI Prediction"}
              </button>
            </div>
          </div>

          {/* Right Column: AI Output & Map */}
          <div className="lg:col-span-2 space-y-6">
            
            <MineMap />

            {prediction ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-2xl border backdrop-blur-md flex items-center justify-between shadow-2xl ${prediction.is_shortfall ? 'bg-red-950/40 border-red-500/30' : 'bg-emerald-950/40 border-emerald-500/30'}`}>
                  <div>
                    <h3 className={`text-2xl font-black flex items-center gap-3 ${prediction.is_shortfall ? 'text-red-400' : 'text-emerald-400'}`}>
                      {prediction.is_shortfall ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                      {prediction.is_shortfall ? "CRITICAL: Shortfall Predicted" : "Operations Nominal"}
                    </h3>
                    <p className="text-slate-300 mt-2 text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4" /> AI Confidence Score: <span className="font-bold text-white">{prediction.confidence_percentage}%</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
                  <h3 className="text-lg font-bold mb-4 text-slate-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    Recommended Corrective Actions
                  </h3>
                  <div className="space-y-3">
                    {prediction.corrective_actions.map((action, index) => (
                      <div key={index} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm leading-relaxed hover:bg-slate-800 transition-colors">
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-700/50 border-dashed p-12">
                <Activity className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-center font-medium">Awaiting telemetry.<br/>Adjust parameters and run prediction.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default App