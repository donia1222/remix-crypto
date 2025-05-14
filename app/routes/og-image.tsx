import type { LoaderFunctionArgs } from "@remix-run/node"

// This route will serve as a dedicated endpoint for Open Graph images
export async function loader({ request }: LoaderFunctionArgs) {
  // You could dynamically generate an image here if needed
  // For now, we'll just redirect to a static image

  // Replace with your actual image URL
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/A5.png",
    },
  })
}
