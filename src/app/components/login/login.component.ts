import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms"
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { DataBaseService } from 'src/app/services/database.service';
import { NgToastService} from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {



  public loginForm!: FormGroup;
  public newPasswordForm!: FormGroup;
  public type : string = "password";
  public isText : boolean = false;
  public eyeIcon : string = "fa-eye-slash";
  public forgotPasswordEmail: string = '';
  public isLoading: boolean = false;


  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private db: DataBaseService,
    private toast : NgToastService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.newPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    })
  }

  public hideShowPass(){
    this.isText = !this.isText;
    if(this.isText){
      this.eyeIcon = "fa-eye";
      this.type = "text";
    }else{
       this.eyeIcon = "fa-eye-slash";
       this.type = "password";
    }
  }

  public onLogin() {
    if (this.loginForm.valid) {
      //send object to database
      this.db.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.toast.success({detail:"SUCCESS", summary:res.message, duration:5000});
          this.db.storeEmail(res.email);
          this.db.storeToken(res.token);
          this.router.navigate(['mainPage']);
        },
        error: (err) => {
          alert(err.error.message);
          this.toast.error({detail:"ERROR", summary:"Something went wrong!", duration: 5000});
        }
      })
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Your form is invalid");
    }
  }


  public forgotPassword(){
    this.isLoading = true;
    if(this.newPasswordForm.valid){
      const resetPassword = { ...this.newPasswordForm.value};
      this.db.resetPassword(resetPassword).subscribe({
        next: (res) => {
          this.newPasswordForm.reset();
          //adicionar card de espera
          alert("Recebeu um e-mail com um link para alterar a sua password.");
          this.isLoading = false;
        },
        error:(err) => {
          alert(err.error.message);
          this.isLoading = false;
        }
      })
    }else {
      ValidateForm.validateAllFormFields(this.newPasswordForm);
      alert("Your form is invalid");
    }
  }



}
