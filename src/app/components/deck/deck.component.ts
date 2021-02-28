import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Deck } from 'src/app/model/entities/deck';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DeckService } from './deck.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent implements OnInit {

  // *** See a different approach in CardComponent. ***

  private deck?: Deck;

  deckId = 0;

  deckForm = new FormGroup({
    description: new FormControl(),
    notes: new FormControl()
  }, { updateOn: 'blur' });

  constructor(
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const deckIdParam = this.route.snapshot.paramMap.get('deckId') || '';
    this.deckId = Number.parseInt(deckIdParam);

    this.deckService.read(this.deckId).subscribe(
      (deck) => {
        if (deck) {
          this.deck = deck;
          this.deckForm.patchValue(this.deck);
        } else {
          // TODO: Log.
          this.router.navigate(['']);
        }
      }
    );

    this.deckForm.valueChanges.subscribe(
      () => {
        if (this.deck) {
          Object.assign(this.deck, this.deckForm.value);
          this.deckService.update(this.deck);
        }
      }
    );
  }

  private delete(): void {
    this.deckService.delete(this.deckId);
    this.router.navigate(this.router.url.split('/').slice(0, -1));
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        message: 'Delete deck?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete();
      }
    });
  }
}
