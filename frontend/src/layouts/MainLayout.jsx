import { createContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatbotWidget from "../components/ChatbotWidget";

const LayoutContext = createContext(false);

function MainLayout({ children }) {
  return (
    <LayoutContext.Consumer>
      {(isNested) => {
        if (isNested) return children;

        return (
          <LayoutContext.Provider value>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ChatbotWidget />
          </LayoutContext.Provider>
        );
      }}
    </LayoutContext.Consumer>
  );
}

export default MainLayout;
