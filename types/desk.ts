export interface Desk {
  id: number;
  deskNo: string;
  labId: number;
  cpu: {
    id: number;
    name: string;
    brand: string;
    processor: string;
    ram: string;
    ssd: string;
    hdd: string;
    gpu: string;
    status: string;
    Note: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  cpuId: number | null;
  monitor: {
    id: number;
    name: string;
    brand: string;
    status: string;
    Note: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;

   monitorId: number | null;

  ups: {
    id: number;
    name: string;
    status: string;
    Note: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
 
  upsId: number | null;
  createdAt: string;
  updatedAt: string;
}
