import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokeApiService, Todo } from '../../services/poke-api.service';

// Modello interno usato dalla lista poke dopo la trasformazione dal TODO remoto
interface PokeData {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  completed: boolean;
}

@Component({
  selector: 'app-list-poke',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-poke.component.html',
  styleUrl: './list-poke.component.css',
})
export class ListPokeComponent {
  /**
   * -------------------------------------------------------------------------
   *  STATO PRINCIPALE DEL COMPONENTE
   * -------------------------------------------------------------------------
   *  pokeList          -> rappresenta l'elenco di poke renderizzate nel template;
   *                       deriva dai todos remoti convertiti con `todoToPokeData`.
   *  loading           -> flag che attiva il loader mentre attendiamo la risposta HTTP.
   *  error             -> contiene il messaggio d'errore da mostrare all'utente.
   *
   *  pokeImages / descriptions / prices -> dati di contesto usati per arricchire la UI.
   *                                        Avendo l'API di esempio solo `title` e `completed`,
   *                                        generiamo descrizione, prezzo e immagine “di fantasia”.
   *
   *  editingId / editedPoke / updating  -> gestiscono il form di modifica in-place.
   *                                        Quando `editingId` coincide con l'id di una card,
   *                                        mostriamo l'editor e salviamo i valori in editedPoke.
   *
   *  deletingId         -> id della card in fase di conferma eliminazione.
   * -------------------------------------------------------------------------
   */
  pokeList: PokeData[] = [];
  loading = false;
  error: string | null = null;
  private readonly initialized = signal(false);

