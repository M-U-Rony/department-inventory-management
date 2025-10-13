export interface Item {
  id: string;
  name: string;
  processor?: string;
  ram?: string;
  hdd?: string;
  ssd?: string;
  gpu?: string;
  status: string;
  note?: string;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
  brand?: string;
}

export type ItemKey = keyof Item;
export type ItemValue = string | number | null | undefined;
