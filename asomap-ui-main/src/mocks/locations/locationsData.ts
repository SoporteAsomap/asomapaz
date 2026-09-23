import { Location } from '@/interfaces';

const isOpenNow = (hours: { openingTime: string; closingTime: string }) => {
    const now = new Date();
    const day = now.getDay(); // 0 (domingo) - 6 (sábado)

    // Definir horarios
    const openingHour = new Date();
    const closingHour = new Date();

    const [openingHourString, openingPeriod] = hours.openingTime.split(" ");
    const [closingHourString, closingPeriod] = hours.closingTime.split(" ");

    openingHour.setHours(parseInt(openingHourString), 0);
    closingHour.setHours(parseInt(closingHourString), 0);

    // Ajustar según el periodo AM/PM
    if (openingPeriod === 'PM' && openingHour.getHours() < 12) openingHour.setHours(openingHour.getHours() + 12);
    if (closingPeriod === 'PM' && closingHour.getHours() < 12) closingHour.setHours(closingHour.getHours() + 12);

    // Verifica si es sábado (6) o lunes a viernes (1-5)
    if (day >= 1 && day <= 5) {
        // De lunes a viernes: 8:30 AM - 5 PM
        return now >= openingHour && now < closingHour;
    } else if (day === 6) {
        // Sábado: 8:30 AM - 12:30 PM
        const saturdayOpeningTime = new Date(openingHour);
        saturdayOpeningTime.setHours(8, 30); // 8:30 AM
        const saturdayClosingTime = new Date();
        saturdayClosingTime.setHours(12, 30); // 12:30 PM
        return now >= saturdayOpeningTime && now < saturdayClosingTime;
    } else {
        // Domingo: Cerrado
        return false;
    }
}

export const getScheduleText = (type: 'branch' | 'atm', hours?: { openingTime: string; closingTime: string }) => {
    if (type === 'atm') {
        return {
            availability: '24/7',
            scheduleText: 'Disponible 24/7 ',
            availabilityClass: 'bg-green-100 text-green-700'
        };
    }

    return {
        scheduleText: `Lunes a viernes ${hours?.openingTime} - ${hours?.closingTime}\nSábado 8:30 - 13:00`,
        availabilityClass: hours?.openingTime ? 'bg-yellow-100 text-yellow-700' : ''
    };
};

