import type React from "react"
import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variantStyles = {
      default: "bg-gray-800 text-white hover:bg-gray-700",
      outline: "border border-gray-700 text-white hover:bg-gray-800",
      ghost: "text-gray-300 hover:text-white hover:bg-gray-800/50",
    }

    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "h-10 w-10",
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    return (
      <button className={combinedClassName} ref={ref} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
