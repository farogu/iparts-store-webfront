
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import ProductFlow from "./pages/ProductFlow";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Warranty from "./pages/Warranty";
import NotFound from "./pages/NotFound";
import ShopifyDiagnostic from "./pages/ShopifyDiagnostic";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 3,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product-flow" element={<ProductFlow />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/shopify-diagnostic" element={<ShopifyDiagnostic />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
