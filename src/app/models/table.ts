import { TableElement } from "./tableElement";

export interface Table{
    id?: string,
    idMedico: string,
    idTabela: string,
    tableElements: TableElement[]
}