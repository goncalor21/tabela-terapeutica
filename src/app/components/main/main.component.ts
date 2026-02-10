import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataBaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { Table } from 'src/app/models/table';
import { TableElement } from 'src/app/models/tableElement';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { MatDialog } from '@angular/material/dialog';
import { MainPopUpComponent } from '../main-pop-up/main-pop-up.component';
import { AiParserService } from 'src/app/ai/ai-parser.service';
import { RxParseService } from 'src/app/services/rx-parse.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    standalone: false,
    animations: [
      trigger('fadeInSlide', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})



export class MainComponent {

  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  @ViewChild('elRef') elRef!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  searchText: string = '';
  searchResults: string[] = [];
  constructor(
    private db: DataBaseService,
    private router: Router,
    private rx: RxParseService,
    private eventEmitter: EventEmitterService,
    private dialogRef: MatDialog,
    private location: Location,
    private renderer: Renderer2,
    private snackBar: MatSnackBar) { }

  isPrinting: boolean = false;
  isEditMode: boolean = false;
  textareaValue = '';
  isLoading = false;
  errorMsg = '';
  dataSourceAfterSearchLength: number = 0;
  public searchValue: string = '';
  public tableId: string = '';
  public date: string = '';
  public medicName: string = '';


  displayedColumns: string[] = ['comprimido', 'jejum', 'peqAlmoco', 'almoco', 'lanche', 'jantar', 'deitar', 'notas'];
  dataSource: TableElement[] = [];
  fetchedTables: Table[] = [];
  originalDataSource!: TableElement[];
  isLoggedIn: boolean = false;
  private aborter?: AbortController;

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
    // Set login status immediately
    this.isLoggedIn = this.db.isLoggedIn();
    
    // Only fetch tables if logged in
    if (this.isLoggedIn) {
      this.db.getTables().subscribe({
        next: (tables) => {
          if (tables.length > 0) {
            this.fetchedTables = tables;
            if (this.eventEmitter.getIdTable().length != 0) {
              this.showTable(this.eventEmitter.getIdTable());
            }
          }
        },
        error: (err) => {
          console.error('Error fetching tables:', err);
          // Silently fail - user can still use the parser without saved tables
        }
      });
    }
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
            deitar: "",
            notas: ""
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

  public saveTableClicked(): void {
    if (this.isLoggedIn) {
      this.saveTableAfterEdit();
    } else {
      this.snackBar.open("Por favor registe-se", 'OK', { duration: 5000 });
    }
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
        console.error("Existe algo de errado com a tabela.");
        return;
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


  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
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
            this.snackBar.open('Tabela atualizada com sucesso', 'OK', { duration: 3000 });
            this.router.navigate(['mainPage']);
          },
          error: (err) => {
            this.snackBar.open(err?.error?.message || 'Erro ao guardar', 'OK', { duration: 5000 });
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
            this.snackBar.open(res.message, 'OK', { duration: 3000 });
            this.router.navigate(['mainPage']);
          },
          error: (err) => {
            this.snackBar.open(err?.error?.message || 'Erro ao guardar', 'OK', { duration: 5000 });
          }
        });
      } else {
        this.snackBar.open("Existe algo de errado com a tabela!", 'OK', { duration: 5000 });
      }
    } else {
      this.snackBar.open("Por favor registe-se", 'OK', { duration: 5000 });
    }
  }



  async handleSubmit() {
    this.errorMsg = '';
    this.isLoading = true;
    try {
      this.dataSource = await this.rx.parse(this.textareaValue);
      this.table?.renderRows();
      document.getElementById('pre_visualizacao')?.scrollIntoView({ behavior: 'smooth' });
    } catch (e: any) {
      console.error(e);
      this.errorMsg = e?.message ?? 'Erro ao processar';
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    this.aborter?.abort();
  }

  private hasLetters(str: string): boolean {
    const regex = /[a-zA-Z]/; // Regular expression to match any letter (uppercase or lowercase)
    return regex.test(str);
  }

  private getCurrentDate(): Date {
    return new Date();
  }



}

