import type { ImageMetadata } from 'astro';
import cafeImg from '../assets/café.png';
import croissantImg from '../assets/croissant & sourdough.jpg';
import brunchCeramicaImg from '../assets/terroso-brunch-ceramica.jpg';
import criollaImg from '../assets/criolla.jpg';
import ambienteImg from '../assets/terroso-ambiente-hero.jpeg';
import fundadoresImg from '../assets/fundadores.jpg';

export interface GalleryItem {
  image: ImageMetadata;
  imageAlt: string;
  subtitle: string;
  title: string;
}

export const galleryItems: GalleryItem[] = [
  {
    image: cafeImg,
    imageAlt: 'Barista preparando extracción artesanal de café de especialidad con método V60',
    subtitle: 'El Ritual de la Mañana',
    title: 'V60 & Métodos Lentos',
  },
  {
    image: croissantImg,
    imageAlt: 'Croissants recién horneados y panes hogaza de masa madre sobre mesa rústica',
    subtitle: 'Taller de Masas',
    title: 'Horneo Diario de Madrugada',
  },
  {
    image: brunchCeramicaImg,
    imageAlt: 'Desayuno criollo de autor servido en vajilla de cerámica artesanal con café filtrado',
    subtitle: 'Cocina de Estación',
    title: 'Brunch en Platos Cerámicos',
  },
  {
    image: criollaImg,
    imageAlt: 'Cazuela de barro caliente con shakshuka criolla, ají dulce y queso de mano',
    subtitle: 'Cocina de Fuego',
    title: 'Cazuela Criolla de Leña',
  },
  {
    image: ambienteImg,
    imageAlt: 'Salón de café con paredes de terracota, abundante vegetación y mesas de madera viva',
    subtitle: 'Atmósfera & Espacio',
    title: 'Refugio Botánico en Altamira',
  },
  {
    image: fundadoresImg,
    imageAlt: 'Valentina y Rodrigo en la barra de café de especialidad de Terroso',
    subtitle: 'Oficio & Compromiso',
    title: 'Tostadores en Altamira',
  },
];
