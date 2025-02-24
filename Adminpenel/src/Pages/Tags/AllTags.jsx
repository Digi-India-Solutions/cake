import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllTags = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tags from the backend
  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://api.cakecrazzy.com/api/get-tags");
      // //console.log(response)
      setTags(response.data.data); // Assuming the response data is an array of tags
    } catch (error) {
      toast.error("Error fetching tags!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete tag
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this tag!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://api.cakecrazzy.com/api/delete-tags/${id}`);
          fetchTags(); // Refresh the tags list after deletion
          Swal.fire("Deleted!", "Your tag has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "There was an issue deleting the tag.", "error");
        }
      }
    });
  };

  // Use effect to fetch data on mount
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Tags</h4>
        </div>
        <div className="links">
          <Link to="/add-tag" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <div className="filteration">
        <div className="selects">
          {/* You can add sorting dropdown here if needed */}
        </div>
        <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input type="text" name="search" id="search" />
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Name</th>
              <th scope="col">Color</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : tags.length > 0 ? (
              tags.map((tag, index) => (
                <tr key={tag._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{tag.tagName}</td>
                  <td>
                    <div
                      className="circle-color"
                      style={{ backgroundColor: tag.tagColor }}
                    ></div>
                  </td>
                  <td>
                    <Link to={`/edit-tag/${tag._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(tag._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No tags found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllTags;
