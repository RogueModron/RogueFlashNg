import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReviewComponent } from '../../components/review/review.component';
import { SharedModule } from '../shared/shared.module';
import { ReviewRoutingModule } from './review-routing.module';

@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    SharedModule
  ]
})
export class ReviewModule { }
