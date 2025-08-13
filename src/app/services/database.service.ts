import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from '../models/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {


  //private userBaseUrl: string = "https://localhost:7294/api/User/"
  //private tableBaseUrl: string = "https://localhost:7294/api/Table/"

  private userBaseUrl: string = "https://tabelaterapeuticaapi.azurewebsites.net/api/User/"
  private tableBaseUrl: string = "https://tabelaterapeuticaapi.azurewebsites.net/api/Table/"
  constructor(private http: HttpClient) { }


  signUp(userObj: any) {
    return this.http.post<any>(`${this.userBaseUrl}register`, userObj);
  }

  login(loginObj: any) {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let res = this.http.post<any>(`${this.userBaseUrl}authenticate`, {
      email: loginObj.email,
      password: loginObj.password
    }, { headers: headers });
    return res;
  }


  saveTable(tableObj: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let res = this.http.post<any>(`${this.tableBaseUrl}saveTable`, {
      idMedico: tableObj.idMedico,
      idTabela: tableObj.idTabela,
      tableElements: tableObj.tableElements,
    }, { headers: headers });
    console.log(res)
    return res;
  }

  editTable(tableObj: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let res = this.http.put<any>(`${this.tableBaseUrl}editTable`, {
      idMedico: tableObj.idMedico,
      idTabela: tableObj.idTabela,
      tableElements: tableObj.tableElements,
    }, { headers: headers });
    console.log(res)
    return res;
  }

  getTables(): Observable<Table[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let res = this.http.get<Table[]>(`${this.tableBaseUrl}allTables`
      , { headers: headers });
    return res;
  }


  getUserByNOrdem() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const nOrdemMedicos = Number.parseInt(this.getNOrdem());
    const url = `${this.userBaseUrl}nOrdemMedicos?nOrdemMedicos=${nOrdemMedicos}`;

    return this.http.get<any>(url, { headers: headers });
  }

  getUserByEmail() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const userEmail = this.getEmail().toString();
    console.log(userEmail);
    const url = `${this.userBaseUrl}userEmail?userEmail=${userEmail}`;
    return this.http.get<any>(url, { headers: headers });
  }
   

  resetPassword(forgotPasswordObject: any){
    console.log(forgotPasswordObject);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let res = this.http.post<any>(`${this.userBaseUrl}resetPassword`, {
      forgotPasswordEmail: forgotPasswordObject.email,
    }, { headers: headers });
    return res;

  }


  createNewPassword(loginObj: any) {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(loginObj);
    let res = this.http.post<any>(`${this.userBaseUrl}newPassword`, {
      password: loginObj.password,
      token: loginObj.token
    }, { headers: headers });
    return res;
  }

  storeNOrdem(nOrdem: string) {
    localStorage.setItem('nOrdem', nOrdem);
  }

  storeEmail( email: string){
    localStorage.setItem('userEmail', email);
  }

  getEmail(): string {
    const email = localStorage.getItem('userEmail');
    return email ? email : '';
  }

  getNOrdem(): string {
    const nOrdem = localStorage.getItem('nOrdem');
    return nOrdem ? nOrdem.toString() : '';
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  logout() {
    localStorage.removeItem('nOrdem');
    localStorage.removeItem('token');
  }


}
