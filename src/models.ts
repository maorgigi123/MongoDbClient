
export interface ImageData {
    id: number;
    [key: string]: any;
  }
  
export interface CategoryData {
    [page: number]: ImageData[];
  }