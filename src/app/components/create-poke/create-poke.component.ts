import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CreatePokeRequest,
  PokeApiService,
  PokeSummary,
} from '../../services/poke-api.service';

type Kind = 'base' | 'protein' | 'condiment' | 'sauce' | 'topping';

interface Ingredient {
  id: string;
  name: string;
  kind: Kind;
  img: string; // path PNG ritagliata (trasparente)
  thumb?: string; // opzionale, se vuoi una miniatura diversa
  z: number; // ordine di sovrapposizione
  opacity?: number; // utile per salse
  isNone?: boolean; // opzione "nessuno" per la categoria
}

const NONE_THUMB =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23ffffff" fill-opacity="0.05"/><line x1="20" y1="20" x2="80" y2="80" stroke="%23ffffff" stroke-width="8" stroke-linecap="round"/><line x1="80" y1="20" x2="20" y2="80" stroke="%23ffffff" stroke-width="8" stroke-linecap="round"/></svg>';

@Component({
  selector: 'app-create-poke',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-poke.component.html',
  styleUrls: ['./create-poke.component.css'],
})
export class CreatePokeComponent {
  // Immagine della ciotola base (sotto a tutto)
  bowlImg = 'assets/img/bowl.png';

  // Catalogo ingredienti (nomi e file: adatta i path ai tuoi asset)
  ingredients: Ingredient[] = [
    // BASI (3)
    {
      id: 'base-riso',
      name: 'Riso',
      kind: 'base',
      img: 'assets/img/poke-base1.png',
      z: 10,
    },
    {
      id: 'base-riso-venere',
      name: 'Riso Venere',
      kind: 'base',
      img: 'assets/img/poke-base2.png',
      z: 10,
    },
    {
      id: 'base-mix',
      name: 'Mix',
      kind: 'base',
      img: 'assets/img/poke-base3.png',
      z: 10,
    },

    // PROTEINE (11) + opzione "nessuna"
    {
      id: 'none-protein',
      name: 'Nessuna proteina',
      kind: 'protein',
      img: '',
      thumb: NONE_THUMB,
      z: 19,
      isNone: true,
    },
    {
      id: 'prot-salmone',
      name: 'Salmone',
      kind: 'protein',
      img: 'assets/img/proteine1.png',
      z: 20,
    },
    {
      id: 'prot-salmone-cotto',
      name: 'Salmone cotto',
      kind: 'protein',
      img: 'assets/img/proteine2.png',
      z: 20,
    },
    {
      id: 'prot-gamberi-tempura',
      name: 'Gamberi in tempura',
      kind: 'protein',
      img: 'assets/img/proteine3.png',
      z: 20,
    },
    {
      id: 'prot-tonno',
      name: 'Tonno',
      kind: 'protein',
      img: 'assets/img/proteine4.png',
      z: 20,
    },
    {
      id: 'prot-tonno-cotto',
      name: 'Tonno cotto',
      kind: 'protein',
      img: 'assets/img/proteine5.png',
      z: 20,
    },
    {
      id: 'prot-gamberetti-cotti',
      name: 'Gamberetti cotti',
      kind: 'protein',
      img: 'assets/img/proteine6.png',
      z: 20,
    },
    {
      id: 'prot-tonno-scatola',
      name: 'Tonno in scatola',
      kind: 'protein',
      img: 'assets/img/proteine7.png',
      z: 20,
    },
    {
      id: 'prot-ceci-croccanti',
      name: 'Ceci croccanti',
      kind: 'protein',
      img: 'assets/img/proteine8.png',
      z: 20,
    },
    {
      id: 'prot-wrustel',
      name: 'Wrustel',
      kind: 'protein',
      img: 'assets/img/proteine9.png',
      z: 20,
    },
    {
      id: 'prot-pollo-teriyaki',
      name: 'Pollo teriyaki',
      kind: 'protein',
      img: 'assets/img/proteine10.png',
      z: 20,
    },
    {
      id: 'prot-uovo-sodo',
      name: 'Uovo sodo',
      kind: 'protein',
      img: 'assets/img/proteine11.png',
      z: 20,
    },

    // CONDIMENTI (6) + opzione "nessuno"
    {
      id: 'none-condiment',
      name: 'Nessun condimento',
      kind: 'condiment',
      img: '',
      thumb: NONE_THUMB,
      z: 29,
      isNone: true,
    },
    {
      id: 'cond-avocado',
      name: 'Mais',
      kind: 'condiment',
      img: 'assets/img/condimenti1.png',
      z: 30,
    },
    {
      id: 'cond-wakame',
      name: 'Pomodori',
      kind: 'condiment',
      img: 'assets/img/condimenti2.png',
      z: 30,
    },
    {
      id: 'cond-carote',
      name: 'Cetrioli',
      kind: 'condiment',
      img: 'assets/img/condimenti3.png',
      z: 30,
    },
    {
      id: 'cond-cetriolo',
      name: 'Carote',
      kind: 'condiment',
      img: 'assets/img/condimenti4.png',
      z: 30,
    },
    {
      id: 'cond-pomod',
      name: 'Alga Wakame',
      kind: 'condiment',
      img: 'assets/img/condimenti5.png',
      z: 30,
    },
    {
      id: 'cond-mais',
      name: 'Edamame',
      kind: 'condiment',
      img: 'assets/img/condimenti6.png',
      z: 30,
    },

    // SALSE (6) – leggere e semi-trasparenti + opzione "nessuna"
    {
      id: 'none-sauce',
      name: 'Nessuna salsa',
      kind: 'sauce',
      img: '',
      thumb: NONE_THUMB,
      z: 39,
      isNone: true,
    },
    {
      id: 'salsa-teriyaki',
      name: 'Salsa teriyaki',
      kind: 'sauce',
      img: 'assets/img/salsa6.png',
      z: 40,
    },
    {
      id: 'salsa-soia',
      name: 'Salsa di soia',
      kind: 'sauce',
      img: 'assets/img/salsa5.png',
      z: 40,
    },
    {
      id: 'salsa-olio',
      name: 'Olio',
      kind: 'sauce',
      img: 'assets/img/salsa4.png',
      z: 40,
    },
    {
      id: 'salsa-bbq',
      name: 'Salsa cocktail',
      kind: 'sauce',
      img: 'assets/img/salsa3.png',
      z: 40,
    },
    {
      id: 'salsa-agrod',
      name: 'Salsa agropiccante',
      kind: 'sauce',
      img: 'assets/img/salsa2.png',
      z: 40,
    },
    {
      id: 'salsa-maio',
      name: 'Maionese',
      kind: 'sauce',
      img: 'assets/img/salsa1.png',
      z: 40,
    },

    // TOPPING (2) + opzione "nessuno"
    {
      id: 'none-topping',
      name: 'Nessun topping',
      kind: 'topping',
      img: '',
      thumb: NONE_THUMB,
      z: 49,
      isNone: true,
    },
    {
      id: 'top-cipolla',
      name: 'Cipolla Croccante',
      kind: 'topping',
      img: 'assets/img/topping1.png',
      z: 50,
    },
    {
      id: 'top-sesamo',
      name: 'Sesamo',
      kind: 'topping',
      img: 'assets/img/topping2.png',
      z: 50,
    },
  ];

