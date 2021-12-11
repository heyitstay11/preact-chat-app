import { useCallback, useState } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import { useAlertContext } from '../../alertContext';
import { useAuthContext } from '../../authContext';


const Signup = () => {
  const { setAlertMessage } = useAlertContext(); 
  const { setUser } = useAuthContext();

  const [formData, setFormData] = useState({
      username:'',
      email:'',
      password:''
  });

  const handleInput = useCallback((e) => {
      const [property, value] = [e.target.name, e.target.value];
      setFormData({...formData, [property]: value});
  });

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData);
      try{
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
          method: 'POST',
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(res.status === 201){
          console.log(data);
          setUser({token: data.token, email: data.email, id: data.id, name: data.name });
          return route('/');
        }else{
          console.log(data);
          setAlertMessage(data.msg);
        }
      }catch(err){
        console.log(err);
        // setAlertMessage(JSON.stringify(err));
      }
   
}

return (
    <main>
    <h1 class="text-4xl text-center my-4 text-purple-700">Signup</h1>
    <form onSubmit={handleSubmit} class="flex flex-col w-400px max-w-92/100 mx-auto my-6" >
      
      <label htmlFor="username" class="text-xl">Username *</label>
      <input onInput={handleInput} value={formData.username} id="username" name="username" type="text" required />
      
      <label htmlFor="email" class="text-xl mt-4">Email *</label>
      <input onInput={handleInput} value={formData.email} id="email" name="email" type="email" required />

      <label htmlFor="password" class="text-xl mt-4">Password *</label>
      <input onInput={handleInput} value={formData.password}id="password" name="password" type="password" required />

      <button class="button w-min mx-auto mt-4" type="submit">Submit</button>
    </form>
    <p class="text-center text-lg">Already have an account, <Link class="text-purple-700 text-xl ml-1" href="/login">Login</Link></p>
  </main>
)
}

export default Signup;