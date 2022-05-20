import './NewChat.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import Api from '../Api';

export default function NewChat({ user, chatlist, show, setShow, }) {

    const [list, setList] = useState([]);

    useEffect(() => {

        async function getList() {
            if(user !== null){
                let results = await Api.getContactList(user.id)
                setList(results)
            }
        }
        getList()

    }, [user])

    // aqui seria o usuario com quem estivermos conversando
    async function addNewChat(user2){
        await Api.addNewChat(user, user2)

        handleClose(false)
    }

    function handleClose() {
        setShow(false)
    }

    return (
        <div className="newChat" style={{ left: show ? 0 : -415 }}>
            <div className="newChat--head">
                <div
                    className="newChat--backbutton"
                    onClick={handleClose}
                >
                    <ArrowBackIcon style={{ color: '#FFF' }} />
                </div>
                <div className="newChat--headtitle">
                    Nova Conversa
                </div>
            </div>
            <div className="newChat--list">
                {
                    list.map((item, key) => {
                        return (
                            <div onClick={()=> addNewChat(item)} className='newChat--item' key={key}>
                                <img className='newChat--itemavatar' src={item.avatar} alt='' />
                                <div className='newChat--itemname'>
                                    {item.name}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}