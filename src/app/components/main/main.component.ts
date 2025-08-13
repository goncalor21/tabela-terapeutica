import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar'
import { DataBaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Table } from 'src/app/models/table';
import { TableElement } from 'src/app/models/tableElement';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { MatDialog } from '@angular/material/dialog';
import { MainPopUpComponent } from '../main-pop-up/main-pop-up.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})



export class MainComponent {

  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  searchText: string = '';
  searchResults: string[] = [];
  constructor(private db: DataBaseService, private router: Router, private eventEmitter: EventEmitterService, private dialogRef: MatDialog,
    private location: Location, private renderer: Renderer2) { }

  isPrinting: boolean = false;
  isEditMode: boolean = false;
  public textareaValue: string = '';
  dataSourceAfterSearchLength: number = 0;
  public searchValue: string = '';
  public tableId: string = '';
  public date: string = '';
  public medicName: string = '';

  @ViewChild('elRef') elRef!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  displayedColumns: string[] = ['comprimido', 'jejum', 'peqAlmoco', 'almoco', 'lanche', 'jantar', 'deitar', 'notas'];
  dataSource: TableElement[] = [];
  fetchedTables: Table[] = [];
  originalDataSource!: TableElement[];
  isLoggedIn: boolean = false;

  toggleDropdown() {
    var dropDownMenu = document.querySelector('.dropdown_menu');
    dropDownMenu?.classList.toggle('open');

    var body = document.querySelector('pre_visualizacao');

  }

  reloadPage() {
    window.location.reload();
  }

  openDialog() {
    this.dialogRef.open(MainPopUpComponent);
  }

  closeDialog() {
    this.dialogRef.closeAll();
  }

  ngOnInit(): void {
    this.db.getTables().subscribe((tables) => {
      if (tables.length > 0) {
        this.fetchedTables = tables;
        this.isLoggedIn = this.db.isLoggedIn();
        if (this.eventEmitter.getIdTable().length != 0) {
          this.showTable(this.eventEmitter.getIdTable());
        }
      }
    });

  }



  public onSearch(): void {
    this.db.getTables().subscribe((tables) => {
      if (tables.length > 0) {
        this.fetchedTables = tables;
        tables.forEach(element => {
          if (element.idTabela.includes(this.searchText)) {
            this.searchResults.push(element.idTabela);
          }
        });
      }
    });
    this.searchResults = [];
  }

  public logout(): void {
    console.log("logout")
    this.db.logout();
  }


  public showTable(idTabela: string): void {
    this.searchResults = [];
    this.dataSource = [];
    this.table.renderRows();

    this.fetchedTables.forEach(element => {
      if (element.idTabela.match(idTabela)) {
        this.tableId = element.idTabela;
        this.originalDataSource = element.tableElements
        this.showAreaTextAfterSearch(element);
        element.tableElements.forEach(tableElement => {
          const renderItem: TableElement = {
            comprimido: "",
            jejum: "",
            peqAlmoco: "",
            almoco: "",
            lanche: "",
            jantar: "",
            deitar: ""
          };
          renderItem.comprimido = tableElement.comprimido;
          renderItem.jejum = tableElement.jejum;
          renderItem.peqAlmoco = tableElement.peqAlmoco;
          renderItem.almoco = tableElement.almoco;
          renderItem.lanche = tableElement.lanche;
          renderItem.jantar = tableElement.jantar;
          renderItem.deitar = tableElement.deitar;
          this.dataSource.push(renderItem);
        });
        if (this.eventEmitter.getIdTable().length != 0) {
          this.showAreaTextAfterSearch(element);

        }
      }
    });
    this.db.getUserByEmail().subscribe((userData => {
      this.medicName = userData.username;
    }));
    var currentDate = this.getCurrentDate();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    this.date = day + '/' + month + '/' + year;

    this.dataSourceAfterSearchLength = this.dataSource.length;
    this.trigger.closePanel();
    this.searchResults = [];
    var tableSection = document.getElementById('pre_visualizacao');
    tableSection?.scrollIntoView({ behavior: 'smooth' });
    this.table.renderRows();

  }



