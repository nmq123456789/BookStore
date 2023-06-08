import React, { startTransition, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import "../css/ViewUser.css";

const ViewUser = () => {
    const [books, setBooks] = useState([]);
    const role = localStorage.getItem("role");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const productDetails = (bookCode) => {
        navigate(`/details/${bookCode}`);
    }

    const shoppingCart = () => {
        navigate('/shoppingCart')
    }

    const handleSearch = () => {
        if (searchTerm.trim().length !== 0) {
            axios.get(`http://localhost:8080/api/search/${searchTerm}`)
                .then((data) => {
                    setBooks(data.data);
                    console.log(data.data);
                })
        } else {
            axios.get(`http://localhost:8080/api/books`)
                .then(data => {
                    setBooks(data.data);
                })
        }
    };

    const handleLogout = (event) => {
        const token = localStorage.getItem("token");
        if (token && role) {
            if (window.confirm('Bạn có chắc chắn đăng xuất?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('id');
                localStorage.removeItem('email');
                navigate('/login');
            }
            else {
                event.preventDefault();
            }
        } else {
            navigate('/login')
        }
    };

    useEffect(() => {
        axios.get('http://localhost:8080/api/books', {
            // headers:{"Authorization": `Bearer ${token}`}
        })
            .then(data => {
                setBooks(data.data);
                console.log(data.data)
            })
            .catch(err => console.log(err))
    }, [setBooks]);


    return (
        <div>
            <div className="navbar navbar-expand-lg navbar-light" style={{ minHeight: '100px', backgroundColor: 'gainsboro' }}>
                <div className="container px-4 px-lg-5">
                    <a className="navbar-brand" href="#!"><h3>Library</h3></a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                            <li className="nav-link">
                                <a
                                    className={`nav-link active text-black ${window.location.pathname === '/' ? 'underline-redd' : 'underline-red'}`}
                                    aria-current="page"
                                    href="http://localhost:3000/"
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-link">
                                <a className="nav-link text-black underline-red">About</a>
                            </li>
                            <li className="nav-link">
                                <a className="underline-red btn btn-link nav-link text-black" onClick={handleLogout}>{role ? role : "Login"}</a>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-left align-items-center">
                            <input className="form-control me-1" type="search" aria-label="Search" placeholder="Search by title" value={searchTerm} onChange={handleSearchChange} />
                            <button className="btn btn-outline-dark p-1.5" onClick={handleSearch}>Search</button>
                        </div>
                        {role === 'USER' && (
                            <form className="d-flex ms-auto">
                                <button className="btn btn-outline-dark p-1.5" onClick={() => shoppingCart()}>
                                    <i className="bi-cart-fill me-1"></i>
                                    Cart
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <main className="py-4">
                <div className="container">
                    <div className="row">
                        {books && books.map((book) => (
                            <div className="col-md-3 mb-3" onClick={() => { productDetails(book.id) }}>
                                <div
                                    className="card border border-success"

                                    onMouseOver={(e) => {
                                        e.currentTarget.classList.toggle('border-danger');
                                        e.currentTarget.classList.toggle('border-2');
                                    }}

                                    onMouseOut={(e) => {
                                        e.currentTarget.classList.toggle('border-danger');
                                        e.currentTarget.classList.toggle('border-2');
                                    }}
                                >
                                    <div className='rounded-top'
                                        style={{
                                            backgroundImage:  book.imgName && `url(${require('../assets/images/' + book.imgName)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            height: '333px',
                                        }}
                                        
                                    ></div>
                                    <div className="card-body border-top border-danger" style={{ minHeight: '80px' }}>
                                        <h5 className="card-title">{book.title}</h5>
                                        <p className="card-text">{book.author}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ViewUser;
