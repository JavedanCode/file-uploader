document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // DOM / MODALS
  // =====================================

  const modals = document.querySelectorAll(".modal");

  const getModal = (id) => {
    return document.getElementById(id);
  };

  const openModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.classList.remove("hidden");
  };

  const closeModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.classList.add("hidden");
  };

  const closeAllModals = () => {
    modals.forEach((modal) => {
      closeModal(modal);
    });
  };

  // =====================================
  // BUTTON LOADING
  // =====================================

  const setButtonLoading = (button, loading, text = null) => {
    if (!button) {
      return;
    }

    if (loading) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }

      button.disabled = true;

      button.textContent = text || "Please wait...";

      return;
    }

    button.disabled = false;

    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;

      delete button.dataset.originalText;
    }
  };

  // =====================================
  // FORM ERRORS
  // =====================================

  const clearFormErrors = (form) => {
    if (!form) {
      return;
    }

    form.querySelectorAll(".field-error").forEach((error) => {
      error.remove();
    });

    form.querySelectorAll(".has-error").forEach((field) => {
      field.classList.remove("has-error");
    });
  };

  const showFormError = (input, message) => {
    if (!input) {
      return;
    }

    const field = input.closest(".field") || input.parentElement;

    if (!field) {
      return;
    }

    input.classList.add("has-error");

    const error = document.createElement("p");

    error.className = "field-error";
    error.textContent = message;

    field.appendChild(error);
  };

  const showErrors = (form, errors) => {
    clearFormErrors(form);

    if (!Array.isArray(errors)) {
      return;
    }

    errors.forEach((error) => {
      if (error.path) {
        const input = form.querySelector(`[name="${CSS.escape(error.path)}"]`);

        if (input) {
          showFormError(input, error.msg || "Something went wrong.");

          return;
        }
      }

      let errorContainer = form.querySelector(".form-errors");

      if (!errorContainer) {
        errorContainer = document.createElement("div");

        errorContainer.className = "form-errors";

        form.prepend(errorContainer);
      }

      const message = document.createElement("p");

      message.className = "field-error";
      message.textContent = error.msg || "Something went wrong.";

      errorContainer.appendChild(message);
    });
  };

  // =====================================
  // RESPONSE
  // =====================================

  const getResponseData = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    return {
      success: response.ok,
      html: await response.text(),
    };
  };

  // =====================================
  // FORM SUBMISSION
  // =====================================

  const submitForm = async (form) => {
    const methodInput = form.querySelector('input[name="_method"]');

    const method = (
      methodInput?.value ||
      form.getAttribute("method") ||
      "POST"
    ).toUpperCase();

    const enctype = form.getAttribute("enctype") || "";

    let body;

    if (enctype.includes("multipart/form-data")) {
      body = new FormData(form);
    } else {
      body = new URLSearchParams(new FormData(form));
    }

    return fetch(form.action, {
      method,

      body,

      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
  };

  // =====================================
  // DASHBOARD NAVIGATION
  // =====================================
  const loadDashboard = async (url) => {
    const currentContent = document.querySelector(".dashboard-content");

    if (!currentContent) {
      return false;
    }

    currentContent.classList.add("is-loading");

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "text/html",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`Dashboard request failed: ${response.status}`);
      }

      const html = await response.text();

      const parser = new DOMParser();

      const parsedDocument = parser.parseFromString(html, "text/html");

      const newContent = parsedDocument.querySelector(".dashboard-content");

      if (!newContent) {
        throw new Error("Dashboard content was not found.");
      }

      currentContent.replaceWith(newContent);

      return true;
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      return false;
    } finally {
      const content = document.querySelector(".dashboard-content");

      if (content) {
        content.classList.remove("is-loading");
      }
    }
  };

  // =====================================
  // CURRENT FOLDER
  // =====================================

  const getCurrentFolderId = () => {
    const match = window.location.pathname.match(/^\/folder\/([^/]+)$/);

    return match ? match[1] : null;
  };

  const syncCurrentFolderInputs = () => {
    const folderId = getCurrentFolderId();

    const parentInput = document.querySelector(
      '#create-folder-modal input[name="parentId"]',
    );

    const folderInput = document.querySelector(
      '#upload-file-modal input[name="folderId"]',
    );

    if (parentInput) {
      parentInput.value = folderId || "";
    }

    if (folderInput) {
      folderInput.value = folderId || "";
    }
  };

  // =====================================
  // MODAL OPEN BUTTONS
  // =====================================

  const openButtons = {
    "create-folder-btn": "create-folder-modal",
    "upload-file-btn": "upload-file-modal",
    "share-folder-btn": "share-folder-modal",
  };
  document.addEventListener("click", (event) => {
    const button = event.target.closest(
      "#create-folder-btn, #upload-file-btn, #share-folder-btn",
    );

    if (!button) {
      return;
    }

    const modalId = openButtons[button.id];

    if (!modalId) {
      return;
    }

    const modal = document.getElementById(modalId);

    if (!modal) {
      return;
    }

    event.preventDefault();

    syncCurrentFolderInputs();

    if (button.id === "share-folder-btn") {
      const shareForm = document.getElementById("share-folder-form");

      const folderId = getCurrentFolderId();

      if (shareForm && folderId) {
        shareForm.action = `/folder/${folderId}/share`;
      }
    }

    modal.classList.remove("hidden");
  });
  // =====================================
  // CLOSE MODALS
  // =====================================

  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest(".close-modal");

    if (!closeButton) {
      return;
    }

    closeModal(closeButton.closest(".modal"));
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  // =====================================
  // ACTION DROPDOWNS
  // =====================================

  const closeAllDropdowns = () => {
    document.querySelectorAll(".actions-dropdown.open").forEach((menu) => {
      menu.classList.remove("open");
    });
  };

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".action-toggle");

    if (toggle) {
      event.stopPropagation();

      const dropdown = toggle.nextElementSibling;

      if (!dropdown) {
        return;
      }

      document.querySelectorAll(".actions-dropdown.open").forEach((menu) => {
        if (menu !== dropdown) {
          menu.classList.remove("open");
        }
      });

      dropdown.classList.toggle("open");

      return;
    }

    if (!event.target.closest(".actions-dropdown")) {
      closeAllDropdowns();
    }
  });

  // =====================================
  // DELETE
  // =====================================

  const deleteModal = getModal("delete-modal");

  const deleteTitle = document.getElementById("delete-title");

  const deleteName = document.getElementById("delete-name");

  const confirmDelete = document.getElementById("confirm-delete");

  let deleteTarget = null;

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-file-btn, .delete-folder-btn");

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const id = button.dataset.id;

    if (!id) {
      return;
    }

    const isFile = button.classList.contains("delete-file-btn");

    deleteTarget = {
      id,

      type: isFile ? "file" : "folder",

      url: isFile ? `/file/${id}` : `/folder/${id}`,

      name: button.dataset.name || "",
    };

    if (deleteTitle) {
      deleteTitle.textContent = isFile ? "Delete File" : "Delete Folder";
    }

    if (deleteName) {
      deleteName.textContent = deleteTarget.name;
    }

    clearFormErrors(deleteModal);

    closeAllDropdowns();

    openModal(deleteModal);
  });

  // =====================================
  // DELETE REQUEST
  // =====================================

  if (confirmDelete) {
    confirmDelete.addEventListener("click", async () => {
      if (!deleteTarget) {
        return;
      }

      setButtonLoading(confirmDelete, true, "Deleting...");

      try {
        const response = await fetch(deleteTarget.url, {
          method: "DELETE",

          headers: {
            Accept: "application/json",

            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const data = await getResponseData(response);

        if (!response.ok || data.success === false) {
          showErrors(
            deleteModal,
            data.errors || [
              {
                msg: data.error || "Unable to delete.",
              },
            ],
          );

          openModal(deleteModal);

          return;
        }

        closeModal(deleteModal);

        deleteTarget = null;

        if (data.redirect) {
          const loaded = await loadDashboard(data.redirect);

          if (loaded) {
            window.history.pushState({}, "", data.redirect);
          }
        }
      } catch (error) {
        console.error(error);

        openModal(deleteModal);
      } finally {
        setButtonLoading(confirmDelete, false);
      }
    });
  }

  // =====================================
  // RENAME FOLDER
  // =====================================

  const renameFolderModal = getModal("rename-folder-modal");

  const renameFolderForm = document.getElementById("rename-folder-form");

  const renameFolderInput = document.getElementById("rename-folder-input");

  const openRenameFolder = (button) => {
    if (!renameFolderModal || !renameFolderForm || !renameFolderInput) {
      return;
    }

    const id = button.dataset.id;

    if (!id) {
      return;
    }

    renameFolderInput.value = button.dataset.name || "";

    renameFolderForm.action = `/folder/${id}`;

    clearFormErrors(renameFolderForm);

    openModal(renameFolderModal);

    renameFolderInput.focus();
    renameFolderInput.select();
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".rename-folder-btn");

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    closeAllDropdowns();

    openRenameFolder(button);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("#rename-folder-btn");

    if (!button) {
      return;
    }

    if (!renameFolderModal || !renameFolderForm || !renameFolderInput) {
      return;
    }

    event.preventDefault();

    renameFolderInput.value = button.dataset.name || "";

    renameFolderForm.action = `/folder/${button.dataset.id}?_method=PATCH`;

    renameFolderModal.classList.remove("hidden");
  });

  // =====================================
  // RENAME FILE
  // =====================================

  const renameFileModal = getModal("rename-file-modal");

  const renameFileForm = document.getElementById("rename-file-form");

  const renameFileInput = document.getElementById("rename-file-input");

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".rename-file-btn");

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (!renameFileModal || !renameFileForm || !renameFileInput) {
      return;
    }

    const id = button.dataset.id;

    if (!id) {
      return;
    }

    renameFileInput.value = button.dataset.name || "";

    renameFileForm.action = `/file/${id}`;

    clearFormErrors(renameFileForm);

    closeAllDropdowns();

    openModal(renameFileModal);

    renameFileInput.focus();
    renameFileInput.select();
  });

  // =====================================
  // RENAME / CREATE / UPLOAD
  // =====================================

  const submitAjaxForm = async (form, modal, loadingText, successCallback) => {
    clearFormErrors(form);

    const submitButton = form.querySelector('button[type="submit"]');

    setButtonLoading(submitButton, true, loadingText);

    try {
      const response = await submitForm(form);

      const data = await getResponseData(response);

      if (!response.ok || data.success === false) {
        showErrors(
          form,
          data.errors || [
            {
              msg: data.error || "Unable to complete the action.",
            },
          ],
        );

        openModal(modal);

        return;
      }

      await successCallback(data);
    } catch (error) {
      console.error(error);

      openModal(modal);
    } finally {
      setButtonLoading(submitButton, false);
    }
  };

  // =====================================
  // RENAME FOLDER FORM
  // =====================================

  if (renameFolderForm) {
    renameFolderForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await submitAjaxForm(
        renameFolderForm,

        renameFolderModal,

        "Saving...",

        async (data) => {
          closeModal(renameFolderModal);

          if (data.redirect) {
            const loaded = await loadDashboard(data.redirect);

            if (loaded) {
              window.history.pushState({}, "", data.redirect);
            }
          }
        },
      );
    });
  }

  // =====================================
  // RENAME FILE FORM
  // =====================================

  if (renameFileForm) {
    renameFileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await submitAjaxForm(
        renameFileForm,

        renameFileModal,

        "Saving...",

        async (data) => {
          closeModal(renameFileModal);

          if (data.redirect) {
            const loaded = await loadDashboard(data.redirect);

            if (loaded) {
              window.history.pushState({}, "", data.redirect);
            }
          }
        },
      );
    });
  }

  // =====================================
  // CREATE FOLDER
  // =====================================

  const createFolderModal = getModal("create-folder-modal");

  const createFolderForm = createFolderModal
    ? createFolderModal.querySelector("form")
    : null;

  if (createFolderForm) {
    createFolderForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await submitAjaxForm(
        createFolderForm,

        createFolderModal,

        "Creating...",

        async (data) => {
          closeModal(createFolderModal);

          createFolderForm.reset();

          syncCurrentFolderInputs();

          if (data.redirect) {
            const loaded = await loadDashboard(data.redirect);

            if (loaded) {
              window.history.pushState({}, "", data.redirect);
            }
          }
        },
      );
    });
  }

  // =====================================
  // FILE UPLOAD
  // =====================================

  const uploadModal = getModal("upload-file-modal");

  const uploadForm = uploadModal ? uploadModal.querySelector("form") : null;

  if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await submitAjaxForm(
        uploadForm,

        uploadModal,

        "Uploading...",

        async (data) => {
          closeModal(uploadModal);

          uploadForm.reset();

          const folderId = getCurrentFolderId();

          const folderInput = uploadForm.querySelector(
            'input[name="folderId"]',
          );

          if (folderInput) {
            folderInput.value = folderId || "";
          }

          if (data.redirect) {
            const loaded = await loadDashboard(data.redirect);

            if (loaded) {
              window.history.pushState({}, "", data.redirect);
            }
          }
        },
      );
    });
  }

  // =====================================
  // SHARE
  // =====================================

  const shareModal = getModal("share-folder-modal");

  const shareForm = shareModal ? shareModal.querySelector("form") : null;

  if (shareForm) {
    shareForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await submitAjaxForm(
        shareForm,

        shareModal,

        "Generating...",

        async (data) => {
          displayShareResult(shareModal, data);
        },
      );
    });
  }

  // =====================================
  // SHARE RESULT
  // =====================================

  const displayShareResult = (modal, data) => {
    if (!modal || !data.shareUrl) {
      return;
    }

    let result = modal.querySelector(".share-result");

    if (!result) {
      result = document.createElement("div");

      result.className = "share-result";

      const content = modal.querySelector(".modal-content");

      if (content) {
        content.appendChild(result);
      } else {
        modal.appendChild(result);
      }
    }

    result.innerHTML = "";

    const label = document.createElement("p");

    label.textContent = "Your share link:";

    const wrapper = document.createElement("div");

    wrapper.className = "share-link-wrapper";

    const input = document.createElement("input");

    input.type = "text";
    input.readOnly = true;

    input.value = new URL(data.shareUrl, window.location.origin).href;

    const copyButton = document.createElement("button");

    copyButton.type = "button";
    copyButton.className = "btn";

    copyButton.textContent = "Copy";

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(input.value);
      } catch {
        input.select();

        document.execCommand("copy");
      }

      copyButton.textContent = "Copied!";

      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1500);
    });

    wrapper.appendChild(input);
    wrapper.appendChild(copyButton);

    result.appendChild(label);
    result.appendChild(wrapper);

    openModal(modal);
  };

  // =====================================
  // FOLDER NAVIGATION
  // =====================================

  document.addEventListener("click", async (event) => {
    const link = event.target.closest(
      'a[href^="/folder/"], .breadcrumbs a[href="/"]',
    );

    if (!link) {
      return;
    }

    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === "_blank"
    ) {
      return;
    }

    const url = link.getAttribute("href");

    if (!url) {
      return;
    }

    event.preventDefault();

    const loaded = await loadDashboard(url);

    if (loaded) {
      window.history.pushState({}, "", url);
    }
  });

  // =====================================
  // BROWSER BACK / FORWARD
  // =====================================

  window.addEventListener("popstate", () => {
    loadDashboard(window.location.pathname + window.location.search);
  });
});
