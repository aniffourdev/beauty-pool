// Service.ts
export interface SubService {
  name: string;
  price: number;
  duration: number;
  description: string;
  price_type: string;
}

export interface ParentService {
  name: string;
  description: string;
  sub_services: SubService[];
}

export interface Service {
  id: string;
  parent_service: ParentService;
}
