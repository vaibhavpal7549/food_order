//Dispatching actions for user authentication and profile management

import API from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
} from "../slices/userSlice";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.errMessage || error.message || fallback;

//login action
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await API.post("/v1/users/login", {
      email,
      password,
    });

    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(getErrorMessage(error, "Login failed")));
  }
};

//register action
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await API.post("/v1/users/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });

    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(getErrorMessage(error, "Registration failed")));
  }
};

//load user action
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await API.get("/v1/users/me");

    dispatch(loginSuccess(data.user));
  } catch (error) {
    dispatch(loadUserFail(getErrorMessage(error, "Unable to load user")));
  }
};

//update profile action
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await API.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(getErrorMessage(error, "Profile update failed")));
  }
};

//update password action
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await API.put("/v1/users/password/update", passwords);

    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(getErrorMessage(error, "Password update failed")));
  }
};

//forgot password action
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());

    const { data } = await API.post("/v1/users/forgetPassword", email);

    dispatch(forgotPasswordSuccess(data.message));
  } catch (error) {
    dispatch(forgotPasswordFail(getErrorMessage(error, "Unable to send reset email")));
  }
};

//reset password action
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());

    const { data } = await API.patch(
      `/v1/users/resetPassword/${token}`,
      passwords
    );

    dispatch(resetPasswordSuccess(data.success));
  } catch (error) {
    dispatch(resetPasswordFail(getErrorMessage(error, "Password reset failed")));
  }
};


//logout action
export const logout = () => async (dispatch) => {
  try {
    await API.get("/v1/users/logout");

    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(getErrorMessage(error, "Logout failed")));
  }
};

