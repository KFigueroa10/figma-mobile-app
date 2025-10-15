import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { User } from "lucide-react"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, variant, src, alt, fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false)

    if (error || !src) {
      return (
        <div className={cn(avatarVariants({ variant }), className)}>
          {fallback || (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </span>
          )}
        </div>
      )
    }

    return (
      <div className={cn(avatarVariants({ variant }), className)}>
        <img
          ref={ref}
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
          {...props}
        />
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
