import { Injectable } from '@angular/core';
import { Note } from '../../interfaces/note.type';
import { notesList } from '../../constants/notes.constants';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  public notes: Note[] = notesList

  constructor() { }

  public getNotes() {
    return this.notes;
  }

  public getNote(id: string) {
    return this.notes.find(note => note.id === id);
  }

  public save(note: Note) {
    this.notes.push(note);
  }

  public update(note: Note) {
    const index = this.notes.findIndex(item => item.id === note.id);
    this.notes[index] = note;
  }
}
