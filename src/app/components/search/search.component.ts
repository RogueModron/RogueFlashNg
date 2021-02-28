import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  private searchSubscriber = new Subject<string>();
  private searchSubscription: Subscription | null = null;

  @Input()
  proposedSearchKey = '';

  @Output()
  searchRequest = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubscriber.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(
      (searchKey) => this.searchRequest.emit(searchKey)
    );
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  search(searchKey: string): void {
    this.searchSubscriber.next(searchKey);
  }
}
