import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { footerData } from '@/mocks';
import { socialNetworksService, contactsService } from '@/api';
import type { ISocialNetworkData, IContactData } from '@/interfaces';
import * as FaIcons from 'react-icons/fa';

type AnyObj = Record<string, any>;

const isFollowKey = (k: string) =>
  ['follow', 'social', 'redes'].includes(k.toLowerCase());

const isContactKey = (k: string) =>
  ['contact', 'contacts', 'contacto'].includes(k.toLowerCase());

function pickArray<T = any>(payload: any): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && Array.isArray(payload.results)) return payload.results as T[];
  if (payload && Array.isArray(payload.data)) return payload.data as T[];
  return [];
}

function toFaComponentName(raw: string | undefined | null): string {
  if (!raw) return 'FaQuestionCircle';
  let s = String(raw).trim();
  if (/^Fa[A-Z]/.test(s)) return s;
  const core = s
    .replace(/^fa[-_ ]*/i, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `Fa${core || 'QuestionCircle'}`;
}

function getIconComponent(iconName: string | null | undefined) {
  const anyFa = FaIcons as AnyObj;
  if (iconName && anyFa[iconName]) return anyFa[iconName];
  const normalized = toFaComponentName(iconName);
  return anyFa[normalized] || FaIcons.FaQuestionCircle;
}

export const Footer: React.FC = () => {
  const [socialNetworks, setSocialNetworks] = useState<ISocialNetworkData[]>([]);
  const [contacts, setContacts] = useState<IContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const [snRes, ctRes] = await Promise.all([
          socialNetworksService.getAllSocialNetworks(),
          contactsService.getAllContacts()
        ]);

        setSocialNetworks(pickArray<ISocialNetworkData>(snRes));
        setContacts(pickArray<IContactData>(ctRes));
      } catch (error) {
        setErrorMsg('No se pudieron cargar redes y contactos.');
        setSocialNetworks([]);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 text-gray-800 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {Object.entries(footerData.sections).map(([key, section]) => (
            <div key={key} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {section.title}
              </h3>

              {/* Redes sociales desde API si la sección es follow */}
              {isFollowKey(key) ? (
                <>
                  {loading ? (
                    <div className="flex space-x-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : socialNetworks.length > 0 ? (
                    <div className="flex space-x-6">
                      {socialNetworks.map((sn: AnyObj) => {
                        const Icon = getIconComponent(sn.icon);
                        const url = sn.url || '#';
                        const title = sn.name || 'Red social';
                        const id = sn.id ?? `${title}-${url}`;
                        return (
                          <a
                            key={id}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transform hover:scale-110 transition-transform duration-300 text-gray-600 hover:text-primary"
                            title={title}
                          >
                            <Icon className="w-6 h-6" />
                          </a>
                        );
                      })}
                    </div>
                  ) : section.icons && section.icons.length > 0 ? (
                    <div className="flex space-x-6">
                      {section.icons.map((ic: AnyObj, index: number) => (
                        <a
                          key={index}
                          href={ic.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${ic.className} transform hover:scale-110 transition-transform duration-300`}
                        >
                          {React.createElement(ic.icon, { className: 'w-6 h-6' })}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {errorMsg ?? 'No hay redes sociales disponibles'}
                    </div>
                  )}

                  {/* Dirección / enlace local de la sección follow (si existiera) */}
                  {section.address && (
                    <p className="text-sm text-gray-600">{section.address}</p>
                  )}
                  {section.link && section.url && (
                    <Link to={section.url} className="text-primary text-sm hover:underline">
                      {section.link}
                    </Link>
                  )}
                </>
              ) : isContactKey(key) ? (
                // Contactos desde API si la sección es contact
                <>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-32" />
                        </div>
                      ))}
                    </div>
                  ) : contacts.length > 0 ? (
                    <div className="space-y-3">
                      {contacts.map((ct: AnyObj) => {
                        const Icon = getIconComponent(ct.icon);
                        const name = ct.name || ct.label || 'Contacto';
                        const url: string = ct.url || ct.href || ct.value || '#';
                        const isHttp = /^https?:\/\//i.test(url);
                        const id = ct.id ?? `${name}-${url}`;

                        return (
                          <a
                            key={id}
                            href={url}
                            target={isHttp ? '_blank' : undefined}
                            rel={isHttp ? 'noopener noreferrer' : undefined}
                            className="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors duration-300 group"
                          >
                            <span className="flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-300">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-sm">{name}</span>
                          </a>
                        );
                      })}
                    </div>
                  ) : Array.isArray(section.items) && section.items.length > 0 ? (
                    <ul className="space-y-3">
                      {section.items.map((item: AnyObj, index: number) => (
                        <li
                          key={index}
                          className="hover:text-primary transition-colors duration-300 flex items-center text-gray-600 hover:translate-x-1 transform transition-transform"
                        >
                          {item.isExternalLink ? (
                            <a
                              href={item.to}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2"
                            >
                              {item.icon &&
                                React.createElement(item.icon, { className: 'w-4 h-4 text-primary' })}
                              <span className="text-sm">{item.text}</span>
                            </a>
                          ) : (
                            <Link to={item.to || '#'} className="flex items-center space-x-2">
                              {item.icon &&
                                React.createElement(item.icon, { className: 'w-4 h-4 text-primary' })}
                              <span className="text-sm">{item.text}</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {errorMsg ?? 'No hay contactos disponibles'}
                    </div>
                  )}
                </>
              ) : (
                // Resto de secciones: usan items estáticos locales
                Array.isArray(section.items) &&
                section.items.length > 0 && (
                  <ul className="space-y-3">
                    {section.items.map((item: AnyObj, index: number) => (
                      <li
                        key={index}
                        className="hover:text-primary transition-colors duration-300 flex items-center text-gray-600 hover:translate-x-1 transform transition-transform"
                      >
                        {item.isExternalLink ? (
                          <a
                            href={item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            {item.icon &&
                              React.createElement(item.icon, { className: 'w-4 h-4 text-primary' })}
                            <span className="text-sm">{item.text}</span>
                          </a>
                        ) : (
                          <Link to={item.to || '#'} className="flex items-center space-x-2">
                            {item.icon &&
                              React.createElement(item.icon, { className: 'w-4 h-4 text-primary' })}
                            <span className="text-sm">{item.text}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          ))}
        </div>

        <hr className="my-12 border-gray-200" />

        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          <div className="text-center lg:text-left space-y-4">
            <img
              src={footerData.company.logo}
              alt={footerData.company.name}
              className="w-48 mx-auto lg:mx-0 hover:opacity-90 transition-opacity duration-300"
            />
            <p className="text-sm text-gray-500">
              <span className="flex items-center gap-1">
                {footerData.company.copyright.icon &&
                  React.createElement(footerData.company.copyright.icon, { className: 'w-4 h-4' })}
                {new Date().getFullYear()}, {footerData.company.copyright.text}
              </span>
              <br />
              <span className="text-xs">{footerData.company.copyright.rights}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            {footerData.company.certifications.map((cert: AnyObj, index: number) => (
              <div key={index} className="group relative">
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-24 h-24 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 block"
                >
                  <img src={cert.image} alt={cert.alt} className={cert.className} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

