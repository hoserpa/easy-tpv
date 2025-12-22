const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface Familia {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Articulo {
  id: number;
  name: string;
  price: number;
  family_id: number;
  created_at?: string;
  updated_at?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Familias
  async getFamilias(): Promise<Familia[]> {
    return this.request<Familia[]>('/familias');
  }

  async getFamilia(id: number): Promise<Familia> {
    return this.request<Familia>(`/familias/${id}`);
  }

  async createFamilia(data: { name: string }): Promise<Familia> {
    return this.request<Familia>('/familias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFamilia(id: number, data: { name: string }): Promise<Familia> {
    return this.request<Familia>(`/familias/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFamilia(id: number): Promise<void> {
    return this.request<void>(`/familias/${id}`, {
      method: 'DELETE',
    });
  }

  // Artículos
  async getArticulos(): Promise<Articulo[]> {
    return this.request<Articulo[]>('/articulos');
  }

  async getArticulo(id: number): Promise<Articulo> {
    return this.request<Articulo>(`/articulos/${id}`);
  }

  async getArticulosByFamily(familyId: number): Promise<Articulo[]> {
    return this.request<Articulo[]>(`/articulos/family/${familyId}`);
  }

  async createArticulo(data: { name: string; price: number; familia_id: number }): Promise<Articulo> {
    return this.request<Articulo>('/articulos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArticulo(id: number, data: { name?: string; price?: number; familia_id?: number }): Promise<Articulo> {
    return this.request<Articulo>(`/articulos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteArticulo(id: number): Promise<void> {
    return this.request<void>(`/articulos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();