import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProductTag = () => {
  const { id } = useParams(); // Get the product tag ID from the URL
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    tagHeading: "",
    sortDescription: "",
    image: null,
    multipulProduct: [],
    priceRange: [],
  });

  const navigate = useNavigate();

  // Fetch product tag data
  useEffect(() => {
    const fetchProductTag = async () => {
      try {
        const tagResponse = await axios.get(
          `https://api.cakecrazzy.com/api/single-producttag/${id}`
        );
        const productResponse = await axios.get(
          "https://api.cakecrazzy.com/api/all-product"
        );
        setProducts(productResponse.data.data || []);

        const tagData = tagResponse.data.data || {};
        setFormData({
          tagHeading: tagData.tagHeading || "",
          sortDescription: tagData.sortDescription || "",
          image: null,
          multipulProduct: tagData.multipulProduct || [],
          priceRange: tagData.priceRange || [],
        });

        // Pre-select products
        const preSelectedProducts = productResponse.data.data.filter(
          (product) => tagData.multipulProduct.includes(product._id)
        );
        setSelectedProducts(preSelectedProducts);
      } catch (error) {
        toast.error("Failed to fetch product tag data");
      }
    };
    fetchProductTag();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    if (selectedProduct) {
      setSelectedProducts((prev) => [...prev, selectedProduct]);
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      setFormData((prev) => ({
        ...prev,
        multipulProduct: [...prev.multipulProduct, productId],
      }));
    }
  };

  const handleRemoveProduct = (productId) => {
    const removedProduct = selectedProducts.find(
      (product) => product._id === productId
    );
    if (removedProduct) {
      setProducts((prev) => [...prev, removedProduct]);
      setSelectedProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      setFormData((prev) => ({
        ...prev,
        multipulProduct: prev.multipulProduct.filter((id) => id !== productId),
      }));
    }
  };

  const handleAddPriceRange = () => {
    setFormData((prev) => ({
      ...prev,
      priceRange: [
        ...prev.priceRange,
        { priceMinimum: "", priceMaximum: "", priceRangeImage: null },
      ],
    }));
  };

  const handlePriceRangeChange = (index, field, value) => {
    const updatedPriceRange = [...formData.priceRange];
    updatedPriceRange[index][field] = value;
    setFormData((prev) => ({ ...prev, priceRange: updatedPriceRange }));
  };

  const handlePriceRangeImageChange = (index, file) => {
    const updatedPriceRange = [...formData.priceRange];
    updatedPriceRange[index].priceRangeImage = file;
    setFormData((prev) => ({ ...prev, priceRange: updatedPriceRange }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tagHeading", formData.tagHeading);
      formDataToSend.append("sortDescription", formData.sortDescription);
      formDataToSend.append("image", formData.image);
      formDataToSend.append(
        "multipulProduct",
        JSON.stringify(formData.multipulProduct)
      );
      formDataToSend.append("priceRange", JSON.stringify(formData.priceRange));

      const response = await axios.put(
        `https://api.cakecrazzy.com/api/update-producttag/${id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Product tag updated successfully");
      navigate("/product-tags");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product tag");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Product Tag</h4>
        </div>
        <div className="links">
          <Link to="/all-product-tag" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Tag Heading</label>
            <input
              type="text"
              name="tagHeading"
              className="form-control"
              value={formData.tagHeading}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Sort Description</label>
            <input
              type="text"
              name="sortDescription"
              className="form-control"
              value={formData.sortDescription}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tag Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Select Products</label>
            <select
              name="multipulProduct"
              className="form-control"
              onChange={handleProductSelect}
            >
              <option value="">Choose a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 mt-4">
            <h5 className="mb-3">Selected Products:</h5>
            {selectedProducts.length > 0 ? (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td>{product.productName}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveProduct(product._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No products selected yet.</p>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Price Range</label>
            {formData.priceRange.map((range, index) => (
              <div key={index} className="row g-2 align-items-center">
                <div className="col-md-3">
                  <input
                    type="number"
                    placeholder="Minimum Price"
                    className="form-control"
                    value={range.priceMinimum}
                    onChange={(e) =>
                      handlePriceRangeChange(
                        index,
                        "priceMinimum",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    placeholder="Maximum Price"
                    className="form-control"
                    value={range.priceMaximum}
                    onChange={(e) =>
                      handlePriceRangeChange(
                        index,
                        "priceMaximum",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      handlePriceRangeImageChange(index, e.target.files[0])
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleAddPriceRange}
            >
              Add Price Range
            </button>
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-success">
              {isLoading ? "Updating..." : "Update Product Tag"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProductTag;
