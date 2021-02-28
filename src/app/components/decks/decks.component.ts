import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { DecksService } from './decks.service';
import { DecksView } from './decks.view';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.css']
})
export class DecksComponent implements OnInit {

  decks$: Observable<DecksView[]> | null = null;

  constructor(
    private decksService: DecksService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.search(''));
  }

  create(): void {
    this.decksService.create().subscribe(
      (deckId) => this.router.navigate([deckId], { relativeTo: this.route })
    );
  }

  search(searchKey: string): void {
    this.decks$ = this.decksService.search(searchKey).pipe(
      toArray()
    );
  }

}
