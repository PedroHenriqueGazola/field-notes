import { Component, OnInit } from '@angular/core';
import { notesList } from 'src/app/core/constants/notes.constants';
import { Note } from 'src/app/core/interfaces/note.type';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage {

  public notes: Note[] = notesList

  constructor() { }
}
