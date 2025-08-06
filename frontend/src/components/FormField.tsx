import React from "react"

interface FormFieldProps {
  label: string
  value: string | number | undefined | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  placeholder?: string
  className?: string
}

export default function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  className = "",
}: FormFieldProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className="border px-2 py-1 rounded w-full"
        value={value ?? ""}
        onChange={onChange}
        type={type}
        required={required}
        placeholder={placeholder}
      />
    </div>
  )
}