  // Stato selezione: una base, tutto il resto multi
  baseId = signal<string | null>(null);
  selected = signal<Set<string>>(new Set()); // contiene id di protein/condiment/sauce/topping
  proteinOrder = signal<string[]>([]); // ordine di selezione delle proteine
  errorMessage = signal<string | null>(null); // messaggio di errore temporaneo
  showSummary = signal<boolean>(false);
  saving = signal<boolean>(false);
  apiFeedback = signal<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  // Limiti per categoria
  private readonly MAX_LIMITS: Record<Kind, number> = {
    base: 1,
    protein: 4,
    condiment: 3,
    sauce: 2,
    topping: 1,
  };

  private readonly CATEGORY_ORDER: Kind[] = [
    'base',
    'protein',
    'condiment',
    'sauce',
    'topping',
  ];

  private readonly SUMMARY_GROUPS = [
    { kind: 'protein', label: 'Proteine' },
    { kind: 'condiment', label: 'Condimenti' },
    { kind: 'sauce', label: 'Salse' },
    { kind: 'topping', label: 'Topping' },
  ] as const;

  constructor(private pokeApiService: PokeApiService) {}

  // Collezioni utili
  byKind = (k: Kind) => this.ingredients.filter((i) => i.kind === k);

  trackByFn = (index: number, item: Ingredient) => item.id;

  isSelected(id: string) {
    return this.baseId() === id || this.selected().has(id);
  }

  // Conta gli ingredienti selezionati per una categoria specifica
  private countSelectedByKind(kind: Kind): number {
    if (kind === 'base') {
      return this.baseId() ? 1 : 0;
    }
    const selectedSet = this.selected();
    return Array.from(selectedSet).filter((id) => {
      const ingredient = this.ingredients.find((i) => i.id === id);
      return ingredient?.kind === kind && !ingredient?.isNone;
    }).length;
  }

  // Verifica se si può aggiungere un ingrediente di una categoria
  private canAdd(kind: Kind): boolean {
    const currentCount = this.countSelectedByKind(kind);
    const maxLimit = this.MAX_LIMITS[kind];
    return currentCount < maxLimit;
  }

