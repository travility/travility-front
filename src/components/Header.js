import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Header.module.css';
import { ReactComponent as Logo } from './styles/icon/Travility.svg';

const Header = () => {
    const navigate = useNavigate();

    const goAboutUs = () => {
        navigate('/');
    } 

    return (
        <header className={styles.header}>
            <div>
                <Logo className={styles.logo} />
            </div>
            <div>
                <nav className={styles.goAboutUs}>
                    <a href="/" onClick={goAboutUs}>About Us</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;
