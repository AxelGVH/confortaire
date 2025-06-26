
export default function AdminPanel() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <ul className="list-disc pl-6">
        <li><a href="/admin/departments" className="text-blue-600 underline">Manage Departments</a></li>
        <li><a href="/admin/users" className="text-blue-600 underline">Manage Users</a></li>
        <li><a href="/admin/users/create" className="text-blue-600 underline">Create User</a></li>
      </ul>
    </div>
  );
}
