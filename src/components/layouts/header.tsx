import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
function Header() {
  return (
    <div className={`w-full dark:bg-gray-900  bg-gray-400 border-2  h-full flex justify-between items-center gap-2 pr-6 `}>
      <Link to='/'>
   <Button className="text-xl" variant="link">Home</Button>
      </Link>
    <div>

      <Link  to="/login"> <Button variant="secondary">Login</Button></Link>

      <Link  to="/register"> <Button variant="secondary">Register</Button></Link>
    </div>
    </div>
  );
}

export default Header;
