export const Divider = () => {
    return (
      <div className="relative w-full py-8">
        <div className="w-full h-px bg-neutral-700 rounded-tr-xl rounded-tl-xl" />
        <div className="w-full h-px bg-neutral-800 rounded-br-xl rounded-bl-xl" />
        <div className="absolute inset-0 h-5 w-5 m-auto rounded-md px-3 py-0.5 text-xs bg-neutral-800 shadow-[0px_-1px_0px_0px_var(--neutral-700)] flex items-center justify-center">
          OR
        </div>
      </div>
    );
  };
  