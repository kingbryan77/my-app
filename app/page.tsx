import AuthForm from "@/components/auth-form"; // JANGAN pakai kurung kurawal {}

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <AuthForm />
    </main>
  );
}