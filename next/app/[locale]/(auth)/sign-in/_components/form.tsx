"use client";

import { Button } from "@/components/elements/button";
import { Field, Fieldset, Input, Label, Legend, Description } from '@headlessui/react';
import { useFormState,useFormStatus } from "react-dom";
import { signinAction } from "../../_actions/auth";
import { initialFormState } from "@/components/elements/form-state";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "next-view-transitions";

export const SigninForm = () => {
    const status = useFormStatus();
    const [formState, formAction] = useFormState(
        signinAction,
        initialFormState
      );
    return (
      <form action={formAction}  className="w-full my-4">
        <Fieldset disabled={status.pending} className="space-y-4">
            <Legend className="text-xl md:text-4xl font-bold my-6">Sign In</Legend>          
            <Field>
              <Label className="block my-2">Email / Mobile Number</Label>
              {
                formState?.errors?.email &&
                    formState?.errors.email.map((error: string,index:number) => (
                        <Description key={index} className="mt-2 text-sm text-red-500">{error}</Description> 
                    ))                                   
              }              
              <Input name="email" 
                className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"/>
            </Field>  
            <Field>
              <Label className="block my-2">Password</Label>
              {
                formState?.errors?.password &&
                    formState?.errors.password.map((error: string,index:number) => (
                        <Description key={index} className="mt-2 text-sm text-red-500">{error}</Description> 
                    ))                                   
              }  
              <Input name="password" type="password"
                className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"/>
            </Field>             
            <Button variant="muted" type="submit" className="w-full py-3">
              <span className="text-sm">Sign In</span>
            </Button>   
            <Link href="/sign-up" className="flex space-x-2 items-center">
              <IconArrowLeft className="w-4 h-4 text-muted" />
              <span className="text-sm text-muted">Sign Up</span>
            </Link>           
        </Fieldset>
      </form>
    );
}