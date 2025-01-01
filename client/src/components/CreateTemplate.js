import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateTemplate = ({ userId, users = [] }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topic, setTopic] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false); // To indicate submission state
    const [error, setError] = useState(null); // To handle and display errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            // Input validation before submission
            if (!title.trim() || !topic.trim()) {
                throw new Error('Title and Topic are required.');
            }
            if (!isPublic && selectedUsers.length === 0) {
                throw new Error('Please select at least one user for a private template.');
            }
    
            const body = {
                title: title.trim(),
                description: description.trim(),
                topic: topic.trim(),
                is_public: isPublic,
                selected_users: isPublic ? null : selectedUsers,
            };
    
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
    
            console.log('Token:', token);
            const apiUrl = '/api/templates';
            console.log('API URL:', apiUrl);
    
            const response = await axios.post(apiUrl, body, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert('Template created successfully!');
            console.log(response.data);
    
            // Reset form on success
            setTitle('');
            setDescription('');
            setTopic('');
            setIsPublic(false);
            setSelectedUsers([]);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div className="container mt-5">
            <h2>Create Template</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label className="form-label">Topic:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="publicTemplate"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                    <label className="form-check-label" htmlFor="publicTemplate">
                        Public Template
                    </label>
                </div>
                {!isPublic && (
                    <div className="mb-3">
                        <label>Select Users:</label>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <div key={user.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`user-${user.id}`}
                                        value={user.id}
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`user-${user.id}`}>
                                        {user.name}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p>No users available for selection.</p>
                        )}
                    </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Template'}
                </button>
            </form>
        </div>
    );
};

export default CreateTemplate;