# PHP Coding Guide
**Created: December 18, 2024**

---

## 📧 Email Headers in PHP

### Setting Email Headers
```php
<?php
// Basic email headers
$headers = array();
$headers[] = 'From: sender@example.com';
$headers[] = 'Reply-To: reply@example.com';
$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';

// Send email with headers
$to = 'recipient@example.com';
$subject = 'Test Email';
$message = '<h1>Hello World</h1>';
$headers_string = implode("\r\n", $headers);

mail($to, $subject, $message, $headers_string);
?>
```

### Advanced Email Headers
```php
<?php
// Additional security and formatting headers
$headers = array();
$headers[] = 'From: "Your Name" <noreply@yourdomain.com>';
$headers[] = 'Reply-To: support@yourdomain.com';
$headers[] = 'Return-Path: bounce@yourdomain.com';
$headers[] = 'X-Priority: 1';
$headers[] = 'X-MSMail-Priority: High';
$headers[] = 'Importance: High';
$headers[] = 'X-Mailer: YourApp/1.0';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/html; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';
?>
```

---

## 🔍 Email Filtering

### Basic Email Validation
```php
<?php
function validateEmail($email) {
    // Basic format validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    
    // Check for common spam patterns
    $spam_patterns = array(
        '/\b(free|money|cash|winner|prize)\b/i',
        '/\b(viagra|cialis|medication)\b/i',
        '/\b(click here|buy now|limited time)\b/i'
    );
    
    foreach ($spam_patterns as $pattern) {
        if (preg_match($pattern, $email)) {
            return false;
        }
    }
    
    return true;
}

// Usage
$email = "user@example.com";
if (validateEmail($email)) {
    echo "Valid email";
} else {
    echo "Invalid or spam email";
}
?>
```

### Advanced Email Filtering
```php
<?php
class EmailFilter {
    private $blacklist = array();
    private $whitelist = array();
    
    public function addToBlacklist($domain) {
        $this->blacklist[] = $domain;
    }
    
    public function addToWhitelist($domain) {
        $this->whitelist[] = $domain;
    }
    
    public function isAllowed($email) {
        $domain = substr(strrchr($email, "@"), 1);
        
        // Check whitelist first
        if (!empty($this->whitelist)) {
            return in_array($domain, $this->whitelist);
        }
        
        // Check blacklist
        if (in_array($domain, $this->blacklist)) {
            return false;
        }
        
        return true;
    }
    
    public function filterContent($content) {
        // Remove suspicious links
        $content = preg_replace('/<a[^>]*href=["\'](javascript:|data:)[^"\']*["\'][^>]*>/i', '', $content);
        
        // Remove script tags
        $content = preg_replace('/<script[^>]*>.*?<\/script>/is', '', $content);
        
        // Sanitize HTML
        $content = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
        
        return $content;
    }
}

// Usage
$filter = new EmailFilter();
$filter->addToBlacklist('spam.com');
$filter->addToWhitelist('trusted.com');

$email = "user@trusted.com";
if ($filter->isAllowed($email)) {
    echo "Email allowed";
}
?>
```

---

## 🔎 Search Bar Considerations

### Three Key Considerations for Creating a Search Bar

#### 1. **User Experience (UX)**
```php
<?php
// Search bar with autocomplete
function createSearchBar() {
    $html = '<div class="search-container">';
    $html .= '<input type="text" id="searchInput" placeholder="Search..." autocomplete="off">';
    $html .= '<div id="searchResults" class="search-results"></div>';
    $html .= '</div>';
    
    return $html;
}

// JavaScript for real-time search
$js = "
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value;
    if (query.length >= 2) {
        fetchSearchResults(query);
    }
});
";
?>
```

#### 2. **Security & Input Validation**
```php
<?php
function sanitizeSearchInput($input) {
    // Remove dangerous characters
    $input = strip_tags($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    
    // Prevent SQL injection
    $input = addslashes($input);
    
    // Limit length
    $input = substr($input, 0, 100);
    
    return $input;
}

function validateSearchQuery($query) {
    // Check for minimum length
    if (strlen($query) < 2) {
        return false;
    }
    
    // Check for maximum length
    if (strlen($query) > 100) {
        return false;
    }
    
    // Check for suspicious patterns
    $suspicious = array('script', 'javascript:', 'data:', 'vbscript:');
    foreach ($suspicious as $pattern) {
        if (stripos($query, $pattern) !== false) {
            return false;
        }
    }
    
    return true;
}
?>
```

#### 3. **Performance & Database Optimization**
```php
<?php
class SearchEngine {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function search($query, $limit = 10) {
        // Use prepared statements
        $stmt = $this->pdo->prepare("
            SELECT id, title, description 
            FROM products 
            WHERE title LIKE :query 
            OR description LIKE :query 
            ORDER BY relevance_score DESC 
            LIMIT :limit
        ");
        
        $searchTerm = '%' . $query . '%';
        $stmt->bindParam(':query', $searchTerm, PDO::PARAM_STR);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function searchWithPagination($query, $page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;
        
        $stmt = $this->pdo->prepare("
            SELECT SQL_CALC_FOUND_ROWS id, title, description 
            FROM products 
            WHERE title LIKE :query 
            OR description LIKE :query 
            LIMIT :limit OFFSET :offset
        ");
        
        $searchTerm = '%' . $query . '%';
        $stmt->bindParam(':query', $searchTerm, PDO::PARAM_STR);
        $stmt->bindParam(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get total count
        $totalStmt = $this->pdo->query("SELECT FOUND_ROWS()");
        $total = $totalStmt->fetchColumn();
        
        return array(
            'results' => $results,
            'total' => $total,
            'pages' => ceil($total / $perPage),
            'current_page' => $page
        );
    }
}
?>
```

