export type BagCategory =
  | 'tote'
  | 'crossbody'
  | 'shoulder'
  | 'mini'
  | 'backpack'
  | 'clutch'
  | 'hobo'
  | 'bucket'
  | 'saddle'
  | 'satchel'
  | 'balmain'
  | 'duffel'
  | (string & {});

export interface BagTypeOption {
  id: BagCategory;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  basePrice: number;
  icon: string;
  image: string;
}

export type BagSize = 'mini' | 'small' | 'medium' | 'large';

export interface SizeOption {
  id: BagSize;
  nameEn: string;
  nameAr: string;
  dimensions: string; // e.g. "28 x 20 x 10 cm"
  priceDelta: number;
}

export interface MaterialOption {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  priceDelta: number;
  texture: string;
}

export interface ColorOption {
  id: string;
  nameEn: string;
  nameAr: string;
  hex: string;
  secondaryHex?: string;
  priceDelta: number;
}

export type HardwareType = 'gold' | 'silver' | 'brass' | 'black' | 'rosegold' | 'gunmetal' | (string & {});

export interface HardwareOption {
  id: HardwareType;
  nameEn: string;
  nameAr: string;
  color: string;
  priceDelta: number;
}

export interface StrapOption {
  id: string;
  nameEn: string;
  nameAr: string;
  priceDelta: number;
  image: string;
}

export interface MonogramConfig {
  enabled: boolean;
  text: string;
  style: 'gold_foil' | 'silver_foil' | 'blind_emboss' | 'embroidery';
  font: 'serif' | 'sans' | 'script';
  placement: 'front_center' | 'hangtag' | 'interior';
}

export interface AddonOption {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
}

export interface CustomBagConfiguration {
  bagType: BagCategory;
  size: BagSize;
  materialId: string;
  primaryColorId: string;
  customColorHex?: string;
  customColorName?: string;
  accentColorId: string;
  hardware: HardwareType;
  strapId: string;
  handleColorId?: string;
  handleColorHex?: string;
  monogram: MonogramConfig;
  selectedAddonIds: string[];
}

export interface ProductItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: BagCategory;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  isCustomizable: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  defaultConfig?: Partial<CustomBagConfiguration>;
}

export interface CartItem {
  id: string;
  product?: ProductItem;
  configuration?: CustomBagConfiguration;
  calculatedPrice: number;
  quantity: number;
  customSummaryText: string;
  previewDataUrl?: string;
}
