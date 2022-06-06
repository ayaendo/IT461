import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Dogs from './components/Dogs';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './components/Lounge';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import DogAdd from './components/DogAdd';
import DogDetail from './components/DogDetail';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import DogEdit from './components/DogEdit';
import DogDelete from './components/DogDelete';
import Cats from './components/Cats';
import CatAdd from './components/CatAdd';
import CatDetail from './components/CatDetail';
import CatEdit from './components/CatEdit';
import CatDelete from './components/CatDelete';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  const [dogs, setDogs] = useState([]);
  const [urlDogs, setUrDogs] = useState('/dogs/?limit=3&offset=0');
  const [cats, setCats] = useState([]);
  const [urlCats, setUrlCats] = useState('/cats/?limit=3&offset=0');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const getDogs = async (urlDogs, options=null) => {
    setUrDogs(urlDogs);
      try {
          const response = await axiosPrivate.get(urlDogs, options);
          console.log(response.data);
          setDogs(response.data);
      } catch (err) {
          console.error(err);
          navigate('/login', { state: { from: location }, replace: true });
      }
  }
  const getCats = async (urlCats, options=null) => {
    setUrlCats(urlCats);
    try {
        const response = await axiosPrivate.get(urlCats, options);
        console.log(response.data);
        setCats(response.data);
    } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
    }
}
  useEffect(() => {
      const controller = new AbortController();
      getDogs(urlDogs, {
          signal: controller.signal
      });
      getCats(urlCats, {
        signal: controller.signal
    });
      return () => {
          controller.abort();
      }
  }, []);

  const dogAddHandler= async (dog)=>{
    console.log('Dog: ', dog);
    const response = await axiosPrivate.post('/dogs/', JSON.stringify(dog));
    console.log(response.data);
    getDogs(urlDogs);
  }

  const catAddHandler= async (cat)=>{
    console.log('Cat: ', cat);
    const response = await axiosPrivate.post('/cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats(urlCats);
  }

  const dogUpdateHandler = async(dog)=>{
    console.log('Dog: ', dog);
    const response = await axiosPrivate.put('/dogs/', JSON.stringify(dog));
    console.log(response.data);
    getDogs(urlDogs);
  }

  const catUpdateHandler = async(cat)=>{
    console.log('Cat: ', cat);
    const response = await axiosPrivate.put('/cats/', JSON.stringify(cat));
    console.log(response.data);
    getCats(urlCats);
  }

  const dogDeleteHandler = async(dog)=>{
    console.log('Dog: ', dog);
    const response = await axiosPrivate.delete('/dogs/', {data : JSON.stringify(dog.id)});
    console.log(response.data);
    getDogs(urlDogs);
  }

  const catDeleteHandler = async(cat)=>{
    console.log('Cat: ', cat);
    const response = await axiosPrivate.delete('/cats/', {data : JSON.stringify(cat.id)});
    console.log(response.data);
    getCats(urlCats);
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="dogs" element={<Dogs dogs={dogs} getDogs={getDogs}/>} />
          <Route path="dogs/create" element={<DogAdd addHandler={dogAddHandler} />}/>
          <Route path="dogs/view/:id" element={<DogDetail/>}/>
          <Route path="dogs/edit/:id" element={<DogEdit updateHandler={dogUpdateHandler}/>}/>
          <Route path="dogs/delete/:id" element={<DogDelete deleteHandler={dogDeleteHandler}/>}/>
          <Route path="cats" element={<Cats cats={cats} getCats={getCats}/>} />
          <Route path="cats/create" element={<CatAdd addHandler={catAddHandler} />}/>
          <Route path="cats/view/:id" element={<CatDetail/>}/>
          <Route path="cats/edit/:id" element={<CatEdit updateHandler={catUpdateHandler}/>}/>
          <Route path="cats/delete/:id" element={<CatDelete deleteHandler={catDeleteHandler}/>}/>
        </Route>


        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;