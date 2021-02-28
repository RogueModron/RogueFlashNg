import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardToReview } from 'src/app/model/dtos/card.to.review';
import { ReviewService } from './review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  private deckId = 0;

  card?: CardToReview;
  evaluated = false;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const deckIdParam = this.route.snapshot.paramMap.get('deckId') || '';
    this.deckId = Number.parseInt(deckIdParam);

    this.next();
  }

  evaluate(value: number): void {
    if (this.card && !this.evaluated) {
      this.reviewService.review(this.card, value, new Date());
    }

    this.evaluated = true;
  }

  next(): void {
    this.reviewService.read(this.deckId).subscribe(
      (card) => {
        this.card = card;
        this.evaluated = false;
      }
    );
  }

}
