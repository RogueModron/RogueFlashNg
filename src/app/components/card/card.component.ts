import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'src/app/model/entities/card';
import { ConfirmComponent } from '../confirm/confirm.component';
import { CardService } from './card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  private card?: Card;

  deckId = 0;

  cardForm = this.fb.group({
    sideA: [],
    sideB: [],
    notes: [],
    tags: [],
    noBA: [false]
  }, { updateOn: 'blur' });

  constructor(
    private cardService: CardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const deckIdParam = this.route.snapshot.paramMap.get('deckId') || '';
    this.deckId = Number.parseInt(deckIdParam);

    this.route.data.subscribe((data) => {
        this.card = data.card as Card;
        this.cardForm.patchValue(this.card);
      },
      (error) => console.log(error)
    );

    this.cardForm.valueChanges.subscribe(
      () => {
        if (this.card) {
          Object.assign(this.card, this.cardForm.value);
          this.cardService.update(this.card);
        }
      }
    );
  }

  private delete(): void {
    if (this.card) {
      this.cardService.delete(this.card.cardId);
      this.router.navigate(this.router.url.split('/').slice(0, -1));
    }
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        message: 'Delete card?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete();
      }
    });
  }
}
