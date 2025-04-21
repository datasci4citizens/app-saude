import React from "react";

export default function Register() {
  const handleGoogleRegister = () => {
    // TODO: Implement Google sign-in logic here
    console.log("Google Sign In clicked");
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleGoogleRegister}
        className="w-[85%] h-[54px] bg-white text-black rounded-md px-4 py-4 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="h-6 w-6"
        />
        <span className="font-inter text-base">Entre com Google</span>
      </button>
    </div>
  );
}
