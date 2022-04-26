import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  loading: boolean = false;

  search: FormControl = new FormControl('');

  subscriptions: Subscription[] = [];

  constructor(private pokemonService: PokemonService) { }

  onSearchPokemon(): void {
    const value = this.search.value;
    console.log(this.search.value)
  }


  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  loadMore(): void {
    this.loading = true;
    this.subscription = this.pokemonService.getNext().subscribe(response => {
      this.pokemonService.next = response.next;
      const details = response.results.map((i: any) => this.pokemonService.get(i.name));
      this.subscription = concat(...details).subscribe((response: any) => {
        this.pokemonService.pokemons.push(response);
      });
    }, error => console.log('Error Occurred:', error), () => this.loading = false);
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

}
