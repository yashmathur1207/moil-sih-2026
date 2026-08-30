import React from 'react';
import { MapContainer, TileLayer, Circle, Popup, Polygon } from 'react-leaflet';

const MineMap = () => {
  // Coordinates for MOIL Balaghat Mine
  const mineCenter = [21.82, 80.20];

  // Simulated AI-predicted reserve zones
  const highProbabilityZone = [
    [21.825, 80.195],
    [21.825, 80.205],
    [21.815, 80.208],
    [21.812, 80.198],
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl h-full">
      <h3 className="text-xl font-semibold mb-4 text-slate-200">Satellite Reserve Exploration</h3>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-slate-600 relative z-0">
        <MapContainer center={mineCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CartoDB'
          />
          
          <Circle center={mineCenter} radius={400} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.4 }}>
            <Popup>
              <strong className="text-slate-800">Balaghat Main Pit</strong><br/>
              Current active extraction zone.
            </Popup>
          </Circle>

          <Polygon positions={highProbabilityZone} pathOptions={{ color: 'cyan', fillColor: 'cyan', fillOpacity: 0.3 }}>
            <Popup>
              <strong className="text-slate-800">Zone Alpha - High Probability</strong><br/>
              NDVI & Moisture anomalies indicate potential sub-surface manganese.
            </Popup>
          </Polygon>
        </MapContainer>
      </div>
      <div className="mt-4 flex gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 opacity-60"></div> Active Mine</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-500 opacity-40"></div> AI Predicted Reserve</span>
      </div>
    </div>
  );
};

export default MineMap;