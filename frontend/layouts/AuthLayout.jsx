
import logo from '../images/Confortaire-Logo.png';

export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md text-center">
        <img
          src={logo}
          alt="Confortaire Logo"
          className="mx-auto mb-6 w-40 h-auto"
        />
        {children}
      </div>
    </div>
  );
}
