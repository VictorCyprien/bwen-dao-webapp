/** @type {import('tailwindcss').Config} */

/**
 * SYSTÈME DE COULEURS CENTRALISÉ
 * 
 * Toutes les couleurs de l'application sont définies ici.
 * Pour modifier une couleur, il suffit de changer sa valeur hexadécimale ci-dessous.
 * Les changements seront automatiquement appliqués partout où cette couleur est utilisée.
 */

import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // COULEURS PRINCIPALES
        'primary': 'rgba(87, 123, 242, 1)',    // Couleur d'accentuation principale (boutons, liens, etc.)
        'secondary': 'rgba(173, 33, 255, 1)',  // Couleur secondaire pour les gradients
        'background': 'rgba(12, 12, 12, 1)', // Couleur de fond de l'application
        'text': 'rgba(240, 240, 240, 1)',    // Couleur de texte principale
        
        // SURFACES - Variations de blanc avec opacité pour les éléments d'interface
        'surface': {
          100: 'rgba(255, 255, 255, 0.05)', // Très subtil (éléments légèrement surélevés)
          200: 'rgba(255, 255, 255, 0.08)', // Léger (cartes, boutons inactifs)
          300: 'rgba(255, 255, 255, 0.12)', // Moyen (éléments interactifs, bordures)
          400: 'rgba(255, 255, 255, 0.16)', // Prononcé (éléments en surbrillance)
          500: 'rgba(255, 255, 255, 0.24)', // Très prononcé (éléments très en évidence)
          'menu': 'rgba(12, 12, 12, 1)',    // Menu de navigation (dropdowns)
        },
        
        // COULEURS D'ÉTAT - Pour les messages et indicateurs
        'success': '#4ade80', // Vert (succès, validation)
        'error': '#ef4444',   // Rouge (erreur, alerte)
        'warning': '#f59e0b', // Jaune/orange (avertissement)
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
        'pulse-slow-delayed': 'pulse-slow-delayed 10s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 7s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.9,
            transform: 'scale(1.05)',
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.6,
            transform: 'scale(1.05)',
          },
        },
        'pulse-slow-delayed': {
          '0%, 100%': {
            opacity: 0.7,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.5,
            transform: 'scale(1.03)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'float-delayed': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-15px)',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        'twinkle': {
          '0%, 100%': {
            opacity: 0.2,
          },
          '50%': {
            opacity: 0.8,
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    tailwindScrollbar,
  ],
  variants: {
    scrollbar: ['rounded']
  },
};