  private tableLengthCheck(tableElement: TableElement): number {
    var check = 0;
    if (tableElement != null) {
      if (tableElement.jejum.length != 0) {
        check++;
      }
      if (tableElement.peqAlmoco.length != 0) {
        check++;
      }
      if (tableElement.almoco.length != 0) {
        check++;
      }
      if (tableElement.lanche.length != 0) {
        check++;
      }
      if (tableElement.jantar.length != 0) {
        check++;
      }
      if (tableElement.deitar.length != 0) {
        check++;
      }
    }
    return check;
  }

  private showAreaTextAfterSearch(element: Table): void {
    this.textareaValue = '';
    var textTransformed: string = "";
    var cont = 0;
    var withoutComma: string = "";

    element.tableElements.forEach(tableElement => {
      textTransformed = "";
      cont = 0;
      if (tableElement == null) {
        alert("Existe algo de errado com a tabela.");
      }
      textTransformed += tableElement.comprimido;
      if (this.tableLengthCheck(tableElement) > 1) {
        console.log(this.tableLengthCheck(tableElement))
        console.log(cont)
        if (tableElement.jejum.length > 0) {
          cont++
          textTransformed += " " + tableElement.jejum + " em Jejum + ";
        }
        if (tableElement.peqAlmoco.length > 0) {
          cont++;
          if (this.tableLengthCheck(tableElement) == cont) {
            textTransformed += " " + tableElement.peqAlmoco + " ao Pequeno-Almoço,";
          } else {
            textTransformed += " " + tableElement.peqAlmoco + " ao Pequeno-Almoço +";
          }
        }
        if (tableElement.almoco.length > 0) {
          cont++;
          if (this.tableLengthCheck(tableElement) == cont) {
            textTransformed += " " + tableElement.almoco + " ao Almoço, ";
          } else {
            textTransformed += " " + tableElement.almoco + " ao Almoço + ";
          }
        }
        if (tableElement.lanche.length > 0) {
          cont++;
          if (this.tableLengthCheck(tableElement) == cont) {
            textTransformed += " " + tableElement.lanche + " ao Lanche, ";
          } else {
            textTransformed += " " + tableElement.lanche + " ao Lanche + ";
          }
        }
        if (tableElement.jantar.length > 0) {
          cont++;
          if (this.tableLengthCheck(tableElement) == cont) {
            textTransformed += " " + tableElement.jantar + " ao Jantar, ";
          } else {
            textTransformed += " " + tableElement.jantar + " ao Jantar + ";
          }
        }
        if (tableElement.deitar.length > 0) {
          cont++;
          if (this.tableLengthCheck(tableElement) == cont) {
            textTransformed += " " + tableElement.deitar + " ao Deitar, ";
          } else {
            textTransformed += " " + tableElement.peqAlmoco + " ao Deitar + ";
          }
        }

        this.textareaValue += textTransformed;
      } else if (this.tableLengthCheck(tableElement) <= 1) {
        if (tableElement.jejum.length > 0) {
          textTransformed += " " + tableElement.jejum + " em Jejum, ";
        }
        if (tableElement.peqAlmoco.length > 0) {
          textTransformed += " " + tableElement.peqAlmoco + " ao Pequeno-Almoço,";
        }
        if (tableElement.almoco.length > 0) {
          textTransformed += " " + tableElement.almoco + " ao Almoço, ";
        }
        if (tableElement.lanche.length > 0) {
          textTransformed += " " + tableElement.lanche + " ao Lanche, ";
        }
        if (tableElement.jantar.length > 0) {
          textTransformed += " " + tableElement.jantar + " ao Jantar, ";
        }
        if (tableElement.deitar.length > 0) {
          textTransformed += " " + tableElement.deitar + " ao Deitar, ";
        }
        this.textareaValue += textTransformed;
      }
    });
    withoutComma = this.textareaValue.slice(0, -2);
    this.textareaValue = withoutComma;
  }


  onRowClick() {
    // Set the selected row to edit mode
    this.isEditMode = true;
  }

  onCellBlur() {
    // Exit edit mode when the input loses focus
    this.isEditMode = false;
  }

