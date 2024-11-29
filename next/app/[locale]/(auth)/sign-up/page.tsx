import React from "react";
import { SignupForm } from "./_components/form";
import { getDictionary } from "../../dictionaries";

export default async function RegisterPage({
  params,
}: {
  params: { locale: string; };
}) {
  const dictionary = await getDictionary(params.locale);
  return  <SignupForm labels={dictionary.signup}/>;
}
