'use server';

import { localRegister } from '@/lib/strapi/users';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { JWT } from "next-auth/jwt";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { isRedirectError } from 'next/dist/client/components/redirect';

const config = {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    domain: process.env.HOST ?? "localhost",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};
const BUSINESS_HOME = "/dashboard";

export async function signupAction(
    prevState: any,
    formData: FormData
  ) {
    const credentials = {
        email: formData.get("email"),
        password: formData.get("password"),
        confirm: formData.get("confirm")
    };
      
    const parsedCredentials = z.object({
        password: z
          .string()
          .min(8, { message: "Password must have at least 8 or more characters." })
          .max(100, { message: "Password must be between 8 and 100 characters." }),
        confirm: z.string(),
        email: z.string().email({ message: "Please enter a valid email address." })
       }).refine((data) => data.password === data.confirm, {
        message: "Please enter same password.",
        path: ["confirm"], // path of error
    }).safeParse(credentials);
  
    if (!parsedCredentials.success) {
        return {
          ...prevState,
          errors: parsedCredentials.error?.flatten().fieldErrors,
          message: "Your enteries are not valid, sign up failed！",
          data: credentials
        };
    }
      
    const { email, password } = parsedCredentials.data;
            
    try {
        //const hash = await bcrypt.hash(password,SALT_ROUNDS);
        const responseData = await localRegister({
          username: email,
          email:email,
          password:password
        });        
              
        if (!responseData) {
          return {
            ...prevState,
            errors: null,
            message: "系统出现异常，注册失败！",
          };
        }
              
        if (responseData.error) {
          return {
            ...prevState,
            error: responseData.error,
            message: "系统发现错误，注册失败！",
          };
        }
        console.dir(responseData,{depth:7});
        (await cookies()).set("jwt", responseData.jwt, config);
        redirect(BUSINESS_HOME);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const schemaLogin = z.object({
    identifier: z
      .string()
      .min(3, {
        message: "Identifier must have at least 3 or more characters",
      })
      .max(20, {
        message: "Please enter a valid username or email address",
      }),
    password: z
      .string()
      .min(8, {
        message: "Password must have at least 6 or more characters",
      })
      .max(100, {
        message: "Password must be between 6 and 100 characters",
      }),
    callbackUrl: z
      .string()
      .url()
      .optional()
  });
export async function signinAction(
    prevState: any,
    formData: FormData
  ) {  
    const rawFormData = Object.fromEntries(formData);
    console.debug("[action:auth] Got formData:",rawFormData);
    const parse = schemaLogin.safeParse({
      identifier: rawFormData.email,
      password: rawFormData.password,
      callbackUrl: rawFormData.callbackUrl
    });
    
    if (!parse.success) {
      console.error("[action:signinAction] formData invalide:",parse.error);
      return {
          errors: {
            message: parse.error.message
          },
          message: "Missing Fields. Failed to Login.",
      };
    }
    
    try {
      console.debug("[action:signinAction] formData is valid. Waitting for next-auth signIn");
      const signInResponse = await signIn('credentials', {
        identifier: parse.data.identifier,
        password: parse.data.password,
        redirect: false
      });
      console.debug("[action:signinAction] Got response:",signInResponse);    
    } catch (error) {
      console.error("[auth:signinAction] Error:",error);    
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return{
              errors: {
                message: error.message
              },
              message: 'Email或密码不匹配，登录出错'
            };
          default:
            return{
              errors: {
                message: error.message
              },
              message: '登录出错'
            };
        }
      }
      // This is a weird solution for redirect error.
      if (isRedirectError(error)) throw error;
      return{
        errors: {
          message: "出现不明原因错误，请联系管理员。"
        },
        message: '系统出错'
      };
    } 
    const url = rawFormData.callbackUrl ? rawFormData.callbackUrl as string: BUSINESS_HOME;
    console.debug("[action:signinAction] redirect to ",url);
    redirect(url); 
  }
  
export async function signoutAction() {
  
    console.debug("[auth]Log out");
    try {
      (await cookies()).set("jwt", "", { ...config, maxAge: 0 });
      const result = await signOut({
        redirect: true,
        redirectTo: "/"
      });
    } catch (error) {
      console.error("[auth:signoutAction]",error);
      return{
        errors: {
          message: ""
        },
        message: '退出出错'
      };    
    }
    
  }