---

## 📁 File Operations - Order of Operations

### Creating and Saving File Objects

#### Step-by-Step Process:
```php
<?php
class FileManager {
    private $uploadDir = 'uploads/';
    private $allowedTypes = array('jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt');
    private $maxFileSize = 5242880; // 5MB
    
    public function saveFile($file) {
        try {
            // Step 1: Validate file
            $this->validateFile($file);
            
            // Step 2: Create file object
            $fileObject = $this->createFileObject($file);
            
            // Step 3: Generate unique filename
            $filename = $this->generateUniqueFilename($fileObject);
            
            // Step 4: Create upload directory if it doesn't exist
            $this->createUploadDirectory();
            
            // Step 5: Move file to destination
            $destination = $this->uploadDir . $filename;
            $this->moveFile($file['tmp_name'], $destination);
            
            // Step 6: Save file metadata to database
            $fileId = $this->saveFileMetadata($fileObject, $filename);
            
            // Step 7: Return success response
            return array(
                'success' => true,
                'file_id' => $fileId,
                'filename' => $filename,
                'size' => $fileObject['size'],
                'type' => $fileObject['type']
            );
            
        } catch (Exception $e) {
            return array(
                'success' => false,
                'error' => $e->getMessage()
            );
        }
    }
    
    private function validateFile($file) {
        // Check if file was uploaded
        if (!is_uploaded_file($file['tmp_name'])) {
            throw new Exception('File was not uploaded properly');
        }
        
        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            throw new Exception('File size exceeds limit');
        }
        
        // Check file type
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedTypes)) {
            throw new Exception('File type not allowed');
        }
        
        // Check for errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Upload error: ' . $file['error']);
        }
    }
    
    private function createFileObject($file) {
        return array(
            'name' => $file['name'],
            'type' => $file['type'],
            'size' => $file['size'],
            'tmp_name' => $file['tmp_name'],
            'extension' => strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)),
            'upload_time' => time()
        );
    }
    
    private function generateUniqueFilename($fileObject) {
        $timestamp = time();
        $random = uniqid();
        $extension = $fileObject['extension'];
        
        return $timestamp . '_' . $random . '.' . $extension;
    }
    
    private function createUploadDirectory() {
        if (!is_dir($this->uploadDir)) {
            if (!mkdir($this->uploadDir, 0755, true)) {
                throw new Exception('Failed to create upload directory');
            }
        }
    }
    
    private function moveFile($source, $destination) {
        if (!move_uploaded_file($source, $destination)) {
            throw new Exception('Failed to move uploaded file');
        }
    }
    
    private function saveFileMetadata($fileObject, $filename) {
        // Example database insertion
        $sql = "INSERT INTO files (filename, original_name, file_type, file_size, upload_time) 
                VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(array(
            $filename,
            $fileObject['name'],
            $fileObject['type'],
            $fileObject['size'],
            $fileObject['upload_time']
        ));
        
        return $this->pdo->lastInsertId();
    }
}

// Usage
$fileManager = new FileManager();
$result = $fileManager->saveFile($_FILES['uploaded_file']);

if ($result['success']) {
    echo "File uploaded successfully: " . $result['filename'];
} else {
    echo "Upload failed: " . $result['error'];
}
?>
```

---

## 📅 Date Handling in PHP

### Today's Date Functions
```php
<?php
// Get today's date in various formats
$today = date('Y-m-d'); // 2024-12-18
$todayFormatted = date('F j, Y'); // December 18, 2024
$todayTime = date('Y-m-d H:i:s'); // 2024-12-18 14:30:25
$todayTimestamp = time(); // Current timestamp

// Using DateTime class
$dateTime = new DateTime();
$todayISO = $dateTime->format('c'); // ISO 8601 format
$todayRFC = $dateTime->format('r'); // RFC 2822 format

// Date arithmetic
$yesterday = date('Y-m-d', strtotime('-1 day'));
$tomorrow = date('Y-m-d', strtotime('+1 day'));
$nextWeek = date('Y-m-d', strtotime('+1 week'));

// Timezone handling
$dateTime->setTimezone(new DateTimeZone('America/New_York'));
$todayEST = $dateTime->format('Y-m-d H:i:s');
?>
```

---

## 🛡️ Security Best Practices

### Input Sanitization
```php
<?php
function sanitizeInput($input) {
    // Remove HTML tags
    $input = strip_tags($input);
    
    // Convert special characters
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    
    // Remove extra whitespace
    $input = trim($input);
    
    return $input;
}

// CSRF Protection
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>
```

---

## 📊 Database Operations

### Prepared Statements
```php
<?php
class DatabaseManager {
    private $pdo;
    
    public function __construct($dsn, $username, $password) {
        $this->pdo = new PDO($dsn, $username, $password);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    public function insertUser($userData) {
        $sql = "INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        
        $stmt->execute(array(
            $userData['name'],
            $userData['email'],
            date('Y-m-d H:i:s')
        ));
        
        return $this->pdo->lastInsertId();
    }
    
    public function getUserById($id) {
        $sql = "SELECT * FROM users WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(array($id));
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
```

---

*This guide was created on December 18, 2024, and covers essential PHP coding practices for email handling, search functionality, file operations, and security considerations.*
