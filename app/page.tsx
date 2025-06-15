import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle-button';
import { ArrowRight, GlobeIcon as FeatureGlobeIcon } from 'lucide-react'; // Using lucide-react for a globe icon in features for consistency if needed, or remove if using SVG directly

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <AppLogoIcon className="h-6 w-6 mr-2" /> {/* Updated Icon */}
          <span className="font-semibold">My Awesome App</span> {/* Changed sr-only to visible text */}
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            href="/todos"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Go to App
          </Link>
          <ModeToggle />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to Our Awesome Application
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover how our app can help you manage your tasks efficiently and boost your productivity.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/todos"
                prefetch={false}
              >
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need, All in One Place</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our application is packed with features designed to make your life easier.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {/* Feature One with Image */}
              <div className="flex flex-col items-center text-center p-4 rounded-lg border hover:shadow-lg transition-shadow">
                <Image src="/globe.svg" alt="Global Feature" width={80} height={80} className="mb-4" />
                <h3 className="text-lg font-bold">Global Connectivity</h3>
                <p className="text-sm text-muted-foreground">
                  Access your data from anywhere in the world. Seamlessly connect and collaborate.
                </p>
              </div>
              {/* Feature Two */}
              <div className="flex flex-col items-center text-center p-4 rounded-lg border hover:shadow-lg transition-shadow">
                {/* Placeholder for an icon or image */}
                <div className="p-3 rounded-full bg-muted mb-4">
                  <FeatureWindowIcon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Intuitive Interface</h3>
                <p className="text-sm text-muted-foreground">
                  User-friendly design that makes navigation and usage a breeze.
                </p>
              </div>
              {/* Feature Three */}
              <div className="flex flex-col items-center text-center p-4 rounded-lg border hover:shadow-lg transition-shadow">
                 {/* Placeholder for an icon or image */}
                 <div className="p-3 rounded-full bg-muted mb-4">
                  <FeatureFileIcon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Secure File Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your files safe and sound with our robust storage solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up today and experience the difference.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Link
                  href="/todos"
                  prefetch={false}
                  className="inline-block w-full"
              >
                <Button size="lg" className="w-full">
                  Access Your Dashboard
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Jump right into your personalized dashboard.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} My Awesome App. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

// Generic App Logo Icon (Cube)
function AppLogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

// Placeholder for FeatureWindowIcon - ideally from lucide-react or similar
function FeatureWindowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
      <path d="M10 4v16" />
    </svg>
  );
}

// Placeholder for FeatureFileIcon - ideally from lucide-react or similar
function FeatureFileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
