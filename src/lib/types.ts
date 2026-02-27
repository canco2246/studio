export type AssetStatus = 'Active' | 'Maintenance' | 'Retired' | 'Transferred';

export interface Asset {
  id: string; // Internal UUID
  tagId: string; // RFID Tag ID (Unique)
  name: string;
  category: string;
  location: string;
  description: string;
  status: AssetStatus;
  lastScanned: string;
  createdAt: string;
}

export type NewAsset = Omit<Asset, 'id' | 'createdAt' | 'lastScanned'>;