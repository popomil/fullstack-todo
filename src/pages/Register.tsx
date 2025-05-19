import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import {  registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate()
  const [isLoading,setIsLoading]=useState(false)
  const { register, handleSubmit,formState:{errors } } = useForm<IFormInput>({
    resolver:yupResolver(registerSchema)
  })
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
  console.log(data)
  setIsLoading(true)
  try {
    // Fulfilled => SUCCESS => (OPTIONAL)
    const {status} = await axiosInstance.post("/auth/local/register",data)
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
      setTimeout(() => {
        navigate("/login")
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
  console.log(errors)
  interface IFormInput {
    username:string;
    email:string;
    password:string;
  }
  // ** Renders  
  const handlerForm = REGISTER_FORM.map(({name,type,placeholder,validation},inx) => (
    <div key={inx}>
    <Input type={type} placeholder={placeholder} {...register(name,validation)}/>
          {errors[name] && <InputErrorMessage msg={errors[name]?.message}/>}
          {errors?.username && errors.username.type === "minLength" && <InputErrorMessage msg="Username shuold be at-least 5 characters."/> }
    </div>

  ))

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">Register to get access!</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {handlerForm}
        <Button fullWidth isLoading={isLoading}>
          {isLoading? "Loading...":"Register"}</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
