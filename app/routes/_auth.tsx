import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="grid justify-items-center">
      <Outlet />
    </div>
  );
}
