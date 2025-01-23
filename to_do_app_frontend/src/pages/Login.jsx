import { useState } from 'react'
import '../App.css';
import { backend } from '../api';
import { UserOutlined } from '@ant-design/icons'
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Login = () => {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault()
    if (username.trim()=='') {
      alert('Please enter a username')
      return
    }
    if(password.trim()==''){
      alert('Please enter a password')
      return
    }
    if(password.length<8){
      alert('Please enter a valid password. Password must be at least 8 characters')
      return
    }
    //navigate('/user-id/todos');

    // API call to verify user using axios
    backend.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`,{
      username,
      password,
    }).then((response) =>{
      console.log('reponse Object:');
      console.log(response);
      const token =response.data.token;
      Cookies.set('jwt_token', token, { expires: 7, secure: true, sameSite: 'Strict' });
      alert(`Successfully Logged in : ${response.data.message}`);
      navigate("/todos");
      // read and save jwt token


    }).catch((error) =>{
        console.log(error)
        console.error('Error creating user: '+error.response.data.message);
        alert('Error creating user: '+error.response.data.message);
    });
    
  }
  return (
    <>
      <div className='signupcontainer mx-auto'>
        <h2>
     LOGIN
        </h2>
        <form onSubmit={submitHandler}>
          <div className='Username'>
            <label>Username</label>
            
            <Input
            size='large'
            className='focus-within:border focus-within:border-red-500'
                placeholder='Enter a  username' type = 'text' onChange={(e) => {setUsername(e.target.value)}} value={username}
                prefix={<UserOutlined />}
                />
          </div>
          <div className='password'>
            <label>Password</label>
            <Input.Password size="large" className='focus-within:border focus-within:border-red-500'  placeholder='Enter your password' onChange={(e) => {setPassword(e.target.value)}} type='password' value={password} />
          </div>
          <div>
             <input type='submit' value={'Login'}/>
          </div>
          <div>
            <p>
               Don't have an account? <a className='text-blue-500' password href="/signup">Sign up</a>
            </p>
          </div>
        </form>
      </div>
    </>
  )
}


export default Login
