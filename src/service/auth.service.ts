export const authService = {
  login: async (email: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  },
  getUser:async()=>{
    const response=await fetch("/api/auth/me",{
        method:"GET",
        credentials:"include",
    })
    const data=await response.json()
    if(!response.ok){
     throw new Error(data.error || 'Failed to get user');
    }
    return data;
  },
  logout: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }

    return data;
  },
};
