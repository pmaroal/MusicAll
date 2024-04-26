export class EventModel {
  constructor(date, event, idUser) {
    this.date = new Date().toLocaleString();
    this.event = event;
    this.idUser = idUser;
  }
}

// Add this line to export the class
export default EventModel;
