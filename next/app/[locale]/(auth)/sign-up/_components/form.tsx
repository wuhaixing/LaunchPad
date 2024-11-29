"use client";

import { Button } from "@/components/elements/button";
import { Field, Fieldset, Input, Label, Legend, Description } from '@headlessui/react';
import { useFormState,useFormStatus } from "react-dom";
import { signupAction } from "../../_actions/auth";
import { initialFormState } from "@/components/elements/form-state";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "next-view-transitions";

export const SignupForm = (
  {labels}:
  {labels:any}
) => {
    const status = useFormStatus();
    const [formState, formAction] = useFormState(
        signupAction,
        initialFormState
      );
    return (
        <form action={formAction}  className="w-full my-4">
        <Fieldset disabled={status.pending} className="space-y-4">
            <Legend className="text-xl md:text-4xl font-bold my-6">{labels.legend}</Legend>          
            <Field>
              <Label className="block my-2">{labels.identifier}</Label>
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
              <Label className="block my-2">{labels.password}</Label>
              {
                formState?.errors?.password &&
                    formState?.errors.password.map((error: string,index:number) => (
                        <Description key={index} className="mt-2 text-sm text-red-500">{error}</Description> 
                    ))                                   
              }  
              <Input name="password" type="password"
                className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"/>
            </Field> 
            <Field>
              <Label className="block my-2">{labels.confirm}</Label>
              {
                formState?.errors?.confirm &&
                    formState?.errors.confirm.map((error: string,index:number) => (
                        <Description key={index} className="mt-2 text-sm text-red-500">{error}</Description> 
                    ))                                   
              }  
              <Input name="confirm" type="password"
                className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"/>
            </Field>
            <Button variant="muted" type="submit" className="w-full py-3">
              <span className="text-sm">{labels.submit}</span>
            </Button>  
            <Link href="/sign-in" className="flex space-x-2 items-center">              
              <span className="text-sm text-muted">{labels.signin}</span>
              <IconArrowRight className="w-4 h-4 text-muted" />
            </Link>             
        </Fieldset>
        </form>
    );
}