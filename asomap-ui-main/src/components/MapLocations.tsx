import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import { FiList } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { locationsService } from '@/api';
import { Location } from '@/interfaces';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const DEFAULT_CENTER: [number, number] = [4.7110, -74.0721];

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

  // Cargar Leaflet dinámicamente para evitar problemas de SSR/bundling
  const initMap = useCallback(async (center: [number, number]) => {
    if (!mapRef.current || leafletMapRef.current) return;

    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

    // Fix default icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current).setView(center, 14);
    leafletMapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Marcador de usuario
    const userIcon = L.divIcon({
      html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: '',
    });
    userMarkerRef.current = L.marker(center, { icon: userIcon })
      .addTo(map)
      .bindPopup('Tu ubicación');

    return map;
  }, []);

  // Agregar marcadores de ubicaciones al mapa
  const addMarkers = useCallback(async (locs: Location[]) => {
    const map = leafletMapRef.current;
    if (!map) return;

    const L = (await import('leaflet')).default;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    locs.forEach(location => {
      const isBranch = location.type === 'branch';
      const color = isBranch ? '#16A34A' : '#DC2626';
      const icon = L.divIcon({
        html: `<div style="position:relative">
          <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="${color}"/>
            <circle cx="14" cy="14" r="6" fill="white"/>
          </svg>
        </div>`,
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -40],
        className: '',
      });

      const popupContent = `
        <div style="font-size:12px;min-width:160px">
          <p style="font-weight:600;margin-bottom:4px">${location.name}</p>
          <p style="color:#6B7280;margin-bottom:4px">${location.address}</p>
          ${location.type === 'branch' && location.hours
            ? `<p style="color:#374151">${location.hours.openingTime} - ${location.hours.closingTime}</p>`
            : '<p style="color:#16A34A">Disponible 24/7</p>'
          }
          <a href="${buildDirectionsUrl(location)}" target="_blank" rel="noopener noreferrer"
            style="display:inline-block;margin-top:6px;color:#2563EB;text-decoration:underline;font-size:11px">
            Cómo llegar →
          </a>
        </div>`;

      const marker = L.marker([location.coordinates.lat, location.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent);

      markersRef.current.set(location.id, marker);
    });
  }, []);

  const buildDirectionsUrl = (location: Location) => {
    const dest = `${location.coordinates.lat},${location.coordinates.lng}`;
    return `https://www.google.com/maps/dir//${dest}`;
  };

  // Inicializar mapa al montar
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

  // Cargar ubicaciones
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

  // Actualizar marcadores cuando cambian los filtros
  useEffect(() => {
    if (!loading) addMarkers(filteredLocations);
  }, [filteredLocations, loading, addMarkers]);

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    const map = leafletMapRef.current;
    if (map) {
      map.setView([location.coordinates.lat, location.coordinates.lng], 16, { animate: true });
      const marker = markersRef.current.get(location.id);
      if (marker) {
        setTimeout(() => marker.openPopup(), 300);
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
    if (map) map.setView(userCenter, 14);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="relative -mt-[80px]">
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">

        {/* Panel lateral */}
        <div className={`fixed left-6 top-32 w-[90%] max-w-[350px] space-y-2 z-[1000] transition-transform duration-300 ${!isPanelVisible ? '-translate-x-[calc(100%+24px)]' : 'translate-x-0'}`}>

          {/* Búsqueda */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-xl shadow-lg">
            <div className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar sucursal o cajero..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs text-gray-600 placeholder-gray-400 bg-gray-50 border-none rounded-lg shadow-sm focus:ring-2 focus:ring-gray-200 transition-all"
                />
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              </div>
              <div className="flex gap-3 mt-1.5">
                {(['Todos', 'Sucursales', 'Cajeros'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`py-0.5 text-xs transition-all ${activeTab === tab ? 'text-primary font-medium' : 'text-gray-400'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Lista de resultados */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600">Cargando ubicaciones...</p>
            </div>
          ) : filteredLocations.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-xl shadow-lg">
              <div className="p-2">
                <h2 className="text-xs font-medium text-gray-800 mb-1.5">
                  {filteredLocations.length} resultado{filteredLocations.length !== 1 ? 's' : ''}
                </h2>
                <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {filteredLocations.map(location => (
                    <div key={location.id}
                      className={`rounded-lg border p-2 cursor-pointer transition-colors ${selectedLocation?.id === location.id ? 'border-primary/40 bg-primary/5' : 'border-gray-100 bg-white'}`}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${location.type === 'branch' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-xs truncate">{location.name}</h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">{location.address}</p>
                        </div>
                      </div>

                      {expandedLocations.has(location.id) && (
                        <div className="mt-2 pl-4 space-y-1">
                          {location.type === 'branch' ? (
                            <>
                              <div className="flex items-center gap-1">
                                <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${location.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {location.isOpen ? 'Abierto' : 'Cerrado'}
                                </span>
                                {location.hours && (
                                  <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
                                    <FaRegClock className="text-[11px]" />
                                    {location.hours.openingTime} - {location.hours.closingTime}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full text-[11px] bg-green-100 text-green-700">24/7</span>
                          )}

                          {location.services && location.services.length > 0 && (
                            <div>
                              <p className="text-[11px] font-medium text-gray-700 mt-1">Servicios:</p>
                              <ul className="space-y-0.5">
                                {location.services.map((svc, i) => (
                                  <li key={i} className="text-[11px] text-gray-500 flex items-center gap-1">
                                    <span className="w-1 h-1 bg-primary rounded-full" />{svc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <a href={buildDirectionsUrl(location)} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:text-primary/80 mt-1"
                            onClick={e => e.stopPropagation()}>
                            <span>Cómo llegar</span>
                            <FaMapMarkerAlt className="text-xs" />
                          </a>
                        </div>
                      )}

                      <button
                        onClick={e => { e.stopPropagation(); toggleLocationDetails(location.id); }}
                        className="text-[11px] text-primary hover:text-primary/80 mt-1 pl-4 block">
                        {expandedLocations.has(location.id) ? 'Ver menos' : 'Ver más'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Botón móvil */}
        {!isPanelVisible && (
          <button onClick={() => setIsPanelVisible(true)}
            className="fixed left-0 top-32 bg-primary text-white p-2 rounded-r-lg shadow-lg z-[1000] md:hidden">
            <FiList className="w-5 h-5" />
          </button>
        )}

        {/* Contenedor del mapa */}
        <div ref={mapRef} style={{ width: '100%', height: '100vh', minHeight: '100vh', position: 'relative', zIndex: 1 }} />

        {/* Botón mi ubicación */}
        <button onClick={goToMyLocation}
          className="fixed right-6 bottom-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-[1000]"
          title="Mi ubicación">
          <FaMapMarkerAlt className="text-primary text-xl" />
        </button>
      </div>
    </motion.div>
  );
};

export default MapLocations;
