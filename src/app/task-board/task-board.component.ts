import { Component, OnInit, TemplateRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {
  cardName = '';
  cardNameInput = '';
  cardNameError = '';
  listName = '';
  listNameInput = '';
  listNameError = '';
  deleteData = {};
  public modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  board: Board = new Board('Sample Application', []);
  constructor(private modalService: BsModalService) { }


  ngOnInit() {
    if (localStorage.getItem('data') === null) {
      this.board.columns.push(
        new Column('To Do', [
          'Pay electricity bill',
          'Make grocery list'
        ]),
        new Column('In Progress', [
          'Iron clothes',
        ]),
        new Column('Done', [
          'Buy running shoes'
        ])
      );
      localStorage.setItem('data', JSON.stringify(this.board));
    } else {
      this.board = JSON.parse(localStorage.getItem('data'));
    }
  }

  // open model
  openModal(template: TemplateRef<any>, type: string, name?: string) {
    if (type === 'card') {
      this.cardName = name;
    } else{
      this.listName = name;
    }
    this.modalRef = this.modalService.show(template, this.config);
  }

  // open delete model
  openDeleteModel(template: TemplateRef<any>, cardName, item?: string) {
    this.deleteData = {cardName, item};
    this.modalRef = this.modalService.show(template, this.config);
  }

  // check name
  checkName(type) {
    if (type === 'card') {
      if (this.cardNameInput === ''){
        this.cardNameError = 'Please enter card name';
      } else {
        this.cardNameError = '';
      }
    } else {
      if (this.listNameInput === ''){
        this.listNameError = 'Please enter list name';
      } else {
        this.listNameError = '';
      }
    }
  }

  // add a task
  addCard() {
    // console.log(columnName);
    if (this.cardNameInput === '') {
      this.cardNameError = 'Please enter card name';
      return;
    }
    for (const column of this.board.columns) {
      if (column.name === this.cardName) {
        this.modalRef.hide();
        column.tasks.push(this.cardNameInput);
        this.cardNameInput = '';
        this.cardNameError = '';
        localStorage.setItem('data', JSON.stringify(this.board));
        return;
      }
    }
  }

  // delete card
  deleteCard(data) {
    for (const column of this.board.columns) {
      if (column.name === data.cardName) {
        this.modalRef.hide();
        const taskIndex = column.tasks.indexOf(data.item);
        column.tasks.splice(taskIndex, 1);
        this.deleteData = {};
        localStorage.setItem('data', JSON.stringify(this.board));
        return;
      }
    }
  }

  // add list
  addList() {
    if (this.listNameInput === '') {
      this.listNameError = 'Please enter list name';
      return;
    }

    this.modalRef.hide();
    const newColumn = new Column(this.listNameInput,  []);
    this.board.columns.push(newColumn);
    this.listNameInput = '';
    this.listNameError = '';
    localStorage.setItem('data', JSON.stringify(this.board));
  }

  // delete list
  deleteList(data) {
    this.modalRef.hide();
    let columns = [...this.board.columns];
    columns = columns.filter(x => x.name !== data.cardName);
    this.board.columns = columns;
    this.deleteData = {};
    localStorage.setItem('data', JSON.stringify(this.board));
  }

  // drop event
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      localStorage.setItem('data', JSON.stringify(this.board));
    }
  }
}
