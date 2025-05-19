import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import axiosInstance from "../config/axios.config";
import { LOGIN_FORM } from "../data";
import { IErrorResponse } from "../interfaces";
import { loginSchema } from "../validation";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
    // const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async data => {
    try {
      const {status,data:resData} = await axiosInstance.post("/auth/local",data)
      console.log(resData)
      console.log(data)
      if(status === 200){
        console.log("SUCCESS");
        toast.success("You will navigate to the login page after 2 seconds to login!", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        })
        localStorage.setItem('loggedInUser',JSON.stringify(resData))
        setTimeout(() => {
          // navigate("/")
          location.replace('/')
        },2000)
        }
      
      
    } catch (error) {
      // 3- Rejected => Field => (OPTIONAL)
      console.log(error);
      const errorObj = error as AxiosError<IErrorResponse>
      console.log(errorObj.response?.data);
      console.log(errorObj.response?.data.error.message);
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      })
      
    }finally{
      setIsLoading(false)
    }
  }

  // ** Renders
  const renderLoginForm = LOGIN_FORM.map(({ name, placeholder, type, validation }, idx) => (
    <div key={idx}>
      <Input type={type} placeholder={placeholder} {...register(name, validation)} />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
    </div>
  ));

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Login to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>No account?</span>
          <Link to={"/register"} className="underline text-indigo-600 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
