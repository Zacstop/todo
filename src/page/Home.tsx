import React, { useEffect, useState, useRef } from "react";
import { signOut, onAuthStateChanged  } from "firebase/auth";
import { doc, collection, getDocs, addDoc, deleteDoc, query, updateDoc, orderBy, where, Timestamp } from 'firebase/firestore';
// import { Timestamp, orderBy, query, updateDoc, where } from '@firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebase";
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import modIcon from '../assets/images/icons/pencil.png';
import delIcon from '../assets/images/icons/trash-can.png';
import calender from '../assets/images/cal.png';
import box from '../assets/images/icons/box.png';
import Header from 'components/Header';

interface Todo {
  id: string;
  title: string;
  isDone: boolean;
}

interface TodoData {
  title: string;
  isDone: boolean;
  date: string | firebase.firestore.Timestamp;
  userId: string | undefined;
  order: number;
}

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  tenantId?: string;
  _redirectEventId?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: any;
  stsTokenManager: any;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

interface SubCollectionData {
  cc: string
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [lama, setLAMA] = useState<any>([]);
  const [data, setData] = useState<Todo[]>([]);
  const [change, setChange] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>('')
  const isEmpty = !data || data.length === 0
  console.log(data, 'outData')
  console.log(lama)
  
  const messageRef = useRef<HTMLInputElement>(null);
  const noteDate = Timestamp.fromDate(new Date());
  const ref = collection(db, "todos");
  
