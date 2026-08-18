/* =========================================================
   VetConnect — script.js
   Navbar mobile, Alert, Modal, validación de formularios
   y CRUD simple (en memoria) para mascotas.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initAlerts();
    initModals();
    initContactForm();
    initAuthForms();
    initMascotas();
});

/* ---------- NAVBAR (hamburguesa) ---------- */
function initNavbar() {
    const burger = document.querySelector("[data-nav-burger]");
    const panel = document.querySelector("[data-nav-panel]");
    if (!burger || !panel) return;

    burger.addEventListener("click", () => {
        const isOpen = panel.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        burger.classList.toggle("is-active", isOpen);
    });
}

/* ---------- ALERT ---------- */
// Muestra un alert reutilizable. type: "success" | "error"
function showAlert(alertEl, { title, message, type = "success" }) {
    if (!alertEl) return;
    alertEl.classList.remove("alert-success", "alert-error");
    alertEl.classList.add(type === "error" ? "alert-error" : "alert-success");
    alertEl.querySelector(".alert__icon").textContent = type === "error" ? "⚠️" : "✅";
    alertEl.querySelector(".alert__title").textContent = title;
    alertEl.querySelector(".alert__text").textContent = message;
    alertEl.classList.add("is-visible");
    alertEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function initAlerts() {
    document.querySelectorAll(".alert__close").forEach((btn) => {
        btn.addEventListener("click", () => {
            btn.closest(".alert").classList.remove("is-visible");
        });
    });
}

/* ---------- MODAL ---------- */
function openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.add("is-open");
}

function closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.remove("is-open");
}

function initModals() {
    document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
        trigger.addEventListener("click", () => openModal(trigger.dataset.openModal));
    });

    document.querySelectorAll("[data-close-modal]").forEach((trigger) => {
        trigger.addEventListener("click", () => closeModal(trigger.dataset.closeModal));
    });

    // Cerrar al hacer click fuera del contenido
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.remove("is-open");
        });
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay.is-open").forEach((o) => o.classList.remove("is-open"));
        }
    });
}

/* ---------- Validación genérica de un campo ---------- */
function validateField(field, condition) {
    field.classList.toggle("has-error", !condition);
    return condition;
}

/* ---------- FORMULARIO DE CONTACTO ---------- */
function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const alertEl = document.querySelector("[data-contact-alert]");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = form.querySelector("#nombre");
        const correo = form.querySelector("#correo");
        const mensaje = form.querySelector("#mensaje");

        const okNombre = validateField(nombre.closest(".field"), nombre.value.trim().length >= 2);
        const okCorreo = validateField(correo.closest(".field"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()));
        const okMensaje = validateField(mensaje.closest(".field"), mensaje.value.trim().length >= 10);

        if (!okNombre || !okCorreo || !okMensaje) {
            showAlert(alertEl, {
                title: "Revisa el formulario",
                message: "Completa todos los campos correctamente antes de enviar.",
                type: "error",
            });
            return;
        }

        showAlert(alertEl, {
            title: "¡Mensaje enviado!",
            message: `Gracias ${nombre.value.trim()}, te responderemos a ${correo.value.trim()} muy pronto.`,
            type: "success",
        });

        form.reset();
    });
}

/* ---------- LOGIN / REGISTRO ---------- */
function initAuthForms() {
    // Mostrar / ocultar contraseña
    document.querySelectorAll(".password-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            btn.textContent = isPassword ? "Ocultar" : "Mostrar";
        });
    });

    const loginForm = document.querySelector("[data-login-form]");
    const loginAlert = document.querySelector("[data-login-alert]");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const correo = loginForm.querySelector("#login-correo");
            const clave = loginForm.querySelector("#login-clave");

            const okCorreo = validateField(correo.closest(".field"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()));
            const okClave = validateField(clave.closest(".field"), clave.value.trim().length >= 6);

            if (!okCorreo || !okClave) {
                showAlert(loginAlert, {
                    title: "No pudimos iniciar sesión",
                    message: "Verifica tu correo y que la contraseña tenga al menos 6 caracteres.",
                    type: "error",
                });
                return;
            }

            showAlert(loginAlert, {
                title: "¡Bienvenido de nuevo!",
                message: "Sesión iniciada correctamente. Redirigiendo a tu panel...",
                type: "success",
            });
        });
    }

    const registerForm = document.querySelector("[data-register-form]");
    const registerAlert = document.querySelector("[data-register-alert]");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = registerForm.querySelector("#reg-nombre");
            const correo = registerForm.querySelector("#reg-correo");
            const clave = registerForm.querySelector("#reg-clave");
            const claveConfirm = registerForm.querySelector("#reg-clave-confirm");

            const okNombre = validateField(nombre.closest(".field"), nombre.value.trim().length >= 2);
            const okCorreo = validateField(correo.closest(".field"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()));
            const okClave = validateField(clave.closest(".field"), clave.value.trim().length >= 6);
            const okConfirm = validateField(claveConfirm.closest(".field"), claveConfirm.value === clave.value && clave.value.trim().length >= 6);

            if (!okNombre || !okCorreo || !okClave || !okConfirm) {
                showAlert(registerAlert, {
                    title: "Revisa tus datos",
                    message: "Hay campos incompletos o las contraseñas no coinciden.",
                    type: "error",
                });
                return;
            }

            showAlert(registerAlert, {
                title: "¡Cuenta creada!",
                message: `Bienvenido ${nombre.value.trim()}, ya puedes iniciar sesión.`,
                type: "success",
            });

            registerForm.reset();
        });
    }
}

