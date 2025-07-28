export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: string;
}

export enum ItemTypes {
  ELEMENT = 'element',
}

export interface DragItem {
  type: ItemTypes.ELEMENT;
  atomicNumber: number;
}