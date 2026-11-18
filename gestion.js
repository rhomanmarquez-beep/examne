let categorias = JSON.parse(localStorage.getItem("MIS_CATEGORIAS")) || [
  { id: 'cat_1', nombre: 'General', color: '#0ea5e9' },
  { id: 'cat_2', nombre: 'Trabajo', color: '#6366f1' }
];

function guardarYSincronizarCategorias() {
  localStorage.setItem("MIS_CATEGORIAS", JSON.stringify(categorias));
  actualizarSelectCategorias();
  if (typeof renderizarTareas === 'function') {
    renderizarTareas();
  }
}

function guardarCategoria(id, nombre, color) {
  if (!nombre.trim()) return;
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
  if (!confirm("¿Desea eliminar esta categoría?")) return;
  categorias = categorias.filter(c => c.id !== id);
  guardarYSincronizarCategorias();
}

function actualizarSelectCategorias() {
  ['selectCategoria', 'selectCategoriaImportar'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const valorPrevio = select.value;
    select.innerHTML = '<option value="">-- Seleccione categoría --</option>';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
    if (valorPrevio) select.value = valorPrevio;
  });
}

document.addEventListener("DOMContentLoaded", actualizarSelectCategorias);