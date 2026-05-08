export function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md border border-hairline bg-steel p-8">
        {children}
      </div>
    </div>
  );
}
