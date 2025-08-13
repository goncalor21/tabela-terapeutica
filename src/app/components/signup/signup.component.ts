import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup,FormBuilder, Validators,AbstractControl  } from "@angular/forms"
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { DataBaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  public signupForm !: FormGroup;
  public isButtonBlocked: boolean = false;
  public type : string = "password";
  public isText : boolean = false;
  public eyeIcon : string = "fa-eye-slash";


  constructor(private formBuilder: FormBuilder, private http : HttpClient, private router : Router, private db : DataBaseService){}


  ngOnInit(): void{
    this.signupForm = this.formBuilder.group({
      userName:['', Validators.required],
      email:['',Validators.required],
      dataNascimento:['',Validators.required],
      nOrdemMedicos:['',Validators.required],
      profissao:['',Validators.required],
      password:['',Validators.required],
    })
  }

  // singleSpaceValidator(control: any): { [key: string]: any } | null {
  //   const value = control.value;
  //   if (value && value.trim().split(' ').length > 2) {
  //     return { singleSpace: true };
  //   }
  //   return null;
  // }

  public onSignUp(){
    if(this.signupForm.valid){
      this.isButtonBlocked = true;
          setTimeout(() => {
            this.isButtonBlocked = false;
          }, 20000);
      //send object to database
      this.db.signUp(this.signupForm.value).subscribe({
        next:(res=>{
          alert("Obrigado por se registrar na Tabela Terapêutica!" + "\n" + "Foi enviado um link de confirmação para o seu e-mail");
          this.signupForm.reset();
          this.router.navigate(['login']);
        }),
        error:(err=>{
          this.isButtonBlocked = false;
          alert(err.error.message);
        })
      })

    }else{
      ValidateForm.validateAllFormFields(this.signupForm);
      alert("O seu registo está inválido.");
    }
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


}
