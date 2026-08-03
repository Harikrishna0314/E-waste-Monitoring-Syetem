-- E-Waste Monitoring System Database Schema

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'developer', 'collection_center') NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Collection Centers Table
CREATE TABLE collection_centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    center_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INT,
    current_inventory INT DEFAULT 0,
    phone VARCHAR(20),
    email VARCHAR(255),
    operating_hours VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- E-Waste Items Table
CREATE TABLE ewaste_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    description TEXT,
    condition VARCHAR(50),
    estimated_weight DECIMAL(10, 2),
    estimated_value DECIMAL(10, 2),
    hazard_level ENUM('low', 'medium', 'high') DEFAULT 'low',
    image_url VARCHAR(500),
    status ENUM('pending', 'collected', 'recycled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pickup Requests Table
CREATE TABLE pickup_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    collection_center_id INT,
    collector_id INT,
    ewaste_item_id INT NOT NULL,
    pickup_date DATE,
    pickup_time TIME,
    status ENUM('pending', 'assigned', 'in_transit', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_center_id) REFERENCES collection_centers(id),
    FOREIGN KEY (collector_id) REFERENCES users(id),
    FOREIGN KEY (ewaste_item_id) REFERENCES ewaste_items(id) ON DELETE CASCADE
);

-- AI Predictions Table
CREATE TABLE ai_predictions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    detected_objects JSON,
    bounding_boxes JSON,
    confidence_scores JSON,
    estimated_weights JSON,
    estimated_values JSON,
    hazard_levels JSON,
    recommendations JSON,
    model_version VARCHAR(50),
    accuracy DECIMAL(5, 2),
    processing_time DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dataset Images Table
CREATE TABLE dataset_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500) NOT NULL,
    class_label VARCHAR(100) NOT NULL,
    image_size INT,
    uploaded_by INT NOT NULL,
    dataset_split ENUM('train', 'val', 'test') DEFAULT 'train',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Model Training Table
CREATE TABLE model_training (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50),
    epochs INT,
    batch_size INT,
    learning_rate DECIMAL(10, 6),
    image_size INT,
    gpu_used VARCHAR(100),
    status ENUM('pending', 'training', 'completed', 'failed') DEFAULT 'pending',
    loss DECIMAL(10, 6),
    precision DECIMAL(5, 2),
    recall DECIMAL(5, 2),
    f1_score DECIMAL(5, 2),
    mAP DECIMAL(5, 2),
    training_logs TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_version) REFERENCES ai_predictions(model_version)
);

-- Environmental Analytics Table
CREATE TABLE environmental_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    co2_saved DECIMAL(10, 2) DEFAULT 0,
    energy_saved DECIMAL(10, 2) DEFAULT 0,
    water_saved DECIMAL(10, 2) DEFAULT 0,
    trees_saved INT DEFAULT 0,
    plastic_recovered DECIMAL(10, 2) DEFAULT 0,
    copper_recovered DECIMAL(10, 2) DEFAULT 0,
    aluminium_recovered DECIMAL(10, 2) DEFAULT 0,
    environmental_score DECIMAL(5, 2) DEFAULT 0,
    total_items_recycled INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_type ENUM('monthly', 'ai', 'environmental', 'inventory') NOT NULL,
    generated_by INT NOT NULL,
    report_data JSON,
    file_url VARCHAR(500),
    file_format ENUM('pdf', 'excel', 'csv') DEFAULT 'pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type ENUM('pickup_assigned', 'detection_completed', 'training_finished', 'new_user', 'system_alert') NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    changes JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Model Performance Table
CREATE TABLE model_performance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    model_version VARCHAR(50) NOT NULL,
    test_accuracy DECIMAL(5, 2),
    test_loss DECIMAL(10, 6),
    inference_time DECIMAL(10, 2),
    total_predictions INT DEFAULT 0,
    correct_predictions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    collection_center_id INT NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 0,
    total_weight DECIMAL(10, 2) DEFAULT 0,
    total_value DECIMAL(10, 2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_center_id) REFERENCES collection_centers(id) ON DELETE CASCADE
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_ewaste_items_user_id ON ewaste_items(user_id);
CREATE INDEX idx_ewaste_items_status ON ewaste_items(status);
CREATE INDEX idx_pickup_requests_user_id ON pickup_requests(user_id);
CREATE INDEX idx_pickup_requests_status ON pickup_requests(status);
CREATE INDEX idx_ai_predictions_user_id ON ai_predictions(user_id);
CREATE INDEX idx_ai_predictions_created_at ON ai_predictions(created_at);
CREATE INDEX idx_environmental_analytics_date ON environmental_analytics(date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
