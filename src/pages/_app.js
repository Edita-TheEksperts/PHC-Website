import "../styles/globals.css";
import { FormProvider } from "../context/FormContext";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RYQGfPeqd3TrCRx41FQzbB67KsAgZ7jkdpSljAyZFoVFxE2iAvEGG2AUq7VQTWUaBJVaHk1vkWYaOd4ufKjUiED00K9trr1sr"); // Your public Stripe key

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const excludedPages = [
    '/old-index', '/Registrierung-Jobs', '/Registrierung', '/Registrierung-Form1',
    '/Registrierung-Form2', '/Registrierung-Jobs-Form1', '/Registrierung-Jobs-Form2',
    '/login', '/register', '/confirmation-page', '/forgot-password', '/404',
    '/500', '/reset-password', '/dashboard', '/admin-dashboard', '/client-dashboard',
    '/employee-dashboard','/admin/employees', '/admin/clients', '/admin/settings', '/set-password' , '/dashboard/personal-info'
  ];

  const shouldExcludeLayout = excludedPages.includes(router.pathname);

  return (
    <>
      <Head>
        <link rel="icon" href="/PHCIcon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/PHCIcon.svg" type="image/svg+xml" />
        <title>PHC</title>
      </Head>

      <FormProvider>
        <Elements stripe={stripePromise}>
          {!shouldExcludeLayout && <Header />}
          <Component {...pageProps} />
          {!shouldExcludeLayout && <Footer />}
        </Elements>
      </FormProvider>
    </>
  );
}

export default MyApp;
