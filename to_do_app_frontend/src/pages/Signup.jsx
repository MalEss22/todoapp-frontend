import { useState } from 'react'
import '../App.css';
import { backend } from '../api';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { saveTokenToCookie } from '../lib/utils';
import { UserOutlined } from '@ant-design/icons'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
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
    // API call to create user using axios
    backend.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`,{
      username,
      password,
    }).then((response) =>{
      console.log('reponse Object:');
      console.log(response);
      const token = response.data.token;
      saveTokenToCookie(token);
      alert(`Successfully signed: ${response.data.message}`)
      //navigate to todo 
    navigate("/todos");

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
          SIGN UP
        </h2>
        <form onSubmit={submitHandler}>
          <div className='Username '>
            <label>Username</label>
            <Input
            size='large'
            className='focus-within:border focus-within:border-red-500 !w-full rounded-lg'
                placeholder='Enter a  username' type = 'text' onChange={(e) => {setUsername(e.target.value)}} value={username}
                 prefix={<UserOutlined />}
                />
          </div>
          <div className='password'>
            <label>Password</label>
            <Input.Password size="large" className='focus-within:border focus-within:border-red-500'  placeholder='Enter your password' onChange={(e) => {setPassword(e.target.value)}} type='password' value={password} />
          </div>
          <div>
             <input type='submit' value={'Sign Up'}/>
          </div>
          <div>
            <p>
                Already have an account? <a className='text-blue-500' password href="/login" >Login</a>
            </p>
          </div>
        </form>
      </div>
    </>
  )
}


export default Signup
