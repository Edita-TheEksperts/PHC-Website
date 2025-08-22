import AdminLayout from "../../components/AdminLayout";
import EmailTemplatesAdmin from "../../components/EmailTemplatesAdmin";

export default function EmailTemplatesPage() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
      <EmailTemplatesAdmin />
    </AdminLayout>
  );
}
