import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FileItem } from '../../models/file-item';

export interface Item { name: string; }

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css']
})
export class FotosComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<FileItem>;
  items: Observable<FileItem[]>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<FileItem>('img');
    this.items = this.itemsCollection.valueChanges();
  }

  ngOnInit() {
  }

}
