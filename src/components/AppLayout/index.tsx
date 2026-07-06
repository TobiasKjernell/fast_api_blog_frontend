import { Outlet } from "react-router"
import Header from "../Header"

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-canvas bg-app-gradient relative flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout
