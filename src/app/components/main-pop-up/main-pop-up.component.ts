import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-main-pop-up',
    templateUrl: './main-pop-up.component.html',
    styleUrls: ['./main-pop-up.component.css'],
    standalone: false
})
export class MainPopUpComponent {

  constructor(
    public dialogRef: MatDialogRef<MainPopUpComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
