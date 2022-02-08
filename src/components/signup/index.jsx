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
  <main class="mx-auto lg:max-w-4xl text-center px-2 py-12 flex">

      <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:pr-15 lg:block hidden">
          <img class="object-cover object-center rounded" alt="hero" src="./chatapp.png" />
      </div>

      <div className="mx-auto">

        <h1 class="text-4xl font-400 text-center my-4 text-purple-800">Signup</h1>

        <form onSubmit={handleSubmit} class="flex flex-col w-full lg:max-w-full max-w-90/100 mx-auto" >
        
        <label htmlFor="email" class="text-xl text-left py-1 mt-4">Email *</label>
        <input onInput={handleInput} value={formData.email} id="email" name="email" type="email" required />

        <label htmlFor="password" class="text-xl text-left py-1 mt-4">Password *</label>
        <input onInput={handleInput} value={formData.password}id="password" name="password" type="password" required />

        <button class="button block w-auto mt-4 py-3 text-xl" type="submit">Submit</button>
        </form> 

        <p class="text-center text-lg mt-2">Don't have an account, <Link class="text-purple-700 text-xl ml-1" href="/signup">Signup</Link></p>
        <p class="text-center text-lg mt-2 ">Use email: test@mail.com, password: test1234 for testing <span class="font-bold text-xl" aria-hidden="true">😊</span> </p>
      
      </div>
  </main>
)
}

export default Signup;