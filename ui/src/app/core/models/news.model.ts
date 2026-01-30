import { FormControl } from "@angular/forms";

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  }
}

export interface NewsFormData {
  userId: string;
  id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  images?: string[];
}

export interface NewsFormType {
  title: FormControl<string | null>;
  excerpt: FormControl<string | null>;
  content: FormControl<string | null>;
  images: FormControl<string[] | null>;
}

export interface NewsColumn {
  field: string;
  header: string;
  isAction?: boolean;
  style?: string;
}
