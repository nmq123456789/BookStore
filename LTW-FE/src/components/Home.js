import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Home(props) {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const role = localStorage.getItem("role");

    const handleLogout = (event) => {
        const token = localStorage.getItem("token");
        if (token && role === "ADMIN") {
            if (window.confirm('Bạn có chắc chắn đăng xuất?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('id');
                localStorage.removeItem('email');
            }
            else {
                event.preventDefault();
            }
        }
    };

    const onViewClick = (pBookCode) => {
        navigate(`/book/${pBookCode}`);
    }

    const onDeleteClick = (pBookCode) => {
        const token = localStorage.getItem("token");
        if (window.confirm('Bạn có chắc chắn muốn xoá không?')) {
            axios.delete(`http://localhost:8080/api/delete/${pBookCode}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(() => {
                    setBooks(books.filter(book => book.bookcode != pBookCode));
                })
                .catch(error => {
                    console.log(`An error occurred while deleting book with code ${pBookCode}:`, error);
                });
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        // console.log(token);
        if (token && role == "ADMIN") {
            // Nếu tồn tại token, tức là người dùng đã đăng nhập
            setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
        }
        axios.get('http://localhost:8080/api/books', {
            // headers:{"Authorization": `Bearer ${token}`}
        })
            .then(data => {
                setBooks(data.data);
                // console.log(data.data)
            })
            .catch(err => console.log(err))
    }, [books])

    return (
        <div>
            <div className="row">
                <div className="col mt-2">
                    <form style={{ textAlign: 'left' }} action="http://localhost:8080/logout" >
                        <button className="btn" type="submit" onClick={handleLogout}><h3>{role === "ADMIN" ? role : "Login"}</h3></button>
                    </form>
                </div>
                <div className="col"><h2 className="text-center mt-3">Books List</h2></div>
                <div className="col"></div>
            </div>
            {isLoggedIn && ( // Hiển thị nút "Add" chỉ khi đã đăng nhập
                <div className="row-3 my-3">
                    <button className="btn btn-success" onClick={() => onViewClick(-1)}>
                        Add Book
                    </button>
                </div>
            )}
            <div className="row">
                <table className="table table-striped table-bordered mx-2">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Author</th>
                            <th>Title</th>
                            <th>Pages</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Description</th>
                            {/* <th>Sold</th> */}
                            <th width="12%">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.author}</td>
                                <td>{book.title}</td>
                                <td>{book.page}</td>
                                <td>{book.category}</td>
                                <td>{new Date(book.date).toLocaleDateString()}</td>
                                <td style={{textAlign: 'left'}}>{book.description}</td>
                                {/* <td>{book.sold}</td> */}
                                <td>
                                    {isLoggedIn ? (
                                        <>
                                            <button className="btn btn-primary" onClick={() => { onViewClick(book.id) }}>View</button>{" "}
                                            <button className="btn btn-danger" onClick={() => { onDeleteClick(book.id) }}>Delete</button>
                                        </>
                                    ) : (
                                        <span className="text-muted">Login to view actions</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home;