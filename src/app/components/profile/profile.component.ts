import { Component, ViewChild, EventEmitter } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute} from '@angular/router';
import { DataBaseService } from 'src/app/services/database.service';
import { MainComponent } from '../../components/main/main.component'
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private db: DataBaseService, private router: Router, private route: ActivatedRoute, private eventEmitter : EventEmitterService) { }


  public logout(): void {
    var logout = confirm('Tem a certeza que pretende sair?');
    if (logout) {
    this.db.logout();
    }
  }

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  dataSource!: MatTableDataSource<string>;
  displayedColumns: string[] = ['idTabela'];
  posts: string[] = [];
  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;
  max = false;


  user: any = {
    nome: '',
    email: '',
    dataNascimento: '',
    nOrdemMedicos: ''
  };

  toggleDropdown() {
    var dropDownMenu = document.querySelector('.dropdown_menu');
    dropDownMenu?.classList.toggle('open');

    var body = document.querySelector('pre_visualizacao');

  }


  ngOnInit(): void {
    this.getUser();
    this.getTables();
  }


  getUser(): void{
    this.db.getUserByEmail().subscribe((userData) => {
      this.user.nome = userData.username;
      this.user.email = userData.email;
      this.user.dataNascimento = userData.dataNascimento;
      this.user.nOrdemMedicos = userData.nOrdemMedicos;
    })
  }

  getTables(): void{
    this.db.getTables().subscribe((tables) => {
      if (tables.length > 0) {
        for (var i = 0; i < tables.length; i++) {
          this.posts[i] = tables[i].idTabela;
        }
      }
      this.dataSource = new MatTableDataSource(this.posts);
      this.dataSource.paginator = this.paginator;
    });
  }

  pageChangeSize($event: PageEvent) {
    this.pageSize = $event.pageSize;
    this.getTables();
  }


  next(): void {
    this.pageIndex++;
    this.getTables();
  }

  back(): void {
    if (this.pageIndex <= 1) {
      this.pageIndex = 1;
    }
    this.pageIndex--;
    this.getTables();
  }


  onRowClick(row: any): void {
    var visualize = confirm('Quer visualizar a tabela?');
    if (visualize) {
      const evenData = row;
      this.eventEmitter.emitIdTable(evenData);
      this.router.navigate(['/mainPage']);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
