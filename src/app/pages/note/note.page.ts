import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NoteService } from 'src/app/core/api/note/note.service';
import { Note } from 'src/app/core/interfaces/note.type';
import { CameraService } from 'src/app/core/services/camera/camera.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage {
  @Input() note?: Note;

  public noteForm: FormGroup;
  public isLoading = true;
  public notes = this.noteService.getNotes();

  constructor(
    private readonly navController: NavController,
    private readonly route: ActivatedRoute,
    private readonly noteService: NoteService,
    private readonly formBuilder: FormBuilder,
    private readonly cameraService: CameraService,
  ) {
    this.noteForm = this.formBuilder.group({
      title: [''],
      text: [''],
      image: [''],
      id: [''],
    });
  }

  public async ionViewDidEnter(): Promise<void> {
    this.isLoading = true;

    const noteId = this.route.snapshot.paramMap.get('id');

    if (noteId) {
      this.note = this.noteService.getNote(noteId);
      this.populateForm();
    }

    this.isLoading = false;
  }

  public populateForm(): void {
    if (this.note) {
      this.noteForm.patchValue({
        title: this.note.title,
        text: this.note.text,
        images: this.note.image,
      });
    }
  }

  public save(): void {
    if (!this.note) {
      const note: Note = {
        title: this.noteForm.get('title')?.value,
        text: this.noteForm.get('text')?.value,
        id: this.notes.length.toString() + 1,
        image: this.noteForm.get('image')?.value,
      };

      if (!note.image) {
        delete note.image;
      }

      this.noteService.save(note);
      this.navController.back();
    }
  }

  public update (): void {
    if (this.note) {
      this.note.title = this.noteForm.get('title')?.value;
      this.note.text = this.noteForm.get('text')?.value;
      this.note.image = this.noteForm.get('image')?.value;

      this.noteService.update(this.note);
      this.navController.back();
    }
  }

  public async takePicture(): Promise<void> {
    const image = await this.cameraService.takePicture();

    if (image) {
      this.noteForm.patchValue({
        image: image.webPath,
      });
    }
  }

  public close(): void {
    this.navController.back();
  }
}
