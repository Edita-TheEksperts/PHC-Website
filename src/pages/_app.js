import "../styles/globals.css";
import { FormProvider } from "../context/FormContext";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Define the pages where Header and Footer should be excluded
  const excludedPages = ['/old-index', '/Registrierung-Jobs', '/Registrierung','/Registrierung-Form1','/Registrierung-Form2','/Registrierung-Jobs-Form1','/Registrierung-Jobs-Form2','/login' ,'/register' ,'/confirmation-page' , '/forgot-password' ,'/404' ,'/500' ,'/reset-password','/dashboard' ,'/admin-dashboard' ,'/client-dashboard' ,'/employee-dashboard'];
  const shouldExcludeLayout = excludedPages.includes(router.pathname);
  

  return (
    <>
      <Head>
        <link rel="icon" href="/PHCIcon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/PHCIcon.svg" type="image/svg+xml" />
        <title>PHC</title>
      </Head>

      <FormProvider>
        {!shouldExcludeLayout && <Header />}
        <Component {...pageProps} />
        {!shouldExcludeLayout && <Footer />}
      </FormProvider>
    </>
  );
}

export default MyApp;
