import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });

  const { name, email, password, passwordConfirm, phoneNumber } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/images.png");

  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    phoneNumber: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.user
  );

  const validateEmail = (val) => {
    if (!val || val.trim() === "") {
      return "Please enter a valid email";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePhoneNumber = (val) => {
    if (!val || val.trim() === "") {
      return "Please enter a valid phone number";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(val.trim())) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  // Show registration errors via toast
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  //useEffect to handle redirection
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "phoneNumber") {
      setErrors((prev) => ({ ...prev, phoneNumber: validatePhoneNumber(value) }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const phoneErr = validatePhoneNumber(phoneNumber);

    setTouched({ email: true, phoneNumber: true });
    setErrors({ email: emailErr, phoneNumber: phoneErr });

    if (emailErr && phoneErr) {
      toast.error("Please enter a valid email and valid phone number", {
        position: "bottom-right",
      });
      return;
    }

    if (emailErr) {
      toast.error("Please enter a valid email", { position: "bottom-right" });
      return;
    }

    if (phoneErr) {
      toast.error("Please enter a valid phone number", {
        position: "bottom-right",
      });
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match", { position: "bottom-right" });
      return;
    }

    const userData = {
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
      avatar: avatar === "" ? "/images/images.png" : avatar,
    };

    dispatch(register(userData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });

      if (name === "email") {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      } else if (name === "phoneNumber") {
        setErrors((prev) => ({ ...prev, phoneNumber: validatePhoneNumber(value) }));
      }
    }
  };

  return (
    <>
      <div className="row wrapper">
        <div className="col-10 col-lg-5 registration-form">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>
            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                name="email"
                value={email}
                onChange={onChange}
                onBlur={handleBlur}
              ></input>
              {touched.email && errors.email && (
                <small className="text-danger d-block mt-1">{errors.email}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="passwordConfirm_field">Password Confirm</label>
              <input
                type="password"
                id="passwordConfirm_field"
                className="form-control"
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={onChange}
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber_field">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber_field"
                className={`form-control ${touched.phoneNumber && errors.phoneNumber ? "is-invalid" : ""}`}
                name="phoneNumber"
                placeholder="10 digit phone number"
                value={phoneNumber}
                onChange={onChange}
                onBlur={handleBlur}
              ></input>
              {touched.phoneNumber && errors.phoneNumber && (
                <small className="text-danger d-block mt-1">{errors.phoneNumber}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="image/*"
                    onChange={onChange}
                  ></input>
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
