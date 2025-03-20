import React from 'react';
import SearchBar from './SearchBar';

const Header = ({ onSearch }) => {
    return (
        <header style={{backgroundColor: '#FF0000'}}>
            <h1>Mỹ Phẩm</h1>
            <SearchBar onSearch={onSearch} />
        </header>
    );
};

export default Header;