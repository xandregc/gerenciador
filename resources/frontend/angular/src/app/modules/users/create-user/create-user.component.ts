import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { FormValidatorService } from 'src/app/services/form-validator/form-validator.service';
import { UserService } from 'src/app/services/user/user.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  messageTimer: MatSnackBarConfig = new MatSnackBarConfig();
  passwordHide = true;
  userForm: FormGroup;
  hideRequiredControl = new FormControl(false);

  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  myfilename = 'Select File';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formValidatorService: FormValidatorService,
    private _snackBar: MatSnackBar
  ) {
    this.messageTimer.duration = 5000;
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email], this.formValidatorService.checkEmailTaken()],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      is_admin: [false, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  createUser() {
    this.userService.create(this.userForm.value)
      .subscribe(res => {
        this._snackBar.open('Usuário criado com sucesso.', '', this.messageTimer);
        this.router.navigate(['/users']);
      },
      error => {
        this._snackBar.open('Não foi possível criar o usuário.', '', this.messageTimer);
      });
  }

  display: FormControl = new FormControl("", Validators.required);
  file_store: FileList;
  file_list: Array<string> = [];

  handleFileInputChange(l: FileList): void {
    this.file_store = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.display.patchValue(`${f.name}${count}`);
    } else {
      this.display.patchValue("");
    }
  }

  handleSubmit(): void {
    var fd = new FormData();
    this.file_list = [];
    for (let i = 0; i < this.file_store.length; i++) {
      fd.append("files", this.file_store[i], this.file_store[i].name);
      this.file_list.push(this.file_store[i].name);
    }

    // do submit ajax
  }
}