  private isDataSourceChanged(): boolean {
    for (let i = 0; i < this.originalDataSource.length; i++) {
      if (this.originalDataSource[i].jejum != this.dataSource[i].jejum) {
        return true;
      }
      if (this.originalDataSource[i].peqAlmoco != this.dataSource[i].peqAlmoco) {

        return true;
      }
      if (this.originalDataSource[i].almoco != this.dataSource[i].almoco) {

        return true;
      }
      if (this.originalDataSource[i].lanche != this.dataSource[i].lanche) {

        return true;
      }
      if (this.originalDataSource[i].jantar != this.dataSource[i].jantar) {

        return true;
      }

      if (this.originalDataSource[i].deitar != this.dataSource[i].deitar) {

        return true;
      }
    }
    return false;
  }

  private saveTableAfterEdit() {
    const savingElement: Table = {
      idMedico: this.db.getNOrdem.toString(),
      idTabela: "",
      tableElements: this.dataSource
    };
    //Saving when edited in the text box
    if (this.db.isLoggedIn()) {
      if (this.isDataSourceChanged() || this.dataSource.length > this.dataSourceAfterSearchLength) {
        this.db.editTable(savingElement).subscribe({
          next: (res) => {
            this.dataSourceAfterSearchLength = this.dataSource.length;
            this.router.navigate(['mainPage']);
          },
          error: (err) => {
            alert(err?.error.message)
          }
        });
      }
    }
  }


  public printTable() {
    this.isEditMode = false;
    setTimeout(() => {
      window.print();
    }, 1000);
  }


  public saveTable() {
    this.isEditMode = false;
    if (this.db.isLoggedIn()) {
      if (this.searchText.length != 0) {
        this.saveTableAfterEdit();
        return;
      }
      if (this.dataSource.length != 0) {

        const savingElement: Table = {
          idMedico: this.db.getNOrdem(),
          idTabela: "",
          tableElements: this.dataSource
        };


        this.db.saveTable(savingElement).subscribe({
          next: (res) => {
            alert(res.message)
            this.router.navigate(['mainPage']);
          },
          error: (err) => {
            alert(err?.error.message)
          }
        });
      } else {
        alert("Existe algo de errado com a tabela!")
      }
    } else {
      alert("Por favor registe-se");
    }
  }




