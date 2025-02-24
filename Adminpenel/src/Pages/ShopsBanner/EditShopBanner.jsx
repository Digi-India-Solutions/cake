import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditShopBanner = () => {
    const [btnLoading ,setBtnLoading] = useState(false)
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                    <form className="row g-3">
                        <div className="col-md-4">
                            <label htmlFor="title" className="form-label">Banner Name</label>
                            <input type="text"  name='title' className="form-control" id="title" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="bannerImage" className="form-label">Banner Image</label>
                            <input type="file"  name='bannerImage' className="form-control" id="bannerImage" />
                        </div>
                            <div className="col-4">
                                <img src='' alt="Category Preview" style={{ width: '100%', height: 'auto' }} />
                            </div>
                        <div className="col-12">
                            <div className="form-check">
                                <input className="form-check-input"  type="checkbox" name="active" id="active"/>
                                <label className="form-check-label" htmlFor="active">
                                    Active
                                </label>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            {/* <button type="submit" className="">Update Category</button> */}
                            <button type="submit" className={`${btnLoading ? 'not-allowed':'allowed'}`} >{btnLoading ? "Please Wait.." : "Update Banner"} </button>
                        </div>
                    </form>
            </div>
        </>
    );
};

export default EditShopBanner;
