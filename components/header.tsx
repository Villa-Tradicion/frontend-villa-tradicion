"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Header() {
  const router = useRouter()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Product Manager
        </Link>

        <Button onClick={() => router.push("/products/add")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
    </header>
  )
}
