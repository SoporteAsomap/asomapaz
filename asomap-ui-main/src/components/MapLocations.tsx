import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaSearch, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import { FiList } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { locationsService } from '@/api';
import { Location } from '@/interfaces';

// Define libraries array outside component to prevent reloading
const libraries: ("places")[] = ["places"];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const MapLocations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Todos' | 'Sucursales' | 'Cajeros'>('Todos');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [selectedLocationForDirections, setSelectedLocationForDirections] = useState<Location | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  // Cargar datos de locations desde la API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await locationsService.getLocations();
        setLocations(data);
      } catch (error) {
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeTab === 'Todos' ||
      (activeTab === 'Sucursales' && location.type === 'branch') ||
      (activeTab === 'Cajeros' && location.type === 'atm'))
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }: { lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
    }
  }, []);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(currentLocation);
          setIsLocating(false);
          panTo(currentLocation);
        },
        () => {
          setIsLocating(false);
          // Show error message to user
          alert('No pudimos obtener tu ubicación. Por favor, permite el acceso a tu ubicación para una mejor experiencia.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      alert('Tu navegador no soporta geolocalización.');
    }
  }, [panTo]);

  const getCurrentPosition = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setIsLocating(false);
          panTo({ lat: latitude, lng: longitude });
        },
        () => {
          setIsLocating(false);
          // Fallback to default center if geolocation fails
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      // Fallback to default center if geolocation fails
    }
  }, [panTo]);

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    setSelectedLocationForDirections(location);
    setShowDirectionsPanel(true);
    if (window.innerWidth <= 768) {
      setIsPanelVisible(false);
    }
    panTo(location.coordinates);
  }, [panTo]);


  const toggleLocationDetails = (locationId: string) => {
    setExpandedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        newSet.delete(locationId);
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="relative -mt-[80px]"
    >
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
        {/* Panel de búsqueda y resultados */}
        <div className={`fixed left-6 top-32 w-[90%] max-w-[350px] space-y-2 z-30 transition-transform duration-300 ${!isPanelVisible ? '-translate-x-[calc(100%+24px)]' : 'translate-x-0'}`}>
          {/* Búsqueda */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg"
          >
            <div className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ingrese la calle o surcusal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-8 pr-2 py-1.5
                    text-xs text-gray-600 placeholder-gray-400
                    bg-gray-50
                    border-none
                    rounded-lg
                    shadow-sm
                    focus:ring-2 focus:ring-gray-200
                    transition-all
                  "
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                  <FaSearch className="text-gray-400 text-xs" />
                </div>
              </div>

              <div className="flex gap-3 mt-1.5">
                {(['Todos', 'Sucursales', 'Cajeros'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-0.5 text-xs transition-all
                      ${activeTab === tab
                        ? 'text-primary font-medium'
                        : 'text-gray-400'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

                  {/* Panel de resultados */}
        {loading ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-lg"
          >
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-xs text-gray-600">Cargando ubicaciones...</p>
            </div>
          </motion.div>
        ) : filteredLocations.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-xl shadow-lg"
            >
              <div className="p-2">
                <h2 className="text-xs font-medium text-gray-800 mb-1.5">Resultado</h2>

                <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-white rounded-lg border border-gray-100 p-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800 text-xs">{location.name}</h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">{location.address}</p>
                        </div>
                        {/* <span className="text-[11px] text-gray-500 p">a {location.distance} m</span> */}
                      </div>

                      {expandedLocations.has(location.id) && (
                        <>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {location.type === 'branch' ? (
                              <>
                                <span className={`
                                  px-1.5 py-0.5 rounded-full text-[11px]
                                  ${location.isOpen
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                  }
                                `}>
                                  {location.isOpen ? 'Abierto' : 'Cerrado'}
                                </span>
                                <div className="flex items-center gap-0.5 text-[11px] text-gray-500">
                                  <FaRegClock className="text-[11px]" />
                                  <span>{location.hours?.closingTime}</span>
                                </div>
                              </>
                            ) : (
                              <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${location.availabilityClass}`}>
                                {location.scheduleText}
                              </span>
                            )}
                          </div>

                          {location.type === 'branch' && (
                            <div className="text-[11px] text-gray-500 mt-1">
                              {location.hours?.openingTime} - {location.hours?.closingTime}<br />
                            </div>
                          )}

                          {location.type === 'atm' && (
                            <div className="text-[11px] text-gray-500 mt-1 whitespace-pre-line">
                              {/* {location.scheduleText} */}
                            </div>
                          )}

                          {location.services && (
                            <div className="mt-1">
                              <h4 className="text-[11px] font-medium text-gray-700">Servicios:</h4>
                              <ul className="mt-0.5 space-y-0.5">
                                {location.services.map((service: string | number | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, idx: React.Key | null | undefined) => (
                                  <li key={idx} className="text-[11px] text-gray-500 flex items-center">
                                    <span className="w-1 h-1 bg-primary rounded-full mr-1.5"></span>
                                    {service}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex justify-between items-center mt-1.5">
                        <button
                          onClick={() => toggleLocationDetails(location.id)}
                          className="text-[11px] text-primary hover:text-primary/80"
                        >
                          {expandedLocations.has(location.id) ? 'Ver menos' : 'Ver más'}
                        </button>
                        <button
                          onClick={() => handleLocationSelect(location)}
                          className="
                            flex items-center gap-0.5
                            text-[11px] text-primary hover:text-primary/80
                          "
                        >
                          <span>Cómo Llegar</span>
                          <FaMapMarkerAlt className="text-xs" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Botón para mostrar/ocultar panel en móvil */}
        {!isPanelVisible && (
          <button
            onClick={() => setIsPanelVisible(true)}
            className="fixed left-0 top-32 bg-primary text-white p-2 rounded-r-lg shadow-lg z-30 md:hidden"
            aria-label="Mostrar panel de búsqueda"
          >
            <FiList className="w-5 h-5" />
          </button>
        )}

        {/* Contenedor principal que se mueve con scroll */}
        <div className="w-full h-full relative">
          {(!isLoaded || isLocating) ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">{isLocating ? 'Obteniendo tu ubicación...' : 'Cargando mapa...'}</p>
              </div>
            </div>
          ) : center && (
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '100vh',
                minHeight: '100vh',
                position: 'relative',
                zIndex: 1
              }}
              center={selectedLocation?.coordinates || center}
              zoom={14}
              onLoad={onMapLoad}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {/* User location marker */}
              <Marker
                position={center}
                icon={{
                  url: '/user-location-icon.png',
                  scaledSize: new google.maps.Size(32, 32)
                }}
                title="Tu ubicación"
              />
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.coordinates}
                  onClick={() => handleLocationSelect(location)}
                  title={location.name}
                  icon={{
                    url: location.type === 'branch' ? '/branch-icon.png' : '/atm-icon.png',
                    scaledSize: new google.maps.Size(32, 32)
                  }}
                />
              ))}
            </GoogleMap>
          )}

          {/* Botón de ubicación actual */}
          <button
            onClick={getCurrentPosition}
            className="fixed right-6 bottom-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
            title="Ir a mi ubicación"
            aria-label="Ir a mi ubicación"
          >
            <FaMapMarkerAlt className="text-primary text-xl" />
          </button>
        </div>
      </div>

      {/* Panel de direcciones */}
      {showDirectionsPanel && selectedLocationForDirections && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full h-3/4 relative">
            <button
              onClick={() => setShowDirectionsPanel(false)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 z-10"
            >
              ×
            </button>
            <iframe
              src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${center ? `${center.lat},${center.lng}` : 'current+location'}&destination=${selectedLocationForDirections.coordinates.lat},${selectedLocationForDirections.coordinates.lng}&mode=driving`}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '0.5rem' }}
              allowFullScreen
              loading="lazy"
              title="Direcciones"
            ></iframe>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MapLocations;

