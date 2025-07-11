// Shared types across frontend and backend
export interface User {
  id: string;
  email: string;
  name: string;
  role: "member" | "admin" | "moderator";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: string;
  isPublic: boolean;
  status: "draft" | "published" | "cancelled";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
