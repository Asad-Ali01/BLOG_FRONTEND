import { useRegisterUserApiMutation } from "@/features/auth/authApi";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import { useAppDispatch} from "@/features/auth/auth.types";
import { register } from "@/features/auth/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegisterSchemaType,
  registerSchema,
} from "@/schemas/registerSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { Button } from "antd";
import { Input } from "@/components/ui/input";
function Register() {
  const [registerUserApi, { isLoading }] = useRegisterUserApiMutation();
  const dispatch = useAppDispatch();
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const handleRegister = async (data: RegisterSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("username",data.username);
      formData.append("password",data.password);
      formData.append("confirmPassword",data.confirmPassword);
      if(data.avatar){

        formData.append("avatar",data.avatar);
      }
      const res = await registerUserApi(formData).unwrap();
      dispatch(
        register({ user: res.data.user, accessToken: res.data.accessToken }),
      );
      toast.success("Successfully registered")
    } catch (err:any) {
      toast.error(err.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center h-full  dark:bg-gray-950">
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)}>
            <Card className="w-96 h-[50%] ">
              <CardHeader className="flex justify-between items-center ">
                <CardTitle>Signup</CardTitle>
                <Link to="/login">
                  <Button >Login</Button>
                </Link>
              </CardHeader>
              <CardContent className="grid gap-1">
              <FormField
              control={form.control}
              name="avatar"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Avatar photo</FormLabel>
                  <FormControl>
                    <Input
                   
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      field.onChange(file)
                    }}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
              />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm password"
                          type="password"
                          className={`${!fieldState.error ? "mb-4" : "mb-0"}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-5">
                <Button
                  className="w-full"
                  disabled={isLoading}
                  htmlType="submit"
                  type="primary"
                >
                  {isLoading ? "Registering" : "Create my account"}
                </Button>
             
             
              </CardFooter>
            </Card>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default Register;
