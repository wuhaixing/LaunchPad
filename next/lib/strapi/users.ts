import { Credentials } from "@/types/types";

export async function localRegister(credentials: Credentials) {
    const url = new URL("/api/auth/local/register",  process.env.NEXT_PUBLIC_API_URL);
  
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...credentials }),
            cache: "no-cache",
        });
    
        return response.json();
    } catch (error) {
        console.error("Registration Service Error:", error);
    }
}
interface LoginUserProps {
    identifier: string;
    password: string;
}

export async function localLogin(userData: LoginUserProps) {
    const url = new URL("/api/auth/local", process.env.NEXT_PUBLIC_API_URL);
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
        cache: "no-cache",
      });
  
      return response.json();
    } catch (error) {
      console.error("Login Service Error:", error);
      throw error;
    }
}