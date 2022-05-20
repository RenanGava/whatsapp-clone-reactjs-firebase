import { useEffect, useState } from 'react'
import './MessageItem.css'

export default function MessageItem({data, user}){

    const [time, setTime] = useState()

    useEffect(()=>{
        if(data.date.seconds > 0){
            const d = new Date(data.date.seconds * 1000)
            
            let hours = d.getHours()
            let minutes = d.getMinutes()

            hours = hours < 10 ? `0${hours}` : hours
            minutes = minutes < 10 ? `0${minutes}` : minutes

            setTime(`${hours}:${minutes}`)
        }
    },[data])

    return(
        <div 
            className="messageLine"
            style={{
                justifyContent: user.id === data.author ? 'flex-end' : 'flex-start'
            }}
        >
            <div 
                className="messageItem"
                style={{
                    backgroundColor: user.id === data.author ? '#DCF8C6' : '#FFF'
                }}
            >
                <div className="messageText">{data.body}</div>
                <div className="messageDate">{time}</div>
            </div>
        </div>
    )
}