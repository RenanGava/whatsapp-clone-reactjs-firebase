import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { firebaseConfig } from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    fbPopup: async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        let result = await firebaseApp.auth().signInWithPopup(provider)
        return result
    },
    addUser: async (u) => {
        await db.collection('users').doc(u.id).set({
            name: u.name,
            avatar: u.avatar,

            /* 
                essa opáco é para se for achado um dado com esse id ela apenas
                alterar se conteudo
            */
        }, {merge: true} )
    },

    getContactList: async (userId) => {
        const list = []

        const results = await db.collection('users').get();

        results.forEach(result => {
            let data = result.data()
            

            if(result.id !== userId){
                list.push({
                    id: result.id,
                    name: data.name,
                    avatar: data.avatar
                })
            }
        })

    
        return list
    },

    addNewChat: async (user, user2) =>{
        const newChat = await db.collection('chats').add({
            messages:[],
            users:[user.id, user2.id],
        })

        // referencia do chat para os usuarios logo abaixo

        // usuario que representa você ou primeiro usuario da conversa
        db.collection('users').doc(user.id).update({
            // adicionar um novo chate no array utilizando esse método
            chats:firebase.firestore.FieldValue.arrayUnion({
                chatId: newChat.id,
                title: user2.name,
                image: user2.avatar,
                with: user2.id
            })
        })

        // usuario que representa com quem iremos conversar.
        db.collection('users').doc(user2.id).update({
            // adicionar um novo chate no array utilizando esse método
            chats:firebase.firestore.FieldValue.arrayUnion({
                chatId: newChat.id,
                title: user.name,
                image: user.avatar,
                with: user.id
            })
        })
    },

    onchatList: (userId, setChatList) => {
        return db.collection('users').doc(userId).onSnapshot((doc) =>{
            if(doc.exists) {
                const data = doc.data();
                
                if(data.chats){
                    setChatList(data.chats)
                }
            }
        })
    },

    onChatContent: (chatId, setList, setUsers) =>{
        return db.collection('chats').doc(chatId).onSnapshot((doc)=>{
            if(doc.exists){
                const data = doc.data()

                setList(data.messages)
                setUsers(data.users)
            }
        })
    },
    sendMessage: async (chatData, userId, type, body, users) => {
        const now = new Date()
        
        db.collection('chats').doc(chatData.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                type,
                author: userId,
                body,
                date: now
            })
        })

        for(let i in users){
            const u = await db.collection('users').doc(users[i]).get()
            console.log(u);
            let uData = u.data()

            if(uData.chats){
                let chats = [...uData.chats]

                for(let e in chats){
                    if(chats[e].chatId == chatData.chatId){
                        chats[e].lastMessage = body
                        chats[e].lastMessageDate = now
                    }
                }

                await db.collection('users').doc(users[i]).update({
                    chats
                })
            }
        }
    },
}