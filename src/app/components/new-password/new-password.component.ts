import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from "@angular/forms"
import { ActivatedRoute, Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { DataBaseService } from 'src/app/services/database.service';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent {

  public newPasswordForm!: FormGroup;
  public type: string = "password";
  public isText: boolean = false;
  public eyeIcon: string = "fa-eye-slash";
  public resetPasswordtoken: string | null = null; // Add a property to store the token

  public constructor(
    private formBuilder: FormBuilder,
    private db: DataBaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute 
  ) {

  }


  ngOnInit(): void {
    this.newPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetPasswordtoken = params['token']; // Assume your token parameter is named 'token'
      if (!this.resetPasswordtoken) {
        alert("You don't have permission to access this page.");
        this.router.navigate(['login']);
      }
    });
  }

  passwordsMatch(): boolean {
    const password = this.newPasswordForm.get('password')?.value;
    const confirmPassword = this.newPasswordForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }


  public hideShowPass() {
    this.isText = !this.isText;
    if (this.isText) {
      this.eyeIcon = "fa-eye";
      this.type = "text";
    } else {
      this.eyeIcon = "fa-eye-slash";
      this.type = "password";
    }
  }


  public newPassword() {
    if (this.newPasswordForm.valid && this.passwordsMatch()) {
      //send object to database
      const newPasswordFormWithToken = { ...this.newPasswordForm.value, token: this.resetPasswordtoken}
      console.log(newPasswordFormWithToken);
      this.db.createNewPassword(newPasswordFormWithToken).subscribe({
        next: (res) => {
          this.newPasswordForm.reset();
          this.router.navigate(['login']);
          alert("A sua password foi alterada com sucesso.")
        },
        error: (err) => {
          alert(err.error.message);
        }
      })
    } else {
      ValidateForm.validateAllFormFields(this.newPasswordForm);
      alert("As palavras-passes não coincidem");
      this.newPasswordForm.reset();
    }
  }
}
