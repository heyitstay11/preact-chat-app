import { useState } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import { useAlertContext } from '../../alertContext';
import { useAuthContext } from '../../authContext';

const Login = () => {
const { setUser } = useAuthContext();
const { setAlertMessage } = useAlertContext(); 
const [formData, setFormData] = useState({
    email:'',
    password:''
});

const handleInput = (e) => {
    const [property, value] = [e.target.name, e.target.value];
    setFormData({...formData, [property]: value});
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(res.status === 201){
        setUser({token: data.token, email: data.email, id: data.id , name: data.name });
        route('/');
      }else{
        setAlertMessage(data.error);
      }
    }catch(err){
      console.log(err);
      setAlertMessage(JSON.stringify(err));
    }
}

return (
    <main>
    <h1 class="text-4xl text-center my-4 text-purple-700">Login</h1>
    <form onSubmit={handleSubmit} class="flex flex-col w-400px max-w-92/100 mx-auto my-6" >
      
      <label htmlFor="email" class="text-xl mt-4">Email *</label>
      <input onInput={handleInput} value={formData.email} id="email" name="email" type="email" required />

      <label htmlFor="password" class="text-xl mt-4">Password *</label>
      <input onInput={handleInput} value={formData.password}id="password" name="password" type="password" required />

      <button class="button w-min mx-auto mt-4" type="submit">Submit</button>
    </form>
    <p class="text-center text-lg">Don't have an account, <Link class="text-purple-700 text-xl ml-1" href="/signup">Signup</Link></p>
  </main>
)
}

export default Login;