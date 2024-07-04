import Header from "./Header";
import NavigationBar from "../../components/header/NavigationBar";
import { Inner, Container } from "../../styles/StyledComponents";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Inner>
        <Header />
        <NavigationBar />
        <Container>
          <Outlet />
        </Container>
      </Inner>
    </div>
  );
};

export default Layout;
