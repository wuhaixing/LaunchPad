import {
    IconBrandGithubFilled,
    IconBrandGoogleFilled,
  } from "@tabler/icons-react";
  
export const OAuths = ()=> {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]">
            <IconBrandGithubFilled className="h-4 w-4 text-black" />
            <span className="text-sm">Login with GitHub</span>
          </button>
          <button className="flex flex-1 justify-center space-x-2 items-center bg-white px-4 py-3 rounded-md text-black hover:bg-white/80 transition duration-200 shadow-[0px_1px_0px_0px_#00000040_inset]">
            <IconBrandGoogleFilled className="h-4 w-4 text-black" />
            <span className="text-sm">Login with Google</span>
          </button>
        </div>
    );
    
}