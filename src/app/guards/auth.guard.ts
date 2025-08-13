import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { DataBaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private db : DataBaseService){

  }

  canActivate(): boolean {
    if(this.db.isLoggedIn()){
      return true;
    }else{
      return false;
    }
  }
  
}
