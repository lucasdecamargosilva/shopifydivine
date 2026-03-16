export const DEFAULTS = {
  backgroundColor: '#ffffff',
  gradient: null,
  textColor: '#000000',
  borderColor: '#000000',
  borderRadius: 0,
  borderWidth: 1,
  width: '100%',
  height: 45,
  padding: '8px 16px',
  shadow: false,
  shadowIntensity: 0.15,
  label: 'Provador Virtual',
  fontFamily: 'Inter',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 2,
  icon: 'cabine',
  iconPosition: 'left',
  iconSize: 20,
  iconCustomUrl: null,
  iconColor: '#000000',
  hoverAnimation: 'invert',
  badge: true,
  badgeText: 'Novidade!',
  customCSS: ''
};

export const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Poppins', 'Montserrat',
  'Open Sans', 'Lato', 'Playfair Display', 'Raleway'
];

export const ICON_OPTIONS = [
  { value: 'cabine', label: 'Cabine' },
  { value: 'cabide', label: 'Cabide' },
  { value: 'espelho', label: 'Espelho' },
  { value: 'provador', label: 'Provador' },
  { value: 'custom', label: 'Upload Custom' },
  { value: 'none', label: 'Sem icone' }
];

export const ANIMATION_OPTIONS = [
  { value: 'invert', label: 'Inverter cores' },
  { value: 'scale', label: 'Aumentar' },
  { value: 'glow', label: 'Brilho' },
  { value: 'slide', label: 'Deslizar' },
  { value: 'shake', label: 'Balancar' },
  { value: 'none', label: 'Nenhuma' }
];
