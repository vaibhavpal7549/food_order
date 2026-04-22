import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile, loadUser } from "../../redux/actions/userActions";
import { clearErrors, updateReset } from "../../redux/slices/userSlice";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, isUpdated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      window.alert(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      window.alert("User updated successfully");
      dispatch(loadUser());
      dispatch(updateReset());
      navigate("/users/me");
    }
  }, [dispatch, error, isUpdated, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name || user?.name || "");
    formData.set("email", email || user?.email || "");
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5 updateprofile">
        <form
          className="shadow-lg"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <h1 className="mt-2 mb-5">Update Profile</h1>

          <div className="form-group">
            <label htmlFor="name_field">Name</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              placeholder={user?.name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_field">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              placeholder={user?.email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar_upload">Avatar</label>

            <div className="d-flex align-items-center">
              <div>
                <figure className="avatar mr-3 item-rtl">
                  <img
                    src={avatarPreview || user?.avatar?.url || "/images/images.png"}
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
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Avatar
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-block py-3"
            disabled={loading}
          >
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
