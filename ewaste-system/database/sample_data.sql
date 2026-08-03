-- Sample Data for E-Waste Monitoring System
-- This file populates the database with realistic test data

USE ewaste_system;

-- ==================== USERS ====================

-- Demo Users
INSERT INTO users (email, password_hash, full_name, role, phone, address, city, state, postal_code, country, is_active) VALUES
('user@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'John Doe', 'user', '+1-555-0101', '123 Main St', 'New York', 'NY', '10001', 'USA', 1),
('user2@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Jane Smith', 'user', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA', 1),
('user3@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Mike Johnson', 'user', '+1-555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601', 'USA', 1),
('admin@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Admin User', 'admin', '+1-555-0201', '100 Admin Blvd', 'New York', 'NY', '10002', 'USA', 1),
('center1@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Downtown Collection Center', 'collection_center', '+1-555-0301', '200 Center St', 'New York', 'NY', '10003', 'USA', 1),
('center2@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Uptown Collection Center', 'collection_center', '+1-555-0302', '300 Uptown Ave', 'New York', 'NY', '10004', 'USA', 1),
('dev@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Developer', 'developer', '+1-555-0401', '400 Dev St', 'San Francisco', 'CA', '94105', 'USA', 1),
('collector1@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'John Collector', 'collection_center', '+1-555-0501', '500 Collector Ln', 'New York', 'NY', '10005', 'USA', 1);

-- ==================== COLLECTION CENTERS ====================

INSERT INTO collection_centers (user_id, center_name, latitude, longitude, capacity, current_inventory, phone, email, operating_hours, is_active) VALUES
(5, 'Downtown Collection Center', 40.7128, -74.0060, 1000, 450, '+1-555-0301', 'downtown@example.com', 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM', 1),
(6, 'Uptown Collection Center', 40.7614, -73.9776, 800, 320, '+1-555-0302', 'uptown@example.com', 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM', 1);

-- ==================== E-WASTE ITEMS ====================

INSERT INTO ewaste_items (user_id, item_type, description, condition, estimated_weight, estimated_value, hazard_level, status) VALUES
(1, 'laptop', 'Dell XPS 13 - Not working', 'broken', 2.0, 50, 'high', 'pending'),
(1, 'mobile', 'iPhone 11 - Screen cracked', 'damaged', 0.2, 30, 'medium', 'pending'),
(2, 'monitor', 'Dell 24 inch monitor', 'working', 5.0, 20, 'high', 'pending'),
(2, 'keyboard', 'Mechanical keyboard', 'working', 0.5, 5, 'low', 'pending'),
(3, 'battery', 'Lithium battery pack', 'unknown', 0.5, 10, 'high', 'pending'),
(3, 'cpu', 'Intel i7 processor', 'working', 3.0, 40, 'high', 'pending'),
(1, 'printer', 'HP LaserJet printer', 'working', 8.0, 15, 'medium', 'collected'),
(2, 'cable', 'Ethernet cables (bundle)', 'working', 0.2, 2, 'low', 'recycled');

-- ==================== PICKUP REQUESTS ====================

INSERT INTO pickup_requests (user_id, collection_center_id, collector_id, ewaste_item_id, pickup_date, pickup_time, status, notes) VALUES
(1, 1, 8, 1, '2026-08-05', '14:30:00', 'pending', 'Please call before arriving'),
(1, 1, 8, 2, '2026-08-05', '14:30:00', 'pending', 'Item is fragile'),
(2, 1, NULL, 3, '2026-08-06', '10:00:00', 'pending', 'Large item - needs two people'),
(2, 1, 8, 4, '2026-08-07', '15:00:00', 'assigned', 'Standard pickup'),
(3, 2, NULL, 5, '2026-08-08', '11:00:00', 'pending', 'Hazardous material - handle with care'),
(3, 2, NULL, 6, '2026-08-08', '11:00:00', 'pending', 'Valuable component'),
(1, 1, 8, 7, '2026-07-25', '09:00:00', 'completed', 'Successfully collected'),
(2, 1, 8, 8, '2026-07-26', '13:00:00', 'completed', 'Successfully collected');

-- ==================== AI PREDICTIONS ====================

INSERT INTO ai_predictions (user_id, image_url, detected_objects, bounding_boxes, confidence_scores, estimated_weights, estimated_values, hazard_levels, recommendations, model_version, accuracy, processing_time) VALUES
(1, '/uploads/prediction_1.jpg', '["laptop", "keyboard"]', '[{"x1": 100, "y1": 50, "x2": 300, "y2": 250}, {"x1": 310, "y1": 260, "x2": 450, "y2": 350}]', '[0.95, 0.87]', '[2.0, 0.5]', '[50, 5]', '["high", "low"]', '["Send to certified recycler", "Can be refurbished"]', 'yolov11n', 0.91, 1.23),
(2, '/uploads/prediction_2.jpg', '["monitor", "cable"]', '[{"x1": 50, "y1": 30, "x2": 400, "y2": 350}, {"x1": 410, "y1": 200, "x2": 500, "y2": 250}]', '[0.92, 0.88]', '[5.0, 0.2]', '[20, 2]', '["high", "low"]', '["Contains mercury - certified recycler", "Copper recovery"]', 'yolov11n', 0.90, 1.15),
(3, '/uploads/prediction_3.jpg', '["battery", "cpu"]', '[{"x1": 150, "y1": 100, "x2": 250, "y2": 200}, {"x1": 260, "y1": 110, "x2": 380, "y2": 210}]', '[0.94, 0.96]', '[0.5, 3.0]', '[10, 40]', '["high", "high"]', '["Hazardous - separate recycling", "Valuable metals - certified recycler"]', 'yolov11n', 0.95, 1.05);

-- ==================== ENVIRONMENTAL ANALYTICS ====================

INSERT INTO environmental_analytics (date, co2_saved, energy_saved, water_saved, trees_saved, plastic_recovered, copper_recovered, aluminium_recovered, environmental_score, total_items_recycled) VALUES
('2026-07-20', 120.50, 245.30, 1200, 2, 15.5, 8.2, 5.3, 85.5, 12),
('2026-07-21', 135.75, 267.80, 1350, 2, 18.3, 9.5, 6.1, 87.2, 14),
('2026-07-22', 145.25, 289.50, 1450, 3, 20.1, 10.8, 7.2, 88.9, 16),
('2026-07-23', 155.60, 310.20, 1550, 3, 22.5, 12.1, 8.0, 89.5, 18),
('2026-07-24', 165.80, 331.40, 1650, 3, 24.8, 13.5, 9.1, 90.2, 20),
('2026-07-25', 175.30, 350.60, 1750, 4, 26.2, 14.9, 10.0, 91.1, 22),
('2026-07-26', 185.90, 371.80, 1850, 4, 28.5, 16.2, 11.2, 91.8, 24),
('2026-07-27', 195.45, 390.25, 1950, 4, 30.1, 17.6, 12.3, 92.5, 26),
('2026-07-28', 205.60, 411.30, 2050, 5, 32.3, 19.0, 13.5, 93.2, 28),
('2026-07-29', 215.75, 431.50, 2150, 5, 34.5, 20.5, 14.8, 93.9, 30),
('2026-07-30', 225.80, 451.70, 2250, 5, 36.8, 22.0, 16.0, 94.5, 32);

-- ==================== REPORTS ====================

INSERT INTO reports (report_type, generated_by, report_data, file_format) VALUES
('monthly', 1, '{"month": "July", "total_items": 256, "total_weight": 450.5, "total_value": 1250}', 'pdf'),
('environmental', 1, '{"co2_saved": 1825.50, "energy_saved": 3651.40, "water_saved": 18250}', 'excel'),
('ai', 7, '{"predictions": 45, "accuracy": 0.92, "processing_time": 1.2}', 'pdf'),
('inventory', 5, '{"items": 450, "capacity": 1000, "utilization": 45}', 'csv');

-- ==================== NOTIFICATIONS ====================

INSERT INTO notifications (user_id, notification_type, message, is_read) VALUES
(1, 'pickup_assigned', 'Your pickup has been assigned to collector John', 0),
(1, 'detection_completed', 'AI detection completed for your image', 1),
(2, 'system_alert', 'System maintenance scheduled for tonight', 0),
(3, 'new_user', 'Welcome to E-Waste Monitor!', 1),
(5, 'pickup_assigned', 'New pickup request assigned to your center', 0);

-- ==================== AUDIT LOGS ====================

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes, ip_address) VALUES
(1, 'CREATE', 'ewaste_item', 1, '{"item_type": "laptop", "status": "pending"}', '192.168.1.100'),
(1, 'CREATE', 'pickup_request', 1, '{"pickup_date": "2026-08-05"}', '192.168.1.100'),
(2, 'UPDATE', 'ewaste_item', 3, '{"status": "collected"}', '192.168.1.101'),
(7, 'CREATE', 'ai_prediction', 1, '{"accuracy": 0.91}', '192.168.1.102'),
(5, 'UPDATE', 'pickup_request', 4, '{"status": "assigned"}', '192.168.1.103');

-- ==================== MODEL TRAINING ====================

INSERT INTO model_training (model_name, model_version, epochs, batch_size, learning_rate, image_size, gpu_used, status, loss, precision, recall, f1_score, mAP, training_logs) VALUES
('YOLOv11', 'v1.0.0', 100, 32, 0.001, 640, 'NVIDIA RTX 3090', 'completed', 0.0234, 0.94, 0.92, 0.93, 0.915, 'Training completed successfully'),
('YOLOv11', 'v1.1.0', 150, 32, 0.0005, 640, 'NVIDIA RTX 3090', 'completed', 0.0189, 0.96, 0.94, 0.95, 0.945, 'Improved accuracy with extended training');

-- ==================== MODEL PERFORMANCE ====================

INSERT INTO model_performance (model_version, test_accuracy, test_loss, inference_time, total_predictions, correct_predictions) VALUES
('v1.0.0', 0.915, 0.0234, 1.23, 1000, 915),
('v1.1.0', 0.945, 0.0189, 1.15, 1000, 945);

-- ==================== INVENTORY ====================

INSERT INTO inventory (collection_center_id, item_type, quantity, total_weight, total_value) VALUES
(1, 'laptop', 45, 90.0, 2250),
(1, 'mobile', 120, 24.0, 3600),
(1, 'monitor', 35, 175.0, 700),
(1, 'battery', 80, 40.0, 800),
(1, 'keyboard', 60, 30.0, 300),
(2, 'laptop', 32, 64.0, 1600),
(2, 'mobile', 95, 19.0, 2850),
(2, 'cpu', 28, 84.0, 1120),
(2, 'printer', 18, 144.0, 270);

-- ==================== DATASET IMAGES ====================

INSERT INTO dataset_images (image_url, class_label, image_size, uploaded_by, dataset_split) VALUES
('/datasets/laptop_001.jpg', 'laptop', 2048576, 7, 'train'),
('/datasets/laptop_002.jpg', 'laptop', 2097152, 7, 'train'),
('/datasets/mobile_001.jpg', 'mobile', 1048576, 7, 'train'),
('/datasets/mobile_002.jpg', 'mobile', 1024000, 7, 'train'),
('/datasets/battery_001.jpg', 'battery', 1572864, 7, 'val'),
('/datasets/monitor_001.jpg', 'monitor', 3145728, 7, 'test'),
('/datasets/keyboard_001.jpg', 'keyboard', 786432, 7, 'train'),
('/datasets/printer_001.jpg', 'printer', 4194304, 7, 'train');

-- ==================== SUMMARY ====================
-- Total Users: 8
-- Total Collection Centers: 2
-- Total E-Waste Items: 8
-- Total Pickup Requests: 8
-- Total AI Predictions: 3
-- Total Environmental Records: 11
-- Total Reports: 4
-- Total Notifications: 5
-- Total Audit Logs: 5
-- Total Model Trainings: 2
-- Total Inventory Items: 9
-- Total Dataset Images: 8

-- ==================== VERIFICATION ====================

SELECT 'Users' as entity, COUNT(*) as count FROM users
UNION ALL
SELECT 'Collection Centers', COUNT(*) FROM collection_centers
UNION ALL
SELECT 'E-Waste Items', COUNT(*) FROM ewaste_items
UNION ALL
SELECT 'Pickup Requests', COUNT(*) FROM pickup_requests
UNION ALL
SELECT 'AI Predictions', COUNT(*) FROM ai_predictions
UNION ALL
SELECT 'Environmental Analytics', COUNT(*) FROM environmental_analytics
UNION ALL
SELECT 'Reports', COUNT(*) FROM reports
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs
UNION ALL
SELECT 'Model Training', COUNT(*) FROM model_training
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'Dataset Images', COUNT(*) FROM dataset_images;
