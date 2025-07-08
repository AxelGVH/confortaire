
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    created_by BINARY(16),
    updated_by BINARY(16)
);

CREATE TABLE departments (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1024),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    created_by BINARY(16),
    updated_by BINARY(16),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE vendors (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    zipcode VARCHAR(20),
    email VARCHAR(100),
    phone VARCHAR(20),
    registration_no VARCHAR(100),
    contact_person_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE machines (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    model_no VARCHAR(100),
    department_id BINARY(16) NOT NULL,
    serial_no VARCHAR(100),
    input_power FLOAT,
    voltage FLOAT,
    amperes FLOAT,
    phase INT,
    vendor_id BINARY(16),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE shifts (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE employees (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department_id BINARY(16) NOT NULL,
    machine_id BINARY(16) NOT NULL,
    shift_id BINARY(16) NOT NULL,
    regular_hour_rate NUMERIC(10,2),
    ot_hour_rate NUMERIC(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

CREATE TABLE parts (
    id BINARY(16) PRIMARY KEY,
    part_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    part_type ENUM('Consumables', 'Regular', 'Other') NOT NULL,
    unit ENUM('Count', 'Length', 'Weight', 'Volume', 'Area') NOT NULL,
    available_qty FLOAT NOT NULL,
    description VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

CREATE TABLE attachments (
    id BINARY(16) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    file_path VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BINARY(16) NOT NULL,
    tags VARCHAR(255),
    created_at DATETIME(6)
);

CREATE TABLE activities (
    id BINARY(16) PRIMARY KEY,
    machine_id BINARY(16) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    status ENUM('Created', 'In Progress', 'Completed', 'Halted') DEFAULT 'Created' NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    required_time TIME NOT NULL,
    details VARCHAR(1000) NOT NULL,
    assigned_to BINARY(16),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (machine_id) REFERENCES machines(id),
    FOREIGN KEY (assigned_to) REFERENCES employees(id)
);
