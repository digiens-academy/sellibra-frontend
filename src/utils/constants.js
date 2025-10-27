import { FaPalette, FaRobot, FaImage, FaMagic, FaSyncAlt, FaPencilAlt, FaTags, FaCalculator, FaTshirt } from 'react-icons/fa';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const PRINTNEST_URL = import.meta.env.VITE_PRINTNEST_URL || 'https://printnest.com';

export const STORAGE_KEYS = {
  TOKEN: 'digiens_token',
  USER: 'digiens_user',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password/:token',
  DASHBOARD: '/dashboard',
  MODULE_SELECTION: '/modules',
  PRINTNEST: '/printnest',
  PRINTNEST_DASHBOARD: '/printnest/dashboard',
  ETSY_AI: '/etsy-ai',
  ETSY_AI_DASHBOARD: '/etsy-ai/dashboard',
  ETSY_AI_DESIGN: '/etsy-ai/design',
  ETSY_AI_DESIGN_REMOVE_BG: '/etsy-ai/design/remove-background',
  ETSY_AI_DESIGN_TEXT_TO_IMAGE: '/etsy-ai/design/text-to-image',
  ETSY_AI_DESIGN_IMAGE_TO_IMAGE: '/etsy-ai/design/image-to-image',
  ETSY_AI_DESIGN_MOCKUP_GENERATOR: '/etsy-ai/design/mockup-generator',
  ETSY_AI_DESCRIPTION: '/etsy-ai/description',
  ETSY_AI_TITLE: '/etsy-ai/title',
  ETSY_AI_PROFIT: '/etsy-ai/profit-calculator',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SESSIONS: '/admin/sessions',
};

// Icon'lar için metadata
export const ICON_COLORS = {
  PRIMARY: '#00D4A0',
  SECONDARY: '#4A90E2',
  TERTIARY: '#2F4858',
  ACCENT: '#FFD700',
};

export const MODULES = {
  PRINTNEST: {
    id: 'printnest',
    name: 'PrintNest',
    description: 'PrintNest tracking ve yönetim sistemi',
    Icon: FaPalette,
    iconColor: ICON_COLORS.PRIMARY,
    route: '/printnest/dashboard',
  },
  ETSY_AI: {
    id: 'etsy-ai',
    name: 'Etsy-AI Tools',
    description: 'Etsy mağaza yönetimi için AI destekli araçlar',
    Icon: FaRobot,
    iconColor: ICON_COLORS.SECONDARY,
    route: '/etsy-ai/dashboard',
    subModules: [
      {
        id: 'design',
        name: 'Tasarım',
        description: 'AI ile tasarım oluşturma ve düzenleme',
        Icon: FaPalette,
        iconColor: ICON_COLORS.PRIMARY,
        route: '/etsy-ai/design',
        subTools: [
          {
            id: 'remove-bg',
            name: 'Arka Plan Kaldırma',
            description: 'Görselin arka planını otomatik kaldır',
            Icon: FaImage,
            iconColor: ICON_COLORS.SECONDARY,
            route: '/etsy-ai/design/remove-background',
          },
          {
            id: 'text-to-image',
            name: 'Text-to-Image',
            description: 'Metin açıklamasından görsel oluştur',
            Icon: FaMagic,
            iconColor: ICON_COLORS.ACCENT,
            route: '/etsy-ai/design/text-to-image',
          },
          {
            id: 'image-to-image',
            name: 'Image-to-Image',
            description: 'Mevcut görseli AI ile dönüştür',
            Icon: FaSyncAlt,
            iconColor: ICON_COLORS.PRIMARY,
            route: '/etsy-ai/design/image-to-image',
          },
          {
            id: 'mockup-generator',
            name: 'Mockup Oluşturucu',
            description: 'Tasarımını ürün üzerinde görüntüle',
            Icon: FaTshirt,
            iconColor: ICON_COLORS.TERTIARY,
            route: '/etsy-ai/design/mockup-generator',
          },
        ],
      },
      {
        id: 'description',
        name: 'Açıklama',
        description: 'AI ile ürün açıklaması oluşturma',
        Icon: FaPencilAlt,
        iconColor: ICON_COLORS.TERTIARY,
        route: '/etsy-ai/description',
      },
      {
        id: 'title',
        name: 'Başlık & Tag',
        description: 'AI ile SEO uyumlu başlık oluşturma',
        Icon: FaTags,
        iconColor: ICON_COLORS.SECONDARY,
        route: '/etsy-ai/title',
      },
      {
        id: 'profit',
        name: 'Kar Hesaplama',
        description: 'Ürün karlılığı hesaplama aracı',
        Icon: FaCalculator,
        iconColor: ICON_COLORS.PRIMARY,
        route: '/etsy-ai/profit-calculator',
      },
    ],
  },
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

