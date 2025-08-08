import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  MenuOutlined,
  HomeOutlined,
  SearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css'; // Import Ant Design styles

const { Header } = Layout;

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { key: '1', icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    { key: '2', icon: <SearchOutlined />, label: <Link to="/search">Search</Link> },
    { key: '3', icon: <FileTextOutlined />, label: <Link to="/report">Report</Link> },
    { key: '4', icon: <InfoCircleOutlined />, label: <Link to="/about">About</Link> },
    { key: '5', icon: <MailOutlined />, label: <Link to="/contact">Contact</Link> },
  ];

  return (
    <Header className="bg-blue-700 text-white flex justify-between items-center px-4 md:px-6 h-16 fixed w-full z-10">
      <div className="flex items-center">
        <img src="https://via.placeholder.com/32" alt="Logo" className="mr-2" /> {/* Replace with actual logo */}
        <span className="text-xl font-bold">FindLost</span>
      </div>
      <div className="md:hidden">
        <Button
          icon={<MenuOutlined />}
          onClick={toggleMobileMenu}
          className="text-white"
        />
      </div>
      <Menu
        mode="horizontal"
        items={menuItems}
        className={`md:flex md:space-x-4 md:bg-transparent bg-blue-700 text-white ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block absolute md:static top-16 left-0 w-full md:w-auto`}
        style={{ border: 'none' }}
      />
    </Header>
  );
}

export default Navbar;