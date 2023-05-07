import { Component, Input } from '@angular/core';
import { Note } from 'src/app/core/interfaces/note.type';

@Component({
  selector: 'app-notes-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
})
export class NotesCardComponent {

  @Input() note?: Note;

  constructor() { }

}
