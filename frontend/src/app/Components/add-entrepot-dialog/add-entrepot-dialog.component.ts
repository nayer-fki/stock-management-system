import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Entrepot } from '../../Models/entrepot.model';

@Component({
  selector: 'app-add-entrepot-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './add-entrepot-dialog.component.html',
  styleUrls: ['./add-entrepot-dialog.component.css']
})
export class AddEntrepotDialogComponent {
  entrepot: Entrepot = { nom: '', adresse: '', capacite: 0 };

  constructor(
    public dialogRef: MatDialogRef<AddEntrepotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.entrepot) {
      this.entrepot = { ...data.entrepot };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.entrepot);
  }
}
