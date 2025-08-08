import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import JobList from './components/JobList';
import Navbar from './components/Navbar';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    
      <>
      {/* <Navbar/> */}
        <Layout className="layout">
        
          <Content style={{ padding: '0 50px', marginTop: 100 }}>
            <div className="site-layout-content">
              <Routes>
                <Route path="/" element={<JobList />} />
              </Routes>
            </div>
          </Content>
        </Layout>
        </>
      );
    }
    
    export default App;
