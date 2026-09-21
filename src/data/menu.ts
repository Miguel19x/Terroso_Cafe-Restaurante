import type { ImageMetadata } from 'astro';
import tostadaImg from '../assets/Tostada Terroso.jpeg';
import cafeImg from '../assets/café.png';
import croissantImg from '../assets/croissant & sourdough.jpg';
import criollaImg from '../assets/criolla.jpg';

export interface MenuItem {
  name: string;
  price: string;
  numericPrice: number;
  description: string;
  category: string;
  image: ImageMetadata;
  imageAlt: string;
  badge: string;
  icon: string;
  iconLabel: string;
  methodOrTime?: string;
}

export const menuCategories = [
  { id: 'todos', label: 'Todos' },
  { id: 'brunch', label: 'Brunch & Desayuno' },
  { id: 'cafe', label: 'Café de Especialidad' },
  { id: 'panaderia', label: 'Masa Madre & Horno' },
];

export const menuItems: MenuItem[] = [
  {
    name: 'Tostada Terroso',
    price: '$8,50',
    numericPrice: 8.5,
    description:
      'Aguacate sobre pan de masa madre, huevos pochados de corral, dukkah tostado y brotes frescos.',
    category: 'brunch',
    image: tostadaImg,
    imageAlt: 'Tostada de masa madre artesanal con aguacate venezolano machacado y huevos pochados de corral',
    badge: 'Favorito',
    icon: 'grain',
    iconLabel: 'Masa Madre 48h',
    methodOrTime: 'Masa Madre 48h',
  },
  {
    name: 'Café Táchira V60',
    price: '$4,50',
    numericPrice: 4.5,
    description:
      'Filtrado de altura tachirense con notas dulces a panela, cacao fino y frutas tropicales.',
    category: 'cafe',
    image: cafeImg,
    imageAlt: 'Café de especialidad filtrado en método V60 con granos cosechados en el Táchira venezolano',
    badge: 'Origen Único',
    icon: 'water_drop',
    iconLabel: 'Extracción Manual',
    methodOrTime: 'Extracción Manual',
  },
  {
    name: 'Croissant & Sourdough',
    price: '$5,00',
    numericPrice: 5.0,
    description:
      'Hojaldre y hogaza artesanal con mantequilla de campo batida y mermelada casera de guayaba.',
    category: 'panaderia',
    image: croissantImg,
    imageAlt: 'Croissant hojaldrado y rebanadas de pan de masa madre con mermelada artesanal de guayaba',
    badge: 'Recién Horneado',
    icon: 'oven_gen',
    iconLabel: 'Horno de Piedra',
    methodOrTime: 'Horno de Piedra',
  },
  {
    name: 'Shakshuka Criolla',
    price: '$9,00',
    numericPrice: 9.0,
    description:
      'Huevos de corral en tomates asados con ají dulce margariteño, queso de mano y arepitas.',
    category: 'brunch',
    image: criollaImg,
    imageAlt: 'Cazuela de shakshuka criolla con huevos de corral, ají dulce y queso de mano fundido',
    badge: 'Cocina de Fuego',
    icon: 'local_fire_department',
    iconLabel: 'Leña Nativa',
    methodOrTime: 'Leña Nativa',
  },
];
