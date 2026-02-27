import { Asset, NewAsset } from './types';

// Simple in-memory storage simulation
let assets: Asset[] = [
  {
    id: '1',
    tagId: 'RFID-1001-XYZ',
    name: 'MacBook Pro 16"',
    category: 'Electronics',
    location: 'Office A-102',
    description: 'Silver M2 Max workstation for design team.',
    status: 'Active',
    lastScanned: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    tagId: 'RFID-2005-ABC',
    name: 'Chainway C72 Scanner',
    category: 'Hardware',
    location: 'IT Lab',
    description: 'Mobile RFID scanner used for inventory auditing.',
    status: 'Active',
    lastScanned: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    tagId: 'RFID-5002-LLL',
    name: 'Ergonomic Desk Chair',
    category: 'Furniture',
    location: 'Meeting Room 2',
    description: 'High-back mesh chair with lumbar support.',
    status: 'Maintenance',
    lastScanned: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export function getAssets() {
  return [...assets].sort((a, b) => new Date(b.lastScanned).getTime() - new Date(a.lastScanned).getTime());
}

export function getAssetByTag(tagId: string) {
  return assets.find(a => a.tagId === tagId);
}

export function recordScan(tagId: string): Asset | null {
  const assetIndex = assets.findIndex(a => a.tagId === tagId);
  if (assetIndex !== -1) {
    const updatedAsset = {
      ...assets[assetIndex],
      lastScanned: new Date().toISOString()
    };
    assets[assetIndex] = updatedAsset;
    return updatedAsset;
  }
  return null;
}

export function addAsset(newAsset: NewAsset): Asset {
  if (assets.some(a => a.tagId === newAsset.tagId)) {
    throw new Error(`Asset with tag ID ${newAsset.tagId} already exists.`);
  }

  const asset: Asset = {
    ...newAsset,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    lastScanned: new Date().toISOString(),
  };

  assets = [asset, ...assets];
  return asset;
}

export function updateAsset(id: string, updates: Partial<Asset>) {
  assets = assets.map(a => {
    if (a.id === id) {
      return { ...a, ...updates };
    }
    return a;
  });
  return assets.find(a => a.id === id);
}

export function deleteAsset(id: string) {
  assets = assets.filter(a => a.id !== id);
}
