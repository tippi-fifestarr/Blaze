import {
  Provider as WalletProvider,
  chain,
  defaultChains,
  useAccount,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { styled, globalCss } from "@/stitches.config";
import type { AppProps } from "next/app";
import { Button } from "@cabindao/topo";
import WalletAddress from "@/components/WalletAddress";
import Link from "next/link";
import WalletAuth, { useWallet } from "@/components/WalletAuth";
import Router, { useRouter } from "next/router";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "$sans",
    color: "$forest",
    backgroundColor: "$sand",
  },
  a: {
    color: "$forest",
    "&:hover": {
      opacity: 0.5,
    },
  },
});

const Wrapper = styled("div", {
  margin: "0 auto",
  padding: "$4",
  maxWidth: 740,
  width: "100%",
  marginBottom: "$12",
  boxSizing: "border-box",
});

const Header = styled("header", {
  display: "flex",
  flexDirection: "row",
  padding: "$2",
});

const DaoCampLogo = styled("h2", {
  margin: 0,
  padding: 0,
  fontSize: "1.5rem",
  color: "$forest",
});

const MainContainer = styled("div", {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

const Footer = styled("footer", {
  marginTop: "auto",
  paddingTop: "$8",
  paddingBottom: "$40",
  backgroundColor: "$forest",
  color: "$sand",
  textAlign: "center",
  "& a": {
    color: "$sand",
  },
});

const FooterHeading = styled("p", {
  fontWeight: "$regular",
});
const FooterSubtitle = styled("p", {
  fontWeight: "$light",
});

const UserActions = styled("div", {
  marginLeft: "auto",
  paddingRight: "$12",
  display: "flex",
  flexDirection: "row",
  columnGap: "$4",
});

const Nav = styled("nav", {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  columnGap: "$4",
});

const alchemyId = process.env.ALCHEMY_API_KEY;
const chains = defaultChains;

const connectors = [
  new InjectedConnector({ chains: defaultChains }),
  new WalletConnectConnector({
    options: {
      rpc: { 1: `https://eth-goerli.alchemyapi.io/v2/${alchemyId}}` },
    },
  }),
];

const ProfileLink = () => {
  const { address, ens } = useWallet();
  if (!address) return null;
  return (
    <Link href="/profile">
      <a>
        <WalletAddress address={address} ens={ens} />
      </a>
    </Link>
  );
};

const SubmitLinkAction = () => {
  const { isConnected } = useWallet();
  if (isConnected) {
    return (
      <Link href="/submission/new" passHref>
        <Button tone="wheat">Submit a Link</Button>
      </Link>
    );
  }
  return null;
};

const MobileWrapper = styled("div", {
  flex: 1,
  marginLeft: "auto",
  justifyContent: "end",
  display: "flex",
  "@sm": {
    display: "none",
  },
});
const DesktopWrapper = styled("div", {
  display: "none",
  marginLeft: "auto",
  flex: 1,
  "@sm": {
    display: "flex",
    marginLeft: "auto",
  },
});
const MobileMenuButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  margin: 0,
  padding: "$2",
  "&:hover": {
    backgroundColor: "rgba(50, 72, 65, 0.1)",
  },
  variants: {
    active: {
      true: {
        backgroundColor: "$forest",
        // color: "$sand",
      },
    },
  },
});

const CloseButton = styled(Button, {
  position: "absolute",
  top: 8,
  right: 8,
  "&:hover": {
    backgroundColor: "$wheat",
    color: "$forest",
  },
});
const MenuBox = styled("div", {
  position: "absolute",
  overflow: "auto",
  display: "flex",
  width: "100vw",
  height: "100vh",
  flexDirection: "column",
  gap: "$4",
  top: 0,
  left: 0,
  right: 0,
  boxSizing: "border-box",
  padding: "$4 $2",
  paddingTop: 50,
  backgroundColor: "$forest",
  color: "$wheat",
  "& a": {
    color: "$wheat",
  },
});
const MobileMenu = () => {
  const router = useRouter();
  const [{ data }, disconnect] = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function closeOnChange() {
      setIsOpen(false);
    }
    Router.events.on("routeChangeStart", closeOnChange);
    return () => {
      Router.events.off("routeChangeStart", closeOnChange);
    };
  }, [router]);

  return (
    <MobileWrapper>
      <MobileMenuButton
        active={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <HamburgerMenuIcon />
      </MobileMenuButton>
      {isOpen && (
        <MenuBox>
          <CloseButton type="icon" onClick={() => setIsOpen(false)}>
            <Cross1Icon />
          </CloseButton>
          <Link href="/">
            <a>Home</a>
          </Link>
          {data?.address ? (
            <>
              <Link href="/profile">
                <a>Profile</a>
              </Link>
              <Link href="/submission/new">
                <a>Submit a Link</a>
              </Link>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  disconnect();
                }}
              >
                Disconnect
              </a>
            </>
          ) : (
            <Link href="/user/sign_in">
              <a>Connect</a>
            </Link>
          )}
        </MenuBox>
      )}
    </MobileWrapper>
  );
};

const ResponsiveNav = () => {
  return (
    <>
      <DesktopWrapper>
        <Nav>
          <Button type="link">LINKS</Button>
          <ProfileLink />
        </Nav>
        <UserActions>
          <SubmitLinkAction />
          <WalletAuth />
        </UserActions>
      </DesktopWrapper>
      <MobileMenu />
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <WalletProvider autoConnect connectors={connectors}>
      <MainContainer>
        <Header>
          <Link href="/">
            <a>
              <DaoCampLogo>#dao-camp</DaoCampLogo>
            </a>
          </Link>
          <ResponsiveNav />
        </Header>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
        <Footer>
          {/* <Logo variant="logomark" color="sprout" /> */}
          <div>cabin logo</div>
          <FooterHeading>
            Made with care by <a href="https://www.creatorcabins.com/">Cabin</a>
          </FooterHeading>
          <FooterSubtitle>
            Special thanks to creators Xxxx, Xxxx, Xxxx, &amp; more.
          </FooterSubtitle>
        </Footer>
      </MainContainer>
    </WalletProvider>
  );
}

export default MyApp;
