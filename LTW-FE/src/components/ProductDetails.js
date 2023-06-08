import React, { useState, useRef, useEffect, createElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ViewAdmin.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Rating from 'react-rating';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

function ProductDetails(props) {
    const params = useParams();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const bookcode = params.bookcode;
    const [book, setBook] = useState({});
    const navigate = useNavigate();
    const [comments, setComments] = useState({});
    const [addcomment, setAddcomment] = useState('');
    const [editcommentt, setEditcomment] = useState({});
    const [editingId, setEditingId] = useState(null);
    const userIdd = parseInt(localStorage.getItem('id'), 10);
    const [binhluan, setBinhLuan] = useState(false);
    const [danhgia, setDanhGia] = useState(true);
    const [vote, setVote] = useState(0);

    const calculatorRating = () => {
        if (!Array.isArray(comments) || comments.length === 0) return 0;
        const totalRating = comments.reduce((sum, cmt) => sum + cmt.rating, 0);
        return totalRating / comments.length;
    };
    

    const fixComment = (commentId, comment) => {
        setEditingId(commentId);
        setEditcomment(comment);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const BinhLuan = () => {
        setBinhLuan(true);
        setDanhGia(false);
    }

    const DanhGia = () => {
        setDanhGia(true);
        setBinhLuan(false);
    }

    const shoppingCart = () => {
        navigate('/shoppingCart')
    }

    const formatDate = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleString("vi-VN", {
            month: "long",
            day: "2-digit",
            year: "numeric",
        });
    }


    const formatDate1 = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
    };

    const [quantity, setQuantity] = useState(1);

    const addCart = () => {
        const userId = localStorage.getItem('id');

        const newCart = {
            user: { id: userId },
            book: { id: book.id },
            quantity: quantity
        };
        
        if(token){
            axios.post(`http://localhost:8080/api/carts/${userId}`, newCart, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(response => {
                console.log('Cart added successfully:', response.data);
                navigate("/shoppingCart")
            })
            .catch(error => {
                console.error('Error adding cart:', error);
            });
        }
        else{
            if (window.confirm('Bạn cần đăng nhập để đặt mua sản phẩm')) {
                navigate("/login");
            }
        } 
    }

    const createComment = () => {
        const userId = localStorage.getItem('id');

        const comment = {
            comment: addcomment,
            "rating": vote
        };

        if (token && window.confirm('Bạn có chắc chắn thêm bình luận này không?')) {
            axios.post(`http://localhost:8080/api/comment/${bookcode}/${userId}`, comment, {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(response => {
                    console.log('added successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error adding cart:', error);
                });
            setAddcomment('')
            setVote(0)
        }else{
            if (window.confirm('Bạn cần đăng nhập để bình luận')) {
                navigate("/login");
            }
        }
    }

    const editComment = (idComment) => {
        const comment = {
            comment: editcommentt
        };
        if (window.confirm('Bạn có chắc chắn chỉnh sửa bình luận này không?')) {
            axios.put(`http://localhost:8080/api/comments/${idComment}`, comment, {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(response => {
                    console.log('Cart added successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error adding cart:', error);
                });

            setEditingId(null);
        }
    }

    const deleteComment = (idComment) => {
        if (window.confirm('Bạn có chắc chắn xoá bình luận này không?')) {
            axios.delete(`http://localhost:8080/api/comments/${idComment}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(response => {
                    console.log('Cart added successfully:', response.data);
                })
                .catch(error => {
                    if (window.confirm('Bạn cần đăng nhập để bình luận')) {
                        navigate("/login");
                    }
                    console.error(error);
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
        axios.get(`http://localhost:8080/api/book/${bookcode}`, {

        })
            .then(data => {
                setBook({ ...data.data, date: formatDate1(data.data.date) });
                // console.log(data.data);
            })
            .catch(err => console.log(err));

        axios.get(`http://localhost:8080/api/comments/${bookcode}`, {
            // headers:{"Authorization": `Bearer ${token}`}
        })
            .then(data => {
                setComments(data.data)
                // console.log(data.data);
            })
            .catch(err => console.log(err));
    }, [comments]);

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
                                <a className="underline-red btn btn-link nav-link text-black" onClick={handleLogout}>{role ? role : "Login"}</a>
                            </li>
                        </ul>
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
            <div className="container my-5">
                <div>
                    {/* className="border rounded-3 shadow-lg bg-white" */}
                    <div className="form-group">
                        {/* <h3>{book.title ? book.title : ""}</h3> */}
                        <div className="row">
                            <div className="col-md-5 mx-4"
                                style={{
                                    backgroundImage: book.imgName && `url(${require('../assets/images/' + book.imgName)})`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: '450px'   
                                    // width: '100%'
                                    
                                }}
                            >
                            </div>
                            <div className="col-md-6">
                                <div className="content">
                                    <div className="row" style={{ borderBottom: '1px solid #e6e6e6' }}>
                                        <div className="form-group">
                                            <h3>{book.title ? book.title : ""}</h3>
                                            <div>
                                                    <Rating
                                                        initialRating={calculatorRating()}
                                                        emptySymbol={<FaStar className="star-empty" />}
                                                        fullSymbol={<FaStar className="star-full" />}
                                                        halfSymbol={<FaStarHalfAlt className="star-half" />}
                                                        readonly
                                                    />
                                                <span> {comments.length} Đánh giá | Đã bán: 0 </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row"
                                        style={{ borderBottom: '1px solid #e6e6e6', paddingTop: '13px' }}
                                    >
                                        <div className="form-group">
                                            <h3 style={{ color: '#d51c24' }}>{book.price ? book.price : ""}₫</h3>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-7">
                                            <div className="form-group">
                                                <ul className="px-2">
                                                    <li className="mb-2">Tác giả: {book.author ? book.author : ""}</li>
                                                    <li className="mb-2">Thể loại: {book.category ? book.category : ""}</li>
                                                    <li className="mb-2">Số trang: {book.page ? book.page : ""}</li>
                                                    <li>Ngày phát hành: {book.date ? book.date : ""}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <label className="text-start"><strong>Số lượng:</strong></label>
                                                <input
                                                    type="number"
                                                    style={{ textAlign: 'center' }}
                                                    className="form-control"
                                                    min={1}
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {(!role || role === 'USER') && (
                                        <div className="col d-flex justify-content-center mt-3">
                                            <button
                                                className="btn btn btn-success text-black"
                                                onClick={addCart}
                                                style={{ width: '200px', fontSize: '18px' }}
                                            >
                                                Thêm vào giỏ {" "}
                                                <span className="shopping-cart">
                                                    <i className="bi bi-cart-plus"></i>
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="footer mt-4 row">
                            <div className="container">
                                <div className="button-container"
                                    style={{ backgroundColor: 'rgba(213, 28, 36, 0.5)', justifyContent: 'start' }}>
                                    <button className="btn active"
                                        onClick={() => DanhGia()}
                                        style={{ backgroundColor: danhgia ? '#d51c24' : '' }}
                                    >
                                        Mô tả
                                    </button>
                                    <button className="btn active"
                                        onClick={() => BinhLuan()}
                                        style={{ backgroundColor: binhluan ? '#d51c24' : '' }}
                                    >
                                        <span>Bình luận {comments.length}</span>
                                    </button>
                                </div>
                                {danhgia && (
                                    <div className="container border">
                                        <p className="mt-3" style={{ textAlign: 'left' }}>{book.description}</p>
                                    </div>
                                )}

                                {binhluan && (
                                    <div className="container mt-2 border p-3">
                                        <div className="d-flex flex-start">
                                            <img className="rounded-circle shadow-1-strong me-3" src={require("../assets/images/avt.png")} alt="avatar" width="40" height="40" />
                                            <div className="w-100">
                                                <h5 style={{ textAlign: 'left' }}>Thêm bình luận</h5>
                                                <div className="mx-1 mb-2" style={{ textAlign: 'left' }}>
                                                    <Rating
                                                        initialRating={vote}
                                                        emptySymbol={<FaStar className="star-empty" />}
                                                        fullSymbol={<FaStar className="star-full" />}
                                                        halfSymbol={<FaStarHalfAlt className="star-half" />}
                                                        onChange={newVote => setVote(newVote)}
                                                    />
                                                </div>
                                                <div className="form-outline">
                                                    {/* <label className="form-label" htmlFor="textAreaExample" >What is your view?</label> */}
                                                    <textarea
                                                        className="form-control"
                                                        id="textAreaExample"
                                                        rows="2"
                                                        value={addcomment}
                                                        onChange={(e) => setAddcomment(e.target.value)}
                                                    ></textarea>
                                                </div>
                                                <div className="d-flex justify-content-end mt-3">
                                                    <button type="button" className="btn btn-primary" onClick={() => createComment()}>
                                                        Đăng <i className="bi bi-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {comments.length > 0 ? (
                                            <div>
                                                {comments.map(comment => (comment && (
                                                    <div key={comment.id} className="d-flex flex-start mb-4 mt-3">
                                                        <img className="rounded-circle shadow-1-strong me-3"
                                                            src={require("../assets/images/avt.png")} alt="avatar" width="40"
                                                            height="40" />

                                                        <div style={{ width: '100%' }}>
                                                            {editingId === comment.id ? (
                                                                <div className="row">
                                                                    <div className="form-outline">
                                                                        <textarea
                                                                            className="form-control"
                                                                            rows="2"
                                                                            value={editcommentt}
                                                                            onChange={(e) => setEditcomment(e.target.value)}
                                                                        ></textarea>
                                                                    </div>
                                                                    <div className="d-flex justify-content-end mt-3">
                                                                        <button
                                                                            className="btn btn-danger"
                                                                            onClick={() => cancelEdit(comment.id)}
                                                                        >Huỷ
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary"
                                                                            onClick={() => editComment(comment.id)}
                                                                        >Đăng
                                                                            <i className="bi bi-arrow-right"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            ) : (
                                                                <div>
                                                                    <h6 className="fw-bold mb-1" style={{ textAlign: 'left' }}>{comment.user.email} {" "}
                                                                        <Rating
                                                                            initialRating={comment.rating}
                                                                            emptySymbol={<FaStar className="star-empty" />}
                                                                            fullSymbol={<FaStar className="star-full" />}
                                                                            halfSymbol={<FaStarHalfAlt className="star-half" />}
                                                                            readonly = { true }

                                                                        />
                                                                    </h6>
                                                                    <div className="d-flex align-items-center">
                                                                        <p className="mb-0">
                                                                            {formatDate(comment.date)}
                                                                        </p>
                                                                        {comment.user.id === userIdd && (
                                                                            <button className="btn p-0" onClick={() => fixComment(comment.id, comment.comment)}><i className="bi bi-pencil-fill"></i></button>
                                                                        )}

                                                                        {role === 'ADMIN' || comment.user.id === userIdd ? (
                                                                            <button className="btn p-0" onClick={() => deleteComment(comment.id, comment.user.id)}>
                                                                                <i className="bi bi-trash"></i>
                                                                            </button>
                                                                        ) : null}
                                                                    </div>
                                                                    <p className="mb-0" style={{ textAlign: 'left' }} >
                                                                        {comment.comment}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )))}
                                            </div>
                                        ) : (
                                            <p></p>
                                        )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default ProductDetails;