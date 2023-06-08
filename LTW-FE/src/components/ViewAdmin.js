import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ViewAdmin.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function ViewAdmin(props) {
    const params = useParams();
    const [book, setBook] = useState({});
    const bookcode = params.bookcode;
    const navigate = useNavigate();
    const [img, setImg] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const fileInputRef = useRef(null);

    const isAddMode = false;

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year }-${ month }-${ day }`;
    };

    const handleImageUpload = (event) => {
        setImg(event.target.files[0]);
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleButtonClick = () => {
        if (isEditMode || bookcode < 0) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = handleImageUpload;
            input.click();
        }
    };

    const onSaveClick = (event) => {
        const formData = new FormData();
        formData.append("book", JSON.stringify(book));
        formData.append("img", img);

        console.log(book);
        const token = localStorage.getItem("token");

        if (!book.title || !book.author || !book.date) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if(bookcode == -1 && window.confirm("Bạn có chắc chắn thêm sản phẩm này không")){
            axios.post(`http://localhost:8080/api/book/save/${bookcode}`, formData,{
                headers:{"Authorization": `Bearer ${token}`, "Content-Type":"multipart/formData"}
            })
            .then(response => {
                if (response.status === 200) {
                    navigate("/books");
                    // alert('Thêm thành công.');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    alert('Trùng tên và giả.');
                }
            });
        }
        else{
            event.preventDefault();
        }

        if (bookcode != -1 && window.confirm("Bạn có chắc chắn thay đổi thông tin sản phẩm này không")) {
            axios.put(`http://localhost:8080/api/book/save/${bookcode}`, formData,{
                headers:{"Authorization": `Bearer ${token}`,  "Content-Type":"multipart/formData"}
            })
            .then(response => {
                if (response.status === 200) {
                    navigate("/books");
                    // alert('Sửa thành công.')
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    alert('Trùng tên và giả.');
                }
            });
        }
        else{
            event.preventDefault();
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:8080/api/book/${bookcode}`, {
            headers:{"Authorization": `Bearer ${token}`}

        })           
            .then(data => {
                if(bookcode  != -1)  setBook({ ...data.data, date: formatDate(data.data.date) });
            })
            .catch(err => console.log(err));
    }, [bookcode]);
    

    return (
        <div className="container my-5">
            <div className="border rounded-3 shadow-lg bg-white">
                <div className="form-group">
                    <h1>Sách</h1>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="content">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="text-start required">Tiêu đề</label>
                                                <input
                                                    value={book.title ? book.title : ""}
                                                    onChange={(e) => setBook({ ...book, title: e.target.value })}
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    disabled={bookcode > 0 ? !isEditMode : isEditMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="text-start required">Tác giả</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    disabled={bookcode > 0 ? !isEditMode : isEditMode}
                                                    value={book.author ? book.author : ""}
                                                    onChange={(e) => setBook({ ...book, author: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-start">Mô tả</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            style={{ height: "150px" }}
                                            value={book.description ? book.description : ""}
                                            onChange={(e) => setBook({ ...book, description: e.target.value })}
                                            disabled={bookcode > 0 ? !isEditMode : isEditMode}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="text-start required" htmlFor="releaseDate">Ngày phát hành</label>
                                                <input
                                                    type="date"
                                                    id="releaseDate"
                                                    className="form-control"
                                                    required
                                                    value={book.date ? book.date : ""}
                                                    onChange={(e) => setBook({ ...book, date: e.target.value })}
                                                    disabled={bookcode > 0 ? !isEditMode : isEditMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="text-start arrow-label" htmlFor="pageNumber">Số trang</label>
                                                <input
                                                    type="number"
                                                    id="pageNumber"
                                                    className="form-control"
                                                    value={book.page ? book.page : ""}
                                                    onChange={(e) => setBook({ ...book, page: e.target.value })}
                                                    disabled={bookcode > 0 ? !isEditMode : isEditMode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Thể loại</label>
                                                <select
                                                    className="form-select"
                                                    value={book.category ? book.category : ""}
                                                    onChange={(e) => setBook({ ...book, category: e.target.value })}
                                                    disabled={bookcode > 0 ? !isEditMode : isEditMode}
                                                >
                                                    <option>Kinh dị</option>
                                                    <option>Hành động</option>
                                                    <option>Tình cảm</option>
                                                    <option>Trinh thám</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="upload">
                                    <button type="button" className="btn btn-primary upload-button" onClick={handleButtonClick}>
                                        Upload
                                    </button>
                                    {isEditMode && (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                style={{ display: "none" }}
                                            />
                                        </>
                                    )}
                                    {img == null && book.imgName && (
                                        <img
                                            src={require("../assets/images/"+ book.imgName)}
                                            alt="Ảnh được chọn"
                                            className="img-fluid"
                                        />
                                    )}
                                    {img && (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="Ảnh được chọn"
                                            className="img-fluid"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <div className="container">
                                <div className="button-container">
                                    {bookcode > 0 && !isEditMode && (
                                        <button className="btn btn-danger mr-2" onClick={handleEditClick}>
                                            Edit
                                        </button>
                                    )}

                                    {bookcode > 0 && isEditMode && (
                                        <button onClick={onSaveClick} className="btn btn-primary">
                                            Save
                                        </button>
                                    )}

                                    {bookcode < 0 && (
                                        !isAddMode && <button type="submit" onClick={onSaveClick} className="btn btn-success mr-2">Add</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default ViewAdmin;