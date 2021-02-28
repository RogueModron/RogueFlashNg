import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { CardsService } from './cards.service';
import { CardsView } from './cards.view';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  deckId = 0;

  cards$: Observable<CardsView[]> | null = null;

  constructor(
    private cardsService: CardsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const deckIdParam = this.route.snapshot.paramMap.get('deckId') || '';
    this.deckId = Number.parseInt(deckIdParam);

    setTimeout(() => this.search(''));
  }

  create(): void {
    this.cardsService.create(this.deckId).subscribe(
      (cardId) => this.router.navigate([cardId], { relativeTo: this.route })
    );
  }

  search(searchKey: string): void {
    this.cards$ = this.cardsService.search(this.deckId, searchKey).pipe(
      toArray()
    );
  }

}
