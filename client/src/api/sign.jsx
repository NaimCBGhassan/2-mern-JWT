import { useMutation, useQuery, useQueryClient } from "react-query";

import axios from "axios";

/*SignIn*/

export const axiosSignIn = async (values) => {
  try {
    const res = await axios.post("/api/auth/signin", values);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

/*SignUp -- Create Users*/
const axiosSignUp = async ({ values, token }) => {
  try {
    return await axios.post("/api/users", values, { headers: { Authorization: token } });
  } catch (error) {
    throw error.response.data;
  }
};

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation(axiosSignUp, {
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });
}

/*Get users */

const axiosGetUsers = async (token) => {
  try {
    const res = await axios.get("/api/users", { headers: { Authorization: token } });
    return res?.data;
  } catch (error) {
    return error;
  }
};

export function useGetUsers(token) {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => axiosGetUsers(token),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 1,
  });
}

/*Update Users*/
const axiosUpdateUsers = async ({ values, id, token }) => {
  try {
    return axios.put(`/api/users/${id}`, values, { headers: { Authorization: token } });
  } catch (error) {
    return error.response.data;
  }
};

export function useUpdateUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: axiosUpdateUsers,
    onSuccess: async () => await queryClient.invalidateQueries(["users"]),
  });
}

/*Delete Users*/
const axiosDeleteUsers = async ({ id, token }) => {
  try {
    return await axios.delete(`/api/users/${id}`, { headers: { Authorization: token } });
  } catch (error) {
    return error.response.data;
  }
};

export function useDeleteUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: axiosDeleteUsers,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["users"]);
    },
  });
}
