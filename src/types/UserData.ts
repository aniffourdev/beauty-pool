// UserData.ts
export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dialcode: number;
  birthday?: string;
  gender?: string;
  avatar?: string;
  home_address?: string;
  work_address?: string;
  category?: number[]; // Add this if it's part of the user data
}

export interface DataUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday?: Date | null;
  avatar?: string;
  dialcode?: string;
  phone?: string;
  home_address?: string;
  work_address?: string;
  gender?: string;
}