  /**
   * Raccolta di immagini “placeholder” da assegnare ciclicamente ai poke caricati.
   * L'indice modulo lunghezza dell'array ci consente di riutilizzarle senza errori.
   */
  pokeImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAY7dPMR6muLm-Zmk9qW7Xlog5ZciPR1EO_45Pi9SdYW8wi58zDzH9CQGMKED1sbhcjpN_aBTyzkVNKMqHu-eamtP0SOYvuc2-fxvncKbx_EB2bXesjcx4mOhB-vSc7Nt_F8aFURjm07LbuT4JSsRnXPv9yxmOPazz5Jdms81ptx0X6Qcq2iRdcU1hF4jR7EQQBmi1kA1GCJk8dkT52WdCC4Q_soMAsY6mbDFpnD5omcU8_JdGrYDMV5gXbrHVsfECzeiDCA77fY_su',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCS4CdoLWccLfaEGh5Iyr4lirq7grOPfUY91cS9E8bZyiG6BqRLpgCX4kR1TUB337svKfE0FHJZY-7_TKEfNNznIxd717a67YVXi3oXVXnQDPM2D6c3kPh0WIdXbK6c95I3PakZhwQh1iCLWZrtW9tdqY6r5eRAola4sPaBc3KZ6zAzAlDEOZBiRy16UoowJzcB55QGN43xZE_s8ujjL7TsHiH8hCuNFskkTYoWHWp8P_cFfEKTbibxWSCWSvzH1cshIorYwhJV-tlI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7gxQObUBdg2kZ_XqoyA_utXT_E7Isd6FU966aUb3hYIxenNEFwRP34Ld4Or0kIQHQRnNVdfDRcEyX78zYwSzehLKy4HjmzmMJooMK4i0L45Wa9xDwu1YccPwuFvEaUx6eJmy-TyCeFWt6HyZA3DSCnLXdkpHadyzskg_HBPcHrodum3JFxp9W929pKxumo8PBngRC3s1SJdwkH6NNGSNhOAk-w34y4DJsM-Y7wR9Jq_FnFUCZkeruOIA1n0igpjYjxSduHgteNXIS',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDd4J9sQNE8Wqj_sFtkITywIErvl7PScv6JBHKwfsnpGSuwH_1TUEsE9422W7Kanu29-ZLlXD8tFyFjq1JsmKyICfemMywBqQ19h2AbM7XnyL-2EGGSHNlMUzJQVo3ljl4M2IcIlAvXrHDZXot-srph1Y7gu0goFFxhKGtBneHv08hgwTl8gENqWzSlu0SZysd7AAAElt8e5akPNmWx0LK_bZXNqi4POxIosRG8aYV5F1zUlAaaXvEKmMu0sYDPGG82kmk0WyxKZRxB',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDAbHEeR3jcqPcwTPUWyNIgNh_TnNiq_OkGqofaJV9lVIDQUNh5KlCuc_kZJxncFujt_fYZi1zYxnTvzqYHePCQHfpI9PRx7QkOlZRWQCLJ8SgyJMdzxSFa_Fof9FSfLlA4srs8rEoTes-INbSzaf0AfSPsHciwlwWabZPL1CNnKTIRBahrlD28DiLSN-1RqGCp1PRrh5v_GM8C9CD-nQG27VSHEUYj6t2ytgt1aDgxsEo7P520z6igPU7wm6ojuwzbYi0Od3IJqSUU',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiPjk97ScJPz4DLJtf_aqShZudlOnqSDG4F-cQFF7uM7UQOz3dFZ_kHFz6tZV16wbwISFLqbsWiEBV63XFFJ8RLaOo_rJ3O3vHanO1mlZ11NNnFsOOClViMW9A5AMjhPVqnJa-vLKlPwpDGy2bejYga05R6MXKXyjK1p9OMDs1lZ8YmERgWVF5KjxIKwgSNhkqayEkMv8Fa1oSfG2JHi9Mpng4WgtfyKG2oo9IU4bUjqz_5SQgjs9XXdUGHS604daJHKVabLp9T20z',
  ];

  /**
   * Descrizioni “marketing” abbinate ai poke. Il modulo dell'indice assicura
   * di assegnare testi coerenti anche quando l'elenco supera la lunghezza dell'array.
   */
  pokeDescriptions = [
    'Tonno, riso, edamame, mais, salsa piccante',
    'Salmone, riso, avocado, alghe, salsa ponzu',
    'Tofu, quinoa, verdure miste, salsa di soia',
    'Tonno Ahi, riso, sesamo, cipolla croccante',
    'Pollo, riso, mango, avocado, maionese piccante',
    'Gamberi in tempura, riso, cetriolo, salsa unagi',
  ];

  /**
   * Prezzi demo associati ai poke. Anche qui usiamo l'indice modulo lunghezza.
   */
  pokePrices = [12.5, 13.0, 11.5, 12.0, 12.0, 13.5];

  // Stato del form di modifica e flag di salvataggio in corso.
  editingId: number | null = null;
  editedPoke = {
    title: '',
    description: '',
    price: 0,
  };
  updating = false;

  // Stato della finestra di conferma eliminazione.
  deletingId: number | null = null;

  private readonly pokeApiService = inject(PokeApiService);

  constructor() {
    // Effect che carica i dati solo una volta quando il componente viene inizializzato
    // Questo si attiva automaticamente ogni volta che il componente viene creato/renderizzato
    effect(() => {
      if (!this.initialized()) {
        this.initialized.set(true);
        // Usiamo queueMicrotask per evitare l'errore NG0100
        queueMicrotask(() => this.loadTodos());
      }
    });
  }

  /**
   * Converte un elemento Todo remoti in un PokeData locale arricchito.
   * @param todo   record ottenuto da JSONPlaceholder
   * @param index  indice nell'array originale, utile per ciclare assets/descrizioni
   */
  private todoToPokeData(todo: Todo, index: number): PokeData {
    return {
      id: todo.id,
      title: todo.title,
      description: this.pokeDescriptions[index % this.pokeDescriptions.length],
      price: this.pokePrices[index % this.pokePrices.length],
      imageUrl: this.pokeImages[index % this.pokeImages.length],
      completed: todo.completed,
    };
  }

  /**
   * Effettua la chiamata GET verso l'API di esempio, converte i resultados
   * e aggiorna stato e flag di caricamento. Ogni blocco (try/catch/finally)
   * è commentato per chiarire la gestione di successo / errore / cleanup.
   */
  async loadTodos() {
    this.loading = true; // attiva spinner nel template
    this.error = null; // azzera eventuali messaggi precedenti
    try {
      const todos = await this.pokeApiService.getTodos();
      this.pokeList = todos.map((todo, index) =>
        this.todoToPokeData(todo, index)
      );
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Errore sconosciuto';
      console.error('Errore nel caricamento:', err);
    } finally {
      this.loading = false; // disattiviamo comunque il loader
    }
  }

  /** Avvia la modalità modifica per la card selezionata. */
  startEdit(poke: PokeData) {
    this.editingId = poke.id;
    this.editedPoke = {
      title: poke.title,
      description: poke.description,
      price: poke.price,
    };
  }

  /** Annulla la modifica, ripristinando lo stato iniziale del form. */
  cancelEdit() {
    this.editingId = null;
    this.editedPoke = { title: '', description: '', price: 0 };
  }

  /**
   * Salva (via PATCH) il titolo modificato. In questo esempio aggiorniamo anche
   * descrizione e prezzo localmente, pur non essendo spediti all'API demo.
   */
  async updatePoke(id: number) {
    if (!this.editedPoke.title.trim()) {
      this.error = 'Il titolo non può essere vuoto';
      return;
    }

    this.updating = true;
    this.error = null;
    try {
      const updated = await this.pokeApiService.patchTodo(id, {
        title: this.editedPoke.title,
      });

      // Aggiorna il poke nella lista
      const index = this.pokeList.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.pokeList[index] = {
          ...this.pokeList[index],
          title: updated.title,
          description: this.editedPoke.description,
          price: this.editedPoke.price,
        };
      }
      this.cancelEdit();
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Errore nell'aggiornamento";
      console.error("Errore nell'aggiornamento:", err);
    } finally {
      this.updating = false;
    }
  }

  /** Toggle dello stato “completed” di un poke, sincronizzato con l'API. */
  async toggleCompleted(poke: PokeData) {
    this.error = null;
    try {
      const updated = await this.pokeApiService.patchTodo(poke.id, {
        completed: !poke.completed,
      });
      const index = this.pokeList.findIndex((p) => p.id === poke.id);
      if (index !== -1) {
        this.pokeList[index].completed = updated.completed;
      }
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Errore nell'aggiornamento";
      console.error("Errore nell'aggiornamento:", err);
    }
  }

  /** Mostra il modale di conferma eliminazione. */
  confirmDelete(id: number) {
    this.deletingId = id;
  }

  /** Chiude il modale di conferma eliminazione. */
  cancelDelete() {
    this.deletingId = null;
  }

  /** Elimina definitivamente il poke (API + stato locale). */
  async deletePoke(id: number) {
    this.error = null;
    try {
      await this.pokeApiService.deleteTodo(id);
      this.pokeList = this.pokeList.filter((p) => p.id !== id);
      this.cancelDelete();
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Errore nell'eliminazione";
      console.error("Errore nell'eliminazione:", err);
    }
  }
}
