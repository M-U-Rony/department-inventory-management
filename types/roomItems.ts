export interface BaseRoomItem {
  id: number;
  name: string;
  status: string;
  Note: string | null;
  roomId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Printer extends BaseRoomItem {
  brand: string | null;
}

export interface Almari extends BaseRoomItem {}

export interface Bookshelf extends BaseRoomItem {}