  // get
  const getData = async () => {
    // const q = query(ref, orderBy('order'));
    const q = query(ref, orderBy('order'), where('userId', '==', userId));
    
      // if (user && user?.uid) {
      try {
        const datas = await getDocs(q);
        console.log(userId, 'userIds')
        console.log(auth, 'onAuth')
        console.log(q, 'q')
        console.log(datas, 'datas')
        const filteredData = datas.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        console.log(filteredData)

        // filteredData.map(async (el) => {
        //   console.log(el)
        //   const workQ = query(collection(db, `todos/${el.id}/todo`))
        //   const workDetails = await getDocs(workQ)
        //   const workInfo = workDetails.docs.map((doc) => ({
        //     id: doc.id,
        //     ...doc.data(),
        //   }));
        //   const workInfos = workDetails.docs.map((doc) => (
        //     console.log(doc, 'docdocdodcodocd'),
        //     console.log(workDetails.docs,'workDetails')
        //   ))
        //   console.log(workInfos,'workInfos')
        //   setLAMA(workInfo)
        // })
        const workInfosPromises = filteredData.map(async (el) => {
          const workQ = query(collection(db, `todos/${el.id}/todo`));
          const workDetails = await getDocs(workQ);
          return workDetails.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
        
        const allWorkInfos = await Promise.all(workInfosPromises);
        const flattenedWorkInfos = allWorkInfos.flat();
        setLAMA(flattenedWorkInfos);
        

        setData(filteredData);
      } catch (err) {
        console.log(err);
      }
    // }
  };
  //

  // add
  const addTodo = async(e: React.FormEvent) => {
    e.preventDefault();
    const datas = await getDocs(ref);
    const order = datas.size;

    const data: TodoData = {
      title: messageRef.current!.value,
      isDone: false,
      date: noteDate,
      userId: auth?.currentUser?.uid,
      order: order,
    };

    try {
      await addDoc(ref, data);
      messageRef.current!.value = "";
      getData();
    } catch (err) {
      console.log(err);
    }
  }
  //

  // put
  const modTodo = async (todo: Todo) => {
    if(window.confirm("Are you sure you want to change this title?")) {
      if(change === '') {
        alert("Please enter a new title.");  // change 값이 비어있을 경우 사용자에게 알림
        setEditingId(null);
        return;
      }
      try {
        await updateDoc(doc(db, "todos", todo.id), {title: change});
        setChange('');
        setEditingId(null);
        getData();
      } catch (err) {
        console.log(err);
      }
    }
  };
  //

  // delete
  const deleteTodo = async (id: string) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "todos", id));
        getData();
      } catch (err) {
        console.log(err);
      }
    } else {
      return false;
    }
  };
  //

  // logout
  const logOut = (e: React.FormEvent) => {
    e.preventDefault();
    
    signOut(auth).then(() => {
      console.log('log out')
      navigate('/login')
    }).catch((error) => {
      console.log(error,'error')
    });
  }
  //
  
  // checkbox check
  const isClear = async(todo: Todo) => {
    console.log('Check!')
    try {
      await updateDoc(doc(db, "todos", todo.id), {isDone: !todo.isDone});
      getData();
    } catch (err) {
      console.log(err);
    }
  }
  //
  
  // useEffect(() => {
  //   const handleAuthState = async () => {
  //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //       if (user) {
  //         const userObj: User = user.toJSON() as User;
  //         console.log(user.toJSON(),'user')
  //         setUser(userObj)
  //         setUserId(user.uid)
          
  //         await getData();
  //       } else {
  //         navigate('/login')
  //       }
  //     });
  //     return unsubscribe();
  //   }
  //   const fetchData = async () => {
  //     console.log('fetchfetch!!')
  //     // 상위 문서의 참조를 얻습니다.
  //     const parentDocRef = doc(db, 'todos', '3ofxb2HAw5cx7RUGXyUB');
      
  //     // 하위 컬렉션의 참조를 얻습니다.
  //     const subCollectionRef = collection(parentDocRef, 'todo');
      
  //     // 하위 컬렉션의 문서들을 조회합니다.
  //     const querySnapshot = await getDocs(subCollectionRef);
      
  //     // 데이터를 배열로 변환합니다.
  //     const subCollectionData: SubCollectionData[] = [];
  //     querySnapshot.forEach((doc) => {
  //       subCollectionData.push(doc.data() as SubCollectionData);
  //     });

  //     console.log("Sub-collection data:", subCollectionData);
  //   };

    
  //   handleAuthState();
  //   fetchData();
  // }, []);
  useEffect(() => {
    const handleAuthState = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userObj: User = user.toJSON() as User;
          setUser(userObj)
          setUserId(user.uid)
          
          await getData();
          // await fetchData();  // 여기에 위치시켜 인증 후에만 fetchData가 실행되게 합니다.
        } else {
          navigate('/login');
        }
      });
      return () => unsubscribe();  // useEffect 클린업 함수
    };
  
    // const fetchData = async () => {
    //   try {  // try/catch 문 추가
    //     const parentDocRef = doc(db, 'todos', '3ofxb2HAw5cx7RUGXyUB');
    //     const subCollectionRef = collection(parentDocRef, 'todo');
    //     const querySnapshot = await getDocs(subCollectionRef);
    //     const subCollectionData: SubCollectionData[] = [];
    //     querySnapshot.forEach((doc) => {
    //       subCollectionData.push(doc.data() as SubCollectionData);
    //     });
    //     console.log("Sub-collection data:", subCollectionData);
    //   } catch (error) {
    //     console.error("Error fetching data: ", error);
    //   }
    // };
  
    handleAuthState();
  }, []);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const querySnapshot = await getDocs(collection(db, 'users'));

  //     for (const docSnapshot of querySnapshot.docs) {
  //       const userId = docSnapshot.id;

  //       const subQuerySnapshot = await getDocs(collection(db, `users/${userId}/orders`));
  //       subQuerySnapshot.forEach((subDoc) => {
  //         console.log(subDoc.id, " => ", subDoc.data());
  //       });
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  return (
    <div>
      <div className="container">
        <div>
          <Header/>
          <div style={{maxWidth: 968, width: "100%", height: "100vh", margin: "0 auto"}}>
            <div>
              {user ?
                <div>Logged in as {user.email}</div>
                :
                <div>Not logged in</div>
              }
              <div style={{fontSize: 30}}>Home Page</div>
              <button onClick={logOut}>log out</button>
            </div>

            <div style={{display: "flex"}}>
              <div style={{width: "50%"}}>
                <div><img src={calender} style={{width: "100%"}}/></div>
              </div>
              {/*  */}
              <div style={{width: "50%", padding: 10}}>
                  <div style={{width: 244, height: 34, background: "#EBEBEB", borderRadius: 50, alignItems: "center", display: "flex"}}>
                    <img src={box} style={{width: 18, padding: 14}} />
                    <p style={{}}>1일 차 | 07:00 ~ 12:00</p>
                  </div>
                {isEmpty ? 
                  <div>loading...</div>
                  :
                  <>
                    {data.map((todo) => (
                      <div key={todo.id} className="todo-container">
                        <input id={todo.id} type="checkbox" checked={todo.isDone} onChange={() => isClear(todo)} style={{}}/>
                        <label className="labela" htmlFor={todo.id} id={todo.id}></label>
                        {editingId === todo.id ? (
                          <>
                            <input className="todo" type="text" defaultValue={todo.title} onChange={(e) => setChange(e.target.value)}/>
                            <button onClick={() => modTodo(todo)}>
                              <img src={modIcon} alt="modi" style={{width: "auto", height: 20}}/>
                            </button>
                          </>
                          ) : (
                            <>
                              <span className="todo">{todo.title}</span>
                              <button onClick={() => {editingId === null ? setEditingId(todo.id) : setEditingId(null)}}>
                                <img src={modIcon} alt="modi" style={{width: "auto", height: 20}}/>
                              </button>
                            </>
                          )
                        }
                        <button onClick={() => deleteTodo(todo.id)}>
                          <img src={delIcon} alt="del" style={{width: "auto", height: 20}}/>
                        </button>
                        {/* <input type="text" placeholder="변경명" onChange={(e) => setChange(e.target.value)}></input>
                        <button onClick={() => modTodo(todo)}>수정</button> */}
                      </div>
                    ))}
                  </>
                }
              </div>

              {/* <input ref={messageRef} type="text"/>
              <button onClick={addTodo}>Add Todo</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
