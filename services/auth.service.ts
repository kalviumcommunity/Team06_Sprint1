import { apiRequest } from "@/lib/api";

interface RegisterUserData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  place: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

export const registerUser = async (userData: RegisterUserData) => {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (userData: LoginUserData) => {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};