  // Metodo pubblico per verificare se si può aggiungere più ingredienti (usato nel template)
  canAddMore(kind: Kind): boolean {
    return this.canAdd(kind);
  }

  // Metodo pubblico per ottenere il conteggio selezionato (usato nel template)
  getSelectedCount(kind: Kind): number {
    return this.countSelectedByKind(kind);
  }

  private hasSelection(kind: Kind): boolean {
    if (kind === 'base') {
      return this.baseId() !== null;
    }
    const selectedSet = this.selected();
    return Array.from(selectedSet).some((id) => {
      const ingredient = this.ingredients.find((i) => i.id === id);
      return ingredient?.kind === kind;
    });
  }

  isCategoryUnlocked(kind: Kind): boolean {
    const index = this.CATEGORY_ORDER.indexOf(kind);
    if (index <= 0) return true;

    for (let i = 0; i < index; i++) {
      const prevKind = this.CATEGORY_ORDER[i];
      if (!this.hasSelection(prevKind)) {
        return false;
      }
    }
    return true;
  }

  isCategoryLocked(kind: Kind): boolean {
    return !this.isCategoryUnlocked(kind);
  }

  getSummaryGroups() {
    return this.SUMMARY_GROUPS;
  }

  getBaseIngredient(): Ingredient | null {
    const base = this.ingredients.find((i) => i.id === this.baseId());
    return base && !base.isNone ? base : null;
  }

  getSelectedIngredients(kind: Exclude<Kind, 'base'>): Ingredient[] {
    const chosen = this.selected();
    return this.ingredients.filter(
      (i) => i.kind === kind && !i.isNone && chosen.has(i.id)
    );
  }

  hasNoneSelected(kind: Exclude<Kind, 'base'>): boolean {
    const chosen = this.selected();
    const noneOption = this.ingredients.find(
      (i) => i.kind === kind && i.isNone
    );
    return !!noneOption && chosen.has(noneOption.id);
  }

  getNoneLabel(kind: Exclude<Kind, 'base'>): string {
    const noneOption = this.ingredients.find(
      (i) => i.kind === kind && i.isNone
    );
    return noneOption?.name ?? 'Nessuno';
  }

  selectBase(id: string) {
    this.baseId.set(id);
  }

