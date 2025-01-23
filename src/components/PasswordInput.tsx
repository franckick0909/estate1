"use client";

import { useState } from "react";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  error,
  required = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          required={required}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3 flex items-center focus:outline-none"
          >
            {showPassword ? (
              <MdVisibilityOff
                className="h-5 w-5 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
              />
            ) : (
              <MdVisibility
                className="h-5 w-5 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
