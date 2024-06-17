import Header from './Header';
import styles from './styles/Layout.module.css';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
