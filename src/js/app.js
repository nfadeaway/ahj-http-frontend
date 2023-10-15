import TicketManager from "./ticketManager";

const container = document.querySelector(".main-container");
const ticketManager = new TicketManager(container);

const tickets = document.querySelector(".tickets");
const addTicketBtn = document.querySelector(".add-ticket-btn");
const modalAddTicket = document.querySelector(".modal-add");
const modalEditTicket = document.querySelector(".modal-edit");
const modalDelTicket = document.querySelector(".modal-del");
window.addEventListener("load", () => ticketManager.renderTickets());

document.querySelectorAll(".cancel").forEach((cancelBtn) => {
  cancelBtn.addEventListener("click", () => {
    cancelBtn.closest(".modal").classList.remove("active");
    container.classList.remove("disabled");
  });
});

addTicketBtn.addEventListener("click", () => {
  modalAddTicket.classList.add("active");
  container.classList.add("disabled");
  modalAddTicket
    .querySelector(".modal-add__confirm-btn")
    .addEventListener("click", onClickConfirmAdd);
  function onClickConfirmAdd() {
    const ticketName = modalAddTicket.querySelector("#add-name").value;
    const ticketDescription =
      modalAddTicket.querySelector("#add-description").value;
    ticketManager.createTicket(ticketName, ticketDescription);
    modalAddTicket.classList.remove("active");
    modalAddTicket
      .querySelector(".modal-add__confirm-btn")
      .removeEventListener("click", onClickConfirmAdd);
    container.classList.remove("disabled");
  }
});

tickets.addEventListener("click", (e) => {
  let targetTicket;
  if (e.target.classList.contains("ticket__check-mark")) {
    targetTicket = e.target.closest(".ticket");
    ticketManager.toggleTicketStatus(e.target, targetTicket);
  }
  if (e.target.classList.contains("ticket__name")) {
    targetTicket = e.target.closest(".ticket");
    const ticketDescription = targetTicket.querySelector(
      ".ticket__description",
    );
    if (ticketDescription) {
      ticketDescription.remove();
    } else {
      ticketManager.renderTicketDescription(targetTicket);
    }
  }
  if (e.target.classList.contains("ticket__edit-btn")) {
    container.classList.add("disabled");
    targetTicket = e.target.closest(".ticket");
    modalEditTicket.classList.add("active");
    modalEditTicket.querySelector("#edit-name").innerHTML =
      targetTicket.querySelector(".ticket__name").innerHTML;
    ticketManager.getTicketDescription(targetTicket, modalEditTicket);
    modalEditTicket
      .querySelector(".modal-edit__confirm-btn")
      .addEventListener("click", onClickConfirmEdit);
    function onClickConfirmEdit() {
      const ticketName = modalEditTicket.querySelector("#edit-name").value;
      const ticketDescription =
        modalEditTicket.querySelector("#edit-description").value;
      ticketManager.updateTicket(targetTicket, ticketName, ticketDescription);
      modalEditTicket.classList.remove("active");
      modalEditTicket
        .querySelector(".modal-edit__confirm-btn")
        .removeEventListener("click", onClickConfirmEdit);
      container.classList.remove("disabled");
    }
  }
  if (e.target.classList.contains("ticket__delete-btn")) {
    container.classList.add("disabled");
    modalDelTicket.classList.add("active");
    modalDelTicket
      .querySelector(".modal-del__confirm-btn")
      .addEventListener("click", onClickConfirmDelete);
    function onClickConfirmDelete() {
      targetTicket = e.target.closest(".ticket");
      ticketManager.deleteTicket(targetTicket);
      modalDelTicket
        .querySelector(".modal-del__confirm-btn")
        .removeEventListener("click", onClickConfirmDelete);
      container.classList.remove("disabled");
    }
  }
});
