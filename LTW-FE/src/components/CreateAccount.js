import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import avtImage from '../assets/images/thuvien2.jpg';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra tên tài khoản
        const usernameRegex = /^[a-z]+$/;
        if (username.length < 6 || !usernameRegex.test(username)) {
            setErrorMessage('Tên tài khoản phải bao gồm ít nhất 6 chữ cái in thường.');
            return;
        }

        // Kiểm tra mật khẩu
        if (password.length < 6 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt.');
            return;
        }

        // Kiểm tra xác nhận mật khẩu
        if (password !== confirmPassword) {
            setErrorMessage('Xác nhận mật khẩu không khớp.');
            return;
        }

        if(window.confirm('Xác nhận đăng ký tài khoản?')){
            axios.post("http://localhost:8080/api/user/add", { "email": username, "password": password, "roles": "USER" })
                .then(response => {
                    if(response.status == 200){
                        console.log(response.data)
                        alert('Đăng ký thành công');
                        navigate('/login')
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        setErrorMessage('Username đã tồn tại');
                    }
                });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{
                height: '100vh',
                backgroundImage: `url(${avtImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>

            <div className="col-md-3 p-3 rounded" style={{ minHeight: '50vh', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
                <h2 className="text-center mb-4">Sign up</h2>
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
                                setErrorMessage('');
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
                                setErrorMessage('');
                            }}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrorMessage('');
                            }}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm Password:</label>
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
                        <button type="submit" className="btn btn-primary">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAccount;
