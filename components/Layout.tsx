export default function Layout({ children }) {
  return (
    <main className="md-container max-w-screen-md container mx-auto px-4 my-16">
      {children}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
        }

        :root {
          --site-color: royalblue;
          --divider-color: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </main>
  )
}
