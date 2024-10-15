import {Component, Inject, inject} from '@angular/core';
import {
	MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

@Component({
	selector: 'Alerta',
	templateUrl: 'Alerta.html',
	styles: `
	  :host {
		display: flex;
	  }
  
	  .example-pizza-party {
		color: hotpink;
	  }
	`,
	standalone: true,
	imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  })
  export class Alerta {
	snackBarRef = inject(MatSnackBarRef);
	constructor(@Inject(MAT_SNACK_BAR_DATA) public Mensaje: string) { }
  }