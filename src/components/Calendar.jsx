import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Modal from 'react-modal';
import '../css/calendar.css';
import { v4 as uuidv4 } from 'uuid'; // Importa una librería para generar identificadores únicos

Modal.setAppElement('#root'); // Configura el elemento raíz para el modal para mejorar la accesibilidad

function Calendar() {
    // Definición de estados para manejar los modales y los eventos
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar si el modal de creación/edición está abierto
    const [viewEventModalIsOpen, setViewEventModalIsOpen] = useState(false); // Estado para controlar si el modal de visualización está abierto
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false); // Estado para controlar si el modal de confirmación de eliminación está abierto
    const [events, setEvents] = useState([]); // Estado para almacenar los eventos del calendario
    const [eventTitle, setEventTitle] = useState(''); // Estado para el título del evento
    const [eventDescription, setEventDescription] = useState(''); // Estado para la descripción del evento
    const [eventDate, setEventDate] = useState(''); // Estado para la fecha del evento
    const [eventColor, setEventColor] = useState('green'); // Estado para el color del evento
    const [selectedEvent, setSelectedEvent] = useState(null); // Estado para almacenar el evento seleccionado

    // Maneja el clic en una fecha del calendario
    const handleDateClick = (arg) => {
        setEventDate(arg.dateStr); // Establece la fecha seleccionada
        openModal(); // Abre el modal de creación/edición
    };

    const openModal = () => {
        setModalIsOpen(true); // Abre el modal de creación/edición
    };

    const closeModal = () => {
        setModalIsOpen(false); // Cierra el modal de creación/edición
        resetEventForm(); // Resetea el formulario del evento
    };

    const openViewEventModal = () => {
        setViewEventModalIsOpen(true); // Abre el modal de visualización de evento
    };

    const closeViewEventModal = () => {
        setViewEventModalIsOpen(false); // Cierra el modal de visualización de evento
    };

    const openConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(true); // Abre el modal de confirmación de eliminación
    };

    const closeConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(false); // Cierra el modal de confirmación de eliminación
    };

    // Resetea los campos del formulario del evento
    const resetEventForm = () => {
        setSelectedEvent(null); // Deselecciona el evento
        setEventTitle(''); // Resetea el título del evento
        setEventDescription(''); // Resetea la descripción del evento
        setEventDate(''); // Resetea la fecha del evento
        setEventColor('green'); // Resetea el color del evento
    };

    // Maneja la acción de guardar el evento
    const handleSaveEvent = () => {
        if (selectedEvent) {
            // Edita un evento existente
            setEvents(events.map(event =>
                event.id === selectedEvent.id
                    ? { ...event, title: eventTitle, description: eventDescription, color: eventColor }
                    : event
            ));
        } else {
            // Crea un nuevo evento
            const newEvent = {
                id: uuidv4(), // Genera un identificador único para el nuevo evento
                title: eventTitle,
                start: eventDate,
                description: eventDescription,
                color: eventColor
            };
            setEvents([...events, newEvent]); // Añade el nuevo evento a la lista de eventos
        }
        closeModal(); // Cierra el modal de creación/edición
    };

    // Maneja el clic en un evento del calendario
    const handleEventClick = (info) => {
        const clickedEvent = events.find(event => event.id === info.event.id); // Busca el evento clickeado en la lista de eventos
        setSelectedEvent(clickedEvent); // Establece el evento seleccionado
        setEventTitle(clickedEvent.title); // Establece el título del evento
        setEventDescription(clickedEvent.description); // Establece la descripción del evento
        setEventDate(clickedEvent.start); // Establece la fecha del evento
        setEventColor(clickedEvent.color); // Establece el color del evento
        openViewEventModal(); // Abre el modal de visualización de evento
    };

    // Maneja la acción de eliminar un evento
    const handleDeleteEvent = () => {
        setEvents(events.filter(event => event.id !== selectedEvent.id)); // Elimina el evento seleccionado de la lista de eventos
        closeConfirmDeleteModal(); // Cierra el modal de confirmación de eliminación
        closeViewEventModal(); // Cierra el modal de visualización de evento
    };

    const handleEditEvent = () => {
        openModal(); // Abre el modal de creación/edición
        closeViewEventModal(); // Cierra el modal de visualización de evento
    };

    // Renderiza el contenido del evento en el calendario
    const eventContent = (eventInfo) => {
        return (
            <>
                <b style={{ color: eventInfo.event.textColor }}>{eventInfo.timeText}</b><br />
                {eventInfo.event.title}
            </>
        );
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Plugins que se usarán en el calendario
                initialView='dayGridMonth' // Vista inicial del calendario
                headerToolbar={{
                    start: 'prev,today,next', // Botones al inicio del toolbar
                    center: 'title', // Título centrado
                    end: 'dayGridMonth,timeGridWeek,timeGridDay' // Botones al final del toolbar
                }}
                height={'90vh'} // Altura del calendario
                dateClick={handleDateClick} // Evento que se ejecuta al hacer clic en una fecha
                events={events} // Eventos a mostrar en el calendario
                eventContent={eventContent} // Renderizador del contenido del evento
                eventClick={handleEventClick} // Evento que se ejecuta al hacer clic en un evento
            />

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="modal-creation-event"
                overlayClassName="overlay1"
            >
                <h2>{selectedEvent ? 'Editar Evento' : 'Crear Evento'}</h2>
                <label className='titulo'>Título del Evento:</label>
                <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                <label className='descripcion'>Descripción del Evento:</label>
                <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                <label className='color'>Color del Evento:</label>
                <select value={eventColor} onChange={(e) => setEventColor(e.target.value)}>
                    <option value="green">Verde</option>
                    <option value="blue">Azul</option>
                    <option value="red">Rojo</option>
                    <option value="yellow">Amarillo</option>
                </select>
                <p className='fecha'>Fecha seleccionada: {eventDate}</p>
                <div>
                    <button className='guardar' onClick={handleSaveEvent}>{selectedEvent ? 'Guardar Cambios' : 'Guardar Evento'}</button>
                    <button className='cancelar' onClick={closeModal}>Cancelar</button>
                </div>
            </Modal>

            <Modal
                isOpen={viewEventModalIsOpen}
                onRequestClose={closeViewEventModal}
                className="modal-view-event"
                overlayClassName="overlay1"
            >
                <h2>Detalles del Evento</h2>
                <p><strong>Título:</strong> {selectedEvent?.title}</p>
                <p><strong>Descripción:</strong> {selectedEvent?.description}</p>
                <p><strong>Fecha:</strong> {selectedEvent?.start}</p>
                <div className="button-container">
                    <button onClick={handleEditEvent}>Editar Evento</button>
                    <button onClick={openConfirmDeleteModal}>Eliminar Evento</button>
                    <button onClick={closeViewEventModal}>Cerrar</button>
                </div>
            </Modal>

            <Modal
                isOpen={confirmDeleteModalIsOpen}
                onRequestClose={closeConfirmDeleteModal}
                className="modal-confirm-delete"
                overlayClassName="overlay1"
            >
                <h2>Confirmar Eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar el evento "{selectedEvent?.title}"?</p>
                <div className="button-container">
                    <button onClick={handleDeleteEvent}>Sí</button>
                    <button onClick={closeConfirmDeleteModal}>Cancelar</button>
                </div>
            </Modal>
            </div>
    );
}

export default Calendar;
