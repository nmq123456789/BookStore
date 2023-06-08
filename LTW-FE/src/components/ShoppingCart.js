import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import "../css/ViewAdmin.css";


function ShoppingCart() {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [carts, setCarts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    const handleRowClick = (bookId) => {
        navigate(`/details/${bookId}`)
    }

    const deleteCart = (book, quantity) => {
        const token = localStorage.getItem("token");
        
        const cartKey = {
            user: { id: userId},
            book: book,
            quantity: quantity
        };

        if(window.confirm('Bạn có chắc chắn xoá sản phẩm này trong giỏ hàng không?')){
            axios.delete(`http://localhost:8080/api/carts/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` },
                data: cartKey,
            })
                .then(response => {
                    console.log('Delete added successfully:', response.data);
                    navigate("/shoppingCart")
                })
                .catch(error => {
                    console.error('Error adding cart:', error);
                });
        }
    }

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
        axios.get(`http://localhost:8080/api/carts/${userId}`, {
            headers:{"Authorization": `Bearer ${token}`}
        })
            .then(data => {
                setCarts(data.data);
                // Tính tổng giá trị Subtotal
                let total = 0;
                data.data.forEach(cart => {
                    total += cart.quantity * cart.book.price;
                });
                setSubtotal(total);
            })
            .catch(err => console.log(err))
    }, [carts]);

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
                                    className={`nav-link active text-black underline-red`}
                                    aria-current="page"
                                    href="http://localhost:3000/"
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-link">
                                <a className="nav-link text-black underline-red" href="#">About</a>
                            </li>
                            <li className="nav-link">
                                <a className="underline-red btn btn-link nav-link text-black" onClick={handleLogout}>{role === "USER" ? role : "Login"}</a>
                            </li>
                        </ul>

                        <form className="d-flex ms-auto">
                            <button className="btn btn-outline-dark p-1.5" type="submit">
                                <i className="bi-cart-fill me-1"></i>
                                Cart
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row">
                    <table className="table table-hover">
                        <thead>
                            <tr className="h5" style={{ borderBottom: '1px solid' }}>
                                <th className="text-center col-md-3">Product</th>
                                <th className="text-center col-md-3">Quantity</th>
                                <th className="text-center col-md-3">Price</th>
                                <th className="text-center col-md-3">Total</th>
                                <th className="text-center col-md-3"> </th>
                            </tr>
                        </thead>
                        <tbody>
                        {carts && carts.map((cart) => (
                            <tr style={{ borderBottom: '1px solid' }} onClick={() => handleRowClick(cart.book.id)}>
                                <td>
                                    <div className="row">
                                        <div className="col col-md-4">
                                            <img
                                                className="media-object"
                                                src={cart.book.imgName && require(`../assets/images/${cart.book.imgName}`)}
                                                style={{ width: '72px', height: '72px' }}
                                                alt="Product Image"
                                            />
                                        </div>

                                        <div className="col">
                                            <p className="mb-1 mt-2" style={{ textAlign: 'left' }}>{cart.book.title}</p>
                                            <p style={{ textAlign: 'left' }}>{cart.book.author}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <strong>{cart.quantity}</strong>
                                </td>
                                <td className="text-center">
                                    <strong>${cart.book.price}</strong>
                                </td>
                                <td className="text-center">
                                    <strong>${cart.quantity * cart.book.price}</strong>
                                </td>
                                <td>
                                    <button className="btn btn-danger" style={{ background: '#a50b0b' }} onClick={() => deleteCart(cart.book, cart.quantity)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <div className="col col-md-9"></div>
                    <div className="col col-md-3 d-flex justify-content-between" style={{ borderBottom: '1px solid' }}>
                        <h4><strong>Subtotal:</strong></h4>
                        <h5>${subtotal}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart;
