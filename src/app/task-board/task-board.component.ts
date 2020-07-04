import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {

  constructor() { }

  board: Board = new Board('Sample Application', [
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
  ]);

  ngOnInit() {
    if (!localStorage.getItem('data')){
      localStorage.setItem('data', JSON.stringify(this.board));
    }
  }

  // add a task
  addTask(columnName){
    console.log(columnName);
    for (const column of this.board.columns){
      if (column.name === columnName){
        column.tasks.push('New Task');
      }
    }
  }

  // add a list
  addList(){
    console.log('add list');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
