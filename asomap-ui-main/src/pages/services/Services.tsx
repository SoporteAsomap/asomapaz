import React, { useEffect, useMemo, useState } from 'react';
import { servicesService } from '@/api';
import { normalizeMediaUrl } from '@/utils/media';

const Services: React.FC = () => {
  const [servicesData, setServicesData] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await servicesService.getServicesPage();
        setServicesData(data);

        if (data?.itemDetails?.length) {
          setSelectedService(data.itemDetails[0]);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (!servicesData?.itemDetails) return [];
    if (!search.trim()) return servicesData.itemDetails;

    return servicesData.itemDetails.filter((item: any) =>
      String(item.title || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [servicesData, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando servicios...</p>
      </div>
    );
  }

  if (!servicesData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">No se pudieron cargar los servicios.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {servicesData.title}
          </h1>
          <p className="text-gray-600">{servicesData.subtitle}</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder={servicesData.searchPlaceholder || 'Buscar servicios...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold text-primary mb-4">Servicios</h2>

            <div className="space-y-2">
              {filteredServices.length > 0 ? (
                filteredServices.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedService(item)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedService?.id === item.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {item.title}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">{servicesData.noResultsText}</p>
              )}
            </div>

            {servicesData.internetBankingUrl && (
              <div className="mt-6">
                <a
                  href={servicesData.internetBankingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block w-full text-center bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-accent transition"
                >
                  {servicesData.internetBankingButton || 'Acceder a Banca en Línea'}
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            {selectedService ? (
              <>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {selectedService.title}
                </h2>

                {selectedService.imageUrl && (
                  <img
                    src={normalizeMediaUrl(selectedService.imageUrl)}
                    alt={selectedService.imageAlt || selectedService.title}
                    className="w-full max-w-2xl rounded-lg shadow mb-6"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}

                {selectedService.description && (
                  <p className="text-gray-700 mb-6">{selectedService.description}</p>
                )}

                {selectedService.steps && (
                  <div
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: selectedService.steps }}
                  />
                )}

                {selectedService.pdfUrl && (
                  <a
                    href={normalizeMediaUrl(selectedService.pdfUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-accent transition"
                  >
                    Abrir documento
                  </a>
                )}
              </>
            ) : (
              <p className="text-gray-500">Selecciona un servicio.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

