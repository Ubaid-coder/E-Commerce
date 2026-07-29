export interface ProductType {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  category?: string;
  discountPrice?:number;
  brand?:string;
  ratingsAverage?:string;
  ratingsQuantity?:string;
}

// Extend ProductType or define a dedicated interface for items in the cart
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string; // Storing the primary preview image as a single string
  quantity: number;
}