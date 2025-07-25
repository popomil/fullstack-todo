import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery{
  url:string;
  queryKey:string[];
  config?: AxiosRequestConfig;

}


const useCustomQuery= ({url,queryKey,config}:IAuthenticatedQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(url,config);
      return response.data;
    }
  });
  
}
export default useCustomQuery;
