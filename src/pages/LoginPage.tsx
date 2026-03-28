import { useLoginUserApiMutation } from "@/features/auth/authApi";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/features/auth/auth.types";
import { login } from "@/features/auth/auth";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type LoginSchemaType, loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "antd";
function Login() {
  const [loginUserApi, { isLoading}] = useLoginUserApiMutation();
  const dispatch = useAppDispatch();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginSchemaType) => {
    try {
      const res = await loginUserApi(data).unwrap();
      dispatch(
        login({ user: res?.data?.user, accessToken: res.data.accessToken }),
      );
      toast.success("Login successfully");
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  return (
    <div className="flex items-center  justify-center h-full dark:bg-gray-950">
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <Card className="w-96 h-[50%] ">
              <CardHeader className="flex justify-between items-center ">
                <CardTitle>Login</CardTitle>
                <Link to="/register">
                  <Button >Sigup</Button>
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          className={`${!fieldState.error ? "mb-4" : "mb-0"}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-5">
                <Button className="w-full" htmlType="submit"  type="primary" disabled={isLoading}>
                  {isLoading ? "Logging in " : "Login"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default Login;
