import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaMapMarkerAlt, FaRegClock, FaBuilding, FaCreditCard, FaDirections } from 'react-icons/fa';
import { FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { locationsService } from '@/api';
import { Location } from '@/interfaces';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

const DEFAULT_CENTER: [number, number] = [19.3905, -70.5255]; // Centrado en Moca aprox.

const MapLocations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Todos' | 'Sucursales' | 'Cajeros'>('Todos');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [userCenter, setUserCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);

  const initMap = useCallback(async (center: [number, number]) => {
    if (!mapRef.current || leafletMapRef.current) return;

    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Desactivamos el zoomControl por defecto para moverlo de lugar si quisiéramos, pero lo dejaremos así por ahora
    const map = L.map(mapRef.current, { zoomControl: false }).setView(center, 14);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    leafletMapRef.current = map;

    // Mapa base más limpio (CartoDB Positron es excelente para fondos bancarios, si no carga usa OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19,
    }).addTo(map);

    const userIcon = L.divIcon({
      html: `<div style="width:18px;height:18px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(59,130,246,0.6)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      className: '',
    });
    userMarkerRef.current = L.marker(center, { icon: userIcon })
      .addTo(map)
      .bindPopup('<div style="font-family:sans-serif;font-weight:bold;color:#2B4BA9;">Tu ubicación actual</div>');

    return map;
  }, []);

  const addMarkers = useCallback(async (locs: Location[]) => {
    const map = leafletMapRef.current;
    if (!map) return;

    const L = (await import('leaflet')).default;

    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    locs.forEach(location => {
      const isBranch = location.type === 'branch';
      // Colores corporativos
      const color = isBranch ? '#2B4BA9' : '#F58220'; 
      const svgIcon = isBranch 
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zm-3-3H6v-2h12v2zm0-4H6V9h12v2z"/></svg>`;

      const icon = L.divIcon({
        html: `
          <div style="position:relative; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)); transform: translateY(-10px);">
            <svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z" fill="${color}"/>
            </svg>
            <div style="position:absolute; top: 9px; left: 10px;">${svgIcon}</div>
          </div>`,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -42],
        className: 'transition-transform hover:scale-110 duration-200',
      });

      const popupContent = `
        <div style="font-family: 'Open Sans', sans-serif; min-width: 200px; padding: 4px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <div style="background:${color}15; padding:6px; border-radius:8px;">
              <div style="color:${color}; width:16px; height:16px; display:flex; align-items:center; justify-content:center;">
                ${isBranch ? '🏦' : '💳'}
              </div>
            </div>
            <h3 style="margin:0; font-size:14px; font-weight:700; color:#1f2937; line-height:1.2;">${location.name}</h3>
          </div>
          <p style="margin:0 0 8px 0; color:#4b5563; font-size:12px; line-height:1.4;">${location.address}</p>
          ${isBranch && location.hours
            ? `<div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#6b7280; margin-bottom:12px;">
                 <span>🕒</span> ${location.hours.openingTime} - ${location.hours.closingTime}
               </div>`
            : '<div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#10b981; font-weight:600; margin-bottom:12px;"><span>⚡</span> Disponible 24/7</div>'
          }
          <a href="${buildDirectionsUrl(location)}" target="_blank" rel="noopener noreferrer"
             style="display:flex; align-items:center; justify-content:center; gap:6px; background:${color}; color:white; padding:8px 12px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:600; transition:opacity 0.2s;">
            Cómo llegar 📍
          </a>
        </div>`;

      const marker = L.marker([location.coordinates.lat, location.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent, { className: 'custom-popup rounded-xl overflow-hidden shadow-xl border-0' });

      markersRef.current.set(location.id, marker);
    });
  }, []);

  const buildDirectionsUrl = (location: Location) => {
    const dest = `${location.coordinates.lat},${location.coordinates.lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}`; // URL de Google Maps corregida
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const center: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCenter(center);
        initMap(center);
      },
      () => initMap(DEFAULT_CENTER),
      { enableHighAccuracy: true, timeout: 5000 }
    );
    if (!navigator.geolocation) initMap(DEFAULT_CENTER);
    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, [initMap]);

  useEffect(() => {
    locationsService.getLocations()
      .then(setLocations)
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeTab === 'Todos' ||
      (activeTab === 'Sucursales' && loc.type === 'branch') ||
      (activeTab === 'Cajeros' && loc.type === 'atm'))
  );

  useEffect(() => {
    if (!loading) addMarkers(filteredLocations);
  }, [filteredLocations, loading, addMarkers]);

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    const map = leafletMapRef.current;
    if (map) {
      map.setView([location.coordinates.lat, location.coordinates.lng], 16, { animate: true, duration: 1 });
      const marker = markersRef.current.get(location.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 400);
      }
    }
    if (window.innerWidth <= 768) setIsPanelVisible(false);
  }, []);

  const toggleLocationDetails = (id: string) => {
    setExpandedLocations(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const goToMyLocation = () => {
    const map = leafletMapRef.current;
    if (map) map.setView(userCenter, 15, { animate: true });
  };

  // Componente de Tarjeta de Ubicación Modernizada
  const LocationCard = ({ location }: { location: Location }) => {
    const isExpanded = expandedLocations.has(location.id);
    const isSelected = selectedLocation?.id === location.id;
    const isBranch = location.type === 'branch';

    return (
      <div 
        className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden
          ${isSelected ? 'border-[#2B4BA9] shadow-md bg-blue-50/30' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}
        `}
        onClick={() => handleLocationSelect(location)}
      >
        {/* Barra lateral indicadora de color */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${isBranch ? 'bg-[#2B4BA9]' : 'bg-[#F58220]'}`} />
        
        <div className="p-4 pl-5">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl flex-shrink-0 ${isBranch ? 'bg-blue-100 text-[#2B4BA9]' : 'bg-orange-100 text-[#F58220]'}`}>
              {isBranch ? <FaBuilding size={16} /> : <FaCreditCard size={16} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-[13px] leading-tight truncate ${isSelected ? 'text-[#2B4BA9]' : 'text-gray-800'}`}>
                {location.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {location.address}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-3 border-t border-gray-100/60 space-y-3 pl-1">
                  
                  {isBranch ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${location.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {location.isOpen ? '• Abierto' : '• Cerrado'}
                        </span>
                        {location.hours && (
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md">
                            <FaRegClock /> {location.hours.openingTime} - {location.hours.closingTime}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                      • Disponible 24/7
                    </span>
                  )}

                  {location.services && location.services.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Servicios Disponibles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {location.services.map((svc, i) => (
                          <span key={i} className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md border border-gray-200/50">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <a href={buildDirectionsUrl(location)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#2B4BA9] hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-colors"
                      onClick={e => e.stopPropagation()}>
                      <FaDirections /> Cómo llegar
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={e => { e.stopPropagation(); toggleLocationDetails(location.id); }}
            className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-[#2B4BA9] uppercase tracking-wider mt-3 pt-2 border-t border-gray-50 transition-colors">
            {isExpanded ? 'Ocultar detalles ˄' : 'Ver más detalles ⌄'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="relative h-[calc(100vh-68px)]">
      
      {/* Contenedor principal que previene scroll en el body */}
      <div className="absolute inset-0 w-full h-full bg-gray-100 overflow-hidden">
        
        {/* Panel lateral superpuesto */}
        <div className={`absolute top-4 left-4 z-[1000] flex flex-col h-[calc(100%-32px)] w-[90%] max-w-[360px] transition-transform duration-300 pointer-events-none ${!isPanelVisible ? '-translate-x-[calc(100%+32px)]' : 'translate-x-0'}`}>
          
          {/* Header del Panel (Búsqueda y Filtros) - pointer-events-auto para que reciba clics */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 flex flex-col gap-3 pointer-events-auto shrink-0 mb-3">
            <h2 className="text-lg font-bold text-[#2B4BA9] px-1">Encuéntranos</h2>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por zona, ciudad o nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B4BA9]/20 focus:border-[#2B4BA9] transition-all"
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              {(['Todos', 'Sucursales', 'Cajeros'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-[#2B4BA9] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Resultados (Scrollable) */}
          <div className="flex-1 overflow-hidden pointer-events-auto">
            {loading ? (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B4BA9] mb-3" />
                <p className="text-sm font-medium text-gray-600">Buscando ubicaciones...</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto pr-2 pb-4 space-y-3 custom-scrollbar">
                {filteredLocations.map(location => (
                  <LocationCard key={location.id} location={location} />
                ))}
                {filteredLocations.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">No se encontraron resultados para tu búsqueda.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botón móvil para mostrar panel */}
        {!isPanelVisible && (
          <button onClick={() => setIsPanelVisible(true)}
            className="absolute left-0 top-6 bg-[#2B4BA9] text-white py-3 px-3 rounded-r-xl shadow-lg z-[1000] md:hidden flex items-center gap-2 hover:bg-blue-800 transition-colors">
            <FiList className="w-5 h-5" />
          </button>
        )}

        {/* Contenedor del mapa Leaflet */}
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Botones Flotantes del Mapa */}
        <div className="absolute right-4 bottom-8 z-[1000] flex flex-col gap-3">
          <button 
            onClick={goToMyLocation}
            className="p-3.5 bg-white text-[#2B4BA9] rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-gray-50 transition-colors"
            title="Ir a mi ubicación"
          >
            <FaMapMarkerAlt size={20} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default MapLocations;