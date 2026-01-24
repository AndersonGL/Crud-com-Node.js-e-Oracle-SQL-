const API_URL = '/api/users';
let isEditing = false;

// DOM Elements
const userForm = document.getElementById('user-form');
const usersTableBody = document.querySelector('#users-table tbody');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const formTitle = document.getElementById('form-title');
const loadingDiv = document.getElementById('loading');
const emptyStateDiv = document.getElementById('empty-state');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    userForm.addEventListener('submit', handleFormSubmit);
    btnCancel.addEventListener('click', resetForm);
    document.getElementById('btn-refresh').addEventListener('click', loadUsers);
});

async function loadUsers() {
    showLoading(true);
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
            renderUsers(result.data);
        } else {
            console.error('Formato de resposta inválido:', result);
            showToast('Erro ao carregar dados', 'error');
        }
    } catch (error) {
        showToast('Erro ao carregar usuários', 'error');
        console.error(error);
    } finally {
        showLoading(false);
    }
}

function renderUsers(users) {
    usersTableBody.innerHTML = '';
    
    if (users.length === 0) {
        emptyStateDiv.classList.remove('hidden');
        return;
    }
    
    emptyStateDiv.classList.add('hidden');
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.ID || user.id}</td>
            <td>${user.NAME || user.name}</td>
            <td>${user.EMAIL || user.email}</td>
            <td>${user.AGE || user.age}</td>
            <td class="actions-cell">
                <button class="btn btn-sm btn-edit" onclick="startEdit(${user.ID || user.id})">Editar</button>
                <button class="btn btn-sm btn-delete" onclick="deleteUser(${user.ID || user.id})">Excluir</button>
            </td>
        `;
        usersTableBody.appendChild(tr);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        age: parseInt(document.getElementById('age').value)
    };
    
    try {
        if (isEditing) {
            const id = document.getElementById('user-id').value;
            await updateUser(id, userData);
        } else {
            await createUser(userData);
        }
        
        resetForm();
        loadUsers();
    } catch (error) {
        console.error(error);
    }
}

async function createUser(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar');
        }
        
        showToast('Usuário criado com sucesso!', 'success');
    } catch (error) {
        showToast(error.message || 'Erro ao criar usuário', 'error');
        throw error;
    }
}

async function updateUser(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar');
        }
        
        showToast('Usuário atualizado com sucesso!', 'success');
    } catch (error) {
        showToast(error.message || 'Erro ao atualizar usuário', 'error');
        throw error;
    }
}

async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erro ao excluir');
        
        showToast('Usuário excluído com sucesso!', 'success');
        loadUsers();
    } catch (error) {
        showToast('Erro ao excluir usuário', 'error');
    }
}

// Make functions globally available
window.startEdit = async function(id) {
    // In a real app we might fetch the specific user, 
    // but here we can find it in the table or fetch by ID
    try {
        const row = Array.from(usersTableBody.rows).find(r => r.cells[0].innerText == id);
        if (row) {
            document.getElementById('user-id').value = id;
            document.getElementById('name').value = row.cells[1].innerText;
            document.getElementById('email').value = row.cells[2].innerText;
            document.getElementById('age').value = row.cells[3].innerText;
            
            isEditing = true;
            formTitle.innerText = 'Editar Usuário';
            btnSave.innerText = 'Atualizar';
            btnCancel.style.display = 'block';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error(error);
    }
}

window.deleteUser = deleteUser;

function resetForm() {
    userForm.reset();
    isEditing = false;
    formTitle.innerText = 'Novo Usuário';
    btnSave.innerText = 'Salvar';
    btnCancel.style.display = 'none';
    document.getElementById('user-id').value = '';
}

function showLoading(show) {
    if (show) {
        loadingDiv.classList.remove('hidden');
        usersTableBody.classList.add('hidden');
    } else {
        loadingDiv.classList.add('hidden');
        usersTableBody.classList.remove('hidden');
    }
}

function showToast(message, type = 'success') {
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
}
