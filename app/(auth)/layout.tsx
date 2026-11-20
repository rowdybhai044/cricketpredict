export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-8 pt-safe pb-safe">{children}</main>
    </div>
  );
}
