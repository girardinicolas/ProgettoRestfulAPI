import { Injectable } from '@angular/core';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor() { }

  // GET - Carica 10 todos
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${this.baseUrl}?_limit=10`);
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Errore nel caricamento dei dati: ${error}`);
    }
  }

  // POST - Crea un nuovo todo
  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
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
      throw new Error(`Errore nella creazione: ${error}`);
    }
  }

  // PUT - Modifica un todo (sostituisce completamente)
  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    try {
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
