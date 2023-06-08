import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import avtImage from '../assets/images/thuvien.jpg';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const createAccount = () => {
        navigate("/createaccount");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        axios.post("http://localhost:8080/api/login", { "userName": username, "password": password })
            .then(response => {
                console.log(response.data)
                localStorage.setItem("id", response.data.idUser);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", response.data.email);
                if (response.data.role == 'ADMIN') {
                    navigate("/books");
                }
                else {
                    navigate("/");
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Invalid username or password');
                } else {
                    setErrorMessage('Tài khoản hoặc mật khẩu không chính xác. Vui lòng nhập lại.');
                }
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{
                height: '100vh',
                backgroundImage: `url(${avtImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                //  opacity: 0.9,
            }}>

            <div className="col-md-3 p-3 rounded" style={{ minHeight: '50vh', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                <h2 className="text-center mb-4">Login</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                // setErrorMessage('');
                            }}
                            required
                        />
                        <label htmlFor="username">Username:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                // setErrorMessage('');
                            }}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                    </div>
                    <div className="text-center d-flex justify-content-between">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="showPassword">
                                Show password
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
                <div className='mt-4'>
                    <button className='btn' onClick={() => createAccount()}>
                        Tạo tài khoản 
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
