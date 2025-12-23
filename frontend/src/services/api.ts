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
  familia_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Ticket {
  id: number;
  subtotal: number;
  discount_type: 'fixed' | 'percent' | null;
  discount_value: number | null;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface TicketLine {
  id: number;
  ticket_id: number;
  articulo_id: number;
  qty: number;
  unit_price: number;
  discount_type: 'fixed' | 'percent' | null;
  discount_value: number | null;
  total: number;
  created_at: string;
  updated_at: string;
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
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

  // Tickets
  async createTicket(data: { lines: Array<{ articulo_id: number; qty: number; unit_price: number; discount_type?: 'fixed' | 'percent' | null; discount_value?: number | null }>; subtotal: number; discount_type?: 'fixed' | 'percent' | null; discount_value?: number | null; total: number }): Promise<{ ticket: Ticket; lines: TicketLine[] }> {
    try {
      // Ahora vamos directamente al endpoint real
      return this.request<{ ticket: Ticket; lines: TicketLine[] }>('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  }

  async getTickets(): Promise<Ticket[]> {
    return this.request<Ticket[]>('/tickets');
  }

  async getTicket(id: number): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${id}`);
  }
}

export const apiService = new ApiService();