  handleSubmit() {

    this.dataSource = [];
    this.table.renderRows();
    let data = this.textareaValue.valueOf();
    let comprimido: string[] = [];
    var comprimidoSlice: string[] = [];
    var porcao: string[] = [];
    var porcaoSlice: string[] = [];
    var cont: number = 0;
    var lineElement: string[];

    data = data.replace(/(\d+),(\d+)/g, '$1.$2');  // troca as virgulas entre numeros por pontos
    if (data.includes('\n')) {
      var texto = data.replace(/ e /g, " + ");
      texto.replace(/;/g, ',');
      var arrayTexto = texto.split("\n");
      arrayTexto.forEach(element => {
        if (element.includes(',')) {
          lineElement = element.split(',');
          arrayTexto.splice(arrayTexto.indexOf(element), 1);
          lineElement.forEach(element => {
            arrayTexto.push(element);
          });
        }
      });
    } else {
      var texto = data.replace(/ e /g, " + ");
      texto = data.replace(/;/g, ',');
      var arrayTexto = texto.split(",");
    }




    arrayTexto = arrayTexto.filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") }); // Limpa os espaços vazios no array
    arrayTexto = arrayTexto.map(function (el) { return el.trim(); });// Remove os espaços iniciais em cada string
    const hasNumbers = /\d/;
    const medicPattern1 = /rosuvastatina \d+mg \+ ezetimibe \d+mg/i;
    const medicPattern2 = /atorvastatina \d+mg \+ ezetimibe \d+mg/i;
    const medicPattern3 = /perindopril \d+mg \+ amlodipina \d+mg/i;
    const medicPattern4 = /insulina/i;
    const checkLastQuantity = /\d+mg/i;
    for (var i = 0; i < arrayTexto.length; i++) {

      arrayTexto[i] = arrayTexto[i].replace(/(\d)\s+/g, '$1');  // remove espaços a seguir a numeros, 5 mg -> 5mg

      if (medicPattern1.test(arrayTexto[i])) {
        var arrayTexto2 = arrayTexto[i].split(" ");
        let match;
        let endIndex = 0;


        for (var k = 0; k < arrayTexto2.length; k++) {
          match = checkLastQuantity.exec(arrayTexto2[k]);
          if(match != null){
            console.log("ola");
            const startIndex = match.index; // Start index of the match
            const matchLength = match[0].length; // Length of the matched string
            endIndex = startIndex + matchLength; // End index of the match      
            console.log(endIndex.valueOf());
          } 
        }

        comprimidoSlice = arrayTexto2.slice(0, endIndex + 2);
        console.log(comprimidoSlice);
        comprimido[i] = comprimidoSlice.join(" ");
        console.log(comprimido[i]);
        porcaoSlice = arrayTexto2.slice(endIndex + 2);
        console.log(porcaoSlice);
        porcao[i] = porcaoSlice.join(" ");
        console.log(porcao[i]);

        comprimido[i] = comprimido[i].replace(/-/g, '');    // Retira os caracteres especiais que possam existir no inicio da string
        comprimido[i] = comprimido[i].replace(/#/g, '');
        comprimido[i] = comprimido[i].replace(/&/g, '');
        comprimido[i] = comprimido[i].trimStart();
        comprimido[i] = comprimido[i].charAt(0).toUpperCase() + comprimido[i].slice(1); // Faz com que a primeira letra da string seja sempre maiuscula


      }
      else if (medicPattern2.test(arrayTexto[i])) {

        var arrayTexto2 = arrayTexto[i].split(" ");
        let match;
        let endIndex = 0;


        for (var k = 0; k < arrayTexto2.length; k++) {
          match = checkLastQuantity.exec(arrayTexto2[k]);
          if(match != null){
            console.log("ola");
            const startIndex = match.index; // Start index of the match
            const matchLength = match[0].length; // Length of the matched string
            endIndex = startIndex + matchLength; // End index of the match      
            console.log(endIndex.valueOf());
          } 
        }

        comprimidoSlice = arrayTexto2.slice(0, endIndex + 2);
        console.log(comprimidoSlice);
        comprimido[i] = comprimidoSlice.join(" ");
        console.log(comprimido[i]);
        porcaoSlice = arrayTexto2.slice(endIndex + 2);
        console.log(porcaoSlice);
        porcao[i] = porcaoSlice.join(" ");
        console.log(porcao[i]);

        comprimido[i] = comprimido[i].replace(/-/g, '');    // Retira os caracteres especiais que possam existir no inicio da string
        comprimido[i] = comprimido[i].replace(/#/g, '');
        comprimido[i] = comprimido[i].replace(/&/g, '');
        comprimido[i] = comprimido[i].trimStart();
        comprimido[i] = comprimido[i].charAt(0).toUpperCase() + comprimido[i].slice(1); // Faz com que a primeira letra da string seja sempre maiuscula

        
      }
      else if (medicPattern3.test(arrayTexto[i])) {

        var arrayTexto2 = arrayTexto[i].split(" ");
        let match;
        let endIndex = 0;


        for (var k = 0; k < arrayTexto2.length; k++) {
          match = checkLastQuantity.exec(arrayTexto2[k]);
          if(match != null){
            console.log("ola");
            const startIndex = match.index; // Start index of the match
            const matchLength = match[0].length; // Length of the matched string
            endIndex = startIndex + matchLength; // End index of the match      
            console.log(endIndex.valueOf());
          } 
        }

        comprimidoSlice = arrayTexto2.slice(0, endIndex + 2);
        console.log(comprimidoSlice);
        comprimido[i] = comprimidoSlice.join(" ");
        console.log(comprimido[i]);
        porcaoSlice = arrayTexto2.slice(endIndex + 2);
        console.log(porcaoSlice);
        porcao[i] = porcaoSlice.join(" ");
        console.log(porcao[i]);

        comprimido[i] = comprimido[i].replace(/-/g, '');    // Retira os caracteres especiais que possam existir no inicio da string
        comprimido[i] = comprimido[i].replace(/#/g, '');
        comprimido[i] = comprimido[i].replace(/&/g, '');
        comprimido[i] = comprimido[i].trimStart();
        comprimido[i] = comprimido[i].charAt(0).toUpperCase() + comprimido[i].slice(1); // Faz com que a primeira letra da string seja sempre maiuscula

        
      }
      else if (medicPattern4.test(arrayTexto[i])) {

        var arrayTexto2 = arrayTexto[i].split(" ");
        let match;
        let endIndex = 0;


        for (var k = 0; k < arrayTexto2.length; k++) {
          match = checkLastQuantity.exec(arrayTexto2[k]);
          if(match != null){
            console.log("ola");
            const startIndex = match.index; // Start index of the match
            const matchLength = match[0].length; // Length of the matched string
            endIndex = startIndex + matchLength; // End index of the match      
            console.log(endIndex.valueOf());
          } 
        }

        comprimidoSlice = arrayTexto2.slice(0, endIndex + 2);
        console.log(comprimidoSlice);
        comprimido[i] = comprimidoSlice.join(" ");
        console.log(comprimido[i]);
        porcaoSlice = arrayTexto2.slice(endIndex + 2);
        console.log(porcaoSlice);
        porcao[i] = porcaoSlice.join(" ");
        console.log(porcao[i]);

        comprimido[i] = comprimido[i].replace(/-/g, '');    // Retira os caracteres especiais que possam existir no inicio da string
        comprimido[i] = comprimido[i].replace(/#/g, '');
        comprimido[i] = comprimido[i].replace(/&/g, '');
        comprimido[i] = comprimido[i].trimStart();
        comprimido[i] = comprimido[i].charAt(0).toUpperCase() + comprimido[i].slice(1); // Faz com que a primeira letra da string seja sempre maiuscula


      }
      else {
        var arrayTexto2 = arrayTexto[i].split(" ");

        for (var k = 0; k < arrayTexto2.length; k++) {

          if (hasNumbers.test(arrayTexto2[k])) { break; }
        }

        comprimidoSlice = arrayTexto2.slice(0, k + 1);
        comprimido[i] = comprimidoSlice.join(" ");
        porcaoSlice = arrayTexto2.slice(k + 1);
        porcao[i] = porcaoSlice.join(" ");

        comprimido[i] = comprimido[i].replace(/-/g, '');    // Retira os caracteres especiais que possam existir no inicio da string
        comprimido[i] = comprimido[i].replace(/#/g, '');
        comprimido[i] = comprimido[i].replace(/&/g, '');
        comprimido[i] = comprimido[i].trimStart();
        comprimido[i] = comprimido[i].charAt(0).toUpperCase() + comprimido[i].slice(1); // Faz com que a primeira letra da string seja sempre maiuscula
      }
    }



    var quantidade: string[][] = [];

    for (var i = 0; i < porcao.length; i++) {
      quantidade.push([]);
    }

    for (let i = 0; i < porcao.length; i++) {

      //quantidade[i] = quantidade[i].replace(/\s/g, ''); // remove os espaços
      if (porcao[i].includes("+")) {
        quantidade[i] = porcao[i].split("+");
        quantidade[i] = quantidade[i].map(function (el) { return el.trim(); });
      } else {
        quantidade[i].push(porcao[i]);
      }
    }


    var tabela_final: string[][] = [];

    for (var i = 0; i < arrayTexto.length; i++) {
      tabela_final.push([]);
    }

    for (var i = 0; i < tabela_final.length; i++) {
      tabela_final[i].push(comprimido[i]);
      for (var j = 0; j < quantidade[i].length; j++) {
        tabela_final[i].push(quantidade[i][j]);
      }
    }




    const regex = /^[\d\/]+|\s+/;

    for (let j = 0; j < tabela_final.length; j++) {
      var element: TableElement = {
        comprimido: "",
        jejum: "",
        peqAlmoco: "",
        almoco: "",
        lanche: "",
        jantar: "",
        deitar: "",
        notas: ""
      };

      for (let i = 1; i < tabela_final[j].length; i++) {


        if (tabela_final[j][i].includes("ejum")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose
          else { }
          element.jejum = newText2;
          continue;

        } else if (tabela_final[j][i].includes("equeno") || tabela_final[j][i].includes("eq") || tabela_final[j][i].includes("PA")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose
          else { }
          element.peqAlmoco = newText2;
          continue;

        } else if (tabela_final[j][i].includes("lmoço")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose
          else { }
          element.almoco = newText2;
          continue;

        } else if (tabela_final[j][i].includes("anche")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose
          else { }
          element.lanche = newText2;
          continue;

        } else if (tabela_final[j][i].includes("antar")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose
          else { }
          element.jantar = newText2;
          continue;

        } else if (tabela_final[j][i].includes("eitar")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose

          element.deitar = newText2;
          continue;

        } else if (tabela_final[j][i].includes("noite")) {
          var newText2 = tabela_final[j][i].split(' ')[0];
          const match = newText2.match(regex);
          if (match) {
            newText2 = match[0];
          } else {
            newText2 = "1";
          }
          if (newText2 == null) { newText2 = "1"; }                                                                                 // se não tiver numero assumimos 1 dose
          else { }
          element.deitar = newText2;
          continue;
        }

        // Para id, 1id ,2is ...

        if (tabela_final[j][i].includes("1id") || tabela_final[j][i].includes("1od") || tabela_final[j][i].includes("uma")) {
          element.peqAlmoco = "1";
          continue;

        } else if (tabela_final[j][i].includes("1/2id") || tabela_final[j][i].includes("1/2od")) {
          element.peqAlmoco = "1/2";
          continue;


        } else if (tabela_final[j][i].includes("2id") || tabela_final[j][i].includes("2od") || tabela_final[j][i].includes("duas")|| tabela_final[j][i].includes("bid")) {
          element.peqAlmoco = "1";
          element.jantar = "1";
          continue;

        } else if (tabela_final[j][i].includes("3id") || tabela_final[j][i].includes("3od") || tabela_final[j][i].includes("tres")) {
          element.peqAlmoco = "1";
          element.almoco = "1";
          element.jantar = "1";
          continue;

        } else if (tabela_final[j][i].includes("id") || tabela_final[j][i].includes("od")) {
          element.peqAlmoco = "1";
          continue;
        }

        //No caso de conter texto aleatorio


        // if (hasNumbers.test(tabela_final[j][i]) && hasNumbers.test(tabela_final[j][i][0])) {

        //   tabela_final[j][i] = tabela_final[j][i].charAt(0).toUpperCase() + tabela_final[j][i].slice(1);
        //   element.notas = tabela_final[j][i];
        //   continue;
        // }


        // No caso de não ter id --> 1/2+1+2

        //console.log(tabela_final[j][i])

        if (tabela_final[j].length == 2 && tabela_final[j][1] == '') {
          element.peqAlmoco = "1";
          break;

        } else if (tabela_final[j].length == 2) {
          element.peqAlmoco = tabela_final[j][1];
          break;

        } else if (tabela_final[j].length == 3) {
          element.peqAlmoco = tabela_final[j][1];
          element.jantar = tabela_final[j][2];
          break;

        } else if (tabela_final[j].length == 4) {
          element.peqAlmoco = tabela_final[j][1];
          element.almoco = tabela_final[j][2];
          element.jantar = tabela_final[j][3];
          break;

        }

      }
      element.comprimido = tabela_final[j][0];

      this.dataSource.push(element);
      this.table.renderRows();
      this.isPrinting = true;
    }

    this.tableId = 'TT' + (this.fetchedTables.length + 1);
    this.db.getUserByEmail().subscribe((userData => {
      this.medicName = userData.username;
    }));
    var currentDate = this.getCurrentDate();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    this.date = day + '/' + month + '/' + year;

    var tableSection = document.getElementById('pre_visualizacao');
    tableSection?.scrollIntoView({ behavior: 'smooth' });

  }

  private hasLetters(str: string): boolean {
    const regex = /[a-zA-Z]/; // Regular expression to match any letter (uppercase or lowercase)
    return regex.test(str);
  }

  private getCurrentDate(): Date {
    return new Date();
  }



}

