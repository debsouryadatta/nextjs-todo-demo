// app/__tests__/page.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LandingPage from '../page'; // Adjust path based on actual file location
import { ModeToggle } from '@/components/theme-toggle-button'; // Mock this component

// Mock next/link and next/image
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} className={className} />;
  };
});

// Mock ModeToggle component as it's not relevant to landing page content tests
jest.mock('@/components/theme-toggle-button', () => ({
  ModeToggle: jest.fn(() => <div data-testid="mock-mode-toggle">Toggle</div>),
}));

// Mock lucide-react icons used directly in the page
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'), // Import and retain default behavior
  ArrowRight: jest.fn(() => <svg data-testid="arrow-right-icon" />),
  // Add other icons used directly if any, or use a more generic mock
}));


describe('LandingPage', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders the main headline', () => {
    render(<LandingPage />);
    const headline = screen.getByRole('heading', {
      name: /Welcome to Our Awesome Application/i,
    });
    expect(headline).toBeInTheDocument();
  });

  it('renders the "Get Started" button', () => {
    render(<LandingPage />);
    // Using a more specific query if multiple buttons exist
    const getStartedButton = screen.getByRole('link', { name: /Get Started/i });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/todos');
  });

  it('renders the "Go to App" link in the header', () => {
    render(<LandingPage />);
    const goToAppLink = screen.getByRole('link', { name: /Go to App/i });
    expect(goToAppLink).toBeInTheDocument();
    expect(goToAppLink).toHaveAttribute('href', '/todos');
  });

  it('renders the features section title', () => {
    render(<LandingPage />);
    const featuresTitle = screen.getByRole('heading', {
      name: /Everything You Need, All in One Place/i,
    });
    expect(featuresTitle).toBeInTheDocument();
  });

  it('renders the "Ready to Get Started?" CTA', () => {
    render(<LandingPage />);
    const ctaHeading = screen.getByRole('heading', {
      name: /Ready to Get Started\?/i,
    });
    expect(ctaHeading).toBeInTheDocument();
  });

   it('renders the "Access Your Dashboard" button in CTA', () => {
    render(<LandingPage />);
    const accessDashboardButton = screen.getByRole('link', { name: /Access Your Dashboard/i });
    expect(accessDashboardButton).toBeInTheDocument();
    expect(accessDashboardButton).toHaveAttribute('href', '/todos');
  });

  it('renders the footer with copyright information', () => {
    render(<LandingPage />);
    const footerText = screen.getByText(/My Awesome App. All rights reserved./i);
    expect(footerText).toBeInTheDocument();
  });

  it('renders the AppLogoIcon and app name in header', () => {
    render(<LandingPage />);
    // Check for the app name directly, assuming AppLogoIcon is decorative or tested elsewhere
    expect(screen.getByText("My Awesome App")).toBeInTheDocument();
  });

  it('renders images in the feature section', () => {
    render(<LandingPage />);
    const globeImage = screen.getByAltText('Global Feature');
    expect(globeImage).toBeInTheDocument();
    expect(globeImage).toHaveAttribute('src', '/globe.svg');
  });
});
