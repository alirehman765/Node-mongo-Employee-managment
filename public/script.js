// Global variables
let currentTab = 'employees';
let departments = [];
let employees = [];

// Fetch all data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchDepartments();
    fetchEmployees();
});

// Tab functionality
function showTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

// Modal functionality
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Close button functionality
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').style.display = 'none';
    });
});

// API calls
async function fetchDepartments() {
    try {
        const response = await fetch('/api/departments');
        departments = await response.json();
        updateDepartmentsList();
        updateDepartmentSelect();
    } catch (err) {
        console.error('Error fetching departments:', err);
    }
}

async function fetchEmployees() {
    try {
        const response = await fetch('/api/employees');
        employees = await response.json();
        updateEmployeesList();
    } catch (err) {
        console.error('Error fetching employees:', err);
    }
}

// Update UI
function updateDepartmentsList() {
    const list = document.getElementById('departments-list');
    list.innerHTML = departments.map(dept => `
        <div class="card">
            <div>
                <h3>${dept.name}</h3>
                <p>${dept.description || ''}</p>
            </div>
            <div class="card-actions">
                <button onclick="editDepartment('${dept._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteDepartment('${dept._id}')" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateEmployeesList() {
    const list = document.getElementById('employees-list');
    list.innerHTML = employees.map(emp => `
        <div class="card">
            <div>
                <h3>${emp.firstName} ${emp.lastName}</h3>
                <p>Email: ${emp.email}</p>
                <p>Department: ${emp.department.name}</p>
                <p>Role: ${emp.role}</p>
            </div>
            <div class="card-actions">
                <button onclick="editEmployee('${emp._id}')" class="edit-btn">Edit</button>
                <button onclick="deleteEmployee('${emp._id}')" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

function updateDepartmentSelect() {
    const select = document.getElementById('department');
    select.innerHTML = departments.map(dept =>
        `<option value="${dept._id}">${dept.name}</option>`
    ).join('');
}

// Form submissions (continued)
document.getElementById('department-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value
    };
    
    const deptId = document.getElementById('department-id').value;
    
    try {
        if (deptId) {
            // Update existing department
            await fetch(`/api/departments/${deptId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new department
            await fetch('/api/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        closeModal('department-modal');
        fetchDepartments();
        document.getElementById('department-form').reset();
        document.getElementById('department-id').value = '';
    } catch (err) {
        console.error('Error saving department:', err);
        alert('Error saving department');
    }
});

document.getElementById('employee-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value
    };
    
    const empId = document.getElementById('employee-id').value;
    
    try {
        if (empId) {
            // Update existing employee
            await fetch(`/api/employees/${empId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new employee
            await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }
        
        closeModal('employee-modal');
        fetchEmployees();
        document.getElementById('employee-form').reset();
        document.getElementById('employee-id').value = '';
    } catch (err) {
        console.error('Error saving employee:', err);
        alert('Error saving employee');
    }
});

// Edit functions
function editDepartment(id) {
    const department = departments.find(d => d._id === id);
    if (department) {
        document.getElementById('department-id').value = department._id;
        document.getElementById('name').value = department.name;
        document.getElementById('description').value = department.description || '';
        showModal('department-modal');
    }
}

function editEmployee(id) {
    const employee = employees.find(e => e._id === id);
    if (employee) {
        document.getElementById('employee-id').value = employee._id;
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department._id;
        document.getElementById('role').value = employee.role;
        showModal('employee-modal');
    }
}

// Delete functions
async function deleteDepartment(id) {
    if (confirm('Are you sure you want to delete this department?')) {
        try {
            await fetch(`/api/departments/${id}`, {
                method: 'DELETE'
            });
            fetchDepartments();
        } catch (err) {
            console.error('Error deleting department:', err);
            alert('Error deleting department');
        }
    }
}

async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            await fetch(`/api/employees/${id}`, {
                method: 'DELETE'
            });
            fetchEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
            alert('Error deleting employee');
        }
    }
}

// Error handling utility
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    alert(`An error occurred while ${context}. Please try again.`);
}

// Form reset utility
function resetForm(formId) {
    document.getElementById(formId).reset();
    if (formId === 'employee-form') {
        document.getElementById('employee-id').value = '';
    } else if (formId === 'department-form') {
        document.getElementById('department-id').value = '';
    }
}

// Add input validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add form validation before submission
function validateEmployeeForm() {
    const email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    return true;
}

// Add these event listeners for form validation
document.getElementById('employee-form').addEventListener('submit', (e) => {
    if (!validateEmployeeForm()) {
        e.preventDefault();
    }
});
