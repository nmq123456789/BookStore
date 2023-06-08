import './App.css';
import {BrowserRouter, Route, Router, Routes} from 'react-router-dom'
import Home from './components/Home';
import ViewAdmin from './components/ViewAdmin';
import Login from './components/Login';
import ViewUser from './components/ViewUser';
import ProductDetails from './components/ProductDetails';
import ShoppingCart from './components/ShoppingCart';
import CreateAccount from './components/CreateAccount';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        {/* <LoginHeader></LoginHeader> */}
        <Routes>
          <Route path='books' element={<Home></Home>} ></Route>
          <Route path='book/:bookcode' element={<ViewAdmin></ViewAdmin>}></Route>
          <Route path='login' element={<Login></Login>}></Route>
          <Route path='/' element={<ViewUser></ViewUser>}></Route>
          <Route path='details/:bookcode' element={<ProductDetails></ProductDetails>}></Route>
          <Route path='shoppingCart' element={<ShoppingCart></ShoppingCart>}></Route>
          <Route path='createaccount' element={<CreateAccount></CreateAccount>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
