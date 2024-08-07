import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddProductPage = () => {
  const userData = useSelector((state) => state.userReducer.userInfo);
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [productinfo, setProductinfo] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
    rating: {
      rate: "",
      count: "",
    },
  });
  const [error, setError] = useState("");

  const validateForm = () => {
    // Define validation rules
    const validations = {
      title: {
        required: true,
      },
      category: {
        required: true,
      },
      price: {
        required: true,
        isNumeric: true,
        min: 0,
      },
      description: {
        required: true,
        minLength: 10,
      },
      image: {
        required: true,
        isUrl: true,
      },
      rating: {
        rate: {
          required: true,
          isNumeric: true,
          min: 0,
          max: 5,
        },
        count: {
          required: true,
          isNumeric: true,
          min: 0,
        },
      },
    };

    for (const field in validations) {
      if (validations.hasOwnProperty(field)) {
        const rules = validations[field];
        const value =
          field === "rating" ? productinfo.rating : productinfo[field];

        if (typeof value === "object") {
          for (const subField in value) {
            if (value.hasOwnProperty(subField)) {
              const subValue = value[subField];
              const subRules = rules[subField];

              if (subRules) {
                if (subRules.required && !subValue) {
                  setError(`Please provide ${subField}`);
                  return false;
                }

                if (subRules.isNumeric && isNaN(subValue)) {
                  setError(`${subField} should be a number`);
                  return false;
                }

                if (subRules.min && subValue < subRules.min) {
                  setError(`${subField} should be at least ${subRules.min}`);
                  return false;
                }

                if (subRules.max && subValue > subRules.max) {
                  setError(`${subField} should be at most ${subRules.max}`);
                  return false;
                }
              }
            }
          }
        } else {
          // For non-object fields
          if (rules.required && !value) {
            setError(`Please provide ${field}`);
            return false;
          }

          if (rules.minLength && value.length < rules.minLength) {
            setError(
              `${field} should be at least ${rules.minLength} characters long`
            );
            return false;
          }

          if (rules.isNumeric && isNaN(value)) {
            setError(`${field} should be a number`);
            return false;
          }

          if (rules.min && value < rules.min) {
            setError(`${field} should be at least ${rules.min}`);
            return false;
          }

          if (rules.max && value > rules.max) {
            setError(`${field} should be at most ${rules.max}`);
            return false;
          }

          if (rules.isUrl && !isValidUrl(value)) {
            setError(`${field} should be a valid URL`);
            return false;
          }
        }
      }
    }

    setError("");
    return true;
  };

  const isValidUrl = (url) => {
    // Regular expression to validate URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      const URL = process.env.REACT_APP_CLIENT_URL + "products";
      const response = await Axios.post(URL, productinfo);
      alert(response.data.message);

      // Clear productinfo after successful submission
      setProductinfo({
        title: "",
        category: "",
        price: "",
        description: "",
        image: "",
        rating: {
          rate: "",
          count: "",
        },
      });

      setError("");
    } catch (error) {
      console.log("error", error);
      if (error.response === undefined) {
        setError(error.message);
      } else {
        setError(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (userData?.role === "admin") {
      setIsAdmin(true);
    } else {
      navigate("*");
    }
  }, [userData, navigate]);

  return (
    <>
      <Navbar />
      {isAdmin === true ? (
        <div className="container my-3 py-3">
          <h1 className="text-center">Add Product</h1>
          <hr />
          <div className="row my-4 h-100">
            <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="form my-3">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text" // Change type from 'title' to 'text'
                    className="form-control"
                    id="title"
                    placeholder="Enter product title"
                    value={productinfo.title}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form my-3">
                  <label htmlFor="Price">Price</label>
                  <input
                    type="number" // Change type from 'price' to 'number'
                    className="form-control"
                    id="Price"
                    placeholder="Enter product price"
                    value={productinfo.price}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form my-3">
                  <label htmlFor="category">Category</label>
                  <select
                    className="form-control"
                    id="category"
                    value={productinfo.category}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select category</option>
                    <option value="men's clothing">Men's Clothing</option>
                    <option value="women's clothing">Women's Clothing</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="electronics">Electronics</option>
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="form my-3">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="text" // Change type from 'category' to 'text'
                    className="form-control"
                    id="image"
                    placeholder="Enter product image url"
                    value={productinfo.image}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        image: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form my-3">
                  <label htmlFor="rate">Rate</label>
                  <input
                    type="number" // Change type from 'rate' to 'number'
                    className="form-control"
                    id="rate"
                    placeholder="Enter product rate"
                    value={productinfo.rating.rate}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        rating: {
                          ...prevState.rating,
                          rate: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="form my-3">
                  <label htmlFor="count">Count</label>
                  <input
                    type="number" // Change type from 'count' to 'number'
                    className="form-control"
                    id="count"
                    placeholder="Enter product count"
                    value={productinfo.rating.count}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        rating: {
                          ...prevState.rating,
                          count: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="form my-3">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows={5}
                    className="form-control"
                    id="description"
                    placeholder="Enter product description"
                    value={productinfo.description}
                    onChange={(e) =>
                      setProductinfo((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="d-flex justify-content-evenly">
                  <button
                    className="my-2 px-4 mx-auto btn btn-dark"
                    type="submit"
                  >
                    Add
                  </button>
                  <button
                    className="my-2 px-4 mx-auto btn btn-dark"
                    type="button" // Change type from 'Cancel' to 'button'
                    onClick={() => navigate(-1)} // Navigate back
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {error && <p className="text-danger">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </>
  );
};

export default AddProductPage;
