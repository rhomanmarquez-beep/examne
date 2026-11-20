// gestion.js - Lógica completa para la gestión de categorías
let categorias = JSON.parse(localStorage.getItem("MIS_CATEGORIAS")) || [
  { id: 'cat_1', nombre: 'General', color: '#0ea5e9' },
  { id: 'cat_2', nombre: 'Trabajo', color: '#6366f1' }
];

function guardarYSincronizarCategorias() {
  localStorage.setItem("MIS_CATEGORIAS", JSON.stringify(categorias));
  actualizarSelectCategorias();
  renderizarListaCategoriasModal();
  if (typeof renderizarTareas === 'function') {
    renderizarTareas();
  }
}

function guardarCategoria(id, nombre, color) {
  if (!nombre || !nombre.trim()) return;
  if (id) {
    let cat = categorias.find(c => c.id === id);
    if (cat) {
      cat.nombre = nombre.trim();
      cat.color = color;
    }
  } else {
    categorias.push({
      id: 'cat_' + Date.now(),
      nombre: nombre.trim(),
      color: color || '#0ea5e9'
    });
  }
  guardarYSincronizarCategorias();
}

function eliminarCategoria(id) {
  if (!confirm("¿Desea eliminar esta categoría? Las tareas asociadas quedarán sin categoría.")) return;
  categorias = categorias.filter(c => c.id !== id);

  let tareas = JSON.parse(localStorage.getItem('MIS_TAREAS')) || [];
  tareas = tareas.map(t => {
    if (t.categoriaId === id) t.categoriaId = '';
    return t;
  });
  localStorage.setItem('MIS_TAREAS', JSON.stringify(tareas));

  guardarYSincronizarCategorias();
}

function actualizarSelectCategorias() {
  ['selectCategoria', 'selectCategoriaImportar', 'filtroCategoria'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const valorPrevio = select.value;
    
    if (id === 'filtroCategoria') {
      select.innerHTML = '<option value="todas">Todas las categorías</option><option value="sin_categoria">Sin categoría</option>';
    } else {
      select.innerHTML = '<option value="">-- Sin categoría --</option>';
    }

    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
    if (valorPrevio) select.value = valorPrevio;
  });
}

function renderizarListaCategoriasModal() {
  const contenedor = document.getElementById('listaCategoriasModal');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (categorias.length === 0) {
    contenedor.innerHTML = '<p style="text-align: center; color: #94a3b8; font-size: 13px;">No hay categorías creadas.</p>';
    return;
  }

  categorias.forEach(cat => {
    const div = document.createElement('div');
    div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #f1f5f9;';
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 14px; height: 14px; border-radius: 50%; background-color: ${cat.color}; display: inline-block;"></span>
        <span style="font-size: 14px; font-weight: 500; color: #1e293b;">${cat.nombre}</span>
      </div>
      <div style="display: flex; gap: 4px;">
        <button type="button" class="btn secundario" style="padding: 4px 8px; font-size: 12px;" onclick="preeditarCategoria('${cat.id}')">✏️</button>
        <button type="button" class="btn peligro" style="padding: 4px 8px; font-size: 12px;" onclick="eliminarCategoria('${cat.id}')">🗑️</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

window.preeditarCategoria = function(id) {
  const cat = categorias.find(c => c.id === id);
  if (!cat) return;
  document.getElementById('catId').value = cat.id;
  document.getElementById('catNombre').value = cat.nombre;
  document.getElementById('catColor').value = cat.color;
};


document.addEventListener("DOMContentLoaded", () => {
  actualizarSelectCategorias();

  const modalCategorias = document.getElementById('modalCategorias');
  const btnGestionarCategorias = document.getElementById('btnGestionarCategorias');
  const btnCerrarCategorias = document.getElementById('btnCerrarCategorias');
  const formCategoria = document.getElementById('formCategoria');

  if (btnGestionarCategorias) {
    btnGestionarCategorias.addEventListener('click', () => {
      renderizarListaCategoriasModal();
      formCategoria.reset();
      document.getElementById('catId').value = '';
      modalCategorias.classList.remove('oculto');
    });
  }

  if (btnCerrarCategorias) {
    btnCerrarCategorias.addEventListener('click', () => {
      modalCategorias.classList.add('oculto');
    });
  }

  if (formCategoria) {
    formCategoria.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('catId').value;
      const nombre = document.getElementById('catNombre').value;
      const color = document.getElementById('catColor').value;
      guardarCategoria(id, nombre, color);
      formCategoria.reset();
      document.getElementById('catId').value = '';
    });
  }
});