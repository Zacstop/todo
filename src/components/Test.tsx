import React from "react";
import axios from 'axios';
import { dbs } from '../firebase.js';
import { DocumentData, collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

interface Todo {
  id?: string;
  title: string;
  isDone: boolean;
}

export default function Test() {
  const [data, setData] = React.useState<Todo[]>([]);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  console.log(data)

  const check = () => {
    setIsChecked(!isChecked)
    fetchSweets();
  }

  const dbService = getFirestore();
  const lama: Object[] = [];

  const todoRef = doc(collection(dbs, 'todos'), 'todo1');
  console.log(todoRef)

  async function fetchSweets() {
    const db = await getDocs(collection(dbService, "todos")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log(doc.data());
        lama.push(doc.data());
        // setData(lama)
        console.log(lama);
        // setData()
      });
    });
  }


  return (
    <div className="wrapper">
      <div className="container">
        <div>
          <div style={{margin: 10, fontSize: 20}}>
            <input id="ch1" type="checkbox" checked={isChecked} onChange={check}></input>
            <label id="ch1" htmlFor="ch1">CheckBox1</label>
          </div>
          
          <div style={{margin: 10, fontSize: 20}}>
            <input id="ch2" type="checkbox" checked={isChecked} onChange={check}></input>
            <label id="ch2" htmlFor="ch2">CheckBox2</label>
          </div>
          
          <div style={{margin: 10, fontSize: 20}}>
            <input id="ch3" type="checkbox" checked={isChecked} onChange={check}></input>
            <label id="ch3" htmlFor="ch3">CheckBox3</label>
          </div>
        </div>
      </div>
    </div>
  );
}
