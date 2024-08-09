import React, { useState } from 'react';
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';// import './MyComponent.css'; // Import your CSS file

const MyComponent = ({ folderPath, setImage }) => {
    const [loading, setLoading] = useState(false);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading(true);
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`${folderPath}/${file.name}`);

            try {
                await fileRef.put(file);
                const url = await fileRef.getDownloadURL();
                setImage(url);
            } catch (error) {
                console.error('Error uploading file:', error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={loading ? 'loading-overlay' : ''}>
            <input type="file" name="example" onChange={handleUpload} />
            {loading && (
                <div className="loading-icon-container">
                    <div className="loading-icon"></div>
                </div>
            )}
        </div>
    );
};

export default MyComponent;
