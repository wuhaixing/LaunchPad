export interface Credentials {
  username:string;
  email:string;
  password:string;
}
export type StrapiUser = {
  id: number;
  username: string;
  email: string;
  mobile: string;
  avatar: Image;
  blocked: boolean;
  provider: 'local' | 'github';
};
export type SessionUser = {
  strapiUserId:number;
  name:string;
  email:string;
  blocked:boolean;
}
export type StrapiLoginResponse = {
  jwt: string;
  user: StrapiUser;
};

export interface Category {
  name: string;
}

export interface Image {
  url: string;
  alternativeText: string;
}

export interface Article {
  title: string;
  description: string;
  slug: string;
  content: string;
  dynamic_zone: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  image: Image;
  categories: Category[]
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  plans: any[];
  perks: any[];
  featured?: boolean;
  images: any[];
  categories?: any[];
};