/* ---------- MASCOTAS (CRUD simple en memoria) ---------- */
function initMascotas() {
    const grid = document.querySelector("[data-pets-grid]");
    if (!grid) return;

    const emptyState = document.querySelector("[data-pets-empty]");
    const addForm = document.querySelector("[data-pet-form]");
    const deleteAlert = document.querySelector("[data-pets-alert]");

    let pets = [
        { id: 1, nombre: "Toby", especie: "Perro", raza: "Golden Retriever", edad: "3 años", icono: "🐶" },
        { id: 2, nombre: "Mishi", especie: "Gato", raza: "Común europeo", edad: "2 años", icono: "🐱" },
    ];
    let nextId = 3;
    let petToDelete = null;

    function render() {
        grid.innerHTML = "";

        if (pets.length === 0) {
            emptyState.style.display = "block";
            return;
        }
        emptyState.style.display = "none";

        pets.forEach((pet) => {
            const card = document.createElement("article");
            card.className = "pet-card";
            card.innerHTML = `
                <div class="pet-card__top">
                    <div class="pet-card__avatar">${pet.icono}</div>
                    <div>
                        <h3 class="pet-card__name">${pet.nombre}</h3>
                        <p class="pet-card__meta">${pet.raza} · ${pet.edad}</p>
                    </div>
                </div>
                <div class="pet-card__tags">
                    <span class="pet-tag">${pet.especie}</span>
                </div>
                <div class="pet-card__actions">
                    <button type="button" class="btn btn-outline" data-edit="${pet.id}">Editar</button>
                    <button type="button" class="btn btn-outline" data-delete="${pet.id}">Eliminar</button>
                </div>
            `;
            grid.appendChild(card);
        });

        grid.querySelectorAll("[data-delete]").forEach((btn) => {
            btn.addEventListener("click", () => {
                petToDelete = Number(btn.dataset.delete);
                openModal("modal-confirm-delete");
            });
        });

        grid.querySelectorAll("[data-edit]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const pet = pets.find((p) => p.id === Number(btn.dataset.edit));
                if (!pet) return;
                addForm.querySelector("#pet-id").value = pet.id;
                addForm.querySelector("#pet-nombre").value = pet.nombre;
                addForm.querySelector("#pet-especie").value = pet.especie;
                addForm.querySelector("#pet-raza").value = pet.raza;
                addForm.querySelector("#pet-edad").value = pet.edad;
                document.querySelector("#modal-pet-title").textContent = "Editar mascota";
                openModal("modal-pet");
            });
        });
    }

    // Botón "+ Agregar mascota" abre el modal en modo creación
    document.querySelectorAll("[data-open-modal='modal-pet']").forEach((btn) => {
        btn.addEventListener("click", () => {
            addForm.reset();
            addForm.querySelector("#pet-id").value = "";
            document.querySelector("#modal-pet-title").textContent = "Agregar mascota";
        });
    });

    if (addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = addForm.querySelector("#pet-id").value;
            const nombre = addForm.querySelector("#pet-nombre").value.trim();
            const especie = addForm.querySelector("#pet-especie").value;
            const raza = addForm.querySelector("#pet-raza").value.trim();
            const edad = addForm.querySelector("#pet-edad").value.trim();

            if (!nombre || !raza || !edad) return;

            const icono = especie === "Gato" ? "🐱" : especie === "Ave" ? "🐦" : especie === "Conejo" ? "🐰" : "🐶";

            if (id) {
                const pet = pets.find((p) => p.id === Number(id));
                if (pet) Object.assign(pet, { nombre, especie, raza, edad, icono });
            } else {
                pets.push({ id: nextId++, nombre, especie, raza, edad, icono });
            }

            render();
            closeModal("modal-pet");
        });
    }

    const confirmBtn = document.querySelector("[data-confirm-delete]");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            pets = pets.filter((p) => p.id !== petToDelete);
            closeModal("modal-confirm-delete");
            render();
            showAlert(deleteAlert, {
                title: "Mascota eliminada",
                message: "El registro se quitó de tu lista correctamente.",
                type: "success",
            });
        });
    }

    render();
}
