import { Injectable } from '@angular/core';

export interface PokeSummary {
  base: string | null;
  proteins: string[];
  condiments: string[];
  sauces: string[];
  toppings: string[];
  notes?: string | null;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  summary?: PokeSummary;
}

export type CreatePokeRequest = Omit<Todo, 'id'> & { summary: PokeSummary };

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor() {}

  // GET - Carica 10 todos
  async getTodos(): Promise<Todo[]> {
    try {
      console.log('[PokeApiService] GET todos');
      const response = await fetch(`${this.baseUrl}?_limit=10`);
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Errore nel caricamento dei dati: ${error}`);
    }
  }

  // POST - Crea una nuova poke
  async createPoke(poke: CreatePokeRequest): Promise<Todo> {
    try {
      console.log('[PokeApiService] POST poke', poke);
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poke),
      });
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Errore nella creazione della poke: ${error}`);
    }
  }

  // PUT - Modifica un todo (sostituisce completamente)
  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    try {
      console.log('[PokeApiService] PUT todo', { id, todo });
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Errore nell'aggiornamento: ${error}`);
    }
  }

  // PATCH - Modifica parziale di un todo
  async patchTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    try {
      console.log('[PokeApiService] PATCH todo', { id, todo });
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Errore nell'aggiornamento: ${error}`);
    }
  }

  // DELETE - Elimina un todo
  async deleteTodo(id: number): Promise<void> {
    try {
      console.log('[PokeApiService] DELETE todo', id);
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Errore nell'eliminazione: ${error}`);
    }
  }
}