export const locations: Location[] = [
    {
        id: '1',
        type: 'branch',
        name: 'Oficina Principal',
        address: 'Calle Independencia Esq. José María Michel, Moca',
        phone: '(809)-578-2321',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.396886198258557, lng: -70.52569771346013 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '2',
        type: 'branch',
        name: 'Gaspar Hernández',
        address: 'Calle Duarte no. 6, Plaza Coconut, Mod. 1-A',
        phone: '(809)-587-2421',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.630808933744376, lng: -70.27968519126787 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '3',
        type: 'branch',
        name: 'Cayetano Germosén',
        address: 'Av. Duarte no. 36',
        phone: '(809)-970-4408',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.344612847276945, lng: -70.4829511056465 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '4',
        type: 'branch',
        name: 'Villa Tapia',
        address: 'Calle Duarte no. 45',
        phone: '(809)-574-3001',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.299885347698954, lng: -70.4217947673062 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '5',
        type: 'branch',
        name: 'Licey al Medio',
        address: 'Calle Duarte no. 84',
        phone: '(809)-580-7923',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.431389540883544, lng: -70.6033911959623 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '6',
        type: 'branch',
        name: 'Altamira',
        address: 'Calle Duarte esq. San José, Puerto Plata',
        phone: '(809)-571-7444',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.694681996605176, lng: -70.83601738678165 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '7',
        type: 'branch',
        name: 'San Víctor',
        address: 'Calle Principal #60, San Victor, Moca',
        phone: '(809)-823-0141',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.450814626071104, lng: -70.53279690767233 },
        isOpen: false,
        services: [
           'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '8',
        type: 'branch',
        name: 'Juan López',
        address: 'Carretera Moca, Villa Trina Km. 4 ½',
        phone: '(809)-822-1022',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.429868699153175, lng: -70.49870033264217 },
        isOpen: false,
        services: [
          'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '9',
        type: 'branch',
        name: 'Plaza Sunrise',
        address: 'Plaza Sunrise 1er Nivel, Aut. Ramón Cácares, Moca',
        phone: '(809)-578-6132',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.38665766805509, lng: -70.53091496956397 },
        isOpen: false,
        services: [
           'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '10',
        type: 'branch',
        name: 'Bella Terra Mall',
        address: 'Ave. Juan Pablo Duarte, 1er Nivel, Mod A-005, Santiago',
        phone: '(809)-582-7676',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.458324466897224, lng: -70.68375058701864 },
        isOpen: false,
        services: [
           'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '11',
        type: 'branch',
        name: 'Plaza Colinas Mall',
        address: 'Ave. 27 de febrero, Plaza Colinas Mall, Segundo Nivel Mod. 202, Santiago',
        phone: '(809)-576-3322',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.47392689731066, lng: -70.71294050193097 },
        isOpen: false,
        services: [
           'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '12',
        type: 'branch',
        name: 'Plaza Nicole',
        address: 'Plaza Nicole Mod. 106 Ave. Rómulo Betancourt, Bella Vista, Santo Domingo',
        phone: '(829)-893-4555',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 18.457551851640414, lng: -69.94031728852111 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
    {
        id: '13',
        type: 'branch',
        name: 'Antonio de la Maza',
        address: 'Calle Antonio de la Maza No. 20, Esq. Del Rosario, Moca',
        phone: '(809)-578-2321',
        hours: {
            openingTime: '8:30 AM',
            closingTime: '5 PM',
        },
        coordinates: { lat: 19.39572711953576, lng: -70.52729419089661 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '8:30 AM', closingTime: '5 PM' }).availabilityClass,
    },
     {
        id: '14',
        type: 'branch',
        name: 'Punta Cana',
        address: 'Plaza Coral Town 2 módulo 114 Boulevard Turístico del Este, Bávaro Punta Cana.',
        phone: '(809)-893-4727',
        hours: {
            openingTime: '9:00 AM',
            closingTime: '6 PM',
        },
        coordinates: { lat: 18.6352926, lng: -68.4089515 },
        isOpen: false,
        services: [
            'Todos los Servicios'
        ],
        scheduleText: getScheduleText('branch', { openingTime: '9:00 AM', closingTime: '6 PM' }).scheduleText,
        availabilityClass: getScheduleText('branch', { openingTime: '9:00 AM', closingTime: '6 PM' }).availabilityClass,
    },
    {
        id: '6',
        type: 'atm',
        name: 'Cajero ASOMAP Centro Comercial',
        address: 'Centro Comercial Megacentro, Moca 56000',
        coordinates: { lat: 19.3944, lng: -70.5254 },
        services: [
            'Depósitos',
            'Retiros',
        ],
        scheduleText: getScheduleText('atm').scheduleText,
        availabilityClass: getScheduleText('atm').availabilityClass,
    },
    {
        id: '7',
        type: 'atm',
        name: 'Cajero ASOMAP Plaza Central',
        address: 'Plaza Central, Moca 56000',
        coordinates: { lat: 19.3954, lng: -70.5264 },
        services: [
            'Depósitos',
            'Retiros',
        ],
        scheduleText: getScheduleText('atm').scheduleText,
        availabilityClass: getScheduleText('atm').availabilityClass,
    },
    {
        id: '8',
        type: 'atm',
        name: 'Cajero ASOMAP Supermercado Nacional',
        address: 'Supermercado Nacional, Av. Independencia, Moca 56000',
        coordinates: { lat: 19.3914, lng: -70.5224 },
        services: [
            'Depósitos',
            'Retiros',
        ],
        scheduleText: getScheduleText('atm').scheduleText,
        availabilityClass: getScheduleText('atm').availabilityClass,
    },
    {
        id: '9',
        type: 'atm',
        name: 'Cajero ASOMAP Universidad',
        address: 'Universidad Tecnológica de Santiago, Moca 56000',
        coordinates: { lat: 19.4004, lng: -70.5284 },
        services: [
            'Depósitos',
            'Retiros',
        ],
        scheduleText: getScheduleText('atm').scheduleText,
        availabilityClass: getScheduleText('atm').availabilityClass,
    },
    {
        id: '10',
        type: 'atm',
        name: 'Cajero ASOMAP Hospital',
        address: 'Hospital Dr. Toribio Bencosme, Moca 56000',
        coordinates: { lat: 19.3894, lng: -70.5204 },
        services: [
            'Depósitos',
            'Retiros',
        ],
        scheduleText: getScheduleText('atm').scheduleText,
        availabilityClass: getScheduleText('atm').availabilityClass,
    },
    {
        id: '11',
        type: 'atm',
        name: 'Cajero ASOMAP Punta Cana',
        address: 'Plaza Coral Town 2 módulo 114 Boulevard Turístico del Este, Bávaro Punta Cana.',
        coordinates: { lat: 18.6352926, lng: -68.4089515 },
        services: [
            'Retiros',
        ],
        scheduleText: getScheduleText('atm').scheduleText,
        availabilityClass: getScheduleText('atm').availabilityClass,
    }
];

locations.forEach(location => {
    if (location.type === 'branch' && location.hours) {
        location.isOpen = isOpenNow(location.hours);
    }
});
