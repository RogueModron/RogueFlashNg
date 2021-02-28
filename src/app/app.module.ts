import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { CardsComponent } from './components/cards/cards.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { DeckComponent } from './components/deck/deck.component';
import { DecksComponent } from './components/decks/decks.component';
import { SearchComponent } from './components/search/search.component';
import { SharedModule } from './modules/shared/shared.module';
import { NavigatorComponent } from './navigator/navigator.component';

@NgModule({
  declarations: [
    AppComponent,
    DecksComponent,
    DeckComponent,
    CardsComponent,
    CardComponent,
    NavigatorComponent,
    SearchComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
