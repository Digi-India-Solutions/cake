import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBanner = () => {
    const [formData, setFormData] = useState({
        bannerName: '',
        bannerImage: null,
        bannerType: '',
        bannerStatus: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            bannerImage: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.bannerName || !formData.bannerImage || !formData.bannerType) {
            toast.error("All fields are required");
            return;
        }

        const submitData = new FormData();
        submitData.append('bannerName', formData.bannerName);
        submitData.append('bannerImage', formData.bannerImage);
        submitData.append('bannerType', formData.bannerType);
        submitData.append('bannerStatus', formData.bannerStatus ? "True" : "False");

        try {
            setIsLoading(true);
            const response = await axios.post('https://api.cakecrazzy.com/api/create-banner', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // //console.log(response)
           if(response.status===201){
            toast.success("Banner added successfully");
            navigate('/all-banners');
            setIsLoading(false)
           }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            toast.error("Failed to add banner");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Shop Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="bannerName" className="form-label">Shop Banner Name</label>
                        <input
                            type="text"
                            name="bannerName"
                            value={formData.bannerName}
                            onChange={handleChange}
                            className="form-control"
                            id="bannerName"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bannerImage" className="form-label">Shop Banner Image</label>
                        <input
                            type="file"
                            name="bannerImage"
                            className="form-control"
                            id="bannerImage"
                            onChange={handleImageChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bannerType" className="form-label">Banner Type</label>
                        <select
                            name="bannerType"
                            className="form-select"
                            id="bannerType"
                            value={formData.bannerType}
                            onChange={handleChange}
                            required
                        >
                            <option value="" selected disabled>Select Banner Type</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="bannerStatus"
                                id="bannerStatus"
                                checked={formData.bannerStatus}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="bannerStatus">
                                Active 
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? "Please Wait..." : "Add Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddBanner;
