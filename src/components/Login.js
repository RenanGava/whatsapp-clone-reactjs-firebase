import Api from '../Api'
import './Login.css'

export default function Login({ onReceive }){

    async function handleFacebookLogin (){
        const result = await Api.fbPopup();

        console.log(result);

        if(result) {
            onReceive(result.user)
        } else{
            alert('Erro!')
        }
    }

    return(
        <div className='login'>
            <button onClick={handleFacebookLogin}>Logar com o Google</button>
        </div>
    )
}