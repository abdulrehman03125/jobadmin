import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Form, 
  DatePicker, 
  Space,
  Divider,
  message,
  Popconfirm
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FilterOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingJob, setEditingJob] = useState(null);
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  
  // Available options
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Remote'];
  const tags = ['React', 'Python', 'JavaScript', 'Java', 'DevOps', 'UI/UX', 'Backend', 'Frontend'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchText, jobTypeFilter, locationFilter, selectedTags, sortOption]);

  const fetchJobs = async () => {
    try {
      // In a real app, this would be your Flask API endpoint
      // const response = await axios.get('http://localhost:5000/api/jobs');
      
      // Mock data for demonstration
      const mockJobs = [
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'TechCorp',
          location: 'New York',
          jobType: 'Full-time',
          description: 'We are looking for a skilled Frontend Developer with React experience.',
          tags: ['React', 'JavaScript', 'Frontend'],
          postingDate: '2023-05-15'
        },
        {
          id: 2,
          title: 'Backend Engineer',
          company: 'DataSystems',
          location: 'San Francisco',
          jobType: 'Full-time',
          description: 'Join our team to build scalable backend services.',
          tags: ['Python', 'Java', 'Backend'],
          postingDate: '2023-05-10'
        },
        {
          id: 3,
          title: 'UI/UX Designer',
          company: 'CreativeMinds',
          location: 'Remote',
          jobType: 'Contract',
          description: 'Design beautiful interfaces for our clients.',
          tags: ['UI/UX', 'Figma', 'Design'],
          postingDate: '2023-05-18'
        },
      ];
      
      setJobs(mockJobs);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...jobs];
    
    // Search filter
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(lowerSearch) || 
        job.company.toLowerCase().includes(lowerSearch)
      )
    }
    
    // Job type filter
    if (jobTypeFilter !== 'all') {
      result = result.filter(job => job.jobType === jobTypeFilter);
    }
    
    // Location filter
    if (locationFilter !== 'all') {
      result = result.filter(job => job.location === locationFilter);
    }
    
    // Tags filter
    if (selectedTags.length > 0) {
      result = result.filter(job => 
        selectedTags.every(tag => job.tags.includes(tag))
      )
    }
    
    // Sorting
    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.postingDate) - new Date(b.postingDate));
    }
    
    setFilteredJobs(result);
  };

  const handleAddJob = () => {
    setEditingJob(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    form.setFieldsValue({
      ...job,
      postingDate: moment(job.postingDate)
    });
    setVisible(true);
  };

  const handleDeleteJob = async (id) => {
    try {
      // In a real app: await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      setJobs(jobs.filter(job => job.id !== id));
      message.success('Job deleted successfully');
    } catch (error) {
      message.error('Failed to delete job');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.postingDate = values.postingDate.format('YYYY-MM-DD');
      
      if (editingJob) {
        // Update existing job
        // In a real app: await axios.put(`http://localhost:5000/api/jobs/${editingJob.id}`, values);
        setJobs(jobs.map(job => job.id === editingJob.id ? { ...job, ...values } : job));
        message.success('Job updated successfully');
      } else {
        // Add new job
        // In a real app: const response = await axios.post('http://localhost:5000/api/jobs', values);
        const newJob = {
          ...values,
          id: Math.max(...jobs.map(job => job.id), 0) + 1
        };
        setJobs([...jobs, newJob]);
        message.success('Job added successfully');
      }
      
      setVisible(false);
    } catch (error) {
      message.error('Error submitting form');
    }
  };

  return (
    <div className="job-list-container">
      <div className="filters-section">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search jobs..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Job Type"
                value={jobTypeFilter}
                onChange={(value) => setJobTypeFilter(value)}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Job Types</Option>
                {jobTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Location"
                value={locationFilter}
                onChange={(value) => setLocationFilter(value)}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Locations</Option>
                {locations.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Tags"
                value={selectedTags}
                onChange={(value) => setSelectedTags(value)}
                suffixIcon={<FilterOutlined />}
              >
                {tags.map(tag => (
                  <Option key={tag} value={tag}>{tag}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Sort By"
                value={sortOption}
                onChange={(value) => setSortOption(value)}
                suffixIcon={<SortAscendingOutlined />}
              >
                <Option value="newest">Newest First</Option>
                <Option value="oldest">Oldest First</Option>
              </Select>
            </Col>
          </Row>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddJob}
          >
            Add Job
          </Button>
          
          <Divider />
          
          <div className="active-filters">
            {searchText && (
              <Tag closable onClose={() => setSearchText('')}>
                Search: {searchText}
              </Tag>
            )}
            {jobTypeFilter !== 'all' && (
              <Tag closable onClose={() => setJobTypeFilter('all')}>
                Job Type: {jobTypeFilter}
              </Tag>
            )}
            {locationFilter !== 'all' && (
              <Tag closable onClose={() => setLocationFilter('all')}>
                Location: {locationFilter}
              </Tag>
            )}
            {selectedTags.length > 0 && (
              <Tag closable onClose={() => setSelectedTags([])}>
                Tags: {selectedTags.join(', ')}
              </Tag>
            )}
          </div>
        </Space>
      </div>
      
      <Row gutter={16} className="job-cards-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <Col xs={24} sm={12} md={8} lg={6} key={job.id} style={{ marginBottom: 16 }}>
              <Card
                title={job.title}
                extra={
                  <Space>
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEditJob(job)}
                    />
                    <Popconfirm
                      title="Are you sure to delete this job?"
                      onConfirm={() => handleDeleteJob(job.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                }
              >
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.jobType}</p>
                <p><strong>Posted:</strong> {moment(job.postingDate).format('MMM D, YYYY')}</p>
                <div>
                  <strong>Tags:</strong>
                  <div style={{ marginTop: 8 }}>
                    {job.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: 'center', padding: 24 }}>
            {loading ? <p>Loading jobs...</p> : <p>No jobs found matching your criteria</p>}
          </Col>
        )}
      </Row>
      
      <Modal
        title={editingJob ? 'Edit Job' : 'Add New Job'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            jobType: 'Full-time',
            location: 'New York',
            tags: []
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Job Title"
                rules={[{ required: true, message: 'Please enter job title' }]}
              >
                <Input placeholder="e.g. Frontend Developer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label="Company"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="Company name" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="jobType"
                label="Job Type"
                rules={[{ required: true }]}
              >
                <Select>
                  {jobTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true }]}
              >
                <Select>
                  {locations.map(location => (
                    <Option key={location} value={location}>{location}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="postingDate"
                label="Posting Date"
                rules={[{ required: true, message: 'Please select posting date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter job description' }]}
          >
            <TextArea rows={4} placeholder="Job description..." />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select mode="multiple" placeholder="Select tags">
              {tags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobList;