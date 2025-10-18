import { Outlet } from "react-router-dom"


const AuthLayout = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4">
        <Outlet />
    </main>
  )
}

export default AuthLayout
