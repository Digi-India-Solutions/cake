import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AllContactQuery = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://api.cakecrazzy.com/api/contacts");
      // //console.log(response);
      if (response.data.success) {
        setUsers(response.data.data); // Save the user data
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Delete a contact record
  const handleDelete = async (id) => {
    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://api.cakecrazzy.com/api/contact/${id}`
        );
        if (response.data.success) {
          // Remove the deleted user from the local state (UI update)
          setUsers(users.filter((user) => user._id !== id));
          Swal.fire("Deleted!", "The contact has been deleted.", "success");
        } else {
          console.error("Failed to delete contact:", response.data.message);
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
        Swal.fire(
          "Error!",
          "There was an issue deleting the contact.",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "The contact was not deleted.", "info");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Contact Query</h4>
        </div>
        <div className="links">
          {/* Additional links or actions can be placed here */}
        </div>
      </div>

      <section className="main-table">
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Subject</th>
                <th scope="col">Message</th>
                <th scope="col">Created At</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.subject}</td>
                    <td>{user.message}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bt delete"
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AllContactQuery;
