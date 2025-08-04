type AppProps = {
  children: React.ReactNode
}

export default function App({ children }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-center font-bold text-xl">
        SS Dashboard
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  )
}