  toggle(id: string) {
    const ingredient = this.ingredients.find((i) => i.id === id);
    if (!ingredient) return;

    const kind = ingredient.kind;

    if (!this.isCategoryUnlocked(kind)) {
      return;
    }

    // Gestione base (sempre max 1)
    if (kind === 'base') {
      this.selectBase(id);
      this.errorMessage.set(null);
      return;
    }

    const set = new Set(this.selected());

    if (ingredient.isNone) {
      if (set.has(id)) {
        set.delete(id);
      } else {
        for (const selectedId of Array.from(set)) {
          const selectedIngredient = this.ingredients.find(
            (i) => i.id === selectedId
          );
          if (selectedIngredient?.kind === kind) {
            set.delete(selectedId);
          }
        }
        set.add(id);
      }

      if (kind === 'protein') {
        this.proteinOrder.set([]);
      }

      this.selected.set(set);
      this.errorMessage.set(null);
      return;
    }

    // Se l'ingrediente è già selezionato, rimuovilo
    if (set.has(id)) {
      set.delete(id);
      this.selected.set(set);

      if (kind === 'protein') {
        const order = this.proteinOrder().filter((pid) => pid !== id);
        this.proteinOrder.set(order);
      }

      this.errorMessage.set(null);
      return;
    }

    const currentCount = this.countSelectedByKind(kind);
    const maxLimit = this.MAX_LIMITS[kind];
    if (currentCount >= maxLimit) {
      const categoryNames: Record<Kind, string> = {
        base: 'basi',
        protein: 'proteine',
        condiment: 'condimenti',
        sauce: 'salse',
        topping: 'topping',
      };
      this.errorMessage.set(
        `Hai raggiunto il limite massimo di ${maxLimit} ${categoryNames[kind]}.`
      );
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    const noneOption = this.ingredients.find(
      (i) => i.kind === kind && i.isNone
    );
    if (noneOption) {
      set.delete(noneOption.id);
    }

    set.add(id);
    this.selected.set(set);

    if (kind === 'protein') {
      const order = [...this.proteinOrder(), id];
      this.proteinOrder.set(order);
    }

    this.errorMessage.set(null);
  }

  // Lista ordinata per il rendering a strati
  selectedForRender = computed<Ingredient[]>(() => {
    const chosen = new Set(this.selected());
    const proteinOrder = this.proteinOrder();
    const items: Ingredient[] = [];

    // Aggiungi la base per prima (z: 10)
    if (this.baseId()) {
      const base = this.ingredients.find((i) => i.id === this.baseId());
      if (base && !base.isNone) items.push(base);
    }

    // Aggiungi le proteine nell'ordine di selezione (z: 20+)
    // Mantieni l'ordine esatto di selezione
    for (const proteinId of proteinOrder) {
      const protein = this.ingredients.find((i) => i.id === proteinId);
      if (protein && chosen.has(proteinId) && !protein.isNone) {
        items.push(protein);
      }
    }

    // Aggiungi gli altri ingredienti (condimenti z: 30, salse z: 40, topping z: 50)
    for (const i of this.ingredients) {
      if (
        i.kind !== 'base' &&
        i.kind !== 'protein' &&
        chosen.has(i.id) &&
        !i.isNone
      ) {
        items.push(i);
      }
    }

    // Ordina per z crescente, ma le proteine sono già nell'ordine corretto
    // e hanno tutte lo stesso z (20), quindi l'ordine viene preservato
    return items.sort((a, b) => {
      // Se entrambi sono proteine, mantieni l'ordine di selezione
      if (a.kind === 'protein' && b.kind === 'protein') {
        const aPos = proteinOrder.indexOf(a.id);
        const bPos = proteinOrder.indexOf(b.id);
        if (aPos !== -1 && bPos !== -1) {
          return aPos - bPos;
        }
        return 0;
      }
      // Per gli altri ingredienti, ordina per z
      return a.z - b.z;
    });
  });

  // Ottiene la posizione della proteina (0-based index)
  getProteinPosition(proteinId: string): number {
    return this.proteinOrder().indexOf(proteinId);
  }

  // Ottiene lo z-index personalizzato per una proteina in base alla sua posizione
  getProteinZIndex(position: number): number {
    // Base ha z: 10, proteine hanno z: 20, quindi aggiungiamo la posizione per differenziarle
    return 20 + position;
  }

  // Verifica se un ingrediente è una proteina
  isProtein(ingredient: Ingredient): boolean {
    return ingredient.kind === 'protein';
  }

  resetAll() {
    this.baseId.set(null);
    this.selected.set(new Set());
    this.proteinOrder.set([]);
    this.showSummary.set(false);
    this.apiFeedback.set(null);
  }

  toggleSummary() {
    this.showSummary.update((value) => {
      const next = !value;
      return next;
    });
  }

  private savePokeToLocalStorage() {
    if (typeof window === 'undefined') return;

    const summary = this.buildPokeSummary();
    localStorage.setItem('poke-summary', JSON.stringify(summary));
    console.log('Poke salvata in localStorage:', summary);
  }

  private buildPokeSummary(): PokeSummary {
    const base = this.getBaseIngredient()?.name ?? null;
    const proteins = this.getSelectedIngredients('protein').map((i) => i.name);
    const condiments = this.getSelectedIngredients('condiment').map(
      (i) => i.name,
    );
    const sauces = this.getSelectedIngredients('sauce').map((i) => i.name);
    const toppings = this.getSelectedIngredients('topping').map((i) => i.name);

    const notes = this.SUMMARY_GROUPS.map((group) => {
      if (this.hasNoneSelected(group.kind)) {
        return `${group.label}: ${this.getNoneLabel(group.kind)}`;
      }
      return null;
    })
      .filter((item): item is string => !!item)
      .join(' | ');

    return {
      base,
      proteins,
      condiments,
      sauces,
      toppings,
      notes: notes || null,
    };
  }

  canSavePoke(): boolean {
    return !!this.getBaseIngredient();
  }

  private buildPokeTitle(summary: PokeSummary): string {
    const baseLabel = summary.base ?? 'Poke personalizzata';
    const proteinsLabel = summary.proteins.length
      ? summary.proteins.join(', ')
      : 'nessuna proteina';
    return `${baseLabel} con ${proteinsLabel}`;
  }

  async savePoke() {
    if (!this.canSavePoke()) {
      this.errorMessage.set('Seleziona almeno una base per salvare la tua poke.');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    if (this.saving()) {
      return;
    }

    const summary = this.buildPokeSummary();
    const payload: CreatePokeRequest = {
      userId: 1,
      title: this.buildPokeTitle(summary),
      completed: false,
      summary,
    };

    this.saving.set(true);
    this.apiFeedback.set(null);

    try {
      await this.pokeApiService.createPoke(payload);
      this.apiFeedback.set({
        type: 'success',
        text: 'La tua poke è stata inviata con successo! 🥗',
      });
      this.savePokeToLocalStorage();
    } catch (error) {
      console.error('Errore nel salvataggio della poke:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Errore sconosciuto durante il salvataggio della poke';
      this.apiFeedback.set({
        type: 'error',
        text: message,
      });
    } finally {
      this.saving.set(false);
    }
  }
}
