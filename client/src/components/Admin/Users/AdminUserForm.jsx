import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";

import * as Yup from "yup";
import { useCreateUser } from "../../../api/users";
import { useGetUser } from "../../../api/protected";

const initialValues = { username: "", email: "", password: "", roles: "" };

const AdminUserForm = ({ setView }) => {
  const [values, setValues] = useState(initialValues);
  const [errorView, setErrorView] = useState(false);

  const token = sessionStorage.getItem("token");
  const activeUser = useGetUser(token);

  let flag = true;
  if (!activeUser?.data.roles.includes("admin")) flag = false;

  const { mutateAsync, error } = useCreateUser();

  const handleErrors = (error) => {
    if (error.msg.includes("Email")) setErrorView({ email: true, msg: error.msg });
    if (error.msg.includes("Username")) setErrorView({ username: true, msg: error.msg });
    if (error.msg.includes("password")) setErrorView({ password: true, msg: data.msg });
    if (error.msg.includes("Role")) setErrorView({ roles: true, msg: data.msg });
    setTimeout(() => setErrorView(false), 2000);
  };

  return (
    <div className=" absolute inset-0 flex justify-center items-center ">
      <Formik
        initialValues={values}
        validationSchema={Yup.object({
          username: Yup.string().min(5, "Minimum 5 characters").required("Username is required"),
          email: Yup.string().min(5, "Minimum 5 characters").email().required("Email is required"),
          password: Yup.string().min(5, "Minimum 5 characters").required("Password is required"),
          roles: Yup.string().required("Roles is required"),
        })}
        onSubmit={async (values, actions) => {
          try {
            values.roles = [values.roles];
            if (values.roles.includes("admin")) values.roles.push("moderator");
            await mutateAsync({ values, token });
          } catch (error) {
            handleErrors(error);
          } finally {
            actions.setFieldValue("roles", values.roles[0]);
            setView({ users: true, flag: true });
          }
        }}
      >
        {({ handleSubmit, values }) => (
          <Form
            onSubmit={handleSubmit}
            autoComplete="off"
            className=" w-4/6 md:w-2/6 bg-slate-500 px-5 py-5 shadow-md shadow-slate-800 rounded-md"
          >
            <h1 className="text-center text-2xl font-bold text-slate-50 mt-2">Create User</h1>
            <div className="h-16">
              <label htmlFor="username" className="block w-100 mt-4 text-sm text-slate-50 ">
                Username
              </label>
              <Field name="username" id="username" placeholder="Username" className="rounded px-2 py-1 w-full"></Field>
              <ErrorMessage component="p" className="text-pink-700 text-sm" name="username" />
              {errorView?.username && <p className="text-pink-700 text-sm">{error.msg}</p>}
            </div>
            <div className="h-16 mt-1">
              <label htmlFor="email" className="block w-100 text-sm text-slate-50">
                Email
              </label>
              <Field name="email" id="email" placeholder="Email" className="rounded px-2 py-1 w-full"></Field>
              <ErrorMessage component="p" className="text-pink-700 text-sm" name="email" />
              {errorView?.email && <p className="text-pink-700 text-sm">{error.msg}</p>}
            </div>
            <div className="h-16 mt-1">
              <label htmlFor="password" className="block w-100 text-sm text-slate-50">
                Password
              </label>
              <Field
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                className="rounded px-2 py-1 w-full"
              />
              <ErrorMessage component="p" className="text-pink-700 text-sm" name="password" />
            </div>
            <div className="h-20 mt-1">
              <label htmlFor="roles" className="block w-100 text-sm text-slate-50">
                Roles
              </label>
              <Field as="select" name="roles" id="roles" className="rounded px-2 py-1 w-full">
                <option value="">Seleccione un rol</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </Field>
              <ErrorMessage component="p" className="text-pink-700 text-sm" name="roles" />
              {errorView?.role && <p className="text-pink-700 text-sm">{error.msg}</p>}
            </div>
            {flag && (
              <button
                type="submit"
                className="px-3 py-1 w-full font-bold rounded-md bg-pink-800 hover:bg-pink-600 text-slate-50 mt-3"
              >
                Send
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminUserForm;
