import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">
        This is the Todo application. Our mission is to help you manage your tasks efficiently.
      </p>
      <p className="mb-4">
        We believe in simplicity and productivity.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to Todos
      </Link>
    </div>
  );
}
