
import React from 'react';
import { CityInfo } from '../types';

interface CityCardProps {
  data: CityInfo;
}

const CityCard: React.FC<CityCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden mt-2">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-map-marker-alt"></i>
          {data.cityName}
        </h3>
      </div>
      
      <div className="p-5 space-y-4">
        <p className="text-slate-600 italic leading-relaxed">
          "{data.intro}"
        </p>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <i className="fas fa-star text-yellow-400"></i>
            Top 3 Attractions
          </h4>
          <div className="space-y-3 pl-2">
            {data.attractions.map((attraction, idx) => (
              <div key={idx} className="border-l-2 border-blue-200 pl-4 py-1">
                <span className="block font-medium text-blue-800">{attraction.name}</span>
                <span className="text-sm text-slate-500">{attraction.description}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-1">
            <i className="fas fa-lightbulb"></i>
            Pro Travel Tip
          </h4>
          <p className="text-sm text-amber-900 leading-snug">
            {data.travelTip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
