export default class TicketManager {
  constructor(container) {
    this.addTicketBtn = container.querySelector(".add-ticket-btn");
    this.ticketsContainer = container.querySelector(".tickets");
    this.baseURL = 'http://127.0.0.1:7071/'
  }

  renderTicket(ticketData) {
    const ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");
    ticketDiv.id = ticketData.id;
    const ticketMainDiv = document.createElement("div");
    ticketMainDiv.classList.add("ticket__main");
    const checkMarkDiv = document.createElement("div");
    checkMarkDiv.classList.add("ticket__check-mark");
    checkMarkDiv.innerText = ticketData.status ? "\u{1F5F8}" : "";
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("ticket__name");
    nameDiv.innerText = ticketData.name;
    const createdDiv = document.createElement("div");
    createdDiv.classList.add("ticket__created");
    createdDiv.innerText = ticketData.created;
    const editBtn = document.createElement("div");
    editBtn.classList.add("ticket__edit-btn");
    editBtn.innerText = "\u{270E}";
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("ticket__delete-btn");
    deleteBtn.innerText = "X";
    ticketDiv.appendChild(ticketMainDiv);
    ticketMainDiv.appendChild(checkMarkDiv);
    ticketMainDiv.appendChild(nameDiv);
    ticketMainDiv.appendChild(createdDiv);
    ticketMainDiv.appendChild(editBtn);
    ticketMainDiv.appendChild(deleteBtn);
    return ticketDiv;
  }

  async renderTickets() {
    let response = await fetch(this.baseURL + "?method=getAllTickets");
    if (response.status === 200) {
      let tickets = await response.json();
      for (const ticket of tickets) {
        this.ticketsContainer.appendChild(this.renderTicket(ticket));
      }
    } else {
      console.log("Ошибка");
    }
  }

  async toggleTicketStatus(checkMark, targetTicket) {
    let response = await fetch(
      this.baseURL + `?method=setStatusTicketById&id=${targetTicket.id}`,
      {
        method: "PATCH",
      },
    );
    if (response.status === 200) {
      let newTicketStatus = await response.text();
      newTicketStatus === "true"
        ? (checkMark.innerText = "\u{1F5F8}")
        : (checkMark.innerText = "");
    } else {
      console.log("Ошибка");
    }
  }

  async renderTicketDescription(targetTicket) {
    let response = await fetch(
      this.baseURL + `?method=getTicketById&id=${targetTicket.id}`,
    );
    if (response.status === 200) {
      let ticket = await response.json();
      const ticketDescriptionDiv = document.createElement("div");
      ticketDescriptionDiv.classList.add("ticket__description");
      ticketDescriptionDiv.innerText = ticket.description;
      targetTicket.appendChild(ticketDescriptionDiv);
    } else {
      console.log("Ошибка");
    }
  }

  async getTicketDescription(targetTicket, modal) {
    let response = await fetch(
      this.baseURL + `?method=getTicketById&id=${targetTicket.id}`,
    );
    if (response.status === 200) {
      let ticket = await response.json();
      modal.querySelector("#edit-description").innerText = ticket.description;
    } else {
      console.log("Ошибка");
    }
  }

  async createTicket(ticketName, ticketDescription) {
    let dateNow = new Date();
    dateNow = `${("0" + dateNow.getDate()).slice(-2)}.${(
      "0" + dateNow.getMonth()
    ).slice(-2)}.${dateNow.getFullYear()} ${("0" + dateNow.getHours()).slice(
      -2,
    )}:${("0" + dateNow.getMinutes()).slice(-2)}`;
    const ticketData = {
      name: ticketName,
      description: ticketDescription,
      created: dateNow,
    };
    let response = await fetch(this.baseURL + "?method=createTicket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(ticketData),
    });
    if (response.status === 201) {
      location.reload();
    } else {
      console.log("Ошибка");
    }
  }

  async updateTicket(targetTicket, ticketName, ticketDescription) {
    const ticketData = {
      name: ticketName,
      description: ticketDescription,
    };
    let response = await fetch(
      this.baseURL + `?method=updateTicketById&id=${targetTicket.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(ticketData),
      },
    );
    if (response.status === 200) {
      location.reload();
    } else {
      console.log("Ошибка");
    }
  }

  async deleteTicket(targetTicket) {
    let response = await fetch(
      this.baseURL + `?method=deleteTicketById&id=${targetTicket.id}`,
      {
        method: "DELETE",
      },
    );
    if (response.status === 204) {
      location.reload();
    } else if (response.status === 404) {
      console.log("Ошибка");
    }
  }
}
